/* the journey: one 32-bit avatar walks a dotted path between six stops and acts out each one */
const SW = 72, SH = 72;
const mix = (a, b, t) => { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
const ramp = (o, s, b, l) => ({ o, s, b, l, t: mix(o, s, .45) });
const PAL = {
  skin: ramp('#4e2a18', '#93583a', '#b5764a', '#cf9567'),
  hair: ramp('#0b0a0e', '#16141a', '#24212a', '#4b4656'),
  eye: ramp('#0b090c', '#17131a', '#17131a', '#3a3340'),
  lip: ramp('#3d1c12', '#6b3424', '#8a4836', '#a35d48'),
  oat: ramp('#7a6a4f', '#c4b291', '#e0d2b6', '#f3ebdb'),
  navy: ramp('#121827', '#222b42', '#323e5b', '#4a5a7d'),
  char: ramp('#16171a', '#2c2e33', '#41444a', '#5c6067'),
  stone: ramp('#56503f', '#958b73', '#b5ab92', '#cfc7b2'),
  denim: ramp('#121726', '#232c40', '#33405a', '#4b5b79'),
  white: ramp('#77746b', '#cfccc2', '#eeece6', '#ffffff'),
  forest: ramp('#13241a', '#264434', '#365f48', '#4f7f62'),
  red: ramp('#4f1810', '#8c3222', '#b4452f', '#d0654c'),
  wood: ramp('#45301f', '#87603d', '#a8794d', '#c89b69'),
  brown: ramp('#21140d', '#3d2619', '#563624', '#734b33'),
  leaf: ramp('#1c3a22', '#3a6a42', '#4f8a58', '#78ad72'),
  sun: ramp('#9a6a14', '#d79b2e', '#e8b84b', '#f6d987'),
  steel: ramp('#3b3e44', '#7d828a', '#a3a8b0', '#c7cbd1'),
  screen: ramp('#0c0d10', '#16181c', '#1e2126', '#2b2f36'),
  mint: ramp('#2c5a3b', '#7fc08e', '#9fd6a4', '#c6ecc8'),
  ice: ramp('#c9d3dc', '#c9d3dc', '#c9d3dc', '#c9d3dc'),
  ground: ramp('#e4e2db', '#e4e2db', '#e4e2db', '#e4e2db'),
  glass: ramp('#6f8790', '#cfdde2', '#e6eff1', '#ffffff')
};
const P = PAL;

function sprite() {
  const px = new Array(SW * SH).fill(null), parts = [];
  let cur;
  const s = {
    px, parts,
    part(o = {}) { cur = { id: parts.length, auto: o.auto !== false, sep: !!o.sep, ol: o.ol !== false }; parts.push(cur); return s; },
    p(x, y, r, k = 'b') { if (x < 0 || y < 0 || x >= SW || y >= SH) return; px[y * SW + x] = { r, k, part: cur.id }; },
    rect(x, y, w, h, r, k = 'b') { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) s.p(i, j, r, k); },
    clear(x, y, w = 1, h = 1) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < SW && j < SH) px[j * SW + i] = null; },
    line(x0, y0, x1, y1, r, w = 1, k = 'b') {
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); if (!Number.isFinite(x0 + y0 + x1 + y1)) return;
      const a = -Math.floor((w - 1) / 2);
      let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy;
      for (;;) { s.rect(x0 + a, y0 + a, w, w, r, k); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
    },
    poly(pts, r, w = 1, k = 'b') { for (let i = 1; i < pts.length; i++) s.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], r, w, k); },
    disc(cx, cy, rad, r, k = 'b') { for (let j = -rad; j <= rad; j++) for (let i = -rad; i <= rad; i++) if (i * i + j * j <= rad * rad + rad * .6) s.p(cx + i, cy + j, r, k); },
    map(x, y, rows, leg) { rows.forEach((row, j) => [...row].forEach((ch, i) => { const L = leg[ch]; if (L) s.p(x + i, y + j, L[0], L[1]); })); }
  };
  return s.part();
}

function render(s) {
  const { px, parts } = s, at = (x, y) => (x < 0 || y < 0 || x >= SW || y >= SH) ? null : px[y * SW + x];
  const out = px.map(c => c && { ...c });
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    const c = px[y * SW + x]; if (!c) continue;
    const same = (dx, dy) => { const n = at(x + dx, y + dy); return n && n.part === c.part; };
    if (c.k === 'b' && parts[c.part].auto) { if (!same(1, 0)) out[y * SW + x].k = 's'; else if (!same(-1, 0)) out[y * SW + x].k = 'l'; }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = at(x + dx, y + dy);
      if (n && n.part > c.part && parts[n.part].sep && c.r !== P.eye) { const o = out[y * SW + x]; o.k = o.k === 's' ? 'o' : 's'; break; }
    }
  }
  const col = out.map(c => c ? c.r[c.k] : null);
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    if (px[y * SW + x]) continue;
    for (const [dx, dy, lit] of [[0, 1, 1], [1, 0, 1], [0, -1, 0], [-1, 0, 0]]) {
      const n = at(x + dx, y + dy);
      if (n && parts[n.part].ol) { col[y * SW + x] = lit ? n.r.t : n.r.o; break; }
    }
  }
  const c = document.createElement('canvas'); c.width = SW; c.height = SH;
  const g = c.getContext('2d');
  col.forEach((v, i) => { if (v) { g.fillStyle = v; g.fillRect(i % SW, Math.floor(i / SW), 1, 1); } });
  return c;
}

