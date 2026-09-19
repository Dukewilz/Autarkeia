const topics = [
  {
    name: 'HTML', role: 'Structure', symbol: '</>',  color: '#e6bea0', category: 'The content',
    heading: 'Give a page its structure.',
    description: 'HTML describes what is on a page: headings, paragraphs, links, images, and forms. Meaningful elements help browsers and assistive technology understand your content.',
    file: 'index.html',
    image: 'images/preview-html.png',
    imageAlt: 'HTML code preview in code editor',
    imagePosition: 'left top',
    imageZoom: 1.24,
    thumbPosition: 'left top',
    code: '<main>\n  <h1>Hello, web.</h1>\n  <p>My first page.</p>\n  <a href="#learn">Keep learning</a>\n</main>',
    note: 'HTML is a markup language. It gives content meaning; CSS and JavaScript add presentation and behavior.',
    link: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content',
    cheats: [
      ['A document', 'The head contains metadata. The body contains the page. The viewport setting lets mobile browsers use the device width.', '<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta name="viewport"\n      content="width=device-width, initial-scale=1">\n    <title>My page</title>\n  </head>\n  <body>Hello, web.</body>\n</html>'],
      ['Elements & attributes', 'Tags identify an element. Attributes describe it. An id identifies one element; a class can be shared by many.', '<a href="#about" class="link">About</a>\n<section id="about">\n  <h2>About this page</h2>\n  <p>A short introduction.</p>\n</section>'],
      ['Meaningful structure', 'Use main for the main content, nav for navigation, and headings in a logical order. Use buttons for actions and links for destinations.', '<nav aria-label="Main navigation">\n  <a href="#about">About</a>\n</nav>\n<main>\n  <h1>My learning journal</h1>\n  <article>\n    <h2>My first project</h2>\n  </article>\n</main>'],
      ['Images & local paths', 'A relative path is resolved from the current page. Use meaningful alternative text for informative images and an empty alt for decoration.', '<img src="images/orbit.jpg"\n  alt="A planet with two visible rings"\n  width="640" height="400">\n\n<link rel="stylesheet" href="style.css">\n<script src="app.js" defer></script>'],
      ['Forms', 'Connect every input to a label. Native input types provide basic validation; server-side validation is still needed when storing submitted data.', '<form>\n  <label for="email">Email</label>\n  <input id="email" name="email"\n    type="email" required>\n  <button type="submit">Continue</button>\n</form>'],
      ['Video', 'Use controls when visitors should choose playback. Muted, playsinline, and autoplay can support background video, but browsers may still limit autoplay.', '<video controls playsinline\n  poster="images/preview.jpg">\n  <source src="media/intro.mp4"\n    type="video/mp4">\n  Your browser cannot play this video.\n</video>']
    ]
  },
  {
    name: 'CSS', role: 'Presentation', symbol: '{ }', color: '#b8b0e5', category: 'The appearance',
    heading: 'Shape the way it feels.',
    description: 'CSS controls color, typography, spacing, and layout. A few consistent rules can make the same content readable on a phone or a wide screen.',
    file: 'style.css',
    image: 'images/preview-css.png',
    imageAlt: 'CSS stylesheet preview in code editor',
    imagePosition: 'left 15%',
    imageZoom: 1.25,
    thumbPosition: 'left 15%',
    code: '.page {\n  max-width: 72rem;\n  margin-inline: auto;\n  padding: clamp(1rem, 4vw, 4rem);\n  color: #f0eeeb;\n}',
    note: 'Start with spacing and readable type. Add motion only when it helps someone understand a change.',
    link: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design',
    cheats: [
      ['Selectors & the cascade', 'A selector chooses elements. A declaration assigns a value to a property. Specificity and source order help determine which rule wins.', 'p { color: #b9b1c4; }\n.intro { color: #f0eeeb; }\n#title { letter-spacing: -0.04em; }'],
      ['The box model', 'Content sits inside padding, a border, and an outer margin. Border-box includes padding and border in the declared width.', '* { box-sizing: border-box; }\n.card {\n  width: 100%;\n  padding: 1.5rem;\n  border: 1px solid #ffffff20;\n  margin-block: 1rem;\n}'],
      ['Flexbox & Grid', 'Flexbox arranges items along one main axis. Grid manages rows and columns. Let layouts wrap instead of forcing a fixed screen width.', '.navigation {\n  display: flex;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.cards {\n  display: grid;\n  grid-template-columns:\n    repeat(auto-fit, minmax(15rem, 1fr));\n  gap: 1.5rem;\n}'],
      ['Responsive sizing', 'Relative units and media queries let the layout adapt. A max-width prevents long text lines on wide displays.', 'h1 { font-size: clamp(2rem, 6vw, 5rem); }\narticle { max-width: 65ch; }\n@media (max-width: 40rem) {\n  .layout { grid-template-columns: 1fr; }\n}'],
      ['Reusable values', 'Custom properties keep related colors and spacing consistent. Change the value once to update every use.', ':root {\n  --accent: #e6bea0;\n  --space: 1.5rem;\n}\n.button {\n  background: var(--accent);\n  padding: var(--space);\n}'],
      ['Motion & focus', 'Use transform and opacity for simple transitions. Keep keyboard focus visible and respect reduced-motion preferences.', 'button { transition: transform 180ms ease; }\nbutton:hover { transform: translateY(-2px); }\nbutton:focus-visible {\n  outline: 2px solid #e6bea0;\n  outline-offset: 4px;\n}\n@media (prefers-reduced-motion: reduce) {\n  button { transition: none; }\n}']
    ]
  },
  {
    name: 'JavaScript', role: 'Interaction', symbol: 'JS', color: '#d8c688', category: 'The behavior',
    heading: 'Make the page respond.',
    description: 'JavaScript works with values, makes decisions, and responds to events. Through the DOM, it can read an input or change what appears on a page.',
    file: 'experience.js',
    image: 'images/preview-javascript.png',
    imageAlt: 'JavaScript code diff and development in Antigravity IDE',
    imagePosition: '6% 16%',
    imageZoom: 1.55,
    thumbPosition: '8% 18%',
    code: 'const button = document.querySelector("button");\nlet count = 0;\n\nbutton.addEventListener("click", () => {\n  count += 1;\n  button.textContent = `${count} clicks`;\n});',
    note: 'In let count = 0, count is the variable name and 0 is its initial value. A later assignment can change that value.',
    link: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Variables',
    cheats: [
      ['Variables & values', 'Use let for a binding you will reassign. Use const otherwise. A const object or array can still have its contents changed.', 'let score = 80;\nscore = 90;\nconst name = "Ari";\nconst topics = ["HTML", "CSS"];\ntopics.push("JavaScript");\ntypeof name; // "string"'],
      ['Types & comparisons', 'Common values include strings, numbers, booleans, null, and undefined. Use strict equality to compare without converting types.', 'const ready = true;\nconst missing = null;\nlet notAssigned; // undefined\n5 === "5";     // false\n5 >= 3;        // true\nready && 5 > 3; // true'],
      ['Conditions & loops', 'Conditions choose a branch. A loop repeats a task. A for...of loop reads each value in an array.', 'const score = 85;\nif (score >= 75) {\n  console.log("Passed");\n} else {\n  console.log("Try again");\n}\nfor (const topic of ["HTML", "CSS"]) {\n  console.log(topic);\n}'],
      ['Functions & objects', 'A function groups reusable behavior. Parameters receive inputs; return gives a result. Objects group named properties.', 'function greet(name) {\n  return `Hello, ${name}`;\n}\nconst learner = { name: "Ari", score: 85 };\nconsole.log(greet(learner.name));'],
      ['Inputs & the DOM', 'querySelector finds an element. value reads its input. trim removes outer whitespace. Prefer textContent for displaying user-written text.', 'const input = document.querySelector("input");\nconst output = document.querySelector("output");\ninput.addEventListener("input", () => {\n  const name = input.value.trim();\n  output.textContent = name;\n});'],
      ['Forms & validation', 'Prevent the default submit when handling a form in JavaScript. Convert numeric input deliberately and check for invalid values.', 'form.addEventListener("submit", (event) => {\n  event.preventDefault();\n  const raw = input.value.trim();\n  const score = Number(raw);\n  if (!raw || !Number.isFinite(score)) {\n    output.textContent = "Enter a number.";\n    return;\n  }\n  output.textContent = `Score: ${score}`;\n});'],
      ['Arrays & transformations', 'map creates a transformed array. filter keeps matching items. find returns the first matching item, or undefined.', 'const scores = [60, 85, 95];\nconst passed = scores.filter(n => n >= 75);\nconst doubled = scores.map(n => n * 2);\nconst first = scores.find(n => n >= 90);'],
      ['Async work & errors', 'await waits for a promise inside an async function. A network response can arrive successfully but still have an HTTP error status.', 'async function loadTopics() {\n  try {\n    const response = await fetch("topics.json");\n    if (!response.ok) throw new Error("Load failed");\n    return await response.json();\n  } catch (error) {\n    console.error(error.message);\n    return [];\n  }\n}']
    ]
  },
  {
    name: 'Python', role: 'Logic & data', symbol: 'Py', color: '#8fbfbf', category: 'Beyond the browser',
    heading: 'Work with ideas as data.',
    description: 'Python is useful for automation, data analysis, and server-side applications. Begin with values, conditions, loops, and functions before moving into tables and visualizations.',
    file: 'netlify.py',
    image: 'images/preview-python.png',
    imageAlt: 'Python AST calculator and terminal output in code editor',
    imagePosition: '4% 6%',
    imageZoom: 1.62,
    thumbPosition: '4% 6%',
    code: 'scores = [60, 85, 95]\n\ndef has_passed(score):\n    return score >= 75\n\nfor score in scores:\n    print(score, has_passed(score))',
    note: 'Run Python in a terminal or a notebook such as Jupyter. It does not run natively in an ordinary browser page like JavaScript.',
    link: 'https://docs.python.org/3/tutorial/introduction.html',
    cheats: [
      ['Values & strings', 'Python binds names to values. str, int, float, and bool describe common value types. String indexing begins at zero; slicing excludes its stop index.', 'name = "Autarkeia"\nage = 20\nratio = 0.75\nready = True\nprint(type(name))\nprint(name[0])   # A\nprint(name[:4])  # Auta\nprint(name.strip().upper())'],
      ['Conditions', 'Indentation defines a block. Use if, elif, and else for alternatives. Comparisons produce True or False.', 'score = 85\nif score >= 90:\n    result = "Excellent"\nelif score >= 75:\n    result = "Passed"\nelse:\n    result = "Keep practicing"'],
      ['Loops & input', 'A for loop visits items in a sequence. range stops before its end value. input returns text, so numeric input needs conversion and error handling.', 'for number in range(3):\n    print(number)  # 0, 1, 2\n\ntry:\n    age = int(input("Age: "))\nexcept ValueError:\n    print("Enter a whole number.")'],
      ['Functions', 'Define a function with def. Parameters are inputs. return sends a result back to the caller.', 'def average(values):\n    if not values:\n        return None\n    return sum(values) / len(values)\n\nprint(average([60, 85, 95]))'],
      ['Lists & dictionaries', 'Lists hold an ordered collection; dictionaries associate keys with values. sorted returns a new sorted list, while list.sort changes the existing list.', 'topics = ["HTML", "CSS"]\ntopics.append("JavaScript")\nfor index, topic in enumerate(topics):\n    print(index, topic)\n\nlearner = {"name": "Ari", "score": 85}\nprint(learner["name"])'],
      ['NumPy, pandas & charts', 'After the basics, explore arrays, tabular data, missing values, and charts. These third-party libraries must be installed in your Python environment.', 'import numpy as np\nimport pandas as pd\n\nvalues = np.array([60, 85, 95])\ntable = pd.DataFrame({"score": values})\nprint(table["score"].mean())\n\n# With matplotlib installed:\nimport matplotlib.pyplot as plt\ntable["score"].plot(kind="bar")\nplt.show()']
    ],
    credit: 'Learning sequence adapted from the supplied Python modules by Muthi\'ah / Cendekia Digital Global: types and strings → conditions → loops → functions → collections → NumPy and pandas → visualization. Examples here are a concise introduction.'
  }
];

