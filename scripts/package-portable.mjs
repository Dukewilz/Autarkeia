// Windows fallback for the Sites archive contract when the plugin's Bash packager is absent.
import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const base=path.resolve('.sites-runtime');await fs.mkdir(base,{recursive:true});
const stage=await fs.mkdtemp(path.join(base,'waste-package-'));
for(const name of ['client','server','.openai'])await fs.cp(path.resolve('dist',name),path.join(stage,'dist',name),{recursive:true});
const archive=path.join(base,'waste-site.tar.gz');
const result=spawnSync('tar.exe',['-czf',archive,'-C',stage,'dist'],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
const check=spawnSync('tar.exe',['-tzf',archive],{encoding:'utf8'});if(check.status!==0||!check.stdout.includes('dist/server/index.js')||!check.stdout.includes('dist/client/index.html')||!check.stdout.includes('dist/.openai/hosting.json'))throw new Error('Invalid archive');
if(check.stdout.split('\n').some(p=>/(^|\/)\.env|\.dev.vars/.test(p)))throw new Error('Secret file in archive');
console.log(archive);
