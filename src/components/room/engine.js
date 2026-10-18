/* The room: one isometric room baked once into three canvases (far, mid, near),
   a character sprite on its own canvases moved with transform only, and a walker
   that takes the character to the area that matches the section in view.
   No libraries. Browser only: call createRoom() from an effect. */
export function createRoom() {
const F = Math.floor;
const RM = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- pixel helpers ---------- */
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + .5) / 16);
const bay = (x, y) => BAY[((y & 3) << 2) | (x & 3)];
const rgb = h => { const n = parseInt(h.slice(1), 16); return ((255 << 24) | ((n & 255) << 16) | (n & 0xff00) | ((n >> 16) & 255)) >>> 0; };
const hash = (x, y) => { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const D = (a, b, t, x, y) => t > bay(x, y) ? b : a;
const pack = (r, g, b, a = 255) => (((a & 255) << 24) | ((b & 255) << 16) | ((g & 255) << 8) | (r & 255)) >>> 0;

class Raster {
  constructor(w, h, ox, oy) { this.W = w; this.H = h; this.ox = ox; this.oy = oy; this.img = new ImageData(w, h); this.b = new Uint32Array(this.img.data.buffer); this.id = new Uint8Array(w * h); this.em = new Uint8Array(w * h); this.g = new Uint8Array(w * h); this.u = new Uint32Array(w * h); this.ug = new Uint8Array(w * h); this.cur = 0; this.emit = 0; this.grp = 0; this.gx = -1; }
  P(x, y, z) { return [this.ox + x - y, this.oy + (x + y) / 2 - z]; }
  set(x, y, c) { if (!c || x < 0 || y < 0 || x >= this.W || y >= this.H) return; const i = y * this.W + x, g = this.gx >= 0 ? this.gx : this.cur ? GID[this.cur] : this.grp;
    /* keep the floor or wall pixel an object covers, so the floor and walls stay whole while the object is away */
    if (this.b[i] && !this.u[i] && this.g[i] !== g && this.g[i] <= G.wallL) { this.u[i] = this.b[i]; this.ug[i] = this.g[i]; }
    this.b[i] = c; this.id[i] = this.cur; this.em[i] = this.emit; this.g[i] = g; }
  poly(pts, sh) {
    const W = this.W, H = this.H; let a = 1e9, z = -1e9; for (const p of pts) { if (p[1] < a) a = p[1]; if (p[1] > z) z = p[1]; }
    const y0 = Math.max(0, Math.ceil(a - .5)), y1 = Math.min(H - 1, F(z - .5)), n = pts.length, xs = [], c0 = this.cur, e0 = this.emit, fn = typeof sh === 'function';
    for (let y = y0; y <= y1; y++) {
      const cy = y + .5; xs.length = 0;
      for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; if ((p[1] <= cy && q[1] > cy) || (q[1] <= cy && p[1] > cy)) xs.push(p[0] + (cy - p[1]) / (q[1] - p[1]) * (q[0] - p[0])); }
      xs.sort((u, v) => u - v);
      for (let k = 0; k + 1 < xs.length; k += 2) { const xa = Math.max(0, Math.ceil(xs[k] - .5)), xb = Math.min(W - 1, F(xs[k + 1] - .5)); for (let x = xa; x <= xb; x++) { this.cur = c0; this.emit = e0; const c = fn ? sh(x, y) : sh; if (c) this.set(x, y, c); } }
    }
    this.cur = c0; this.emit = e0;
  }
  box(x, y, z, w, d, h, t, l, r) {
    const P = (a, b, c) => this.P(a, b, c);
    if (l) this.poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], l);
    if (r) this.poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], r);
    if (t) this.poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], t);
  }
  tUV(sx, sy, zp) { const a = sx + .5 - this.ox, b = 2 * (sy + .5 - this.oy + zp); return [(a + b) / 2, (b - a) / 2]; }
  lUV(sx, sy, yp) { const x = sx + .5 - this.ox + yp; return [x, this.oy + (x + yp) / 2 - (sy + .5)]; }
  rUV(sx, sy, xp) { const y = this.ox + xp - (sx + .5); return [y, this.oy + (xp + y) / 2 - (sy + .5)]; }
  line(x0, y0, x1, y1, c) { x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy; for (;;) { this.set(x0, y0, c); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } } }
  line3(a, b, c) { const p = this.P(...a), q = this.P(...b); this.line(p[0], p[1], q[0], q[1], c); }
  disc(cx, cy, r, sh) { cx = Math.round(cx); cy = Math.round(cy); for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * .6) { const c = typeof sh === 'function' ? sh(cx + x, cy + y, x, y) : sh; if (c) this.set(cx + x, cy + y, c); } }
  outline(c) { /* 1px dark edge around every opaque region; the edge joins the piece it outlines */
    const b = this.b, g = this.g, W = this.W, H = this.H, out = [];
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (b[i] >>> 24 === 255) continue; for (const j of [i - 1, i + 1, i - W, i + W]) if ((b[j] >>> 24) === 255) { out.push(i, j); break; } }
    for (let k = 0; k < out.length; k += 2) { b[out[k]] = c; g[out[k]] = g[out[k + 1]]; }
  }
}

const K = {};
Object.entries({
  wallA: '#9FB7A8', wallA2: '#8EA897', wallB: '#7F9B8D', wallB2: '#728E80', wallTop: '#EEE7D7', wallCut: '#D7CDB7', wallCut2: '#C4B9A0', base: '#EEE8DB', baseS: '#CDC4B2',
  plank1: '#C99159', plank2: '#BF8750', plank3: '#D29D65', seam: '#9E6B3D', slab: '#8A847A', slab2: '#7A746B',
  frame: '#F5F0E6', frameS: '#CFC6B3', wood: '#4A3626', wood2: '#6B4F37', mat: '#F4EFE4',
  glass: '#3E5568', sky1: '#9CC1DA', sky2: '#F0DEC0', duskA: '#F2A35B', duskB: '#6E5A8C', duskC: '#2E2F55', skyN1: '#0E1731', skyN2: '#2B3A64',
  cityD: '#8C9AA8', cityD2: '#A3B0BB', cityN: '#161D35', cityLit: '#F6C863', moon: '#F3EBCF', star: '#E9EEF8', cloud: '#FBF6EC', brick: '#A65B3E', cop: '#6FA595', gold: '#E2B33C',
  watW: '#79A6C2', watW2: '#8EB7CF', watN: '#1A2646', watN2: '#24335C', watD: '#B8866A', watD2: '#8C6D86',
  board: '#F8F6F0', board2: '#EDE9DF', boardF: '#B9B2A4', mkR: '#9E3B2C', mkG: '#2F6F5E', mkK: '#2A2724', mkB: '#3A6EA5', tray: '#A9A192',
  oakT: '#D9A76D', oakT2: '#CD9961', oakL: '#B5824B', oakR: '#956537', oakRim: '#E6BC83',
  benchT: '#C8BBA3', benchT2: '#BDB098', benchL: '#A3957C', benchR: '#897C66',
  mon1: '#3B3F47', mon2: '#2A2D33', mon3: '#1E2025', scr: '#122029', scr2: '#1A313C', tx: '#E6E0CF', tG: '#86D3A5', tO: '#F2A35B', tB: '#83B5E6', tD: '#5E7682',
  keyT: '#EDE7DB', keyD: '#CDC6B8', keyL: '#C2BAAA', keyR: '#A9A192',
  hhY: '#F3C843', hhL: '#D5A72B', hhR: '#B68C1F', hhS: '#BDB9A6', hhS2: '#A4A08E', hhK: '#3A3832', hhC: '#ECE6D4',
  mugT: '#F3EDE1', mugL: '#E4DDCE', mugR: '#CAC1AF', coffee: '#4A2E1F', plate: '#E8E1D3', bun: '#C98A4B', bun2: '#9E6530', sugar: '#FFFFFF',
  cabT: '#EFEAE0', cabL: '#DCD6CA', cabR: '#C8C1B3', cabLine: '#ABA395', knob: '#5A544B',
  crtT: '#E2D9C4', crtL: '#CDC3AA', crtR: '#B5AA90', crtB: '#A3977D', crtS: '#0D1A12', crtG: '#6EE7A0', crtG2: '#3E9E68',
  chair: '#33363C', chair2: '#26282D', chairT: '#41444B', chrome: '#A5ABB3', chromeD: '#7D838B',
  rugC: '#EBE0C9', rugC2: '#E2D5BC', rugR: '#A0412F', rugG: '#2F6F5E',
  pot: '#BC6741', potR: '#9C5133', potT: '#4F3424', leaf1: '#76B567', leaf2: '#54934D', leaf3: '#3D723D',
  door: '#2F5D50', door2: '#264D42', door3: '#3A6E60', handle: '#E2B33C', matB: '#8A6440', matB2: '#A07A4F',
  ball: '#F2EEE6', ballD: '#2A2724', ballS: '#CFC9BD',
  lampP: '#2E3036', lampS: '#E6C27A', lampS2: '#C9A45C', lampG: '#FFE1A0',
  nY: '#F4D35E', nP: '#F2A0A6', nG: '#9AD1B6', pg: '#F8F3E6', pg2: '#EEE7D6', pgL: '#C3D0DB', cover: '#9E3B2C', cover2: '#7F2E22', bar: '#2F6F5E', bar2: '#C2453A',
  pcSea: '#2E7FA8', pcSand: '#E3C58F', pcRock: '#9A7452', pcFort: '#F4EFE2', pcSky: '#F7D9A4', pin: '#B23A2A',
  coin: '#E2B33C', coin2: '#B88A26', metal: '#A5ABB3', metalD: '#6E747C', ring: '#2F6F5E', cabG: '#6E7680', cabG2: '#4F565E',
  outline: '#3A2E24', outlineN: '#141628'
}).forEach(([k, v]) => K[k] = rgb(v));

