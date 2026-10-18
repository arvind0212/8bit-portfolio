import { createRoom } from './engine';
import { renderIsoIcons } from './iso';

/* wires the page to the room; returns a cleanup that undoes everything it added */
export function initRoomPage(page){
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const $=s=>page.querySelector(s);
const ac=new AbortController(),sig={signal:ac.signal},obs=[],timers=[];let alive=true;
const Room=createRoom();
const ID=Room.ID;
renderIsoIcons(page);
const go=sel=>{const el=$(sel);if(el)el.scrollIntoView({behavior:RM.matches?'auto':'smooth',block:'start'})};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;

/* hotspots: click an object, scroll to its section */
const hot=(id,label,tip,sel,fn)=>({id,label,tip,onClick:()=>fn?fn():go(sel)});
const hotspots=[
  hot(ID.desk,'Desk: back to the top','desk → top','#top'),
  hot(ID.fThesis,'Framed picture: the thesis','frame → thesis','#work'),
  hot(ID.fAmbient,'Framed picture: Ambient Island','frame → ambient island','#work'),
  hot(ID.fHq,'Framed picture: Agent HQ, no write-up yet','frame → the work','#work'),
  hot(ID.fHouse,'Framed picture: household app, no write-up yet','frame → the work','#work'),
  hot(ID.board,'Whiteboard: how I work','whiteboard → how i work','#how'),
  hot(ID.bench,'Workbench: the kit','workbench → the kit','#kit'),
  hot(ID.window,'Window onto Stockholm','stockholm, outside',null,()=>{}),
  hot(ID.term,'Terminal: ask my agent','terminal → ask my agent','#agent'),
  hot(ID.door,'Door: contact','door → contact','#contact'),
  hot(ID.handheld,'Yellow handheld: the work','handheld → the work','#work'),
  hot(ID.mug,'Fika mug','fika. non-negotiable.',null,()=>{}),
  hot(ID.ball,'Football in the corner','corner kicks, mostly missed',null,()=>{}),
  hot(ID.plant,'Plant','watered on sundays',null,()=>{}),
  hot(ID.postcard,'Postcard from Muscat','postcard from muscat',null,()=>{})
];

/* where the camera looks for each station, in room pixels */
const FOCUS={hero:[160,128],desk:[190,140],frames:[262,100],board:[200,80],bench:[176,112],term:[92,124],door:[58,120]};
const LABEL={desk:'the desk',frames:'the framed wall',board:'the whiteboard',bench:'the workbench',term:'the terminal',door:'the door'};
const secs=[['hero','desk'],['work','frames'],['experience','desk'],['how','board'],['kit','bench'],['agent','term'],['contact','door']].map(([id,node])=>({el:page.querySelector('#'+id),id,node,top:0}));
const navOf={hero:'',work:'work',experience:'experience',how:'how',kit:'how',agent:'',contact:'contact'};
const navLinks=[...page.querySelectorAll('.top nav a[data-sec]')];
const slot=$('#slot'),band=$('#band'),stage=$('#stage'),where=$('#where'),whereb=$('#whereb');

const M={top:64,bandH:340,slotTop:0,slotH:400,slotW:700,slotX:0};
function measure(){
  const tb=$('.top').getBoundingClientRect().height;M.top=tb;
  M.bandH=band.getBoundingClientRect().height-(innerWidth<=760?44:48)-tb;
  const r=slot.getBoundingClientRect();M.slotTop=r.top+scrollY;M.slotH=r.height;M.slotW=r.width;M.slotX=r.left+r.width/2;
  for(const s of secs)s.top=s.el.getBoundingClientRect().top+scrollY;
}

/* the reading line sits just under the band */
function readingLine(){return scrollY+M.top+M.bandH+(innerHeight-M.top-M.bandH)*.35}
/* across each section the camera leans into its station and back out, so section edges meet at the full room */
function visit(){
  const y=readingLine(),end=document.documentElement.scrollHeight-innerHeight;
  let i=0;for(let k=0;k<secs.length;k++)if(secs[k].top<=y)i=k;
  if(i===0)return{f:FOCUS.hero,b:0};
  const a=secs[i],nb=secs[i+1];
  const span=nb?nb.top-a.top:Math.max(1,end+M.top+M.bandH+(innerHeight-M.top-M.bandH)*.35-a.top);
  const p=clamp((y-a.top)/span,0,1);
  return{f:FOCUS[a.node],b:Math.sin(Math.PI*p)};
}

let room,chrome='';
function cam(){
  const s=room.scale,RW=room.W*s,RH=room.H*s,vh=innerHeight,vw=innerWidth;
  const zh=Math.min(M.slotH/RH,M.slotW*1.05/RW,1.6);
  const heroCy=M.slotTop+M.slotH/2-(RM.matches?0:scrollY);
  const dockCy=M.top+6+M.bandH/2;
  const end=Math.max(1,M.slotTop+M.slotH/2-dockCy,secs[1].top*.8);
  const e=RM.matches?0:ease(clamp(scrollY/end,0,1));
  const zd=Math.min(M.bandH*.94/RH,(vw-32)/RW);
  const v=RM.matches?{f:FOCUS.hero,b:0}:visit(),w=(vw<760?.25:.6)*v.b*e;
  const f=[lerp(FOCUS.hero[0],v.f[0],w),lerp(FOCUS.hero[1],v.f[1],w)];
  const z=lerp(zh,zd,e)*(1+.22*v.b*e);
  const cy=lerp(heroCy,dockCy,e),cx=vw/2;
  const k=e.toFixed(3);
  if(k!==chrome){chrome=k;band.style.opacity=Math.min(1,e*1.8).toFixed(3);where.style.opacity=clamp((e-.85)/.15,0,1).toFixed(3);
    const clip=Math.max(0,vh-(M.top+M.bandH+8));
    stage.style.clipPath=e>0?'inset('+(M.top*e).toFixed(1)+'px 0 '+(clip*e).toFixed(1)+'px 0)':''}
  return{x:cx-f[0]*s*z,y:cy-f[1]*s*z,z};
}

room=Room.mount({root:$('#room'),hotspots,start:'desk',cam});
if(RM.matches){stage.style.position='absolute';stage.style.height='100vh'}

let cur='';
function current(){const y=readingLine();let a=secs[0];for(const s of secs)if(s.top<=y)a=s;if(scrollY+innerHeight>=document.documentElement.scrollHeight-4)a=secs[secs.length-1];return a}
function show(a){cur=a.id;whereb.textContent=LABEL[a.node];navLinks.forEach(l=>l.classList.toggle('on',l.dataset.sec===navOf[a.id]))}
function tick(){const a=current();if(a.id!==cur){show(a);room.go(a.node)}room.kick()}
measure();{const a=current();room.place(a.node);show(a)}
addEventListener('scroll',tick,{passive:true,signal:ac.signal});
addEventListener('resize',()=>{measure();chrome='';room.camStep(0)},sig);
addEventListener('load',measure,sig);
{const ro=new ResizeObserver(measure);ro.observe(document.body);obs.push(ro)}
document.fonts.ready.then(()=>{if(alive)measure()});

/* Stockholm time beside the station label */
const tm=$('#tm');function clock(){try{tm.textContent='Stockholm '+new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Stockholm',hour:'2-digit',minute:'2-digit'}).format(new Date())}catch(e){}}
clock();timers.push(setInterval(clock,30000));

/* reveal on enter */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
obs.push(io);
page.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* case-study carousel */
const track=$('#track'),cases=[...track.children],dots=$('#dots'),prev=$('#prev'),next=$('#next');
const NAMES=['Thesis','Ambient Island','HL7v2 → FHIR'];
const dotBtns=cases.map((c,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.innerHTML='<i>FIG. 0'+(i+1)+'</i><span>'+NAMES[i]+'</span>';b.setAttribute('aria-label','Case study '+(i+1)+': '+NAMES[i]);b.addEventListener('click',()=>to(i));dots.appendChild(b);return b});
let ci=0;
function to(i){i=clamp(i,0,cases.length-1);track.scrollTo({left:cases[i].offsetLeft-track.offsetLeft,behavior:RM.matches?'auto':'smooth'})}
function syncCar(){const w=cases[1]?cases[1].offsetLeft-cases[0].offsetLeft:1;const i=Math.round(track.scrollLeft/Math.max(1,w));ci=clamp(i,0,cases.length-1);cases.forEach((c,k)=>{c.classList.toggle('on',k===ci);c.setAttribute('aria-hidden',String(k!==ci));c.inert=k!==ci});dotBtns.forEach((b,k)=>b.setAttribute('aria-current',String(k===ci)));prev.disabled=ci===0;next.disabled=ci===cases.length-1}
track.addEventListener('scroll',()=>requestAnimationFrame(syncCar),{passive:true,signal:ac.signal});
prev.addEventListener('click',()=>to(ci-1),sig);next.addEventListener('click',()=>to(ci+1),sig);
const carEl=$('#car');let carVisible=false;{const co=new IntersectionObserver(es=>{carVisible=es[0].isIntersecting},{threshold:.4});co.observe(carEl);obs.push(co)}
addEventListener('keydown',e=>{if(!carVisible||e.altKey||e.metaKey||e.ctrlKey)return;const t=e.target;if(t&&/INPUT|TEXTAREA/.test(t.tagName))return;if(e.key==='ArrowRight'){to(ci+1);e.preventDefault()}else if(e.key==='ArrowLeft'){to(ci-1);e.preventDefault()}},sig);
syncCar();

/* type pairing: saved per viewer; storage may be missing or throw */
const FONTS=['instrument','inter','fraunces'];
const fontBtns=[...page.querySelectorAll('.fonts [data-font]')];
function setFont(v,save){if(!FONTS.includes(v))v='instrument';if(v==='instrument')delete page.dataset.font;else page.dataset.font=v;fontBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.font===v)));if(save)try{localStorage.setItem('font',v)}catch(e){}setTimeout(measure,50)}
let savedFont=null;try{savedFont=localStorage.getItem('font')}catch(e){}
setFont(savedFont,false);
fontBtns.forEach(b=>b.addEventListener('click',()=>setFont(b.dataset.font,true),sig));

