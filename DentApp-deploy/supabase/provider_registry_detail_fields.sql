-- Doplnkove polia pre detailny e-VUC import.
-- Spustit raz pred importom noveho provider_registry_evuc.sql.

alter table public.provider_registry
  add column if not exists staff text,
  add column if not exists source_url text;
