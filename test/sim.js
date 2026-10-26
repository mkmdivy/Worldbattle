const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+'');await p.waitForTimeout(800);
for(let k=0;k<5;k++){
const r=await p.evaluate(()=>{const T=window.__ttm;const G=T.G;T.startLobby();T.beginMatch();T.ME.status='queued';let steps=0,log=[],t0=performance.now();
  while(G.state==='play'&&G.t<1810){T.step();steps++;if(steps%1800===0){const al=G.nations.filter(n=>n.alive);const top=al.reduce((a,b)=>a.cells>b.cells?a:b);log.push(`${(G.t/60).toFixed(0)}m a=${al.length} ${top.name}${top.sup?'*':''}:${(top.cells/T.TOTAL_LAND*100).toFixed(0)}% u=${G.units.length}`);}}
  return {ms:((performance.now()-t0)/steps).toFixed(2),t:(G.t/60).toFixed(1),w:G.winner&&G.winner.name+(G.winner.sup?'*':''),sup:G.nations.filter(n=>n.sup).map(n=>n.name).join(','),log:log.join(' | ')};});
console.log(JSON.stringify(r));}
console.log(errs);await b.close();})();