/* head: 14 x 13, face cols 2-11, ears cols 1 and 12 */
const HEAD = [
  '.....H..HH....',
  '...HHhHHHhH...',
  '..HhhHHhhHHH..',
  '.HhhHHhHHHHHH.',
  '.HhHHHHHHHHHdd',
  '.HHHLSHHSHHHdd',
  '.HdLSSSSSSSSd.',
  '.dShBBSSBBhSd.',
  '.SLSESSSSESss.',
  '.sSSESSsSESss.',
  '..SSSSSsSSSs..',
  '..sSSsmmsSSs..',
  '...SSSSSSSs...',
  '....sSSSss....'
];
const HL = { H: [P.hair, 'b'], h: [P.hair, 'l'], d: [P.hair, 's'], S: [P.skin, 'b'], L: [P.skin, 'l'], s: [P.skin, 's'], E: [P.eye, 'b'], B: [P.hair, 'b'], M: [P.lip, 'b'], m: [P.lip, 's'] };
function head(s, x, y, o = {}) {
  s.part({ auto: false });
  const rows = HEAD.slice();
  const put = (r, c, ch) => { rows[r] = rows[r].slice(0, c) + ch + rows[r].slice(c + 1); };
  if (o.kid) { rows[0] = '..............'; rows[1] = '...HHhHHHH....'; rows[5] = '.HHHHHHHHHHHd.'; rows[6] = '.HdSSSSSSSSSd.'; rows[12] = '..SSSSSSSSs...'; rows[13] = '...ssSSSSs....'; }
  // eyes
  put(8, 4, 'S'); put(9, 4, 'S'); put(8, 9, 'S'); put(9, 9, 'S');
  if (o.blink) { for (const c of [4, 9]) put(9, c, 'E'); }
  else if (o.look === 'down') { put(9, 4, 'E'); put(9, 3, 'E'); put(9, 9, 'E'); put(9, 10, 'E'); }
  else { const dx = o.look === 'left' ? -1 : o.look === 'right' ? 1 : 0; for (const c of [4, 9]) { put(8, c + dx, 'E'); put(9, c + dx, 'E'); } }
  // mouth
  if (o.mouth === 'smile') { rows[11] = '..sSSmSSmSSs..'; rows[12] = rows[12].slice(0, 6) + 'mm' + rows[12].slice(8); }
  else if (o.mouth === 'talk') { rows[11] = '..sSSmmmmSSs..'; rows[12] = rows[12].slice(0, 6) + 'mm' + rows[12].slice(8); }
  s.map(x, y, rows, HL);
}