/* ---------- the room ---------- */
const W = 320, H = 260, OX = 160, OY = 108;
const ID = { desk: 1, fThesis: 2, fAmbient: 3, fHq: 4, fHouse: 5, board: 6, bench: 7, term: 8, door: 9, window: 10, handheld: 11, mug: 12, ball: 13, plant: 14, postcard: 15 };
/* pieces the intro animates one by one; every pixel belongs to exactly one */
const GROUPS = ['floor', 'wallR', 'wallL', 'rug', 'mat', 'board', 'fThesis', 'fAmbient', 'fHq', 'fHouse', 'window', 'postcard', 'door', 'bench', 'plant', 'term', 'desk', 'monitor', 'keys', 'handheld', 'mug', 'bun', 'lamp', 'chair', 'ball'];
const G = Object.fromEntries(GROUPS.map((n, i) => [n, i]));
const GID = { [ID.desk]: G.desk, [ID.fThesis]: G.fThesis, [ID.fAmbient]: G.fAmbient, [ID.fHq]: G.fHq, [ID.fHouse]: G.fHouse, [ID.board]: G.board, [ID.bench]: G.bench, [ID.term]: G.term, [ID.door]: G.door, [ID.window]: G.window, [ID.handheld]: G.handheld, [ID.mug]: G.mug, [ID.ball]: G.ball, [ID.plant]: G.plant, [ID.postcard]: G.postcard };
const FRAMES = [
  { id: ID.fThesis, u: 82, v: 70, kind: 'thesis' }, { id: ID.fAmbient, u: 110, v: 70, kind: 'ambient' },
  { id: ID.fHq, u: 82, v: 44, kind: 'hq' }, { id: ID.fHouse, u: 110, v: 44, kind: 'house' }
];

