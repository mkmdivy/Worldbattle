// two pages in one mock room: the client declines its nation mid-game; both sides must agree and stay in sync
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1000,height:700}});
await ctx.addInitScript({content:`window.__DROP=0;`+fs.readFileSync(__dirname+'/mockroom.js','utf8')+`;try{localStorage.setItem('ttm_help','1')}catch(e){}`});
const errs=[];const url='file://'+require('path').resolve(__dirname,'../index.html');
const A=await ctx.newPage();A.on('pageerror',e=>errs.push('A '+e.message));await A.goto(url);await A.click('#lgPlay');await A.waitForTimeout(3500);
const B=await ctx.newPage();B.on('pageerror',e=>errs.push('B '+e.message));await B.goto(url);await B.click('#lgPlay');await B.waitForTimeout(4000);
if(await A.isVisible('#lbGo'))await A.click('#lbGo');
await B.waitForFunction(()=>window.__ttm.G.state==='play'&&window.__ttm.G.mp&&window.__ttm.G.t>47,null,{timeout:120000});
await B.evaluate(()=>window.__ttm.issue(12,1));await B.waitForTimeout(6000);
const view=p=>p.evaluate(()=>{const T=window.__ttm,G=T.G,bp=G.nations.find(n=>n.peer&&n.peer!==T.NET.hostPeer&&n.human)||null;
  return {frame:G.frame,nations:G.nations.length,clientPid:bp&&bp.pid,clientNations:bp?G.nations.filter(n=>n.pid===bp.pid).map(n=>n.name+(n.dec?'†':'')):[],me:G.nations[T.ME.nid]&&G.nations[T.ME.nid].name,score:G.score.slice(0,4),desync:T.NET.desync};});
console.log('A',await view(A));console.log('B',await view(B));
const hA=await A.evaluate(()=>[...window.__ttm.NET.hashes]);const hB=new Map(await B.evaluate(()=>[...window.__ttm.NET.hashes]));
let same=0,diff=0;for(const [f,h] of hA)if(hB.has(f))hB.get(f)===h?same++:diff++;console.log('hash frames same',same,'diff',diff);
console.log(errs.slice(0,5));await b.close();})();
