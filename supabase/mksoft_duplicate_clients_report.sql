-- Find possible duplicate DentApp clients after MKsoft import.
-- This is read-only.

with client_base as (
  select
    c.id,
    c.legacy_id,
    c.name,
    c.contact,
    c.address_street,
    c.address_city,
    c.address_zip,
    c.billing_name,
    c.billing_company_id,
    c.source_system,
    c.source_id,
    c.external_ico_raw,
    c.provider_idzz,
    c.registry_match_state,
    regexp_replace(
      lower(coalesce(nullif(c.billing_name, ''), c.name, '')),
      '[^a-z0-9áäčďéíĺľňóôŕšťúýž]+',
      '',
      'g'
    ) as normalized_name
  from public.clients c
),
usage_counts as (
  select
    c.id,
    (select count(*) from public.devices d where d.client_id = c.id) as devices_count,
    (select count(*) from public.service_tasks s where s.client_id = c.id) as service_count,
    (select count(*) from public.document_packets p where p.client_id = c.id) as documents_count
  from public.clients c
),
duplicate_groups as (
  select
    coalesce(nullif(billing_company_id, ''), 'bez_ico') as duplicate_key_ico,
    normalized_name,
    count(*) as clients_count
  from client_base
  where normalized_name <> ''
  group by coalesce(nullif(billing_company_id, ''), 'bez_ico'), normalized_name
  having count(*) > 1
)
select
  dg.duplicate_key_ico as ico,
  dg.normalized_name,
  dg.clients_count,
  cb.id,
  cb.name,
  cb.contact,
  concat_ws(', ', nullif(cb.address_street, ''), nullif(cb.address_zip, ''), nullif(cb.address_city, '')) as adresa,
  cb.billing_name,
  cb.source_system,
  cb.external_ico_raw,
  cb.provider_idzz,
  cb.registry_match_state,
  uc.devices_count,
  uc.service_count,
  uc.documents_count
from duplicate_groups dg
join client_base cb
  on coalesce(nullif(cb.billing_company_id, ''), 'bez_ico') = dg.duplicate_key_ico
 and cb.normalized_name = dg.normalized_name
left join usage_counts uc on uc.id = cb.id
order by dg.clients_count desc, dg.duplicate_key_ico, cb.name, cb.address_city, cb.address_street;
