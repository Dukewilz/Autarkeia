import {setupJourney} from './journey-motion.js?v=native-4';

// One document scrollbar. No wheel interception, thresholds or scroll locks.
const scenes=[...document.querySelectorAll('main > section')];
const chapters=scenes.filter(s=>s.classList.contains('waste-section'));
const journey=document.createElement('div');journey.className='waste-journey journey-active';
chapters[0].before(journey);chapters.forEach(s=>journey.append(s));
document.body.classList.add('scene-mode','native-scroll');
scenes.forEach(s=>{s.classList.add('scene');s.inert=false;s.removeAttribute('aria-hidden');});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
setupJourney(journey,chapters,()=>reduced.matches||document.body.classList.contains('motion-paused'),true);
let current='',frame=0;
function sync(){
  frame=0;const line=innerHeight*.4;
  const active=scenes.reduce((chosen,s)=>s.getBoundingClientRect().top<=line?s:chosen,scenes[0]);
  if(current===active.id)return;current=active.id;
  scenes.forEach(s=>s.classList.toggle('scene-active',s===active));
  document.dispatchEvent(new CustomEvent('autarkeia:scene',{detail:{id:current}}));
}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(sync);},{passive:true});
document.querySelector('#navbar').classList.remove('hidden');
sync();
// Re-align a deep link after moving the three chapters into their wrapper.
requestAnimationFrame(()=>{
  const target=scenes.find(s=>'#'+s.id===location.hash);
  if(target)target.scrollIntoView({behavior:'instant'});
});
