import './style.css';

// Nhung Pham · Portefølje
// Stupet styres av én tilstand (state). render() oversetter tilstanden til
// klasser og attributter, og CSS-en i style.css gjør resten.
//   phase: 'ready' (på brettet) -> 'dive' (i lufta) -> 'sink' (ned i dypet) -> 'site' (siden er åpen)

var stage = document.getElementById('stage');
var who = document.getElementById('who');
var fig = document.getElementById('fig');
var swimWrap = document.getElementById('swimWrap');
var mask = document.getElementById('mask');
var talk = document.getElementById('talk');
var board = document.getElementById('board');
var hintEl = document.getElementById('hint');
var subEl = document.getElementById('sub');
var dots = [1, 2, 3].map(function (i) { return document.getElementById('dot' + i); });

var state = { phase: 'ready', hops: 0, pose: null, quip: null, fast: false };
var timers = [];
function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
function clearTimers() { timers.forEach(clearTimeout); timers = []; }
function set(patch) { for (var k in patch) state[k] = patch[k]; render(); }

var HINTS = [
  ['Klar for et stup?', 'Klikk på stupebrettet for å sprette. På tredje hopp stuper du!'],
  ['Hopp en gang til!', 'Litt høyere…'],
  ['Siste hopp!', 'Hold pusten…']
];
var BASE_POSE = { ready: 'idle', dive: 'dive', sink: 'dive', site: 'drift' };
var POS = { ready: ['29%', '44%'], dive: ['47%', '83%'], sink: ['19%', '88%'], site: ['19%', '88%'] };

function render() {
  var s = state, p = s.phase;
  document.body.classList.toggle('is-locked', p !== 'site');
  stage.dataset.phase = p;
  stage.dataset.deep = (p === 'sink' || p === 'site') ? '1' : '0';
  stage.classList.toggle('fast', !!s.fast);

  var h = HINTS[Math.min(s.hops, 2)];
  hintEl.textContent = h[0];
  subEl.textContent = h[1];
  dots.forEach(function (d, i) { d.style.background = s.hops > i && i < 2 ? '#0E2A40' : 'transparent'; });

  board.className = 'board ' + ['', 'boardB1', 'boardB2', 'boardB3'][Math.min(s.hops, 3)];

  var whoClass = '';
  if (p === 'ready') whoClass = s.hops === 1 ? 'hopA' : s.hops === 2 ? 'hopB' : '';
  if (p === 'dive') whoClass = 'diving';
  if (p === 'sink') whoClass = 'sinking';
  if (p === 'site') whoClass = 'floating';
  who.className = 'who ' + whoClass;
  who.style.left = POS[p][0];
  who.style.top = POS[p][1];

  fig.setAttribute('class', 'fig pose-' + (s.pose || BASE_POSE[p] || 'idle'));
  swimWrap.className = (p === 'sink' && s.pose === 'swim') ? 'undulate' : '';
  mask.style.transform = 'translateY(' + ((p === 'ready' && s.hops < 2) ? -40 : 0) + 'px)';

  var bubbles = p === 'ready' ? (s.hops === 0 ? 'Jeg tør… tror jeg!' : s.hops === 1 ? 'Wiii!' : 'Maska på. Tre… to… en…') : '';
  var text = s.quip || bubbles;
  talk.hidden = !text;
  talk.textContent = text;
}

// restart a CSS animation class on the same element (needed for repeated hops)
function restart(el) { el.style.animation = 'none'; void el.offsetWidth; el.style.animation = ''; }

function toSite(fast) {
  set({ phase: 'site', pose: null, quip: 'Velkommen ned!', fast: !!fast });
  later(function () { set({ quip: null }); }, 2600);
}

document.getElementById('btn-bounce').addEventListener('click', function () {
  if (state.phase !== 'ready') return;
  var n = state.hops + 1;
  if (n < 3) { set({ hops: n }); restart(who); restart(board); return; }
  set({ phase: 'dive', hops: 3 });
  later(function () { set({ phase: 'sink', fast: false }); }, 1250);
  later(function () { set({ pose: 'float' }); }, 1450);
  later(function () { set({ pose: 'swim' }); }, 2150);
  later(function () { set({ pose: 'float' }); }, 5750);
  later(function () { toSite(false); }, 5850);
});
document.getElementById('btn-skip').addEventListener('click', function () { clearTimers(); toSite(true); });
function surface() {
  clearTimers();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  set({ phase: 'ready', hops: 0, quip: null, pose: null, fast: false });
}
document.getElementById('btn-surface').addEventListener('click', surface);
document.getElementById('btn-surface-bottom').addEventListener('click', surface);
var pokeN = 0;
document.getElementById('btn-poke').addEventListener('click', function () {
  var lines = ['Blubb!', 'Prosjektene mine er der oppe ↗', 'Det er fint her nede!', 'Takk for at du stupte med meg!'];
  pokeN = (pokeN + 1) % lines.length;
  set({ quip: lines[pokeN] });
  later(function () { set({ quip: null }); }, 2200);
});

render();

