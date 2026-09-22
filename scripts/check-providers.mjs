import {handleWaste} from '../server/waste-api.mjs';
for(const name of ['Gemini','OpenAI']){
  const env={...process.env};delete env[name==='Gemini'?'OPENAI_API_KEY':'GEMINI_API_KEY'];
  const response=await handleWaste(new Request('http://127.0.0.1/api/waste',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'chat',question:'In one sentence, explain why checking local paper recycling rules matters.'})}),env);
  const data=await response.json();console.log(JSON.stringify({provider:name,status:response.status,answered:!!data.answer,error:data.error}));
}
