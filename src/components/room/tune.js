/* type tuner: per-role font dials plus a bounding-box editor; returns a cleanup that removes everything it added */
const KEY='rp-tune-v4';
const GF='https://fonts.googleapis.com/css2?family=';
const FONTS=[
  ['Serif',[
    ['Instrument Serif',"'Instrument Serif',Georgia,serif",'Instrument+Serif'],
    ['Newsreader',"'Newsreader',Georgia,serif",'Newsreader:ital,wght@0,300..700;1,300..700'],
    ['Source Serif 4',"'Source Serif 4',Georgia,serif",'Source+Serif+4:ital,wght@0,300..700;1,300..700'],
    ['Literata',"'Literata',Georgia,serif",'Literata:ital,wght@0,300..700;1,300..700'],
    ['Fraunces',"'Fraunces',Georgia,serif",'Fraunces:wght@300..700'],
    ['DM Serif Display',"'DM Serif Display',Georgia,serif",'DM+Serif+Display'],
  ]],
  ['Display sans',[
    ['Bricolage Grotesque',"var(--rf-display),'Bricolage Grotesque',system-ui,sans-serif",''],
    ['Familjen Grotesk',"'Familjen Grotesk',system-ui,sans-serif",'Familjen+Grotesk:wght@400..700'],
    ['Schibsted Grotesk',"'Schibsted Grotesk',system-ui,sans-serif",'Schibsted+Grotesk:wght@400..800'],
  ]],
  ['Sans',[
    ['Atkinson Hyperlegible Next',"var(--rf-text),'Atkinson Hyperlegible Next',system-ui,sans-serif",''],
    ['Figtree',"'Figtree',system-ui,sans-serif",'Figtree:wght@300..800'],
    ['Geist',"'Geist',system-ui,sans-serif",'Geist:wght@300..800'],
    ['Inter',"'Inter',system-ui,sans-serif",'Inter:wght@300..800'],
    ['IBM Plex Sans',"'IBM Plex Sans',system-ui,sans-serif",'IBM+Plex+Sans:wght@300;400;500;600;700'],
    ['DM Sans',"'DM Sans',system-ui,sans-serif",'DM+Sans:wght@300..800'],
    ['Manrope',"'Manrope',system-ui,sans-serif",'Manrope:wght@300..800'],
    ['Source Sans 3',"'Source Sans 3',system-ui,sans-serif",'Source+Sans+3:wght@300..800'],
    ['Work Sans',"'Work Sans',system-ui,sans-serif",'Work+Sans:wght@300..800'],
  ]],
  ['Mono',[
    ['Martian Mono',"var(--rf-mono),'Martian Mono',ui-monospace,monospace",''],
    ['Geist Mono',"'Geist Mono',ui-monospace,monospace",'Geist+Mono:wght@400;500;600'],
    ['JetBrains Mono',"'JetBrains Mono',ui-monospace,monospace",'JetBrains+Mono:wght@300..800'],
    ['IBM Plex Mono',"'IBM Plex Mono',ui-monospace,monospace",'IBM+Plex+Mono:wght@300;400;500;600;700'],
    ['Space Mono',"'Space Mono',ui-monospace,monospace",'Space+Mono:wght@400;700'],
  ]],
];
const FONT=Object.fromEntries(FONTS.flatMap(([,l])=>l.map(([n,v,g])=>[n,{v,g}])));

