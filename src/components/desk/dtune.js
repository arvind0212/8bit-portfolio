import { bezier } from './bezier';

/* tuning panel for the intro: sliders, curve editors, replay buttons; returns a cleanup */
const GROUPS = [
  ['Monitor to site', [
    ['screenMode', 'Transition', ['live', 'glow', 'dissolve']],
    ['screenOn0', 'Live: site appears from', 0, 1, .01],
    ['screenOn1', 'Live: site appears until', 0, 1, .01],
    ['heroAt', 'Hero load-in starts at', 0, 1, .01],
    ['roomOut0', 'Live: room fades to paper from', 0, 1, .01],
    ['glow0', 'Glow: screen lights from', 0, 1, .01],
    ['glow1', 'Glow: screen lights until', 0, 1, .01],
    ['fadeMs', 'Glow: site fade', 0, 1500, 10, 'ms'],
    ['dissolveMs', 'Dissolve: duration', 100, 2000, 10, 'ms'],
    ['tile', 'Dissolve: block size', 4, 64, 1, 'px']
  ]],
  ['Camera', [
    ['camAt', 'Starts after build begins', 0, 3000, 10, 'ms'],
    ['camDur', 'Duration', 600, 6000, 20, 'ms'],
    ['camEase', 'Camera curve'],
    ['fov0', 'Start lens (narrow = flatter)', 4, 40, .5, '°'],
    ['fov1', 'End lens', 15, 75, .5, '°'],
    ['perspLead', 'Lens change leads', 0, 1, .01],
    ['panLead', 'Pan leads zoom', 0, .6, .01],
    ['az0', 'Start angle', 0, 80, 1, '°'],
    ['el0', 'Start height', 5, 70, 1, '°'],
    ['el1', 'End height', -10, 20, .5, '°'],
    ['turnStart', 'Turn to screen from', 0, 1, .01],
    ['turnEnd', 'Turn to screen until', 0, 1, .01],
    ['fit', 'Room size (desktop)', .5, 1.8, .01, '×'],
    ['phoneFit', 'Room size (phone)', .5, 2.2, .01, '×'],
    ['over', 'Overscan at end', 1, 1.25, .005, '×'],
    ['backMul', 'Way back duration', .3, 2, .05, '×']
  ]],
  ['Room build', [
    ['delay', 'Start delay', 0, 1500, 10, 'ms'],
    ['overlap', 'Phase overlap', 0, .95, .01],
    ['pixel', 'Pixel size', 1, 5, 1, '×'],
    ['steps', 'Frame steps (fps, 0 = smooth)', 0, 30, 1],
    ['snap', 'Snap to whole voxels', 0, 1, 1],
    ['floorDur', 'Floor pop', 100, 1500, 10, 'ms'],
    ['popFrom', 'Pop start scale', 0, 1, .01],
    ['wallDur', 'Wall rise', 100, 1500, 10, 'ms'],
    ['wallStagger', 'Wall stagger', 0, 800, 10, 'ms'],
    ['hangDur', 'Wall items pop', 100, 1200, 10, 'ms'],
    ['hangStagger', 'Wall items stagger', 0, 300, 5, 'ms'],
    ['dropDur', 'Object drop', 200, 1600, 10, 'ms'],
    ['dropStagger', 'Object stagger', 0, 400, 5, 'ms'],
    ['dropH', 'Drop height', 2, 80, 1, ' vox'],
    ['fallPart', 'Fall vs landing', .3, .95, .01],
    ['squash', 'Landing squash', 0, .5, .01],
    ['popEase', 'Pop curve'], ['riseEase', 'Wall curve'], ['dropEase', 'Fall curve'], ['landEase', 'Landing curve']
  ]],
  ['Skipping', [
    ['skipRate', 'Speed-up when skipping', 1, 10, .1, '×'],
    ['skipRamp', 'Speed-up ramp', 0, 1000, 10, 'ms']
  ]]
];
const PRESETS = {
  'ease-in-out cubic': [.65, 0, .35, 1], 'ease-in-out quint': [.83, 0, .17, 1], 'ease-in-out expo': [.87, 0, .13, 1],
  'ease-out cubic': [.33, 1, .68, 1], 'ease-out quint': [.22, 1, .36, 1], 'ease-out back': [.34, 1.56, .64, 1],
  'ease-in cubic': [.32, 0, .67, 0], 'ease-in quad': [.55, 0, 1, .45], 'spring': [.3, 1.8, .5, 1], 'linear': [0, 0, 1, 1]
};
const fmt = (v, st) => st >= 1 ? String(Math.round(v)) : (+v).toFixed(st < .01 ? 3 : 2);

