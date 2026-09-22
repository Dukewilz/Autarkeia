// QML-inspired cinematic transitions: fade, centered wipe, radial mask, and diagonal sweep.
// Each section is a scene. Content longer than the viewport scrolls within its scene.
import {setupJourney} from './journey-motion.js?v=3';
const scenes = [...document.querySelectorAll('main > section')];
const chapters=scenes.filter(s=>s.classList.contains('waste-section'));
const journey=document.createElement('div');
journey.className='waste-journey';
chapters[0].before(journey);
chapters.forEach(s=>journey.append(s));
const surface=s=>chapters.includes(s)?journey:s;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => reduced.matches || document.body.classList.contains('motion-paused');
const journeyMotion=setupJourney(journey,chapters,still);
let current = Math.max(0, scenes.findIndex(s => '#' + s.id === location.hash));
let busy = false, lastWheel = 0, sum = 0, animations = [], wheelLocked = false;

// Scene dot navigation
const navigation = document.createElement('nav');
navigation.className = 'scene-navigation'; navigation.setAttribute('aria-label','Page sections');
const sceneNames = {home:'Home',prologue:'About',learn:'Learn',experiment:'Experiment',manifesto:'Closing'};
const names = scenes.map(scene => scene.dataset.sceneName || sceneNames[scene.id] || scene.id);
let pillTimer, bottomHover=false, parallaxFrame=0, parallaxX=0, parallaxY=0, transitionCount=0;
let transitionOriginX=50, transitionOriginY=50;
function setParallax(x,y){
  parallaxX=x;parallaxY=y;
  if(parallaxFrame||still())return;
  parallaxFrame=requestAnimationFrame(()=>{
    document.documentElement.style.setProperty('--parallax-x',`${parallaxX.toFixed(2)}px`);
    document.documentElement.style.setProperty('--parallax-y',`${parallaxY.toFixed(2)}px`);
    parallaxFrame=0;
  });
}
function showPill(){
  navigation.classList.add('is-visible');clearTimeout(pillTimer);
  pillTimer=setTimeout(()=>{if(!bottomHover&&!navigation.matches(':hover,:focus-within'))navigation.classList.remove('is-visible');},1200);
}
addEventListener('pointermove',e=>{
  const wasBottom=bottomHover;
  bottomHover=e.clientY>=innerHeight-10;
  if(bottomHover||wasBottom)showPill();
  transitionOriginX=15+(e.clientX/innerWidth)*70;
  transitionOriginY=15+(e.clientY/innerHeight)*70;
  setParallax((e.clientX/innerWidth-.5)*12,(e.clientY/innerHeight-.5)*9);
},{passive:true});
document.addEventListener('pointerleave',()=>{bottomHover=false;setParallax(0,0);showPill();});
navigation.addEventListener('pointerenter',()=>{clearTimeout(pillTimer);});
navigation.addEventListener('pointerleave',()=>{bottomHover=false;showPill();});
navigation.addEventListener('focusin',showPill);
navigation.addEventListener('focusout',showPill);
addEventListener('wheel',showPill,{passive:true});
addEventListener('touchmove',showPill,{passive:true});
scenes.forEach((scene, i) => {
  scene.classList.add('scene'); scene.tabIndex = -1;
  const button = document.createElement('button');
  button.setAttribute('aria-label', names[i]); button.title = names[i];
  button.addEventListener('click', () => go(i)); navigation.append(button);
  // Hide navbar when content inside scene is scrolled
  let timer;
  scene.addEventListener('scroll', () => {
    showPill();
    document.querySelector('#navbar').classList.add('hidden');
    clearTimeout(timer); timer = setTimeout(() => document.querySelector('#navbar').classList.remove('hidden'), 650);
  }, {passive: true});
});
document.body.append(navigation); document.body.classList.add('scene-mode');

function sync() {
  journey.classList.toggle('journey-active',chapters.includes(scenes[current]));
  journey.inert=!chapters.includes(scenes[current]);
  scenes.forEach((scene, i) => {
    scene.classList.toggle('scene-active', i === current);
    const accessible=i===current||(chapters.includes(scene)&&chapters.includes(scenes[current]));
    scene.inert = !accessible;
    scene.setAttribute('aria-hidden', String(!accessible));
  });
  document.dispatchEvent(new CustomEvent('autarkeia:scene', {detail: {id: scenes[current].id}}));
  [...navigation.children].forEach((button, i) => button.setAttribute('aria-current', i === current ? 'step' : 'false'));
}

