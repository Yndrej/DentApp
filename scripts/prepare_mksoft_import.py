from __future__ import annotations

import argparse
import csv
import hashlib
import re
from collections import Counter
from pathlib import Path


def clean(value: str | None) -> str:
    return (value or "").strip()


def digits(value: str | None) -> str:
    return re.sub(r"\D+", "", value or "")


def base_ico(value: str | None) -> str:
    numbers = digits(value)
    return numbers[:8] if len(numbers) >= 8 else numbers


def sql_text(value: str | None) -> str:
    value = clean(value)
    if not value:
        return "null"
    return "'" + value.replace("'", "''") + "'"


def source_id(row: dict[str, str], index: int) -> str:
    raw_ico = clean(row.get("ico"))
    identity = "|".join(
        [
            raw_ico,
            clean(row.get("nazov1")),
            clean(row.get("nazov2")),
            clean(row.get("ulica")),
            clean(row.get("psc")),
            clean(row.get("obec")),
            clean(row.get("postulica")),
            clean(row.get("postpsc")),
            clean(row.get("postobec")),
        ]
    )
    suffix = hashlib.sha1(identity.encode("utf-8")).hexdigest()[:10]
    return f"{raw_ico or 'bez-ico'}:{index}:{suffix}"


def read_partners(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="cp1250", newline="") as handle:
        return list(csv.DictReader(handle, delimiter=";"))


