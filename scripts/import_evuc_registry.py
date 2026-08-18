#!/usr/bin/env python3
"""
Build a DentApp provider_registry import from public e-VUC pages.

The script crawls e-VUC region pages, follows district links, walks pagination,
keeps dental healthcare facilities, opens detail pages, and writes CSV plus a
Supabase SQL upsert file.
"""

from __future__ import annotations

import argparse
import csv
import html
import re
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError


HOME_URL = "https://www.e-vuc.sk/"
DENTAL_KEYWORDS = (
    "zubn",
    "stomatolog",
    "dent",
    "dentoalveol",
    "implantolog",
)


@dataclass
class Token:
    kind: str
    text: str
    href: str = ""


class TokenParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.tokens: list[Token] = []
        self._href: str | None = None
        self._link_text: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "a":
            href = dict(attrs).get("href") or ""
            self._href = href
            self._link_text = []

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "a" and self._href is not None:
            text = clean_text(" ".join(self._link_text))
            if text:
                self.tokens.append(Token("link", text, self._href))
            self._href = None
            self._link_text = []

    def handle_data(self, data: str) -> None:
        if self._href is not None:
            self._link_text.append(data)
            return
        text = clean_text(data)
        if text:
            self.tokens.append(Token("text", text))


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def fetch(url: str, delay: float, retries: int = 4) -> str:
    wait = delay
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "DentApp registry import contact: dentall.sk",
            "Accept": "text/html,application/xhtml+xml",
        },
    )
    for attempt in range(retries + 1):
        time.sleep(wait)
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                charset = response.headers.get_content_charset() or "utf-8"
                return response.read().decode(charset, errors="replace")
        except HTTPError as error:
            if error.code != 429 or attempt >= retries:
                raise
            retry_after = error.headers.get("Retry-After")
            wait = max(float(retry_after or 0), wait * 2, 5.0)
            print(f"HTTP 429 from e-VUC, waiting {wait:.1f}s before retry: {url}")
    raise RuntimeError(f"Unable to fetch {url}")


def tokens_for(url: str, delay: float) -> list[Token]:
    parser = TokenParser()
    parser.feed(fetch(url, delay))
    return parser.tokens


def absolute_url(base_url: str, href: str) -> str:
    return urllib.parse.urljoin(base_url, href)


def token_text(tokens: list[Token]) -> str:
    return clean_text(" ".join(token.text for token in tokens if token.text))


def find_region_pages(delay: float) -> list[tuple[str, str]]:
    tokens = tokens_for(HOME_URL, delay)
    pages: list[tuple[str, str]] = []
    seen: set[str] = set()
    for index, token in enumerate(tokens):
        if token.kind != "link" or "ambulantne-zdravotnicke-zariadenia.html" not in token.href:
            continue
        url = absolute_url(HOME_URL, token.href)
        if url in seen:
            continue
        pages.append((nearest_region_name(tokens, index), url))
        seen.add(url)
    return pages


def nearest_region_name(tokens: list[Token], index: int) -> str:
    for previous in reversed(tokens[max(0, index - 8):index]):
        lower = previous.text.lower()
        if "samosprávny kraj" in lower or "samospravny kraj" in lower:
            return previous.text
        if previous.text.endswith("kraj"):
            return previous.text
    return "e-VUC"


def find_district_pages(region_url: str, delay: float) -> list[tuple[str, str]]:
    tokens = tokens_for(region_url, delay)
    districts: list[tuple[str, str]] = []
    seen: set[str] = set()
    for token in tokens:
        if token.kind != "link" or not token.text.startswith("Okres "):
            continue
        url = absolute_url(region_url, token.href)
        if url in seen:
            continue
        districts.append((re.sub(r"\s+\(\d+\)$", "", token.text), url))
        seen.add(url)
    return districts