async function go(index, updateHash = true) {
  if (index < 0 || index >= scenes.length || index === current || busy || document.body.classList.contains('intro-active')) return;
  busy = true; wheelLocked = true;
  showPill();
  const direction = index > current ? 1 : -1;
  const previous = surface(scenes[current]);
  const next = surface(scenes[index]);
  if(previous===journey&&next===journey){
    current=index; sync();
    journey.scrollTo({top:journeyMotion.start(scenes[index]),behavior:still()?'instant':'smooth'});
    if(updateHash)history.pushState(null,'','#'+scenes[index].id);
    busy=false;wheelLocked=false;return;
  }
  current = index;
  next.scrollTop = next===journey?journeyMotion.start(scenes[index]):0;
  sync();
  previous.classList.add('scene-leaving');
  document.querySelector('#navbar').classList.add('hidden');
  if (updateHash) history.pushState(null, '', '#' + scenes[index].id);
  if (!still()) {
    // Preserve the QML-inspired masks with a shorter, fluid timing.
    const type=transitionCount++%4;
    const easing='cubic-bezier(.645,.045,.355,1)';
    const origin=`${transitionOriginX.toFixed(1)}% ${transitionOriginY.toFixed(1)}%`;
    const sweepStart=direction>0?'polygon(0 0,0 0,0 100%,0 100%)':'polygon(100% 0,100% 0,100% 100%,100% 100%)';
    const sweepEnd=direction>0?'polygon(0 0,125% 0,100% 100%,0 100%)':'polygon(-25% 0,100% 0,100% 100%,0 100%)';
    const variants = [
      {duration:1000,out:{transform:'scale(1.025)',opacity:0},start:{transform:'scale(.985)',opacity:0},end:{transform:'none',opacity:1}},
      {duration:1600,out:{transform:`translateX(${-direction*4}%) rotate(${-direction*.35}deg) scale(.99)`,opacity:0},start:{transform:`translateX(${direction*3}%) scale(1.008)`,opacity:0,clipPath:'inset(0 50% 0 50%)'},end:{transform:'none',opacity:1,clipPath:'inset(0 0 0 0)'}},
      {duration:1600,out:{transform:'scale(1.018)',opacity:0},start:{transform:'scale(.975)',opacity:0,clipPath:`circle(0 at ${origin})`},end:{transform:'none',opacity:1,clipPath:`circle(150% at ${origin})`}},
      {duration:1600,out:{transform:`perspective(1200px) translateX(${-direction*5}%) rotateY(${direction*2}deg)`,opacity:0},start:{transform:`perspective(1200px) translateX(${direction*5}%) rotateY(${-direction*2}deg)`,opacity:0,clipPath:sweepStart},end:{transform:'perspective(1200px) translateX(0) rotateY(0deg)',opacity:1,clipPath:sweepEnd}}
    ];
    const variant=variants[type];
    const options = {duration:type===0?620:900, easing, fill: 'both'};
    next.style.zIndex='4';
    animations=[
      previous.animate([{transform:'none',opacity:1},variant.out],options),
      next.animate([variant.start,variant.end],options),
      ...fadeContent(scenes[index],90)
    ];
    await Promise.allSettled(animations.map(a => a.finished));
    // Hide the outgoing scene before removing its opacity animation.
    previous.classList.remove('scene-leaving');
    animations.forEach(a => a.cancel()); animations = [];
    next.style.removeProperty('z-index');
  }
  previous.classList.remove('scene-leaving');
  busy = false; sum = 0; lastWheel = performance.now();
  scenes[index].focus({preventScroll: true});
  document.querySelector('#navbar').classList.remove('hidden');
}

function fadeContent(scene,delay=120) {
  return [...scene.children].filter(el=>!['SCRIPT','STYLE'].includes(el.tagName)).map((el,i)=>
    el.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{
      duration:520,delay:delay+Math.min(i,5)*45,
      easing:'cubic-bezier(.22,1,.36,1)',fill:'both'
    })
  );
}

sync();
if(surface(scenes[current])===journey)journey.scrollTop=journeyMotion.start(scenes[current]);
let scrollFrame=0;
const chapterReveal=new IntersectionObserver(entries=>{
  for(const entry of entries){
    if(!entry.isIntersecting)continue;
    if(!still())entry.target.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)'});
    chapterReveal.unobserve(entry.target);
  }
},{root:journey,threshold:.12});
chapters.slice(1).forEach(section=>[...section.children].forEach(el=>chapterReveal.observe(el)));
journey.addEventListener('scroll',()=>{
  if(scrollFrame)return;
  scrollFrame=requestAnimationFrame(()=>{
    scrollFrame=0;
    const y=journey.scrollTop;
    journey.style.setProperty('--journey-drift',`${still()?0:-y*.12}px`);
    if(busy||!journey.classList.contains('journey-active'))return;
    const chapter=chapters.reduce((a,s)=>journeyMotion.start(s)<=y+journey.clientHeight*.4?s:a,chapters[0]);
    const index=scenes.indexOf(chapter);
    if(index!==current){current=index;sync();history.replaceState(null,'','#'+chapter.id);}
  });
},{passive:true});
function initialEntrance(){if (!still()) {
  animations=fadeContent(scenes[current],180);
  const entrance=animations;
  Promise.allSettled(entrance.map(a=>a.finished)).then(()=>{
    entrance.forEach(a=>a.cancel());
    if(animations===entrance)animations=[];
  });
}}
if(document.body.classList.contains('intro-active'))document.addEventListener('autarkeia:intro-reveal',initialEntrance,{once:true});
else initialEntrance();