/* adult body, origin = top-left of the head box; feet end at y + 62 */
function adult(s, x, y, f) {
  if (!f.seated) {
    const a = f.walk == null ? 0 : [2, 0, -2, 0][f.walk], dl = -a, dr = a, ll = a < 0 ? 1 : 0, rl = a > 0 ? 1 : 0;
    s.part(); s.rect(x + 1, y + 33, 12, 5, f.pants);
    s.part(); s.rect(x + 1, y + 38, 5, 9, f.pants); s.rect(x + 1 + dl, y + 47 - ll, 5, 7, f.pants); s.rect(x + (f.taper ? 2 : 1) + dl, y + 54 - ll, f.taper ? 4 : 5, 8, f.pants);
    s.part(); s.rect(x + 8, y + 38, 5, 9, f.pants); s.rect(x + 8 + dr, y + 47 - rl, 5, 7, f.pants); s.rect(x + 8 + dr, y + 54 - rl, f.taper ? 4 : 5, 8, f.pants);
    const sh = f.shoes || P.white, so = sh === P.white ? P.stone : sh;
    s.part({ auto: false }); s.rect(x + dl, y + 62 - ll, 6, 2, sh); s.rect(x + 1 + dl, y + 61 - ll, 4, 1, sh, 'l'); s.rect(x + dl, y + 64 - ll, 6, 1, so, 's'); s.p(x + dl, y + 63 - ll, sh, 's');
    s.part({ auto: false }); s.rect(x + 8 + dr, y + 62 - rl, 6, 2, sh); s.rect(x + 9 + dr, y + 61 - rl, 4, 1, sh, 'l'); s.rect(x + 8 + dr, y + 64 - rl, 6, 1, so, 's'); s.p(x + 13 + dr, y + 63 - rl, sh, 's');
    s.part({ ol: false, auto: false }); s.rect(x - 2, y + 65, 18, 1, P.ground);
  }
  // neck
  s.part({ auto: false }); s.rect(x + 5, y + 12, 4, 3, P.skin); s.rect(x + 5, y + 12, 4, 1, P.skin, 's'); s.p(x + 8, y + 13, P.skin, 's');
  // torso
  const t = f.top, len = f.coat ? 44 : 33;
  s.part();
  s.rect(x, y + 14, 14, 1, t); s.rect(x - 1, y + 15, 16, 11, t); s.rect(x, y + 26, 14, len - 26, t);
  if (f.coat) s.rect(x - 1, y + 36, 16, len - 36, t);
  s.rect(x + 11, y + 16, 3, len - 17, t, 's'); s.rect(x, y + 16, 1, 10, t, 'l');
  if (f.inner) {
    const iw = f.coat ? [4, 6] : [5, 4];
    s.rect(x + iw[0], y + 14, iw[1], (f.coat ? 33 : len) - 14, f.inner, 'b');
    s.rect(x + iw[0] + iw[1] - 1, y + 15, 1, (f.coat ? 33 : len) - 15, f.inner, 's');
    s.rect(x + iw[0], y + 14, iw[1], 1, f.inner, 'l');
    // lapels / collar points of the open layer
    s.p(x + iw[0] - 1, y + 15, t, 'l'); s.p(x + iw[0] - 1, y + 16, t, 'l'); s.p(x + iw[0] + iw[1], y + 15, t, 's'); s.p(x + iw[0] + iw[1], y + 16, t, 's');
    for (let j = y + 17; j < y + len; j++) { s.p(x + iw[0] - 1, j, t, 'l'); s.p(x + iw[0] + iw[1], j, t, 's'); }
    if (f.coat) { s.rect(x + 4, y + 33, 6, 1, f.inner, 's'); }
  }
  if (f.lapel) { // blazer: V of knit inside, lapel lines
    for (let j = 0; j < 9; j++) { const w = Math.max(2, 6 - Math.floor(j / 1.5) * 1); const cx = x + 7 - w / 2; s.rect(cx, y + 14 + j, w, 1, f.lapel, j === 0 ? 'l' : 'b'); }
    for (let j = 0; j < 9; j++) { s.p(x + 3 + Math.floor(j / 3), y + 15 + j, t, 'l'); s.p(x + 10 - Math.floor(j / 3), y + 15 + j, t, 's'); }
    s.p(x + 7, y + 26, P.char, 'o'); s.rect(x + 1, y + 29, 3, 1, t, 's'); s.rect(x + 10, y + 29, 3, 1, t, 's');
  }
  if (f.knit) { // crew neck rib, cable lines, ribbed hem
    s.rect(x + 4, y + 14, 6, 1, t, 'l'); s.p(x + 4, y + 15, t, 's'); s.p(x + 9, y + 15, t, 's');
    for (let j = y + 17; j < y + len - 2; j++) { const k = (j - y) % 2 ? 'l' : 's'; s.p(x + 3, j, t, k); s.p(x + 10, j, t, k === 'l' ? 's' : 'l'); s.p(x + 6, j, t, (j - y) % 3 ? 'b' : 'l'); }
    for (let i = x; i < x + 14; i++) s.rect(i, y + len - 2, 1, 2, t, (i - x) % 2 ? 's' : 'b');
  }
  if (f.collar) { s.p(x + 5, y + 14, f.collar, 'b'); s.p(x + 8, y + 14, f.collar, 'b'); }
  if (f.scarf) {
    s.part({ sep: true });
    s.rect(x + 3, y + 12, 8, 3, f.scarf); s.rect(x + 3, y + 12, 8, 1, f.scarf, 'l');
    s.rect(x + 9, y + 15, 3, 12, f.scarf); s.rect(x + 9, y + 15, 1, 12, f.scarf, 'l'); s.rect(x + 11, y + 15, 1, 12, f.scarf, 's');
    for (let i = 0; i < 3; i += 2) s.p(x + 9 + i, y + 27, f.scarf, 's');
  }
  head(s, x, y - 1 + 0, f.face);
}

/* limb with a hand; pts in absolute grid units */
function arm(s, pts, sleeve, hand = true, w = 4) {
  s.part({ sep: true }); s.poly(pts, sleeve, w);
  const [hx, hy] = pts[pts.length - 1], [px, py] = pts[pts.length - 2];
  if (hand) { s.part({ sep: true }); s.rect(hx - 1 + Math.sign(hx - px), hy - 1 + Math.sign(hy - py) * 2, 3, 3, P.skin); }
  if (sleeve !== P.skin) { s.part({ auto: false }); }
}