def write_import_sql(rows: list[dict[str, str]], out_path: Path, batch: str) -> None:
    values = []
    for index, row in enumerate(rows, start=1):
        sid = source_id(row, index)
        values.append(
            "("
            + ", ".join(
                [
                    sql_text(batch),
                    sql_text(sid),
                    sql_text(row.get("ico")),
                    sql_text(base_ico(row.get("ico"))),
                    sql_text(row.get("dic")),
                    sql_text(row.get("icdph")),
                    sql_text(row.get("nazov1")),
                    sql_text(row.get("nazov2")),
                    sql_text(row.get("ulica")),
                    sql_text(row.get("psc")),
                    sql_text(row.get("obec")),
                    sql_text(row.get("postulica")),
                    sql_text(row.get("postulica2")),
                    sql_text(row.get("postpsc")),
                    sql_text(row.get("postobec")),
                ]
            )
            + ")"
        )

    out_path.write_text(
        "\n".join(
            [
                "-- Generated MKsoft client import for DentApp.",
                "-- Run supabase/mksoft_clients_schema.sql before this file.",
                "-- The merge keeps existing clients when source_id, IČO/name/address or exact billing_company_id/name matches.",
                "",
                "begin;",
                "",
                f"delete from public.mksoft_partner_import where import_batch = {sql_text(batch)};",
                "",
                "insert into public.mksoft_partner_import (",
                "  import_batch, source_id, ico_raw, ico_base, dic, icdph, name, contact_name,",
                "  billing_street, billing_zip, billing_city, operating_street, operating_street_2, operating_zip, operating_city",
                ") values",
                ",\n".join(values),
                "on conflict (import_batch, source_id) do update set",
                "  ico_raw = excluded.ico_raw,",
                "  ico_base = excluded.ico_base,",
                "  dic = excluded.dic,",
                "  icdph = excluded.icdph,",
                "  name = excluded.name,",
                "  contact_name = excluded.contact_name,",
                "  billing_street = excluded.billing_street,",
                "  billing_zip = excluded.billing_zip,",
                "  billing_city = excluded.billing_city,",
                "  operating_street = excluded.operating_street,",
                "  operating_street_2 = excluded.operating_street_2,",
                "  operating_zip = excluded.operating_zip,",
                "  operating_city = excluded.operating_city;",
                "",
                "with prepared as (",
                "  select",
                "    m.*,",
                "    nullif(trim(coalesce(m.operating_street, '') || ' ' || coalesce(m.operating_street_2, '')), '') as clinic_street,",
                "    coalesce(nullif(m.operating_zip, ''), m.billing_zip, '') as clinic_zip,",
                "    coalesce(nullif(m.operating_city, ''), m.billing_city, '') as clinic_city,",
                "    regexp_replace(lower(coalesce(m.name, '')), '[^a-z0-9áäčďéíĺľňóôŕšťúýž]+', '', 'g') as normalized_name",
                "  from public.mksoft_partner_import m",
                f"  where m.import_batch = {sql_text(batch)}",
                "), evuc_counts as (",
                "  select",
                "    p.*,",
                "    pr.id as registry_provider_id,",
                "    pr.idzz as provider_idzz,",
                "    count(pr.id) over (partition by p.source_id) as registry_match_count",
                "  from prepared p",
                "  left join public.provider_registry pr",
                "    on coalesce(nullif(pr.ico, ''), substring(coalesce(pr.idzz, pr.source_id) from '^[0-9]{2}-([0-9]{8})-[A-Za-z][0-9]{4}$')) = p.ico_base",
                "), one_row as (",
                "  select distinct on (source_id)",
                "    *,",
                "    case",
                "      when registry_match_count = 1 then 'Spárované podľa IČO'",
                "      when registry_match_count > 1 then 'Vyžaduje kontrolu e-VÚC prevádzky'",
                "      else 'Bez e-VÚC zhody'",
                "    end as match_state",
                "  from evuc_counts",
                "  order by source_id, registry_match_count asc, provider_idzz nulls last",
                "), matched as (",
                "  select",
                "    r.*,",
                "    c.id as client_id",
                "  from one_row r",
                "  left join lateral (",
                "    select c.id",
                "    from public.clients c",
                "    where",
                "      (c.source_system = 'MKsoft' and c.source_id = r.source_id)",
                "      or (nullif(c.billing_company_id, '') = r.ico_base and regexp_replace(lower(coalesce(c.name, '')), '[^a-z0-9áäčďéíĺľňóôŕšťúýž]+', '', 'g') = r.normalized_name)",
                "      or (regexp_replace(lower(coalesce(c.name, '')), '[^a-z0-9áäčďéíĺľňóôŕšťúýž]+', '', 'g') = r.normalized_name",
                "          and lower(coalesce(c.address_city, '')) = lower(coalesce(r.clinic_city, '')))",
                "    order by",
                "      case",
                "        when c.source_system = 'MKsoft' and c.source_id = r.source_id then 1",
                "        when nullif(c.billing_company_id, '') = r.ico_base then 2",
                "        else 3",
                "      end",
                "    limit 1",
                "  ) c on true",
                "), updated as (",
                "  update public.clients c",
                "  set",
                "    name = coalesce(nullif(m.name, ''), c.name),",
                "    contact = coalesce(nullif(m.contact_name, ''), c.contact),",
                "    address_street = coalesce(nullif(m.clinic_street, ''), c.address_street),",
                "    address_city = coalesce(nullif(m.clinic_city, ''), c.address_city),",
                "    address_zip = coalesce(nullif(m.clinic_zip, ''), c.address_zip),",
                "    billing_name = coalesce(nullif(m.name, ''), c.billing_name),",
                "    billing_street = coalesce(nullif(m.billing_street, ''), c.billing_street),",
                "    billing_city = coalesce(nullif(m.billing_city, ''), c.billing_city),",
                "    billing_zip = coalesce(nullif(m.billing_zip, ''), c.billing_zip),",
                "    billing_company_id = coalesce(nullif(m.ico_base, ''), c.billing_company_id),",
                "    billing_tax_id = coalesce(nullif(m.dic, ''), c.billing_tax_id),",
                "    segment = coalesce(nullif(c.segment, ''), 'MKsoft'),",
                "    source_system = 'MKsoft',",
                "    source_id = m.source_id,",
                "    source_row_id = m.import_batch,",
                "    external_ico_raw = m.ico_raw,",
                "    provider_idzz = case when m.registry_match_count = 1 then m.provider_idzz else c.provider_idzz end,",
                "    registry_provider_id = case when m.registry_match_count = 1 then m.registry_provider_id else c.registry_provider_id end,",
                "    registry_match_state = m.match_state,",
                "    note = trim(coalesce(c.note, '') || E'\\n' || 'MKsoft import: IČO ' || coalesce(m.ico_raw, '') || ', DIČ ' || coalesce(m.dic, '') || ', IČ DPH ' || coalesce(m.icdph, '') || '. e-VÚC: ' || m.match_state)",
                "  from matched m",
                "  where c.id = m.client_id",
                "  returning c.id",
                "), inserted as (",
                "  insert into public.clients (",
                "    legacy_id, name, status, segment, contact, email, phone,",
                "    address_street, address_city, address_zip, address_floor, address_note,",
                "    billing_name, billing_street, billing_city, billing_zip, billing_company_id, billing_tax_id,",
                "    portal_enabled, note, source_system, source_id, source_row_id, external_ico_raw, provider_idzz, registry_provider_id, registry_match_state",
                "  )",
                "  select",
                "    'mksoft:' || m.source_id,",
                "    coalesce(nullif(m.name, ''), 'MKsoft partner bez názvu'),",
                "    'Aktívna',",
                "    'MKsoft',",
                "    coalesce(m.contact_name, ''),",
                "    '',",
                "    '',",
                "    coalesce(m.clinic_street, ''),",
                "    coalesce(m.clinic_city, ''),",
                "    coalesce(m.clinic_zip, ''),",
                "    '',",
                "    'Import z MKsoftu. Fakturačný subjekt je hlavný zdroj klienta; e-VÚC slúži iba na párovanie prevádzky.',",
                "    coalesce(m.name, ''),",
                "    coalesce(m.billing_street, ''),",
                "    coalesce(m.billing_city, ''),",
                "    coalesce(m.billing_zip, ''),",
                "    coalesce(m.ico_base, ''),",
                "    coalesce(m.dic, ''),",
                "    true,",
                "    'MKsoft import: IČO ' || coalesce(m.ico_raw, '') || ', DIČ ' || coalesce(m.dic, '') || ', IČ DPH ' || coalesce(m.icdph, '') || '. e-VÚC: ' || m.match_state,",
                "    'MKsoft',",
                "    m.source_id,",
                "    m.import_batch,",
                "    m.ico_raw,",
                "    case when m.registry_match_count = 1 then m.provider_idzz else null end,",
                "    case when m.registry_match_count = 1 then m.registry_provider_id else null end,",
                "    m.match_state",
                "  from matched m",
                "  where m.client_id is null",
                "  on conflict (source_system, source_id) where source_system is not null and source_system <> '' and source_id is not null and source_id <> '' do update set",
                "    name = excluded.name,",
                "    contact = excluded.contact,",
                "    address_street = excluded.address_street,",
                "    address_city = excluded.address_city,",
                "    address_zip = excluded.address_zip,",
                "    billing_name = excluded.billing_name,",
                "    billing_street = excluded.billing_street,",
                "    billing_city = excluded.billing_city,",
                "    billing_zip = excluded.billing_zip,",
                "    billing_company_id = excluded.billing_company_id,",
                "    billing_tax_id = excluded.billing_tax_id,",
                "    source_row_id = excluded.source_row_id,",
                "    external_ico_raw = excluded.external_ico_raw,",
                "    provider_idzz = excluded.provider_idzz,",
                "    registry_provider_id = excluded.registry_provider_id,",
                "    registry_match_state = excluded.registry_match_state",
                "  returning id",
                ")",
                "select",
                "  (select count(*) from updated) as updated_existing_clients,",
                "  (select count(*) from inserted) as inserted_new_clients,",
                "  (select count(*) from one_row where match_state = 'Spárované podľa IČO') as evuc_exact_ico_matches,",
                "  (select count(*) from one_row where match_state = 'Vyžaduje kontrolu e-VÚC prevádzky') as evuc_ambiguous_matches,",
                "  (select count(*) from one_row where match_state = 'Bez e-VÚC zhody') as without_evuc_match;",
                "",
                "commit;",
                "",
            ]
        ),
        encoding="utf-8",
    )


