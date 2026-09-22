import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const definition=name=>source.split('\n').find(line=>line.startsWith(`function ${name}(`));
let arcs=[];
const ctx={setTransform(){},clearRect(){arcs=[];},beginPath(){},moveTo(){},lineTo(){},stroke(){},fill(){},arc(x,y,r){arcs.push([x,y,r]);}};
const sandbox={gesture:'open',paused:false,depth:1,scale:1,rotation:.3,lastMatterTime:0,matter:{},mc:ctx,fit:()=>({w:800,h:570,d:1}),particles:Array.from({length:600},(_,i)=>({u:(i*.61803398875)%1,v:(i+.5)/600,r:.5,i}))};
vm.createContext(sandbox);vm.runInContext(definition('point')+'\n'+definition('drawMatter'),sandbox);
for(let time=0;time<10000;time+=16.67)sandbox.drawMatter(time);
const before=arcs.map(p=>[...p]);sandbox.drawMatter(sandbox.lastMatterTime);
const maxDelta=Math.max(...arcs.map((p,i)=>Math.hypot(p[0]-before[i][0],p[1]-before[i][1])));
assert.ok(maxDelta<.0001,'redrawing at the same animation time must not distort the sphere');
const width=Math.max(...arcs.map(p=>p[0]))-Math.min(...arcs.map(p=>p[0]));
const height=Math.max(...arcs.map(p=>p[1]))-Math.min(...arcs.map(p=>p[1]));
assert.ok(width/height>.9&&width/height<1.1,'rotating sphere must retain its proportions');
for(const form of ['closed','one','two','three','check']){sandbox.gesture=form;for(let i=0;i<80;i++)sandbox.drawMatter(sandbox.lastMatterTime+16.67);assert.ok(arcs.every(p=>p.every(Number.isFinite)),'all forms must render finite coordinates');}
console.log('PASS: repeat-frame stability, sphere proportions, and all six particle forms');
