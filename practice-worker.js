let messages=0;
const output=text=>{if(messages++<150)postMessage({type:'output',text:String(text).slice(0,3000)});};
const format=value=>{try{return typeof value==='string'?value:JSON.stringify(value)??String(value);}catch{return String(value);}};
onmessage=async({data})=>{
  try{
    if(data.language==='Python'){
      const {loadPyodide}=await import('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs');
      const python=await loadPyodide({stdout:output,stderr:output,stdin:()=>{throw new Error('input() is unavailable. Assign a value in your code instead.');}});
      await python.loadPackagesFromImports(data.code);postMessage({type:'ready'});
      await python.runPythonAsync(data.code);
    }else{
      postMessage({type:'ready'});
      const console={log:(...args)=>output(args.map(format).join(' ')),warn:(...args)=>output(args.map(format).join(' ')),error:(...args)=>output(args.map(format).join(' ')),info:(...args)=>output(args.map(format).join(' '))};
      await new Function('console','return (async()=>{\n'+data.code+'\n})()')(console);
    }
    postMessage({type:'done'});
  }catch(error){postMessage({type:'error',text:error.message||String(error)});}
};