// Intercept hash links to navigate scenes instead of jumping
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]'); if (!link) return;
  const index = scenes.findIndex(s => '#' + s.id === link.getAttribute('href'));
  if (index >= 0) { e.preventDefault(); go(index); }
});

addEventListener('popstate', () => go(Math.max(0, scenes.findIndex(s => '#' + s.id === location.hash)), false));

// Check if scene content is at edge for wheel/swipe to switch
function atEdge(direction) {
  const s = surface(scenes[current]);
  return direction > 0 ? s.scrollTop + s.clientHeight >= s.scrollHeight - 4 : s.scrollTop <= 4;
}
function adjacent(direction){
  return surface(scenes[current])===journey
    ? (direction>0?scenes.indexOf(chapters.at(-1))+1:scenes.indexOf(chapters[0])-1)
    : current+direction;
}

// Ignore interactions inside active controls
function interactive(target) {
  return target.closest('input,select,textarea,button,video,pre,.learning-picker,[contenteditable="true"],#matter,dialog,.image-modal');
}
// Pointer interaction does not imply ownership of the mouse wheel.
// Only editable controls, dialogs and scrollable nested content retain it.
function ownsWheel(target,direction) {
  if(target.closest('input,select,textarea,[contenteditable="true"],dialog,.image-modal'))return true;
  const active=surface(scenes[current]);
  for(let node=target;node&&node!==active&&node!==document.body;node=node.parentElement){
    const overflow=getComputedStyle(node).overflowY;
    if(/auto|scroll/.test(overflow)&&node.scrollHeight>node.clientHeight+2){
      if(direction>0?node.scrollTop+node.clientHeight<node.scrollHeight-2:node.scrollTop>2)return true;
    }
  }
  return false;
}

// Mouse wheel — accumulate delta, change scene when threshold passed
addEventListener('wheel', e => {
  if (e.defaultPrevented || e.ctrlKey || document.fullscreenElement || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  const direction = Math.sign(e.deltaY); if (!direction) return;
  if(ownsWheel(e.target,direction))return;
  const now = performance.now(), gap = now - lastWheel; lastWheel = now;
  if (busy) { e.preventDefault(); return; }
  if (wheelLocked) { if (gap < 140) { e.preventDefault(); return; } wheelLocked = false; }
  if (!atEdge(direction)) {
    sum = 0;
    const active=surface(scenes[current]);
    // Fixed navigation overlays should scroll the current page too.
    if(!active.contains(e.target)){
      e.preventDefault();active.scrollBy({top:e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?active.clientHeight:1),behavior:'auto'});
    }
    return;
  }
  e.preventDefault();
  if (gap > 220 || Math.sign(sum) !== direction) sum = 0;
  sum += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
  if (Math.abs(sum) > 45) go(adjacent(direction));
}, {passive: false});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (interactive(e.target) || document.fullscreenElement) return;
  const direction = ['PageDown','ArrowDown',' '].includes(e.key) ? 1 : ['PageUp','ArrowUp'].includes(e.key) ? -1 : 0;
  if (direction && atEdge(direction)) { e.preventDefault(); go(adjacent(direction)); }
});

// Touch/swipe navigation
let touch;
document.addEventListener('touchstart', e => {
  if (interactive(e.target)) return;
  const t = e.touches[0]; touch = {x: t.clientX, y: t.clientY, top: atEdge(-1), bottom: atEdge(1)};
}, {passive: true});
document.addEventListener('touchend', e => {
  if (!touch) return;
  const t = e.changedTouches[0], dy = touch.y - t.clientY, dx = touch.x - t.clientX;
  const edge = dy > 0 ? touch.bottom : touch.top; touch = null;
  if (edge && Math.abs(dy) > 72 && Math.abs(dy) > Math.abs(dx) * 1.5) go(adjacent(Math.sign(dy)));
}, {passive: true});

// Settle animations when motion is paused or reduced
function settle() { if (still()) animations.forEach(a => a.finish()); }
reduced.addEventListener('change', settle);
new MutationObserver(settle).observe(document.body, {attributes: true, attributeFilter: ['class']});