/* scenes: one per stop, k = action frame 0-3, o.blink closes the eyes */
const FIG = [[24, 20], [26, 4], [44, 4], [29, 10], [12, 4], [30, 4]];
const SCENES = [
  (k, o) => {
    const s = sprite();
    s.part({ auto: false }); s.poly([[9, 68], [9, 50], [10, 36], [12, 24]], P.wood, 3); for (let j = 30; j < 68; j += 4) s.rect(8, j, 3, 1, P.wood, 's');
    s.part({ auto: false });
    for (const pts of [[[12, 22], [5, 22], [1, 27]], [[12, 22], [6, 15], [2, 16]], [[12, 22], [15, 14], [21, 14]], [[12, 22], [20, 20], [24, 26]], [[12, 22], [12, 15], [10, 11]]]) s.poly(pts, P.leaf, 2);
    for (const pts of [[[12, 21], [6, 21]], [[12, 21], [16, 15]], [[12, 22], [19, 20]]]) s.poly(pts, P.leaf, 1, 'l');
    s.rect(11, 24, 2, 2, P.wood, 's'); s.rect(13, 23, 2, 2, P.wood, 'b');
    s.part({ auto: false }); s.disc(61, 10, 5, P.sun); s.rect(58, 7, 3, 2, P.sun, 'l'); s.rect(62, 12, 3, 2, P.sun, 's');
    const x = 24, y = 22, kick = k === 1 || k === 2;
    s.part(); s.poly([[x + 4, y + 30], [x + 4, y + 38]], P.skin, 4); s.part(); s.poly([[x + 4, y + 39], [x + 4, y + 42]], P.white, 4);
    s.part({ auto: false }); s.rect(x + 1, y + 43, 6, 2, P.char); s.rect(x + 2, y + 42, 4, 1, P.char, 'l'); s.rect(x + 1, y + 45, 6, 1, P.char, 's');
    if (kick) { s.part(); s.poly([[x + 10, y + 29], [x + 15, y + 32], [x + 20, y + 33]], P.skin, 4); s.part({ auto: false }); s.rect(x + 21, y + 31, 3, 5, P.char); s.rect(x + 21, y + 31, 1, 5, P.char, 'l'); }
    else { s.part(); s.poly([[x + 10, y + 29], [x + 14, y + 34], [x + 18, y + 37]], P.skin, 4); s.part(); s.poly([[x + 19, y + 38], [x + 21, y + 39]], P.white, 4); s.part({ auto: false }); s.rect(x + 22, y + 37, 3, 5, P.char); s.rect(x + 22, y + 37, 1, 5, P.char, 'l'); }
    s.part({ ol: false, auto: false }); s.rect(x - 2, y + 46, 14, 1, P.ground);
    s.part(); s.rect(x + 1, y + 24, 12, 6, P.white); s.rect(x + 1, y + 24, 12, 1, P.white, 's');
    s.part(); s.rect(x + 1, y + 12, 12, 1, P.red); s.rect(x, y + 13, 14, 11, P.red); s.rect(x + 11, y + 14, 2, 10, P.red, 's');
    s.rect(x + 6, y + 13, 2, 11, P.white, 'b'); s.rect(x + 7, y + 13, 1, 11, P.white, 's');
    s.rect(x + 4, y + 12, 6, 1, P.white, 'l'); s.p(x + 5, y + 13, P.white, 's'); s.p(x + 8, y + 13, P.white, 's');
    s.part({ auto: false }); s.rect(x + 5, y + 10, 4, 2, P.skin); s.rect(x + 5, y + 10, 4, 1, P.skin, 's');
    arm(s, [[x + 1, y + 14], [x - 4, y + 17], [x - 8, y + 15]], P.skin, true, 3); s.part({ sep: true, auto: false }); s.rect(x - 1, y + 13, 3, 3, P.red); s.rect(x - 1, y + 16, 3, 1, P.white, 'l');
    arm(s, [[x + 13, y + 14], [x + 16, y + 19], [x + 18, y + 24]], P.skin, true, 3); s.part({ sep: true, auto: false }); s.rect(x + 12, y + 13, 3, 3, P.red, 's'); s.rect(x + 12, y + 16, 3, 1, P.white, 'b');
    head(s, x, y - 2, { kid: true, look: 'right', mouth: 'smile', blink: o.blink });
    const bx = 53 + [0, 1, 6, 10][k], by = 63 - [0, 0, 3, 1][k];
    s.part({ auto: false }); s.disc(bx, by, 4, P.white); s.rect(bx - 1, by - 1, 3, 2, P.char); s.p(bx - 3, by - 3, P.char, 'b'); s.p(bx + 3, by - 2, P.char, 'b'); s.p(bx - 2, by + 3, P.char, 'b'); s.p(bx + 2, by + 3, P.char, 'b'); s.p(bx - 2, by - 2, P.white, 'l');
    s.part({ ol: false, auto: false }); s.rect(49, 68, 22, 1, P.ground);
    if (k >= 2) { s.part({ ol: false, auto: false }); for (const [a, b] of [[bx - 8, by - 2], [bx - 9, by + 1], [bx - 8, by + 4]]) s.rect(a, b, 2, 1, P.stone, 'l'); }
    return s;
  },
  (k, o) => {
    const s = sprite();
    s.part({ auto: false }); s.rect(52, 65, 16, 4, P.forest); s.rect(52, 65, 16, 1, P.forest, 'l'); s.rect(53, 66, 1, 3, P.oat, 'l');
    s.part({ auto: false }); s.rect(54, 61, 13, 4, P.navy); s.rect(54, 61, 13, 1, P.navy, 'l'); s.rect(65, 62, 1, 3, P.oat, 'l');
    s.part({ auto: false }); s.rect(53, 57, 14, 4, P.red); s.rect(53, 57, 14, 1, P.red, 'l'); s.rect(54, 58, 1, 3, P.oat, 'l');
    s.part({ auto: false }); s.rect(55, 54, 10, 3, P.oat); s.rect(55, 54, 10, 1, P.oat, 'l');
    s.part({ ol: false, auto: false }); s.rect(50, 69, 20, 1, P.ground);
    const x = 26, y = 4;
    adult(s, x, y, { top: P.stone, inner: P.white, pants: P.denim, face: { mouth: k === 3 ? 'smile' : undefined, blink: o.blink } });
    arm(s, [[x, y + 16], [x - 1, y + 24], [x + 2, y + 26]], P.stone, false);
    arm(s, [[x + 13, y + 16], [x + 14, y + 24], [x + 11, y + 26]], P.stone, false);
    s.part({ auto: false });
    s.rect(x - 1, y + 21, 16, 1, P.forest, 's'); s.rect(x, y + 20, 7, 6, P.white, 'l'); s.rect(x + 7, y + 20, 1, 7, P.forest, 'b');
    if (k === 1) { s.rect(x + 8, y + 18, 5, 7, P.white, 'b'); s.rect(x + 8, y + 18, 5, 1, P.white, 'l'); }
    else if (k === 2) { s.rect(x + 6, y + 15, 2, 11, P.white, 'l'); s.rect(x + 8, y + 20, 6, 6, P.white, 'b'); }
    else s.rect(x + 7, y + 20, 7, 6, P.white, 'b');
    s.rect(x + 7, y + 20, 1, 7, P.forest, 'b'); s.rect(x - 1, y + 26, 16, 1, P.forest, 'b');
    for (const r of [21, 23, 25]) { s.rect(x + 1, y + r, 5, 1, P.white, 's'); if (k !== 2) s.rect(x + 9, y + r, 4, 1, P.white, 's'); }
    s.part({ sep: true }); s.rect(x - 1, y + 23, 3, 3, P.skin); s.part({ sep: true }); s.rect(x + 12, y + 23 - (k === 2 ? 3 : 0), 3, 3, P.skin);
    return s;
  },
  (k, o) => {
    const s = sprite();
    s.part({ auto: false }); s.line(7, 34, 5, 69, P.steel, 2); s.line(29, 34, 31, 69, P.steel, 2);
    s.part({ auto: false }); s.rect(2, 8, 32, 26, P.white, 'l'); s.rect(2, 8, 32, 1, P.steel, 'b'); s.rect(2, 33, 32, 1, P.steel, 's'); s.rect(2, 8, 1, 26, P.steel, 'l'); s.rect(33, 8, 1, 26, P.steel, 's');
    s.rect(2, 34, 32, 1, P.steel, 'b'); s.rect(5, 11, 14, 1, P.char, 'b');
    s.rect(5, 14, 7, 5, P.navy, 'l'); s.rect(6, 15, 5, 3, P.white, 'l'); s.rect(12, 16, 3, 1, P.char, 's'); s.p(14, 15, P.char, 's'); s.p(14, 17, P.char, 's'); s.rect(15, 14, 7, 5, P.forest, 'l'); s.rect(16, 15, 5, 3, P.white, 'l');
    const h = [0, 2, 5, 5][k];
    s.rect(6, 27, 3, 4, P.navy, 'b'); s.rect(10, 25, 3, 6, P.navy, 'b'); s.rect(14, 22, 3, 9, P.forest, 'b'); s.rect(18, 31 - h, 3, h, P.forest, 'b'); s.rect(5, 31, 18, 1, P.char, 'b');
    if (k >= 2) s.poly([[22, 26], [24, 28], [29, 22]], P.forest, 1, 'b');
    const x = 44, y = 4, hx = [-9, -13, -11, -9][k], hy = [7, 12, 9, 7][k];
    adult(s, x, y, { top: P.navy, lapel: P.oat, pants: P.char, shoes: P.brown, taper: true, face: { look: 'left', mouth: k % 2 ? 'talk' : undefined, blink: o.blink } });
    arm(s, [[x + 13, y + 16], [x + 15, y + 25], [x + 15, y + 32]], P.navy);
    arm(s, [[x, y + 16], [x - 5, y + 12 + (hy - 7) / 2 | 0], [x + hx, y + hy]], P.navy);
    s.part({ auto: false }); s.rect(x + hx - 3, y + hy - 4, 2, 1, P.forest, 'b'); s.rect(x + hx - 4, y + hy - 5, 1, 1, P.forest, 'o');
    return s;
  },
  (k, o) => {
    const s = sprite();
    s.part({ auto: false }); s.rect(2, 6, 22, 22, P.white, 'l'); s.rect(5, 9, 1, 16, P.char, 'b'); s.rect(5, 24, 17, 1, P.char, 'b');
    s.poly([[7, 12], [20, 12]], P.forest, 1, 'b'); s.poly([[7, 13], [10, 14], [13, 18], [16, 17], [20, 22]], P.red, 1, 'b');
    const x = 29, y = 10, t = k % 2;
    adult(s, x, y, { top: P.oat, knit: true, collar: P.white, scarf: P.forest, seated: true, face: { mouth: k === 3 ? 'smile' : undefined, blink: o.blink } });
    arm(s, [[x, y + 16], [x - 3, y + 26], [x + 1, y + 32 - t]], P.oat, true);
    arm(s, [[x + 13, y + 16], [x + 16, y + 26], [x + 12, y + 31 + t]], P.oat, true);
    s.part({ auto: false }); s.rect(x - 4, y + 22, 22, 13, P.steel); s.rect(x - 4, y + 22, 22, 1, P.steel, 'l'); s.rect(x - 4, y + 22, 1, 13, P.steel, 'l'); s.rect(x + 17, y + 22, 1, 13, P.steel, 's'); s.rect(x + 6, y + 27, 2, 2, k === 2 ? P.mint : P.white, 'l');
    s.part({ auto: false }); s.rect(x - 6, y + 35, 26, 2, P.steel, 's'); s.rect(x - 6, y + 35, 26, 1, P.steel, 'b');
    s.part({ auto: false }); s.rect(0, 47, 72, 3, P.wood); s.rect(0, 47, 72, 1, P.wood, 'l'); s.rect(0, 49, 72, 1, P.wood, 's');
    s.part({ auto: false }); s.rect(3, 50, 3, 18, P.wood, 's'); s.rect(66, 50, 3, 18, P.wood, 's');
    s.part({ auto: false }); s.rect(9, 40, 6, 7, P.forest); s.rect(9, 40, 6, 1, P.forest, 'l'); s.rect(15, 42, 2, 3, P.forest, 's'); s.rect(10, 41, 1, 5, P.forest, 'l');
    s.part({ ol: false, auto: false }); for (const [a, b] of [[11, 36 - t], [12, 33 + t]]) s.rect(a, b, 1, 2, P.stone, 'l');
    s.part({ auto: false }); s.rect(59, 35, 3, 4, P.glass, 'l'); s.rect(57, 39, 7, 8, P.glass); s.rect(57, 42, 7, 5, P.mint); s.rect(57, 42, 7, 1, P.mint, 'l'); s.p(58, 40, P.glass, 'l');
    return s;
  },
  (k, o) => {
    const s = sprite();
    s.part({ auto: false }); s.rect(38, 42, 34, 3, P.wood); s.rect(38, 42, 34, 1, P.wood, 'l'); s.rect(41, 45, 2, 23, P.wood, 's'); s.rect(67, 45, 2, 23, P.wood, 's');
    s.part({ auto: false }); s.rect(55, 33, 3, 9, P.char, 's'); s.rect(51, 41, 11, 1, P.char, 'b');
    s.part({ auto: false }); s.rect(44, 10, 27, 23, P.screen); s.rect(44, 10, 27, 1, P.screen, 'l');
    s.rect(47, 14, 2, 1, P.mint, 'b'); s.rect(50, 14, 10, 1, P.oat, 'l'); s.rect(47, 18, 14, 1, P.mint, 's'); s.rect(47, 22, 9, 1, P.oat, 's');
    if (k >= 2) { s.rect(47, 26, 2, 1, P.mint, 'b'); s.rect(50, 26, 12, 1, P.mint, 'l'); }
    if (k === 3) s.rect(47, 29, 1, 2, P.oat, 'l');
    const on = k >= 2;
    s.part({ auto: false }); s.rect(40, 34, 10, 8, P.oat); s.rect(40, 34, 10, 1, P.oat, 'l'); s.rect(49, 35, 1, 7, P.oat, 's'); s.p(42, 37, on ? P.mint : P.forest, 'l'); s.p(44, 37, on ? P.forest : P.red, 'l'); s.rect(39, 38, 1, 2, P.char, 'b');
    const x = 12, y = 4, d = [-3, -1, 0, 0][k];
    s.part({ auto: false }); s.poly([[x + 30 + d, y + 28], [x + 30, y + 40], [x + 28, y + 52], [x + 24, y + 63], [x + 18, y + 66], [2, y + 66]], P.navy, 1, 'b');
    adult(s, x, y, { top: P.navy, inner: P.white, pants: P.stone, taper: true, face: { look: 'right', mouth: on ? 'smile' : undefined, blink: o.blink } });
    arm(s, [[x, y + 16], [x - 1, y + 25], [x - 1, y + 32]], P.navy);
    arm(s, [[x + 13, y + 16], [x + 18, y + 22], [x + 25 + d, y + 24]], P.navy);
    s.part({ auto: false }); s.rect(x + 28 + d, y + 23, 3, 3, P.char); s.rect(x + 31 + d, y + 24, 1, 1, P.steel, 'l');
    return s;
  },
  (k, o) => {
    const s = sprite();
    s.part({ auto: false }); s.rect(9, 12, 2, 57, P.char); s.rect(9, 12, 1, 57, P.char, 'l'); s.rect(6, 8, 8, 4, P.char); s.rect(6, 8, 8, 1, P.char, 'l'); s.rect(7, 12, 6, 1, P.sun, 'l');
    s.part({ ol: false, auto: false }); s.rect(5, 69, 10, 1, P.ground);
    s.part({ ol: false, auto: false }); for (const [a, b] of [[20, 6], [33, 3], [52, 8], [64, 4], [60, 20], [17, 22], [66, 33], [19, 40], [58, 46], [64, 58], [22, 56], [47, 14]]) s.rect(a, (b + k * 2) % 68, 1, 1, P.ice);
    const x = 30, y = 4, sip = k === 2, cy = sip ? -5 : 0;
    adult(s, x, y, { top: P.char, inner: P.oat, coat: true, pants: P.denim, scarf: P.forest, face: { look: 'right', mouth: sip ? undefined : 'smile', blink: o.blink || sip } });
    arm(s, [[x, y + 16], [x - 1, y + 26], [x + 1, y + 32]], P.char, false);
    arm(s, [[x + 13, y + 16], [x + 16, y + 24 + cy], [x + 12, y + 26 + cy]], P.char);
    s.part({ auto: false }); s.rect(x + 8, y + 18 + cy, 4, 6, P.white); s.rect(x + 8, y + 20 + cy, 4, 2, P.wood); s.rect(x + 7, y + 17 + cy, 6, 1, P.white, 'l'); s.rect(x + 11, y + 18 + cy, 1, 6, P.white, 's');
    s.part({ sep: true }); s.rect(x + 11, y + 21 + cy, 3, 3, P.skin);
    if (!sip) { s.part({ ol: false, auto: false }); for (const [a, b] of k % 2 ? [[x + 9, y + 14], [x + 10, y + 12]] : [[x + 10, y + 14], [x + 9, y + 12]]) s.rect(a, b, 1, 2, P.white, 'l'); }
    return s;
  }
];

