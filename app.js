'use strict';
/**
 * Atomic Structure — first browser port from the original C++ OpenGL application.
 * Self-contained: no remote libraries, tracking, logins or server APIs.
 * Sampling: radial hydrogenic |R_nl|² r² and angular |P_l^m|² sin(theta),
 * with approximate Slater-screened effective nuclear charges for multi-electron atoms.
 * These are illustrative independent-electron orbitals, not correlated wavefunctions.
 */

const ELEMENTS = [null,
 [1,1,'H','Hydrogen','ὕδωρ + γενής'],[2,4,'He','Helium','ἥλιος'],[3,7,'Li','Lithium','λίθος'],[4,9,'Be','Beryllium','βήρυλλος'],[5,11,'B','Boron','buraq'],[6,12,'C','Carbon','carbo'],[7,14,'N','Nitrogen','νίτρον + γενής'],[8,16,'O','Oxygen','ὀξύς + γενής'],[9,19,'F','Fluorine','fluere'],[10,20,'Ne','Neon','νέον'],
 [11,23,'Na','Sodium','soda · natrium'],[12,24,'Mg','Magnesium','Magnesia'],[13,27,'Al','Aluminium','alumen'],[14,28,'Si','Silicon','silex'],[15,31,'P','Phosphorus','φωσφόρος'],[16,32,'S','Sulfur','sulfur'],[17,35,'Cl','Chlorine','χλωρός'],[18,40,'Ar','Argon','ἀργόν'],[19,39,'K','Potassium','potash · kalium'],[20,40,'Ca','Calcium','calx'],
 [21,45,'Sc','Scandium','Scandia'],[22,48,'Ti','Titanium','Τιτᾶνες'],[23,51,'V','Vanadium','Vanadís'],[24,52,'Cr','Chromium','χρῶμα'],[25,55,'Mn','Manganese','Magnesia'],[26,56,'Fe','Iron','īsern · ferrum'],[27,59,'Co','Cobalt','Kobold'],[28,58,'Ni','Nickel','Kupfernickel'],[29,63,'Cu','Copper','cuprum'],[30,64,'Zn','Zinc','Zink'],
 [31,69,'Ga','Gallium','Gallia'],[32,74,'Ge','Germanium','Germania'],[33,75,'As','Arsenic','ἀρσενικόν'],[34,80,'Se','Selenium','Σελήνη'],[35,79,'Br','Bromine','βρῶμος'],[36,84,'Kr','Krypton','κρυπτός'],[37,85,'Rb','Rubidium','rubidus'],[38,88,'Sr','Strontium','Strontian'],[39,89,'Y','Yttrium','Ytterby'],[40,90,'Zr','Zirconium','zargun'],
 [41,93,'Nb','Niobium','Νιόβη'],[42,98,'Mo','Molybdenum','μόλυβδος'],[43,98,'Tc','Technetium','τεχνητός'],[44,102,'Ru','Ruthenium','Ruthenia'],[45,103,'Rh','Rhodium','ῥόδον'],[46,106,'Pd','Palladium','Pallas'],[47,107,'Ag','Silver','seolfor · argentum'],[48,114,'Cd','Cadmium','καδμεία'],[49,115,'In','Indium','indigo'],[50,120,'Sn','Tin','tin · stannum'],[51,121,'Sb','Antimony','stibium'],[52,130,'Te','Tellurium','Tellus'],[53,127,'I','Iodine','ἰώδης'],[54,132,'Xe','Xenon','ξένος']
];
// Selected illustrative reference lines (nm, relative display weight), not exhaustive
// and not derived from the Slater excitation model.
const SPECTRA = {"1":[[656.3,1.0],[486.1,0.75],[434.0,0.45],[410.2,0.3]],"2":[[388.9,0.25],[447.1,0.45],[471.3,0.25],[492.2,0.35],[501.6,0.3],[587.6,1.0],[667.8,0.45],[706.5,0.55]],"3":[[460.3,0.3],[610.4,0.45],[670.8,1.0]],"4":[[457.3,0.45],[469.0,0.3],[627.0,0.25]],"5":[[412.2,0.4],[420.0,0.35],[448.7,0.45],[494.0,0.3]],"6":[[426.7,0.55],[493.2,0.3],[505.2,0.35],[538.0,0.25],[658.8,0.45]],"7":[[399.5,0.35],[404.1,0.45],[410.0,0.4],[463.0,0.25],[500.5,0.35],[567.6,0.45],[648.2,0.3]],"8":[[436.8,0.35],[495.9,0.65],[500.7,0.85],[557.7,1.0],[630.0,0.55],[636.4,0.35],[777.2,0.45]],"9":[[685.6,0.35],[690.2,0.45],[703.7,0.4],[712.8,0.3]],"10":[[540.1,0.25],[585.2,1.0],[588.2,0.7],[594.5,0.85],[603.0,0.8],[607.4,0.65],[614.3,0.45],[621.7,0.45],[633.4,0.5],[640.2,0.45],[650.7,0.55],[659.9,0.45],[692.9,0.35],[703.2,0.4]],"11":[[568.3,0.25],[589.0,1.0],[589.6,1.0],[615.4,0.2]],"12":[[457.1,0.35],[470.3,0.25],[516.7,0.7],[517.3,0.95],[518.4,1.0]],"13":[[394.4,0.7],[396.1,0.65],[466.3,0.25],[669.6,0.35]],"14":[[390.6,0.35],[410.3,0.3],[504.1,0.45],[634.7,0.35]],"15":[[405.0,0.3],[534.5,0.4],[602.4,0.25]],"16":[[469.4,0.25],[545.4,0.4],[564.0,0.5],[674.3,0.35]],"17":[[479.5,0.35],[481.0,0.3],[725.7,0.35],[741.4,0.3],[754.7,0.25]],"18":[[415.9,0.35],[420.1,0.3],[427.2,0.45],[451.1,0.3],[476.5,0.35],[488.0,0.4],[696.5,1.0],[706.7,0.85],[738.4,0.6],[750.4,0.65],[763.5,0.5]],"19":[[404.4,0.45],[404.7,0.4],[766.5,1.0],[769.9,0.95]],"20":[[422.7,1.0],[443.5,0.25],[558.9,0.2],[616.2,0.3],[643.9,0.25]],"22":[[453.3,0.35],[498.1,0.3],[499.1,0.3],[501.4,0.3]],"23":[[437.9,0.35],[438.4,0.35],[440.8,0.3],[573.7,0.25],[608.1,0.25]],"24":[[425.4,0.4],[427.5,0.45],[520.6,0.3],[520.8,0.35],[540.9,0.25]],"25":[[403.1,0.85],[403.3,1.0],[403.4,0.9],[475.4,0.35],[482.3,0.3],[601.3,0.25],[602.2,0.25]],"26":[[404.6,0.35],[438.4,0.45],[495.8,0.25],[526.9,0.3],[532.8,0.25]],"27":[[399.5,0.35],[411.9,0.3],[486.7,0.25],[521.3,0.3],[536.9,0.25]],"28":[[471.5,0.35],[547.7,0.25],[574.9,0.25],[617.7,0.25]],"29":[[510.6,0.45],[515.3,0.4],[521.8,0.35],[578.2,0.3]],"30":[[468.0,0.45],[472.2,0.4],[481.1,0.35],[636.2,0.45]],"31":[[403.298,0.5],[417.204,1.0],[639.656,0.22],[641.345,0.18]],"32":[[474.181,1.0],[481.461,1.0],[589.339,1.0],[602.104,0.55]],"33":[[419.008,0.8],[445.847,0.8],[446.635,0.8],[449.423,0.95],[450.766,0.95],[454.348,0.8],[617.027,0.55]],"34":[[417.528,0.8],[418.09,1.0],[473.078,0.6],[484.494,0.8],[522.753,1.0],[530.535,0.8],[605.584,1.0],[644.429,0.8],[706.207,0.3]],"35":[[444.174,0.25],[447.261,0.25],[447.772,0.4],[452.559,0.35],[614.86,0.65],[635.073,1.0],[655.98,0.85],[663.162,0.85],[751.296,0.65]],"36":[[427.4,0.3],[431.9,0.25],[557.0,0.35],[587.1,0.25],[760.2,0.35]],"37":[[420.18,0.55],[421.553,0.35],[543.153,0.18],[607.076,0.18],[740.817,0.22],[761.893,0.22],[775.765,0.3],[780.0,1.0]],"38":[[460.733,1.0],[496.226,0.55],[548.084,0.5],[640.847,0.6],[650.4,0.45],[687.838,0.4],[707.01,0.45]],"39":[[407.736,0.9],[410.236,1.0],[412.83,0.9],[414.284,0.8],[464.37,0.3],[467.485,0.3],[602.427,0.2],[619.172,0.25],[643.502,0.2]],"40":[[383.596,0.75],[386.387,1.0],[389.032,1.0],[389.138,0.8],[402.72,0.45],[405.503,0.35]],"41":[[405.894,1.0],[407.973,0.8],[410.092,0.45],[412.381,0.35],[415.258,0.35],[416.366,0.35],[460.677,0.25],[507.896,0.18],[666.084,0.15]],"42":[[550.6,0.35],[553.3,0.4],[557.0,0.45],[603.0,0.3]],"43":[[394.657,0.4],[398.497,0.5],[403.163,1.0],[404.911,0.5],[408.871,0.5],[409.567,0.7],[411.508,0.5],[416.561,0.5]],"44":[[408.06,0.7],[419.989,1.0],[421.206,0.7],[429.771,0.45],[455.451,0.7],[470.948,0.3],[517.103,0.2],[563.623,0.12]],"45":[[385.652,1.0],[395.886,0.67],[412.887,0.3],[413.527,0.35],[421.114,0.67],[437.48,0.67],[535.44,0.18],[559.942,0.18],[598.36,0.18]],"46":[[389.42,0.9],[421.295,1.0]],"47":[[381.094,0.25],[398.158,0.15],[405.548,0.15],[421.096,0.15],[421.281,0.15],[487.41,0.15],[520.908,1.0],[546.55,1.0],[768.777,0.4]],"48":[[467.815,0.2],[479.991,0.3],[508.582,0.5],[609.914,0.3],[643.847,1.0],[734.567,0.5]],"49":[[410.175,0.9],[451.13,1.0],[570.991,0.15],[572.768,0.15]],"50":[[380.101,0.75],[452.473,0.55],[563.168,0.35],[605.467,0.25],[606.912,0.3],[614.96,0.3]],"51":[[471.168,0.4],[556.812,0.8],[563.977,0.4],[600.557,1.0],[607.967,0.4],[613.0,0.6]],"52":[[400.652,0.3],[416.977,0.5],[426.111,0.5],[436.4,0.8],[447.863,0.8],[455.778,0.5],[465.437,0.9],[468.691,1.0],[483.128,0.8],[486.624,1.0],[557.635,0.8],[564.926,0.8],[570.812,1.0]],"53":[[511.929,1.0],[661.966,0.55],[740.206,0.55]],"54":[[473.415,1.0],[480.702,0.8],[491.651,0.8],[492.315,0.8],[502.828,0.35],[539.28,0.2],[556.662,0.2],[582.389,0.5],[618.242,0.5],[631.806,0.8],[646.97,0.5],[688.216,0.5],[711.96,0.8],[758.468,0.3],[764.202,0.8]]};

