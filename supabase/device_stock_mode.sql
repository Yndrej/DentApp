-- Allows devices to exist as stock items before they are assigned to a clinic.
-- Run this once in Supabase SQL Editor before adding unassigned stock devices online.

alter table public.devices
  alter column client_id drop not null;

