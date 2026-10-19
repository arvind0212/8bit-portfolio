import { createRoom } from './engine';
import { initJourney } from './journey';

/* wires the page to the room; returns a cleanup that undoes everything it added */
export function initRoomPage(page){
const RM=matchMedia('(prefers-reduced-motion: reduce)');
const $=s=>page.querySelector(s);
const ac=new AbortController(),sig={signal:ac.signal},obs=[];
const Room=createRoom();
const ID=Room.ID;
const go=sel=>{const el=$(sel);if(el)el.scrollIntoView({behavior:RM.matches?'auto':'smooth',block:'start'})};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;
const lerpR=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),w:lerp(a.w,b.w,t),h:lerp(a.h,b.h,t)});

/* hotspots: click an object, scroll to its section */
const hot=(id,label,tip,sel,fn)=>({id,label,tip,onClick:()=>fn?fn():go(sel)});
const hotspots=[
  hot(ID.desk,'Desk: back to the top','desk → top','#top'),
  hot(ID.fThesis,'Framed picture: the thesis','frame → the work','#work'),
  hot(ID.fAmbient,'Framed picture: Ambient Island','frame → the work','#work'),
  hot(ID.fHq,'Framed picture: the work','frame → the work','#work'),
  hot(ID.fHouse,'Framed picture: the work','frame → the work','#work'),
  hot(ID.board,'Whiteboard: the journey','whiteboard → the journey','#journey'),
  hot(ID.bench,'Workbench: the work','workbench → the work','#work'),
  hot(ID.window,'Window onto Stockholm','stockholm, outside',null,()=>{}),
  hot(ID.term,'Terminal: writing','terminal → writing','#writing'),
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
const secs=[['hero','desk'],['work','frames'],['journey','board'],['writing','term'],['contact','door']].map(([id,node])=>({el:page.querySelector('#'+id),id,node}));
const navLinks=[...page.querySelectorAll('.top nav a[data-sec]')];
const slot=$('#slot'),cslot=$('#cslot'),stage=$('#stage'),dock=$('#dock'),dockl=$('#dockl'),col=$('.col');

const rect=el=>{const r=el.getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height}};
let room,chrome='',focus=FOCUS.hero,cur=null;
/* the dock sits in the right margin when there is room for it; otherwise the room only shows inline */
function dockBox(vw,vh){
  if(RM.matches||vw<=760)return null;
  const c=col.getBoundingClientRect(),m=vw-c.right;
  const w=Math.min(240,m-32);if(w<168)return null;
  const h=Math.round(w*.75);
  return{x:c.right+(m-w)/2,y:vh-h-40,w,h};
}
function cam(){
  const s=room.scale,RW=room.W*s,RH=room.H*s,vw=innerWidth,vh=innerHeight;
  const H=rect(slot),C=rect(cslot),D=dockBox(vw,vh);
  const e=ease(clamp(-(H.y-64)/(H.h*.8),0,1));
  const c=ease(clamp((vh-C.y)/(vh*.55),0,1));
  let box,d;
  if(D){box=lerpR(lerpR(H,D,e),C,c);d=e*(1-c)}
  else{box=c>0||C.y<vh?C:H;d=0;if(C.y>=vh&&H.y+H.h<=0)box=null}
  const k=box?[box.x,box.y,box.w,box.h,d].map(v=>v.toFixed(1)).join():'none';
  if(k!==chrome){chrome=k;
    if(!box){stage.style.visibility='hidden'}
    else{stage.style.visibility='';const r=(d*12).toFixed(1);
      stage.style.clipPath='inset('+box.y.toFixed(1)+'px '+(vw-box.x-box.w).toFixed(1)+'px '+(vh-box.y-box.h).toFixed(1)+'px '+box.x.toFixed(1)+'px round '+r+'px)'}
    const o=D?clamp((d-.55)/.45,0,1):0;
    dock.style.opacity=o.toFixed(3);
    if(D){dock.style.transform='translate3d('+D.x+'px,'+D.y+'px,0)';dock.style.width=D.w+'px';dock.style.height=D.h+'px'}
  }
  if(!box)return{x:-9999,y:0,z:.01};
  const fit=Math.min(box.w/RW,box.h/RH);
  const z=fit*(1+1.2*d);
  const f=[lerp(FOCUS.hero[0],focus[0],d),lerp(FOCUS.hero[1],focus[1],d)];
  const fx=lerp(room.W/2,f[0],d),fy=lerp(room.H/2,f[1],d);
  return{x:box.x+box.w/2-fx*s*z,y:box.y+box.h/2-fy*s*z,z};
}

room=Room.mount({root:$('#room'),hotspots,start:'desk',cam});

function current(){const y=innerHeight*.42;let a=secs[0];for(const s of secs)if(s.el.getBoundingClientRect().top<=y)a=s;if(scrollY+innerHeight>=document.documentElement.scrollHeight-4)a=secs[secs.length-1];return a}
function show(a){cur=a;focus=FOCUS[a.node];dockl.textContent='at '+LABEL[a.node];navLinks.forEach(l=>l.classList.toggle('on',l.dataset.sec===a.id))}
function tick(){const a=current();if(a!==cur){show(a);room.go(a.node)}room.kick()}
{const a=current();room.place(a.node);show(a)}
addEventListener('scroll',tick,sig);
addEventListener('resize',()=>{chrome='';room.camStep(0);tick()},sig);
{const ro=new ResizeObserver(()=>{chrome='';room.kick()});ro.observe(document.body);obs.push(ro)}

/* the work row: arrows scroll by one card and switch off at the ends */
const cards=$('#cards'),prev=$('#prev'),next=$('#next');
if(cards&&prev&&next){
const step=()=>{const c=cards.querySelector('.card');return c?c.getBoundingClientRect().width+20:300};
const ends=()=>{prev.disabled=cards.scrollLeft<4;next.disabled=cards.scrollLeft+cards.clientWidth>=cards.scrollWidth-4};
prev.addEventListener('click',()=>cards.scrollBy({left:-step(),behavior:RM.matches?'auto':'smooth'}),sig);
next.addEventListener('click',()=>cards.scrollBy({left:step(),behavior:RM.matches?'auto':'smooth'}),sig);
cards.addEventListener('scroll',ends,{passive:true,signal:ac.signal});
{const ro=new ResizeObserver(ends);ro.observe(cards);obs.push(ro)}
ends();
}

const endJourney=initJourney($('#jroot'));
return ()=>{ac.abort();obs.forEach(o=>o.disconnect());endJourney();room.destroy();
  stage.style.clipPath='';stage.style.visibility='';dock.style.opacity='';dock.style.transform=''};
}
