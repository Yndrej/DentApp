-- Read-only preview before consolidating MKsoft duplicate clients into company + locations.
-- Shows one row per client that would be part of a duplicate company group.

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
    count(*) over (partition by regexp_replace(coalesce(c.billing_company_id, ''), '\D', '', 'g')) as clients_in_company,
    coalesce(u.devices_count, 0) as devices_count,
    coalesce(u.service_count, 0) as service_count,
    coalesce(u.documents_count, 0) as documents_count
  from public.clients c
  left join usage_counts u on u.id = c.id
  where regexp_replace(coalesce(c.billing_company_id, ''), '\D', '', 'g') <> ''
),
company_groups as (
  select company_ico
  from ranked
  group by company_ico
  having count(*) > 1
)
select
  r.company_ico as ico,
  case when r.keep_rank = 1 then 'PONECHAT AKO FIRMA' else 'PREMENIT NA PREVADZKU' end as plan,
  r.clients_in_company,
  r.name,
  r.billing_name,
  concat_ws(', ', nullif(r.address_street, ''), nullif(r.address_zip, ''), nullif(r.address_city, '')) as adresa,
  r.contact,
  r.email,
  r.phone,
  r.provider_idzz as idzz,
  r.registry_match_state,
  r.source_system,
  r.source_id,
  r.devices_count,
  r.service_count,
  r.documents_count,
  r.id
from ranked r
join company_groups g on g.company_ico = r.company_ico
order by r.company_ico, r.keep_rank, r.name, r.address_city, r.address_street;