/* the kit on the workbench */
const TOOLS=[
 ['i-note','Sticky notes','intent','Interviews me in rounds of three questions and writes the outcome brief.','So the agent builds what I need, not what I first said.'],
 ['i-clip','Clipboard','brief + tiers','Holds the goal, the trade-offs and the checks that count as done. Tiers decide how much process a change gets.','So "done" is something I defined and an agent can test.'],
 ['i-lens','Magnifying glass','critique','Sends the diff and the brief to a reviewer from another model family, with no build chat.','The author is never the critic.'],
 ['i-watch','Stopwatch','prove','Runs the change against the real running thing and records the evidence.','A green build is not proof.'],
 ['i-loop','Looping arrow','iterate','Repeats until a check passes, or until a score stops improving, with hard caps on rounds.','So "keep going" has a stop rule and a record.'],
 ['i-coins','Three coins','model roles','One model builds, another reviews, a third judges; cheap ones do the legwork.','The judge is never the builder.'],
 ['i-cabinet','Filing cabinet','memory','Plain markdown in git, one fact per line with a source and date. A secret scan runs before every commit.','Agents look facts up instead of asking me twice.'],
 ['i-wrench','Wrench','improve','Turns a repeated correction into a rule, a test or a skill edit.','So a mistake gets fixed once, in the system.'],
 ['i-lock','Padlock','approval gate','Nothing is sent, posted, bought or deleted without me approving the exact content.','So agents can work unattended and never act for me.']
];
const tools=$('#tools'),note=$('#benchnote');let pressed=null;
TOOLS.forEach(([ic,name,kit,what,why])=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed','false');b.setAttribute('aria-controls','benchnote');b.title=name+' on the workbench';b.innerHTML='<svg class="ic"><use href="#'+ic+'"/></svg>'+kit;
  b.addEventListener('click',()=>{if(pressed)pressed.setAttribute('aria-pressed','false');if(pressed===b){pressed=null;note.hidden=true;return}pressed=b;b.setAttribute('aria-pressed','true');note.innerHTML='<b>'+name+' · <code>'+kit+'</code></b>'+what+' <span>'+why+'</span>';note.hidden=false});
  li.appendChild(b);tools.appendChild(li)});

