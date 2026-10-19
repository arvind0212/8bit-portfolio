import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { buildWorld, ORDER, SCREEN, ROOM } from './world';
import { initJourney } from '../room/journey';
import { initDeskTune } from './dtune';
import { bezier } from './bezier';

/* The desk home: a voxel room drops into place while the camera is already moving, and the
   flight ends square-on to the monitor, whose screen becomes the site. "Room" flies back out.
   Returns a cleanup. */

export const DEF = {
  delay: 250, overlap: .5, steps: 0, snap: 1, pixel: 2,
  floorDur: 480, popFrom: .3,
  wallDur: 560, wallStagger: 120,
  hangDur: 380, hangStagger: 55,
  dropDur: 620, dropStagger: 70, dropH: 26, fallPart: .62, squash: .18,
  camAt: 1300, camDur: 2600, fit: 1.05, phoneFit: .95,
  az0: 42, el0: 30, fov0: 14, fov1: 38, el1: 0,
  panLead: .1, perspLead: .25, turnStart: 0, turnEnd: .85,
  over: 1.04, backMul: .85,
  screenMode: 'live', screenOn0: .45, screenOn1: .8,
  glow0: .55, glow1: .95, fadeMs: 420, dissolveMs: 650, tile: 18,
  skipRate: 4, skipRamp: 260,
  popEase: [.34, 1.56, .64, 1], riseEase: [.22, 1, .36, 1], dropEase: [.55, 0, 1, .45], landEase: [.3, 1.8, .5, 1], camEase: [.65, 0, .25, 1]
};

const KEY = 'dk-tune-v2', SEEN = 'dk-seen';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const win = (t, a, b) => b > a ? clamp((t - a) / (b - a)) : t >= a ? 1 : 0;
const D2R = Math.PI / 180;

function webgl() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }

export function initDesk(page, { tune = false } = {}) {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = s => page.querySelector(s);
  const ac = new AbortController(), sig = { signal: ac.signal };
  const S = { ...DEF };
  if (tune) try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* defaults */ }
  let E = {};
  const curves = () => { E = Object.fromEntries(['popEase', 'riseEase', 'dropEase', 'landEase', 'camEase'].map(k => [k, bezier(S[k])])); };
  curves();

  const scene3 = $('#scene'), screen = $('#screen'), site = $('#site'), hint = $('#roomhint'), dis = $('#dissolve');
  const GL = webgl();

  /* three.js: the world, a WebGL renderer for it and a CSS3D renderer that carries the site on the screen */
  const W = GL ? buildWorld() : null;
  const camera = new THREE.PerspectiveCamera(S.fov0, innerWidth / innerHeight, .5, 3000);
  const renderer = GL ? new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' }) : null;
  const css = new CSS3DRenderer(), cssScene = new THREE.Scene();
  if (GL) {
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = 'gl'; scene3.prepend(renderer.domElement);
  }
  css.domElement.className = 'css3d'; scene3.insertBefore(css.domElement, scene3.querySelector('.skip'));
  const cssObj = new CSS3DObject(screen);
  cssObj.position.copy(SCREEN.c);
  const home = screen.parentNode, homeNext = screen.nextSibling;

  let vw = innerWidth, vh = innerHeight;
  function size() {
    vw = innerWidth; vh = innerHeight;
    if (GL) { renderer.setPixelRatio(Math.min(devicePixelRatio, 2) / S.pixel); renderer.setSize(vw, vh, false); renderer.domElement.style.width = vw + 'px'; renderer.domElement.style.height = vh + 'px'; }
    css.setSize(vw, vh); camera.aspect = vw / vh;
    cssObj.scale.setScalar(k());
    if (place === 'css3d') { screen.style.width = vw + 'px'; screen.style.height = vh + 'px'; }
    if (dis.width && place === 'overlay') sizeDissolve();
  }
  /* world units per CSS pixel for the site on the screen: at the end of the flight the site is exactly the viewport */
  const k = () => Math.min(SCREEN.w / vw, SCREEN.h / vh) / S.over;

  /* camera: target, framing height, field of view and angle each eased from the room view to square-on at the screen */
  const T0 = new THREE.Vector3(), T1 = SCREEN.c.clone(), T = new THREE.Vector3(), dir = new THREE.Vector3();
  function cam(t) {
    const a = vw / vh;
    T0.copy(ROOM.center);
    const h0 = 2 * ROOM.radius * Math.max(1, .8 / a) / (a < 1 ? S.phoneFit : S.fit), h1 = vh * k();
    const pz = E.camEase(t), pt = E.camEase(clamp(t * (1 + S.panLead))), pp = E.camEase(clamp(t * (1 + S.perspLead))), pa = E.camEase(win(t, S.turnStart, S.turnEnd));
    const fov = lerp(S.fov0, S.fov1, pp), h = Math.exp(lerp(Math.log(h0), Math.log(h1), pz));
    const az = lerp(S.az0, 0, pa) * D2R, el = lerp(S.el0, S.el1, pa) * D2R;
    T.lerpVectors(T0, T1, pt);
    const d = h / (2 * Math.tan(fov * D2R / 2));
    dir.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
    camera.fov = fov; camera.position.copy(T).addScaledVector(dir, d); camera.lookAt(T); camera.updateProjectionMatrix();
    W && (W.glow.opacity = S.screenMode === 'glow' ? win(t, S.glow0, S.glow1) : 0);
    if (place === 'css3d') screen.style.opacity = S.screenMode === 'live' ? win(t, S.screenOn0, S.screenOn1).toFixed(3) : '0';
  }

  /* build plan: phases overlap; each object has a start time and a duration */
  let plan = null;
  function makePlan() {
    const at = {}; let t = S.delay, end = 0;
    for (const ph of ORDER) {
      const dur = S[ph.k + 'Dur'], stg = ph.k === 'floor' ? 0 : S[ph.k + 'Stagger'];
      ph.names.forEach((n, i) => { at[n] = { t0: t + i * stg, dur }; });
      const e = t + (ph.names.length - 1) * stg + dur; end = Math.max(end, e);
      t = e - S.overlap * (e - t);
    }
    return { at, end };
  }
  const q = (u, dur) => { if (!S.steps) return u; const n = dur / 1000 * S.steps; return Math.floor(u * n) / n; };
  function pose(it) {
    const a = plan.at[it.name], g = it.group;
    if (!a) return;
    if (vt < a.t0) { g.visible = false; return; }
    g.visible = true;
    const u = clamp(q((vt - a.t0) / a.dur, a.dur));
    g.position.copy(it.base); g.scale.set(1, 1, 1);
    if (u >= 1) return;
    if (it.fx === 'pop') g.scale.setScalar(Math.max(.001, lerp(S.popFrom, 1, E.popEase(u))));
    else if (it.fx === 'rise') { let e = E.riseEase(u); if (S.snap) e = Math.round(e * it.h) / it.h; g.scale.y = Math.max(.001, e); }
    else {
      const f = S.fallPart;
      if (u < f) { let y = S.dropH * (1 - E.dropEase(u / f)); if (S.snap) y = Math.round(y); g.position.y += y; }
      else { const sy = 1 - S.squash * (1 - E.landEase((u - f) / (1 - f))), sx = 1 + (1 - sy) * .6; g.scale.set(sx, sy, sx); }
    }
  }
  const poseAll = () => { if (W) for (const it of Object.values(W.items)) pose(it); };
  const settle = () => { if (W) for (const it of Object.values(W.items)) { it.group.visible = true; it.group.position.copy(it.base); it.group.scale.set(1, 1, 1); } };

  /* where the site element lives: in page flow, on the 3D screen, or fixed over the viewport */
  let place = 'flow';
  function setPlace(p) {
    if (p === place) return;
    if (place === 'css3d') cssScene.remove(cssObj);
    place = p;
    if (p === 'flow') { screen.style.cssText = ''; home.insertBefore(screen, homeNext); }
    else if (p === 'css3d') { screen.style.cssText = 'position:absolute;overflow:hidden;pointer-events:none;width:' + vw + 'px;height:' + vh + 'px;opacity:0'; cssScene.add(cssObj); }
    else { home.insertBefore(screen, homeNext); screen.style.cssText = 'position:fixed;left:0;top:0;z-index:3;overflow:hidden;pointer-events:none;width:' + vw + 'px;height:' + vh + 'px;opacity:0'; }
  }

  /* the dissolve: a snapshot of the screen at the end of the flight, cleared tile by tile */
  const snap = document.createElement('canvas'); let order = [], cols = 0, rows = 0;
  function sizeDissolve() {
    dis.width = vw; dis.height = vh; dis.style.width = vw + 'px'; dis.style.height = vh + 'px';
    cols = Math.ceil(vw / S.tile); rows = Math.ceil(vh / S.tile);
    order = Array.from({ length: cols * rows }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  }
  function takeSnapshot() {
    sizeDissolve(); cam(1); renderer.render(W.scene, camera);
    snap.width = vw; snap.height = vh; const g = snap.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(renderer.domElement, 0, 0, vw, vh);
  }
  function drawDissolve(r) {
    const g = dis.getContext('2d'); g.clearRect(0, 0, vw, vh); g.drawImage(snap, 0, 0);
    const n = Math.floor(r * order.length);
    for (let i = 0; i < n; i++) { const c = order[i] % cols, w = (order[i] / cols) | 0; g.clearRect(c * S.tile, w * S.tile, S.tile, S.tile); }
  }

  /* state: intro → reveal → site; back: hide → out → room; enter: in → reveal → site */
  let mode = 'intro', vt = 0, lastNow = 0, rate = 1, rateT = 1, camStart = Infinity, camT = 0, revStart = 0, saved = 0, raf = 0;
  const revDur = () => S.screenMode === 'glow' ? S.fadeMs : S.screenMode === 'dissolve' ? S.dissolveMs : 0;
  function reveal(r) {
    if (S.screenMode === 'glow') screen.style.opacity = r.toFixed(3);
    else if (S.screenMode === 'dissolve') { screen.style.opacity = '1'; dis.hidden = false; drawDissolve(r); }
  }
  function startReveal() {
    camT = 1; cam(1);
    if (S.screenMode === 'live' || !revDur()) return toSite();
    if (S.screenMode === 'dissolve') takeSnapshot();
    setPlace('overlay'); mode = 'reveal'; revStart = vt; reveal(0);
  }
  function frame(now) {
    raf = 0;
    const dt = lastNow ? Math.min(100, now - lastNow) : 0; lastNow = now;
    rate += (rateT - rate) * (S.skipRamp ? 1 - Math.exp(-dt / S.skipRamp * 3) : 1);
    vt += dt * rate;
    if (mode === 'intro') { poseAll(); if (vt >= camStart) { camT = clamp((vt - camStart) / S.camDur); if (camT >= 1) startReveal(); } }
    else if (mode === 'in') { camT = clamp((vt - camStart) / S.camDur); if (camT >= 1) startReveal(); }
    else if (mode === 'reveal') { const r = clamp((vt - revStart) / revDur()); reveal(r); if (r >= 1) return toSite(); }
    else if (mode === 'hide') { const r = 1 - clamp((vt - revStart) / (revDur() || 1)); reveal(r); if (r <= 0) { dis.hidden = true; setPlace('css3d'); mode = 'out'; revStart = vt; } }
    else if (mode === 'out') { camT = 1 - clamp((vt - revStart) / (S.camDur * S.backMul)); if (camT <= 0) toRoom(); }
    draw();
    if (mode !== 'site') raf = requestAnimationFrame(frame);
  }
  function draw() { cam(camT); if (GL) renderer.render(W.scene, camera); if (place === 'css3d') css.render(cssScene, camera); }
  const kick = () => { if (!raf) { lastNow = 0; raf = requestAnimationFrame(frame); } };

  function toSite() {
    mode = 'site'; camT = 1; rate = rateT = 1;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    setPlace('flow'); dis.hidden = true;
    page.dataset.mode = 'site'; site.style.transform = ''; scene3.hidden = true;
    journey();
    scrollTo({ top: saved, behavior: 'instant' });
    try { sessionStorage.setItem(SEEN, '1'); } catch (e) { /* no storage */ }
  }
  function back() {
    if (mode !== 'site') return;
    saved = scrollY;
    page.dataset.mode = 'scene'; scene3.hidden = false;
    site.style.transform = 'translateY(' + (-saved) + 'px)';
    rate = rateT = 1; revStart = vt;
    if (!GL || RM.matches) { setPlace('css3d'); return toRoom(); }
    if (S.screenMode === 'live') { setPlace('css3d'); mode = 'out'; }
    else { if (S.screenMode === 'dissolve') takeSnapshot(); setPlace('overlay'); reveal(1); mode = 'hide'; }
    kick();
  }
  function toRoom() { mode = 'room'; camT = 0; page.dataset.mode = 'room'; hint.hidden = false; draw(); }
  function enter() {
    if (mode !== 'room') return;
    hint.hidden = true; page.dataset.mode = 'scene';
    if (!GL || RM.matches) return toSite();
    mode = 'in'; camStart = vt; rate = rateT = 1; kick();
  }
  function start({ build = true } = {}) {
    plan = makePlan(); vt = 0; rate = rateT = 1; camT = 0; saved = 0;
    camStart = S.delay + S.camAt;
    hint.hidden = true; dis.hidden = true; page.dataset.mode = 'scene'; scene3.hidden = false;
    site.style.transform = ''; setPlace('css3d');
    if (!build || !GL || RM.matches) { settle(); return toSite(); }
    mode = 'intro'; poseAll(); kick();
  }
  function replayCamera() {
    if (mode === 'site') return back();
    settle(); setPlace('css3d'); dis.hidden = true; hint.hidden = true; page.dataset.mode = 'scene';
    mode = 'in'; camStart = vt; rate = rateT = 1; kick();
  }

  /* in the room, the monitor or the desk takes you back in */
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const hit = e => { if (!GL) return false; ptr.set(e.clientX / vw * 2 - 1, -(e.clientY / vh) * 2 + 1); ray.setFromCamera(ptr, camera); return ray.intersectObjects(W.pick, false).length > 0; };
  scene3.addEventListener('click', e => { if (mode === 'room' && hit(e)) enter(); }, sig);
  scene3.addEventListener('pointermove', e => { if (mode === 'room') scene3.style.cursor = hit(e) ? 'pointer' : ''; }, sig);

  /* any scroll, key or tap during the intro speeds it up instead of cutting to the end */
  const skip = e => {
    if (mode !== 'intro' && mode !== 'in' && mode !== 'reveal') return;
    if (e.target instanceof Element && e.target.closest('.dtune,.skip')) return;
    rateT = S.skipRate;
  };
  for (const ev of ['wheel', 'touchstart', 'keydown', 'pointerdown']) addEventListener(ev, skip, { passive: true, signal: ac.signal });
  $('#skip').addEventListener('click', () => { rateT = S.skipRate; }, sig);
  page.querySelectorAll('[data-act=room]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); back(); }, sig));
  $('#sitback').addEventListener('click', () => enter(), sig);
  addEventListener('resize', () => { size(); if (mode !== 'site') draw(); }, sig);

  /* the work row and the journey, as in V7 */
  const cards = $('#cards'), prev = $('#prev'), next = $('#next'), obs = [];
  if (cards && prev && next) {
    const step = () => { const c = cards.querySelector('.card'); return c ? c.getBoundingClientRect().width + 20 : 300; };
    const ends = () => { prev.disabled = cards.scrollLeft < 4; next.disabled = cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - 4; };
    prev.addEventListener('click', () => cards.scrollBy({ left: -step(), behavior: RM.matches ? 'auto' : 'smooth' }), sig);
    next.addEventListener('click', () => cards.scrollBy({ left: step(), behavior: RM.matches ? 'auto' : 'smooth' }), sig);
    cards.addEventListener('scroll', ends, { passive: true, signal: ac.signal });
    { const ro = new ResizeObserver(ends); ro.observe(cards); obs.push(ro); }
    ends();
  }
  /* the journey measures itself, so it lays out only while the site is in page flow */
  let endJourney = () => {};
  const journey = () => { endJourney(); endJourney = initJourney($('#jroot')); };

  size();
  let seen = false; try { seen = !!sessionStorage.getItem(SEEN); } catch (e) { /* no storage */ }
  start({ build: tune || !seen });

  const endTune = tune ? initDeskTune(page, S, DEF, {
    change(key) {
      if (key.endsWith('Ease')) curves();
      if (key === 'pixel' || key === 'over' || key === 'tile') size();
      if (key === 'screenMode' && mode === 'site') { /* applies on the next flight */ }
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* no storage */ }
      if (mode === 'room') draw();
    },
    reset() { Object.assign(S, DEF); curves(); size(); try { localStorage.removeItem(KEY); } catch (e) { /* no storage */ } },
    replay: () => { scrollTo({ top: 0, behavior: 'instant' }); start(); },
    camera: replayCamera
  }) : () => {};

  return () => {
    ac.abort(); obs.forEach(o => o.disconnect()); endJourney(); endTune();
    if (raf) cancelAnimationFrame(raf);
    setPlace('flow');
    if (GL) { renderer.dispose(); renderer.domElement.remove(); W.scene.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
    css.domElement.remove();
  };
}