const ROLES=[
  {k:'label',n:'Labels',sel:'.label,.cmeta,.eyebrow,.facts .k,.jstops small,.draft,.card.all .k,footer',d:{ff:'Martian Mono',fs:12,fw:500,lh:1.3,ls:.06,dk:76,mw:0},fs:[10,18,.5]},
  {k:'ui',n:'Nav & buttons',sel:'.top nav a,.top .who b,.btn,.read,.links a',d:{ff:'Atkinson Hyperlegible Next',fs:15,fw:600,lh:1.2,ls:0,dk:100,mw:0},fs:[12,22,.5]},
  {k:'card',n:'Case-study text',sel:'.cline,.wsum',d:{ff:'Atkinson Hyperlegible Next',fs:17.5,fw:400,lh:1.55,ls:0,dk:88,mw:56},fs:[13,22,.5]},
  {k:'hero',n:'Hero line',sel:'.value,.hi',d:{ff:'Atkinson Hyperlegible Next',fs:19,fw:400,lh:1.5,ls:0,dk:90,mw:52},fs:[14,30,.5]},
  {k:'body',n:'Body',sel:'.intro,.fit,.jcap,.jstops b,.facts b,.facts span',d:{ff:'Atkinson Hyperlegible Next',fs:18,fw:400,lh:1.6,ls:0,dk:88,mw:62},fs:[14,22,.5]},
  {k:'head',n:'Headings',sel:'h2,h3,.card.all b,.posts .pt',d:{ff:'Bricolage Grotesque',fs:46,fw:560,lh:1.06,ls:-.028,dk:100,mw:0},fs:[22,64,1]},
  {k:'disp',n:'Hero headline',sel:'h1',d:{ff:'Bricolage Grotesque',fs:76,fw:560,lh:1,ls:-.028,dk:100,mw:0},fs:[40,128,1]},
];
const ORDER=['disp','head','hero','body','card','label','ui'];
const ROLE=Object.fromEntries(ROLES.map(r=>[r.k,r]));
const DIALS=[
  ['fs','Size','px'],['fw','Weight','',[300,800,10]],['lh','Line height','',[1,2.2,.02]],
  ['ls','Letter spacing','em',[-.05,.15,.005]],['dk','Darkness','%',[40,100,1]],['mw','Max line width','ch',[0,100,1]],
];
const PRESETS={
  Current:{},
  Lively:{disp:{fw:640,ls:-.035},head:{fw:640,ls:-.035}},
  Familjen:{disp:{ff:'Familjen Grotesk',fw:650,ls:-.03},head:{ff:'Familjen Grotesk',fw:650,ls:-.03},hero:{ff:'Figtree'},body:{ff:'Figtree'},card:{ff:'Figtree'},ui:{ff:'Figtree'}},
  Before:{disp:{ff:'Instrument Serif',fs:88,fw:400,lh:1,ls:-.015},head:{ff:'Instrument Serif',fs:44,fw:400,lh:1.08,ls:-.01},hero:{ff:'Geist'},body:{ff:'Geist'},card:{ff:'Geist'},ui:{ff:'Geist'},label:{ff:'Geist Mono',fs:13}},
};
const fresh=()=>Object.fromEntries(ROLES.map(r=>[r.k,{...r.d}]));
const preset=name=>{const s=fresh();for(const [k,v] of Object.entries(PRESETS[name]||{}))Object.assign(s[k],v);return s};
const round=(v,st)=>+(Math.round(v/st)*st).toFixed(3);
const fmt=(p,v)=>p==='fs'?v+'px':p==='ls'?v+'em':p==='dk'?v+'%':p==='mw'?(v?v+'ch':'none'):p==='ff'?FONT[v].v:String(v);
const show=(p,v)=>p==='mw'&&!v?'none':p==='ls'?v.toFixed(3)+'em':p==='lh'?v.toFixed(2):v+({fs:'px',dk:'%',mw:'ch'}[p]||'');
const COLORS={disp:'#8A2F1F',head:'#B4462F',hero:'#7A4FB8',body:'#1F6F4A',card:'#0F6D8C',label:'#A8742A',ui:'#C2337A',text:'#6B6B6B'};
const TEXT='h1,h2,h3,p,a,button,small,b,span,li,em,label,footer';
const EL=[['mw','Width','px',[80,1200,1]],['fs','Size','px',[10,90,.5]],['fw','Weight','',[300,800,100]],['lh','Line height','',[.9,2.2,.02]]];
const NUDGE=[['mt','Margin top'],['mb','Margin bottom'],['ml','Margin left'],['pd','Padding']];

