# Nhung Pham · Portefølje

En leken portefølje som starter på et stupebrett: man klikker for å sprette, stuper i havet på tredje hopp, og følger Nhung ned i dypet der siden åpner seg.

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
| Overskrift, prosjekter, om meg, kontakt | `index.html` |
| Hva Nhung sier, instruksjonene på brettet | `src/main.js` (`HINTS`, boblene i `render()` og `lines` i klikk-funksjonen) |
| Farge på svømmeføtter og snorkel | `src/style.css` (`--fin`, `--fin-dark`, `--fin-light` under `#stage`) |
| Farger, fonter og utseende ellers | `src/style.css` |
| Rekkefølge og timing i stupet | `src/main.js` (tidene i klikk-funksjonen for stupebrettet) |

Tekst i [HAKEPARENTESER] er plassholdere du bytter ut.

## Slik fungerer det

- `src/main.js` holder én tilstand (`state`) og en `render()`-funksjon som setter `data-phase` på `#stage`: `ready` (på brettet), `dive` (i lufta), `sink` (ned i dypet) og `site` (siden er åpen).
- CSS-en flytter "kameraet" ved å skyve lagene oppover når `data-deep="1"`. Lagene beveger seg i ulik fart, så det føles som dybde.
- Hoppene, stupet og svømmeturen er CSS-animasjoner med mange små steg, så bevegelsene blir myke.
- Siden er låst for scrolling til man har stupt. Etterpå kan man scrolle ned til prosjekter, om meg og kontakt.
- "Hopp over intro" går rett ned i dypet, og `prefers-reduced-motion` skrur av de fleste animasjonene.

## Publisere

**Netlify:** `netlify.toml` er satt opp med byggkommando `npm run build` og mappe `dist`, så siden bygges automatisk når `main` oppdateres.

**GitHub Pages:** kjør `npm run build` og publiser innholdet i `dist/`. `vite.config.js` bruker relative stier, så det fungerer også under `brukernavn.github.io/repo-navn/`.
