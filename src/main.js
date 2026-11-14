import './style.css';
import { DECOYS, ICONS, LINES, SLOTS } from './items.js';

// ---------- Innstillinger ----------
const CONFIG = {
  speed: 4.5, // px per frame personen går
  sight: 130, // hvor langt personen ser i mørket (px)
  touchRadius: 56, // hvor nær personen må være en ting for å "finne" den
  introMs: 5000, // hvor lenge første snakkeboble vises
  hintAfterMs: 25000, // hint om fyrstikkene etter så lang tid
  hintMs: 6000,
};

// Steg: 0 = mørkt, 1 = leter, 2 = har fyrstikk, 3 = lyset er tent
const STEP = { DARK: 0, SEARCH: 1, MATCH: 2, LIT: 3 };

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const scene = $('scene');
const itemsEl = $('items');
const matchesEl = $('matches');
const candleEl = $('candle');
const dark = $('dark');
const matchGlow = $('matchglow');
const counter = $('counter');
const skip = $('skip');
const figure = $('figure');
const figureBody = figure.querySelector('.figure__body');
const bubble = $('bubble');
const resetBtn = $('reset');

// ---------- Tilstand ----------
const state = {
  step: STEP.DARK,
  x: 0,
  y: 0,
  tx: null,
  ty: null,
  dir: 1,
  walking: false,
  found: new Set(),
  touching: null,
  msg: null,
  msgUntil: 0,
  searchStart: 0,
  hinted: false,
  layout: null,
};

const size = () => ({ W: scene.clientWidth, H: scene.clientHeight });
// Stearinlyset står alltid nede i venstre hjørne (i px fra kanten)
const CANDLE = { left: 70, bottom: 80 };
const candlePx = () => ({ x: CANDLE.left, y: size().H - CANDLE.bottom });
// Personen står ved siden av lyset
const home = () => ({ x: 190, y: size().H - 107 });
const toPx = (it) => {
  if (it.id === 'candle') return candlePx();
  const { W, H } = size();
  return { x: (it.x * W) / 100, y: (it.y * H) / 100 };
};

function shuffle(arr) {
  const a = arr.map((s) => [...s]);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Ny tilfeldig plassering hver gang siden lastes (eller lyset blåses ut)
function makeLayout() {
  const slots = shuffle(SLOTS);
  const match = slots.splice(slots.findIndex((s) => s[0] > 50), 1)[0];
  const decoys = DECOYS.map((d, i) => ({
    ...d,
    x: slots[i][0],
    y: slots[i][1],
    rot: Math.round(Math.random() * 30 - 15),
  }));
  return {
    match: { id: 'matches', x: match[0], y: match[1] },
    candle: { id: 'candle' },
    decoys,
  };
}

function place(el, it) {
  el.style.left = `${it.x}%`;
  el.style.top = `${it.y}%`;
}

function renderItems() {
  itemsEl.replaceChildren();
  for (const d of state.layout.decoys) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'item item--decoy';
    b.setAttribute('aria-label', d.name);
    place(b, d);
    b.innerHTML = `<svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true" style="transform: rotate(${d.rot}deg)">${ICONS[d.icon]}</svg>`;
    b.addEventListener('click', () => walkTo(d));
    itemsEl.append(b);
  }
  place(matchesEl, state.layout.match);
  candleEl.style.left = `${CANDLE.left}px`;
  candleEl.style.top = `calc(100% - ${CANDLE.bottom}px)`;
  scene.style.setProperty('--candle-x', `${CANDLE.left}px`);
  scene.style.setProperty('--candle-y', `calc(100% - ${CANDLE.bottom}px)`);
}

// ---------- Skrivemaskin-effekt for introteksten ----------
const hero = $('hjem');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const caret = document.createElement('span');
caret.className = 'hero__caret';
caret.setAttribute('aria-hidden', 'true');

// Alle tekstbiter i introen (unntatt knappene), med full tekst lagret
const typeNodes = (() => {
  const nodes = [];
  const walker = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) =>
      n.parentElement.closest('.hero__actions, svg') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  while (walker.nextNode()) {
    const n = walker.currentNode;
    nodes.push({
      node: n,
      full: n.textContent.replace(/\s+/g, ' '),
      block: n.parentElement.closest('.hero > *'),
    });
  }
  return nodes;
})();

