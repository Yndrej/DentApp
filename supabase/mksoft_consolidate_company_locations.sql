-- Consolidate duplicate MKsoft-imported clients into:
--   1 company/client row per ICO
--   multiple operating locations in public.client_locations
--
-- Run public.client_locations_schema.sql first.
-- This script intentionally changes data. Review mksoft_company_locations_preview.sql before running.

begin;

with usage_counts as (
  select
    c.id,
    (select count(*) from public.devices d where d.client_id = c.id) as devices_count,
    (select count(*) from public.service_tasks s where s.client_id = c.id) as service_count,
    (select count(*) from public.document_packets p where p.client_id = c.id) as documents_count
  from public.clients c
),
ranked as (
  select
    c.*,
    regexp_replace(coalesce(c.billing_company_id, ''), '\D', '', 'g') as company_ico,
    row_number() over (
      partition by regexp_replace(coalesce(c.billing_company_id, ''), '\D', '', 'g')
      order by
        (coalesce(u.devices_count, 0) + coalesce(u.service_count, 0) + coalesce(u.documents_count, 0)) desc,
        case when c.source_system = 'MKsoft' then 1 else 0 end,
        c.created_at asc nulls last,
        c.name asc
    ) as keep_rank,
    count(*) over (partition by regexp_replace(coalesce(c.billing_company_id, ''), '\D', '', 'g')) as clients_in_company
  from public.clients c
  left join usage_counts u on u.id = c.id
  where regexp_replace(coalesce(c.billing_company_id, ''), '\D', '', 'g') <> ''
),
groups_to_merge as (
  select company_ico
  from ranked
  group by company_ico
  having count(*) > 1
),
keepers as (
  select r.*
  from ranked r
  join groups_to_merge g on g.company_ico = r.company_ico
  where r.keep_rank = 1
),
duplicates as (
  select
    r.*,
    k.id as keep_client_id,
    k.name as keep_name
  from ranked r
  join keepers k on k.company_ico = r.company_ico
  where r.keep_rank > 1
),
normalize_keeper as (
  update public.clients c
  set
    name = coalesce(nullif(c.billing_name, ''), c.name),
    note = trim(
      coalesce(c.note, '')
      || E'\n'
      || 'MKsoft konsolidacia: tento profil je hlavna firma. Prevadzky su ulozene v profile klienta.'
    )
  from keepers k
  where c.id = k.id
  returning c.id
),
upsert_keeper_location as (
  insert into public.client_locations (
    client_id,
    legacy_id,
    name,
    idzz,
    address_street,
    address_city,
    address_zip,
    address_floor,
    contact,
    email,
    phone,
    source_system,
    source_id,
    source_note,
    is_primary
  )
  select
    k.id,
    'client-main:' || k.id::text,
    coalesce(nullif(k.name, ''), nullif(k.billing_name, ''), 'Hlavna prevadzka'),
    k.provider_idzz,
    k.address_street,
    k.address_city,
    k.address_zip,
    k.address_floor,
    k.contact,
    k.email,
    k.phone,
    coalesce(nullif(k.source_system, ''), 'DentApp'),
    'client-main:' || k.id::text,
    'Hlavna prevadzka firmy po MKsoft konsolidacii.',
    true
  from keepers k
  on conflict (legacy_id) do update
  set
    name = excluded.name,
    idzz = coalesce(public.client_locations.idzz, excluded.idzz),
    address_street = coalesce(nullif(public.client_locations.address_street, ''), excluded.address_street),
    address_city = coalesce(nullif(public.client_locations.address_city, ''), excluded.address_city),
    address_zip = coalesce(nullif(public.client_locations.address_zip, ''), excluded.address_zip),
    address_floor = coalesce(nullif(public.client_locations.address_floor, ''), excluded.address_floor),
    is_primary = true
  returning id, legacy_id, client_id
),
duplicate_locations as (
  insert into public.client_locations (
    client_id,
    legacy_id,
    name,
    idzz,
    address_street,
    address_city,
    address_zip,
    address_floor,
    contact,
    email,
    phone,
    source_system,
    source_id,
    source_note,
    is_primary
  )
  select
    d.keep_client_id,
    'merged-client:' || d.id::text,
    coalesce(
      nullif(d.name, ''),
      nullif(d.address_city, ''),
      'Prevadzka'
    ),
    d.provider_idzz,
    d.address_street,
    d.address_city,
    d.address_zip,
    d.address_floor,
    d.contact,
    d.email,
    d.phone,
    coalesce(nullif(d.source_system, ''), 'MKsoft'),
    coalesce(nullif(d.source_id, ''), d.id::text),
    'Prevadzka vytvorena z duplicitneho klienta pri MKsoft konsolidacii.',
    false
  from duplicates d
  on conflict (legacy_id) do update
  set
    client_id = excluded.client_id,
    name = excluded.name,
    idzz = excluded.idzz,
    address_street = excluded.address_street,
    address_city = excluded.address_city,
    address_zip = excluded.address_zip,
    address_floor = excluded.address_floor,
    contact = excluded.contact,
    email = excluded.email,
    phone = excluded.phone,
    source_system = excluded.source_system,
    source_id = excluded.source_id,
    source_note = excluded.source_note
  returning id, legacy_id, client_id
),
duplicate_location_map as (
  select
    d.id as duplicate_client_id,
    d.keep_client_id,
    l.id as location_id
  from duplicates d
  join duplicate_locations l on l.legacy_id = 'merged-client:' || d.id::text
),
move_devices as (
  update public.devices dev
  set
    client_id = m.keep_client_id,
    location_id = m.location_id
  from duplicate_location_map m
  where dev.client_id = m.duplicate_client_id
  returning dev.id
),
move_service as (
  update public.service_tasks s
  set client_id = m.keep_client_id
  from duplicate_location_map m
  where s.client_id = m.duplicate_client_id
  returning s.id
),
move_documents as (
  update public.document_packets p
  set client_id = m.keep_client_id
  from duplicate_location_map m
  where p.client_id = m.duplicate_client_id
  returning p.id
),
move_registry_links as (
  update public.provider_registry pr
  set linked_client_id = m.keep_client_id
  from duplicate_location_map m
  where pr.linked_client_id = m.duplicate_client_id
  returning pr.id
),
merge_notes as (
  update public.clients keep
  set note = trim(
    coalesce(keep.note, '')
    || E'\n'
    || 'MKsoft konsolidacia: zlucene duplicitne profily podla ICO. Povodne profily su zapisane ako prevadzky.'
  )
  from keepers k
  where keep.id = k.id
  returning keep.id
),
delete_duplicates as (
  delete from public.clients c
  using duplicates d
  where c.id = d.id
  returning c.id
)
select
  (select count(*) from keepers) as kept_company_clients,
  (select count(*) from duplicate_locations) as created_or_updated_locations,
  (select count(*) from delete_duplicates) as deleted_duplicate_clients,
  (select count(*) from move_devices) as moved_devices,
  (select count(*) from move_service) as moved_service_tasks,
  (select count(*) from move_documents) as moved_document_packets,
  (select count(*) from move_registry_links) as moved_registry_links;

commit;
