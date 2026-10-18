/* hairline isometric icons at the room's angle; one glowing path per icon, with a light pulse that travels along it */
const C=Math.cos(Math.PI/6),P=(x,y,z)=>[(x-y)*C,(x+y)*.5-z];
function icon(parts){
  const shapes=[],glows=[],pts=[];
  const poly=(q,cls)=>{const p=q.map(a=>P(...a));pts.push(...p);shapes.push('<polygon class="'+cls+'" points="'+p.map(v=>v[0].toFixed(2)+','+v[1].toFixed(2)).join(' ')+'"/>')};
  const box=(x,y,z,w,d,h)=>{
    poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],'fl');
    poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],'fr');
    poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],'ft');
  };
  const glow=q=>{const p=q.map(a=>P(...a));pts.push(...p);glows.push('M'+p.map(v=>v[0].toFixed(2)+' '+v[1].toFixed(2)).join('L'))};
  parts(box,glow);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const[a,b]of pts){x0=Math.min(x0,a);y0=Math.min(y0,b);x1=Math.max(x1,a);y1=Math.max(y1,b)}
  const pad=1.5,w=x1-x0+pad*2,h=y1-y0+pad*2,s=Math.max(w,h);
  const vb=[(x0+x1)/2-s/2,(y0+y1)/2-s/2,s,s].map(v=>v.toFixed(2)).join(' ');
  const g=glows.join(' ');
  return '<svg class="iso" viewBox="'+vb+'" aria-hidden="true">'+shapes.join('')+'<path class="gl" pathLength="1000" d="'+g+'"/><path class="pu" pathLength="1000" d="'+g+'"/></svg>';
}
const K={
  stack:(b,g)=>{b(0,0,0,14,10,2);b(1,1,2,13,9,2);b(2,2,4,12,8,2);g([[4,4,6],[12,4,6],[12,8,6]])},
  board:(b,g)=>{b(0,0,0,16,4,1.5);b(1,1,1.5,14,1,13);g([[3,2,6],[6,2,10],[9,2,7],[13,2,12]])},
  book:(b,g)=>{b(0,1,0,14,10,3);b(1,0,3,12,10,3);g([[9,10,6],[9,10,1],[10,11,-1]])},
  cross:(b,g)=>{b(0,0,0,14,14,5);g([[7,3,5],[7,11,5]]);g([[3,7,5],[11,7,5]])},
  graph:(b,g)=>{b(0,0,0,16,16,1.5);b(2,2,1.5,3,3,3);b(11,3,1.5,3,3,5);b(6,11,1.5,3,3,4);g([[3.5,3.5,4.5],[12.5,4.5,6.5],[7.5,12.5,5.5],[3.5,3.5,4.5]])},
  term:(b,g)=>{b(0,0,0,14,10,1.5);b(1,8,1.5,12,1,9);g([[3,9,8],[5,9,6.5],[3,9,5]]);g([[7,9,5],[10,9,5]])},
  bars:(b,g)=>{b(0,0,0,16,8,1.5);b(2,2,1.5,3,3,6);b(7,2,1.5,3,3,11);b(12,2,1.5,3,3,9);g([[2,2,7.5],[7,2,12.5],[12,2,10.5]])},
  screen:(b,g)=>{b(0,0,0,16,6,1);b(1,4,1,14,1,11);g([[4,5,4],[11,5,4]])},
  pipe:(b,g)=>{b(0,0,0,6,6,6);b(12,12,0,6,6,6);g([[6,3,3],[9,3,3],[9,15,3],[12,15,3]])},
  flag:(b,g)=>{b(0,0,0,12,12,1.5);b(5,5,1.5,1,1,13);g([[6,6,14.5],[6,12,13],[6,6,11.5]])},
  blocks:(b,g)=>{b(0,0,0,6,6,6);b(7,0,0,6,6,6);b(3,3,6,6,6,6);g([[3,3,12],[9,3,12],[9,9,12]])},
  check:(b,g)=>{b(0,0,0,14,14,5);g([[3,6,5],[6,10,5],[12,3,5]])},
  lock:(b,g)=>{b(0,0,0,12,6,9);g([[3,3,9],[3,3,13],[9,3,13],[9,3,9]])}
};
export function renderIsoIcons(scope){scope.querySelectorAll('[data-iso]').forEach(el=>{const k=K[el.dataset.iso];if(k)el.innerHTML=icon(k)})}
