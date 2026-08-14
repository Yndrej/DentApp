-- Fix read/update access for the public e-VUC provider registry in DentApp.
-- Use this if provider_registry contains rows, but the app still shows only sample rows.
-- Provider registry data is public; app users still need to be authenticated.

alter table public.provider_registry enable row level security;

drop policy if exists "provider registry read authenticated" on public.provider_registry;
create policy "provider registry read authenticated"
on public.provider_registry
for select
to authenticated
using (auth.uid() is not null);

drop policy if exists "provider registry update authenticated" on public.provider_registry;
create policy "provider registry update authenticated"
on public.provider_registry
for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);
