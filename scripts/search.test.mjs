import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const strip=file=>stripTypeScriptTypes(readFileSync(file,'utf8')).replace(/^[\uFEFF \t]*import .*?;\r?\n/gm,'');
const module=await import('data:text/javascript;base64,'+Buffer.from(strip('src/engine.ts')+'\n'+strip('src/search.ts')).toString('base64'));
const {relatedSearch,searchOptions,moodOptions,experienceOptions,emptyLearning,recordSearch,giveFeedback,undoFeedback}=module;
test('all moods and experiences produce encoded TikTok search URLs with varied related choices',()=>{
 for(const mood of moodOptions)for(const experience of experienceOptions){
 const result=relatedSearch(mood.value,'',experience.value);assert.ok(result);
 const url=new URL(result.url);assert.equal(url.origin,'https://www.tiktok.com');assert.equal(url.pathname,'/search');assert.equal(url.searchParams.get('q'),result.query);
 }
 const ideas=[0,1,2].map(cursor=>relatedSearch('Happy','show cars','lighten',cursor).query);assert.equal(new Set(ideas).size,3);assert.ok(ideas.every(query=>/cars|supercars/.test(query)));
});
test('private note text never becomes the query, and explicit subjects and exclusions guide it',()=>{
 const note='My name is Alice. I had a tiring day at Example Ltd. Show dogs, no news.';
 const result=relatedSearch('Stressed',note,'unwind');assert.match(result.query,/dogs/);assert.doesNotMatch(result.url,/Alice|Example|Stressed|tiring|news/);
 assert.equal(relatedSearch('Calm','no nature, no satisfying, no animals','unwind'),null);
 assert.match(relatedSearch('Happy','show cats','lighten').query,/cats/);
 assert.equal(new URL(relatedSearch('Happy','show cars https://evil.example','lighten').url).hostname,'www.tiktok.com');
});
async function mount(shared={elevatokSearchCursor:0},appearance={},systemDark=false,autoAccept=true,motion=false){
 const ids=new Map(),nodes=[],navigations=[],removed=[],stored=[],reads=[],listeners={},frames=new Map();let nextFrame=0;
 class Element{
 constructor(tag='div'){this.scrollTop=0;this.offsetTop=0;this.style={removeProperty(key){if(key==='scroll-snap-type')delete this.scrollSnapType;}};this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this.value='';this.textContent='';nodes.push(this);}
 showModal(){this.open=true;}close(){this.open=false;}
 append(...children){this.children.push(...children);}replaceChildren(...children){this.children=[...children];}
 setAttribute(key,value){this.attributes[key]=value;}removeAttribute(key){delete this.attributes[key];if(key==='href')delete this.href;}hasAttribute(key){return key==='href'?typeof this.href==='string':key in this.attributes;}
 querySelector(selector){if(!ids.has(selector)){const node=new Element();const index=['mood','tip','before','experience','note','launch','feedback','reflect'].findIndex(id=>selector==='#journey-'+id);node.offsetTop=index<0?0:index*600;ids.set(selector,node);}return ids.get(selector);}
 querySelectorAll(){return nodes.filter(node=>node.dataset.mood);}
 click(){let prevented=false;this.onclick?.({preventDefault(){prevented=true;}});if(!prevented&&this.href)navigations.push(this.href);}
 }
 const root=new Element();
 const document={getElementById:()=>root,createElement:tag=>new Element(tag),fullscreenElement:null,documentElement:{dataset:{},async requestFullscreen(){document.fullscreenElement=document.documentElement;}},async exitFullscreen(){document.fullscreenElement=null;},addEventListener(){},removeEventListener(){}};
 const unavailable=()=>{throw new Error('Reading or saving personal data is forbidden');};
 const chrome={storage:{local:{get:unavailable,set:unavailable,async remove(keys){removed.push(['local',keys]);}},session:{async get(keys){reads.push(Array.from(keys));assert.deepEqual(Array.from(keys),['elevatokSearchCursor','elevatokFeedback','elevatokCheckin']);return structuredClone(shared);},async set(data){assert.ok(Object.keys(data).every(key=>['elevatokSearchCursor','elevatokFeedback','elevatokCheckin'].includes(key)));if('elevatokSearchCursor' in data)assert.ok(Number.isSafeInteger(data.elevatokSearchCursor));Object.assign(shared,structuredClone(data));stored.push(structuredClone(data));},async remove(keys){removed.push(['session',keys]);for(const key of keys)delete shared[key];}}}};
 const location={hash:''};
 const localStorage={removeItem(key){delete appearance[key];},getItem(key){assert.equal(key,'elevatokTheme');return appearance[key]??null;},setItem(key,value){assert.equal(key,'elevatokTheme');assert.ok(['light','dark'].includes(value));appearance[key]=value;}};
 vm.runInNewContext(readFileSync('dist/app.js','utf8'),{document,chrome,localStorage,location,requestAnimationFrame:motion?fn=>{const id=++nextFrame;frames.set(id,fn);return id;}:undefined,cancelAnimationFrame:id=>frames.delete(id),addEventListener(type,fn){listeners[type]=fn;},removeEventListener(type){delete listeners[type];},matchMedia:()=>({matches:systemDark}),setTimeout,fetch(){throw new Error('No network requests allowed');}});
 if(autoAccept)await ids.get('#consent-accept').onclick();
 await new Promise(resolve=>setImmediate(resolve));
 return {root,get:id=>root.querySelector('#'+id),nodes,navigations,removed,stored,reads,frame(time){const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);},reopen(){location.hash='#open-test';listeners.hashchange();},getTheme:()=>document.documentElement.dataset.theme};
}
test('UI opens TikTok only on a click, never previews the phrase, and keeps the note when changing direction',async()=>{
 const ui=await mount();assert.equal(ui.navigations.length,0);
 const note=ui.get('note');note.value='show cars, no news';note.oninput();
 const first=ui.get('open-tiktok').href;assert.equal(new URL(first).searchParams.get('q'),'cars and automotive design');
 assert.doesNotMatch(ui.root.innerHTML,/id="(?:query|feed|spaces|privacy-gate)"/);
 assert.doesNotMatch(ui.get('status').textContent,/cars and automotive design/);
 ui.get('open-tiktok').click();assert.deepEqual(ui.navigations,[first]);
 ui.get('another').onclick();assert.equal(note.value,'show cars, no news');assert.notEqual(ui.get('open-tiktok').href,first);assert.equal(ui.navigations.length,1,'another direction never opens a background search');
 note.value='no nature, no satisfying, no animals';note.oninput();
 // Change to Stressed so the unwind experience is selected, without erasing the note.
 ui.nodes.find(node=>node.dataset.mood==='Stressed').onclick();ui.get('open-tiktok').click();assert.equal(ui.navigations.length,1,'no query means no navigation');
});
test('legacy storage is touched only by the explicit delete button',async()=>{
 const ui=await mount();assert.deepEqual(ui.removed,[]);assert.deepEqual(ui.stored,[]);await ui.get('clear-legacy').onclick();assert.equal(ui.removed.length,2);assert.ok(ui.removed[0][1].includes('moodloop'));assert.ok(ui.removed[1][1].includes('quicktokDemoSpaces'));
});
test('built extension has no website access, embedded feed or generation service; its worker only opens the local full-page UI',()=>{
 const manifest=JSON.parse(readFileSync('dist/manifest.json','utf8').replace(/^\uFEFF/,''));assert.equal(manifest.name,'ElevaTok');
 for(const key of ['content_scripts','host_permissions'])assert.equal(manifest[key],undefined);
 assert.equal(manifest.action.default_popup,undefined);assert.equal(manifest.background.service_worker,'launcher.js');
 const csp=manifest.content_security_policy.extension_pages;assert.match(csp,/connect-src 'none'/);assert.match(csp,/frame-src 'none'/);assert.match(csp,/media-src 'none'/);
 for(const file of ['content.js','background.js','keyboard-guard.js','collection.js'])assert.equal(existsSync('dist/'+file),false);
 const js=readFileSync('dist/app.js','utf8');assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|chrome\.tabs|createElement\(['"](?:video|iframe)|storage\.local\.(?:set|get)\(/);
 assert.doesNotMatch(js,/Cloudinary|QuickTok|MoodLoop/);
 const launcher=readFileSync('dist/launcher.js','utf8');assert.match(launcher,/getURL\('index.html'\)/);assert.doesNotMatch(launcher,/https?:\/\//);
});
test('specific requests keep the requested subject in every variant and exclude unrelated defaults',()=>{
 for(const [note,required] of [['show red BMW cars',/red bmw cars/],['show jazz music',/jazz music/],['show vegan pasta',/vegan recipes|pasta recipes/],['show crochet',/crochet/],['show Japan travel',/japan travel/]]){
 const options=searchOptions('Stressed',note,'unwind');assert.ok(options.length>=6,note);assert.ok(options.every(query=>required.test(query)),note);
 }
 const dogs=searchOptions('Happy','funny dogs, no cats','lighten');assert.equal(dogs.length,6);assert.ok(dogs.every(query=>/funny dogs/.test(query)&&!/cats/.test(query)));
 const mixed=searchOptions('Happy','show BMW and piano, no news','discover');assert.ok(mixed.some(q=>/bmw/.test(q)));assert.ok(mixed.some(q=>/piano/.test(q)));assert.ok(mixed.every(q=>!/news|science/.test(q)));
});
test('repeated opens and reopening the popup rotate searches while preserving the note',async()=>{
 const counter={elevatokSearchCursor:0},ui=await mount(counter),note=ui.get('note');note.value='show BMW cars';note.oninput();
 for(let n=0;n<3;n++)ui.get('open-tiktok').click();
 assert.equal(new Set(ui.navigations).size,3);assert.ok(ui.navigations.every(url=>new URL(url).searchParams.get('q').includes('bmw')));assert.equal(note.value,'show BMW cars');
 const reopened=await mount(counter);reopened.get('note').value=note.value;reopened.get('note').oninput();reopened.get('open-tiktok').click();
 assert.ok(!ui.navigations.includes(reopened.navigations[0]));assert.equal(counter.elevatokSearchCursor,4);
 assert.ok(ui.stored.every(record=>Object.keys(record).every(key=>['elevatokSearchCursor','elevatokFeedback','elevatokCheckin'].includes(key))));
});
test('feedback changes future topic and subject choices without overriding the explicit prompt',()=>{
 const first=relatedSearch('Stressed','','unwind',0);
 const recorded=recordSearch(emptyLearning(),first);
 const more=giveFeedback(recorded,true),less=giveFeedback(recorded,false);
 assert.equal(relatedSearch('Stressed','','unwind',1,more).topic,first.topic);
 assert.notEqual(relatedSearch('Stressed','','unwind',1,less).topic,first.topic);
 assert.deepEqual(giveFeedback(more,true),more,'double votes are ignored');
 assert.deepEqual(undoFeedback(more).weights,{});assert.equal(undoFeedback(more).last.vote,undefined);
 const bmw=relatedSearch('Happy','show BMW and Porsche','lighten',0);
 const dislikeBMW=giveFeedback(recordSearch(emptyLearning(),bmw),false);
 assert.match(relatedSearch('Happy','show BMW and Porsche','lighten',1,dislikeBMW).query,/porsche/);
 assert.match(relatedSearch('Happy','show BMW cars','lighten',1,dislikeBMW).query,/bmw/,'feedback never substitutes unrelated topics for an explicit request');
 assert.match(relatedSearch('Happy','show piano','lighten',1,more).query,/piano/);
 let learning=more;const seen=[];
 for(let n=0;n<6;n++){const choice=relatedSearch('Stressed','','unwind',n*4,learning);seen.push(choice.key);learning=recordSearch(learning,choice);}
 assert.equal(new Set(seen).size,6,'liked topics still vary their phrases');
});
test('one-tap feedback survives popup closure, applies to the last search, and can be undone without navigation',async()=>{
 const shared={elevatokSearchCursor:0},first=await mount(shared);first.get('note').value='show nature and animals';first.get('note').oninput();first.get('open-tiktok').click();
 const ui=await mount(shared);assert.equal(ui.get('feedback').hidden,false);
 ui.get('feedback-more').onclick();assert.equal(shared.elevatokFeedback.last.vote,'more');assert.equal(ui.get('feedback-more').disabled,true);assert.equal(ui.get('feedback-less').disabled,true);assert.equal(ui.get('feedback-undo').hidden,false);assert.equal(ui.navigations.length,0);
 assert.equal(relatedSearch('Stressed','','unwind',shared.elevatokSearchCursor,shared.elevatokFeedback).topic,'nature');
 ui.get('feedback-undo').onclick();assert.deepEqual(shared.elevatokFeedback.weights,{});assert.equal(ui.get('feedback-more').disabled,false);
 ui.get('feedback-less').onclick();assert.notEqual(relatedSearch('Stressed','','unwind',shared.elevatokSearchCursor,shared.elevatokFeedback).topic,'nature');
 const stored=JSON.stringify(shared);assert.doesNotMatch(stored,/show nature and animals|https:/,'no full note or URL is stored');
});
test('More like this follows the last specific subject after reopening, without saving or restoring the raw note',async()=>{
 const shared={elevatokSearchCursor:0},first=await mount(shared);first.get('note').value='I had a long day, show BMW cars';first.get('note').oninput();first.get('open-tiktok').click();
 const ui=await mount(shared);assert.equal(ui.get('note').value,'');ui.get('feedback-more').onclick();ui.get('open-tiktok').click();assert.match(new URL(ui.navigations[0]).searchParams.get('q'),/bmw/);
 assert.doesNotMatch(JSON.stringify(shared),/I had a long day/);
 ui.get('note').value='show jazz';ui.get('note').oninput();ui.get('open-tiktok').click();assert.match(new URL(ui.navigations[1]).searchParams.get('q'),/jazz/,'a new prompt overrides the follow-up');
});
test('Full screen button enters and exits full screen without opening TikTok',async()=>{
 const ui=await mount();await ui.get('fullscreen').onclick();assert.equal(ui.get('fullscreen').attributes['aria-pressed'],'true');assert.equal(ui.get('fullscreen').textContent,'Exit full screen');
 await ui.get('fullscreen').onclick();assert.equal(ui.get('fullscreen').attributes['aria-pressed'],'false');assert.equal(ui.navigations.length,0);
});
test('toolbar opens a full tab, reuses the local view and never activates an unrelated saved tab',async()=>{
 let clicked;const session={},tabs=new Map(),opened=[],activated=[],focused=[];let nextId=1;
 const chrome={action:{onClicked:{addListener(fn){clicked=fn;}}},runtime:{getURL:path=>'chrome-extension://elevatok/'+path},storage:{session:{async get(){return {...session};},async set(data){Object.assign(session,data);}}},tabs:{async create(options){opened.push(options);const tab={id:nextId++,windowId:2,url:options.url};tabs.set(tab.id,tab);return tab;},async get(id){if(!tabs.has(id))throw new Error('Closed');return tabs.get(id);},async update(id,options){activated.push({id,...options});return tabs.get(id);}},windows:{async update(id,options){focused.push({id,...options});}}};
 vm.runInNewContext(readFileSync('dist/launcher.js','utf8'),{chrome});
 await clicked();assert.equal(opened[0].url,'chrome-extension://elevatok/index.html');assert.equal(opened[0].active,true);
 await clicked();assert.equal(opened.length,1);assert.equal(activated[0].id,1);assert.equal(focused[0].focused,true);
 tabs.get(1).url='https://example.com';await clicked();assert.equal(opened.length,2);assert.equal(activated.length,1,'unrelated tabs must not be activated or replaced');
});
test('one ocean theme ignores previous appearance settings and has no theme toggle',async()=>{
 const ui=await mount({}, {elevatokTheme:'light'},true);assert.equal(ui.getTheme(),'ocean');assert.doesNotMatch(ui.root.innerHTML,/id="theme-(light|dark)"/);
 const other=await mount({}, {elevatokTheme:'dark'},false);assert.equal(other.getTheme(),'ocean');
});

test('logo, Home and About open the description and returning keeps the note, theme and search',async()=>{
 const ui=await mount();ui.get('note').value='show BMW cars';ui.get('note').oninput();const url=ui.get('open-tiktok').href;
 for(const id of ['home-logo','home-nav','about-link']){
 ui.get(id).onclick({preventDefault(){}});assert.equal(ui.get('home-view').hidden,false);assert.equal(ui.get('discover-view').hidden,true);assert.equal(ui.get('view-title').textContent,'Home');
 ui.get('home-start').onclick({preventDefault(){}});assert.equal(ui.get('home-view').hidden,true);assert.equal(ui.get('discover-view').hidden,false);assert.equal(ui.get('note').value,'show BMW cars');assert.equal(ui.get('open-tiktok').href,url);assert.equal(ui.getTheme(),'ocean');
 }
 assert.equal(ui.navigations.length,0,'opening the home screen never opens TikTok');
});

test('consent gates every opening and decline blocks searches without reading preferences',async()=>{
 const shared={elevatokSearchCursor:12},ui=await mount(shared,{},false,false);
 assert.equal(ui.get('consent-dialog').open,true);assert.equal(ui.reads.length,0);
 ui.get('open-tiktok').click();assert.equal(ui.navigations.length,0);assert.equal(ui.stored.length,0);
 ui.get('consent-decline').onclick();assert.equal(ui.get('consent-dialog').open,false);assert.equal(ui.get('home-view').hidden,false);
 ui.get('open-tiktok').click();assert.equal(ui.navigations.length,0);assert.equal(ui.reads.length,0);
 ui.get('home-start').onclick();assert.equal(ui.get('consent-dialog').open,true);
 await ui.get('consent-accept').onclick();assert.equal(ui.reads.length,1);assert.equal(ui.get('open-tiktok').attributes['aria-disabled'],'false');
 const reopened=await mount(shared,{},false,false);assert.equal(reopened.get('consent-dialog').open,true);assert.equal(reopened.reads.length,0);
});
test('toolbar revisit asks again, keeps the note and pauses feedback until acceptance',async()=>{
 const ui=await mount();ui.get('note').value='show cars';ui.get('note').oninput();ui.get('open-tiktok').click();
 const writes=ui.stored.length;ui.reopen();assert.equal(ui.get('consent-dialog').open,true);assert.equal(ui.get('note').value,'show cars');
 ui.get('feedback-more').onclick();ui.get('open-tiktok').click();assert.equal(ui.stored.length,writes);assert.equal(ui.navigations.length,1);
 await ui.get('consent-accept').onclick();ui.get('feedback-more').onclick();assert.equal(ui.stored.length,writes+1);
 ui.get('review-consent-footer').onclick();assert.equal(ui.get('consent-dialog').open,true);
 let prevented=false;ui.get('consent-dialog').oncancel({preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(ui.get('open-tiktok').attributes['aria-disabled'],'true');
});
test('delete from consent erases stored preferences and current check-in without accepting',async()=>{
 const shared={elevatokSearchCursor:8},appearance={elevatokTheme:'dark'},ui=await mount(shared,appearance);
 ui.get('note').value='show cars';ui.get('note').oninput();ui.get('open-tiktok').click();ui.get('review-consent').onclick();
 await ui.get('consent-delete').onclick();assert.equal(ui.get('consent-dialog').open,true);assert.equal(ui.get('note').value,'');assert.equal(shared.elevatokFeedback,undefined);assert.equal(shared.elevatokSearchCursor,undefined);assert.equal(appearance.elevatokTheme,undefined);assert.equal(ui.get('open-tiktok').attributes['aria-disabled'],'true');
});

test('before and after feelings adjust bounded preferences without recording ratings',()=>{
 const choice=relatedSearch('Stressed','','unwind',0),base=recordSearch(emptyLearning(),choice);
 const better=module.learnFromFeelings(base,choice,2,4),worse=module.learnFromFeelings(base,choice,4,2);
 assert.equal(better.weights['topic:'+choice.topic],1);assert.equal(worse.weights['topic:'+choice.topic],-1);
 assert.equal(relatedSearch('Stressed','','unwind',1,better).topic,choice.topic);
 assert.notEqual(relatedSearch('Stressed','','unwind',1,worse).topic,choice.topic);
 assert.deepEqual(module.learnFromFeelings(base,choice,3,3),base);
 assert.deepEqual(module.learnFromFeelings(base,choice,0,5),base);
 let saturated=base;for(let i=0;i<20;i++)saturated=module.learnFromFeelings(saturated,choice,1,5);
 assert.ok(Object.values(saturated.weights).every(value=>value<=5));assert.doesNotMatch(JSON.stringify(better),/before|after|rating/);
 for(const mood of moodOptions)assert.ok(module.headspaceTip(mood.value).length>30);
});
test('feeling check-in applies once to the opened search, preserves exclusions and can be skipped',async()=>{
 const shared={elevatokSearchCursor:0},ui=await mount(shared);
 ui.get('feeling-before').value='2';ui.get('open-tiktok').click();assert.equal(ui.get('reflection').hidden,false);
 ui.get('feeling-after').value='';ui.get('feeling-after').onchange();assert.match(ui.get('reflection-status').textContent,/Choose/);
 ui.get('feeling-after').value='4';ui.get('feeling-after').onchange();assert.equal(ui.get('reflection').hidden,true);
 assert.equal(shared.elevatokFeedback.weights['topic:nature'],1);
 const stored=JSON.stringify(shared),count=ui.stored.length;ui.get('feeling-after').onchange();assert.equal(ui.stored.length,count);assert.doesNotMatch(stored,/before|after|rating/);
 ui.get('note').value='show cars, no nature';ui.get('note').oninput();assert.match(new URL(ui.get('open-tiktok').href).searchParams.get('q'),/cars|automotive/);
 ui.get('feeling-before').value='3';ui.get('open-tiktok').click();ui.get('skip-feeling').onclick();assert.equal(ui.get('reflection').hidden,true);
 ui.get('feeling-after').value='1';ui.get('feeling-after').onchange();assert.equal(shared.elevatokFeedback.weights['topic:cars'],undefined);
 ui.nodes.find(node=>node.dataset.mood==='Lonely').onclick();assert.match(ui.get('headspace-tip').textContent,/message someone/);
});
test('deletion and declining clear transient ratings and pending reflection',async()=>{
 const ui=await mount();ui.get('feeling-before').value='2';ui.get('open-tiktok').click();ui.get('review-consent').onclick();await ui.get('consent-delete').onclick();
 assert.equal(ui.get('reflection').hidden,true);assert.equal(ui.get('feeling-before').value,'3');
 await ui.get('consent-accept').onclick();ui.get('feeling-before').value='3';ui.get('open-tiktok').click();ui.get('review-consent').onclick();ui.get('consent-decline').onclick();assert.equal(ui.get('reflection').hidden,true);
});


test('emoji headspaces have accessible names and check-in is restored only after consent',async()=>{
 const shared={},ui=await mount(shared);const happy=ui.nodes.find(node=>node.dataset.mood==='Happy');
 assert.equal(happy.attributes['aria-label'],'Happy');assert.equal(happy.attributes.title,'Happy');assert.notEqual(happy.textContent,'Happy');
 happy.onclick();ui.get('feeling-before').value='4';ui.get('feeling-before').oninput();assert.equal(shared.elevatokCheckin.mood,'Happy');assert.equal(shared.elevatokCheckin.feeling,4);
 const reopened=await mount(shared,{},false,false);assert.equal(reopened.reads.length,0);await reopened.get('consent-accept').onclick();assert.equal(reopened.get('feeling-before').value,'4');assert.equal(reopened.get('feeling-before').attributes['aria-valuetext'],'Good');
 reopened.get('review-consent').onclick();await reopened.get('consent-delete').onclick();assert.equal(shared.elevatokCheckin,undefined);
});
test('journey has eight ordered screens, sliders and no redundant continue button',async()=>{
 const ui=await mount();const html=ui.root.innerHTML;let last=-1;
 for(const id of ['mood','tip','before','experience','note','launch','feedback','reflect']){const position=html.indexOf('id="journey-'+id+'"');assert.ok(position>last,id);last=position;}
 assert.match(html,/id="feeling-before" type="range"/);assert.match(html,/id="feeling-after" type="range"/);assert.doesNotMatch(html,/flow-restart|Back to your headspace/);
 assert.doesNotMatch(html,/id="flow-/);assert.ok(ui.nodes.some(node=>node.className==='experience-choice'));
});


test('completed reflection returns to the beginning and saves the new current feeling',async()=>{
 const shared={},ui=await mount(shared);ui.get('feeling-before').value='2';ui.get('open-tiktok').click();assert.equal(ui.get('discover-view').dataset.activeStep,'feedback');ui.get('skip-feedback').onclick();
 ui.get('feeling-after').value='4';ui.get('feeling-after').onchange();assert.equal(ui.get('discover-view').dataset.activeStep,'mood');assert.equal(ui.get('feeling-before').value,'4');assert.equal(shared.elevatokCheckin.feeling,4);assert.match(ui.get('journey-status').textContent,/Check-in complete/);
 ui.nodes.find(node=>node.dataset.mood==='Happy').onclick();assert.equal(ui.get('discover-view').dataset.activeStep,'tip');assert.equal(ui.navigations.length,1);
});


test('vertical transitions animate scrollTop progressively and release snapping when complete',async()=>{
 const ui=await mount({}, {}, false, true, true),journey=ui.get('discover-view');
 ui.nodes.find(node=>node.dataset.mood==='Happy').onclick();ui.frame(0);ui.frame(625);assert.ok(journey.scrollTop>0&&journey.scrollTop<600);assert.equal(journey.style.scrollSnapType,'none');
 ui.frame(1250);assert.equal(journey.scrollTop,600);assert.equal(journey.style.scrollSnapType,undefined);
 ui.get('headspace-tips').onclick({});ui.frame(1400);ui.frame(2650);assert.equal(journey.scrollTop,1200);
});


test('choices advance automatically while typing and dragging do not interrupt input',async()=>{
 const ui=await mount(),journey=ui.get('discover-view');
 ui.nodes.find(node=>node.dataset.mood==='Calm').onclick();assert.equal(journey.dataset.activeStep,'tip');
 ui.get('headspace-tips').onclick({});assert.equal(journey.dataset.activeStep,'before');
 ui.get('feeling-before').value='4';ui.get('feeling-before').oninput();assert.equal(journey.dataset.activeStep,'before');ui.get('feeling-before').onchange();assert.equal(journey.dataset.activeStep,'experience');
 ui.nodes.find(node=>node.className==='experience-choice').onclick();assert.equal(journey.dataset.activeStep,'note');
 ui.get('note').value='show dogs';ui.get('note').oninput();assert.equal(journey.dataset.activeStep,'note');
 ui.get('note').onkeydown({key:'Enter',shiftKey:true,preventDefault(){}});assert.equal(journey.dataset.activeStep,'note');
 ui.get('note').onkeydown({key:'Enter',shiftKey:false,preventDefault(){}});assert.equal(journey.dataset.activeStep,'launch');
 assert.equal(ui.navigations.length,0);ui.get('open-tiktok').click();assert.equal(journey.dataset.activeStep,'feedback');ui.get('feedback-more').onclick();assert.equal(journey.dataset.activeStep,'reflect');
 ui.get('feeling-after').value='5';ui.get('feeling-after').oninput();assert.equal(journey.dataset.activeStep,'reflect');ui.get('feeling-after').onchange();assert.equal(journey.dataset.activeStep,'mood');
});


test('search feedback and feeling reflection occupy separate screens',async()=>{
 const ui=await mount(),html=ui.root.innerHTML;
 const feedbackStart=html.indexOf('id="journey-feedback"'),panel=html.indexOf('id="feedback"'),reflectStart=html.indexOf('id="journey-reflect"'),reflection=html.indexOf('id="reflection"');
 assert.ok(feedbackStart<panel&&panel<reflectStart&&reflectStart<reflection);
 ui.get('open-tiktok').click();assert.equal(ui.get('discover-view').dataset.activeStep,'feedback');ui.get('feedback-less').onclick();assert.equal(ui.get('discover-view').dataset.activeStep,'reflect');assert.equal(ui.navigations.length,1);
});

test('Try a different path reopens experience choices without losing the note or opening TikTok',async()=>{
 const ui=await mount();ui.get('note').value='show dogs, no news';ui.get('note').oninput();
 for(const id of ['change-direction','feedback-path']){ui.get(id).onclick();assert.equal(ui.get('discover-view').dataset.activeStep,'experience');assert.equal(ui.get('note').value,'show dogs, no news');assert.equal(ui.navigations.length,0);}
 assert.match(ui.root.innerHTML,/Try a different path/);
});


test('Previous and Back to start retain input and navigate to the expected screens',async()=>{
 const ui=await mount(),journey=ui.get('discover-view');assert.equal(ui.get('journey-previous').disabled,true);
 ui.nodes.find(node=>node.dataset.mood==='Happy').onclick();assert.equal(ui.get('journey-previous').disabled,false);ui.get('journey-previous').onclick();assert.equal(journey.dataset.activeStep,'mood');
 ui.get('change-direction').onclick();ui.nodes.find(node=>node.className==='experience-choice').onclick();ui.get('note').value='show cats';ui.get('note').oninput();ui.get('use-note').onclick();ui.get('journey-previous').onclick();assert.equal(journey.dataset.activeStep,'note');assert.equal(ui.get('note').value,'show cats');
 ui.get('journey-start').onclick();assert.equal(journey.dataset.activeStep,'mood');assert.equal(ui.get('note').value,'show cats');assert.equal(ui.get('journey-progress').textContent,'1 / 8');assert.equal(ui.navigations.length,0);
 assert.match(ui.get('feeling-before-label').innerHTML,/mood-face/);assert.match(ui.root.innerHTML,/slider-faces[^]*mood-face/);
});
