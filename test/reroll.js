// Reroll: up to 3 times in a solo lobby and in a multiplayer lobby (host applies the request).
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const url='file://'+path.resolve(__dirname,'../index.html');const errs=[];
const pick=p=>p.evaluate(()=>window.__ttm.ME.pick&&window.__ttm.ME.pick.ci);
// solo
const s=await b.newPage();s.on('pageerror',e=>errs.push(e.message));await s.addInitScript(()=>{try{localStorage.setItem('ttm_help','1')}catch(e){}});
await s.goto(url);await s.click('#lgPlay');await s.waitForTimeout(2200);
const seen=[await pick(s)];for(let i=0;i<4;i++){if(await s.isEnabled('#lbRe')){await s.click('#lbRe');await s.waitForTimeout(150);}seen.push(await pick(s));}
console.log('solo picks',seen,'button:',await s.textContent('#lbRe'),'disabled:',!(await s.isEnabled('#lbRe')));
// multiplayer
const ctx=await b.newContext();await ctx.addInitScript({content:fs.readFileSync(path.join(__dirname,'mockroom.js'),'utf8')+`;try{localStorage.setItem('ttm_help','1')}catch(e){}`});
const A=await ctx.newPage();A.on('pageerror',e=>errs.push('A '+e.message));await A.goto(url);await A.click('#lgPlay');await A.waitForTimeout(3500);
const B=await ctx.newPage();B.on('pageerror',e=>errs.push('B '+e.message));await B.goto(url);await B.click('#lgPlay');await B.waitForTimeout(3500);
const mp=[await pick(B)];for(let i=0;i<3;i++){await B.click('#lbRe');await B.waitForTimeout(1600);mp.push(await pick(B));}
console.log('mp picks seen by B',mp,'B button:',await B.textContent('#lbRe'));
console.log(errs.slice(0,4));await b.close();})();
