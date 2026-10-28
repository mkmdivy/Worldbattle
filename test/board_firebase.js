// Google sign-in on the start screen, one finished game, and the score row in the shared leaderboard (fake Firebase).
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:820}});const errs=[];
await ctx.addInitScript({content:fs.readFileSync(path.join(__dirname,'fakefirebase.js'),'utf8')+`;try{localStorage.setItem('ttm_help','1')}catch(e){}`});
const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.waitForTimeout(1200);
await p.click('#lgGoogle');await p.waitForTimeout(400);
console.log('login:',(await p.textContent('#lgAcct')).trim().slice(0,90));
if(process.argv[2])await p.screenshot({path:process.argv[2]});
await p.click('#lgPlay');await p.waitForTimeout(800);await p.click('#lbGo');await p.waitForTimeout(600);
await p.evaluate(()=>{const T=window.__ttm,G=T.G;for(let i=0;i<200;i++)T.step();const me=G.nations.find(n=>n.isPlayer);G.score[me.pid]=999;G.t=899;for(let i=0;i<30&&G.state==='play';i++)T.step();});
await p.waitForTimeout(2500);
console.log('scores in db:',JSON.stringify(await p.evaluate(()=>window.__fakefb.tree.scores)));
await p.click('#endBoard');await p.waitForTimeout(800);
console.log('board:',(await p.textContent('#boardBody')).replace(/\s+/g,' ').slice(0,120));
console.log(errs.slice(0,4));await b.close();})();
