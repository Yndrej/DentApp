-- Quick lookup for one suspicious client/company.
-- Change the values in the where clause as needed.

select
  c.id,
  c.legacy_id,
  c.name,
  c.contact,
  c.address_street,
  c.address_zip,
  c.address_city,
  c.billing_name,
  c.billing_company_id,
  c.source_system,
  c.source_id,
  c.external_ico_raw,
  c.provider_idzz,
  c.registry_match_state,
  (select count(*) from public.devices d where d.client_id = c.id) as devices_count,
  (select count(*) from public.service_tasks s where s.client_id = c.id) as service_count,
  (select count(*) from public.document_packets p where p.client_id = c.id) as documents_count
from public.clients c
where
  c.billing_company_id = '45476446'
  or lower(c.name) like lower('%3Bdent%')
  or lower(c.billing_name) like lower('%3Bdent%')
order by c.billing_company_id, c.name, c.address_city, c.address_street;