function themeFor(date) {
  let h = date.getHours();
  try { h = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Stockholm', hour: 'numeric', hour12: false }).format(date); } catch (e) { /* local time */ }
  if (h >= 21 || h < 6) return 'night';
  if (h >= 17 || h < 8) return 'dusk';
  return 'day';
}

/* the view through the window: 44 x 44, lx right, ly up from the sill */
function outside(lx, ly, sx, sy, theme) {
  const N = theme === 'night', DU = theme === 'dusk';
  const sea = 11;
  let sk = 15 + F(hash(F(lx / 4), 3) * 7); let tower = 0;
  if (lx >= 27 && lx < 34) { sk = 26; tower = 1; }
  if (lx >= 29 && lx < 32) { sk = 36; tower = 2; }
  if (lx === 30) { sk = 41; tower = 3; }
  if (ly < sea) {
    if (N) { if (hash(lx, F(ly / 2)) > .9) return D(K.watN, K.cityLit, .4, sx, sy); return D(K.watN, K.watN2, .4, sx, sy); }
    if (DU) return D(K.watD, K.watD2, .5 - ly / 30, sx, sy);
    if (hash(F(lx / 3), ly) > .86 && (ly & 1)) return K.watW2;
    return D(K.watW, K.watW2, .3, sx, sy);
  }
  if (ly < sk) {
    if (N) { if (tower && ly >= sk - 2) return K.gold; if (!tower && hash(lx, ly) > .82 && (ly & 1) && (lx % 3 === 1)) return K.cityLit; return K.cityN; }
    if (tower === 3 || (tower >= 2 && ly >= sk - 2)) return K.gold;
    if (tower === 2) return K.cop; if (tower === 1) return K.brick;
    if (!DU && hash(lx, ly) > .9 && (ly & 1) && (lx % 3 === 1)) return K.frame;
    return DU ? D(K.duskC, K.cityD, .25, sx, sy) : D(K.cityD, K.cityD2, .35 + (ly - sk) * .02, sx, sy);
  }
  const t = (ly - sea) / (44 - sea);
  if (N) { if ((lx - 10) ** 2 + (ly - 34) ** 2 < 9) return K.moon; if (hash(lx * 7, ly * 3) > .975) return K.star; return D(K.skyN2, K.skyN1, t, sx, sy); }
  if (DU) { if (t < .5) return D(K.duskA, K.duskB, t * 2, sx, sy); return D(K.duskB, K.duskC, (t - .5) * 2, sx, sy); }
  for (let i = 0; i < 2; i++) { const cx = 9 + i * 22, cy = 32 + i * 5, dx = (lx - cx) / (7 + i), dy = (ly - cy) / 2.4; const q = dx * dx + dy * dy; if (q < 1) return q > .6 ? D(K.sky1, K.cloud, .6, sx, sy) : K.cloud; }
  return D(K.sky2, K.sky1, Math.pow(t, 1.2), sx, sy);
}

function framePic(kind, u, v, sx, sy) { /* 18 x 14 picture inside a frame */
  if (kind === 'thesis') { if (u >= 3 && u < 9 && v >= 2 && v < 12) return u === 3 ? K.cover2 : K.cover; if (u >= 11 && u < 16 && v >= 4 && v < 12) { const h = [5, 8, 3, 6, 9][u - 11]; return v >= 12 - h ? (u === 13 ? K.bar2 : K.bar) : K.pg; } return K.pg; }
  if (kind === 'ambient') { if (u >= 2 && u < 16 && v >= 3 && v < 11) { if (v === 5 && u >= 4 && u < 8) return K.tG; if (v === 5 && u >= 9 && u < 12) return K.tO; if (v === 5 && u >= 13 && u < 15) return K.tB; if (v >= 7 && v < 10 && u >= 4 && u < 14) return v === 8 && u < 12 ? K.tD : K.scr2; return K.scr; } return D(K.sky1, K.sky2, v / 14, sx, sy); }
  if (kind === 'hq') { if (u % 4 === 1 && v % 4 === 1) return [K.tG, K.tO, K.tB, K.cityLit][(F(u / 4) + F(v / 4)) % 4]; if ((u % 4 === 1 && v % 4 !== 3) || (v % 4 === 1 && u % 4 !== 3)) return K.mon1; return K.mon3; }
  if (u >= 5 && u < 13 && v >= 6 && v < 13) { if (u >= 8 && u < 10 && v >= 9) return K.door; return K.pg2; }
  if (v >= 2 && v < 6 && u >= 4 - (v - 2) && u < 14 + (v - 2)) return K.cover;
  return D(K.sky1, K.sky2, v / 14, sx, sy);
}

function whiteboard(u, v, sx, sy) { /* 56 x 50: the five-step loop in marker */
  if (u < 2 || u >= 54 || v < 2 || v >= 48) return K.boardF;
  if (v < 5) { if (u >= 20 && u < 36 && (u % 4 < 3) && v === 3) return K.tray; return K.tray; }
  /* title scribble */
  if (v === 42 && u >= 6 && u < 24 && u % 3 !== 2) return K.mkK;
  if (v === 42 && u >= 27 && u < 33) return K.mkR;
  /* five boxes at v 22..30 */
  const bi = F((u - 5) / 10), bu = (u - 5) % 10;
  if (u >= 5 && u < 55 && bi < 5 && v >= 22 && v < 31 && bu < 8) {
    const col = [K.mkK, K.mkK, K.mkG, K.mkG, K.mkR][bi];
    if (bu === 0 || bu === 7 || v === 22 || v === 30) return col;
    if (v === 26 && bu >= 2 && bu < 6) return bi === 4 ? K.mkR : K.mkK;
    if (v === 24 && bu >= 2 && bu < 4 + (bi % 3)) return K.boardF;
    return K.board;
  }
  if (v === 26 && u >= 5 && u < 55 && (u - 5) % 10 >= 8) return K.mkK;
  /* return arrow under the boxes */
  if (v === 16 && u >= 8 && u < 50) return K.mkR;
  if ((u === 8 || u === 49) && v > 16 && v < 22) return K.mkR;
  if (u === 9 && v === 20) return K.mkR; if (u === 7 && v === 20) return K.mkR;
  /* small ticks top right */
  if (v >= 36 && v < 40 && u >= 38 && u < 50) { const t = (u - 38) % 4; if (t === 0 && v === 37) return K.mkG; if (t === 1 && v === 36) return K.mkG; if (t === 2 && v >= 37) return K.mkG; }
  return D(K.board, K.board2, .15, sx, sy);
}

function bake(theme) {
  const N = theme === 'night';
  const L = [0, 1, 2].map(() => new Raster(W, H, OX, OY));
  const [L0, L1, L2] = L;
  /* floor slab */
  L0.box(-6, -6, -8, 152, 152, 8, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 0); const a = F(u), b = F(v), row = F((b + 6) / 10), off = (row * 23) % 44; if (((b + 6) % 10) === 0 || ((a + off + 6) % 44) === 0) return K.seam; const t = hash(row, F((a + off + 6) / 44)); return t < .33 ? K.plank1 : t < .66 ? K.plank2 : D(K.plank2, K.plank3, .5, sx, sy); }, K.slab, K.slab2);
  /* right wall (plane y=0): whiteboard, frames */
  L0.grp = G.wallR;
  L0.box(-6, -6, 0, 152, 6, 100, K.wallTop, (sx, sy) => { const [u0, v0] = L0.lUV(sx, sy, 0); const u = F(u0), v = F(v0);
    if (v < 6) return v === 5 ? K.baseS : K.base;
    if (u >= 10 && u < 66 && v >= 40 && v < 90) { L0.cur = ID.board; return whiteboard(u - 10, v - 40, sx, sy); }
    for (const f of FRAMES) if (u >= f.u && u < f.u + 24 && v >= f.v && v < f.v + 20) { L0.cur = f.id; const a = u - f.u, b = v - f.v; if (a === 0 || a === 23 || b === 0 || b === 19) return K.wood; if (a === 1 || a === 22 || b === 1 || b === 18) return K.wood2; if (a === 2 || a === 21 || b === 2 || b === 17) return K.mat; return framePic(f.kind, a - 3, 16 - b, sx, sy); }
    return D(K.wallA2, K.wallA, .25 + (v - 6) / 100 * .8, sx, sy); }, K.wallCut2);
  /* left wall (plane x=0): window, postcard, door */
  L0.grp = G.wallL;
  L0.box(-6, 0, 0, 6, 146, 100, K.wallTop, K.wallCut, (sx, sy) => { const [u0, v0] = L0.rUV(sx, sy, 0); const u = F(u0), v = F(v0);
    if (v < 6 && !(u >= 100 && u < 130)) return v === 5 ? K.baseS : K.base;
    if (u >= 14 && u < 64 && v >= 36 && v < 86) { L0.cur = ID.window; if (u < 17 || u >= 61 || v < 39 || v >= 83 || u === 39 || v === 61) return (u === 16 || v === 38) ? K.frameS : K.frame; L0.emit = N ? 1 : 0; return outside(u - 17, v - 39, sx, sy, theme); }
    if (u >= 70 && u < 82 && v >= 62 && v < 72) { L0.cur = ID.postcard; const a = u - 70, b = v - 62; if (a === 0 || a === 11 || b === 0 || b === 9) return K.frame; if (b === 9 && a === 5) return K.pin; if (b <= 3) return K.pcSea; if (b === 4) return K.pcSand; if (a >= 7 && a < 10 && b >= 4 && b < 7) return K.pcFort; if (b < 7 + ((a * 7) % 3)) return K.pcRock; return K.pcSky; }
    if (u >= 100 && u < 130 && v < 76) { L0.cur = ID.door; const a = u - 100, b = v; if (a < 2 || a >= 28 || b >= 74) return K.wood; if (a < 3 || a >= 27 || b >= 73) return K.door2; if (b >= 8 && b < 34 && a >= 6 && a < 24) return (a === 6 || a === 23 || b === 8 || b === 33) ? K.door2 : (a === 7 || b === 32) ? K.door3 : K.door; if (b >= 40 && b < 66 && a >= 6 && a < 24) return (a === 6 || a === 23 || b === 40 || b === 65) ? K.door2 : (a === 7 || b === 64) ? K.door3 : K.door; if (a >= 23 && a < 26 && b >= 36 && b < 38) return K.handle; return K.door; }
    return D(K.wallB2, K.wallB, .25 + (v - 6) / 100 * .8, sx, sy); });
  /* window sill */
  L0.gx = G.window; L0.box(0, 14, 34, 3, 50, 2, K.frame, K.frameS, K.frameS); L0.gx = -1;
  /* sunbeam across the floor */
  L0.grp = G.floor;
  if (theme === 'day') L0.poly([L0.P(0, 16, 0), L0.P(0, 62, 0), L0.P(44, 76, 0), L0.P(44, 30, 0)], (sx, sy) => { if (bay(sx, sy) > .45) return 0; const c = L0.b[sy * W + sx]; const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255; return pack(r + (255 - r) * .22 | 0, g + (244 - g) * .22 | 0, b + (214 - b) * .22 | 0); });
  /* rug */
  L0.grp = G.rug;
  L0.box(60, 62, 0, 74, 62, 1, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 1); const a = F(u) - 60, b = F(v) - 62; if (a < 2 || a >= 72 || b < 2 || b >= 60) return K.rugR; if (((a - 2) % 12) >= 5 && ((a - 2) % 12) < 7) return K.rugG; return D(K.rugC, K.rugC2, .35, sx, sy); }, K.rugR, K.rugR);
  /* door mat */
  L0.grp = G.mat;
  L0.box(2, 104, 0, 16, 26, 1, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 1); const a = F(u) - 2, b = F(v) - 104; if (a < 1 || a >= 15 || b < 1 || b >= 25) return K.matB; return ((a + b) & 1) ? K.matB : K.matB2; }, K.matB, K.matB);
  /* workbench with the tools */
  L0.cur = ID.bench;
  L0.box(8, 2, 0, 58, 18, 26, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 26); const a = F(u), b = F(v); if (b === 19 || a === 65) return K.benchR; return (a % 2 === 0) ? K.benchT : D(K.benchT, K.benchT2, .4, sx, sy); }, K.benchL, K.benchR);
  L0.box(10, 4, 0, 2, 2, 26, 0, K.benchL, K.benchR); L0.box(62, 4, 0, 2, 2, 26, 0, K.benchL, K.benchR);
  L0.box(10, 17, 0, 2, 2, 26, 0, K.benchL, K.benchR); L0.box(62, 17, 0, 2, 2, 26, 0, K.benchL, K.benchR);
  /* 1 sticky pad with ? */ L0.box(10, 7, 26, 6, 6, 2, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 28); const a = F(u) - 10, b = F(v) - 7; if ((a === 2 && b === 1) || (a === 3 && b >= 1 && b < 3) || (a === 2 && b === 3) || (a === 2 && b === 5)) return K.mkK; return K.nY; }, K.nY, K.hhL);
  /* 2 clipboard, one tick */ L0.box(18, 6, 26, 6, 9, 1, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 27); const a = F(u) - 18, b = F(v) - 6; if (b === 0 && a >= 2 && a < 4) return K.metalD; if (a === 1 && (b === 3 || b === 5 || b === 7)) return b === 3 ? K.mkG : K.mkK; if (a >= 3 && (b === 3 || b === 5 || b === 7)) return K.pgL; return K.pg; }, K.pg2, K.pg2);
  /* 3 magnifying glass */ { const q = L0.P(29, 10, 27); L0.disc(q[0], q[1], 3, (x, y, ex, ey) => (ex * ex + ey * ey > 4) ? K.metalD : D(K.pgL, K.frame, .5, x, y)); L0.line(q[0] + 2, q[1] + 2, q[0] + 5, q[1] + 5, K.wood); }
  /* 4 stopwatch */ { const q = L0.P(37, 9, 27); L0.set(F(q[0]), F(q[1]) - 4, K.metalD); L0.disc(q[0], q[1], 3, (x, y, ex, ey) => (ex * ex + ey * ey > 4) ? K.metal : (ex === 0 && ey <= 0) ? K.mkR : K.frame); }
  /* 5 loop arrow */ { const q = L0.P(45, 10, 27); L0.disc(q[0], q[1], 3, (x, y, ex, ey) => { const r = ex * ex + ey * ey; if (r < 2 || (ex > 1 && ey < -1)) return 0; return K.ring; }); L0.set(F(q[0]) + 3, F(q[1]) - 2, K.ring); L0.set(F(q[0]) + 2, F(q[1]) - 3, K.ring); }
  /* 6 three coins */ L0.box(51, 7, 26, 4, 4, 1, K.coin, K.coin2, K.coin2); L0.box(55, 10, 26, 4, 4, 2, K.coin, K.coin2, K.coin2); L0.box(52, 13, 26, 4, 4, 3, K.coin, K.coin2, K.coin2);
  /* 7 filing cabinet */ L0.box(59, 6, 26, 5, 5, 7, K.cabG, (sx, sy) => { const [, v] = L0.lUV(sx, sy, 11); const b = F(v) - 26; return (b === 3 || b === 6) ? K.cabG2 : (b === 1 && F(L0.lUV(sx, sy, 11)[0]) === 61) ? K.metal : K.cabG; }, K.cabG2);
  /* 8 wrench on the bench front */ { const a = L0.P(24, 20, 20), b = L0.P(34, 20, 14); L0.line(a[0], a[1], b[0], b[1], K.metal); L0.line(a[0] + 1, a[1], b[0] + 1, b[1], K.metalD); L0.set(F(a[0]) - 1, F(a[1]) - 1, K.metal); L0.set(F(a[0]) + 1, F(a[1]) - 1, K.metal); L0.set(F(a[0]), F(a[1]) - 2, K.metal); }
  L0.cur = 0;
  /* plant in the back-right corner */
  L0.cur = ID.plant;
  L0.box(124, 4, 0, 13, 13, 12, (sx, sy) => { const [u, v] = L0.tUV(sx, sy, 12); return (u > 125 && u < 136 && v > 5 && v < 16) ? K.potT : K.pot; }, K.pot, K.potR);
  { const [px, py] = L0.P(130, 10, 12); const leaves = [[-8, -8, 5], [7, -11, 6], [-3, -17, 6], [8, -24, 5], [-10, -22, 5], [1, -30, 5], [-5, -36, 4], [6, -37, 3]];
    leaves.forEach(([dx, dy, r], i) => L0.disc(px + dx, py + dy, r, (x, y, ex, ey) => { const s = ex + ey; if (s < -r * .5) return K.leaf1; if (s > r * .6) return K.leaf3; return ((x + y + i) % 7 === 0) ? K.leaf3 : K.leaf2; }));
    L0.line(px, py, px - 3, py - 18, K.leaf3); L0.line(px, py, px + 6, py - 22, K.leaf3); }
  L0.cur = 0;
  /* terminal cabinet + CRT (left wall, between window and door) */
  L0.cur = ID.term;
  L0.box(2, 74, 0, 20, 26, 26, K.cabT, K.cabL, (sx, sy) => { const [u0, v0] = L0.rUV(sx, sy, 22); const u = F(u0), v = F(v0); if (v < 2 || v === 25 || u === 74 || u === 99 || u === 87) return K.cabLine; if ((u === 80 || u === 93) && v >= 14 && v < 17) return K.knob; return K.cabR; });
  L0.box(4, 78, 26, 16, 18, 15, K.crtT, K.crtL, (sx, sy) => { const [u0, v0] = L0.rUV(sx, sy, 20); const u = F(u0), v = F(v0); if (u < 81 || u >= 94 || v < 29 || v >= 39) return (v === 26) ? K.crtB : K.crtR; L0.emit = 1; const row = 38 - v, p = 93 - u; const lines = [[0, 7], [0, 4], [0, 9], [0, 3]]; if (row % 2 === 1) { const li = (row - 1) / 2; if (li < 4 && p < lines[li][1]) return li === 3 && p === lines[li][1] - 1 ? K.crtG : (p % 3 === 2 ? K.crtG2 : K.crtG); } return K.crtS; });
  L0.box(5, 97, 26, 2, 2, 3, K.cover, K.cover2, K.cover2);
  L0.cur = 0;

  /* ---- mid layer: desk and chair seat ---- */
  L1.cur = ID.desk;
  L1.box(72, 38, 0, 50, 20, 32, (sx, sy) => { const [u, v] = L1.tUV(sx, sy, 32); if (F(v) === 57) return K.oakRim; const g = Math.sin(v * 1.9 + Math.sin(u * .12) * 1.6); return g > .75 ? D(K.oakT, K.oakT2, .7, sx, sy) : K.oakT; }, (sx, sy) => { const [u0, v0] = L1.lUV(sx, sy, 58); const u = F(u0), v = F(v0); if (v === 10 || v === 21 || u === 72 || u === 121) return K.oakR; if (u >= 100 && u < 104 && (v === 5 || v === 16 || v === 27)) return K.mon2; return K.oakL; }, K.oakR);
  /* monitor on the desk, screen faces the chair */
  L1.gx = G.monitor;
  L1.box(90, 40, 32, 14, 8, 2, K.mon1, K.mon2, K.mon3);
  L1.box(95, 42, 34, 4, 3, 6, K.mon1, K.mon2, K.mon3);
  L1.box(84, 43, 40, 26, 3, 20, K.mon1, (sx, sy) => { const [u0, v0] = L1.lUV(sx, sy, 46); const u = F(u0), v = F(v0); if (u < 86 || u >= 108 || v < 42 || v >= 58) return K.mon2; L1.emit = 1;
    if (v === 57) { if (u === 88 || u === 90 || u === 92) return [K.tO, K.tB, K.tG][(u - 88) / 2]; return K.scr2; }
    if (u < 91) { if (u === 90) return K.scr; const r = 55 - v; if (r % 3 === 0 && r <= 9 && u >= 87 && u < 89) return [K.tG, K.tO, K.tB, K.tD][r / 3]; return K.scr2; }
    const r = 55 - v; if (r % 2 === 1) { const li = (r - 1) / 2, p = u - 92; const lens = [11, 7, 13, 5, 10, 8, 12]; if (li < lens.length && p < lens[li]) return (p % 4 === 0) ? [K.tO, K.tD, K.tG, K.tB, K.tD, K.tG, K.tD][li] : K.tx; }
    return K.scr; }, K.mon3);
  /* keyboard, mouse */
  L1.gx = G.keys;
  L1.box(88, 50, 32, 18, 6, 1, (sx, sy) => { const [u, v] = L1.tUV(sx, sy, 33); return (F(u) % 3 === 0 || F(v) % 3 === 2) ? K.keyD : K.keyT; }, K.keyL, K.keyR);
  L1.box(109, 51, 32, 3, 4, 1, K.keyT, K.keyL, K.keyR);
  L1.gx = -1;
  L1.cur = ID.handheld;
  L1.box(74, 46, 32, 10, 14, 3, (sx, sy) => { const [u0, v0] = L1.tUV(sx, sy, 35); const u = F(u0) - 74, v = F(v0) - 46; if (u >= 2 && u < 8 && v >= 2 && v < 8) { if (u === 2 || u === 7 || v === 2 || v === 7) return K.hhS2; return (u === 4 && v === 4) ? K.hhK : K.hhS; } if ((u === 3 && v >= 9 && v < 12) || (v === 10 && u >= 2 && u < 5)) return K.hhK; if ((u === 6 || u === 8) && (v === 10 || v === 11) && ((u === 6) === (v === 11))) return K.hhK; return K.hhY; }, K.hhL, K.hhR);
  L1.cur = ID.mug;
  L1.box(112, 41, 32, 5, 5, 6, (sx, sy) => { const [u, v] = L1.tUV(sx, sy, 38); return (u > 112.5 && u < 116 && v > 41.5 && v < 45) ? K.coffee : K.mugT; }, (sx, sy) => { const [, v] = L1.lUV(sx, sy, 46); return (v > 34 && v < 36.5) ? K.cover : K.mugL; }, K.mugR);
  L1.box(117, 43, 34, 2, 2, 3, K.mugT, K.mugL, K.mugR);
  /* cinnamon bun on a plate */
  L1.gx = G.bun;
  { const q = L1.P(114, 51, 32); L1.disc(q[0], q[1], 4, (x, y, ex, ey) => (ey > 0 || Math.abs(ex) > 3) ? K.plate : 0); L1.disc(q[0], q[1] - 1, 3, (x, y, ex, ey) => { const r = ex * ex + ey * ey; if (r < 1) return K.bun2; if ((ex === 2 && ey === -1) || (ex === -1 && ey === -2) || (ex === 0 && ey === 2)) return K.sugar; return (r > 5 || (ex === 1 && ey === 1)) ? K.bun2 : K.bun; }); }
  L1.cur = 0; L1.gx = -1;
  /* desk lamp */
  L1.grp = G.lamp;
  L1.box(118, 39, 32, 4, 4, 1, K.lampP, K.lampP, K.lampP);
  { const a = L1.P(120, 41, 33), b = L1.P(120, 41, 50); L1.line(a[0], a[1], b[0], b[1], K.lampP); L1.line(b[0], b[1], b[0] - 7, b[1] + 3, K.lampP); L1.emit = N ? 1 : 0; L1.box(112, 40, 46, 8, 5, 4, K.lampS, K.lampS2, K.lampS2); if (N) { L1.poly([L1.P(112, 45, 46), L1.P(120, 45, 46), L1.P(120, 45, 44), L1.P(112, 45, 44)], K.lampG); } L1.emit = 0; }
  /* chair base and seat */
  L1.grp = G.chair;
  { const c = [96, 66, 3]; [[0, -10], [9, -3], [6, 8], [-6, 8], [-9, -3]].forEach(([a, b]) => { L1.line3(c, [96 + a, 66 + b, 2], K.chair2); const q = L1.P(96 + a, 66 + b, 1); L1.set(F(q[0]), F(q[1]), K.chromeD); L1.set(F(q[0]) + 1, F(q[1]), K.chromeD); }); }
  L1.box(95, 65, 4, 2, 2, 12, K.chrome, K.chrome, K.chromeD);
  L1.box(88, 58, 16, 16, 16, 4, K.chairT, K.chair, K.chair2);

  /* ---- near layer: chair back, football ---- */
  L2.grp = G.chair;
  L2.box(88, 74, 20, 16, 3, 22, (sx, sy) => ((sx + sy) & 1) ? K.chairT : 0, (sx, sy) => ((sx + sy) & 1) ? K.chair : 0, K.chair2);
  L2.box(88, 74, 42, 16, 3, 3, K.chairT, K.chair, K.chair2);
  L2.box(86, 70, 20, 2, 2, 8, K.chair, K.chair, K.chair2); L2.box(104, 70, 20, 2, 2, 8, K.chair, K.chair, K.chair2);
  L2.cur = ID.ball;
  { const q = L2.P(124, 126, 5); L2.disc(q[0], q[1], 5, (x, y, ex, ey) => { const r = ex * ex + ey * ey; if (r > 20) return K.ballS; if ((ex === 0 && ey === 0) || (ex === -1 && ey === -1) || (ex === 1 && ey === -1) || (ex === 0 && ey === 1) || (ex === -3 && ey === 1) || (ex === 3 && ey === 1) || (ex === -2 && ey === -4) || (ex === 2 && ey === -4)) return K.ballD; return (ex + ey < -3) ? K.sugar : K.ball; }); L2.disc(q[0], q[1] + 5, 5, (x, y, ex, ey) => (ey >= 0 && ey < 2 && Math.abs(ex) < 5 - ey) ? pack(40, 30, 20, 60) : 0); }
  L2.cur = 0;

  /* night and dusk grading, then outlines */
  if (theme !== 'day') {
    const lamp = L1.P(118, 43, 46);
    for (const R of L) for (const [b, em] of [[R.b, R.em], [R.u, null]]) { for (let i = 0; i < W * H; i++) { const c = b[i]; if (!c || (em && em[i]) || (c >>> 24) < 255) continue; const x = i % W, y = (i / W) | 0; let r = c & 255, g = (c >>> 8) & 255, bb = (c >>> 16) & 255;
      if (N) { const d = Math.hypot(x - lamp[0], (y - lamp[1]) * 1.4); const k = d < 70 ? (1 - d / 70) * .55 : 0; const nr = r * .40 + 10, ng = g * .44 + 14, nb = bb * .60 + 38; b[i] = pack(Math.min(255, nr + (r - nr) * k) | 0, Math.min(255, ng + (g - ng) * k) | 0, Math.min(255, nb + (bb - nb) * k * .7) | 0); }
      else { b[i] = pack(Math.min(255, r * .92 + 12) | 0, (g * .84 + 6) | 0, (bb * .86 + 2) | 0); } } }
  }
  const oc = N ? K.outlineN : K.outline;
  L0.outline(oc); L1.outline(oc); L2.outline(oc);
  /* hit boxes by id, merged across layers */
  const BB = {};
  for (const R of L) for (let i = 0; i < W * H; i++) { const id = R.id[i]; if (!id) continue; const x = i % W, y = (i / W) | 0; const b = BB[id] || (BB[id] = { x0: x, y0: y, x1: x, y1: y }); if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y; }
  Object.values(BB).forEach(b => { b.x = b.x0; b.y = b.y0; b.w = b.x1 - b.x0 + 1; b.h = b.y1 - b.y0 + 1; });
  return { layers: L.map(R => R.img), groups: L.map(R => R.g), under: L.map(R => [R.u, R.ug]), BB };
}

