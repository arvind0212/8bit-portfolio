import * as THREE from 'three';

/* The room as a voxel world: every object is its own mesh of unit cubes (only the faces that
   show), so the intro can drop, pop and raise each one. x runs along the back wall, z towards
   the viewer, y up; the floor top is y = 0. */

const C = {
  plank1: '#C99159', plank2: '#BF8750', plank3: '#D29D65', seam: '#9E6B3D', slab: '#8A847A',
  wallA: '#9FB7A8', wallB: '#8EA897', wallTop: '#EEE7D7', base: '#EEE8DB', baseS: '#CDC4B2',
  frame: '#F5F0E6', frameS: '#CFC6B3', wood: '#4A3626', wood2: '#6B4F37',
  board: '#F8F6F0', boardF: '#B9B2A4', mkR: '#9E3B2C', mkG: '#2F6F5E', mkK: '#2A2724', mkB: '#3A6EA5',
  oakT: '#D9A76D', oakL: '#B5824B', oakR: '#956537', oakRim: '#E6BC83',
  benchT: '#C8BBA3', benchL: '#A3957C',
  mon1: '#3B3F47', mon2: '#2A2D33', scr: '#122029', tx: '#E6E0CF', tG: '#86D3A5', tO: '#F2A35B', tB: '#83B5E6', tD: '#5E7682',
  keyT: '#EDE7DB', keyD: '#CDC6B8', hhY: '#F3C843', hhK: '#3A3832',
  mugT: '#F3EDE1', coffee: '#4A2E1F', cover: '#9E3B2C',
  cabT: '#EFEAE0', cabL: '#DCD6CA', knob: '#5A544B', crtT: '#E2D9C4', crtS: '#0D1A12', crtG: '#6EE7A0',
  chair: '#33363C', chairT: '#41444B', chrome: '#A5ABB3',
  rugC: '#EBE0C9', rugR: '#A0412F', rugG: '#2F6F5E',
  pot: '#BC6741', potT: '#4F3424', leaf1: '#76B567', leaf2: '#54934D', leaf3: '#3D723D',
  door: '#2F5D50', door2: '#264D42', door3: '#3A6E60', handle: '#E2B33C', matB: '#8A6440', matB2: '#A07A4F',
  ball: '#F2EEE6', ballD: '#2A2724', lampP: '#2E3036', lampS: '#E6C27A',
  nY: '#F4D35E', pg: '#F8F3E6', coin: '#E2B33C', cabG: '#6E7680', metal: '#A5ABB3',
  pcSea: '#2E7FA8', pcSand: '#E3C58F', pcSky: '#F7D9A4', paper: '#F3EEE4'
};
const hash = (x, y, z) => { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 2246822519)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

class Vox {
  constructor() { this.m = new Map(); }
  k(x, y, z) { return ((x + 64) & 255) | (((y + 64) & 255) << 8) | (((z + 64) & 255) << 16); }
  set(x, y, z, c) { if (c) this.m.set(this.k(x, y, z), [x, y, z, c]); else this.m.delete(this.k(x, y, z)); }
  has(x, y, z) { return this.m.has(this.k(x, y, z)); }
  box(x, y, z, w, h, d, c) { for (let i = x; i < x + w; i++) for (let j = y; j < y + h; j++) for (let l = z; l < z + d; l++) this.set(i, j, l, typeof c === 'function' ? c(i, j, l) : c); }
  ball(cx, cy, cz, r, c) { const R = Math.ceil(r); for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) for (let l = -R; l <= R; l++) if (i * i + j * j + l * l <= r * r) this.set(Math.round(cx + i), Math.round(cy + j), Math.round(cz + l), typeof c === 'function' ? c(i, j, l) : c); }
  /* visible faces only, each voxel colour jittered a little so flat walls read as material */
  geometry(jit = .035) {
    const pos = [], nor = [], col = [], idx = [], c = new THREE.Color();
    const F = [[1, 0, 0, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]], [-1, 0, 0, [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]]],
      [0, 1, 0, [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]]], [0, -1, 0, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
      [0, 0, 1, [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]]], [0, 0, -1, [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]]];
    for (const [x, y, z, hex] of this.m.values()) {
      c.set(hex); const j = 1 + (hash(x, y, z) - .5) * 2 * jit; const r = c.r * j, g = c.g * j, b = c.b * j;
      for (const [nx, ny, nz, q] of F) {
        if (this.has(x + nx, y + ny, z + nz)) continue;
        const n = pos.length / 3;
        for (const [a, bb, cc] of q) { pos.push(x + a, y + bb, z + cc); nor.push(nx, ny, nz); col.push(r, g, b); }
        idx.push(n, n + 1, n + 2, n, n + 2, n + 3);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setIndex(idx); geo.computeBoundingBox();
    return geo;
  }
}