const $ = s => document.querySelector(s);
const picker = $('.learning-picker');
const buttons = [...document.querySelectorAll('[data-topic]')];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionStopped = () => reduced.matches || document.body.classList.contains('motion-paused');
let selected = -1, elapsed = 0;
let pickerWidth = 0, lastFrame = 0;
const panelAnimations = [];

function renderCheatsheet(topic) {
  $('#cheatsheet-title').textContent = `${topic.name} essentials`;
  const cards = topic.cheats.map(([title, text, code]) => {
    const card = document.createElement('article'); card.className = 'cheat-card';
    const h = document.createElement('h4'); h.textContent = title;
    const p = document.createElement('p'); p.textContent = text;
    const pre = document.createElement('pre'); const block = document.createElement('code'); block.textContent = code;
    pre.append(block); card.append(h, p, pre); return card;
  });
  if (topic.credit) { const credit = document.createElement('p'); credit.className = 'module-credit'; credit.textContent = topic.credit; cards.push(credit); }
  $('#cheatsheet-content').replaceChildren(...cards);
}

function selectTopic(index, direction = 0) {
  const next = ((index % topics.length) + topics.length) % topics.length;
  if (next === selected && direction === 0) return;
  let delta = direction || (selected >= 0 ? next - selected : 0);
  if (!direction && selected >= 0 && Math.abs(delta) > 2) delta += delta > 0 ? -4 : 4;
  selected = next;
  const topic = topics[selected];
  $('.learning').style.setProperty('--topic-accent', topic.color);
  const text = {
    'topic-category': topic.category,
    'topic-heading': topic.heading,
    'topic-description': topic.description,
    'code-file': topic.file,
    'topic-note': topic.note,
    'topic-position': `${topic.name} · ${selected + 1} of 4`
  };
  for (const [id, value] of Object.entries(text)) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  const imgEl = document.getElementById('topic-image');
  if (imgEl && topic.image) {
    imgEl.src = topic.image;
    imgEl.alt = topic.imageAlt || `${topic.name} code preview`;
    imgEl.style.setProperty('--img-pos', topic.imagePosition || 'left top');
    imgEl.style.setProperty('--img-zoom', String(topic.imageZoom || 1.3));
  }
  const modalImg = document.getElementById('modal-img');
  if (modalImg && topic.image) {
    modalImg.src = topic.image;
    modalImg.alt = topic.imageAlt || `${topic.name} full preview`;
  }
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = `${topic.name} — ${topic.file}`;

  $('#topic-guide').href = topic.link; $('#topic-guide').textContent = `Read the ${topic.name} guide ↗`;
  buttons.forEach((button, i) => button.setAttribute('aria-pressed', i === selected));
  renderCheatsheet(topic);
  panelAnimations.splice(0).forEach(animation => animation.cancel());
  if (!motionStopped()) {
    for (const element of [$('#topic-panel')]) {
      panelAnimations.push(element.animate(
        [{opacity:0,transform:`translateX(${delta>0?36:-36}px)`},{opacity:1,transform:'translateX(0)'}],
        {duration:650,easing:'cubic-bezier(.22,1,.36,1)'}
      ));
    }
  }
  layoutPicker();
}

