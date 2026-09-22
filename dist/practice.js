const $=s=>document.querySelector(s);
const examples={
 HTML:{file:'index.html',hint:'Edit the markup, then run to see the page. Scripts are disabled in this preview.',code:'<main>\n  <h1>Hello, web.</h1>\n  <p>This is my first page.</p>\n  <button>Explore</button>\n</main>'},
 CSS:{file:'style.css',hint:'Style the sample card using .card, h1, p, and button.',code:'.card {\n  padding: 32px;\n  border-radius: 20px;\n  background: #242039;\n  color: #f0eeeb;\n}\nh1 { color: #e6bea0; }\nbutton {\n  background: #b8b0e5;\n  border: 0;\n  border-radius: 20px;\n  padding: 12px 20px;\n}'},
 JavaScript:{file:'app.js',hint:'Try JavaScript logic with console.log(). This console runs without the page DOM.',code:'const scores = [60, 85, 95];\nconst passed = scores.filter(score => score >= 75);\n\nfunction average(values) {\n  return values.reduce((sum, n) => sum + n, 0) / values.length;\n}\n\nconsole.log("Passed:", passed);\nconsole.log("Average:", average(scores));'},
 Python:{file:'main.py',hint:'Use print() to see results. Python loads on the first run and needs an internet connection. input() is not supported.',code:'scores = [60, 85, 95]\n\ndef has_passed(score):\n    return score >= 75\n\nfor score in scores:\n    print(score, has_passed(score))\n\nprint("Average:", sum(scores) / len(scores))'}
};
const drafts=new Map(),editor=$('#practice-code'),frame=$('#practice-preview'),output=$('#practice-output');
let language='',worker,timer,generation=0,lines=0;
const setStatus=text=>$('#practice-status').textContent=text;
function stop(message){generation++;clearTimeout(timer);worker?.terminate();worker=null;$('#practice-run').disabled=false;$('#practice-stop').hidden=true;if(message)setStatus(message);}
function select(){
  const index=Number(document.querySelector('[data-topic][aria-pressed="true"]').dataset.topic),next=Object.keys(examples)[index];
  if(next===language)return;
  if(language)drafts.set(language,editor.value);stop();language=next;
  editor.value=drafts.get(language)??examples[language].code;
  $('#practice-language').textContent=language;$('#practice-file').textContent=examples[language].file;$('#practice-hint').textContent=examples[language].hint;
  editor.setAttribute('aria-label',language+' code editor');
  frame.hidden=!['HTML','CSS'].includes(language);output.hidden=!frame.hidden;output.textContent='Run your code to see output.';frame.srcdoc='';setStatus('Ready');
}
new MutationObserver(select).observe($('.learning-picker'),{subtree:true,attributes:true,attributeFilter:['aria-pressed']});select();
function append(text){if(lines++<150)output.textContent+=(output.textContent?'\n':'')+String(text).slice(0,3000);}
$('#practice-run').onclick=()=>{
  stop();const code=editor.value;drafts.set(language,code);output.textContent='';lines=0;
  if(!frame.hidden){
    const policy="default-src 'none'; img-src data:; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'";
    const base='<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="'+policy+'"><style>body{font:16px system-ui;padding:24px;background:#faf9fc;color:#242039}button{font:inherit}*{box-sizing:border-box}</style>';
    frame.srcdoc=base+(language==='HTML'?code:'<style>'+code.replace(/<\/style/gi,'<\\/style')+'</style><article class="card"><h1>Hello, web.</h1><p>Change this card with CSS.</p><button>Explore</button></article>');setStatus('Preview updated');return;
  }
  const token=generation;worker=new Worker('practice-worker.js',{type:'module'});$('#practice-run').disabled=true;$('#practice-stop').hidden=false;setStatus(language==='Python'?'Loading Python…':'Running…');
  timer=setTimeout(()=>stop('Timed out. Simplify the code and try again.'),language==='Python'?60000:5000);
  worker.onmessage=({data})=>{
    if(token!==generation)return;
    if(data.type==='ready'){setStatus('Running…');clearTimeout(timer);timer=setTimeout(()=>stop('Stopped after 5 seconds.'),5000);}
    else if(data.type==='output')append(data.text);
    else if(data.type==='done'){if(!output.textContent)output.textContent='Finished with no output.';stop('Finished');}
    else if(data.type==='error'){append(data.text);stop('Check the error above.');}
  };
  worker.onerror=e=>{append(e.message||'Runtime could not load. Check your connection.');stop('Unable to run.');};worker.postMessage({language,code});
};
$('#practice-stop').onclick=()=>stop('Stopped');
$('#practice-reset').onclick=()=>{stop();editor.value=examples[language].code;drafts.delete(language);output.textContent='Run your code to see output.';frame.srcdoc='';setStatus('Example restored');};
editor.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();$('#practice-run').click();}});
addEventListener('pagehide',()=>stop());
// Animate the native disclosure, retaining keyboard access and reduced-motion support.
const details=$('#cheatsheet'),summary=details.querySelector('summary');let disclosure,expanded=details.open;
summary.addEventListener('click',e=>{
  e.preventDefault();expanded=!expanded;
  const from=details.getBoundingClientRect().height;disclosure?.cancel();details.style.height='';details.open=true;
  const to=expanded?details.getBoundingClientRect().height:summary.getBoundingClientRect().height;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){details.open=expanded;return;}
  details.style.overflow='hidden';
  // Let the existing toggle listener populate the cheatsheet before measuring.
  requestAnimationFrame(()=>{const target=expanded?details.scrollHeight:to;disclosure=details.animate([{height:from+'px'},{height:target+'px'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});disclosure.onfinish=()=>{details.open=expanded;details.style.overflow='';disclosure=null;};});
});