let typeTimer = 0;
function stopTyping() {
  clearTimeout(typeTimer);
  for (const t of typeNodes) t.node.textContent = t.full;
  caret.remove();
  hero.style.minHeight = '';
  hero.classList.remove('is-typing');
  hero.classList.add('is-typed');
}

function typeHero() {
  clearTimeout(typeTimer);
  if (reduceMotion.matches) return stopTyping();

  // Hold av plass så teksten ikke hopper mens den skrives
  hero.style.minHeight = `${hero.offsetHeight}px`;
  hero.classList.remove('is-typed');
  hero.classList.add('is-typing');
  for (const t of typeNodes) t.node.textContent = '';

  let i = 0;
  let pos = 0;
  const tick = () => {
    while (i < typeNodes.length && pos >= typeNodes[i].full.length) {
      i++;
      pos = 0;
    }
    if (i >= typeNodes.length) {
      typeTimer = setTimeout(stopTyping, 600);
      return;
    }
    const t = typeNodes[i];
    const ch = t.full[pos++];
    t.node.textContent = t.full.slice(0, pos);
    t.node.parentNode.insertBefore(caret, t.node.nextSibling);
    // Litt menneskelig rytme: pause etter tegnsetting og nye avsnitt
    let delay = 35 + Math.random() * 45;
    if (/[.!?,]/.test(ch)) delay += 260;
    if (pos === t.full.length && t.block !== typeNodes[i + 1]?.block) delay += 350;
    typeTimer = setTimeout(tick, delay);
  };
  typeTimer = setTimeout(tick, 700); // vent til lyset har blusset opp
}

// ---------- Handlinger ----------
function say(text, ms = 0) {
  state.msg = text;
  state.msgUntil = ms ? performance.now() + ms : 0;
}

function setStep(step) {
  const wasLit = state.step === STEP.LIT;
  state.step = step;
  scene.dataset.step = String(step);
  const lit = step === STEP.LIT;
  document.body.classList.toggle('is-locked', !lit);
  if (lit) {
    state.msg = null;
    state.dir = -1;
    if (!wasLit) typeHero();
  } else if (wasLit) {
    stopTyping();
  }
}

function walkTo(it) {
  if (state.step === STEP.SEARCH || state.step === STEP.MATCH) {
    const p = toPx(it);
    state.tx = p.x;
    state.ty = p.y;
  }
}

function onPointer(e) {
  if (state.step !== STEP.SEARCH && state.step !== STEP.MATCH) return;
  const r = scene.getBoundingClientRect();
  state.tx = e.clientX - r.left;
  state.ty = e.clientY - r.top;
}

function start() {
  setStep(STEP.SEARCH);
  state.searchStart = performance.now();
  state.tx = state.x;
  state.ty = state.y;
  say(LINES.intro, CONFIG.introMs);
}

function reset() {
  state.found.clear();
  state.touching = null;
  state.hinted = false;
  state.tx = state.ty = null;
  state.layout = makeLayout();
  renderItems();
  setStep(STEP.DARK);
  state.msg = null;
  window.scrollTo({ top: 0 });
}

figure.addEventListener('click', () => {
  if (state.step === STEP.DARK) start();
});
matchesEl.addEventListener('click', () => walkTo(state.layout.match));
candleEl.addEventListener('click', () => {
  if (state.step === STEP.LIT) say(LINES.candleLit, 4000);
  else walkTo(state.layout.candle);
});
candleEl.addEventListener('pointerleave', () => {
  if (state.step === STEP.LIT && state.msg === LINES.candleLit) state.msg = null;
});
skip.addEventListener('click', (e) => {
  e.preventDefault();
  setStep(STEP.LIT);
});
resetBtn.addEventListener('click', reset);
scene.addEventListener('pointermove', onPointer);
scene.addEventListener('pointerdown', onPointer);