// WallpaperPicker-style: active card expands and centers, side cards tilt and shrink
function layoutPicker() {
  if (!pickerWidth && picker) pickerWidth = picker.getBoundingClientRect().width || 540;
  const gap = pickerWidth < 400 ? 12 : 18;
  const activeWidth = pickerWidth * .57;
  const sideWidth = pickerWidth * .19;
  buttons.forEach((button, i) => {
    const topic = topics[i];
    const offset = i - selected;
    // Wrap distance for circular layout
    const wrappedOffset = (() => {
      let o = offset;
      if (o > topics.length / 2) o -= topics.length;
      if (o < -topics.length / 2) o += topics.length;
      return o;
    })();
    const wrappedDist = Math.abs(wrappedOffset);
    const isActive = wrappedOffset === 0;
    const x = isActive ? 0 : Math.sign(wrappedOffset) * ((activeWidth + sideWidth) / 2 + gap + (wrappedDist - 1) * (sideWidth + gap));
    button.style.width = (isActive ? activeWidth : sideWidth) + 'px';
    button.style.transform = `translate(-50%,-50%) translateX(${x}px) skewX(-10deg) scaleY(${Math.max(.65, 1 - wrappedDist * .12)})`;
    button.style.zIndex = String(10 - wrappedDist);
    button.style.opacity = wrappedDist > 2 ? '.2' : isActive ? '1' : String(.5 + (1 - wrappedDist * .18));
    // Position thumbnail inside card
    const thumbImg = button.querySelector('.picker-card-thumb img');
    if (thumbImg && topic.image) {
      thumbImg.style.objectPosition = topic.thumbPosition || topic.imagePosition || 'left top';
    }
  });
}

