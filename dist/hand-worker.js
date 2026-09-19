
let model;
(async()=>{try{const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/vision_bundle.mjs');const files=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.21/wasm');model=await vision.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',delegate:'CPU'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.6,minHandPresenceConfidence:.6,minTrackingConfidence:.6});postMessage({type:'ready'})}catch(e){postMessage({type:'error',message:e.message})}})();
onmessage=({data})=>{if(data.type!=='frame')return;try{if(model)postMessage({type:'result',result:model.detectForVideo(data.bitmap,data.time)});else postMessage({type:'result',result:{landmarks:[]}})}catch(e){postMessage({type:'error',message:e.message})}finally{data.bitmap.close()}};

