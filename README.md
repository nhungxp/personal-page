# Nhung Pham · Portefølje

En leken portefølje som starter i mørket: fyrstikkpersonen følger musa, leter etter fyrstikker blant tilfeldig plasserte ting, og tenner et stearinlys før introen dukker opp.

Bygget med vanlig HTML, CSS og JavaScript, og [Vite](https://vite.dev) som utviklingsserver og byggverktøy.

## Kom i gang

Du trenger [Node.js](https://nodejs.org) (versjon 20 eller nyere).

```bash
npm install      # installerer Vite (bare første gang)
npm run dev      # starter siden på http://localhost:5173 med live oppdatering
npm run build    # lager en ferdig versjon i mappen dist/
npm run preview  # tester den ferdige versjonen lokalt
```

## Hvor endrer jeg hva?

| Hva | Fil |
| --- | --- |
| Tekst i introen, prosjekter, om meg, kontakt | `index.html` |
| Tingene i mørket og hva personen sier | `src/items.js` |
| Farger, fonter og utseende | `src/style.css` (øverst under `:root`) |
| Fart, synsfelt, hint-timing | `src/main.js` (`CONFIG` øverst) |
| Selve logikken (bevegelse, steg) | `src/main.js` |

Tekst i [HAKEPARENTESER] er plassholdere du bytter ut.

### Legge til en ny ting i mørket

1. Tegn et ikon i `ICONS` i `src/items.js` (SVG-innhold med `viewBox="0 0 80 80"`, bare streker).
2. Legg til en linje i `DECOYS` med `id`, `icon`, `name` og `msg`.
3. Pass på at det finnes nok plasser i `SLOTS` (minst antall ting + 2).

## Slik fungerer det

- `data-step` på `#scene` styrer stegene: `0` mørkt, `1` leter, `2` har fyrstikk, `3` lyset er tent. CSS-en viser og skjuler ting ut fra dette.
- `src/main.js` kjører en `requestAnimationFrame`-løkke som flytter personen mot musa, sjekker om den står på en ting, og tegner "synsfeltet" som en `radial-gradient` over mørket.
- Plasseringen trekkes på nytt hver gang siden lastes.
- "Hopp over intro" går rett til steg 3, og `prefers-reduced-motion` skrur av animasjoner.

## Publisere gratis

**GitHub Pages:** kjør `npm run build` og publiser innholdet i `dist/` (for eksempel med GitHub Actions eller pakken `gh-pages`). `vite.config.js` bruker relative stier, så det fungerer også under `brukernavn.github.io/repo-navn/`.

**Netlify / Vercel:** koble til GitHub-repoet, sett byggkommando `npm run build` og mappe `dist`.

## Ideer videre

- Lyd: fyrstikk som tennes, skritt, knitrende lys (med av/på-knapp)
- Blås ut lyset med mikrofonen
- Huske besøkende ("Velkommen tilbake! Lyset brenner fortsatt.")
- Egne case-sider for hvert prosjekt
