const fs=require('fs');const map=require('../data/map.json');
const W=map.W,H=map.H;const ctry=new Uint16Array(W*H);
map.rle.split('|').forEach((row,y)=>{let x=0;for(const t of row.split(',')){const [v,n]=t.split('.').map(s=>parseInt(s,36));ctry.fill(v,y*W+x,y*W+x+n);x+=n;}});
const src=process.argv[2];const d=JSON.parse(fs.readFileSync(src));
const best=new Map();let noko=0;
for(const f of d.features){const p=f.properties;const lon=f.geometry.coordinates[0],lat=f.geometry.coordinates[1];
  if(lat<-60||lat>84)continue;let x=Math.floor((lon+180)/.5),y=Math.floor((84-lat)/.5);
  let c=-1;for(let r=0;r<=2&&c<0;r++)for(let dy=-r;dy<=r&&c<0;dy++)for(let dx=-r;dx<=r;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;if(ctry[yy*W+xx]){c=yy*W+xx;break;}}
  if(c<0)continue;
  const g=k=>p[k]??p[k.toLowerCase()];
  let ko=g('NAME_KO');if(!ko){noko++;ko=g('NAME');}
  ko=String(ko).replace(/\s*\(.*\)/,'').trim().replace(/(특별시|광역시|직할시)$/,'').replace(/ 시$/,'');
  if(ko==='도쿄도')ko='도쿄';const iso=g('ISO_A2');
  if(['CN','JP','TW','KR','KP','VN'].includes(iso)&&ko.length>=3)ko=ko.replace(/[시구]$/,'');
  const pop=g('POP_MAX')||0;const cap=(g('ADM0CAP')|0)?1:0;
  const score=pop*(cap?3:1);const o=best.get(c);if(!o||score>o.s)best.set(c,{c,ko,s:score,cap,pop});}
const arr=[...best.values()].sort((a,b)=>b.s-a.s);
console.log(d.features.length,arr.length,'noko',noko,arr.slice(0,25).map(a=>a.ko).join(','));
fs.writeFileSync(__dirname+'/../data/cities.json',JSON.stringify(arr.map(a=>[a.c,a.ko,a.cap,Math.round(Math.log10(a.pop+10)*10)])));
console.log(fs.statSync(__dirname+'/../data/cities.json').size);
