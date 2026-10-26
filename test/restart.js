// Joining a game where a human is still playing -> wait; joining a game with no living human -> fresh game right away.
// Also exercises the research choice through the real UI.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1200,height:760}});
await ctx.addInitScript({content:fs.readFileSync(path.join(__dirname,'mockroom.js'),'utf8')+`;try{localStorage.setItem('ttm_help','1')}catch(e){}`});
const url='file://'+path.resolve(__dirname,'../index.html');const errs=[];
const open=async()=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(url);return p;};
const st=p=>p.evaluate(()=>{const T=window.__ttm;return {role:T.NET.role,state:T.G.state,mp:T.G.mp,me:T.G.nations.findIndex(n=>n.isPlayer),status:T.ME.status,m:T.G.m}});
const A=await open();await A.waitForTimeout(9000);
console.log('A alone after 9s',await st(A));
// research choice via UI
await A.evaluate(()=>{const T=window.__ttm;const n=T.G.nations.find(x=>x.isPlayer);n.rp=999;});
await A.waitForTimeout(700);console.log('research panel visible',await A.isVisible('#sci'));
await A.click('#sciQ');await A.waitForTimeout(600);
console.log('after pick',await A.evaluate(()=>{const n=window.__ttm.G.nations.find(x=>x.isPlayer);return {era:n.era,tq:n.tq,tn:n.tn,wt:n.wt}}));
const B=await open();await B.waitForTimeout(4000);
console.log('B joins while A plays',await st(B),'A',await st(A));
// A's nation falls: nobody human is alive any more
await A.evaluate(()=>{const n=window.__ttm.G.nations.find(x=>x.isPlayer);n.human=false;});
const C=await open();await C.waitForTimeout(3500);
console.log('C joins a humanless game -> A',await st(A),'C',await st(C));
await C.waitForTimeout(9000);
console.log('fresh game: A',await st(A),'B',await st(B),'C',await st(C));
console.log(errs.slice(0,5));await b.close();})();
