/* hero accents: a whiteboard and a parcel set into the headline, and the avatar walking over to the work */
import { sprite, render, walker, arm, adult, OUT, P, SW, SH } from './journey';

const crop = c => {
  const d = c.getContext('2d').getImageData(0, 0, SW, SH).data;
  let x0 = SW, y0 = SH, x1 = 0, y1 = 0;
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) if (d[(y * SW + x) * 4 + 3]) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
  o.getContext('2d').drawImage(c, -x0, -y0); return o;
};

/* n = how many chart segments are drawn */
function board(n) {
  const s = sprite();
  s.part({ auto: false }); s.line(6, 20, 3, 27, P.steel, 1); s.line(20, 20, 23, 27, P.steel, 1);
  s.part(); s.rect(1, 2, 25, 18, P.steel);
  s.part({ auto: false }); s.rect(2, 3, 23, 16, P.white, 'l');
  s.part({ auto: false });
  const pts = [[4, 16], [9, 13], [13, 14], [18, 8], [22, 5]];
  for (let i = 1; i <= n; i++) s.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], P.forest, 1, 's');
  s.rect(4, 5, 5, 1, P.char, 'l'); s.rect(4, 7, 3, 1, P.char, 'l');
  s.part({ auto: false }); s.rect(18, 15, 5, 3, P.sun); s.rect(18, 17, 5, 1, P.sun, 's');
  return s;
}
function parcel(k) {
  const s = sprite(), y = k ? 1 : 3;
  s.part(); s.rect(2, y + 4, 18, 13, P.wood);
  s.part(); s.rect(1, y, 20, 5, P.wood); s.rect(1, y + 4, 20, 1, P.wood, 's');
  s.part({ auto: false }); s.rect(10, y, 2, 17, P.oat, 'l'); s.rect(4, y + 9, 5, 1, P.brown, 'l'); s.rect(4, y + 11, 3, 1, P.brown, 'l');
  s.part({ auto: false }); s.rect(14, y + 11, 4, 4, P.white); s.rect(15, y + 12, 2, 1, P.forest);
  return s;
}
function wave(k) {
  const s = sprite(), x = 29, y = 4, f = OUT[5];
  adult(s, x, y, { ...f, face: { mouth: 'smile' } });
  arm(s, [[x, y + 16], [x - 1, y + 25], [x - 1, y + 32]], f.top);
  arm(s, [[x + 13, y + 16], [x + 18, y + 10], [x + 19 + (k ? 2 : 0), y + 2]], f.top);
  return s;
}

const cache = new Map();
const pic = (k, make) => { let c = cache.get(k); if (!c) { c = crop(render(make())); cache.set(k, c); } return c; };
function paint(cv, img, scale) {
  if (cv.width !== img.width * scale || cv.height !== img.height * scale) { cv.width = img.width * scale; cv.height = img.height * scale; }
  const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.clearRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
}

