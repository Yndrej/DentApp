-- Public provider registry for importing dental clinics into DentApp clients.
-- Run once in Supabase SQL Editor. Users remain managed separately in users_profile.

create table if not exists public.provider_registry (
  id uuid primary key default gen_random_uuid(),
  source_id text not null unique,
  idzz text,
  ico text,
  name text not null,
  provider_name text,
  specialty text,
  address_street text,
  address_city text,
  address_zip text,
  district text,
  region text,
  email text,
  phone text,
  insurance text,
  staff text,
  source_url text,
  source text,
  registry_state text not null default 'Novy',
  linked_client_id uuid references public.clients(id) on delete set null,
  imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists provider_registry_name_idx on public.provider_registry (name);
create index if not exists provider_registry_ico_idx on public.provider_registry (ico);
create index if not exists provider_registry_idzz_idx on public.provider_registry (idzz);
create index if not exists provider_registry_state_idx on public.provider_registry (registry_state);

alter table public.provider_registry enable row level security;

drop policy if exists "provider registry read authenticated" on public.provider_registry;
create policy "provider registry read authenticated"
on public.provider_registry
for select
to authenticated
using (public.is_admin() or public.is_technician());

drop policy if exists "provider registry update authenticated" on public.provider_registry;
create policy "provider registry update authenticated"
on public.provider_registry
for update
to authenticated
using (public.is_admin() or public.is_technician())
with check (public.is_admin() or public.is_technician());

drop policy if exists "provider registry insert admin" on public.provider_registry;
create policy "provider registry insert admin"
on public.provider_registry
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "provider registry delete admin" on public.provider_registry;
create policy "provider registry delete admin"
on public.provider_registry
for delete
to authenticated
using (public.is_admin());
