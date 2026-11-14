import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const source=stripTypeScriptTypes(readFileSync('src/engine.ts','utf8'));
const {createProfile,createSearchProfile,classify,normalizeProfile,adapt,searchTopics,moodOptions,defaultIntention,experienceOptions,intentions}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('show cars permits car hashtags and skips recognized unrelated clips',()=>{
 const profile=createProfile('Happy','show cars');
 for(const text of ['#cars','#carsoftiktok #fyp','#CarTok','#supercars #carspotting'])assert.equal(classify(text,profile).verdict,'allow');
 for(const text of ['#dogs funny puppy','#nature forest','#painting'])assert.equal(classify(text,profile).verdict,'skip');
 assert.equal(classify('#fyp #viral',profile).verdict,'allow','unknown content stays allowed');
 assert.match(classify('#dogs',profile).reasons[0],/Outside requested topics/);
 const legacy={...profile};delete legacy.focus;
 assert.equal(classify('nature',legacy).verdict,'skip','existing saved notes also activate focus');
});
test('all added topics support requests, hashtags and filtering',()=>{
 const examples={sports:'football',gaming:'minecraft',technology:'techtok',travel:'traveltok',fitness:'gymtok',food:'recipes',music:'guitar',comedy:'memes',education:'learnontiktok',fashion:'ootd',beauty:'skincare',dance:'choreography',books:'booktok',movies:'anime',science:'nasa',satisfying:'asmr'};
 for(const [category,tag] of Object.entries(examples)){
 const profile=createProfile('Happy',`show ${category}`);
 assert.ok(profile.focus.includes(category),category);
 assert.equal(classify('#'+tag,profile).verdict,'allow',category);
 assert.equal(classify('#cars',profile).verdict,'skip',category+' excludes unrelated recognized clips');
 }
});
test('negative requests exclude topics instead of requesting them',()=>{
 for(const note of ["don't show cars",'do not show cars','no more cars','avoid cars','less cars','stop showing cars']){
 const profile=createProfile('Happy',note);
 assert.ok(!profile.focus.includes('cars'),note);
 assert.equal(classify('#cars',profile).verdict,'skip',note);
 assert.equal(classify('nature',profile).verdict,'allow',note);
 }
 const mixed=createProfile('Happy',"show gaming and music, but don't show cars or news");
 assert.equal(classify('#minecraft',mixed).verdict,'allow');
 assert.equal(classify('#guitar',mixed).verdict,'allow');
 assert.equal(classify('#cars #minecraft',mixed).verdict,'skip');
});
test('old profiles get finite weights for new categories and retain prior feedback',()=>{
 const old={mood:'Happy',note:'show gaming',weights:{cars:-3,nature:2}};
 const profile=normalizeProfile(old);
 assert.equal(profile.weights.cars,-3);
 assert.equal(classify('#minecraft',old).verdict,'allow');
 assert.equal(adapt(old,['gaming'],false).weights.gaming,-1);
 assert.ok(Object.values(profile.weights).every(Number.isFinite));
});
test('mood and intention create a collection without typing a search',()=>{
 const quiet=createSearchProfile('Stressed','');
 assert.deepEqual(searchTopics(quiet),['nature','satisfying','animals']);
 assert.equal(classify('forest nature',quiet).verdict,'allow');
 assert.equal(classify('gaming',quiet).verdict,'skip');
 const curious=createSearchProfile('Focused','','discover');
 assert.equal(classify('science physics',curious).verdict,'allow');
 const custom=createSearchProfile('Happy','cars, no news','lighten');
 assert.deepEqual(searchTopics(custom),['cars']);
 assert.equal(classify('cars news',custom).verdict,'skip');
 const excluded=createSearchProfile('Stressed','no animals','unwind');
 assert.ok(!searchTopics(excluded).includes('animals'));
 assert.equal(excluded.note,'no animals','private note is not replaced with generated keywords');
});
test('focus supports several topics and preserves mood exclusions',()=>{
 const profile=createProfile('Stressed','cars and funny animals');
 assert.equal(classify('#dogs',profile).verdict,'allow');
 assert.equal(classify('#cars',profile).verdict,'allow');
 assert.equal(classify('cars argument fight',profile).verdict,'skip');
 assert.equal(classify('nature',createProfile('Happy','')).verdict,'allow');
});
test('every mood has a usable collection and matching intention',()=>{
 assert.equal(moodOptions.length,11);
 for(const {value,intention} of moodOptions){const profile=createSearchProfile(value,'');assert.equal(defaultIntention(value),intention);assert.ok(searchTopics(profile).length>0,value);assert.ok(Object.values(profile.weights).every(Number.isFinite));}
 assert.equal(defaultIntention('Excited'),'energize');assert.equal(defaultIntention('Bored'),'discover');
 assert.equal(classify('news argument',createProfile('Anxious','')).verdict,'skip');
});
test('all twelve experience choices have labels and distinct working topic mixes',()=>{
 assert.equal(experienceOptions.length,12);
 assert.equal(new Set(experienceOptions.map(option=>option.value)).size,12);
 assert.equal(new Set(Object.values(intentions).map(topics=>[...topics].sort().join(','))).size,12);
 for(const option of experienceOptions){
 assert.ok(option.label&&option.title&&option.description&&option.space);
 const profile=createSearchProfile('Calm','',option.value);
 assert.deepEqual(searchTopics(profile),[...intentions[option.value]]);
 assert.ok(searchTopics(profile).length);
 for(const topic of intentions[option.value])assert.equal(classify(topic,profile).verdict,'allow',option.value+' '+topic);
 }
 assert.equal(classify('cars',createSearchProfile('Happy','show cars','soundtrack')).verdict,'allow','optional interests still override experience defaults');
 assert.equal(classify('music',createSearchProfile('Happy','no music','comfort')).verdict,'skip','exclusions still apply');
});