/* the walker: the outfit of an era, no props, k = stride 0-3 */
const OUT = [null,
  { top: P.stone, inner: P.white, pants: P.denim },
  { top: P.navy, lapel: P.oat, pants: P.char, shoes: P.brown, taper: true },
  { top: P.oat, knit: true, collar: P.white, scarf: P.forest, pants: P.denim },
  { top: P.navy, inner: P.white, pants: P.stone, taper: true },
  { top: P.char, inner: P.oat, coat: true, pants: P.denim, scarf: P.forest }];
function walker(i, k, dir) {
  const s = sprite(), sw = [2, 0, -2, 0][k], look = dir < 0 ? 'left' : 'right';
  if (i === 0) {
    const x = 29, y = 24, a = sw / 2;
    s.part(); s.poly([[x + 4, y + 30], [x + 4 - a, y + 38]], P.skin, 4); s.part({ auto: false }); s.rect(x + 1 - a, y + 41, 6, 2, P.char); s.rect(x + 1 - a, y + 43, 6, 1, P.char, 's');
    s.part(); s.poly([[x + 10, y + 30], [x + 10 + a, y + 38]], P.skin, 4); s.part({ auto: false }); s.rect(x + 7 + a, y + 41, 6, 2, P.char); s.rect(x + 7 + a, y + 43, 6, 1, P.char, 's');
    s.part({ ol: false, auto: false }); s.rect(x - 2, y + 44, 18, 1, P.ground);
    s.part(); s.rect(x + 1, y + 24, 12, 6, P.white); s.rect(x + 1, y + 24, 12, 1, P.white, 's');
    s.part(); s.rect(x + 1, y + 12, 12, 1, P.red); s.rect(x, y + 13, 14, 11, P.red); s.rect(x + 11, y + 14, 2, 10, P.red, 's'); s.rect(x + 6, y + 13, 2, 11, P.white, 'b'); s.rect(x + 7, y + 13, 1, 11, P.white, 's');
    s.part({ auto: false }); s.rect(x + 5, y + 10, 4, 2, P.skin);
    arm(s, [[x + 1, y + 14], [x - 1 + a, y + 19], [x - 1 + a, y + 23]], P.skin, true, 3);
    arm(s, [[x + 13, y + 14], [x + 15 - a, y + 19], [x + 15 - a, y + 23]], P.skin, true, 3);
    head(s, x, y - 2, { kid: true, look, mouth: 'smile' });
    return s;
  }
  const x = 29, y = 4 + (k % 2 ? -1 : 0), f = OUT[i], a = sw / 2;
  adult(s, x, y, { ...f, walk: k, face: { look, mouth: 'smile' } });
  arm(s, [[x, y + 16], [x - 1 + a, y + 25], [x - 1 + a * 2, y + 32]], f.top);
  arm(s, [[x + 13, y + 16], [x + 14 - a, y + 25], [x + 14 - a * 2, y + 32]], f.top);
  return s;
}

