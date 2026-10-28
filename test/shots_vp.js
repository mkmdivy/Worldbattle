const {chromium}=require('playwright');
const out=process.argv[2]||'/tmp';
(async()=>{const b=await chromium.launch();
for(const [name,vp] of [['d',{viewport:{width:1280,height:800}}],['m',{viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true}]]){
const p=await b.newPage(vp);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(1200);
await p.click('#lgPlay');await p.waitForTimeout(300);
await p.evaluate(()=>{const T=window.__ttm,G=T.G;T.beginMatch();for(let i=0;i<6100;i++){T.step();const m=G.nations.find(n=>n.isPlayer);if(m.alive)m.gold+=40;if(G.state!=='play')break;}
  T.cam.tw=null;T.cam.s=1.9;T.cam.ox=innerWidth/2-W2*1.9;T.cam.oy=innerHeight/2-120*1.9;}).catch(e=>console.log(e.message));
await p.evaluate(()=>{const T=window.__ttm;T.cam.ox=innerWidth/2-360*1.9;T.cam.oy=innerHeight/2-110*1.9;});
await p.waitForTimeout(600);await p.screenshot({path:`${out}/vp_${name}_map.png`});
await p.evaluate(()=>{document.getElementById('sci').hidden=true;document.getElementById('sVP').click();});await p.waitForTimeout(400);
await p.screenshot({path:`${out}/vp_${name}_pop.png`});
const st=await p.evaluate(()=>{const G=window.__ttm.G;return {t:G.t|0,state:G.state,king:G.king,me:(G.nations.find(n=>n.isPlayer)||{}).vp};});
console.log(name,st,errs.slice(0,3));await p.close();}
await b.close();})();