$('#topic-prev').addEventListener('click', () => selectTopic(selected - 1, -1));
$('#topic-next').addEventListener('click', () => selectTopic(selected + 1, 1));
buttons.forEach((button, i) => button.addEventListener('click', () => selectTopic(i)));
picker.addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  if (event.key === 'Home') selectTopic(0);
  else if (event.key === 'End') selectTopic(3);
  else { const direction = event.key === 'ArrowRight' ? 1 : -1; selectTopic(selected + direction, direction); }
});
let touchStart;
picker.addEventListener('touchstart', e => { const t=e.touches[0]; touchStart={x:t.clientX,y:t.clientY}; },{passive:true});
picker.addEventListener('touchend', e => { if(!touchStart)return;const t=e.changedTouches[0],dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){const direction=dx<0?1:-1;selectTopic(selected+direction,direction)} },{passive:true});
new ResizeObserver(([entry]) => {pickerWidth=entry.contentRect.width;layoutPicker()}).observe(picker);
selectTopic(0);

// Screenshot modal viewer
const imageModal = document.getElementById('image-modal');
const previewScreen = document.querySelector('.preview-screen');
const zoomBtn = document.getElementById('preview-zoom');
const modalClose = document.getElementById('modal-close');

function openPreviewModal() {
  if (imageModal && typeof imageModal.showModal === 'function') {
    imageModal.showModal();
  }
}
if (previewScreen) previewScreen.addEventListener('click', openPreviewModal);
if (zoomBtn) zoomBtn.addEventListener('click', e => { e.stopPropagation(); openPreviewModal(); });
if (modalClose) modalClose.addEventListener('click', () => imageModal?.close());
if (imageModal) {
  imageModal.addEventListener('click', e => {
    if (e.target === imageModal) imageModal.close();
  });
}