/* the monitor screen: world rectangle on the plane z = SZ, facing +z */
export const SCREEN = { x0: 16, x1: 30, y0: 15, y1: 24, z: 4.02 };
SCREEN.w = SCREEN.x1 - SCREEN.x0; SCREEN.h = SCREEN.y1 - SCREEN.y0;
SCREEN.c = new THREE.Vector3((SCREEN.x0 + SCREEN.x1) / 2, (SCREEN.y0 + SCREEN.y1) / 2, SCREEN.z);
export const ROOM = { center: new THREE.Vector3(21, 9, 19), radius: 33 };

function pixelTexture(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.colorSpace = THREE.SRGBColorSpace; t.generateMipmaps = false;
  return t;
}
function codeScreen(g, w, h) {
  g.fillStyle = C.scr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#1A313C'; g.fillRect(0, 0, 7, h); g.fillRect(0, h - 3, w, 3);
  [C.tG, C.tO, C.tB, C.tD].forEach((c, i) => { g.fillStyle = c; g.fillRect(2, 3 + i * 4, 3, 2); });
  const lens = [22, 14, 26, 10, 20, 16, 24, 12, 18];
  lens.forEach((l, i) => { for (let p = 0; p < l; p += 1) { g.fillStyle = p % 6 === 0 ? [C.tO, C.tD, C.tG, C.tB][i % 4] : C.tx; if (p % 6 !== 5) g.fillRect(10 + p, 3 + i * 3, 1, 1); } });
  [C.tO, C.tB, C.tG].forEach((c, i) => { g.fillStyle = c; g.fillRect(3 + i * 3, h - 2, 2, 1); });
}
function windowView(g, w, h) {
  for (let y = 0; y < h; y++) { const t = y / h; g.fillStyle = `rgb(${156 + t * 84 | 0},${193 + t * 29 | 0},${218 - t * 26 | 0})`; g.fillRect(0, y, w, 1); }
  g.fillStyle = '#FBF6EC'; g.fillRect(6, 8, 12, 2); g.fillRect(8, 6, 7, 2); g.fillRect(30, 12, 10, 2);
  const sea = h - 12;
  for (let x = 0; x < w; x++) {
    let top = sea - 6 - Math.floor(hash(x >> 2, 3, 1) * 8); let c = (x >> 2) % 2 ? '#8C9AA8' : '#A3B0BB';
    if (x >= 26 && x < 33) { top = sea - 18; c = '#A65B3E'; }
    if (x >= 28 && x < 31) { top = sea - 26; c = '#6FA595'; }
    g.fillStyle = c; g.fillRect(x, top, 1, sea - top);
    if (x === 29) { g.fillStyle = '#E2B33C'; g.fillRect(x, sea - 31, 1, 5); }
  }
  for (let y = sea; y < h; y++) for (let x = 0; x < w; x++) { g.fillStyle = hash(x >> 2, y, 7) > .86 && y & 1 ? '#8EB7CF' : '#79A6C2'; g.fillRect(x, y, 1, 1); }
}

