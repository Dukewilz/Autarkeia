// Shared by the gesture and waste labs to prevent competing TensorFlow globals.
let ready;
function script(src){return new Promise((resolve,reject)=>{const tag=document.createElement('script');tag.src=src;tag.onload=resolve;tag.onerror=()=>{tag.remove();reject(new Error('The model library could not load. Check your connection and retry.'))};document.head.append(tag)})}
export function loadTMLibraries(){
  if(!ready)ready=(async()=>{
    if(!window.tf)await script('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js');
    if(!window.tmImage)await script('https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8.5/dist/teachablemachine-image.min.js');
    if(!window.tmPose)await script('https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8.6/dist/teachablemachine-pose.min.js');
  })().catch(error=>{ready=null;throw error});
  return ready;
}