def write_review_csv(rows: list[dict[str, str]], out_path: Path) -> None:
    fieldnames = [
        "source_id",
        "ico_raw",
        "ico_base",
        "name",
        "contact_name",
        "billing_address",
        "operating_address",
    ]
    with out_path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, delimiter=";")
        writer.writeheader()
        for index, row in enumerate(rows, start=1):
            writer.writerow(
                {
                    "source_id": source_id(row, index),
                    "ico_raw": clean(row.get("ico")),
                    "ico_base": base_ico(row.get("ico")),
                    "name": clean(row.get("nazov1")),
                    "contact_name": clean(row.get("nazov2")),
                    "billing_address": ", ".join(
                        item
                        for item in [clean(row.get("ulica")), clean(row.get("psc")), clean(row.get("obec"))]
                        if item
                    ),
                    "operating_address": ", ".join(
                        item
                        for item in [
                            clean(row.get("postulica")),
                            clean(row.get("postulica2")),
                            clean(row.get("postpsc")),
                            clean(row.get("postobec")),
                        ]
                        if item
                    ),
                }
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="Prepare MKsoft partner import SQL for DentApp.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--out-sql", required=True, type=Path)
    parser.add_argument("--review-csv", required=True, type=Path)
    parser.add_argument("--batch", default="mksoft-2026-08-18")
    args = parser.parse_args()

    rows = read_partners(args.input)
    args.out_sql.parent.mkdir(parents=True, exist_ok=True)
    args.review_csv.parent.mkdir(parents=True, exist_ok=True)
    write_import_sql(rows, args.out_sql, args.batch)
    write_review_csv(rows, args.review_csv)

    ico_counts = Counter(base_ico(row.get("ico")) for row in rows if base_ico(row.get("ico")))
    print(f"Rows: {len(rows)}")
    print(f"Unique base ICO: {len(ico_counts)}")
    print(f"Duplicate base ICO groups: {sum(1 for count in ico_counts.values() if count > 1)}")
    print(f"SQL: {args.out_sql}")
    print(f"Review CSV: {args.review_csv}")


if __name__ == "__main__":
    main()