/* name → { fx, build(v) } ; fx: pop (scale about centre), rise (grow up from the floor), drop */
function models() {
  const M = {};
  M.floor = { fx: 'pop', build: v => v.box(0, -2, 0, 44, 2, 40, (x, y, z) => { if (y === -2) return C.slab; const row = Math.floor(z / 3), off = (row * 7) % 14; if ((x + off) % 14 === 0) return C.seam; const t = hash(row, Math.floor((x + off) / 14), 0); return t < .33 ? C.plank1 : t < .66 ? C.plank2 : C.plank3; }) };
  const wall = (a, b) => (x, y, z) => y >= 29 ? C.wallTop : y < 1 ? C.baseS : y < 2 ? C.base : hash(x, y, z) > .92 ? b : a;
  M.wallB = { fx: 'rise', build: v => v.box(-2, -2, -2, 46, 32, 2, wall(C.wallA, C.wallB)) };
  M.wallL = { fx: 'rise', build: v => v.box(-2, -2, 0, 2, 32, 40, wall(C.wallB, C.wallA)) };
  M.window = { fx: 'pop', build: v => { v.box(0, 9, 6, 1, 15, 14, (x, y, z) => (y === 9 || y === 23 || z === 6 || z === 19 || z === 13 || y === 16) ? C.frame : 0); v.box(0, 8, 5, 2, 1, 16, C.frameS); } };
  M.board = { fx: 'pop', build: v => { v.box(2, 11, 0, 10, 12, 1, (x, y) => (x === 2 || x === 11 || y === 11 || y === 22) ? C.boardF : C.board);
    for (let i = 0; i < 4; i++) { const x = 3 + i * 2; v.box(x, 15, 0, 1, 2, 1, [C.mkG, C.mkK, C.mkG, C.mkR][i]); }
    v.box(3, 19, 0, 6, 1, 1, C.mkK); v.box(3, 13, 0, 7, 1, 1, C.mkB); v.set(10, 16, 0, C.mkR); v.set(10, 15, 0, C.mkR); v.box(1, 10, 0, 12, 1, 2, C.boardF); } };
  M.frames = { fx: 'pop', build: v => { const pics = [[C.tG, C.scr], [C.pcSky, C.tO], [C.tB, C.mon1], [C.hhY, C.cover]];
    [[35, 18], [40, 18], [35, 12], [40, 12]].forEach(([x, y], i) => v.box(x, y, 0, 4, 5, 1, (a, b) => (a === x || a === x + 3 || b === y || b === y + 4) ? C.wood : (b > y + 2 ? pics[i][0] : pics[i][1]))); } };
  M.door = { fx: 'pop', build: v => { v.box(0, 0, 29, 1, 22, 9, (x, y, z) => (z === 29 || z === 37 || y === 21) ? C.wood : ((z === 31 || z === 35) && y > 2 && y < 19 && y !== 10) || ((y === 3 || y === 9 || y === 11 || y === 18) && z > 30 && z < 36) ? C.door2 : C.door); v.set(1, 10, 31, C.handle); } };
  M.postcard = { fx: 'pop', build: v => v.box(0, 15, 21, 1, 3, 4, (x, y, z) => y === 15 ? C.pcSea : y === 16 ? C.pcSand : z === 23 ? C.frame : C.pcSky) };
  M.rug = { fx: 'pop', build: v => v.box(13, 0, 15, 23, 1, 17, (x, y, z) => (x === 13 || x === 35 || z === 15 || z === 31) ? C.rugR : ((x - 14) % 6 === 2) ? C.rugG : C.rugC) };
  M.mat = { fx: 'pop', build: v => v.box(1, 0, 30, 4, 1, 7, (x, y, z) => (x + z) & 1 ? C.matB : C.matB2) };
  M.desk = { fx: 'drop', build: v => {
    v.box(12, 10, 1, 22, 1, 9, (x, y, z) => z === 9 || x === 12 || x === 33 ? C.oakRim : C.oakT);
    for (const [x, z] of [[12, 1], [32, 1], [12, 8], [32, 8]]) v.box(x, 0, z, 2, 10, 2, C.oakR);
    v.box(26, 3, 2, 6, 7, 7, (x, y, z) => (y === 6 && z === 8) ? C.oakR : (z === 8 && x === 28 && (y === 4 || y === 8)) ? C.knob : C.oakL);
    v.box(14, 8, 1, 12, 2, 1, C.oakL); } };
  M.monitor = { fx: 'drop', build: v => { v.box(20, 11, 2, 6, 1, 3, C.mon1); v.box(22, 12, 2, 2, 2, 1, C.mon2); v.box(15, 14, 3, 16, 11, 1, C.mon1); v.box(19, 16, 2, 8, 7, 1, C.mon2); } };
  M.keyboard = { fx: 'drop', build: v => { v.box(18, 11, 6, 9, 1, 2, (x, y, z) => (x + z) % 3 === 0 ? C.keyD : C.keyT); v.box(28, 11, 6, 1, 1, 2, C.keyT); } };
  M.mug = { fx: 'drop', build: v => { v.box(13, 11, 3, 2, 2, 2, (x, y) => y === 12 && x === 13 ? C.coffee : C.mugT); v.set(15, 12, 3, C.mugT); } };
  M.lamp = { fx: 'drop', build: v => { v.box(30, 11, 2, 2, 1, 2, C.lampP); v.box(31, 12, 2, 1, 6, 1, C.lampP); v.box(28, 18, 2, 4, 1, 3, C.lampS); v.box(28, 17, 3, 3, 1, 2, C.lampS); } };
  M.handheld = { fx: 'drop', build: v => { v.box(14, 11, 6, 2, 1, 3, C.hhY); v.set(14, 11, 7, C.hhK); } };
  M.chair = { fx: 'drop', at: [37, 0, 15], rot: -.6, build: v => {
    v.box(-3, 0, 0, 7, 1, 1, C.chair); v.box(0, 0, -3, 1, 1, 7, C.chair); v.box(0, 1, 0, 1, 5, 1, C.chrome);
    v.box(-3, 6, -3, 7, 1, 7, C.chairT); v.box(-3, 7, 3, 7, 8, 1, (x, y) => y === 14 ? C.chairT : C.chair); } };
  M.bench = { fx: 'drop', build: v => { v.box(1, 7, 6, 6, 1, 14, C.benchT); for (const z of [6, 18]) { v.box(1, 0, z, 1, 7, 2, C.benchL); v.box(5, 0, z, 1, 7, 2, C.benchL); } v.box(1, 2, 7, 6, 1, 12, C.benchL); } };
  M.tools = { fx: 'drop', build: v => { v.box(2, 8, 7, 2, 1, 2, C.nY); v.box(2, 8, 10, 3, 1, 3, C.pg); v.set(3, 9, 11, C.mkG); v.box(2, 8, 14, 1, 1, 1, C.coin); v.box(3, 8, 15, 1, 2, 1, C.coin); v.box(2, 8, 17, 2, 3, 2, C.cabG); v.box(5, 8, 15, 1, 1, 3, C.metal); } };
  M.cabinet = { fx: 'drop', build: v => v.box(1, 0, 21, 6, 8, 7, (x, y, z) => x === 6 && (y === 4) ? C.knob : x === 6 && z === 24 ? C.cabL : C.cabT) };
  M.crt = { fx: 'drop', build: v => { v.box(1, 8, 22, 6, 6, 5, (x, y, z) => x === 6 && y > 8 && y < 13 && z > 22 && z < 26 ? (y === 11 && z < 25) || (y === 9 && z === 23) ? C.crtG : C.crtS : C.crtT); v.box(7, 8, 23, 1, 1, 1, C.cover); } };
  M.plant = { fx: 'drop', build: v => { v.box(39, 0, 2, 4, 4, 4, (x, y, z) => y === 3 && x > 39 && x < 42 && z > 2 && z < 5 ? C.potT : C.pot);
    v.box(40, 4, 3, 2, 3, 2, C.leaf3); v.ball(40.5, 9, 3.5, 3.2, (i, j, l) => i + j < -2 ? C.leaf1 : (i - l + j) > 2 ? C.leaf3 : C.leaf2); v.ball(42, 12, 4, 2, C.leaf1); v.ball(39, 12, 2, 1.6, C.leaf2); } };
  M.ball = { fx: 'drop', build: v => v.ball(38, 1, 32, 1.6, (i, j, l) => (i + j * 2 + l) % 3 === 0 ? C.ballD : C.ball) };
  return M;
}

