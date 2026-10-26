// Fake claude.ai room/user capability over BroadcastChannel, for local multi-tab testing.
(()=>{const DROP=window.__DROP||0;const ch=new BroadcastChannel('mockroom');const me=Math.random().toString(36).slice(2,10);
const peers=new Map();let snap=Object.freeze([]);const hs=[];const ons={};let myP={};
const mk=()=>Object.freeze([...peers].map(([p,v])=>Object.freeze({peer:p,by:'u_'+p,isMe:p===me,sameTab:p===me,kind:'viewer',guest:false,presence:Object.freeze({...v.presence}),updatedAt:v.u})));
const fire=(j,l,u)=>{snap=mk();for(const h of hs)h({peers:snap,joined:j,left:l,updated:u});};
const up=(p,pres)=>{const ex=peers.has(p);peers.set(p,{presence:pres,u:Date.now(),seen:Date.now()});snap=mk();const e=snap.find(x=>x.peer===p);ex?fire([],[],[e]):fire([e],[],[]);};
ch.onmessage=ev=>{const m=ev.data;if(m.t==='p'){const ex=peers.get(m.peer);if(ex&&JSON.stringify(ex.presence)===JSON.stringify(m.presence)){ex.seen=Date.now();return;}up(m.peer,m.presence);}
 else if(m.t==='e'){(ons[m.topic]||[]).forEach(f=>f({topic:m.topic,data:m.data,peer:m.peer,by:'u_'+m.peer,isMe:false,sameTab:false,kind:'viewer',guest:false}));}
 else if(m.t==='bye'){if(peers.delete(m.peer)){const gone={peer:m.peer};fire([],[gone],[]);}}};
setInterval(()=>{ch.postMessage({t:'p',peer:me,presence:myP});const now=Date.now();for(const [p,v] of peers)if(p!==me&&now-v.seen>2500){peers.delete(p);fire([],[{peer:p}],[]);}},400);
addEventListener('pagehide',()=>ch.postMessage({t:'bye',peer:me}));
const room={emit:async(topic,data)=>{if(Math.random()>=DROP)ch.postMessage({t:'e',topic,data,peer:me});setTimeout(()=>(ons[topic]||[]).forEach(f=>f({topic,data,peer:me,by:'u_'+me,isMe:true,sameTab:true,kind:'viewer',guest:false})),0);},
 on:(t,f)=>{(ons[t]=ons[t]||[]).push(f);return()=>{}},
 presence:async patch=>{for(const k in patch){if(patch[k]===null)delete myP[k];else myP[k]=patch[k];}up(me,{...myP});ch.postMessage({t:'p',peer:me,presence:myP});},
 peers:()=>snap,onPeers:(h)=>{hs.push(h);setTimeout(()=>{peers.set(me,peers.get(me)||{presence:{},u:Date.now(),seen:Date.now()});snap=mk();h({peers:snap,joined:snap,left:[],updated:[]});},0);return()=>{}},
 connected:()=>true,onConnection:(h)=>{setTimeout(()=>h(true),0);return()=>{}}};
const user={profiles:async ids=>Object.fromEntries([].concat(ids).map(i=>[i,{id:i,name:'친구'+i.slice(2,5)}])),id:async()=>'u_'+me};
window.claude={use:async n=>n==='room'?room:n==='user'?user:null};})();