const STOPS = [
  { name: 'Muscat', yrs: 'Until 2016', role: 'Born and raised', line: 'Grew up in Oman. Football first.', act: 'kicking a football' },
  { name: 'BMSCE', yrs: '2016–20', role: 'B.E. Computer Science', line: 'Engineering in Bangalore.', act: 'reading', logos: [['bmsce.png', 'BMS College of Engineering']] },
  { name: 'Quantiphi', yrs: '2020–24', role: 'Business Analyst → Senior BA', line: 'Healthcare data on Google Cloud, from delivery to deals.', act: 'presenting at a whiteboard', logos: [['quantiphi.png', 'Quantiphi']] },
  { name: 'Stockholm', yrs: '2024–26', role: 'MSc Biostatistics & Data Science', line: 'Left consulting to build as AI took off.', act: 'at a laptop with a thesis chart', logos: [['karolinska.png', 'Karolinska Institutet'], ['kth.png', 'KTH'], ['stockholm-university.png', 'Stockholm University']] },
  { name: 'KI · Arkus AI', yrs: '2025–26', role: 'Research assistant, AI engineer', line: 'A prescription pipeline at KI. Agent tools at Arkus AI.', act: 'plugging in an agent', logos: [['karolinska.png', 'Karolinska Institutet'], ['arkus-ai.png', 'Arkus AI']] },
  { name: 'Now', yrs: '2026', role: 'Building in public', line: 'Writing up what I build, in Stockholm.', act: 'with a coffee in the snow' }
];

