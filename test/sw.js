const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+require('path').resolve(__dirname,'../index.html'));await p.waitForTimeout(800);
for(let k=0;k<+(process.argv[2]||3);k++){
const r=await p.evaluate(()=>{const T=window.__ttm,G=T.G;T.startLobby();T.beginMatch();T.ME.status='queued';const log=[];let last=0;
  while(G.state==='play'&&G.t<1000){T.step();if(G.roundsPaid!==last){last=G.roundsPaid;const rk=T.ranking ? null : null;
    const top=[...G.score.entries()].sort((a,b)=>b[1]-a[1]).slice(0,3).map(([pid,s])=>{const n=G.nations.filter(x=>x.pid===pid).pop();return n.name.slice(0,8)+(n.dec?'†':'')+':'+s;});
    log.push('R'+last+' obj='+G.obj.map(o=>o.owner>=0?G.nations[o.owner].name.slice(0,6):'-').join(',')+' nations='+G.nations.length+' dec='+G.nations.filter(n=>n.dec&&n.alive).length+' | '+top.join(' '));}}
  return {t:(G.t/60).toFixed(1),w:G.winner&&G.winner.name,why:G.lastEnd&&G.lastEnd[1],log};});
console.log(r.t,r.w,r.why);console.log(' '+r.log.join('\n '));}
console.log(errs.slice(0,5));await b.close();})();
