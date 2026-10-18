import { createRoom } from '../room/engine';
import { initJourney } from '../room/journey';
import { initDeskTune } from './dtune';

/* The desk home: the room builds itself, the character sits down, the camera eases into the
   monitor and the monitor becomes the site. "Room" eases back out. Returns a cleanup. */

export const DEF = {
  delay: 300, overlap: .45, steps: 12, snap: 1,
  floorDur: 520, popFrom: .55,
  wallDur: 620, wallStagger: 140,
  hangDur: 420, hangStagger: 60,
  dropDur: 640, dropStagger: 80, dropH: 64, fallPart: .62, squash: .22,
  charMode: 'walk', walk: 2.2, charDelay: 120, hold: 350,
  camDur: 2200, fit: .9, phoneFit: 1.15, yOff: 0, panLead: .12, unshearStart: .3, unshearEnd: 1,
  screenOn0: .3, screenOn1: .62, near0: .08, near1: .38, over: 1.06, backMul: .85,
  skipRate: 4, skipRamp: 260,
  popEase: [.34, 1.56, .64, 1], riseEase: [.22, 1, .36, 1], dropEase: [.55, 0, 1, .45], landEase: [.3, 1.8, .5, 1], camEase: [.65, 0, .25, 1]
};

const PHASES = [
  { k: 'floor', fx: 'pop', names: ['floor'] },
  { k: 'wall', fx: 'rise', names: ['wallR', 'wallL'] },
  { k: 'hang', fx: 'pop', names: ['window', 'board', 'fThesis', 'fAmbient', 'fHq', 'fHouse', 'postcard', 'door', 'rug', 'mat'] },
  { k: 'drop', fx: 'drop', names: ['desk', 'chair', 'bench', 'term', 'plant'] },
  { k: 'drop', fx: 'drop', names: ['monitor', 'keys', 'lamp', 'mug', 'bun', 'handheld', 'ball'] }
];

/* the monitor screen in room pixels: top-left corner, 22 along +x (which runs down-right), 16 down */
const SO = [200, 116], SW = 22, SH = 16, SC = [SO[0] + SW / 2, SO[1] + SW / 4 + SH / 2];

export function bezier([x1, y1, x2, y2]) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t, dX = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = X(t) - x; if (Math.abs(e) < 1e-6) return Y(t); const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    let a = 0, b = 1; t = x;
    for (let i = 0; i < 40; i++) { const v = X(t); if (Math.abs(v - x) < 1e-6) break; if (v < x) a = t; else b = t; t = (a + b) / 2; }
    return Y(t);
  };
}

const KEY = 'dk-tune-v1', SEEN = 'dk-seen';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const win = (t, a, b) => b > a ? clamp((t - a) / (b - a)) : t >= a ? 1 : 0;

