import {copyFileSync,readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const out='web-demo';mkdirSync(out,{recursive:true});
for(const name of ['app.js','style.css','theme.js','privacy.html'])copyFileSync('dist/'+name,out+'/'+name);
writeFileSync(out+'/index.html',readFileSync('dist/index.html','utf8').replace('<script src="app.js">','<script src="browser-storage.js"></script><script src="app.js">'));
for(const name of ['app.js','privacy.html']){
 let text=readFileSync(out+'/'+name,'utf8').replaceAll('browser-session storage','tab-session storage').replaceAll('browser session','tab session').replaceAll('extension storage','browser storage');
 text=text.replace('A consent dialog appears whenever the interface loads or is reopened using the extension toolbar.','A consent dialog appears whenever this browser demo loads.').replace('Its toolbar button opens its own full-page interface.','This browser demo needs no extension installation.');
 if(name==='privacy.html'){const start=text.indexOf('<h2>Full-page launcher and permissions</h2>'),end=text.indexOf('<h2>Limits</h2>',start);if(start>=0)text=text.slice(0,start)+'<h2>Browser demo</h2><p>Session data stays in this browser tab. The host receives normal page-request information. There is no analytics code or backend receiving check-ins. TikTok receives generated search terms when you choose to open it. No extension permissions are needed.</p>'+text.slice(end);}
 writeFileSync(out+'/'+name,text);
}
console.log('Browser demo updated.');
