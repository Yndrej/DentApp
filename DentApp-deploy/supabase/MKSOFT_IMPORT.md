# MKsoft import do DentApp

Tento import berie MKsoft ako hlavný zdroj klientov/fakturačných subjektov.
e-VÚC register ostáva pomocný zdroj pre párovanie prevádzok podľa IČO/IdZZ.

## Postup v Supabase SQL editore

1. Spusti `supabase/mksoft_clients_schema.sql`.
2. Spusti vygenerovaný súbor `supabase/mksoft_clients_import.sql`.
3. Výsledok posledného selectu ukáže:
   - koľko existujúcich klientov sa aktualizovalo,
   - koľko nových klientov sa vložilo,
   - koľko záznamov má jednoznačnú e-VÚC zhodu,
   - koľko záznamov potrebuje ručnú kontrolu prevádzky.

## Logika merge

- Existujúci klient sa aktualizuje, ak už má rovnaký MKsoft `source_id`.
- Ak nie, hľadá sa zhoda podľa základného IČO a normalizovaného názvu.
- Ak nie, hľadá sa zhoda podľa názvu a mesta.
- Ak sa nenájde nič, vytvorí sa nový klient.

Pri IČO v tvare `46206965-2` sa ako základné IČO používa `46206965`.

## Dôležité

- Používatelia aplikácie sa nemenia.
- e-VÚC dáta sa nekopírujú hromadne medzi klientov.
- Ak jedno IČO v e-VÚC zodpovedá viacerým prevádzkam, klient dostane stav
  `Vyžaduje kontrolu e-VÚC prevádzky`.
