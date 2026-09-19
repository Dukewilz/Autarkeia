// scenes.js v5 — Full-screen scene transitions (slide + zoom + wipe)
// Each section is a scene. Content longer than the viewport scrolls within its scene.
const scenes = [...document.querySelectorAll('main > section')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const still = () => reduced.matches || document.body.classList.contains('motion-paused');
let current = Math.max(0, scenes.findIndex(s => '#' + s.id === location.hash));
let busy = false, lastWheel = 0, sum = 0, animations = [], wheelLocked = false;

// Scene dot navigation
const navigation = document.createElement('nav');
navigation.className = 'scene-navigation'; navigation.setAttribute('aria-label','Page sections');
const names = ['Home','About','Learn','Experiment','Closing'];
scenes.forEach((scene, i) => {
  scene.classList.add('scene'); scene.tabIndex = -1;
  const button = document.createElement('button');
  button.setAttribute('aria-label', names[i]); button.title = names[i];
  button.addEventListener('click', () => go(i)); navigation.append(button);
  // Hide navbar when content inside scene is scrolled
  let timer;
  scene.addEventListener('scroll', () => {
    document.querySelector('#navbar').classList.add('hidden');
    clearTimeout(timer); timer = setTimeout(() => document.querySelector('#navbar').classList.remove('hidden'), 650);
  }, {passive: true});
});
document.body.append(navigation); document.body.classList.add('scene-mode');

function sync() {
  scenes.forEach((scene, i) => {
    scene.classList.toggle('scene-active', i === current);
    scene.inert = i !== current;
    scene.setAttribute('aria-hidden', String(i !== current));
  });
  [...navigation.children].forEach((button, i) => button.setAttribute('aria-current', i === current ? 'step' : 'false'));
}

async function go(index, updateHash = true) {
  if (index < 0 || index >= scenes.length || index === current || busy) return;
  busy = true; wheelLocked = true;
  const direction = index > current ? 1 : -1;
  const previous = scenes[current];
  const next = scenes[index];
  current = index; next.scrollTop = 0; sync();
  previous.classList.add('scene-leaving');
  document.querySelector('#navbar').classList.add('hidden');
  if (updateHash) history.pushState(null, '', '#' + next.id);
  if (!still()) {
    const options = {duration: 820, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'both'};
    animations = [
      previous.animate([
        {opacity: 1, transform: 'scale(1)', filter: 'blur(0px)'},
        {opacity: 0, transform: `translateY(${-direction * 11}%) scale(.91)`, filter: 'blur(7px)'}
      ], options),
      next.animate([
        {opacity: .25, transform: `translateY(${direction * 22}%) scale(1.07)`, clipPath: direction > 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)'},
        {opacity: 1, transform: 'none', clipPath: 'inset(0 0 0 0)'}
      ], options)
    ];
    await Promise.allSettled(animations.map(a => a.finished));
    animations.forEach(a => a.cancel()); animations = [];
  }
  previous.classList.remove('scene-leaving');
  busy = false; sum = 0; lastWheel = performance.now();
  next.focus({preventScroll: true});
  document.querySelector('#navbar').classList.remove('hidden');
}

sync();

// Intercept hash links to navigate scenes instead of jumping
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]'); if (!link) return;
  const index = scenes.findIndex(s => '#' + s.id === link.getAttribute('href'));
  if (index >= 0) { e.preventDefault(); go(index); }
});

addEventListener('popstate', () => go(Math.max(0, scenes.findIndex(s => '#' + s.id === location.hash)), false));

// Check if scene content is at edge for wheel/swipe to switch
function atEdge(direction) {
  const s = scenes[current];
  return direction > 0 ? s.scrollTop + s.clientHeight >= s.scrollHeight - 4 : s.scrollTop <= 4;
}

// Ignore interactions inside active controls
function interactive(target) {
  return target.closest('input,select,textarea,button,pre,.learning-picker,[contenteditable="true"],#matter,dialog,.image-modal');
}

// Mouse wheel — accumulate delta, change scene when threshold passed
addEventListener('wheel', e => {
  if (e.ctrlKey || document.fullscreenElement || interactive(e.target) || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  const direction = Math.sign(e.deltaY); if (!direction) return;
  const now = performance.now(), gap = now - lastWheel; lastWheel = now;
  if (busy) { e.preventDefault(); return; }
  if (wheelLocked) { if (gap < 200) { e.preventDefault(); return; } wheelLocked = false; }
  if (!atEdge(direction)) { sum = 0; return; }
  e.preventDefault();
  if (gap > 220 || Math.sign(sum) !== direction) sum = 0;
  sum += e.deltaY * (e.deltaMode === 1 ? 16 : 1);
  if (Math.abs(sum) > 70) go(current + direction);
}, {passive: false});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (interactive(e.target) || document.fullscreenElement) return;
  const direction = ['PageDown','ArrowDown',' '].includes(e.key) ? 1 : ['PageUp','ArrowUp'].includes(e.key) ? -1 : 0;
  if (direction && atEdge(direction)) { e.preventDefault(); go(current + direction); }
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
  if (edge && Math.abs(dy) > 72 && Math.abs(dy) > Math.abs(dx) * 1.5) go(current + Math.sign(dy));
}, {passive: true});

// Settle animations when motion is paused or reduced
function settle() { if (still()) animations.forEach(a => a.finish()); }
reduced.addEventListener('change', settle);
new MutationObserver(settle).observe(document.body, {attributes: true, attributeFilter: ['class']});
