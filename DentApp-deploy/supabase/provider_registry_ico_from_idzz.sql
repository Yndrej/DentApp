-- Dopln ICO v provider_registry zo strednej casti IdZZ.
-- Priklad: 65-55467318-A0001 -> ICO 55467318.

update public.provider_registry
set
  ico = substring(coalesce(idzz, source_id) from '^[0-9]{2}-([0-9]{8})-[A-Za-z][0-9]{4}$'),
  updated_at = now()
where
  coalesce(ico, '') = ''
  and coalesce(idzz, source_id) ~ '^[0-9]{2}-[0-9]{8}-[A-Za-z][0-9]{4}$';
