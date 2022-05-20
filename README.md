# Domácí úkol

## Základní znalost Dockeru

Vytvořte v adresáři kořenovém adresáři shell/batch/powershell (vyberte jednu z variant, která je vám nejbližší) script `docker.[sh|bat|ps1]`, který

- Stáhne image `jacobalberty/firebird:2.5-sc`
- Nakonfiguruje kontejner dle [dokumentace](https://hub.docker.com/r/jacobalberty/firebird) následujícím způsobem
  - Jméno `firebird2`
  - Timezone `Europe/Prague`
  - Bude (pomocí volume) sdílet adresář `db` do mountpointu `/firebird`
  - Bude sdílet port `3050` s hostitelským systémem
  - Nastaví heslo pro uživatele SYSDBA na `masterkey`

## Základní backend

Vytvořte v `routes/api/diag.ts` GET endpoint, který bude zprostředkovávat data z tabulky `CZ110DGA` v databázi `tabunis.fdb`

- Parametry v URL
  - limit, offset, text (hledaný text)
- Výstup
  - `{ count: 1, data: [{ kod: '', naz: '' }] }`
  - count: celkový počet položek odpovídajících kritériu (bez ohledu na limit, dotazy tedy musí být dva)
  - data: pole objektů
- Select
  - pro práci s databází použijte [knex](https://knexjs.org/)
  - bude obsahovat pouze pole `kod` a `naz`
  - bude omezen `(PLATIOD <= CURRENT_TIMESTAMP AND PLATIDO >= CURRENT_TIMESTAMP)`
  - pokud nebude parametr `text` prázdný, přidá `AND (WHERE KOD LIKE '${text}%' OR WHERE NAZ LIKE '${text}%')`

## Frontend

Implementujte v `components/AutoComplete.svelte` komponentu, která

- pro svůj rendering využívá [svelte-tiny-virtual-list](https://github.com/skayo/svelte-tiny-virtual-list)
- načítá data dynamicky z endpointu `/api/diag`
- nedrží všechna data najednou v paměti browseru, ale načítá je dle aktuální potřeby (polohy scrollbaru) a zahazuje ta která už nepotřebuje
- moje naivní představa je
  - při prvním načtení zjistím celkový počet záznamů a načtu první buffer
  - rozdělím dataset na díly (buffery) (dle limitu selectu)
  - dle aktuální polohy a směru scrollingu asynchronně načítám položky do bufferů a zároveň odhazuji nepotřebná data
- možné optimalizace
  - při hledání textu lze použít [debounce](https://github.com/hayes/just-debounce)
  - pokud je výsledků v datasetu méně než je velikost bufferu, provádím další filtrování výsledků (hledání textu) už jen v prohlížeči
