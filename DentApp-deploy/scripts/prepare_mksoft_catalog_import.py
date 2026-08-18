from __future__ import annotations

import argparse
import csv
import hashlib
from pathlib import Path


PREFIX_MANUFACTURERS = {
    "3M": "3M",
    "AD": "A-dec",
    "DU": "Dürr",
    "EK": "Ekom",
    "EM": "EMS",
    "NS": "NSK",
    "VA": "Vatech",
    "VT": "Vatech",
    "WH": "W&H",
}


def sql_string(value: str | None) -> str:
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def item_type(name: str) -> str:
    normalized = name.lower()
    if any(term in normalized for term in ["súprava", "suprava", "kreslo", "rtg", "pax", "green", "scan", "vista"]):
        return "Zariadenie"
    if any(term in normalized for term in ["filter", "ventil", "senzor", "motor", "hadica", "diel", "doska"]):
        return "Náhradný diel"
    if any(term in normalized for term in ["dezinf", "roztok", "balenie", "set", "kit"]):
        return "Spotrebný materiál"
    return "Katalóg MKsoft"


def manufacturer_from_code(code: str) -> str:
    prefix = code.strip().split(" ", 1)[0].upper()
    prefix = "".join(ch for ch in prefix if ch.isalnum())
    return PREFIX_MANUFACTURERS.get(prefix, "Iné")


def legacy_id(code: str, name: str) -> str:
    digest = hashlib.sha1(f"{code}|{name}".encode("utf-8")).hexdigest()[:10]
    safe_code = "".join(ch.lower() if ch.isalnum() else "-" for ch in code.strip()).strip("-")
    return f"mksoft-catalog:{safe_code}:{digest}"


def read_catalog(path: Path) -> list[dict[str, str]]:
    for encoding in ("utf-8-sig", "cp1250", "windows-1250"):
        try:
            with path.open("r", encoding=encoding, newline="") as handle:
                reader = csv.DictReader(handle, delimiter=";")
                rows = []
                for row in reader:
                    code = (row.get("kod") or "").strip()
                    name = (row.get("nazov") or "").strip()
                    if not code or not name:
                        continue
                    rows.append({"kod": code, "nazov": name})
                return rows
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("unknown", b"", 0, 1, "CSV is not UTF-8 or Windows-1250")


def row_sql(row: dict[str, str]) -> str:
    code = row["kod"]
    name = row["nazov"]
    manufacturer = manufacturer_from_code(code)
    kind = item_type(name)
    note = "Orientacna katalogova polozka z MKsoft cennika. Realny skladovy stav sa spravuje v MKsofte."
    values = [
        legacy_id(code, name),
        name,
        manufacturer,
        kind,
        code,
        kind,
        "0",
        "0",
        "0",
        "MKsoft",
        "",
        note,
    ]
    return "(" + ", ".join(sql_string(value) if index < 6 or index > 8 else value for index, value in enumerate(values)) + ")"


def write_chunk(path: Path, rows: list[dict[str, str]], chunk_index: int) -> None:
    values = ",\n".join(row_sql(row) for row in rows)
    sql = f"""-- MKsoft catalog import chunk {chunk_index:03d}.
-- Generated from CSV with columns: kod;nazov.

insert into public.inventory (
  legacy_id,
  name,
  manufacturer,
  item_type,
  sku,
  category,
  qty,
  min_qty,
  reserved,
  location,
  compatibility,
  note
)
values
{values}
on conflict (legacy_id) do update
set
  name = excluded.name,
  manufacturer = excluded.manufacturer,
  item_type = excluded.item_type,
  sku = excluded.sku,
  category = excluded.category,
  location = excluded.location,
  note = excluded.note;
"""
    path.write_text(sql, encoding="utf-8")


def write_summary(path: Path, rows: list[dict[str, str]]) -> None:
    by_manufacturer: dict[str, int] = {}
    by_type: dict[str, int] = {}
    duplicated_codes: dict[str, int] = {}
    for row in rows:
      by_manufacturer[manufacturer_from_code(row["kod"])] = by_manufacturer.get(manufacturer_from_code(row["kod"]), 0) + 1
      by_type[item_type(row["nazov"])] = by_type.get(item_type(row["nazov"]), 0) + 1
      duplicated_codes[row["kod"]] = duplicated_codes.get(row["kod"], 0) + 1
    duplicates = {code: count for code, count in duplicated_codes.items() if count > 1}
    lines = [
        f"rows: {len(rows)}",
        f"unique_codes: {len(duplicated_codes)}",
        f"duplicate_codes: {len(duplicates)}",
        "",
        "manufacturers:",
        *[f"- {name}: {count}" for name, count in sorted(by_manufacturer.items())],
        "",
        "item_types:",
        *[f"- {name}: {count}" for name, count in sorted(by_type.items())],
        "",
        "sample_duplicate_codes:",
        *[f"- {code}: {count}" for code, count in list(sorted(duplicates.items()))[:30]],
    ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare MKsoft catalog CSV import for DentApp inventory.")
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--out", type=Path, default=Path("reports/mksoft_catalog_import_chunks"))
    parser.add_argument("--chunk-size", type=int, default=200)
    args = parser.parse_args()

    rows = read_catalog(args.csv_path)
    args.out.mkdir(parents=True, exist_ok=True)
    for old_file in args.out.glob("*.sql"):
        old_file.unlink()
    for index in range(0, len(rows), args.chunk_size):
        chunk_rows = rows[index:index + args.chunk_size]
        write_chunk(args.out / f"{index // args.chunk_size + 1:03d}_load_mksoft_catalog.sql", chunk_rows, index // args.chunk_size + 1)
    write_summary(args.out / "summary.txt", rows)
    print(f"Prepared {len(rows)} catalog rows into {args.out}")


if __name__ == "__main__":
    main()