// Content remains visible without JavaScript or when motion is reduced.
const revealElements = [...document.querySelectorAll('[data-reveal]')];
if (!motionStopped() && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}
  }),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
  revealElements.forEach(element => {element.classList.add('reveal-ready');observer.observe(element)});
}

// Ambient dust particles
const canvas = $('#ambient-dust'), ctx = canvas.getContext('2d');
let width = 0, height = 0, pixelRatio = 1;
const motes=Array.from({length:55},(_,i)=>({x:((i*73)%101)/101,y:((i*43)%97)/97,speed:.4+(i%5)*.18,r:.4+(i%3)*.35,hue:i%3===0?265:i%3===1?30:220}));
function resizeDust(){width=innerWidth;height=innerHeight;pixelRatio=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*pixelRatio);canvas.height=Math.round(height*pixelRatio);drawDust(elapsed)}
function drawDust(time){
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  ctx.clearRect(0,0,width,height);
  motes.forEach((m,i)=>{
    const drift = Math.sin(time/9000+i*0.7)*14;
    const x=m.x*width+drift;
    const y=((m.y*height-time*.006*m.speed)%height+height)%height;
    const alpha = 0.25 + Math.sin(time/4000+i)*0.12;
    const colors=['#c8b4e1','#e7c0a1','#7ab8e8'];
    ctx.fillStyle=colors[m.hue===265?0:m.hue===30?1:2]+(Math.round(alpha*255).toString(16).padStart(2,'0'));
    ctx.beginPath();
    ctx.arc(x,y,m.r,0,Math.PI*2);
    ctx.fill();
  });
}
addEventListener('resize',resizeDust);resizeDust();
document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('page-hidden',document.hidden);lastFrame=0});
const settleMotion=()=>{if(motionStopped()){panelAnimations.splice(0).forEach(a=>a.cancel());revealElements.forEach(e=>e.classList.add('revealed'));layoutPicker(elapsed)}};
new MutationObserver(settleMotion).observe(document.body,{attributes:true,attributeFilter:['class']});
reduced.addEventListener('change',settleMotion);

function frame(now){
  const dt=lastFrame?Math.min(now-lastFrame,70):0;
  if(!lastFrame || now-lastFrame>=32){
    lastFrame=now;
    if(!document.hidden&&!motionStopped()){
      elapsed+=dt;
      drawDust(elapsed);
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
