const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:850}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await p.goto(process.argv[2]||'file://'+require('path').resolve(__dirname,'../index.html')+'');await p.waitForTimeout(1000);
const r=await p.evaluate(async()=>{const T=window.__ttm,G=T.G;T.startLobby();T.beginMatch();for(let i=0;i<3600;i++)T.step();
  const me=G.nations.find(n=>n.alive&&n.cells>2000)||G.nations[0];const out={units:G.units.length};
  const decay=dt=>{for(const p of G.projs)p.t+=dt;G.projs=G.projs.filter(p=>p.t<p.d);for(const f of G.fx)f.life-=dt;G.fx=G.fx.filter(f=>f.life>0);};
  for(const s of [1.9,3,6,12]){T.cam.tw=null;T.cam.s=s;T.cam.ox=700-me.lx*s;T.cam.oy=425-me.ly*s;
    for(let i=0;i<12;i++){T.step();for(let f=0;f<6;f++){decay(1/60);T.draw();}}
    let tot=0,mx=0;for(let i=0;i<10;i++){T.step();for(let f=0;f<6;f++){decay(1/60);const t0=performance.now();T.draw();const d=performance.now()-t0;tot+=d;mx=Math.max(mx,d);}}
    out['@'+s]=`avg ${(tot/60).toFixed(1)}ms max ${mx.toFixed(1)} fx=${G.fx.length} pj=${G.projs.length}`;}
  return out;});
console.log(r,errs.slice(0,3));await b.close();})();