/* ask my agent: curated and scripted; the first answer is shown on load */
const QA=[
 ['What could you do for us?','Take a problem from the first scoping call to a working system. I scoped healthcare data deals at Quantiphi, then built a 99.4% prescription pipeline at Karolinska Institutet and agent tools at Arkus AI. I set the intent and the checks; agents execute.','positioning notes'],
 ['How do you check AI output?','I check it rather than trust it. Before building, I write the checks into a brief. After building, the change runs against the real thing, and a model from a different family reviews the diff without seeing how it was made.','how I work notes · draft'],
 ['What did your thesis find?','On a synthetic benchmark (52 patients, five layers of noise), the best agent reached about 100% accepted accuracy on labs and about 91% on medications. The tool-heavy agents failed more often. More agentic was not automatically better.','thesis summary page'],
 ['What can\'t you claim?','The thesis used synthetic data, not a deployment. Arkus work is described at a public level only. Quantiphi program numbers are team results; my part was design and delivery, not the code.','evidence boundaries']
];
const tlog=$('#tlog'),qs=$('#qs');let busy=false;
function ask(i,btn,instant){if(busy)return;busy=true;const[q,a,src]=QA[i];
  const pq=document.createElement('div');pq.className='q';pq.textContent=q;tlog.appendChild(pq);
  const pa=document.createElement('div');pa.className='a';tlog.appendChild(pa);
  const fin=()=>{pa.textContent=a;const s=document.createElement('span');s.className='src';s.textContent='source: '+src;pa.appendChild(s);tlog.scrollTop=instant?0:1e6;busy=false;btn.disabled=true};
  if(instant||RM.matches){fin();return}
  const t0=performance.now();const step=n=>{if(!alive)return;const k=Math.min(a.length,Math.floor((n-t0)/9));pa.textContent=a.slice(0,k);tlog.scrollTop=1e6;if(k<a.length)requestAnimationFrame(step);else fin()};requestAnimationFrame(step)}
const qBtns=QA.map((qa,i)=>{const b=document.createElement('button');b.type='button';b.textContent=qa[0];b.addEventListener('click',()=>ask(i,b));qs.appendChild(b);return b});
ask(0,qBtns[0],true);
return ()=>{alive=false;ac.abort();obs.forEach(o=>o.disconnect());timers.forEach(clearInterval);room.destroy();
  for(const el of [dots,tools,tlog,qs])el.replaceChildren();note.hidden=true;
  stage.style.clipPath='';stage.style.position='';stage.style.height='';band.style.opacity='';where.style.opacity=''};
}