def paginated_urls(base_url: str, first_tokens: list[Token]) -> list[str]:
    urls = [base_url]
    seen = {base_url}
    base = urllib.parse.urlparse(base_url)
    for token in first_tokens:
        if token.kind != "link" or "page=" not in token.href:
            continue
        url = absolute_url(base_url, token.href)
        parsed = urllib.parse.urlparse(url)
        if parsed.netloc != base.netloc or parsed.path != base.path:
            continue
        if url not in seen:
            urls.append(url)
            seen.add(url)
    return urls


def is_dental_text(value: str) -> bool:
    normalized = value.lower()
    return any(keyword in normalized for keyword in DENTAL_KEYWORDS)


def parse_provider_name(link_text: str) -> tuple[str, str]:
    match = re.search(r"\(([^()]*)\)\s*$", link_text)
    provider_name = clean_text(match.group(1)) if match else ""
    name = clean_text(link_text[:match.start()] if match else link_text)
    return name.rstrip(" ,"), provider_name


def clean_facility_title(value: str) -> str:
    value = re.sub(r",\s*[^,]+,\s*Ambulantné zdravotnícke zariadenia.*$", "", value or "")
    return clean_text(value)


def parse_specialty_and_idzz(context: str) -> tuple[str, str]:
    specialty = ""
    idzz = ""
    specialty_match = re.search(r"\(([^()]*)\)\s+\d{2}-\d{8}-[A-Z]\d{4}\b", context)
    if specialty_match:
        specialty = clean_text(specialty_match.group(1))
    idzz_match = re.search(r"\b\d{2}-\d{8}-[A-Z]\d{4}\b", context)
    if idzz_match:
        idzz = idzz_match.group(0)
    return specialty, idzz


def ico_from_idzz(idzz: str) -> str:
    match = re.search(r"\b\d{2}-(\d{8})-[A-Z]\d{4}\b", idzz or "", re.IGNORECASE)
    return match.group(1) if match else ""


def parse_address(context: str, idzz: str = "") -> tuple[str, str, str]:
    address_part = context.split(idzz, 1)[1] if idzz and idzz in context else context
    address_part = re.split(r"\b(?:dnes|Zariadenie|0:00|[0-2]?\d:\d{2})\b", address_part, maxsplit=1)[0]
    address_part = clean_text(address_part.strip(" |,"))
    address_part = re.sub(r"^Neprítomnosti:\s*od\s+\d{2}\.\d{2}\.\d{4}\s+do\s+\d{2}\.\d{2}\.\d{4}\s+", "", address_part, flags=re.IGNORECASE)
    address_part = re.sub(r"^objednávanie\s+", "", address_part, flags=re.IGNORECASE)
    zip_match = re.search(r"\b(\d{3}\s?\d{2})\s+(.+)$", address_part)
    if not zip_match:
        return address_part, "", ""
    street = clean_text(address_part[:zip_match.start()].strip(" ,"))
    zip_code = zip_match.group(1).replace(" ", "")
    city = clean_text(zip_match.group(2).strip(" ,"))
    return street, zip_code, city


def value_after_label(tokens: list[Token], label: str, stop_labels: tuple[str, ...], max_tokens: int = 30) -> str:
    label_lower = label.lower()
    parts: list[str] = []
    collecting = False
    for token in tokens:
        text = token.text
        lower = text.lower()
        if not collecting:
            if lower.startswith(label_lower):
                rest = clean_text(text[len(label):].strip(" :"))
                if rest:
                    parts.append(rest)
                collecting = True
            continue
        if any(lower.startswith(stop.lower()) for stop in stop_labels):
            break
        if len(parts) >= max_tokens:
            break
        if text:
            parts.append(text)
    return clean_text(" ".join(parts))


def normalize_phone_for_import(value: str) -> str:
    match = re.search(r"(\+?\d[\d\s/()-]{6,}\d)", value or "")
    if not match:
        return ""
    return re.sub(r"[\s/()-]+", "", match.group(1))


