const intro=document.querySelector('#cinematic-intro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mark=`<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="mark-circle" cx="50" cy="50" r="31"/><path class="mark-a" d="M23 82 49 17 79 82 51 37Z"/><ellipse class="mark-orbit" cx="50" cy="53" rx="43" ry="12" transform="rotate(22 50 53)"/></svg>`;
document.querySelectorAll('.brand').forEach(brand=>{
  brand.innerHTML=`<span class="brand-mark">${mark}</span> AUTARKEIA`;
  brand.setAttribute('aria-label','Autarkeia — Home');
});
const stage=document.createElement('div');stage.className='intro-signature';
stage.innerHTML=`${mark}<span>AUTARKEIA</span><small>LEARN. CREATE. EXPLORE.</small>`;
intro.prepend(stage);
let done=false,revealed=false,revealTimer,finishTimer;
function reveal(){
  if(revealed)return;revealed=true;
  document.body.classList.replace('intro-active','intro-revealing');
  document.dispatchEvent(new CustomEvent('autarkeia:intro-reveal'));
}
function finish(){
  if(done)return;done=true;clearTimeout(revealTimer);clearTimeout(finishTimer);reveal();
  intro.hidden=true;document.body.classList.add('intro-finished');
  document.dispatchEvent(new CustomEvent('autarkeia:intro-complete'));
}
document.querySelector('#intro-skip').addEventListener('click',()=>{reveal();finishTimer=setTimeout(finish,reduced.matches?0:700);});
reduced.addEventListener('change',e=>{if(e.matches)finish()});
if(reduced.matches)finish();else{revealTimer=setTimeout(reveal,2450);finishTimer=setTimeout(finish,3600);}