const cache = new Map();
function frame(key, make) { let c = cache.get(key); if (!c) { c = render(make()); cache.set(key, c); } return c; }

/* builds the journey into root; returns a cleanup */
export function initJourney(root, base = '/images/journey/') {
  const RM = matchMedia('(prefers-reduced-motion: reduce)'), ac = new AbortController(), sig = { signal: ac.signal };
  let alive = true, raf = 0, timer = 0;
  root.innerHTML = '';
  const wrap = document.createElement('div'); wrap.className = 'jy';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'jpath'); svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); svg.appendChild(path);
  const av = document.createElement('canvas'); av.className = 'jav'; av.width = SW; av.height = SH; av.setAttribute('role', 'img');
  const g = av.getContext('2d');
  const ol = document.createElement('ol'); ol.className = 'jstops';
  const cap = document.createElement('p'); cap.className = 'jcap'; cap.setAttribute('aria-live', 'polite');
  const btns = STOPS.map((st, i) => {
    const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button';
    b.setAttribute('aria-label', st.name + ', ' + st.yrs + ', ' + st.role + '. ' + st.line);
    const mk = st.logos ? '<span class="jlogo">' + st.logos.map(([f, alt]) => '<img src="' + base + f + '" alt="' + alt + '" loading="lazy">').join('') + '</span>' : '<span class="jlogo"><svg class="jic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (i ? 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5' : 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4') + '"/></svg></span>';
    b.innerHTML = '<i class="jdot"></i>' + mk + '<small>' + st.yrs + '</small><b>' + st.name + '</b><span class="jrole">' + st.role + '</span><span class="jline">' + st.line + '</span>';
    li.appendChild(b); ol.appendChild(li); return b;
  });
  wrap.append(svg, av, ol); root.append(wrap, cap);

  let pts = [], vertical = false, scale = 2, pos = 5, at = 5, target = 5, dir = 1, mode = 'idle', t0 = 0, last = 0, walkK = 0;
  function layout() {
    vertical = innerWidth <= 760;
    const W = wrap.clientWidth;
    scale = vertical ? 1.125 : W < 900 ? 1.75 : 2;
    const S = SW * scale;
    av.style.width = av.style.height = S + 'px';
    const rects = btns.map(b => b.querySelector('.jdot').getBoundingClientRect()), wr = wrap.getBoundingClientRect();
    pts = rects.map(r => [r.left + r.width / 2 - wr.left, r.top + r.height / 2 - wr.top]);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + wrap.clientHeight); svg.setAttribute('width', W); svg.setAttribute('height', wrap.clientHeight);
    let d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      d += vertical ? ' C' + (ax + 18) + ' ' + (ay + (by - ay) * .5) + ' ' + (bx - 18) + ' ' + (by - (by - ay) * .5) + ' ' + bx + ' ' + by
        : ' C' + (ax + (bx - ax) * .5) + ' ' + (ay - 14) + ' ' + (bx - (bx - ax) * .5) + ' ' + (by + 14) + ' ' + bx + ' ' + by;
    }
    path.setAttribute('d', d);
    place();
  }
  function lerpPt(p) { const i = Math.max(0, Math.min(pts.length - 2, Math.floor(p))), f = p - i, a = pts[i], b = pts[i + 1]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
  function place() {
    if (!pts.length) return;
    const [x, y] = lerpPt(pos), S = SW * scale, i = Math.round(pos);
    let ox = 0;
    if (mode !== 'walk' && !vertical) ox = (29 - FIG[i][0]) * scale;
    const left = vertical ? Math.max(0, x - S - 8) : x - 36 * scale + ox, top = vertical ? y - S * .62 : y - 69 * scale - 10;
    av.style.transform = 'translate3d(' + left.toFixed(1) + 'px,' + top.toFixed(1) + 'px,0)';
  }
  function draw(key, make) { g.clearRect(0, 0, SW, SH); g.drawImage(frame(key, make), 0, 0); }
  function scene(i, k, blink) { draw('s' + i + k + (blink ? 'b' : ''), () => SCENES[i](k, { blink })); av.setAttribute('aria-label', 'Arvind ' + STOPS[i].act); }
  function walkFrame(i, k) { draw('w' + i + k + dir, () => walker(i, k, dir)); }
  function mark(i) {
    btns.forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', String(j === i)); });
    const st = STOPS[i]; cap.classList.remove('in'); void cap.offsetWidth;
    cap.innerHTML = '<b>' + st.name + '</b> ' + st.line; cap.classList.add('in');
  }
  function go(i) {
    if (i === target && mode !== 'idle') return;
    target = i; mark(i);
    if (RM.matches) { pos = at = i; mode = 'idle'; scene(i, 0); place(); return; }
    if (Math.abs(pos - i) < .01) { act(); return; }
    dir = i > pos ? 1 : -1; if (mode !== 'walk') { mode = 'walk'; t0 = last = performance.now(); }
    loop();
  }
  function act() { mode = 'act'; t0 = performance.now(); at = target; pos = target; place(); loop(); }
  function loop() { if (!raf && alive) raf = requestAnimationFrame(step); }
  function step(now) {
    raf = 0; if (!alive) return;
    const dt = Math.min(64, now - last); last = now;
    if (mode === 'walk') {
      const speed = .0032 * (vertical ? 1.2 : 1);
      const d = target - pos; dir = d > 0 ? 1 : -1;
      pos += dir * Math.min(Math.abs(d), speed * dt);
      walkK = Math.max(0, Math.floor((now - t0) / 130)) % 4;
      walkFrame(Math.round(pos), walkK);
      place();
      if (Math.abs(target - pos) < .001) { pos = target; act(); return; }
    } else if (mode === 'act') {
      const k = Math.max(0, Math.floor((now - t0) / 260));
      if (k >= 8) { mode = 'idle'; scene(at, 0); place(); idle(); return; }
      scene(at, [0, 1, 2, 3, 2, 1, 2, 3][k]);
    }
    loop();
  }
  function idle() {
    clearTimeout(timer); if (!alive || RM.matches) return;
    timer = setTimeout(() => { if (mode !== 'idle' || !alive) return; scene(at, 0, true); timer = setTimeout(() => { if (mode === 'idle' && alive) { scene(at, 0); idle(); } }, 140); }, 2600 + Math.random() * 1800);
  }
  btns.forEach((b, i) => {
    b.addEventListener('click', () => go(i), sig);
    b.addEventListener('mouseenter', () => { if (!vertical) go(i); }, sig);
    b.addEventListener('focus', () => go(i), sig);
  });
  const ro = new ResizeObserver(layout); ro.observe(root);
  scene(5, 0); mark(5); layout(); idle();
  return () => { alive = false; ac.abort(); ro.disconnect(); cancelAnimationFrame(raf); clearTimeout(timer); root.innerHTML = ''; };
}
