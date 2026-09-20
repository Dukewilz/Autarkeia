import { makeCosmicTexture } from './cosmic-texture.js?v=aura-2';
// Procedural texture is baked once; animated frames only composite it and trace ribbons.
let texture,gasTexture;
const referenceVideo=document.querySelector('#black-hole-video');
function syncVideo(){
  if(!referenceVideo)return;
  const stopped=document.hidden||reducedMotion.matches||document.body.classList.contains('motion-paused')||document.querySelector('#camera')?.srcObject;
  if(stopped)referenceVideo.pause();else referenceVideo.play().catch(()=>{});
}
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
document.addEventListener('visibilitychange',syncVideo);reducedMotion.addEventListener('change',syncVideo);
new MutationObserver(syncVideo).observe(document.body,{attributes:true,attributeFilter:['class']});
document.querySelector('#camera')?.addEventListener('playing',syncVideo);
document.querySelector('#camera')?.addEventListener('emptied',syncVideo);
syncVideo();
let pointerX=0,pointerY=0,px=0,py=0,hover=false,hoverAlpha=0;
const field=Array.from({length:170},(_,i)=>({u:((i*73.71)%100)/100,v:((i*39.13)%100)/100,x:0,y:0}));
addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2;hover=e.pointerType!=='touch'&&!e.target.closest('header,button,a,input,select,.lab,.topic-panel,dialog');},{passive:true});
document.addEventListener('pointerleave',()=>{pointerX=pointerY=0;hover=false;});
export function drawCosmos(ctx,w,h,ms){
  if(!referenceVideo){texture ||= makeCosmicTexture();gasTexture ||= makeCosmicTexture(true);}
  const moving=!reducedMotion.matches&&!document.body.classList.contains('motion-paused');
  if(moving){px+=(pointerX-px)*.06;py+=(pointerY-py)*.06;}
  const t=ms*.00008;
  ctx.clearRect(0,0,w,h);
  for(let i=0;i<field.length;i++){
    const p=field[i],baseX=p.u*w,baseY=p.v*h;
    const dx=baseX-(pointerX+1)*w/2,dy=baseY-(pointerY+1)*h/2,distance=Math.hypot(dx,dy);
    const influence=hover&&moving?Math.pow(Math.max(0,1-distance/170),2):0;
    const force=influence*95;
    p.x+=(dx/Math.max(1,distance)*force-p.x)*.13;
    p.y+=(dy/Math.max(1,distance)*force-p.y)*.13;
    const x=baseX+p.x-px*2,y=baseY+p.y-py*2;
    ctx.fillStyle=`rgba(192,207,227,${.12+(i%4)*.025+influence*.35})`;
    ctx.beginPath();ctx.arc(x,y,.55+(i%3)*.2+influence*.4,0,Math.PI*2);ctx.fill();
  }
  if(referenceVideo)return;
  const size=Math.min(w<650?w*1.3:w*.75,h*1.1),x=w*(w<650?.8:.77)+px*12,y=h*.46+py*9;
  ctx.save();ctx.translate(x,y);
  for(let trail=2;trail>=0;trail--){ctx.save();ctx.rotate(t*.13-trail*.035);ctx.globalAlpha=.38-trail*.09;ctx.drawImage(gasTexture,-size*.6,-size*.6,size*1.2,size*1.2);ctx.restore();}
  ctx.save();ctx.rotate(-t*.055+.6);ctx.globalAlpha=.28;ctx.drawImage(gasTexture,-size*.67,-size*.67,size*1.34,size*1.34);ctx.restore();
  ctx.rotate(-.07+Math.sin(t*.4)*.008);ctx.globalAlpha=.88;
  ctx.drawImage(texture,-size/2,-size/2,size,size);ctx.restore();
}
export function drawRibbons(ctx,w,h,ms){
  const t=ms*.00008;ctx.clearRect(0,0,w,h);
  ctx.save();ctx.globalCompositeOperation='screen';
  // Soft aurora curtains beneath irregular XMB ribbons.
  for(let band=0;band<2;band++){
    const base=h*(.3+band*.43);
    for(let i=0;i<64;i++){
      const x=i/64*w,y=base+Math.sin(i*.0875+t+band)*55+Math.sin(i*.194-t*.6)*16;
      const g=ctx.createLinearGradient(0,y-65,0,y+160);
      g.addColorStop(0,'rgba(124,190,188,0)');g.addColorStop(.4,band?'rgba(151,132,205,.065)':'rgba(124,190,188,.075)');g.addColorStop(1,'rgba(124,190,188,0)');
      ctx.fillStyle=g;ctx.fillRect(x,y-65,w/64+1,225);
    }
  }
  // Sparse, broken wisps. Each has a different path and fades during its ascent.
  for(let i=0;i<19;i++){
    const life=(i*.137+t*.045)%1,base=(1-life)*h;
    const fade=Math.sin(Math.PI*life)*Math.pow(1-life,.85);
    const start=((i*37)%83)/100*w-w*.2,span=w*(.38+(i%5)*.055);
    const gradient=ctx.createLinearGradient(start,base,start+span,base-h*.1);
    gradient.addColorStop(0,'rgba(159,176,205,0)');
    gradient.addColorStop(.45,`rgba(179,198,221,${fade*.26})`);
    gradient.addColorStop(1,'rgba(179,188,209,0)');
    ctx.beginPath();
    for(let step=0;step<=22;step++){
      const u=step/22,x=start+u*span;
      const y=base+Math.sin(u*4.5+t+i*1.71)*h*.034+Math.sin(u*8-t*.4+i)*h*.008-u*h*.075;
      step?ctx.lineTo(x,y):ctx.moveTo(x,y);
    }
    ctx.strokeStyle=gradient;ctx.lineWidth=.8+(i%3)*.6;ctx.stroke();
  }
  hoverAlpha+=((hover?1:0)-hoverAlpha)*.18;
  if(hoverAlpha>.005&&!reducedMotion.matches){
    const x=(pointerX+1)*w/2,y=(pointerY+1)*h/2;
    const glow=ctx.createRadialGradient(x,y,0,x,y,110);
    glow.addColorStop(0,`rgba(197,220,239,${hoverAlpha*.07})`);glow.addColorStop(.25,`rgba(137,143,215,${hoverAlpha*.035})`);glow.addColorStop(1,'rgba(137,143,215,0)');
    ctx.fillStyle=glow;ctx.fillRect(x-110,y-110,220,220);
  }
  ctx.restore();
}