const CSS_TXT=`
#tk{position:fixed;left:16px;bottom:16px;z-index:90;font:12px/1.4 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#1F1A15;letter-spacing:0;text-align:left}
#tk *{box-sizing:border-box;font-family:inherit;letter-spacing:0}
#tk .fab{width:44px;height:44px;border-radius:50%;border:0;background:#141820;color:#E9EDF0;font:600 17px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 18px rgba(31,26,21,.25)}
#tk.open .fab{background:#1F6F4A}
#tk.r{left:auto;right:16px}
#tk.r .pn{left:auto;right:0}
#tk.r .fab{float:right}
#tk .pn{position:absolute;left:0;bottom:54px;width:340px;max-height:calc(100vh - 110px);overflow:auto;overscroll-behavior:contain;background:#FFFDF8;border:1px solid #DED4C3;border-radius:12px;box-shadow:0 16px 40px rgba(31,26,21,.22);padding:12px 12px 10px}
#tk:not(.open) .pn{display:none}
#tk .hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
#tk .hd b{font-size:13px}
#tk button{font-size:12px;font-weight:500;line-height:1;cursor:pointer;color:#1F1A15}
#tk .x{border:0;background:none;font-size:18px;width:28px;height:28px}
#tk .row{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
#tk .chip{border:1px solid #DED4C3;background:#fff;border-radius:999px;padding:6px 9px;font-size:11.5px;font-weight:500}
#tk .chip.on{background:#1F1A15;border-color:#1F1A15;color:#fff}
#tk .sub{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:#6A635A;margin:10px 0 5px;font-weight:600}
#tk select{width:100%;padding:6px 8px;border:1px solid #DED4C3;border-radius:6px;background:#fff;font-size:13px;color:#1F1A15}
#tk .dl{display:grid;grid-template-columns:92px 1fr 62px;align-items:center;gap:8px;margin-top:6px}
#tk .dl span{color:#4A443B}
#tk .dl input{width:100%;accent-color:#1F6F4A;margin:0}
#tk .dl output{font:500 11.5px/1 ui-monospace,monospace;text-align:right;color:#1F1A15}
#tk .ft{display:flex;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid #EAE3D5}
#tk .ft button{flex:1;padding:8px 6px;border-radius:6px;border:1px solid #1F1A15;background:#fff;font-weight:600}
#tk .ft .go{background:#1F6F4A;border-color:#1F6F4A;color:#fff}
#tk .ft .on{background:#1F1A15;color:#fff}
#tk .el{margin-top:10px;padding:10px;border-radius:8px;background:#E9EDF0}
#tk .el code{display:block;font:11px/1.35 ui-monospace,monospace;word-break:break-all;color:#4A443B;margin-bottom:4px}
#tk .ng{display:grid;grid-template-columns:92px 1fr;align-items:center;gap:6px;margin-top:6px}
#tk .ng div{display:flex;gap:4px;align-items:center}
#tk .ng button{width:30px;height:26px;border:1px solid #DED4C3;background:#fff;border-radius:5px}
#tk .ng output{font:500 11.5px/1 ui-monospace,monospace;min-width:40px;text-align:center}
#tk .hint{color:#6A635A;font-size:11px;margin-top:6px}
#tk textarea{width:100%;height:150px;margin-top:8px;font:11px/1.4 ui-monospace,monospace;border:1px solid #DED4C3;border-radius:6px;padding:8px;background:#fff;color:#1F1A15;resize:vertical}
#tk .msg{font-size:11px;color:#1F6F4A;min-height:14px;margin-top:4px}
#tkb{position:fixed;inset:0;z-index:85;pointer-events:none}
#tkb .b{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;outline:1px solid var(--c);outline-offset:0;background:transparent}
#tkb .b:hover{background:color-mix(in srgb,var(--c) 8%,transparent)}
#tkb .b i{position:absolute;left:-1px;bottom:100%;font:500 9px/1 ui-monospace,monospace;font-style:normal;background:var(--c);color:#fff;padding:2px 3px;white-space:nowrap;pointer-events:none;opacity:.88}
#tkb .b.sel{outline:2px solid var(--c);background:color-mix(in srgb,var(--c) 10%,transparent)}
#tkb .b.sel i{opacity:1}
#tkb .h{display:none;position:absolute;right:-7px;top:50%;width:12px;height:max(24px,60%);transform:translateY(-50%);border-radius:4px;background:var(--c);cursor:ew-resize;touch-action:none}
#tkb .b.sel .h{display:block}
@media (max-width:760px){#tk{left:10px;bottom:10px}#tk.r{left:auto;right:10px}#tk .pn{width:calc(100vw - 20px);max-height:62vh}}
`;

