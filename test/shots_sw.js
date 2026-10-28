const {chromium}=require('playwright');
const out=process.argv[2]||'/tmp';
(async()=>{const b=await chromium.launch();
for(const [name,vp] of [['d',{viewport:{width:1280,height:800}}],['m',{viewport:{width:390,height:844},deviceScaleFactor:2,hasTouch:true}]]){
const p=await b.newPage(vp);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(1200);
await p.click('#lgPlay');await p.waitForTimeout(300);
await p.evaluate(()=>{const T=window.__ttm,G=T.G;T.beginMatch();for(let i=0;i<1900;i++){T.step();const m=G.nations.find(n=>n.isPlayer);if(m&&m.alive)m.gold+=30;}document.getElementById('sci').hidden=true;});
await p.waitForTimeout(2500);await p.screenshot({path:`${out}/sw_${name}_hud.png`});
const before=await p.evaluate(()=>window.__ttm.ME.nid);
await p.evaluate(()=>document.getElementById('ab_decline').click());await p.waitForTimeout(400);
await p.screenshot({path:`${out}/sw_${name}_market.png`});
await p.evaluate(()=>document.querySelector('.mkc[data-i="1"]')&&document.querySelector('.mkc[data-i="1"]').click());
await p.evaluate(()=>{const T=window.__ttm;for(let i=0;i<5;i++)T.step();});await p.waitForTimeout(1500);
const st=await p.evaluate(()=>{const T=window.__ttm,G=T.G;const me=G.nations[T.ME.nid];return {nid:T.ME.nid,name:me.name,pw:me.pw,dec:G.nations.filter(n=>n.pid===T.ME.pid).map(n=>n.name+(n.dec?'(dec)':'')),score:G.score[T.ME.pid]};});
await p.evaluate(()=>document.getElementById('sVP').click());await p.waitForTimeout(400);
await p.screenshot({path:`${out}/sw_${name}_after.png`});
console.log(name,before,st,errs.slice(0,3));await p.close();}
await b.close();})();
