-- MKsoft partner import support for DentApp clients.
-- Run once before importing MKsoft partner data.

alter table public.clients
  add column if not exists source_system text,
  add column if not exists source_id text,
  add column if not exists source_row_id text,
  add column if not exists external_ico_raw text,
  add column if not exists provider_idzz text,
  add column if not exists registry_provider_id uuid references public.provider_registry(id) on delete set null,
  add column if not exists registry_match_state text;

create unique index if not exists clients_source_unique
  on public.clients (source_system, source_id)
  where source_system is not null and source_system <> '' and source_id is not null and source_id <> '';

create table if not exists public.mksoft_partner_import (
  id bigserial primary key,
  import_batch text not null,
  source_id text not null,
  ico_raw text,
  ico_base text,
  dic text,
  icdph text,
  name text,
  contact_name text,
  billing_street text,
  billing_zip text,
  billing_city text,
  operating_street text,
  operating_street_2 text,
  operating_zip text,
  operating_city text,
  created_at timestamptz not null default now(),
  unique (import_batch, source_id)
);

alter table public.mksoft_partner_import enable row level security;

drop policy if exists "mksoft import admin read" on public.mksoft_partner_import;
create policy "mksoft import admin read"
on public.mksoft_partner_import
for select
to authenticated
using (public.is_admin());

drop policy if exists "mksoft import admin write" on public.mksoft_partner_import;
create policy "mksoft import admin write"
on public.mksoft_partner_import
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());
