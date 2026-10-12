'use strict';
// Exact design-space typography derived from the 1178x1088 C++ projector layout.
// This layer scales with the original model. No flowing HTML text is used inside it.
(() => {
  const NS='http://www.w3.org/2000/svg';
  const root=document.getElementById('infoOverlay');
  const symbolGroup=document.getElementById('elementSvg');
  const quantumGroup=document.getElementById('quantumSvg');
  const svg=(type,attributes={})=>{const n=document.createElementNS(NS,type);for(const [k,v] of Object.entries(attributes))n.setAttribute(k,String(v));return n;};
  function txt(group,value,x,y,size,options={}){
    const attrs={x,y,'font-size':size,'font-style':options.italic?'italic':'normal'};
    if(options.anchor) attrs['text-anchor']=options.anchor;
    if(options.className) attrs['class']=options.className;
    const el=svg('text',attrs);el.textContent=String(value);group.appendChild(el);return el;
  }
  function line(g,x1,y1,x2,y2){g.appendChild(svg('line',{x1,y1,x2,y2,stroke:'#777','stroke-width':.75}));}
  function measure(s,size,italic=false){const temp=txt(symbolGroup,s,-2000,-2000,size,{italic});const w=temp.getComputedTextLength();temp.remove();return w;}
  function drawConfig(os,y){
    const subs=new Map();for(const o of os){const key=`${o.n},${o.l}`;if(!subs.has(key))subs.set(key,{n:o.n,l:o.l,k:0});subs.get(key).k+=o.occ;}
    const group=[...subs.values()].sort((a,b)=>(a.n+a.l)-(b.n+b.l)||a.n-b.n);
    const letter=['s','p','d','f'];
    const projectedWidth=(font)=>group.reduce((sum,v)=>sum+measure(`${v.n}${letter[v.l]}`,font)+measure(String(v.k),font*.6)+4,0);
    // Prevent very long electronic configurations spilling into the quantum table.
    let font=42;
    if(projectedWidth(font)>590)font=Math.max(23,font*590/projectedWidth(font));
    let x=90;
    for(const entry of group){
      const text=`${entry.n}${letter[entry.l]}`;const normal=txt(symbolGroup,text,x,y,font);
      x+=normal.getComputedTextLength();
      const sup=txt(symbolGroup,String(entry.k),x,y-font*.43,font*.60);
      x+=sup.getComputedTextLength()+3.2;
    }
    return x;
  }
  function addQuantum(q){
    quantumGroup.replaceChildren();
    const centres=[710,765,822,885];
    for(const [i,label] of ['n','l','m','m'].entries()){
      if(i<2)txt(quantumGroup,label,centres[i],875,34,{italic:true,anchor:'middle'});
      else {
        const text=txt(quantumGroup,label,centres[i]-3,875,34,{italic:true,anchor:'middle'});
        txt(quantumGroup,i===2?'l':'s',centres[i]+12,879,20,{italic:true,anchor:'middle'});
      }
    }
    [q.n,q.l,q.m,q.spin===.5?'+1/2':'−1/2'].forEach((v,i)=>txt(quantumGroup,v,centres[i],915,34,{anchor:'middle'}));
    line(quantumGroup,704,886,902,886);
    line(quantumGroup,773,923,806,939);
    line(quantumGroup,829,923,861,939);
    line(quantumGroup,892,923,926,939);
    txt(quantumGroup,'0 to (n−1)',770,957,17,{italic:true,anchor:'middle',className:'secondary'});
    txt(quantumGroup,'−l to +l',845,957,17,{italic:true,anchor:'middle',className:'secondary'});
    txt(quantumGroup,'±1/2',910,957,17,{italic:true,anchor:'middle',className:'secondary'});
    txt(quantumGroup,'Quantum Numbers',900,1005,36,{italic:true,anchor:'middle'});
  }
  window.renderElementOverlay=function(element,orbitals,quantum){
    if(!root)return;
    symbolGroup.replaceChildren();
    const symbolSize=122;
    const symbol=txt(symbolGroup,element[2],90,803,symbolSize);
    const width=symbol.getComputedTextLength();
    if(width>185){symbol.setAttribute('font-size',String(symbolSize*185/width));}
    const nucX=90+Math.min(185,width)+8;
    txt(symbolGroup,element[1],nucX,735,38);
    txt(symbolGroup,element[0],nucX,777,38);
    const full=`${element[3]} · ${element[4]}`;
    const wrap=measure(full,67,true)>560;
    txt(symbolGroup,wrap?element[3]:full,90,895,67,{italic:true});
    if(wrap)txt(symbolGroup,`· ${element[4]}`,90,948,60.3,{italic:true});
    const configY=wrap?1010:970;
    const endX=drawConfig(orbitals,configY);
    txt(symbolGroup,`Z = ${element[0]}`,405,(endX+20>405?configY+42:configY),42,{italic:true});
    addQuantum(quantum);
  };
})();
