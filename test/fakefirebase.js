// Minimal stand-in for the Firebase compat SDK (app/auth/database) shared between tabs over BroadcastChannel.
// Covers exactly what the game uses: ref/child/set/get/on/off('value'), orderByChild+limitToLast,
// onDisconnect().remove(), .info paths, ServerValue.TIMESTAMP, anonymous and Google sign-in.
(()=>{const ch=new BroadcastChannel('fakefb');let tree={};const L=[];const onDisc=[];
const ks=p=>p.split('/').filter(Boolean);
const getP=p=>{let o=tree;for(const k of ks(p)){if(o==null||typeof o!=='object')return null;o=o[k];}return o===undefined?null:JSON.parse(JSON.stringify(o));};
const setP=(p,v)=>{const a=ks(p);if(!a.length){tree=v||{};return;}let o=tree;for(let i=0;i<a.length-1;i++){if(o[a[i]]==null||typeof o[a[i]]!=='object')o[a[i]]={};o=o[a[i]];}if(v==null)delete o[a[a.length-1]];else o[a[a.length-1]]=v;};
const ts=v=>{if(v&&typeof v==='object'){if(v['.sv']==='timestamp')return Date.now();const o={};for(const k in v)o[k]=ts(v[k]);return o;}return v;};
const fire=p=>{for(const l of L)if(p.startsWith(l.path)||l.path.startsWith(p))setTimeout(l.emit,0);};
const apply=(p,v,b)=>{setP(p,v);if(b)ch.postMessage({p,v});fire(p);};
ch.onmessage=e=>{const m=e.data;if(m.sync){ch.postMessage({full:tree});return;}if(m.full){if(!Object.keys(tree).length){tree=m.full;fire('');}return;}apply(m.p,m.v,false);};
ch.postMessage({sync:1});
addEventListener('pagehide',()=>{for(const p of onDisc)apply(p,null,true);});
const snapOf=(key,v,order)=>({key,val:()=>v,exists:()=>v!=null,forEach:fn=>{if(!v||typeof v!=='object')return;let e=Object.entries(v);if(order){e.sort((a,b)=>((a[1]||{})[order.f]??-1e18)-((b[1]||{})[order.f]??-1e18));if(order.n)e=e.slice(-order.n);}for(const [k,c] of e)fn(snapOf(k,c));}});
function ref(path,order){path=ks(path).join('/');
  const val=()=>path==='.info/connected'?true:path==='.info/serverTimeOffset'?0:getP(path);
  return {key:ks(path).pop(),
    child:c=>ref(path+'/'+c),
    set:async v=>apply(path,ts(JSON.parse(JSON.stringify(v))),true),
    get:async()=>snapOf(ks(path).pop(),val(),order),
    on:(ev,cb)=>{const l={path,cb,emit:()=>cb(snapOf(ks(path).pop(),val(),order))};L.push(l);setTimeout(l.emit,0);return cb;},
    off:(ev,cb)=>{const i=L.findIndex(l=>l.cb===cb&&l.path===path);if(i>=0)L.splice(i,1);},
    onDisconnect:()=>({remove:()=>{if(!onDisc.includes(path))onDisc.push(path);}}),
    orderByChild:f=>ref(path,{f}),
    limitToLast:n=>ref(path,{...(order||{}),n}),
  };}
const auth={currentUser:null,cbs:[],onAuthStateChanged(cb){setTimeout(()=>cb(auth.currentUser),0);return ()=>{};},
  async signInAnonymously(){auth.currentUser={uid:'anon_'+Math.random().toString(36).slice(2,8),isAnonymous:true,displayName:null};return {user:auth.currentUser};},
  async signInWithPopup(){auth.currentUser={uid:'g_'+Math.random().toString(36).slice(2,8),isAnonymous:false,displayName:'Google Tester'};return {user:auth.currentUser};},
  async signOut(){auth.currentUser=null;}};
const db={ref};
const firebase={initializeApp:()=>({}),auth:()=>auth,database:()=>db};
firebase.auth.GoogleAuthProvider=class{};firebase.database.ServerValue={TIMESTAMP:{'.sv':'timestamp'}};
window.firebase=firebase;window.__fakefb={get tree(){return tree;}};
})();