/* ---------- the character ---------- */
const CW = 32, CH = 52;
const C = { skin: '#AE754F', skinD: '#91603F', skinL: '#BD8560', hair: '#1F1A17', hair2: '#2E2723', hair3: '#3A322C', hood: '#3D9081', hoodL: '#2D7466', hoodD: '#235D52', hoodHi: '#4FA392', str: '#E6E0CF', pants: '#3B4258', pantsD: '#2F3447', pantsL: '#4A5474', shoe: '#EEE9DF', shoeD: '#CFC9BD', sole: '#3A2E24', eye: '#1A1410', white: '#F6F1E8', mouth: '#7A4A30', marker: '#9E3B2C', out: '#2A211B' };
const frameCache = new Map();
function drawFigure(g, pose, dir, k) {
  const r = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
  const back = dir === 'b';
  const walk = pose === 'walk';
  const bob = walk ? [0, -1, 0, -1][k] : (pose === 'idle' || pose === 'wave' || pose === 'point' || pose === 'type') ? [0, -1][k & 1] * (pose === 'idle' ? 1 : 0) : 0;
  const sit = pose === 'sit';
  const oy = sit ? 12 : 0;
  const by = bob + oy; /* body offset */
  /* legs and shoes */
  if (!sit) {
    const feet = walk ? [[-2, 1], [0, 0], [1, -2], [0, 0]][k] : [0, 0];
    const lx = 10 + (walk ? F(feet[0] / 2) : 0), rx = 17 + (walk ? F(feet[1] / 2) : 0);
    r(lx, 33, 5, 12, C.pants); r(lx + 4, 33, 1, 12, C.pantsD); r(lx, 33, 1, 12, C.pantsL);
    r(rx, 33, 5, 12, C.pants); r(rx + 4, 33, 1, 12, C.pantsD);
    const lfy = 45 + (walk && feet[0] < 0 ? 1 : 0), rfy = 45 + (walk && feet[1] < 0 ? 1 : 0);
    const lfx = lx - 1 + feet[0], rfx = rx + feet[1];
    r(lfx, lfy, 6, 4, C.shoe); r(lfx, lfy + 3, 6, 1, C.sole); r(back ? lfx : lfx + 4, lfy + 1, 2, 2, C.shoeD);
    r(rfx, rfy, 6, 4, C.shoe); r(rfx, rfy + 3, 6, 1, C.sole); r(back ? rfx : rfx + 4, rfy + 1, 2, 2, C.shoeD);
  } else {
    r(9, 33 + oy, 14, 5, C.pants); r(9, 37 + oy, 14, 1, C.pantsD);
  }
  /* torso */
  r(9, 17 + by, 14, 16, C.hood); r(19, 17 + by, 4, 16, C.hoodL); r(9, 17 + by, 1, 16, C.hoodHi);
  if (back) { r(10, 16 + by, 12, 8, C.hoodD); r(11, 16 + by, 10, 1, C.hoodL); r(12, 22 + by, 8, 1, C.hoodL); }
  else { r(11, 17 + by, 10, 2, C.hoodD); r(13, 19 + by, 6, 1, C.hoodD); r(15, 19 + by, 1, 4, C.str); r(17, 19 + by, 1, 4, C.str); r(11, 27 + by, 10, 5, C.hoodL); r(11, 27 + by, 10, 1, C.hoodD); r(11, 27 + by, 1, 5, C.hoodD); r(20, 27 + by, 1, 5, C.hoodD); }
  /* arms */
  const swing = walk ? [1, 0, -1, 0][k] : 0;
  const armL = () => { r(6, 19 + by + swing, 3, 13, C.hood); r(6, 19 + by + swing, 1, 13, C.hoodHi); r(6, 32 + by + swing, 3, 3, C.skin); };
  const armR = () => { r(23, 19 + by - swing, 3, 13, C.hoodL); r(23, 32 + by - swing, 3, 3, C.skin); };
  if (pose === 'sit' || pose === 'type') { /* both arms forward, hands at the keys */
    const hy = (k & 1) ? 0 : 1;
    r(6, 19 + by, 3, 8, C.hood); r(23, 19 + by, 3, 8, C.hoodL); r(6, 26 + by + hy, 3, 3, C.skin); r(23, 26 + by + (1 - hy), 3, 3, C.skin);
  } else if (pose === 'point') {
    armL();
    const hx = (k & 1) ? 1 : 0;
    r(23, 14 + by, 3, 6, C.hoodL); r(24 + hx, 9 + by, 3, 6, C.hoodL); r(25 + hx, 6 + by, 3, 3, C.skin); r(27 + hx, 3 + by, 1, 4, C.marker);
  } else if (pose === 'wave') {
    armL();
    const hx = (k & 1) ? 2 : 0;
    r(23, 12 + by, 3, 8, C.hoodL); r(24 + hx, 7 + by, 3, 6, C.hoodL); r(24 + hx, 4 + by, 3, 3, C.skin);
  } else { armL(); armR(); }
  /* head */
  const hy = by;
  r(14, 15 + hy, 4, 2, C.skinD);
  r(11, 7 + hy, 10, 9, C.skin); r(11, 7 + hy, 1, 9, C.skinL); r(20, 8 + hy, 1, 8, C.skinD);
  if (back) { r(10, 3 + hy, 12, 12, C.hair); r(12, 2 + hy, 8, 1, C.hair); r(11, 5 + hy, 2, 7, C.hair2); r(19, 4 + hy, 2, 6, C.hair3); r(13, 12 + hy, 6, 2, C.hair2); }
  else {
    r(10, 3 + hy, 12, 5, C.hair); r(12, 2 + hy, 8, 1, C.hair); r(10, 8 + hy, 2, 5, C.hair); r(20, 8 + hy, 2, 4, C.hair); r(13, 3 + hy, 4, 1, C.hair3); r(16, 7 + hy, 5, 1, C.hair2);
    r(12, 10 + hy, 3, 1, C.hair2); r(17, 10 + hy, 3, 1, C.hair2);
    r(13, 11 + hy, 1, 1, C.white); r(14, 11 + hy, 1, 1, C.eye); r(18, 11 + hy, 1, 1, C.white); r(19, 11 + hy, 1, 1, C.eye);
    r(16, 13 + hy, 1, 1, C.skinD);
    r(14, 14 + hy, 4, 1, C.mouth); r(13, 16 + hy, 6, 1, C.skinD);
  }
}
function frameFor(pose, dir, mirror, k) {
  const key = pose + dir + (mirror ? 'm' : '') + k; let c = frameCache.get(key); if (c) return c;
  c = document.createElement('canvas'); c.width = CW; c.height = CH; const g = c.getContext('2d');
  if (mirror) { g.translate(CW, 0); g.scale(-1, 1); }
  drawFigure(g, pose, dir, k);
  /* outline */
  const im = g.getImageData(0, 0, CW, CH), d = im.data, o = []; const op = (x, y) => x >= 0 && y >= 0 && x < CW && y < CH && d[(y * CW + x) * 4 + 3] === 255;
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) if (!op(x, y) && (op(x - 1, y) || op(x + 1, y) || op(x, y - 1) || op(x, y + 1))) o.push((y * CW + x) * 4);
  for (const i of o) { d[i] = 0x2A; d[i + 1] = 0x21; d[i + 2] = 0x1B; d[i + 3] = 255; }
  g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(im, 0, 0);
  /* shadow under the feet, behind the figure */
  g.globalCompositeOperation = 'destination-over'; g.fillStyle = 'rgba(40,30,20,.28)';
  const sy = pose === 'sit' ? 49 : 48; g.fillRect(9, sy, 14, 3); g.fillRect(7, sy + 1, 18, 1);
  frameCache.set(key, c); return c;
}

