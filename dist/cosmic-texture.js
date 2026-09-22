// Cached procedural light field: a visual approximation of the supplied lensed disk.
// No video decoding or per-frame texture generation.
let seed=2819;
const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
const grid=Float32Array.from({length:128*128},random);
function noise(x,y){
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const at=(a,b)=>grid[(a&127)+((b&127)*128)];
  return (at(ix,iy)*(1-u)+at(ix+1,iy)*u)*(1-v)+(at(ix,iy+1)*(1-u)+at(ix+1,iy+1)*u)*v;
}
function turbulence(x,y){return noise(x*.025+20,y*.025+30)*.55+noise(x*.07+80,y*.07+50)*.3+noise(x*.19+12,y*.19+70)*.15;}
export function makeCosmicTexture(gas=false){
  const canvas=document.createElement('canvas'),size=gas?384:768;
  canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d'),image=ctx.createImageData(size,size),data=image.data;
  for(let row=0;row<size;row++)for(let col=0;col<size;col++){
    const x=(col/size-.5)*800,y=(row/size-.5)*800,r=Math.hypot(x,y),n=turbulence(x,y);
    let light=0,red=170,green=195,blue=225,alpha=0;
    if(gas){
      // Uneven cloud density, feathered on both inner and outer edges.
      const distance=r-(174+(n-.5)*105);
      const envelope=Math.exp(-distance*distance/6500)*Math.min(1,Math.max(0,(r-112)/65));
      light=envelope*Math.pow(Math.max(0,n-.27),1.5)*.6;
      alpha=light;red=148+n*60;green=168+n*55;blue=204+n*42;
    }else{
      const angle=Math.atan2(y,x);
      const radialNoise=turbulence(Math.cos(angle)*120+r*.5,Math.sin(angle)*120+r*.3);
      const photon=Math.exp(-Math.abs(r-99)/1.6)*.8;
      const band=Math.max(0,r-101);
      const lens=r>100?Math.exp(-band/34)*(.5+n*.8)*(y<0?1.35:.23):0;
      const threads=.65+.35*Math.sin(r*2.6+radialNoise*15);
      const glow=Math.exp(-Math.abs(r-109)/42)*.12;
      light=photon+lens*threads+glow;
      // Front of the accretion disk crosses the lower part of the shadow.
      const diskY=y-24+x*.012;
      const thickness=7+Math.abs(x)*.022;
      const disk=Math.exp(-diskY*diskY/(thickness*thickness))*Math.exp(-Math.pow(Math.abs(x)/345,4))*(.4+n*.85);
      const strands=.55+.45*Math.sin(y*3+n*14);
      light+=disk*(.75+strands*.4);
      const warm=Math.min(1,disk*1.8);
      red=175+warm*70;green=212+warm*10;blue=255-warm*58;
      if(r<97){const emission=Math.min(1,disk*1.2);red=3+227*emission;green=5+213*emission;blue=13+193*emission;alpha=1;light=disk;}
      else alpha=Math.min(.95,light);
      const brightness=r<97?1:Math.min(1,.45+light*.65);
      red*=brightness;green*=brightness;blue*=brightness;
    }
    const edge=Math.min(1,Math.max(0,(395-r)/50));
    const i=(row*size+col)*4;data[i]=red;data[i+1]=green;data[i+2]=blue;data[i+3]=Math.round(Math.min(1,alpha)*edge*255);
  }
  ctx.putImageData(image,0,0);
  if(gas){const soft=document.createElement('canvas');soft.width=soft.height=size;const sc=soft.getContext('2d');sc.filter='blur(5px)';sc.drawImage(canvas,0,0);return soft;}
  return canvas;
}
