import {mkdirSync,readFileSync,writeFileSync,copyFileSync,existsSync,unlinkSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {stripTypeScriptTypes} from 'node:module';
const output=resolve('dist');mkdirSync(output,{recursive:true});
for(const name of ['content.js','keyboard-guard.js','background.js','collection.js','collection.css']){const path=resolve(output,name);if(!path.startsWith(output+sep))throw new Error('Invalid output path');if(existsSync(path))unlinkSync(path);}
const imports=/^[\uFEFF \t]*import .*?;\r?\n/gm;
const compile=name=>stripTypeScriptTypes(readFileSync(`src/${name}.ts`,'utf8')).replace(imports,'').replace(/\bexport /g,'');
for(const asset of ['manifest.json','style.css','privacy.html','collection.html','theme.js'])copyFileSync('public/'+asset,'dist/'+asset);
writeFileSync('dist/app.js',`(()=>{${compile('engine')}\n${compile('search')}\n${compile('search-ui')}\n${compile('popup')}\n})();`);
writeFileSync('dist/launcher.js',`(()=>{${compile('launcher')}\n})();`);
writeFileSync('dist/index.html','<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ElevaTok</title><script src="theme.js"></script><link rel="stylesheet" href="style.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>');
console.log('ElevaTok ready to load: '+output);