/* ---------- the walker ---------- */
const NODES = {
  desk: { x: 96, y: 66, z: 16, pose: 'sit', dir: 'b', m: false, label: 'the desk · product and architecture' },
  hub: { x: 132, y: 72 }, c1: { x: 132, y: 28 },
  frames: { x: 118, y: 19, pose: 'idle', dir: 'b', m: false, label: 'the framed wall · the work' },
  board: { x: 50, y: 28, pose: 'point', dir: 'b', m: false, label: 'the whiteboard · strategy' },
  bench: { x: 24, y: 28, pose: 'type', dir: 'b', m: false, label: 'the workbench · building' },
  window: { x: 22, y: 44, pose: 'idle', dir: 'b', m: true, label: 'the window' },
  t1: { x: 74, y: 94 },
  term: { x: 34, y: 90, pose: 'type', dir: 'b', m: true, label: 'the terminal · checking and shipping' },
  d1: { x: 74, y: 110 },
  door: { x: 30, y: 122, pose: 'wave', dir: 'f', m: false, label: 'the door · contact' }
};
const EDGES = [['desk', 'hub'], ['hub', 'c1'], ['c1', 'frames'], ['frames', 'board'], ['board', 'bench'], ['bench', 'window'], ['board', 'window'], ['window', 'term'], ['hub', 't1'], ['t1', 'term'], ['t1', 'd1'], ['d1', 'door'], ['term', 'door']];
const ADJ = {}; for (const [a, b] of EDGES) { (ADJ[a] = ADJ[a] || []).push(b); (ADJ[b] = ADJ[b] || []).push(a); }
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function shortest(from, to) { /* Dijkstra on the small graph, from a node name */
  const d = { [from]: 0 }, prev = {}, todo = new Set(Object.keys(NODES));
  while (todo.size) { let u = null; for (const n of todo) if (d[n] !== undefined && (u === null || d[n] < d[u])) u = n; if (u === null) break; todo.delete(u); if (u === to) break; for (const v of ADJ[u]) { const nd = d[u] + dist(NODES[u], NODES[v]); if (d[v] === undefined || nd < d[v]) { d[v] = nd; prev[v] = u; } } }
  const path = []; for (let n = to; n; n = prev[n]) { path.unshift(n); if (n === from) break; } return { path, len: d[to] };
}

