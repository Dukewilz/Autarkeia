// Scroll distance, not a timer, controls the layered chapters and particle morph.
export function setupJourney(journey, chapters, still, native=false) {
  const canvas=document.createElement('canvas');
  canvas.className='journey-particles';canvas.setAttribute('aria-hidden','true');
  journey.before(canvas);
  const ctx=canvas.getContext('2d');
  let starts=[],heights=[],w=0,h=0,raf=0;
  let scrollTarget=0,scrollFrame=0,lastWritten=0,lastTime=0;
  let pointer={x:-1000,y:-1000,active:false}, light=0;
  const clamp=x=>Math.max(0,Math.min(1,x));
  function smoothScroll(now){
    scrollFrame=0;
    if(still()||!journey.classList.contains('journey-active')||Math.abs(journey.scrollTop-lastWritten)>2)return;
    const dt=Math.min(40,now-lastTime||16);lastTime=now;
    const distance=scrollTarget-journey.scrollTop;
    journey.scrollTop=Math.abs(distance)<.8?scrollTarget:journey.scrollTop+distance*(1-Math.exp(-dt/105));
    lastWritten=journey.scrollTop;
    if(Math.abs(scrollTarget-lastWritten)>.8)scrollFrame=requestAnimationFrame(smoothScroll);
  }
  function cancelScroll(){cancelAnimationFrame(scrollFrame);scrollFrame=0;}
  // Smooth mouse-wheel impulses only; touch, keyboard and scrollbar remain native.
  journey.addEventListener('wheel',e=>{
    if(native)return;
    if(still()||e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.target.closest('input,textarea,select,video,pre,[contenteditable]'))return;
    const max=journey.scrollHeight-h;
    if((e.deltaY<0&&journey.scrollTop<=0)||(e.deltaY>0&&journey.scrollTop>=max-1))return;
    e.preventDefault();e.stopPropagation();
    if(!scrollFrame){scrollTarget=journey.scrollTop;lastWritten=journey.scrollTop;lastTime=performance.now();}
    scrollTarget=Math.max(0,Math.min(max,scrollTarget+e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?h:1)));
    if(!scrollFrame)scrollFrame=requestAnimationFrame(smoothScroll);
  },{passive:false});
  ['pointerdown','touchstart','keydown'].forEach(type=>journey.addEventListener(type,cancelScroll,{passive:true}));
  function requestDraw(){if(!raf)raf=requestAnimationFrame(update);}
  journey.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=canvas.getBoundingClientRect();pointer={x:e.clientX-r.left,y:e.clientY-r.top,active:true};requestDraw();},{passive:true});
  journey.addEventListener('pointerleave',()=>{pointer.active=false;requestDraw();});
  function measure(){
    w=journey.clientWidth;h=native?innerHeight:journey.clientHeight;
    journey.style.setProperty('--journey-half-height',`${h/2}px`);
    let offset=0;starts=chapters.map((s,i)=>{heights[i]=s.offsetHeight;const start=offset;offset+=heights[i];s.style.setProperty('--pin-top',`${Math.min(0,h-heights[i])}px`);s.style.setProperty('--chapter-layer',i+1);return start;});
    const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx?.setTransform(d,0,0,d,0,0);update();
  }
  function point(i,state){
    const col=i%32,row=Math.floor(i/32),a=i*2.399963;
    if(state===0)return [w*(.04+col/34),h*(.06+row/20)];
    if(state===1){const r=Math.sqrt(i/512)*Math.min(w,h)*.48;return [w*.68+Math.cos(a)*r,h*.48+Math.sin(a)*r*.85];}
    return [w*(.03+col/33),h*(.2+row/25)+Math.sin(col*.24+row*.18)*h*.12];
  }
  function update(){
    raf=0;const rect=journey.getBoundingClientRect();
    const y=native?-rect.top:journey.scrollTop;let state=0,p=0;
    if(native){canvas.style.clipPath=`inset(${Math.max(0,rect.top)}px 0 ${Math.max(0,h-rect.bottom)}px 0)`;}
    for(let i=1;i<chapters.length;i++){const t=clamp((y-starts[i]+h)/h);if(t>0){state=i-1;p=t;}}
    chapters.forEach((s,i)=>{const cover=i<2?clamp((y-starts[i+1]+h)/h):0;s.style.setProperty('--cover',still()?0:cover*cover*(3-2*cover));});
    if(!ctx)return;ctx.clearRect(0,0,w,h);
    const target=pointer.active?1:0;light=still()?target:light+(target-light)*.18;
    if(Math.abs(target-light)<.005)light=target;
    p=still()?Math.round(p):p*p*(3-2*p);
    for(let i=0;i<512;i++){
      const a=point(i,state),b=point(i,state+1),x=a[0]+(b[0]-a[0])*p,y=a[1]+(b[1]-a[1])*p;
      const glow=Math.pow(clamp(1-Math.hypot(x-pointer.x,y-pointer.y)/125),2)*light;
      const radius=(i%7===0?2.35:1.65)+glow*1.1;
      if(glow>.02){const halo=ctx.createRadialGradient(x,y,0,x,y,13);halo.addColorStop(0,`rgba(255,224,177,${glow*.5})`);halo.addColorStop(1,'rgba(255,224,177,0)');ctx.fillStyle=halo;ctx.fillRect(x-13,y-13,26,26);}
      ctx.fillStyle=`rgba(${Math.round(211+glow*44)},${Math.round(193+glow*47)},${Math.round(166+glow*42)},${.17+(i%5)*.025+glow*.7})`;ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
    }
    // Particles are background decoration: never draw glow over opaque cards.
    const bounds=canvas.getBoundingClientRect();
    chapters.forEach((section,index)=>{
      const next=chapters[index+1]?.getBoundingClientRect();
      const bottom=next?Math.min(h,next.top-bounds.top):h;
      ctx.save();ctx.beginPath();ctx.rect(0,0,w,Math.max(0,bottom));ctx.clip();
      section.querySelectorAll('.tm-preview,.waste-panel,.waste-chat,.waste-questions').forEach(card=>{
        const r=card.getBoundingClientRect();
        ctx.clearRect(r.left-bounds.left-1,r.top-bounds.top-1,r.width+2,r.height+2);
      });ctx.restore();
    });
    if(light!==target)requestDraw();
  }
  journey.addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(update);},{passive:true});
  if(native)addEventListener('scroll',requestDraw,{passive:true});
  const resize=new ResizeObserver(measure);chapters.forEach(s=>resize.observe(s));resize.observe(journey);
  measure();return {start:s=>starts[chapters.indexOf(s)]||0};
}