def email_from_text(value: str) -> str:
    match = re.search(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", value or "")
    return match.group(0) if match else ""


def parse_detail_record(
    region: str,
    district: str,
    detail_url: str,
    fallback_name: str,
    fallback_provider_name: str,
    delay: float,
) -> dict[str, str] | None:
    tokens = tokens_for(detail_url, delay)
    full_text = token_text(tokens)
    idzz_match = re.search(r"\b\d{2}-\d{8}-[A-Z]\d{4}\b", full_text)
    if not idzz_match:
        return None
    idzz = idzz_match.group(0)

    title = fallback_name
    for token in tokens:
        if is_dental_text(token.text) and idzz not in token.text and "»" not in token.text:
            title = token.text
            break
    name, provider_from_title = parse_provider_name(clean_facility_title(title))
    provider_name = provider_from_title or fallback_provider_name
    specialty = value_after_label(tokens, "Odborné zameranie:", ("Lekári, sestry:", "Miesto prevádzkovania:", "Poisťovne:")) or "Zubné lekárstvo"
    staff = value_after_label(tokens, "Lekári, sestry:", ("Miesto prevádzkovania:",))
    address = value_after_label(tokens, "Miesto prevádzkovania:", ("Poisťovne:", "Poskytovateľ:"))
    insurance = value_after_label(tokens, "Poisťovne:", ("Poskytovateľ:", "Mobil:", "Telefón:", "Email:", "E-mail:", "Ordinačné hodiny"))
    provider_line = value_after_label(tokens, "Poskytovateľ:", ("Mobil:", "Telefón:", "Email:", "E-mail:", "Ordinačné hodiny"))
    if provider_line:
        provider_name = re.sub(r"\s*IČO:\s*\d+.*$", "", provider_line).strip() or provider_name
    ico_match = re.search(r"\bIČO:\s*(\d{8})\b", full_text)
    phone = value_after_label(tokens, "Mobil:", ("Email:", "E-mail:", "Ordinačné hodiny", "KPZS:", "Doktor :"))
    if not phone:
        phone = value_after_label(tokens, "Telefón:", ("Email:", "E-mail:", "Ordinačné hodiny", "KPZS:", "Doktor :"))
    email = value_after_label(tokens, "Email:", ("Ordinačné hodiny", "KPZS:", "Doktor :", "Cenník"))
    if not email:
        email = value_after_label(tokens, "E-mail:", ("Ordinačné hodiny", "KPZS:", "Doktor :", "Cenník"))
    street, zip_code, city = parse_address(address)
    return {
        "source_id": idzz,
        "idzz": idzz,
        "ico": ico_match.group(1) if ico_match else ico_from_idzz(idzz),
        "name": name,
        "provider_name": provider_name,
        "specialty": specialty,
        "address_street": street,
        "address_city": city,
        "address_zip": zip_code,
        "district": district,
        "region": region,
        "email": email_from_text(email),
        "phone": normalize_phone_for_import(phone),
        "insurance": insurance,
        "staff": staff,
        "source_url": detail_url,
        "source": "e-VUC",
        "registry_state": "Novy",
    }


def provider_records(region: str, district: str, district_url: str, delay: float, include_details: bool) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    first_tokens = tokens_for(district_url, delay)
    for page_url in paginated_urls(district_url, first_tokens):
        tokens = first_tokens if page_url == district_url else tokens_for(page_url, delay)
        for index, token in enumerate(tokens):
            if token.kind != "link" or token.text.lower().startswith("image"):
                continue
            if not is_dental_text(token.text):
                continue
            context_parts: list[str] = []
            for next_token in tokens[index + 1:index + 8]:
                if next_token.kind == "link" and not next_token.text.lower().startswith("image"):
                    break
                context_parts.append(next_token.text)
            context = clean_text(" ".join(context_parts))
            name, provider_name = parse_provider_name(token.text)
            specialty, idzz = parse_specialty_and_idzz(context)
            if not (is_dental_text(name) or is_dental_text(specialty)):
                continue
            detail_url = absolute_url(page_url, token.href)
            if include_details and "generate_page.php" in detail_url:
                detail = parse_detail_record(region, district, detail_url, name, provider_name, delay)
                if detail:
                    records.append(detail)
                    continue
            street, zip_code, city = parse_address(context, idzz)
            source_id = idzz or urllib.parse.urlparse(detail_url).path.strip("/").replace("/", "-")
            records.append({
                "source_id": source_id,
                "idzz": idzz,
                "ico": ico_from_idzz(idzz),
                "name": name,
                "provider_name": provider_name,
                "specialty": specialty or "Zubné lekárstvo",
                "address_street": street,
                "address_city": city,
                "address_zip": zip_code,
                "district": district,
                "region": region,
                "email": "",
                "phone": "",
                "insurance": "",
                "staff": "",
                "source_url": detail_url,
                "source": "e-VUC",
                "registry_state": "Novy",
            })
    return records


def sql_value(value: str) -> str:
    if value == "":
        return "null"
    return "'" + value.replace("'", "''") + "'"


def write_sql(path: Path, rows: list[dict[str, str]], columns: list[str]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as file:
        file.write("-- Generated by scripts/import_evuc_registry.py\n")
        file.write("insert into public.provider_registry (\n  ")
        file.write(", ".join(columns))
        file.write("\n) values\n")
        values = []
        for row in rows:
            values.append("  (" + ", ".join(sql_value(row.get(column, "")) for column in columns) + ")")
        file.write(",\n".join(values))
        file.write("\non conflict (source_id) do update set\n")
        updates = [f"  {column} = excluded.{column}" for column in columns if column != "source_id"]
        updates.append("  updated_at = now()")
        file.write(",\n".join(updates))
        file.write(";\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="supabase/provider_registry_import.csv", help="CSV output path")
    parser.add_argument("--sql-out", default="supabase/provider_registry_import.sql", help="SQL output path")
    parser.add_argument("--delay", type=float, default=0.4, help="Delay between e-VUC requests")
    parser.add_argument("--start-district", type=int, default=0, help="Zero-based district offset for chunked imports")
    parser.add_argument("--limit-districts", type=int, default=0, help="Optional crawl limit for testing")
    parser.add_argument("--no-details", action="store_true", help="Skip detail pages and use district list pages only")
    parser.add_argument("--detail-url", default="", help="Parse one e-VUC detail URL for diagnostics")
    args = parser.parse_args()

    rows: list[dict[str, str]] = []
    columns = [
        "source_id", "idzz", "ico", "name", "provider_name", "specialty",
        "address_street", "address_city", "address_zip", "district", "region",
        "email", "phone", "insurance", "staff", "source_url", "source", "registry_state",
    ]
    if args.detail_url:
        row = parse_detail_record("e-VUC", "Detail test", args.detail_url, "", "", args.delay)
        rows = [row] if row else []
        out_path = Path(args.out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with out_path.open("w", encoding="utf-8-sig", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=columns, delimiter=";")
            writer.writeheader()
            writer.writerows(rows)
        write_sql(Path(args.sql_out), rows, columns)
        print(f"Detail records: {len(rows)}")
        print(f"CSV: {out_path}")
        print(f"SQL: {args.sql_out}")
        return

    district_count = 0
    processed_count = 0
    for region, region_url in find_region_pages(args.delay):
        for district, district_url in find_district_pages(region_url, args.delay):
            if district_count < args.start_district:
                district_count += 1
                continue
            if args.limit_districts and processed_count >= args.limit_districts:
                break
            district_count += 1
            processed_count += 1
            print(f"{district_count}: {district}")
            rows.extend(provider_records(region, district, district_url, args.delay, not args.no_details))
        if args.limit_districts and processed_count >= args.limit_districts:
            break

    rows = list({row["source_id"]: row for row in rows if row["source_id"]}.values())
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=columns, delimiter=";")
        writer.writeheader()
        writer.writerows(rows)
    write_sql(Path(args.sql_out), rows, columns)
    print(f"Districts crawled: {processed_count}")
    print(f"Dental records: {len(rows)}")
    print(f"CSV: {out_path}")
    print(f"SQL: {args.sql_out}")


if __name__ == "__main__":
    main()
