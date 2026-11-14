export const categories = ['nature','animals','cars','creativity','sports','gaming','technology','travel','fitness','food','music','comedy','education','fashion','beauty','dance','books','movies','science','satisfying','news','conflict'] as const;
export type Category = typeof categories[number];
export const moodOptions=[
 {value:'Stressed',icon:'〰',intention:'unwind'}, {value:'Sad',icon:'☁',intention:'lighten'},
 {value:'Happy',icon:'☀',intention:'lighten'}, {value:'Focused',icon:'◎',intention:'discover'},
 {value:'Anxious',icon:'≈',intention:'unwind'}, {value:'Tired',icon:'☾',intention:'unwind'},
 {value:'Bored',icon:'✧',intention:'discover'}, {value:'Lonely',icon:'♡',intention:'lighten'},
 {value:'Excited',icon:'↗',intention:'energize'}, {value:'Overwhelmed',icon:'≋',intention:'unwind'},
 {value:'Calm',icon:'❋',intention:'unwind'}
] as const;
export type Mood = typeof moodOptions[number]['value'];
export const intentions={
 unwind:['nature','satisfying','animals'],lighten:['comedy','animals','music'],discover:['science','education','creativity'],energize:['sports','music','dance'],
 comfort:['animals','food','music'],escape:['travel','nature','movies'],make:['creativity','food','fashion'],move:['fitness','dance','sports'],
 soundtrack:['music'],concentrate:['education','satisfying','music'],inspire:['creativity','technology','fashion'],play:['gaming','comedy','technology']
} as const;
export type Intention=keyof typeof intentions;
export const experienceOptions=[
 {value:'unwind',label:'Help me unwind',hint:'Something gentle, a little slower',icon:'🌿',title:'A softer place to land.',description:'Quiet moments, gentle company, and a little breathing room.',space:'QUIET'},
 {value:'lighten',label:'Lighten my day',hint:'A smile, a laugh, good company',icon:'☀',title:'Make room for a little joy.',description:'Small laughs, good company, and a lighter kind of scroll.',space:'LIGHTER'},
 {value:'discover',label:'Spark my curiosity',hint:'Fresh ideas and small discoveries',icon:'✧',title:'Follow a little curiosity.',description:'Fresh ideas and small discoveries, at your own pace.',space:'CURIOUS'},
 {value:'energize',label:'Give me a little energy',hint:'Movement, rhythm, momentum',icon:'↗',title:'Find a spark for your day.',description:'A little rhythm, movement, and momentum.',space:'ENERGETIC'},
 {value:'comfort',label:'Something comforting',hint:'Cozy food, animals, familiar sounds',icon:'☕',title:'A little comfort, just for you.',description:'Gentle company, cozy cooking, and a familiar melody.',space:'COZY'},
 {value:'escape',label:'Take me somewhere else',hint:'New places and little adventures',icon:'🌍',title:'Somewhere beyond the everyday.',description:'A change of scenery, an open landscape, a story to step into.',space:'EXPLORING'},
 {value:'make',label:'Help me make something',hint:'Small projects and hands-on ideas',icon:'🎨',title:'Make a little room for making.',description:'Creative projects, recipes, and ideas to try your own way.',space:'MAKING'},
 {value:'move',label:'Get me moving',hint:'Movement ideas, sport, and dance',icon:'👟',title:'A little movement, your way.',description:'Sport, dance, and movement ideas for whenever you feel like it.',space:'ACTIVE'},
 {value:'soundtrack',label:'Put me in a music mood',hint:'New sounds and live performances',icon:'🎵',title:'Find your next favorite sound.',description:'Melodies, performances, and musical discoveries.',space:'MUSICAL'},
 {value:'concentrate',label:'Help me settle into focus',hint:'Study ideas and quieter moments',icon:'◎',title:'One small thing at a time.',description:'Study inspiration, quiet sounds, and moments to slow your pace.',space:'FOCUSED'},
 {value:'inspire',label:'Give me fresh inspiration',hint:'Art, inventions, and personal style',icon:'💡',title:'An idea worth following.',description:'Creative processes, clever inventions, and a fresh point of view.',space:'INSPIRED'},
 {value:'play',label:'Let me switch off and play',hint:'Gaming, light laughs, and gadgets',icon:'🎮',title:'A little space to play.',description:'Playful worlds, light comedy, and fun discoveries.',space:'PLAYFUL'}
] as const;
export function defaultIntention(mood:Mood):Intention{return moodOptions.find(option=>option.value===mood)?.intention??'unwind';}
export type Profile = {mood:Mood; note:string; weights:Record<Category,number>; focus?:Category[]; excluded?:Category[];intention?:Intention};
export function searchTopics(profile:Profile){
 const normalized=normalizeProfile(profile);
 const desired=normalized.intention||normalized.focus!.length?normalized.focus!:categories.filter(c=>normalized.weights[c]>0);
 return desired.filter(c=>!normalized.excluded!.includes(c)&&normalized.weights[c]>=0).slice(0,5);
}
const terms:Record<Category,RegExp> = {
 nature:/\b(nature|naturetok|forest|ocean|garden|waterfall|hiking|sunset)\b/i,
 animals:/\b(animals?|animaltok|cats?|catsoftiktok|dogs?|dogsoftiktok|puppy|puppies|kitten|pets?)\b/i,
 cars:/\b(cars?|cartok|carsoftiktok|carcommunity|carspotting|carsofinstagram|supercars?|jdm|drifting|racing|engine|motorsport|automotive)\b/i,
 creativity:/\b(creativity|art|arttok|painting|drawing|crafts?|diy|creative|pottery)\b/i,
 sports:/\b(sports?|sportstok|football|soccer|basketball|nba|nfl|tennis|golf|volleyball|hockey|cricket)\b/i,
 gaming:/\b(gaming|gametok|gamer|videogames?|minecraft|fortnite|roblox|valorant|esports|playstation|xbox)\b/i,
 technology:/\b(technology|tech|techtok|gadgets?|coding|programming|software|robotics|computers?|smartphones?)\b/i,
 travel:/\b(travel|traveltok|tourism|vacation|holidays?|backpacking|destinations?|sightseeing)\b/i,
 fitness:/\b(fitness|fittok|gym|gymtok|workouts?|weightlifting|pilates|yoga|calisthenics|running)\b/i,
 food:/\b(food|foodtok|cooking|cookingtok|recipes?|baking|bakingtok|chefs?|restaurants?|desserts?|meals?)\b/i,
 music:/\b(music|musictok|songs?|singing|singers?|guitar|piano|concerts?|musicians?|albums?|rap|jazz)\b/i,
 comedy:/\b(comedy|comedytok|comedian|funny|humou?r|jokes?|memes?|skits?|standup)\b/i,
 education:/\b(education|edutok|learning|learnontiktok|studying|studytok|tutorials?|lessons?|history|languages?|maths?|mathematics)\b/i,
 fashion:/\b(fashion|fashiontok|outfits?|ootd|streetwear|clothing|styling|menswear|womenswear)\b/i,
 beauty:/\b(beauty|beautytok|makeup|makeuptutorial|skincare|haircare|hairstyles?|cosmetics?|nailart)\b/i,
 dance:/\b(dance|dancetok|dancing|dancers?|choreography|ballet|breakdance)\b/i,
 books:/\b(books?|booktok|reading|novels?|authors?|literature|poetry|bookrecommendations)\b/i,
 movies:/\b(movies?|movietok|films?|cinema|television|tvshows?|netflix|anime|animetok|kdrama)\b/i,
 science:/\b(science|sciencetok|physics|chemistry|biology|astronomy|space|nasa|experiments?)\b/i,
 satisfying:/\b(satisfying|oddlysatisfying|asmr|relaxing|relaxation|meditation|mindfulness|calming)\b/i,
 news:/\b(news|newstok|politics|election|war|breaking)\b/i,
 conflict:/\b(conflict|argument|fight|fighting|rage|insult|debate)\b/i
};
export function topicWords(text:string){return categories.flatMap(topic=>[...text.matchAll(new RegExp(terms[topic].source,'gi'))].map(hit=>({topic,word:hit[0],index:hit.index!})));}
function defaults(mood:Mood):Record<Category,number>{
 const weights=Object.fromEntries(categories.map(c=>[c,0])) as Record<Category,number>;
 Object.assign(weights,{nature:2,animals:2,creativity:1,conflict:-2});
 if(['Stressed','Sad','Anxious','Overwhelmed'].includes(mood)){weights.news=-3;weights.conflict=-4;weights.nature=3;weights.satisfying=2;}
 if(mood==='Happy'){weights.cars=1;weights.creativity=2;weights.comedy=2;}
 if(mood==='Focused'){weights.creativity=3;weights.education=2;weights.news=-2;}
 if(mood==='Tired'||mood==='Calm'){weights.nature=3;weights.satisfying=3;weights.news=-2;}
 if(mood==='Bored'){weights.science=2;weights.education=2;weights.gaming=2;}
 if(mood==='Lonely'){weights.animals=3;weights.comedy=2;weights.music=2;weights.news=-2;}
 if(mood==='Excited'){weights.sports=2;weights.dance=2;weights.music=2;}
 return weights;
}
// A small, explicit keyword grammar, not general language understanding.
export function parseRequests(note:string){
 const included=new Set<Category>(),excluded=new Set<Category>();
 for(const clause of note.toLowerCase().replace(/’/g,"'").split(/[.!?;,]|\b(?:but|however|instead)\b/)){
 const cues=[...clause.matchAll(/\b(don't(?:\s+(?:show|include|want))?|do not(?:\s+(?:show|include|want))?|no(?:\s+more)?|not|avoid|exclude|without|less|stop(?:\s+showing)?|show|include|more|want)\b/g)];
 for(const c of categories){
 for(const match of clause.matchAll(new RegExp(terms[c].source,'gi'))){
 const cue=cues.filter(cue=>cue.index!<=match.index!).at(-1)?.[0];
 if(cue&&/^(don't|do not|no|not|avoid|exclude|without|less|stop)\b/.test(cue)){excluded.add(c);included.delete(c);}
 else{included.add(c);excluded.delete(c);}
 }
 }
 }
 return {focus:[...included],excluded:[...excluded]};
}
export function normalizeProfile(profile:Profile):Profile{
 const requests=parseRequests(profile.note);
 if(!requests.focus.length&&profile.intention&&intentions[profile.intention])requests.focus=[...intentions[profile.intention]].filter(c=>!requests.excluded.includes(c));
 return {...profile,weights:{...defaults(profile.mood),...profile.weights},...requests};
}
export function createSearchProfile(mood:Mood,note:string,intention:Intention=defaultIntention(mood)):Profile{
 const profile=normalizeProfile({...createProfile(mood,note),intention});
 for(const c of profile.focus!)profile.weights[c]=4;
 return profile;
}
export function createProfile(mood:Mood,note:string):Profile {
 note=note.slice(0,500);
 const weights=defaults(mood),{focus,excluded}=parseRequests(note);
 for(const c of focus)weights[c]=4;
 for(const c of excluded)weights[c]=-5;
 return {mood,note,weights,focus,excluded};
}
export function classify(text:string,profile:Profile){
 const matched=categories.filter(c=>terms[c].test(text));
 profile=normalizeProfile(profile);
 const focus=profile.focus!,blocked=matched.filter(c=>profile.excluded!.includes(c));
 const offTopic=focus.length>0&&matched.length>0&&!matched.some(c=>focus.includes(c));
 const score=blocked.length?-5:offTopic?-2:matched.length?Math.min(...matched.map(c=>profile.weights[c])):0;
 const verdict=score<0?'skip':'allow';
 return {verdict,score,categories:matched,reasons:blocked.length?[`Excluded topics: ${blocked.join(', ')}`]:offTopic?[`Outside requested topics: ${focus.join(', ')}`]:matched.length?matched.map(c=>`${c}: ${profile.weights[c]}`):['Uncertain metadata — allowed by default']} as const;
}
export function adapt(profile:Profile,matched:readonly Category[],helpful:boolean):Profile {
 profile=normalizeProfile(profile);
 const weights={...profile.weights}; for(const c of matched)weights[c]=Math.max(-5,Math.min(5,weights[c]+(helpful?1:-1)));
 return {...profile,weights};
}