const FILL = [[1,0],[2,0],[2,1],[3,0],[3,1],[4,0],[3,2],[4,1],[5,0],[4,2],[5,1],[6,0],[4,3],[5,2],[6,1]];
const LETTER = ['s','p','d','f'];
const $ = (id)=>document.getElementById(id);
const state = {
  z:18, budget:30000, orbitals:[], clouds:[], previewClouds:[], previewFit:[], main:[], fit:1, azimuth:.63, elevation:0, zoom:1,
  rotate:true, cutaway:false, dragging:false, pointerId:null, lastX:0,lastY:0,
  excitation:null, lastTime:performance.now(), lastPreviewTime:0, buildId:0, rendering:false
};
const clamp = (x, a, b) => Math.min(b, Math.max(a,x));
const shuffle = a => {for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
function subshellSet(orbitals,n,l,count){
  const kept=orbitals.filter(o=>!(o.n===n&&o.l===l)); const countO=2*l+1;const occ=new Array(countO).fill(0);
  for(let i=0;i<Math.min(count,2*countO);i++)occ[i%countO]++;
  for(let i=0;i<countO;i++)if(occ[i])kept.push({n,l,m:i-l,occ:occ[i],zeff:1});
  return kept;
}
function slaterZeff(z,t,os){
  let shielding=0;
  if(t.n===1&&t.l===0){const same=os.filter(o=>o.n===1&&o.l===0).reduce((a,o)=>a+o.occ,0); shielding=.30*Math.max(0,same-1);}
  else if(t.l<=1){let same=0,prev=0,inner=0;
    for(const o of os){if(o.n===t.n&&o.l<=1)same+=o.occ;else if(o.n===t.n-1&&o.l<=1)prev+=o.occ;else if(o.n<=t.n-2||(o.n===t.n-1&&o.l>=2))inner+=o.occ;}
    shielding=.35*Math.max(0,same-1)+.85*prev+inner;
  }else{let same=0,inner=0; for(const o of os){if(o.n===t.n&&o.l===t.l)same+=o.occ;else if(o.n<t.n||(o.n===t.n&&o.l<t.l))inner+=o.occ;}shielding=.35*Math.max(0,same-1)+inner;}
  return Math.max(.1,z-shielding);
}
function groundState(z){let left=z,os=[];for(const[n,l]of FILL){if(!left)break;const count=Math.min(left,2*(2*l+1));os=subshellSet(os,n,l,count);left-=count;}
  const exceptions={24:[[3,2,5],[4,0,1]],29:[[3,2,10],[4,0,1]],41:[[4,2,4],[5,0,1]],42:[[4,2,5],[5,0,1]],44:[[4,2,7],[5,0,1]],45:[[4,2,8],[5,0,1]],46:[[4,2,10],[5,0,0]],47:[[4,2,10],[5,0,1]]};
  for(const[n,l,count]of(exceptions[z]||[]))os=subshellSet(os,n,l,count);
  return withShielding(z,os);
}
function withShielding(z,os){return os.map(o=>({...o,zeff:slaterZeff(z,o,os)}));}
function orbitalOrder(o){return [(o.n+o.l),o.n,o.l,o.m];}
function ordered(os){return os.slice().sort((a,b)=>{const A=orbitalOrder(a),B=orbitalOrder(b);for(let i=0;i<A.length;i++)if(A[i]!==B[i])return A[i]-B[i];return 0;});}
// C++ differentiating-electron convention: use the last occupied *subshell*,
// then apply Hund filling order. Taking the last stored orbital is incorrect
// for partially paired p/d subshells (e.g. cobalt 3d7 -> m=-1, spin=-1/2).
function diffQuantum(os){
 if(!os.length)return {n:0,l:0,m:0,spin:.5};
 let choice=null;
 for(const o of os){if(!choice || o.n+o.l>choice.n+choice.l || (o.n+o.l===choice.n+choice.l&&o.n>choice.n))choice=o;}
 const total=os.filter(o=>o.n===choice.n&&o.l===choice.l).reduce((a,o)=>a+o.occ,0);
 const spatial=2*choice.l+1;
 return {n:choice.n,l:choice.l,m:((total-1)%spatial)-choice.l,spin:total<=spatial?.5:-.5};
}
function configurationHTML(os){const subs=new Map();for(const o of os){const key=`${o.n},${o.l}`;if(!subs.has(key))subs.set(key,{n:o.n,l:o.l,k:0});subs.get(key).k+=o.occ;}
  return [...subs.values()].sort((a,b)=>(a.n+a.l)-(b.n+b.l)||a.n-b.n).map(v=>`${v.n}${LETTER[v.l]}<sup>${v.k}</sup>`).join(' ');
}
// Generalised Laguerre L_k^alpha(x), computed by recurrence.
function laguerre(k,a,x){if(k===0)return 1;let lm2=1,lm1=1+a-x;if(k===1)return lm1;for(let j=2;j<=k;j++){const L=((2*j-1+a-x)*lm1-(j-1+a)*lm2)/j;lm2=lm1;lm1=L;}return lm1;}
// Associated Legendre P_l^|m|(cos(theta)).
function legendre(l,m,x){m=Math.abs(m);let pmm=1;if(m){const sx=Math.sqrt(Math.max(0,(1-x)*(1+x)));let f=1;for(let j=1;j<=m;j++){pmm*=-f*sx;f+=2;}}if(l===m)return pmm;let pm1=x*(2*m+1)*pmm;if(l===m+1)return pm1;for(let ll=m+2;ll<=l;ll++){const next=((2*ll-1)*x*pm1-(ll+m-1)*pmm)/(ll-m);pmm=pm1;pm1=next;}return pm1;}
const radialCache=new Map(),thetaCache=new Map();
function makeCDF(pdf){let sum=0;const cdf=new Float64Array(pdf.length);for(let i=0;i<pdf.length;i++){sum+=Math.max(0,pdf[i]);cdf[i]=sum;}if(sum>0)for(let i=0;i<cdf.length;i++)cdf[i]/=sum;return cdf;}
function getRadial(o){const key=`${o.n}/${o.l}/${o.zeff.toFixed(4)}`;if(radialCache.has(key))return radialCache.get(key);
  const count=1024,maxR=10*o.n*o.n/o.zeff,pdf=new Float64Array(count);
  for(let i=0;i<count;i++){const r=i*maxR/(count-1),rho=2*o.zeff*r/o.n;const L=laguerre(o.n-o.l-1,2*o.l+1,rho);const amplitude=Math.exp(-rho/2)*Math.pow(rho,o.l)*L;pdf[i]=r*r*amplitude*amplitude;}
  const data={cdf:makeCDF(pdf),max:maxR};radialCache.set(key,data);return data;
}
function getTheta(o){const key=`${o.l}/${Math.abs(o.m)}`;if(thetaCache.has(key))return thetaCache.get(key);const count=512,pdf=new Float64Array(count);
  for(let i=0;i<count;i++){const theta=Math.PI*i/(count-1),p=legendre(o.l,o.m,Math.cos(theta));pdf[i]=Math.sin(theta)*p*p;}
  const cdf=makeCDF(pdf);thetaCache.set(key,cdf);return cdf;
}
function inverseCDF(cdf){const u=Math.random();let lo=0,hi=cdf.length-1;while(lo<hi){const mid=(lo+hi)>>>1;if(cdf[mid]<u)lo=mid+1;else hi=mid;}return lo/(cdf.length-1);}
const stops=[[90,18,166],[150,25,207],[235,33,188],[249,97,121],[255,177,90],[249,242,226]];
const FIRE_STOPS=[[0,0,0],[.5,0,.99],[.8,0,0],[1,.5,0],[1,1,0],[1,1,1]];
function factorial(n){let a=1;for(let i=2;i<=n;i++)a*=i;return a;}
function particleColor(r,o,theta){
  // Direct port of the C++ heatmap_fire()/inferno() model.
  const zeff=Math.max(.1,o.zeff),rho=2*zeff*r/o.n;
  const L=laguerre(o.n-o.l-1,2*o.l+1,rho);
  const norm=Math.pow(2*zeff/o.n,3)*factorial(o.n-o.l-1)/(2*o.n*factorial(o.n+o.l));
  const R=Math.sqrt(norm)*Math.exp(-rho/2)*Math.pow(rho,o.l)*L;
  const angular=Math.pow(legendre(o.l,o.m,Math.cos(theta)),2);
  const intensity=(R*R*angular)/Math.pow(zeff,3);
  const v=clamp(intensity*1.5*Math.pow(5,o.n),0,1),scaled=v*5,i=Math.min(4,Math.floor(scaled)),f=scaled-i;
  const first=FIRE_STOPS[i],second=FIRE_STOPS[i+1];
  return [0,1,2].map(k=>Math.round(255*(first[k]*(1-f)+second[k]*f)));
}
function orbitalCloud(o,count){const rad=getRadial(o),thetaCDF=getTheta(o),points=new Array(count);
  for(let i=0;i<count;i++){
    const r=inverseCDF(rad.cdf)*rad.max,theta=inverseCDF(thetaCDF)*Math.PI,phi=2*Math.PI*Math.random(),sin=Math.sin(theta);
    const col=particleColor(r,o,theta);
    points[i]={x:r*sin*Math.cos(phi),y:r*Math.cos(theta),z:r*sin*Math.sin(phi),c:col,o};
  }return points;
}
function cloudsFor(os,budget){const electrons=os.reduce((t,o)=>t+o.occ,0);const cloudGroups=[];const all=[];
 for(const o of os){const n=Math.max(100,Math.round(budget*o.occ/electrons));const cloud=orbitalCloud(o,n);cloudGroups.push(cloud);all.push(...cloud);}
 return{groups:cloudGroups,points:shuffle(all)};
}
// Match the C++ percentile-based fit: padding belongs in the camera distance,
// not in both the sampled radius and camera distance.
function fitRadius(points,quantile=.985){
 if(!points.length)return 1;
 const distances=points.map(p=>Math.hypot(p.x,p.y,p.z)).sort((a,b)=>a-b);
 return Math.max(.001,distances[Math.floor((distances.length-1)*quantile)]);
}

const mainCanvas=$('atomCanvas'),mainCtx=mainCanvas.getContext('2d',{alpha:false});
const FADE_SECONDS=.60, HOLD_SECONDS=2.0;
const orbitalKey=o=>`${o.n}/${o.l}/${o.m}`;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
let atomicGPU=null;
try{atomicGPU=new AtomGPU($('gpuCanvas'));}catch(e){console.warn('WebGL unavailable, using Canvas fallback',e);$('gpuCanvas').hidden=true;document.body.classList.add('canvas-fallback');}
function resizeCanvas(canvas,maxDpr=2){const box=canvas.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,maxDpr);const w=Math.max(2,Math.round(box.width*dpr)),h=Math.max(2,Math.round(box.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}return {w,h,dpr};}
function projectPoint(p,az,el,scale,cx,cy){
  // Rotate model about vertical y and tilt about x (camera-view equivalent).
  const cos=Math.cos(az),sin=Math.sin(az),ce=Math.cos(el),se=Math.sin(el);
  const xx=p.x*cos-p.z*sin,zz=p.x*sin+p.z*cos;
  const yy=p.y*ce-zz*se,depth=p.y*se+zz*ce;
  const perspective=1/(1+depth/(scale*14));
  return [cx+(xx/scale)*perspective,cy-(yy/scale)*perspective];
}
// Canvas fallback retains the actual inferno() heat-map colours rather than
// collapsing them into five bright magenta/pink buckets. WebGL is preferred.
function renderCloud(ctx,points,az,el,scale,cx,cy,size=1.2,alpha=1,cutaway=false){
 if(!points||!points.length||alpha<=0)return;
 const groups=new Map();
 const stride=points.length>52000?2:(size<1.22?4:1);
 const preview=size<1.22;const gamma=preview?.60:.52,gain=preview?1.08:1.12;
 for(let i=0;i<points.length;i+=stride){
   const p=points[i];if(cutaway&&p.z>0)continue;
   const [x,y]=projectPoint(p,az,el,scale,cx,cy);
   if(!Number.isFinite(x)||!Number.isFinite(y))continue;
   // Quantise display-corrected RGB into a few dozen palette bins, not
   // arbitrary categories. This preserves faint purple/red/orange samples.
   const c=p.c;
   const channel=val=>Math.min(255,Math.round(Math.pow(val/255,gamma)*gain*255/16)*16);
   const key=`${channel(c[0])},${channel(c[1])},${channel(c[2])}`;
   if(!groups.has(key))groups.set(key,[]);
   groups.get(key).push(x,y);
 }
 ctx.globalAlpha=alpha;
 for(const[color,coords]of groups){ctx.fillStyle=`rgb(${color})`;
   for(let k=0;k<coords.length;k+=2)ctx.fillRect(coords[k],coords[k+1],size,size);
 }
 ctx.globalAlpha=1;
}
function currentDisplay(){if(!state.excitation)return {from:state.main,fromFit:state.fit,to:null,t:0};const e=state.excitation;const elapsed=(performance.now()-e.start)/1000;let t=0;
 if(elapsed<FADE_SECONDS)t=smooth(elapsed/FADE_SECONDS);else if(elapsed<FADE_SECONDS+HOLD_SECONDS)t=1;else if(elapsed<FADE_SECONDS*2+HOLD_SECONDS)t=1-smooth((elapsed-FADE_SECONDS-HOLD_SECONDS)/FADE_SECONDS);
 else {state.excitation=null;hideHoverOrbital();closeOrbitalModal();$('exciteBtn').disabled=false;$('excitationStatus').textContent='Ready';updateInfo(state.orbitals);rebuildGallery();return{from:state.main,fromFit:state.fit,to:null,t:0};}
 if(elapsed>=FADE_SECONDS&&elapsed<FADE_SECONDS+HOLD_SECONDS&&!e.infoUpdated){updateInfo(e.orbitals);e.infoUpdated=true;}
 if(elapsed>=FADE_SECONDS+HOLD_SECONDS&&e.infoUpdated){updateInfo(state.orbitals);e.infoUpdated=false;}
 return {from:e.base,fromFit:e.fit,to:e.points,t,exc:e};
}
function paintMain(){const {w,h}=resizeCanvas(mainCanvas);mainCtx.fillStyle='#050507';mainCtx.fillRect(0,0,w,h);
 const display=currentDisplay(),fit=display.to?display.fromFit*(1-display.t)+display.exc.excFit*display.t:display.fromFit;
 const scale=fit / (Math.min(w,h)*.36*state.zoom), size=window.innerWidth<600?1.1:1.25;
 if(display.to){renderCloud(mainCtx,display.from,state.azimuth,state.elevation,scale,w/2,h/2,size,1-display.t,state.cutaway);renderCloud(mainCtx,display.to,state.azimuth,state.elevation,scale,w/2,h/2,size,display.t,state.cutaway);}
 else renderCloud(mainCtx,display.from,state.azimuth,state.elevation,scale,w/2,h/2,size,1,state.cutaway);
 updateExcitationReadout(display);
}
function drawMini(canvas,points,az,el){const {w,h}=resizeCanvas(canvas,1.6),ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
 const fit=fitRadius(points),scale=fit/(Math.min(w,h)*.39);renderCloud(ctx,points,az,el,scale,w/2,h/2,1.02,1);
}
function updatePreviews(force=false){if(!force&&performance.now()-state.lastPreviewTime<800)return;state.lastPreviewTime=performance.now();document.querySelectorAll('.slot').forEach(slot=>{const canvas=slot.querySelector('canvas');const points=activeOrbitalPoints(slot);if(points.length)drawMini(canvas,points,state.azimuth,state.elevation);});}
function rebuildGallery(){
 const mounts=['topOrbital','sideOrbitals','bottomOrbitals','largeOrbitals'];for(const id of mounts)$(id).replaceChildren();
 // Include a newly occupied orbital while the cloud dissolves into an excited configuration.
 const all=new Map(state.orbitals.map(o=>[orbitalKey(o),o]));
 if(state.excitation)for(const o of state.excitation.orbitals)all.set(orbitalKey(o),o);
 const os=ordered([...all.values()]);
 const groundIndices=new Map(state.orbitals.map((o,i)=>[orbitalKey(o),i]));
 const excitedIndices=new Map((state.excitation?.orbitals||[]).map((o,i)=>[orbitalKey(o),i]));
 os.forEach((o,i)=>{
  const slot=document.createElement('div');slot.className='slot';slot.dataset.key=orbitalKey(o);
  slot.dataset.ground=String(groundIndices.get(orbitalKey(o))??-1);
  slot.dataset.excited=String(excitedIndices.get(orbitalKey(o))??-1);
  slot.tabIndex=0;slot.setAttribute('role','button');slot.setAttribute('aria-label',`Enlarge ${o.n}${LETTER[o.l]} orbital, m = ${o.m}`);
  const canvas=document.createElement('canvas');canvas.dataset.index=slot.dataset.ground;canvas.setAttribute('aria-hidden','true');slot.append(canvas);
  const target=i===0?'topOrbital':i<=4?'sideOrbitals':i<=8?'bottomOrbitals':'largeOrbitals';$(target).append(slot);
  slot.addEventListener('pointerenter',e=>showHoverOrbital(e,slot));
  slot.addEventListener('pointermove',e=>positionHover(e));
  slot.addEventListener('pointerleave',hideHoverOrbital);
  slot.addEventListener('click',()=>openOrbitalModal(slot));
  slot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openOrbitalModal(slot);}});
 });
 const extra=Math.max(0,os.length-9);
 $('largeOrbitals').style.gridTemplateColumns='';$('largeOrbitals').style.gridTemplateRows='';$('largeOrbitals').style.gridAutoRows='';
 if(extra){
   // Mirror the original C++ adaptiveGridSlot(): select columns by
   // the actual panel aspect ratio, NOT by sqrt(number of orbitals).
   // In a tall narrow panel, manganese's six extra orbitals belong
   // in ONE vertical column, not an arbitrarily cramped 3 x 2 grid.
   const panel=$('largeOrbitals');
   const width=panel.clientWidth || 170;
   const height=panel.clientHeight || 589;
   let cols=1, bestScore=Infinity;
   for(let candidate=1;candidate<=extra;candidate++){
     const rows=Math.ceil(extra/candidate);
     const cellW=width/candidate, cellH=height/rows;
     const score=Math.abs(cellW-cellH)/Math.max(cellW,cellH);
     if(score<bestScore){bestScore=score;cols=candidate;}
   }
   const rows=Math.ceil(extra/cols);
   panel.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;
   panel.style.gridTemplateRows=`repeat(${rows},minmax(0,1fr))`;
 }
 $('orbitalCount').textContent=`${os.length} spatial orbitals`;
 if(!atomicGPU)updatePreviews(true);
}
function updateExcitationReadout(display){
 const readout=$('excitationReadout');
 if(!display.exc){readout.replaceChildren();readout.style.opacity='0';return;}
 if(readout.dataset.label!==display.exc.label){
  readout.replaceChildren();readout.dataset.label=display.exc.label;
  for(const [i,s] of display.exc.label.split('\n').entries()){
   const line=document.createElement('div');line.textContent=s;line.style.color=i===0?'#fff':'#c4c4c4';readout.append(line);
  }
 }
 readout.style.opacity=String(display.t);
}
function activeOrbitalPoints(slot){
 if(!slot)return[];const excited=Number(slot.dataset.excited),ground=Number(slot.dataset.ground);
 const useExcited=state.excitation&&state.excitation.infoUpdated&&excited>=0;
 if(useExcited)return state.excitation.previewClouds?.[excited]||[];
 if(ground>=0)return state.previewClouds?.[ground]||state.clouds?.[ground]||[];
 if(excited>=0)return state.excitation?.previewClouds?.[excited]||[];
 return[];
}
function orbitalLabel(slot){const [n,l,m]=slot.dataset.key.split('/').map(Number);return `${n}${LETTER[l]} orbital · m = ${m}`;}
function positionHover(event){const pop=$('orbitalHover');if(pop.hidden)return;
 const left=Math.max(10,Math.min(window.innerWidth-250,event.clientX+18));
 const top=Math.max(10,Math.min(window.innerHeight-275,event.clientY-90));
 pop.style.left=left+'px';pop.style.top=top+'px';
}
let hoveredOrbital=null,zoomedOrbital=null,modalAz=.63,modalEl=.17;
function showHoverOrbital(event,slot){if(!$('orbitalModal').hidden||matchMedia('(hover:none)').matches)return;
 hoveredOrbital=slot;const pop=$('orbitalHover');pop.hidden=false;
 $('orbitalHoverLabel').textContent=orbitalLabel(slot);positionHover(event);
 drawMini($('orbitalHoverCanvas'),activeOrbitalPoints(slot),state.azimuth,state.elevation);
}
function hideHoverOrbital(){hoveredOrbital=null;$('orbitalHover').hidden=true;}
function openOrbitalModal(slot){hideHoverOrbital();zoomedOrbital=slot;modalAz=state.azimuth;modalEl=state.elevation;
 $('orbitalModalTitle').textContent=orbitalLabel(slot);$('orbitalModal').hidden=false;
 drawMini($('orbitalZoomCanvas'),activeOrbitalPoints(slot),modalAz,modalEl);
}
function closeOrbitalModal(){$('orbitalModal').hidden=true;zoomedOrbital=null;}
function colorForWavelength(w){if(w<380||w>780)return '#999';if(w<440)return '#8b44ed';if(w<490)return '#387ef7';if(w<510)return '#19d4ed';if(w<550)return '#28f0a7';if(w<590)return '#e6ed43';if(w<620)return '#ffb243';return '#f55b59';}
function updateSpectrum(z){const spec=$('spectrum');spec.replaceChildren();const lines=SPECTRA[z]||[];
 if(!lines.length){spec.title='No curated reference lines for this element yet. The orbital model is still available.';const txt=document.createElement('span');txt.className='spectrum-unavailable';txt.textContent='—';txt.style.cssText='position:absolute;top:50%;left:25%;color:#5c5265';spec.append(txt);return;}
 spec.title='Illustrative selected reference emission wavelengths; strengths are display weights';
 for(const[w,strength]of lines){if(w<380||w>780)continue;const line=document.createElement('div');line.className='spectrum-line';line.style.top=`${((780-w)/400)*100}%`;line.style.height=`${1+1.2*strength}px`;line.style.color=colorForWavelength(w);line.style.background='currentColor';line.title=`${w.toFixed(1)} nm`;spec.append(line);}
}
function updateInfo(os){
 const e=ELEMENTS[state.z];const q=diffQuantum(os);
 window.renderElementOverlay?.(e,os,q);
 $('panelElementLabel').textContent=`${e[3].toUpperCase()} / Z = ${state.z}`;
}
function selectElement(z){const next=clamp(Math.round(Number(z)||1),1,54);state.z=next;state.excitation=null;$('exciteBtn').disabled=false;$('excitationReadout').style.opacity='0';$('excitationStatus').textContent='Building probability density…';
 $('atomicNumber').value=String(next);$('elementSelect').value=String(next);$('atomicNumberDisplay').textContent=String(next);document.querySelectorAll('[data-element]').forEach(b=>b.classList.toggle('active',Number(b.dataset.element)===next));
 const id=++state.buildId;
 requestAnimationFrame(()=>{
  if(id!==state.buildId)return;
  state.orbitals=groundState(next);const {groups,points}=cloudsFor(state.orbitals,state.budget);state.clouds=groups;state.main=points;state.fit=fitRadius(points);
  if(atomicGPU){state.previewClouds=state.orbitals.map(o=>orbitalCloud(o,9000));state.previewFit=state.previewClouds.map(points=>fitRadius(points,.980));atomicGPU.setGround(points,state.previewClouds);}
  updateInfo(state.orbitals);updateSpectrum(next);rebuildGallery();$('excitationStatus').textContent='Ready';
 });
}
function getExcitation(os){const q=diffQuantum(os);const source=os.find(o=>o.n===q.n&&o.l===q.l&&o.m===q.m);if(!source)return null;const from=os.indexOf(source);
 let n=source.l===0?Math.max(2,source.n):source.n+1;
 let l=source.l===0?1:source.l-1;
 if(n>7)return null;
 const candidates=[source.m,source.m-1,source.m+1].filter(m=>Math.abs(m)<=l);let m=null;
 for(const c of candidates){const dest=os.find(o=>o.n===n&&o.l===l&&o.m===c);if(!dest||dest.occ<2){m=c;break;}}
 if(m===null)return null;
 const excited=os.map(o=>({...o}));excited[from].occ--;
 if(excited[from].occ===0)excited.splice(from,1);
 const dest=excited.find(o=>o.n===n&&o.l===l&&o.m===m);
 if(dest)dest.occ++;else excited.push({n,l,m,occ:1,zeff:1});
 const final=withShielding(state.z,excited);
 const originalEnergy=-13.605693*source.zeff**2/source.n**2;
 const target=final.find(o=>o.n===n&&o.l===l&&o.m===m);
 const finalEnergy=-13.605693*target.zeff**2/n**2;
 const delta=state.z===1?13.605693*(1/source.n**2-1/n**2):finalEnergy-originalEnergy;
 let label=`${source.n}${LETTER[source.l]} → ${n}${LETTER[l]}`;
 if(delta>0){const lambda=1239.841984/delta;label+=state.z===1?`\nλ = ${lambda.toFixed(1)} nm\nEγ = ${delta.toFixed(2)} eV`:`\nλ(model) ≈ ${lambda.toFixed(1)} nm\nEγ(model) ≈ ${delta.toFixed(2)} eV`;
 }else label+='\nNo positive ΔE from simple model';
 return{orbitals:final,label};
}
function excite(){if(state.excitation||!state.orbitals.length)return;const next=getExcitation(state.orbitals);if(!next){$('excitationStatus').textContent='No simple transition available for this state';return;}
 const newCloud=cloudsFor(next.orbitals,state.budget);
 const nextPreviewClouds=next.orbitals.map(o=>orbitalCloud(o,9000));
 if(atomicGPU)atomicGPU.setExcited(newCloud.points,nextPreviewClouds);
 state.excitation={start:performance.now(),base:state.main,fit:state.fit,points:newCloud.points,excFit:fitRadius(newCloud.points),orbitals:next.orbitals,previewClouds:nextPreviewClouds,previewFit:nextPreviewClouds.map(points=>fitRadius(points,.980)),label:next.label,infoUpdated:false};
 rebuildGallery();$('exciteBtn').disabled=true;$('excitationStatus').textContent='Excited-state animation in progress…';
}
function frame(now){if(location.hash!=='#/atom'){state.lastTime=now;requestAnimationFrame(frame);return;}const dt=Math.min(.08,(now-state.lastTime)/1000);state.lastTime=now;
 if(state.rotate&&!state.dragging)state.azimuth=(state.azimuth+dt*2*Math.PI/28)%(Math.PI*2);
 if(atomicGPU){const display=currentDisplay();atomicGPU.render(display,state);updateExcitationReadout(display);}else{paintMain();updatePreviews();}
 if(zoomedOrbital&&now-(state.lastModalTime||0)>55){state.lastModalTime=now;drawMini($('orbitalZoomCanvas'),activeOrbitalPoints(zoomedOrbital),modalAz,modalEl);}
 requestAnimationFrame(frame);
}
function init(){for(let z=1;z<=54;z++){const o=document.createElement('option');o.value=String(z);o.textContent=`${z} · ${ELEMENTS[z][3]} (${ELEMENTS[z][2]})`;$('elementSelect').append(o);}
 $('elementSelect').addEventListener('change',e=>selectElement(e.target.value));$('atomicNumber').addEventListener('input',e=>selectElement(e.target.value));
 document.querySelectorAll('[data-element]').forEach(b=>b.addEventListener('click',()=>selectElement(b.dataset.element)));
 $('sampleSlider').addEventListener('change',e=>{state.budget=Number(e.target.value);$('detailValue').textContent=state.budget.toLocaleString();selectElement(state.z);});
 $('sampleSlider').addEventListener('input',e=>$('detailValue').textContent=Number(e.target.value).toLocaleString());
 $('rotateToggle').addEventListener('change',e=>state.rotate=e.target.checked);
 $('cutawayToggle').addEventListener('change',e=>state.cutaway=e.target.checked);
 $('resetView').addEventListener('click',()=>{state.azimuth=.63;state.elevation=0;state.zoom=1;});
 $('exciteBtn').addEventListener('click',excite);
 $('orbitalClose').addEventListener('click',closeOrbitalModal);
 $('orbitalModal').addEventListener('click',e=>{if(e.target===$('orbitalModal'))closeOrbitalModal();});
 let modalDragging=false,modalLastX=0,modalLastY=0;
 $('orbitalZoomCanvas').addEventListener('pointerdown',e=>{modalDragging=true;modalLastX=e.clientX;modalLastY=e.clientY;$('orbitalZoomCanvas').setPointerCapture(e.pointerId);});
 $('orbitalZoomCanvas').addEventListener('pointermove',e=>{if(!modalDragging)return;modalAz+=(e.clientX-modalLastX)*.010;modalEl=clamp(modalEl-(e.clientY-modalLastY)*.010,-1.45,1.45);modalLastX=e.clientX;modalLastY=e.clientY;});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])$('orbitalZoomCanvas').addEventListener(type,()=>modalDragging=false);
 $('fullscreen').addEventListener('click',()=>{if(!document.fullscreenElement){document.documentElement.requestFullscreen?.().catch(()=>{});}else document.exitFullscreen?.();});
 mainCanvas.addEventListener('pointerdown',e=>{state.dragging=true;state.pointerId=e.pointerId;state.lastX=e.clientX;state.lastY=e.clientY;mainCanvas.setPointerCapture?.(e.pointerId);});
 mainCanvas.addEventListener('pointermove',e=>{if(!state.dragging)return;state.azimuth+=(e.clientX-state.lastX)*.009;state.elevation=clamp(state.elevation-(e.clientY-state.lastY)*.009,-1.45,1.45);state.lastX=e.clientX;state.lastY=e.clientY;});
 for(const type of['pointerup','pointercancel','lostpointercapture'])mainCanvas.addEventListener(type,()=>{state.dragging=false;state.pointerId=null;});
 mainCanvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=clamp(state.zoom*(e.deltaY>0?.92:1.08),.5,2.6);},{passive:false});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeOrbitalModal();return;}if(!$('orbitalModal').hidden)return;const active=document.activeElement;if(['INPUT','SELECT','TEXTAREA'].includes(active?.tagName))return;if(e.key==='ArrowLeft'){e.preventDefault();selectElement(state.z-1);}else if(e.key==='ArrowRight'){e.preventDefault();selectElement(state.z+1);}else if(e.code==='Space'){e.preventDefault();excite();}});
 window.addEventListener('resize',()=>updatePreviews(true));
 selectElement(18);requestAnimationFrame(frame);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
