import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const html=await fs.readFile('dist/index.html','utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');
for(const [,ref]of html.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(https?:|data:)/.test(ref))continue;if(ref.startsWith('#')){assert(ids.includes(ref.slice(1)),`Missing anchor ${ref}`);continue}await fs.access(path.join('dist',ref.split('?')[0]))}
assert(html.indexOf('id="prologue"')<html.indexOf('id="waste-intro"'));assert(html.indexOf('id="waste-lab"')<html.indexOf('id="learn"'));
const meta=JSON.parse(await fs.readFile('dist/models/waste/metadata.json','utf8'));assert.deepEqual(meta.labels,['Plastik','Botol plastik','Aluminium','Organik','Kertas']);
async function scan(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,item.name);if(item.isDirectory()){await scan(p);continue}if(/\.(?:js|mjs|html|css|json|md)$/.test(item.name)){const text=await fs.readFile(p,'utf8');assert(!/sk-proj-[A-Za-z0-9_-]{20,}|AQ\.[A-Za-z0-9_-]{25,}/.test(text),`Possible secret in ${p}`)}}}await scan('dist');
const worker=await import('../server/worker.mjs');assert.equal(typeof worker.default.fetch,'function');
console.log('PASS: anchors, assets, section order, five model labels, no embedded API keys, Worker entrypoint');
