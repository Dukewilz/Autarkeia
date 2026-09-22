import {handleWaste} from './waste-api.mjs';
export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/waste')return handleWaste(request,env);if(url.pathname==='/api/health')return Response.json({ok:true,providers:{gemini:!!env.GEMINI_API_KEY,openai:!!env.OPENAI_API_KEY}},{headers:{'Cache-Control':'no-store'}});return env.ASSETS.fetch(request)}};
