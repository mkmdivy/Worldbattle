// src/template.html + data/*.json -> index.html (one self-contained file)
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
const t=fs.readFileSync(path.join(root,'src/template.html'),'utf8');
const out=t.replace('/*__MAP__*/null',fs.readFileSync(path.join(root,'data/map.json'),'utf8'))
           .replace('/*__CITIES__*/[]',fs.readFileSync(path.join(root,'data/cities.json'),'utf8'));
fs.writeFileSync(path.join(root,'index.html'),out);console.log('index.html',out.length,'bytes');
