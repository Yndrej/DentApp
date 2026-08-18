-- Template for merging ONE duplicate client into another.
-- Review IDs first using mksoft_find_client_by_name_or_ico.sql.
-- Replace the two UUIDs below, then run the whole script.
--
-- keep_client_id   = client profile that should stay
-- remove_client_id = duplicate profile that should disappear

begin;

with params as (
  select
    '00000000-0000-0000-0000-000000000000'::uuid as keep_client_id,
    '11111111-1111-1111-1111-111111111111'::uuid as remove_client_id
),
guard as (
  select
    keep_client_id,
    remove_client_id
  from params
  where keep_client_id <> remove_client_id
),
move_devices as (
  update public.devices d
  set client_id = g.keep_client_id
  from guard g
  where d.client_id = g.remove_client_id
  returning d.id
),
move_service as (
  update public.service_tasks s
  set client_id = g.keep_client_id
  from guard g
  where s.client_id = g.remove_client_id
  returning s.id
),
move_documents as (
  update public.document_packets p
  set client_id = g.keep_client_id
  from guard g
  where p.client_id = g.remove_client_id
  returning p.id
),
move_registry_link as (
  update public.provider_registry pr
  set linked_client_id = g.keep_client_id
  from guard g
  where pr.linked_client_id = g.remove_client_id
  returning pr.id
),
merge_note as (
  update public.clients keep
  set note = trim(
    coalesce(keep.note, '')
    || E'\n'
    || 'Zlúčené s duplicitným klientom: '
    || coalesce(remove.name, '')
    || ' / '
    || coalesce(remove.billing_company_id, '')
  )
  from public.clients remove, guard g
  where keep.id = g.keep_client_id
    and remove.id = g.remove_client_id
  returning keep.id
),
delete_duplicate as (
  delete from public.clients c
  using guard g
  where c.id = g.remove_client_id
  returning c.id
)
select
  (select count(*) from move_devices) as moved_devices,
  (select count(*) from move_service) as moved_service_tasks,
  (select count(*) from move_documents) as moved_document_packets,
  (select count(*) from move_registry_link) as moved_registry_links,
  (select count(*) from delete_duplicate) as deleted_duplicate_clients;

commit;