// ---------- Spill-løkka ----------
function update(now) {
  const { W, H } = size();
  const s = state.step;
  const searching = s === STEP.SEARCH || s === STEP.MATCH;

  // Bevegelse mot målet (musa når man leter, hjørnet ellers)
  let t = home();
  if (searching) t = { x: state.tx ?? state.x, y: state.ty ?? state.y };
  t.x = Math.max(60, Math.min(W - 60, t.x));
  t.y = Math.max(76, Math.min(H - 76, t.y));
  const dx = t.x - state.x;
  const dy = t.y - state.y;
  const dist = Math.hypot(dx, dy);
  const sp = CONFIG.speed;
  if (dist <= sp) {
    state.x = t.x;
    state.y = t.y;
  } else {
    state.x += (dx / dist) * sp;
    state.y += (dy / dist) * sp;
  }
  state.walking = dist > sp;
  if (dx > 1) state.dir = 1;
  else if (dx < -1) state.dir = -1;
  if (s === STEP.LIT && !state.walking) state.dir = 1;

  // Har personen gått på noe?
  if (searching) {
    const all = [...state.layout.decoys, state.layout.match, state.layout.candle];
    let hit = null;
    for (const it of all) {
      const p = toPx(it);
      if (Math.hypot(state.x - p.x, state.y - p.y) < CONFIG.touchRadius) hit = it;
    }
    const hitId = hit ? hit.id : null;
    if (hitId !== state.touching) {
      if (!hit && state.touching) state.msg = null; // gikk vekk: boblen forsvinner
      state.touching = hitId;
      if (hit) {
        state.found.add(hit.id);
        if (hit.id === 'matches') {
          if (s === STEP.SEARCH) {
            setStep(STEP.MATCH);
            say(LINES.matches);
          }
        } else if (hit.id === 'candle') {
          if (s === STEP.MATCH) setStep(STEP.LIT);
          else say(LINES.candleNoMatch);
        } else {
          say(hit.msg);
        }
      }
    }

    if (s === STEP.SEARCH && !state.hinted && now - state.searchStart > CONFIG.hintAfterMs) {
      state.hinted = true;
      const side = toPx(state.layout.match).x > state.x ? 'høyre' : 'venstre';
      say(LINES.hint(side), CONFIG.hintMs);
    }
  }

  if (state.msgUntil && now > state.msgUntil) {
    state.msg = null;
    state.msgUntil = 0;
  }
}

let lastBubble = '';
function draw() {
  const { W } = size();
  const s = state.step;
  const { x, y } = state;

  // Personen
  figure.style.transform = `translate(${Math.round(x - 43)}px, ${Math.round(y - 67)}px)`;
  figureBody.style.transform = `scaleX(${state.dir})`;
  figure.classList.toggle('is-walking', state.walking);
  figure.dataset.pose = s === STEP.MATCH ? 'match' : s === STEP.LIT && !state.walking ? 'wave' : 'down';

  // Mørket med "synsfelt" rundt personen
  if (s === STEP.SEARCH || s === STEP.MATCH) {
    const r = s === STEP.MATCH ? Math.round(CONFIG.sight * 2.1) : CONFIG.sight;
    dark.style.background = `radial-gradient(circle ${r}px at ${Math.round(x)}px ${Math.round(y)}px, rgba(7,6,5,0) 0%, rgba(7,6,5,0.35) 55%, rgba(7,6,5,0.985) 100%)`;
    matchGlow.style.background = `radial-gradient(circle 300px at ${Math.round(x)}px ${Math.round(y)}px, rgba(255,170,80,0.18), rgba(255,170,80,0) 100%)`;
  } else if (s === STEP.DARK) {
    dark.style.background = 'rgba(7,6,5,0.985)';
  }

  // Snakkeboble
  let text = '';
  if (s === STEP.DARK) text = LINES.clickMe;
  else if (s === STEP.LIT) text = state.walking ? LINES.walkingHome : state.msg || LINES.welcome;
  else text = state.msg || '';
  if (text !== lastBubble) {
    bubble.textContent = text;
    lastBubble = text;
  }
  bubble.hidden = !text;
  if (text) {
    const above = y - 67 > 150;
    const right = x + 44 + 300 < W;
    const left = right ? x + 30 : x - 30 - bubble.offsetWidth;
    const top = above ? y - 60 : y + 72;
    bubble.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px) translateY(${above ? '-100%' : '0'})`;
    bubble.dataset.corner = `${above ? 'b' : 't'}${right ? 'l' : 'r'}`;
  }
}

function loop(now) {
  update(now);
  draw();
  requestAnimationFrame(loop);
}

// ---------- Oppstart ----------
state.layout = makeLayout();
renderItems();
Object.assign(state, home());
setStep(STEP.DARK);
requestAnimationFrame(loop);