export const ORDER = [
  { k: 'floor', names: ['floor'] },
  { k: 'wall', names: ['wallB', 'wallL'] },
  { k: 'hang', names: ['window', 'board', 'frames', 'door', 'postcard', 'rug', 'mat'] },
  { k: 'drop', names: ['desk', 'bench', 'cabinet', 'plant', 'chair'] },
  { k: 'drop', names: ['monitor', 'keyboard', 'lamp', 'mug', 'handheld', 'crt', 'tools', 'ball'] }
];

export function buildWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.paper);
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const items = {};
  for (const [name, def] of Object.entries(models())) {
    const v = new Vox(); def.build(v);
    const geo = v.geometry(), bb = geo.boundingBox;
    /* pivot: bottom centre for drops and rises, true centre for pops */
    const px = (bb.min.x + bb.max.x) / 2, pz = (bb.min.z + bb.max.z) / 2, py = def.fx === 'pop' ? (bb.min.y + bb.max.y) / 2 : bb.min.y;
    geo.translate(-px, -py, -pz);
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = name !== 'floor' && name !== 'rug' && name !== 'mat'; mesh.receiveShadow = true;
    const g = new THREE.Group(); g.add(mesh); g.name = name;
    if (def.at) { g.position.set(def.at[0], def.at[1], def.at[2]); g.rotation.y = def.rot || 0; mesh.position.set(px, py, pz); }
    else g.position.set(px, py, pz);
    items[name] = { name, fx: def.fx, group: g, mesh, base: g.position.clone(), h: bb.max.y - bb.min.y };
    scene.add(g);
  }
  /* the window view and the screen are flat textured planes on their objects */
  const view = new THREE.Mesh(new THREE.PlaneGeometry(12, 13), new THREE.MeshBasicMaterial({ map: pixelTexture(48, 52, windowView) }));
  view.rotation.y = Math.PI / 2; view.position.set(.05 - items.window.base.x, 16.5 - items.window.base.y, 13 - items.window.base.z); items.window.group.add(view);
  const scrMat = new THREE.MeshBasicMaterial({ map: pixelTexture(56, 36, codeScreen) });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), scrMat);
  const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.paper), transparent: true, opacity: 0, depthWrite: false });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN.w, SCREEN.h), glowMat);
  const mb = items.monitor.base;
  scr.position.set(SCREEN.c.x - mb.x, SCREEN.c.y - mb.y, SCREEN.z - mb.z); glow.position.copy(scr.position); glow.position.z += .01;
  items.monitor.group.add(scr, glow);

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x8a7a66, 1.7));
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.1);
  sun.position.set(70, 80, 60); sun.target.position.set(20, 0, 18); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50, near: 10, far: 220 }); sun.shadow.bias = -.0006; sun.shadow.normalBias = .02;
  scene.add(sun, sun.target);
  const lamp = new THREE.PointLight(0xffd89a, 18, 22, 1.6); lamp.position.set(-.5, 5.5, 1); items.lamp.group.add(lamp);

  return { scene, items, glow: glowMat, pick: [items.monitor.mesh, items.desk.mesh, scr] };
}
