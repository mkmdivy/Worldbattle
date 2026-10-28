const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(800);
for(let k=0;k<+(process.argv[2]||6);k++){
const r=await p.evaluate(()=>{const T=window.__ttm,G=T.G;T.startLobby();T.beginMatch();T.ME.status='queued';const log=[];
  while(G.state==='play'&&G.t<1810){T.step();if(G.frame%1200===0){const rk=G.nations.filter(n=>n.alive).sort((a,b)=>b.vp-a.vp).slice(0,3);log.push((G.t/60|0)+'m '+rk.map(n=>n.name.slice(0,8)+':'+n.vp+'('+JSON.stringify(n.vpB).replace(/"/g,'').slice(0,60)+')').join(' '));}}
  return {t:(G.t/60).toFixed(1),w:G.winner&&G.winner.name,why:G.lastEnd&&G.lastEnd[1],log};});
console.log(r.t,r.w,r.why);console.log(' '+r.log.join('\n '));}
console.log(errs.slice(0,3));await b.close();})();
