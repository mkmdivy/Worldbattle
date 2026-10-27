const {chromium}=require('playwright');
const out=process.argv[2]||'/tmp';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(800);
// era sprite sheet
await p.evaluate(()=>{const T=window.__ttm;const cv=document.createElement('canvas');cv.width=7*90;cv.height=5*90;cv.style.cssText='position:fixed;left:0;top:0;z-index:99;background:#4a5a48';document.body.appendChild(cv);const g=cv.getContext('2d');
  const cus=[T.getCulture(T.META.findIndex(m=>m.a2==='KR')),T.getCulture(T.META.findIndex(m=>m.a2==='FR')),T.getCulture(T.META.findIndex(m=>m.a2==='JP'))];
  ['melee','ranged','def','farm','hero'].forEach((ty,r)=>{for(let e=0;e<7;e++)g.drawImage(T.sprite(cus[r%3],ty,'#46d4ff',e>=3?2:0,e>=3?2:0,e),e*90+5,r*90+5,80,80);});window.__sheet=cv;});
await p.screenshot({path:out+'/eras.png',clip:{x:0,y:0,width:630,height:450}});
await p.evaluate(()=>window.__sheet.remove());
await p.click('#lgPlay');await p.waitForTimeout(300);
const info=await p.evaluate(()=>{const T=window.__ttm,G=T.G;T.beginMatch();for(let i=0;i<1800;i++){T.step();const m=G.nations.find(n=>n.isPlayer);if(m.alive&&m.cells<400)m.gold+=50;}
  const me=G.nations.find(n=>n.isPlayer);me.tq=4;me.tn=3;me.te=3;me.era=3;return {alive:me.alive,cells:me.cells};});
for(const [s,name] of [[1.9,'far'],[4,'mid'],[9,'near']]){
  await p.evaluate(s=>{const T=window.__ttm,G=T.G;for(let i=0;i<120;i++)T.step();
    // the hottest battle involving the player, else any
    let best=null;for(const [k,z] of window.__ttm.BT){const me=G.nations.find(n=>n.isPlayer);const sc=z.heat*(z.s.has(me.id)?3:1);if(!best||sc>best.sc)best={sc,x:z.sx/z.w,y:z.sy/z.w};}
    T.cam.tw=null;T.cam.s=s;if(best){T.cam.ox=640-best.x*s;T.cam.oy=400-best.y*s;}},s);
  await p.waitForTimeout(700);await p.screenshot({path:`${out}/b_${name}.png`});}
console.log(info,errs.slice(0,3));await b.close();})();
