'use strict';
function route(){
 const at=location.hash==='#/atom';
 document.getElementById('landing').hidden=at;
 document.getElementById('simulation').hidden=!at;
 document.title=at?'Atomic structure | Simulations':'Simulations';
 window.scrollTo(0,0);
 // SVG metrics require visible text; remeasure after showing the simulation.
 if(at)requestAnimationFrame(()=>{
  if(typeof state!=='undefined' && state.orbitals.length){updateInfo(state.orbitals);updatePreviews(true);}
 });
}
window.addEventListener('hashchange',route);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',route);
else route();
