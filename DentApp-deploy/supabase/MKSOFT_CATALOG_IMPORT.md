# MKsoft katalóg položiek

Súbor `Cenník (1 cenová hladina).csv` nepoužívame ako reálny skladový stav.
Je to orientačný katalóg dielov, zariadení a príslušenstva z MKsoftu.

## Očakávaný vstup

CSV so stĺpcami:

```csv
kod;nazov
AD 200;A-dec 200 stomatologická súprava
DU ...;...
```

## Generovanie SQL importu

Z koreňa projektu:

```powershell
python scripts\prepare_mksoft_catalog_import.py "C:\Users\Strix\Downloads\Cenník (1 cenová hladina).csv"
```

Výstup sa vytvorí v:

```text
reports\mksoft_catalog_import_chunks
```

Súbory `001_load_mksoft_catalog.sql`, `002_load_mksoft_catalog.sql` atď. vložte postupne do Supabase SQL Editora a spustite.

## Logika importu

Import vytvorí položky v `public.inventory`:

- `sku` = MKsoft kód / PLU,
- `name` = názov položky,
- `qty`, `min_qty`, `reserved` = `0`,
- `location` = `MKsoft`,
- `note` = informácia, že reálny skladový stav sa spravuje v MKsofte.

Položky s nulovým množstvom aj minimom sa v DentApp zobrazujú ako `Katalóg`, nie ako skladové riziko.

## Prefixy výrobcov

Aktuálne mapovanie:

- `AD` = A-dec
- `DU` = Dürr
- `3M` = 3M
- `EK` = Ekom
- `EM` = EMS
- `NS` = NSK
- `VA`, `VT` = Vatech
- `WH` = W&H

Neznáme prefixy idú zatiaľ pod výrobcu `Iné`.