export function initHero(page) {
  const wb = page.querySelector('#wb'), bx = page.querySelector('#bx');
  if (!wb || !bx) return () => {};
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches, ac = new AbortController(), sig = { signal: ac.signal };
  const timers = new Set(), later = (f, ms) => { const t = setTimeout(() => { timers.delete(t); f(); }, ms); timers.add(t); };
  let raf = 0, wbN = 4, bxK = 0, alive = true;
  const objs = () => { paint(wb, pic('b' + wbN, () => board(wbN)), 4); paint(bx, pic('p' + bxK, () => parcel(bxK)), 4); };
  objs();

  let scrib = 0;
  const scribble = () => { if (scrib || RM) return; wbN = 0; objs(); scrib = setInterval(() => { wbN++; objs(); if (wbN >= 4) { clearInterval(scrib); scrib = 0; } }, 140); };
  let shipping = false;
  const ship = () => {
    if (shipping || RM) return; shipping = true; bxK = 1; objs();
    bx.animate([{ transform: 'none' }, { transform: 'translateY(-18%)', offset: .2 }, { transform: 'translateX(60%)', opacity: 0, offset: .5 }, { transform: 'translateX(-40%)', opacity: 0, offset: .51 }, { transform: 'none', opacity: 1 }], { duration: 1100, easing: 'cubic-bezier(.23,1,.32,1)' })
      .finished.then(() => { if (!alive) return; bxK = 0; objs(); shipping = false; }, () => {});
  };
  for (const [el, fn] of [[wb, scribble], [bx, ship]]) { el.addEventListener('pointerenter', fn, sig); el.addEventListener('click', fn, sig); }

  /* the objects drop in once the site is on screen, like the room's objects */
  let dropped = false;
  const drop = () => {
    if (dropped || RM) return; dropped = true;
    const d = (el, delay) => el.animate([{ transform: 'translateY(-120%) scaleY(1.1)', opacity: 0 }, { transform: 'scale(1.08,.86)', opacity: 1, offset: .7 }, { transform: 'none', opacity: 1 }], { duration: 650, delay, easing: 'cubic-bezier(.33,0,.2,1)', fill: 'backwards' });
    d(wb, 250); d(bx, 500); later(scribble, 900);
  };

  /* the avatar walks into the work section's lane when it first comes into view */
  const lane = page.querySelector('#lane');
  let av = null, walked = false, waving = 0;
  const big = () => innerWidth > 760;
  const pose = img => { paint(av, img, 2); av.style.height = big() ? '' : '100px'; };
  const stand = () => pose(pic('w1', () => walker(5, 1, 1)));
  const doWave = () => { if (waving) return; let i = 0; waving = setInterval(() => { pose(pic('v' + (i % 2), () => wave(i % 2))); if (++i > 5) { clearInterval(waving); waving = 0; stand(); } }, 180); };
  const walk = () => {
    if (walked) return; walked = true;
    if (RM) return stand();
    const from = -lane.clientWidth - 40, dur = 2400, t0 = performance.now() + 300; let k = 0, last = 0;
    const step = now => {
      raf = 0; const u = Math.min(1, Math.max(0, (now - t0) / dur)), e = 1 - Math.pow(1 - u, 2.2);
      av.style.transform = `translateX(${from * (1 - e)}px)`;
      if (u < 1) { if (now - last > 125) { k = (k + 1) % 4; last = now; pose(pic('w' + k, () => walker(5, k, 1))); } raf = requestAnimationFrame(step); }
      else { stand(); later(doWave, 250); }
    };
    pose(pic('w0', () => walker(5, 0, 1))); av.style.transform = `translateX(${from}px)`; raf = requestAnimationFrame(step);
  };
  let io = null;
  if (lane) {
    av = document.createElement('canvas'); av.className = 'avatar'; av.setAttribute('role', 'img'); av.setAttribute('aria-label', 'Pixel Arvind walks over to the work and waves');
    lane.appendChild(av); stand(); av.style.transform = RM ? '' : 'translateX(-200vw)';
    av.addEventListener('pointerenter', doWave, sig); av.addEventListener('click', doWave, sig);
    addEventListener('resize', () => { if (av && !waving && walked) stand(); }, sig);
  }
  const begin = () => {
    drop();
    if (lane && !io) { io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); walk(); } }, { threshold: .6 }); io.observe(lane); }
  };

  /* on the desk home, wait until the monitor has become the site */
  let mo = null;
  if (page.dataset.mode && page.dataset.mode !== 'site') { mo = new MutationObserver(() => { if (page.dataset.mode === 'site') { mo.disconnect(); begin(); } }); mo.observe(page, { attributes: true, attributeFilter: ['data-mode'] }); }
  else begin();

  return () => {
    alive = false; ac.abort(); mo?.disconnect(); io?.disconnect(); cancelAnimationFrame(raf);
    clearInterval(scrib); clearInterval(waving); timers.forEach(clearTimeout); av?.remove();
  };
}