function mount(opts) {
  const root = opts.root; /* .room element, gets the canvases */
  const VM = 8; /* bob margin for the sprite box */
  const layers = [0, 1, 2].map(i => { const c = document.createElement('canvas'); c.width = W; c.height = H; c.className = 'rl rl' + i; c.setAttribute('aria-hidden', 'true'); return c; });
  const charEl = document.createElement('div'); charEl.className = 'ch'; charEl.id = 'walker'; charEl.setAttribute('aria-hidden', 'true');
  const ca = document.createElement('canvas'), cb = document.createElement('canvas'); for (const c of [ca, cb]) { c.width = CW; c.height = CH; c.className = 'cf'; charEl.appendChild(c); }
  const hots = document.createElement('div'); hots.className = 'hots';
  if (opts.pieces) root.append(charEl, hots);
  else { root.append(layers[0], layers[1], charEl, layers[2], hots); root.insertBefore(charEl, layers[1]); }

  let theme = opts.theme || themeFor(new Date()), baked = null, s = 1;
  let pieces = [];
  function rebake() {
    baked = bake(theme); root.dataset.theme = theme;
    if (opts.pieces) splitPieces(); else layers.forEach((c, i) => c.getContext('2d').putImageData(baked.layers[i], 0, 0));
    layoutHots(); opts.onBake && opts.onBake(pieces);
  }
  /* one canvas per piece and layer, cropped to its pixels, so the intro can move each on its own */
  function splitPieces() {
    for (const p of pieces) p.el.remove();
    pieces = [];
    baked.layers.forEach((img, li) => {
      const src = new Uint32Array(img.data.buffer), g = baked.groups[li], [u, ug] = baked.under[li], bb = {};
      const grow = (k, i) => { const x = i % W, y = (i / W) | 0, b = bb[k] || (bb[k] = { x0: x, y0: y, x1: x, y1: y }); if (x < b.x0) b.x0 = x; if (x > b.x1) b.x1 = x; if (y < b.y0) b.y0 = y; if (y > b.y1) b.y1 = y; };
      for (let i = 0; i < W * H; i++) { if (src[i]) grow(g[i], i); if (u[i]) grow(ug[i], i); }
      for (const k of Object.keys(bb)) {
        const b = bb[k], w = b.x1 - b.x0 + 1, h = b.y1 - b.y0 + 1, out = new ImageData(w, h), o = new Uint32Array(out.data.buffer);
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = (y + b.y0) * W + x + b.x0; if (g[i] === +k) o[y * w + x] = src[i]; else if (u[i] && ug[i] === +k) o[y * w + x] = u[i]; }
        const c = document.createElement('canvas'); c.width = w; c.height = h; c.className = 'rl rl' + li; c.dataset.piece = GROUPS[k]; c.setAttribute('aria-hidden', 'true');
        c.getContext('2d').putImageData(out, 0, 0); root.insertBefore(c, hots);
        pieces.push({ name: GROUPS[k], layer: li, el: c, x: b.x0, y: b.y0, w, h });
      }
    });
    sizePieces();
  }
  function sizePieces() { for (const p of pieces) { const st = p.el.style; st.left = p.x * s + 'px'; st.top = p.y * s + 'px'; st.width = p.w * s + 'px'; st.height = p.h * s + 'px'; } }

  /* hotspots */
  const hotDefs = opts.hotspots || [];
  const btns = [];
  for (const h of hotDefs) { const b = document.createElement('button'); b.type = 'button'; b.className = 'hot'; b.dataset.id = h.id; b.setAttribute('aria-label', h.label); b.addEventListener('click', () => h.onClick && h.onClick(h)); b.addEventListener('pointerenter', () => showTip(h, b)); b.addEventListener('pointerleave', hideTip); b.addEventListener('focus', () => showTip(h, b)); b.addEventListener('blur', hideTip); hots.appendChild(b); btns.push([h, b]); }
  const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'status'); root.appendChild(tip);
  function showTip(h, b) { tip.textContent = h.tip || h.label; tip.style.left = (b.offsetLeft + b.offsetWidth / 2) + 'px'; tip.style.top = Math.max(18, b.offsetTop - 6) + 'px'; tip.classList.add('on'); }
  function hideTip() { tip.classList.remove('on'); }
  function layoutHots() { if (!baked) return; for (const [h, b] of btns) { const bb = baked.BB[h.id]; if (!bb) { b.hidden = true; continue; } b.hidden = false; const min = 44; const w = Math.max(bb.w * s, min), hh = Math.max(bb.h * s, min); b.style.left = ((bb.x + bb.w / 2) * s - w / 2) + 'px'; b.style.top = ((bb.y + bb.h / 2) * s - hh / 2) + 'px'; b.style.width = w + 'px'; b.style.height = hh + 'px'; } }

  /* scale: whole device pixels, set once per resize */
  function resize() {
    s = 2;
    root.style.width = (W * s) + 'px'; root.style.height = (H * s) + 'px';
    layers.forEach(c => { c.style.width = (W * s) + 'px'; c.style.height = (H * s) + 'px'; });
    charEl.style.width = (CW * s) + 'px'; charEl.style.height = (CH * s) + 'px';
    for (const c of [ca, cb]) { c.style.width = (CW * s) + 'px'; c.style.height = (CH * s) + 'px'; }
    sizePieces(); layoutHots(); lastTx = null; render(true); camMeasure();
  }

  /* walker state */
  const N0 = NODES[opts.start] ? opts.start : 'desk', n0 = NODES[N0];
  const st = { x: n0.x, y: n0.y, z: n0.z || 0, zT: n0.z || 0, z0: n0.z || 0, zt0: 0, node: N0, target: N0, path: [], seg: 0, v: 0, pose: n0.pose, dir: n0.dir, m: n0.m, moving: false, active: ca, clock: 0, fi: 0, lastT: 0 };
  const VMAX = 80, ACC = 220, FPS = 8, ZDUR = 360;
  let lastTx = null, lastFrame = null, zBand = null;
  function setTarget(name) {
    if (!NODES[name] || name === st.target) return; st.target = name;
    /* reduced motion: the character keeps the still pose it was placed in; only the label (in the page) changes */
    if (RM.matches) return;
    /* plan from the current node, or from the nearer end of the current edge */
    let from = st.node, prefix = [];
    if (st.moving && st.path.length) { const a = st.path[Math.max(0, st.seg - 1)] || st.node, b = st.path[st.seg]; const pa = shortest(a, name), pb = shortest(b, name); const da = dist(st, NODES[a]) + pa.len, db = dist(st, NODES[b]) + pb.len; from = da <= db ? a : b; }
    const r = shortest(from, name); st.path = r.path; if (st.path[0] === from && st.moving && st.path.length > 1 && dist(st, NODES[from]) < .5) st.path.shift();
    if (!st.moving && st.path.length && st.path[0] === st.node) st.path.shift();
    st.seg = 0; st.moving = st.path.length > 0; if (st.moving) setPose('walk', st.dir, st.m); else arrive();
  }
  function place(name) {
    const n = NODES[name]; if (!n) return;
    st.target = st.node = name; st.path = []; st.moving = false; st.v = 0; st.x = n.x; st.y = n.y;
    st.pose = n.pose; st.dir = n.dir; st.m = n.m; st.z = st.zT = st.z0 = n.z || 0; pending = null;
    lastFrame = null; drawFrame(); lastTx = null; render(true); camStep(0);
  }
  function arrive() { const n = NODES[st.target]; st.node = st.target; st.moving = false; st.v = 0; st.x = n.x; st.y = n.y; setPose(n.pose, n.dir, n.m); opts.onArrive && opts.onArrive(st.target, n); }
  /* poses hold at least DWELL ms; a change that comes sooner waits in `pending` (the walker waits with it) */
  const DWELL = 320; let poseT = -1e9, pending = null;
  function setPose(pose, dir, m) {
    if (pose === st.pose && dir === st.dir && m === st.m) { pending = null; return; }
    const now = performance.now();
    if (!RM.matches && now - poseT < DWELL) { pending = [pose, dir, m]; return; }
    pending = null; poseT = now;
    st.pose = pose; st.dir = dir; st.m = m; setZ(pose === 'sit' ? (NODES[st.target].z || 0) : 0, now);
    /* cross-fade: draw the new pose on the hidden canvas, then swap opacities */
    const next = st.active === ca ? cb : ca; st.active = next; lastFrame = null; drawFrame(); next.style.opacity = '1'; (next === ca ? cb : ca).style.opacity = '0';
  }
  /* sitting raises the sprite; ease that over ZDUR ms instead of snapping 16 room px in one frame */
  function setZ(z, now) { if (z === st.zT) return; if (RM.matches) { st.z = st.zT = st.z0 = z; return; } st.z0 = st.z; st.zT = z; st.zt0 = now; }
  function stepZ(now) { if (st.z === st.zT) return; const t = Math.min(1, (now - st.zt0) / ZDUR), e = t * t * (3 - 2 * t); st.z = t >= 1 ? st.zT : st.z0 + (st.zT - st.z0) * e; }
  function drawFrame() {
    let k = 0; if (!RM.matches) { if (st.pose === 'walk') k = st.fi & 3; else if (st.pose === 'idle') k = (st.fi >> 2) & 1; else k = (st.fi >> 1) & 1; }
    const f = frameFor(st.pose, st.dir, st.m, k); if (f === lastFrame) return; lastFrame = f;
    const g = st.active.getContext('2d'); g.clearRect(0, 0, CW, CH); g.drawImage(f, 0, 0);
  }
  function step(dt) {
    if (!st.moving || st.pose !== 'walk') return; /* start walking only once the walk pose shows */
    const tgt = NODES[st.path[st.seg]]; let dx = tgt.x - st.x, dy = tgt.y - st.y, d = Math.hypot(dx, dy);
    let remain = d; for (let i = st.seg + 1; i < st.path.length; i++) remain += dist(NODES[st.path[i - 1]], NODES[st.path[i]]);
    const vWant = Math.min(VMAX, Math.sqrt(2 * ACC * remain) + 2);
    st.v = st.v < vWant ? Math.min(vWant, st.v + ACC * dt) : Math.max(vWant, st.v - ACC * 1.6 * dt);
    let move = st.v * dt;
    while (move > 0 && st.moving) {
      if (d <= move) { st.x = tgt.x; st.y = tgt.y; move -= d; st.seg++; if (st.seg >= st.path.length) { arrive(); break; } const n = NODES[st.path[st.seg]]; dx = n.x - st.x; dy = n.y - st.y; d = Math.hypot(dx, dy); continue; }
      st.x += dx / d * move; st.y += dy / d * move; move = 0;
    }
    if (st.moving) { /* facing from the direction of travel, dominant axis only */
      const ax = Math.abs(dx), ay = Math.abs(dy); let dir, m; if (ax >= ay) { dir = dx > 0 ? 'f' : 'b'; m = dx > 0 ? false : true; } else { dir = dy > 0 ? 'f' : 'b'; m = dy > 0 ? true : false; }
      if (dir !== st.dir || m !== st.m) { st.dir = dir; st.m = m; lastFrame = null; }
    }
  }
  function render(force) {
    const p = [OX + st.x - st.y, OY + (st.x + st.y) / 2 - st.z];
    const tx = (p[0] - CW / 2) * s, ty = (p[1] - (CH - 2)) * s;
    if (force || tx !== lastTx || ty !== lastTy) { charEl.style.transform = 'translate3d(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px,0)'; lastTx = tx; lastTy = ty; }
    const band = st.y < 50 ? 'behind' : 'front'; if (band !== zBand) { zBand = band; charEl.dataset.band = band; }
  }
  let lastTy = null;

  /* camera: the page maps scroll to a target (room origin on screen, zoom); here it is eased
     every frame with sub-pixel translate3d + scale, so the scene glides instead of stepping. */
  const cam = { x: 0, y: 0, z: 1, init: true, last: '' };
  function camMeasure() { cam.init = true; }
  function camStep(dt) {
    const t = opts.cam && opts.cam(st); if (!t) return;
    if (t.m) { const v = 'matrix(' + t.m.map(n => n.toFixed(5)).join(',') + ')'; if (v !== cam.last) { root.style.transform = v; cam.last = v; } return; }
    if (cam.init || RM.matches || dt === 0) { cam.x = t.x; cam.y = t.y; cam.z = t.z; cam.init = false; }
    else { const a = 1 - Math.exp(-dt * 16); cam.x += (t.x - cam.x) * a; cam.y += (t.y - cam.y) * a; cam.z += (t.z - cam.z) * a; }
    const v = 'translate3d(' + cam.x.toFixed(2) + 'px,' + cam.y.toFixed(2) + 'px,0) scale(' + cam.z.toFixed(4) + ')';
    if (v !== cam.last) { root.style.transform = v; cam.last = v; }
  }
  /* loop: runs only while visible */
  let raf = 0, visible = true, hidden = document.hidden, speed = 1;
  function loop(now) {
    raf = 0; if (!visible || hidden) return;
    const dt = Math.min(.05, (now - (st.lastT || now)) / 1000) * speed; st.lastT = now;
    if (pending && now - poseT >= DWELL) setPose(pending[0], pending[1], pending[2]);
    if (!RM.matches) { st.clock += dt; while (st.clock >= 1 / FPS) { st.clock -= 1 / FPS; st.fi++; } step(Math.min(dt, .02 * speed)); stepZ(now); } /* a slow frame slows the walk a little instead of doubling one step */
    drawFrame(); render(false); camStep(dt);
    opts.onFrame && opts.onFrame(now, st);
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && visible && !hidden) { st.lastT = 0; raf = requestAnimationFrame(loop); } }
  
  const ac = new AbortController(), sig = { signal: ac.signal };
  document.addEventListener('visibilitychange', () => { hidden = document.hidden; kick(); }, sig);
  addEventListener('resize', resize, sig);
  const ro = new ResizeObserver(camMeasure); ro.observe(document.body); /* expanders and late fonts change the page height */
  RM.addEventListener('change', () => { lastFrame = null; drawFrame(); camStep(0); }, sig);

  rebake(); resize(); drawFrame(); st.active.style.opacity = '1'; render(true); kick();
  /* re-bake when the Stockholm hour changes the light */
  const timer = setInterval(() => { const t = themeFor(new Date()); if (t !== theme && !opts.themeLocked) { theme = t; rebake(); } }, 60000);
  function destroy() { ac.abort(); ro.disconnect(); clearInterval(timer); if (raf) cancelAnimationFrame(raf); raf = 0; visible = false; root.replaceChildren(); root.style.transform = ''; }

  return {
    go: setTarget, place, state: st, nodes: NODES,
    cycleTheme() { theme = theme === 'day' ? 'dusk' : theme === 'dusk' ? 'night' : 'day'; opts.themeLocked = true; rebake(); return theme; },
    get theme() { return theme; }, get scale() { return s; }, get pieces() { return pieces; }, char: charEl, setSpeed(k) { speed = k; }, setVisible(v) { visible = v; if (v) kick(); }, frameFor, W, H, CW, CH, OX, OY, kick, camStep, destroy, pos: () => ({ x: st.x, y: st.y, moving: st.moving, pose: st.pose })
  };
}