export function initDesk(page, { tune = false } = {}) {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = s => page.querySelector(s);
  const ac = new AbortController(), sig = { signal: ac.signal };
  const S = { ...DEF };
  if (tune) try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* defaults */ }
  let E = {};
  const curves = () => { E = Object.fromEntries(['popEase', 'riseEase', 'dropEase', 'landEase', 'camEase'].map(k => [k, bezier(S[k])])); };
  curves();

  const scene = $('#scene'), screen = $('#screen'), site = $('#site'), hint = $('#roomhint');
  const Room = createRoom(), ID = Room.ID;
  const tip = (id, label, t) => ({ id, label, tip: t, onClick: () => {} });
  const hotspots = [
    { id: ID.desk, label: 'Sit at the desk and open the site', tip: 'sit back down', onClick: () => enter() },
    tip(ID.board, 'Whiteboard', 'the whiteboard'), tip(ID.bench, 'Workbench', 'the workbench'), tip(ID.term, 'Terminal', 'the terminal'),
    tip(ID.window, 'Window onto Stockholm', 'stockholm, outside'), tip(ID.door, 'Door', 'the door'), tip(ID.fThesis, 'Framed picture', 'the thesis'),
    tip(ID.fAmbient, 'Framed picture', 'ambient island'), tip(ID.mug, 'Fika mug', 'fika. non-negotiable.'), tip(ID.ball, 'Football', 'corner kicks, mostly missed'),
    tip(ID.plant, 'Plant', 'watered on sundays'), tip(ID.postcard, 'Postcard from Muscat', 'postcard from muscat')
  ];

  /* state: intro (building, character) → in (camera) → site; out (camera back) → room */
  let mode = 'intro', vt = 0, lastNow = 0, rate = 1, rateT = 1, plan = null, pieces = [], bounds = null;
  let camStart = Infinity, outStart = 0, camT = 0, charAt = Infinity, charShown = false, saved = 0;

  function makePlan() {
    const at = {}; let t = S.delay, end = 0;
    for (const ph of PHASES) {
      const dur = S[ph.k + 'Dur'], stg = ph.k === 'floor' ? 0 : S[ph.k + 'Stagger'];
      ph.names.forEach((n, i) => { at[n] = { t0: t + i * stg, dur, fx: ph.fx }; });
      const e = t + (ph.names.length - 1) * stg + dur; end = Math.max(end, e);
      t = e - S.overlap * (e - t);
    }
    return { at, end };
  }
  function measure(list) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of list) { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + p.w); y1 = Math.max(y1, p.y + p.h); }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  const q = (u, dur) => { if (!S.steps) return u; const n = dur / 1000 * S.steps; return Math.floor(u * n) / n; };

  /* one piece at virtual time vt */
  function pose(p) {
    const a = plan.at[p.name], st = p.el.style;
    if (!a) return;
    const u = clamp(q((vt - a.t0) / a.dur, a.dur), 0, 1), s = room ? room.scale : 2;
    if (vt < a.t0) { st.visibility = 'hidden'; return; }
    st.visibility = '';
    if (u >= 1) { st.transform = ''; st.clipPath = ''; return; }
    if (a.fx === 'pop') {
      const k = lerp(S.popFrom, 1, E.popEase(u));
      st.transformOrigin = '50% 70%'; st.transform = 'scale(' + k.toFixed(4) + ')';
    } else if (a.fx === 'rise') {
      let r = (1 - E.riseEase(u)) * p.h; if (S.snap) r = Math.round(r);
      st.clipPath = 'inset(' + (r * s).toFixed(1) + 'px 0 0 0)';
    } else {
      const f = S.fallPart;
      if (u < f) {
        let y = -S.dropH * (1 - E.dropEase(u / f)); if (S.snap) y = Math.round(y);
        st.transformOrigin = '50% 100%'; st.transform = 'translateY(' + (y * s) + 'px)';
      } else {
        const sy = 1 - S.squash * (1 - E.landEase((u - f) / (1 - f))), sx = 1 + (1 - sy) * .6;
        st.transformOrigin = '50% 100%'; st.transform = 'scale(' + sx.toFixed(4) + ',' + sy.toFixed(4) + ')';
      }
    }
  }
  function poseAll() { for (const p of pieces) pose(p); }
  function settle() { for (const p of pieces) { p.el.style.visibility = ''; p.el.style.transform = ''; p.el.style.clipPath = ''; } }

  /* camera: one focal point (the screen centre) carried from where it sits in the room view to the
     middle of the viewport, log-scale zoom, and a shear that turns the iso screen face square-on */
  function geom() {
    const s = room.scale, vw = innerWidth, vh = innerHeight, B = bounds;
    const sc0 = Math.min(vw / (B.w * s), vh / (B.h * s)) * (vw <= 760 ? S.phoneFit : S.fit);
    const F = [SC[0] * s, SC[1] * s];
    const ox = vw / 2 - (B.x + B.w / 2) * s * sc0, oy = vh / 2 - (B.y + B.h / 2) * s * sc0 + S.yOff * vh;
    const sc1 = Math.max(vw / (SW * s), vh / (SH * s)) * S.over;
    return { vw, vh, F, sc0, sc1, C0: [ox + sc0 * F[0], oy + sc0 * F[1]], C1: [vw / 2, vh / 2] };
  }
  function cam() {
    if (!room || !bounds) return null;
    const g = geom(), t = camT;
    const pz = E.camEase(t), pc = E.camEase(clamp(t * (1 + S.panLead))), pu = E.camEase(win(t, S.unshearStart, S.unshearEnd));
    const sc = Math.exp(lerp(Math.log(g.sc0), Math.log(g.sc1), pz)), h = -.5 * pu;
    const C = [lerp(g.C0[0], g.C1[0], pc), lerp(g.C0[1], g.C1[1], pc)];
    const k = sc / g.sc1, sh = k * (h + .5);
    screen.style.transform = 'matrix(' + [k, sh, 0, k, C[0] - k * g.C1[0], C[1] - sh * g.C1[0] - k * g.C1[1]].map(n => n.toFixed(5)).join(',') + ')';
    const on = win(t, S.screenOn0, S.screenOn1); screen.style.opacity = on.toFixed(3); screen.style.visibility = on > 0 ? 'visible' : 'hidden';
    const near = 1 - win(t, S.near0, S.near1);
    if (charShown) room.char.style.opacity = near.toFixed(3);
    for (const p of pieces) if (p.layer === 2) p.el.style.opacity = near.toFixed(3);
    return { m: [sc, sc * h, 0, sc, C[0] - sc * g.F[0], C[1] - sc * (h * g.F[0] + g.F[1])] };
  }

  function onFrame(now) {
    const dt = lastNow ? Math.min(100, now - lastNow) : 0; lastNow = now;
    rate += (rateT - rate) * (S.skipRamp ? 1 - Math.exp(-dt / S.skipRamp * 3) : 1);
    room.setSpeed(S.walk * rate);
    vt += dt * rate;
    if (mode === 'intro') {
      poseAll();
      if (!charShown && vt >= charAt) showChar();
      if (vt >= camStart) mode = 'in';
    }
    if (mode === 'in') { camT = clamp((vt - camStart) / S.camDur); if (camT >= 1) toSite(); }
    else if (mode === 'out') { camT = 1 - clamp((vt - outStart) / (S.camDur * S.backMul)); if (camT <= 0) toRoom(); }
  }

  function showChar() {
    charShown = true;
    if (S.charMode === 'none') { room.char.style.opacity = '0'; camStart = vt + S.hold; return; }
    room.char.style.opacity = '1';
    if (S.charMode === 'sit') { room.place('desk'); camStart = vt + S.hold; return; }
    room.place('door'); room.go('desk');
  }
  function onArrive(n) { if (n === 'desk' && mode === 'intro' && camStart === Infinity) camStart = vt + S.hold; }

  /* the site lives inside the screen layer while the camera moves, and in normal flow otherwise */
  function toSite() {
    mode = 'site'; camT = 1; rateT = rate = 1; room.setSpeed(S.walk);
    page.dataset.mode = 'site';
    screen.style.transform = ''; screen.style.opacity = ''; screen.style.visibility = '';
    site.style.transform = '';
    scene.hidden = true; room.setVisible(false);
    journey();
    scrollTo({ top: saved, behavior: 'instant' });
    try { sessionStorage.setItem(SEEN, '1'); } catch (e) { /* no storage */ }
  }
  function leaveSite() {
    saved = scrollY;
    page.dataset.mode = 'scene';
    site.style.transform = 'translateY(' + (-saved) + 'px)';
    scene.hidden = false; room.setVisible(true);
    lastNow = 0;
  }
  function back() {
    if (mode !== 'site') return;
    leaveSite(); mode = 'out'; outStart = vt; rateT = rate = 1; cam(); room.camStep(0);
    if (RM.matches) toRoom();
  }
  function toRoom() { mode = 'room'; camT = 0; page.dataset.mode = 'room'; hint.hidden = false; screen.style.visibility = 'hidden'; room.camStep(0); }
  function enter() {
    if (mode !== 'room') return;
    hint.hidden = true; page.dataset.mode = 'scene';
    if (RM.matches) return toSite();
    mode = 'in'; camStart = vt; rateT = rate = 1;
  }

  function start({ build = true } = {}) {
    plan = makePlan(); vt = 0; lastNow = 0; rate = rateT = 1; camT = 0; saved = 0;
    camStart = Infinity; charShown = false; charAt = plan.end + S.charDelay;
    hint.hidden = true; page.dataset.mode = 'scene';
    scene.hidden = false; room.setVisible(true);
    site.style.transform = '';
    room.char.style.opacity = '0';
    if (!build || RM.matches) { settle(); vt = plan.end; charAt = vt; showChar(); if (S.charMode === 'walk') room.place('desk'); return toSite(); }
    mode = 'intro'; room.place('desk'); poseAll(); room.camStep(0);
  }
  function replayCamera() {
    if (mode === 'site') { back(); return; }
    settle(); mode = 'in'; camStart = vt; rateT = rate = 1;
  }

  let room = null;
  room = Room.mount({
    root: $('#room'), hotspots, start: 'desk', pieces: true, cam, onFrame, onArrive,
    onBake: list => { pieces = list; bounds = bounds || measure(list); if (plan) poseAll(); }
  });

  /* any scroll, key or tap during the intro speeds it up instead of cutting to the end */
  const skip = e => {
    if (mode !== 'intro' && mode !== 'in') return;
    if (e.target instanceof Element && e.target.closest('.dtune,.skip')) return;
    rateT = S.skipRate;
  };
  for (const ev of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(ev, skip, { passive: true, signal: ac.signal });
  $('#skip').addEventListener('click', () => { rateT = S.skipRate; }, sig);
  page.querySelectorAll('[data-act=room]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); back(); }, sig));
  $('#sitback').addEventListener('click', () => enter(), sig);

  /* the work row and the journey, as in V7 */
  const cards = $('#cards'), prev = $('#prev'), next = $('#next'), obs = [];
  const step = () => { const c = cards.querySelector('.card'); return c ? c.getBoundingClientRect().width + 20 : 300; };
  const ends = () => { prev.disabled = cards.scrollLeft < 4; next.disabled = cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - 4; };
  prev.addEventListener('click', () => cards.scrollBy({ left: -step(), behavior: RM.matches ? 'auto' : 'smooth' }), sig);
  next.addEventListener('click', () => cards.scrollBy({ left: step(), behavior: RM.matches ? 'auto' : 'smooth' }), sig);
  cards.addEventListener('scroll', ends, { passive: true, signal: ac.signal });
  { const ro = new ResizeObserver(ends); ro.observe(cards); obs.push(ro); }
  ends();
  /* the journey measures itself, so it lays out only while the site is untransformed */
  let endJourney = () => {};
  const journey = () => { endJourney(); $('#jroot').replaceChildren(); endJourney = initJourney($('#jroot')); };

  let seen = false; try { seen = !!sessionStorage.getItem(SEEN); } catch (e) { /* no storage */ }
  start({ build: tune || !seen });

  const endTune = tune ? initDeskTune(page, S, DEF, {
    change(k) { if (k.endsWith('Ease')) curves(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* no storage */ } if (mode === 'room' || mode === 'in' || mode === 'out') room.camStep(0); },
    reset() { Object.assign(S, DEF); curves(); try { localStorage.removeItem(KEY); } catch (e) { /* no storage */ } },
    replay: () => { scrollTo({ top: 0, behavior: 'instant' }); start(); },
    camera: replayCamera,
    back,
    state: () => mode
  }) : () => {};

  return () => { ac.abort(); obs.forEach(o => o.disconnect()); endJourney(); endTune(); room.destroy(); };
}
