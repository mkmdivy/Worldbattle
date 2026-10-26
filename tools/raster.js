const topo=require('world-atlas/countries-50m.json');
const {feature}=require('topojson-client');
const {geoContains,geoBounds,geoArea}=require('d3-geo');
const iso=require('i18n-iso-countries');
iso.registerLocale(require('i18n-iso-countries/langs/ko.json'));
const fc=feature(topo,topo.objects.countries).features.filter(f=>f.properties.name!=='Antarctica');
const W=720,H=288,LAT0=84,STEP=0.5;
const grid=new Uint16Array(W*H);
const meta=[];
fc.forEach((f,i)=>{
  let a2=f.id?iso.numericToAlpha2(f.id):null;
  const ko=a2?iso.getName(a2,'ko'):null;
  meta.push({en:f.properties.name,a2:a2||'',ko:ko||f.properties.name});
  const b=geoBounds(f);
  f._b=b;
});
for(let y=0;y<H;y++){const lat=LAT0-(y+0.5)*STEP;
  for(let x=0;x<W;x++){const lon=-180+(x+0.5)*STEP;
    for(let i=0;i<fc.length;i++){const b=fc[i]._b;
      if(lat<b[0][1]||lat>b[1][1])continue;
      if(b[0][0]<=b[1][0]){if(lon<b[0][0]||lon>b[1][0])continue;}
      else if(lon<b[0][0]&&lon>b[1][0])continue;
      if(geoContains(fc[i],[lon,lat])){grid[y*W+x]=i+1;break;}
    }}}
const cnt=new Array(fc.length).fill(0);for(const v of grid)if(v)cnt[v-1]++;
meta.forEach((m,i)=>m.c=cnt[i]);
let rows=[];for(let y=0;y<H;y++){let r=[],cur=grid[y*W],n=0;
  for(let x=0;x<W;x++){const v=grid[y*W+x];if(v===cur)n++;else{r.push(cur.toString(36)+'.'+n.toString(36));cur=v;n=1;}}
  r.push(cur.toString(36)+'.'+n.toString(36));rows.push(r.join(','));}
const out={W,H,LAT0,STEP,meta:meta.map(m=>[m.ko,m.a2,m.en]),rle:rows.join('|')};
require('fs').writeFileSync(__dirname+'/../data/map.json',JSON.stringify(out));
console.log(fc.length,JSON.stringify(out).length,meta.filter(m=>m.c===0).map(m=>m.en).join(';'));
console.log(meta.sort((a,b)=>b.c-a.c).slice(0,15).map(m=>m.ko+':'+m.c).join(' '));
