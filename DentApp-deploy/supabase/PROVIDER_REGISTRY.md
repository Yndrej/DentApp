# DentApp provider registry

This adds an online registry table for public healthcare providers. Run `provider_registry.sql` once in Supabase SQL Editor.

The app can then load providers from `public.provider_registry` and convert selected rows into real DentApp clients.

Recommended import fields:

- `source_id` - stable source identifier, required and unique
- `idzz` - provider/facility identifier if available
- `ico` - company ID
- `name` - clinic/facility name
- `provider_name` - legal provider name
- `specialty` - specialty or type of healthcare facility
- `address_street`
- `address_city`
- `address_zip`
- `district`
- `region`
- `email`
- `phone`
- `insurance`
- `source` - e.g. `e-VUC`, `open data`, `MKsoft`

Use `registry_state = 'Novy'` for new rows. DentApp changes the row to `Importovane` after it is added among clients.

Public registry data should stay separate from `clients`; only intentionally selected clinics should become real clients.