/* ---------- small isometric thumbnails for the work tiles ---------- */
function thumb(c, kind) {
  const r = new Raster(84, 63, 42, 15);
  r.box(0, 0, -6, 40, 40, 6, (sx, sy) => D(K.cabT, K.cabL, .3, sx, sy), K.cabR, K.crtB);
  if (kind === 'thesis') {
    r.box(6, 8, 0, 28, 24, 1, K.cover, K.cover2, K.cover2);
    r.box(7, 9, 1, 26, 22, 1, (sx, sy) => { const [u0, v0] = r.tUV(sx, sy, 2); const u = F(u0), v = F(v0); if (u === 20) return K.cover2; if (u < 20) { if (v % 2 === 0 && u > 8 && u < 19 && v > 10 && v < 29) return K.pgL; return K.pg; } const bars = [[22, 8], [25, 13], [28, 5]]; for (const [a, h] of bars) if (u >= a && u < a + 2 && v >= 28 - h && v < 28) return a === 28 ? K.bar2 : K.bar; if (v === 28 && u > 21 && u < 32) return K.pgL; return K.pg2; }, K.pg2, K.pg2);
    r.line3([22, 30, 2.2], [32, 14, 2.2], K.mon2);
  } else if (kind === 'ambient') {
    r.box(16, 14, 0, 10, 8, 1, K.mon1, K.mon2, K.mon3); r.box(19, 16, 1, 4, 3, 6, K.mon1, K.mon2, K.mon3);
    r.box(4, 18, 7, 34, 3, 22, K.mon1, (sx, sy) => { const [u0, v0] = r.lUV(sx, sy, 21); const u = F(u0), v = F(v0); if (u < 6 || u >= 36 || v < 9 || v >= 27) return K.mon2; if (v >= 20 && v < 25 && u >= 10 && u < 32) { if ((u === 10 || u === 31) && (v === 20 || v === 24)) return D(K.sky2, K.sky1, .5, sx, sy); if (v === 22 && u >= 12 && u < 16) return K.tG; if (v === 22 && u >= 17 && u < 21) return K.tO; if (v === 22 && u >= 22 && u < 25) return K.tB; return K.mon3; } if (v >= 11 && v < 18 && u >= 9 && u < 30) return (v === 17 || u === 9) ? K.keyD : (v % 2 === 0 && u > 11 && u < 27 ? K.keyD : K.pg); return D(K.sky1, K.sky2, (v - 9) / 18, sx, sy); }, K.mon3);
  } else if (kind === 'house') {
    r.box(8, 8, 0, 24, 24, 14, null, (sx, sy) => { const [u, v] = r.lUV(sx, sy, 32); const a = F(u), b = F(v); if (a >= 17 && a < 22 && b < 9) return K.door; if ((a === 11 || a === 12 || a === 26 || a === 27) && b >= 6 && b < 10) return K.glass; return K.pg; }, (sx, sy) => { const [u, v] = r.rUV(sx, sy, 32); const a = F(u), b = F(v); if ((a === 14 || a === 15 || a === 24 || a === 25) && b >= 6 && b < 10) return K.glass; return K.pg2; });
    r.poly([r.P(8, 8, 14), r.P(20, 8, 26), r.P(20, 32, 26), r.P(8, 32, 14)], K.cover2);
    r.poly([r.P(20, 8, 26), r.P(32, 8, 14), r.P(32, 32, 14), r.P(20, 32, 26)], K.cover);
    r.poly([r.P(8, 32, 14), r.P(32, 32, 14), r.P(20, 32, 26)], K.pg);
    [[34, 30], [34, 34]].forEach(([x, y], i) => r.box(x - 4, y - 2, 0, 4, 4, 2 + i * 2, K.gold, K.hhL, K.hhR));
  } else if (kind === 'strategy') {
    r.box(6, 6, 0, 30, 24, 2, K.pg2, K.pgL, K.pgL);
    r.box(8, 7, 2, 26, 22, 2, (sx, sy) => { const [u0, v0] = r.tUV(sx, sy, 4); const u = F(u0), v = F(v0); if (u === 12 && v > 9 && v < 27) return K.cover; if (v % 3 === 0 && u > 14 && u < 31 && v > 9 && v < 27) return K.pgL; if (u > 9 && u < 12 && v > 10 && v < 14) return K.mkG; return K.pg; }, K.pg2, K.pg2);
    r.box(18, 20, 4, 14, 10, 1, K.cover, K.cover2, K.cover2);
    [[22, 4], [26, 8], [30, 12]].forEach(([x, h]) => r.box(x - 1, 34, 0, 3, 3, h, K.bar, K.mkG, K.ring));
  } else {
    r.box(10, 10, 0, 20, 20, 32, K.mon1, (sx, sy) => { const [u, v] = r.lUV(sx, sy, 30); const a = F(u), b = F(v); if (a % 5 >= 1 && a % 5 < 4 && b % 7 >= 2 && b % 7 < 5 && b < 30) return [K.tG, K.tO, K.tB, K.cityLit][(F(a / 5) + F(b / 7)) % 4]; return K.mon2; }, (sx, sy) => { const [u, v] = r.rUV(sx, sy, 30); const a = F(u), b = F(v); if (a % 5 >= 1 && a % 5 < 4 && b % 7 >= 2 && b % 7 < 5 && b < 30) return [K.tB, K.cityLit, K.tG, K.tO][(F(a / 5) + F(b / 7)) % 4]; return K.mon3; });
    r.line3([20, 20, 32], [20, 20, 40], K.mon1); const q = r.P(20, 20, 40); r.set(F(q[0]) + 1, F(q[1]), K.cover); r.set(F(q[0]) + 2, F(q[1]), K.cover); r.set(F(q[0]) + 1, F(q[1]) + 1, K.cover);
  }
  r.outline(K.outline);
  c.getContext('2d').putImageData(r.img, 0, 0);
}

return { mount, thumb, themeFor, ID };
}