export function initTune(page,{open}={}){
  if(!page)return ()=>{};
  const ac=new AbortController(),sig={signal:ac.signal};
  const added=[];
  const add=n=>{added.push(n);return n};
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}};
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({r:st.r,e:st.e,open:st.open,role:st.role,side:st.side}))}catch{}};
  const saved=load();
  const st={r:fresh(),e:{},open:!!open||!!saved?.open,role:saved?.role||'body',side:saved?.side||'r',boxes:false,sel:null};
  if(saved?.r)for(const k of Object.keys(st.r))Object.assign(st.r[k],saved.r[k]||{});
  if(saved?.e)st.e=saved.e;

  const style=add(document.createElement('style'));style.textContent=CSS_TXT;document.head.appendChild(style);
  const elStyle=add(document.createElement('style'));document.head.appendChild(elStyle);
  const fontLinks=new Map();
  const loadFont=n=>{const g=FONT[n]?.g;if(!g||fontLinks.has(g))return;const l=document.createElement('link');l.rel='stylesheet';l.href=GF+g+'&display=swap';document.head.appendChild(l);fontLinks.set(g,l)};

  const applyRoles=()=>{
    for(const r of ROLES)for(const [p,v] of Object.entries(st.r[r.k])){page.style.setProperty(`--${r.k}-${p}`,fmt(p,v));if(p==='ff')loadFont(v)}
  };
  const elRule=(s,e)=>{
    const d=[];
    if(e.mw!=null)d.push(`max-width:${e.mw}px`);
    if(e.fs!=null)d.push(`font-size:${e.fs}px`);
    if(e.fw!=null)d.push(`font-weight:${e.fw}`);
    if(e.lh!=null)d.push(`line-height:${e.lh}`);
    if(e.mt)d.push(`margin-top:${e.mt}px`);
    if(e.mb)d.push(`margin-bottom:${e.mb}px`);
    if(e.ml)d.push(`margin-left:${e.ml}px`);
    if(e.pd)d.push(`padding:${e.pd}px`);
    return d.length?`${s}{${d.map(x=>x+' !important').join(';')}}`:'';
  };
  const applyEls=()=>{elStyle.textContent=Object.entries(st.e).map(([s,e])=>elRule(s,e)).filter(Boolean).join('\n')};

  const exportCss=()=>{
    const g=[...new Set(ROLES.map(r=>FONT[st.r[r.k].ff]?.g).filter(Boolean))];
    const out=['/* type tuner export: replace the role block at the top of room.css */'];
    for(const x of g)out.push(`@import url('${GF}${x}&display=swap');`);
    out.push('.rp{');
    for(const k of ORDER){const r=ROLE[k];out.push(`  /* ${r.n} */`);out.push('  '+Object.entries(st.r[k]).map(([p,v])=>`--${k}-${p}:${fmt(p,v)};`).join(''))}
    out.push('}');
    const els=Object.entries(st.e).map(([s,e])=>elRule(s,e).replace(/ !important/g,'')).filter(Boolean);
    if(els.length){out.push('/* per-element tweaks */');out.push(...els)}
    return out.join('\n');
  };

  /* panel */
  const root=add(document.createElement('div'));root.id='tk';
  root.innerHTML=`<button type="button" class="fab" aria-expanded="false" aria-controls="tkpn" title="Type tuner">Aa</button>
<section class="pn" id="tkpn" aria-label="Type tuner">
<div class="hd"><b>Type tuner</b><span><button type="button" class="x" data-a="side" aria-label="Move the panel to the other side" title="Move to the other side">⇆</button><button type="button" class="x" data-a="close" aria-label="Close tuner">×</button></span></div>
<div class="sub">Preset</div><div class="row" data-g="pre">${Object.keys(PRESETS).map(n=>`<button type="button" class="chip" data-pre="${n}">${n}</button>`).join('')}</div>
<div class="sub">Text role</div><div class="row" data-g="role">${ORDER.map(k=>`<button type="button" class="chip" data-role="${k}">${ROLE[k].n}</button>`).join('')}</div>
<div data-g="ctl"></div>
<div class="el" data-g="el" hidden></div>
<div class="ft"><button type="button" data-a="boxes" aria-pressed="false">Boxes</button><button type="button" data-a="reset">Reset</button><button type="button" class="go" data-a="copy">Copy CSS</button></div>
<div class="msg" aria-live="polite"></div>
<textarea readonly hidden aria-label="Exported CSS"></textarea>
</section>`;
  page.appendChild(root);
  const q=s=>root.querySelector(s);
  const fab=q('.fab'),ctl=q('[data-g=ctl]'),elBox=q('[data-g=el]'),msg=q('.msg'),ta=q('textarea'),bxBtn=q('[data-a=boxes]');
  const say=t=>{msg.textContent=t};

  const dial=(id,label,val,[mn,mx,step],shown)=>`<label class="dl"><span>${label}</span><input type="range" data-d="${id}" min="${mn}" max="${mx}" step="${step}" value="${val}"><output>${shown}</output></label>`;
  const renderCtl=()=>{
    const r=ROLE[st.role],v=st.r[r.k];
    root.querySelectorAll('[data-role]').forEach(b=>b.classList.toggle('on',b.dataset.role===r.k));
    ctl.innerHTML=`<label class="dl" style="grid-template-columns:92px 1fr"><span>Font</span><select data-d="ff">${FONTS.map(([g,l])=>`<optgroup label="${g}">${l.map(([n])=>`<option${n===v.ff?' selected':''}>${n}</option>`).join('')}</optgroup>`).join('')}</select></label>`+
      DIALS.map(([p,label,,rg])=>dial(p,label,v[p],rg||r.fs,show(p,v[p]))).join('');
  };
  const update=()=>{applyRoles();save()};
  ctl.addEventListener('input',e=>{
    const t=e.target,p=t.dataset.d;if(!p)return;
    const v=st.r[st.role];
    v[p]=p==='ff'?t.value:+t.value;
    if(t.nextElementSibling)t.nextElementSibling.textContent=show(p,v[p]);
    update();
  },sig);

  /* selected element panel */
  const cur=el=>{const cs=getComputedStyle(el);return{mw:Math.round(el.getBoundingClientRect().width),fs:parseFloat(cs.fontSize),fw:+cs.fontWeight||400,lh:+(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||1.4).toFixed(2)}};
  const renderEl=()=>{
    if(!st.sel){elBox.hidden=true;return}
    const {el,s}=st.sel,e=st.e[s]||{},c=cur(el);
    elBox.hidden=false;
    elBox.innerHTML=`<div class="sub" style="margin-top:0">Selected element</div><code>${s.replace(/</g,'&lt;')}</code>`+
      EL.map(([p,label,u,rg])=>{const v=e[p]??c[p];return dial('e'+p,label,v,rg,p==='lh'?(+v).toFixed(2):v+u)}).join('')+
      NUDGE.map(([p,label])=>`<div class="ng"><span>${label}</span><div><button type="button" data-n="${p}" data-v="-1" aria-label="${label} minus">−</button><output data-o="${p}">${e[p]||0}px</output><button type="button" data-n="${p}" data-v="1" aria-label="${label} plus">+</button></div></div>`).join('')+
      `<p class="hint">Drag the right edge to change width. Arrows nudge margin, Alt+arrows padding, Shift for 8px. Esc leaves box mode.</p>
<div class="row" style="margin:8px 0 0"><button type="button" class="chip" data-a="clear">Clear element</button><button type="button" class="chip" data-a="desel">Deselect</button></div>`;
  };
  const setEl=(p,v)=>{if(!st.sel)return;const s=st.sel.s;st.e[s]={...st.e[s],[p]:v};applyEls();save()};
  const nudge=(p,d)=>{if(!st.sel)return;const e=st.e[st.sel.s]||{};setEl(p,Math.max(p==='pd'?0:-200,(e[p]||0)+d));const o=elBox.querySelector(`[data-o=${p}]`);if(o)o.textContent=(st.e[st.sel.s][p]||0)+'px'};
  elBox.addEventListener('input',e=>{
    const t=e.target,p=t.dataset.d;if(!p)return;
    const k=p.slice(1);setEl(k,+t.value);
    if(t.nextElementSibling)t.nextElementSibling.textContent=k==='lh'?(+t.value).toFixed(2):t.value+(k==='fw'?'':'px');
  },sig);

  /* bounding boxes */
  let layer=null,items=[],raf=0;
  const hasText=el=>[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
  const roleOf=el=>{for(const r of ROLES){const m=el.closest(r.sel);if(m&&page.contains(m))return r.k}return'text'};
  const DYN=/^(on|in|sel|open)$/;
  const selOf=el=>{
    const parts=[];let anchored=false;
    for(let n=el;n&&n!==page;n=n.parentElement){
      if(n.id){parts.unshift('#'+CSS.escape(n.id));anchored=true;break}
      let s=n.tagName.toLowerCase()+[...n.classList].filter(c=>!DYN.test(c)&&!c.includes('__')).slice(0,2).map(c=>'.'+CSS.escape(c)).join('');
      const p=n.parentElement;
      if(p){const same=[...p.children].filter(c=>c.tagName===n.tagName);if(same.length>1)s+=`:nth-of-type(${same.indexOf(n)+1})`}
      parts.unshift(s);
    }
    return '.rp'+(anchored?' ':' > ')+parts.join(' > ');
  };
  const collect=()=>{
    const all=[...page.querySelectorAll(TEXT)].filter(el=>!el.closest('#tk,.stage,.dock,[aria-hidden="true"]')&&hasText(el));
    const set=new Set(all);
    return all.filter(el=>{for(let p=el.parentElement;p&&p!==page;p=p.parentElement)if(set.has(p))return false;return true});
  };
  const build=()=>{
    layer.textContent='';
    items=collect().map(el=>{
      const role=roleOf(el),b=document.createElement('div');
      b.className='b';b.style.setProperty('--c',COLORS[role]);
      b.innerHTML='<i></i><span class="h"></span>';
      layer.appendChild(b);
      return {el,b,role,lab:b.firstChild,last:''};
    });
  };
  const frame=()=>{
    const rs=items.map(it=>it.el.getBoundingClientRect());
    const fs=items.map(it=>it.b.classList.contains('sel')||!it.fs?parseFloat(getComputedStyle(it.el).fontSize):it.fs);
    items.forEach((it,i)=>{
      const r=rs[i];it.fs=fs[i];
      const vis=r.width>0&&r.height>0&&r.bottom>-40&&r.top<innerHeight+40;
      it.b.style.display=vis?'':'none';
      if(!vis)return;
      it.b.style.transform=`translate(${r.left}px,${r.top}px)`;it.b.style.width=r.width+'px';it.b.style.height=r.height+'px';
      const t=`${it.role} ${Math.round(fs[i]*10)/10}px`;if(t!==it.last){it.lab.textContent=t;it.last=t}
    });
    raf=requestAnimationFrame(frame);
  };
  let refresh=0;
  const select=it=>{
    items.forEach(x=>x.b.classList.toggle('sel',x===it));
    st.sel=it?{el:it.el,s:selOf(it.el),it}:null;
    if(it)it.fs=0;
    renderEl();
  };
  const boxesOn=()=>{
    if(st.boxes)return;st.boxes=true;
    layer=add(document.createElement('div'));layer.id='tkb';document.body.appendChild(layer);
    build();raf=requestAnimationFrame(frame);
    refresh=setInterval(()=>{const s=st.sel?.el;build();if(s){const it=items.find(x=>x.el===s);if(it)it.b.classList.add('sel'),st.sel.it=it}},1500);
    bxBtn.classList.add('on');bxBtn.setAttribute('aria-pressed','true');
    layer.addEventListener('pointerdown',e=>{
      const b=e.target.closest('.b');if(!b)return;
      e.preventDefault();e.stopPropagation();
      const it=items.find(x=>x.b===b);if(!it)return;
      if(e.target.classList.contains('h')&&st.sel?.it===it){
        const x0=e.clientX,w0=it.el.getBoundingClientRect().width;
        e.target.setPointerCapture(e.pointerId);
        const mv=ev=>{const w=Math.max(40,Math.round(w0+ev.clientX-x0));setEl('mw',w);const i=elBox.querySelector('[data-d=emw]');if(i){i.value=w;i.nextElementSibling.textContent=w+'px'}};
        const up=()=>{e.target.removeEventListener('pointermove',mv);e.target.removeEventListener('pointerup',up);e.target.removeEventListener('pointercancel',up)};
        e.target.addEventListener('pointermove',mv);e.target.addEventListener('pointerup',up);e.target.addEventListener('pointercancel',up);
        return;
      }
      select(it);
      if(!st.open)setOpen(true);
    });
    layer.addEventListener('click',e=>{e.preventDefault();e.stopPropagation()});
  };
  const boxesOff=()=>{
    if(!st.boxes)return;st.boxes=false;
    cancelAnimationFrame(raf);clearInterval(refresh);
    layer.remove();layer=null;items=[];st.sel=null;renderEl();
    bxBtn.classList.remove('on');bxBtn.setAttribute('aria-pressed','false');
  };

  const setOpen=o=>{st.open=o;root.classList.toggle('open',o);fab.setAttribute('aria-expanded',String(o));save()};
  fab.addEventListener('click',()=>setOpen(!st.open),sig);
  root.addEventListener('click',e=>{
    const t=e.target.closest('button');if(!t||t===fab)return;
    if(t.dataset.role){st.role=t.dataset.role;renderCtl();save();return}
    if(t.dataset.pre){st.r=preset(t.dataset.pre);renderCtl();update();root.querySelectorAll('[data-pre]').forEach(b=>b.classList.toggle('on',b===t));say(`${t.dataset.pre} preset applied.`);return}
    if(t.dataset.n){nudge(t.dataset.n,+t.dataset.v);return}
    const a=t.dataset.a;
    if(a==='close')setOpen(false);
    else if(a==='side'){st.side=st.side==='r'?'l':'r';root.classList.toggle('r',st.side==='r');save()}
    else if(a==='boxes')st.boxes?boxesOff():boxesOn();
    else if(a==='reset'){st.r=fresh();st.e={};applyEls();renderCtl();update();if(st.sel)renderEl();say('Back to the shipped defaults.')}
    else if(a==='clear'&&st.sel){delete st.e[st.sel.s];applyEls();save();renderEl()}
    else if(a==='desel')select(null);
    else if(a==='copy'){
      const css=exportCss();ta.hidden=false;ta.value=css;ta.select();
      const ok=()=>say('Copied. It is also in the box below.'),no=()=>say('Select the text below and copy it.');
      try{navigator.clipboard.writeText(css).then(ok,no)}catch{no()}
    }
  },sig);
  addEventListener('keydown',e=>{
    if(!st.boxes)return;
    if(e.key==='Escape'){boxesOff();return}
    if(!st.sel||!e.key.startsWith('Arrow')||e.target.closest?.('input,select,textarea'))return;
    e.preventDefault();
    const d=e.shiftKey?8:1;
    if(e.altKey)nudge('pd',e.key==='ArrowUp'||e.key==='ArrowRight'?d:-d);
    else if(e.key==='ArrowUp'||e.key==='ArrowDown')nudge('mt',e.key==='ArrowDown'?d:-d);
    else nudge('ml',e.key==='ArrowRight'?d:-d);
  },sig);

  root.classList.toggle('r',st.side==='r');
  renderCtl();applyRoles();applyEls();setOpen(st.open);

  return ()=>{
    ac.abort();cancelAnimationFrame(raf);clearInterval(refresh);
    added.forEach(n=>n.remove());fontLinks.forEach(l=>l.remove());
    for(const r of ROLES)for(const p of Object.keys(r.d))page.style.removeProperty(`--${r.k}-${p}`);
  };
}
