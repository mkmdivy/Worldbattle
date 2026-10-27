const {chromium}=require('playwright');
const out=process.argv[2]||'/tmp';
(async()=>{const b=await chromium.launch();
for(const [name,vp] of [['d',{viewport:{width:1280,height:800}}],['m',{viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true}]]){
const p=await b.newPage(vp);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(1500);
await p.screenshot({path:`${out}/ui_${name}_login.png`});
await p.click('#lgPlay');await p.waitForTimeout(300);
await p.evaluate(()=>{const T=window.__ttm,G=T.G;T.beginMatch();for(let i=0;i<1500;i++){T.step();const m=G.nations.find(n=>n.isPlayer);if(m.alive&&m.cells<600)m.gold+=60;}
  const me=G.nations.find(n=>n.isPlayer);T.cam.tw=null;T.cam.s=1.9;T.cam.ox=innerWidth/2-me.lx*1.9;T.cam.oy=innerHeight/2-me.ly*1.9;});
await p.waitForTimeout(800);await p.screenshot({path:`${out}/ui_${name}_far.png`});
await p.evaluate(()=>{const T=window.__ttm,G=T.G;const me=G.nations.find(n=>n.isPlayer);T.cam.s=5;T.cam.ox=innerWidth/2-me.lx*5;T.cam.oy=innerHeight/2-me.ly*5;});
await p.waitForTimeout(800);await p.screenshot({path:`${out}/ui_${name}_mid.png`});
console.log(name,errs.slice(0,3));await p.close();}
await b.close();})();