export function initDeskTune(page, S, DEF, act) {
  const ac = new AbortController(), sig = { signal: ac.signal };
  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; };
  const box = el('aside', 'dtune'); box.setAttribute('aria-label', 'Tune the intro');
  const head = el('div', 'dt-head');
  const tog = el('button', 'dt-tog', 'Tune'); tog.type = 'button';
  head.append(tog);
  const body = el('div', 'dt-body');
  const btns = el('div', 'dt-btns');
  const mk = (label, fn) => { const b = el('button', '', label); b.type = 'button'; b.addEventListener('click', fn, sig); btns.append(b); return b; };
  mk('Replay all', () => act.replay());
  mk('Camera only', () => act.camera());
  const copy = mk('Copy settings', async () => { try { await navigator.clipboard.writeText(JSON.stringify(S, null, 1)); copy.textContent = 'Copied'; } catch (e) { copy.textContent = 'Copy failed'; } setTimeout(() => { copy.textContent = 'Copy settings'; }, 1400); });
  mk('Reset', () => { act.reset(); sync(); });
  body.append(btns);

  const sync = () => { for (const f of fields) f.sync(); };
  const fields = [];
  for (const [title, items] of GROUPS) {
    const g = el('details', 'dt-g'); g.open = title === 'Monitor to site' || title === 'Camera';
    g.append(el('summary', '', title));
    for (const [k, label, a, b, st, unit] of items) {
      if (Array.isArray(a)) {
        const row = el('label', 'dt-row'); const sel = el('select');
        for (const o of a) { const op = el('option', '', o); op.value = o; sel.append(op); }
        sel.addEventListener('change', () => { S[k] = sel.value; act.change(k); }, sig);
        row.append(el('span', 'dt-l', label), sel); g.append(row);
        fields.push({ sync: () => { sel.value = S[k]; } });
      } else if (a === undefined) g.append(curve(k, label));
      else {
        const row = el('label', 'dt-row'); const r = el('input'); r.type = 'range'; r.min = a; r.max = b; r.step = st;
        const v = el('output', 'dt-v');
        const show = () => { v.textContent = fmt(S[k], st) + (unit || ''); row.classList.toggle('dt-mod', S[k] !== DEF[k]); };
        r.addEventListener('input', () => { S[k] = +r.value; show(); act.change(k); }, sig);
        r.addEventListener('dblclick', () => { S[k] = DEF[k]; r.value = S[k]; show(); act.change(k); }, sig);
        row.append(el('span', 'dt-l', label), v, r); g.append(row);
        fields.push({ sync: () => { r.value = S[k]; show(); } });
      }
    }
    body.append(g);
  }

  /* a cubic-bezier editor: preset list, four sliders and a drawn curve */
  function curve(k, label) {
    const w = el('div', 'dt-curve');
    const top = el('div', 'dt-ct'); const sel = el('select'); sel.append(el('option', '', 'custom'));
    for (const n of Object.keys(PRESETS)) { const o = el('option', '', n); o.value = n; sel.append(o); }
    top.append(el('span', 'dt-l', label), sel);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '-10 -40 120 140'); svg.setAttribute('class', 'dt-svg');
    const code = el('code', 'dt-code');
    const ins = [0, 1, 2, 3].map(i => { const r = el('input'); r.type = 'range'; r.step = .01; r.min = i % 2 ? -1 : 0; r.max = i % 2 ? 2 : 1; r.setAttribute('aria-label', label + ' ' + ['x1', 'y1', 'x2', 'y2'][i]); return r; });
    const draw = () => {
      const c = S[k], f = bezier(c); let d = '';
      for (let i = 0; i <= 60; i++) { const x = i / 60; d += (i ? 'L' : 'M') + (x * 100).toFixed(1) + ' ' + ((1 - f(x)) * 60).toFixed(1); }
      svg.innerHTML = '<rect x="0" y="0" width="100" height="60" class="dt-frame"/><line x1="0" y1="60" x2="' + c[0] * 100 + '" y2="' + (1 - c[1]) * 60 + '" class="dt-h"/><line x1="100" y1="0" x2="' + c[2] * 100 + '" y2="' + (1 - c[3]) * 60 + '" class="dt-h"/><path d="' + d + '" class="dt-p"/>';
      code.textContent = 'cubic-bezier(' + c.join(', ') + ')';
      const hit = Object.entries(PRESETS).find(([, p]) => p.every((v, i) => v === c[i])); sel.value = hit ? hit[0] : 'custom';
    };
    ins.forEach((r, i) => r.addEventListener('input', () => { S[k] = S[k].slice(); S[k][i] = +r.value; draw(); act.change(k); }, sig));
    sel.addEventListener('change', () => { if (!PRESETS[sel.value]) return; S[k] = PRESETS[sel.value].slice(); ins.forEach((r, i) => { r.value = S[k][i]; }); draw(); act.change(k); }, sig);
    const grid = el('div', 'dt-cg'); ins.forEach(r => grid.append(r));
    w.append(top, svg, grid, code);
    fields.push({ sync: () => { ins.forEach((r, i) => { r.value = S[k][i]; }); draw(); } });
    return w;
  }

  box.append(head, body);
  page.append(box);
  const setOpen = o => { box.classList.toggle('open', o); tog.textContent = o ? 'Close' : 'Tune'; tog.setAttribute('aria-expanded', String(o)); };
  tog.addEventListener('click', () => setOpen(!box.classList.contains('open')), sig);
  setOpen(innerWidth > 760);
  sync();
  return () => { ac.abort(); box.remove(); };
}
