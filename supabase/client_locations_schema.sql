-- Client operating locations / branches for DentApp.
-- One client is the billing/company entity; locations are the real operating clinics.

create table if not exists public.client_locations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  legacy_id text unique,
  name text not null default '',
  idzz text,
  address_street text,
  address_city text,
  address_zip text,
  address_floor text,
  contact text,
  email text,
  phone text,
  source_system text,
  source_id text,
  source_note text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists client_locations_client_id_idx
  on public.client_locations (client_id);

create unique index if not exists client_locations_source_unique
  on public.client_locations (source_system, source_id)
  where source_system is not null and source_system <> '' and source_id is not null and source_id <> '';

alter table public.client_locations enable row level security;

drop policy if exists "client locations read" on public.client_locations;
create policy "client locations read"
on public.client_locations
for select
to authenticated
using (public.is_admin() or public.is_technician());

drop policy if exists "client locations admin write" on public.client_locations;
create policy "client locations admin write"
on public.client_locations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

alter table public.devices
  add column if not exists location_id uuid references public.client_locations(id) on delete set null;

create index if not exists devices_location_id_idx
  on public.devices (location_id);

-- Create a primary location for existing clients that do not have one yet.
insert into public.client_locations (
  client_id,
  legacy_id,
  name,
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
  c.id,
  'client-main:' || c.id::text,
  coalesce(nullif(c.name, ''), 'Hlavná prevádzka'),
  c.address_street,
  c.address_city,
  c.address_zip,
  c.address_floor,
  c.contact,
  c.email,
  c.phone,
  coalesce(nullif(c.source_system, ''), 'DentApp'),
  'client-main:' || c.id::text,
  'Automaticky vytvorená hlavná prevádzka z profilu klienta.',
  true
from public.clients c
where not exists (
  select 1
  from public.client_locations l
  where l.client_id = c.id
);

-- Assign devices without a location to the primary location of their client.
update public.devices d
set location_id = l.id
from public.client_locations l
where d.client_id = l.client_id
  and l.is_primary = true
  and d.location_id is null;
