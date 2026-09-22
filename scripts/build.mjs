import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
await fs.mkdir(path.join(root,'client'),{recursive:true});
for(const entry of await fs.readdir(root,{withFileTypes:true})){
  if(entry.name.startsWith('.')||['client','server','README.md','netlify.toml','vercel.json'].includes(entry.name))continue;
  await fs.cp(path.join(root,entry.name),path.join(root,'client',entry.name),{recursive:true});
}
await fs.mkdir(path.join(root,'server'),{recursive:true});
await fs.copyFile('server/worker.mjs','dist/server/index.js');
await fs.copyFile('server/waste-api.mjs','dist/server/waste-api.mjs');
await fs.mkdir('dist/.openai',{recursive:true});
await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built Worker and preserved website assets.');
