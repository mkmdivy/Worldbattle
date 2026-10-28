// Lobby combo row: pick a start combo in a solo lobby and in a multiplayer lobby (host applies the slot); the cost comes off the starting stars.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const url='file://'+path.resolve(__dirname,'../index.html');const errs=[];
const pick=p=>p.evaluate(()=>{const k=window.__ttm.ME.pick;return k&&[k.ci,k.pw,k.cost];});
// solo
const s=await b.newPage();s.on('pageerror',e=>errs.push(e.message));await s.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await s.goto(url);await s.click('#lgPlay');await s.waitForTimeout(2200);
const seen=[await pick(s)];await s.click('.lrc[data-i="3"]');await s.waitForTimeout(200);seen.push(await pick(s));
await s.click('#lbGo');await s.waitForTimeout(500);
const st=await s.evaluate(()=>{const T=window.__ttm,G=T.G,me=G.nations[T.ME.nid];return {ci:me.ci,pw:me.pw,score:G.score[T.ME.pid]};});
console.log('solo picks',seen,'match',st,'ok:',st.ci===seen[1][0]&&st.pw===seen[1][1]&&st.score===2);
// multiplayer
const ctx=await b.newContext();await ctx.addInitScript({content:fs.readFileSync(path.join(__dirname,'mockroom.js'),'utf8')+`;try{localStorage.setItem('ttm_help','1')}catch(e){}`});
const A=await ctx.newPage();A.on('pageerror',e=>errs.push('A '+e.message));await A.goto(url);await A.click('#lgPlay');await A.waitForTimeout(3500);
const B=await ctx.newPage();B.on('pageerror',e=>errs.push('B '+e.message));await B.goto(url);await B.click('#lgPlay');await B.waitForTimeout(3500);
await A.evaluate(()=>{const L=window.__ttm.NET.lobby;if(L)L.t=40;});await B.waitForTimeout(1500);
const mp=[await pick(B)];await B.click('.lrc[data-i="2"]');await B.waitForTimeout(2500);mp.push(await pick(B));
await A.click('#lbGo');await B.waitForFunction(()=>window.__ttm.G.state==='play'&&window.__ttm.G.mp,null,{timeout:30000});await B.waitForTimeout(1000);
const bv=await B.evaluate(()=>{const T=window.__ttm,G=T.G,me=G.nations[T.ME.nid];return {ci:me.ci,pw:me.pw,score:G.score[T.ME.pid]};});
const av=await A.evaluate(()=>{const G=window.__ttm.G;const n=G.nations.find(x=>x.human&&!x.isPlayer);return n&&{ci:n.ci,pw:n.pw,score:G.score[n.pid]};});
console.log('mp B picks',mp,'B sees',bv,'A sees',av,'ok:',JSON.stringify(av)===JSON.stringify(bv)&&bv.score===3&&bv.ci===mp[1][0]);
console.log(errs.slice(0,4));await b.close();})();
