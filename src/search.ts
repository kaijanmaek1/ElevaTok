import {createSearchProfile,searchTopics,topicWords,type Category,type Mood,type Intention} from './engine';
const phrases:Record<Category,readonly string[]>={
 nature:['peaceful forest walks','ocean nature','sunset hiking','waterfall scenery','mountain nature','quiet garden walks'],animals:['funny animals','playful dogs','cute cats','puppy moments','wildlife animals','pets being silly'],
 cars:['cars and automotive design','supercars','jdm cars','classic cars','carspotting','car restorations'],creativity:['creative painting','pottery art','diy crafts','drawing ideas','handmade art','creative projects'],
 sports:['sports highlights','football skills','basketball moments','tennis rallies','volleyball highlights','hockey skills'],gaming:['gaming highlights','minecraft builds','cozy videogames','fortnite clips','gaming discoveries','indie games'],
 technology:['clever technology','coding projects','robotics gadgets','useful gadgets','software ideas','tech inventions'],travel:['travel destinations','backpacking adventures','vacation ideas','hidden travel spots','scenic travel','weekend travel'],
 fitness:['gentle yoga','fitness motivation','pilates routine','beginner workouts','stretching routine','movement ideas'],food:['cooking ideas','easy recipes','baking desserts','comfort food','quick meals','food discoveries'],
 music:['music performances','acoustic guitar','piano melodies','live music','music discoveries','instrumental music'],comedy:['lighthearted comedy','funny skits','wholesome memes','comedy moments','silly sketches','everyday humor'],
 education:['learn something new','history facts','language lessons','learning discoveries','educational explanations','study ideas'],fashion:['fashion inspiration','outfit ideas','streetwear styling','personal style','vintage fashion','clothing ideas'],
 beauty:['beauty routines','skincare tips','makeup ideas','haircare tips','nailart ideas','simple beauty'],dance:['dance choreography','dance practice','ballet moments','dance ideas','creative dancing','dance performances'],
 books:['book recommendations','booktok reading','poetry','reading discoveries','novel recommendations','cozy reading'],movies:['movie recommendations','cinema discussions','anime discoveries','film recommendations','movie reviews','cinema discoveries'],
 science:['science discoveries','space astronomy','science experiments','biology facts','physics explanations','chemistry discoveries'],satisfying:['calming asmr','oddly satisfying','relaxing sounds','gentle patterns','quiet meditation','satisfying art'],
 news:['news explainers','politics explained','news updates','current affairs news','news discussions','news analysis'],conflict:['debate discussions','conflict analysis','debate highlights','debate explanations','argument analysis','debate perspectives']
};
const subjects:Partial<Record<Category,readonly [RegExp,string][]>>={
 animals:[[/\b(dogs?|pupp(?:y|ies)|dogsoftiktok)\b/i,'dogs'],[/\b(cats?|kittens?|catsoftiktok)\b/i,'cats'],[/\b(horses?|ponies)\b/i,'horses'],[/\b(rabbits?|bunnies)\b/i,'rabbits'],[/\b(birds?|parrots?)\b/i,'birds']],
 cars:[[/\bbmw\b/i,'bmw cars'],[/\bporsche\b/i,'porsche cars'],[/\bferrari\b/i,'ferrari cars'],[/\baudi\b/i,'audi cars'],[/\bmercedes\b/i,'mercedes cars'],[/\btoyota\b/i,'toyota cars'],[/\bnissan\b/i,'nissan cars'],[/\blamborghini\b/i,'lamborghini cars'],[/\b(jdm|japanese cars?)\b/i,'jdm cars'],[/\b(classic|vintage)\s+cars?\b/i,'classic cars'],[/\belectric\s+cars?\b/i,'electric cars'],[/\bcarspotting\b/i,'carspotting'],[/\bdrifting\b/i,'car drifting']],
 music:[[/\bjazz\b/i,'jazz music'],[/\bpiano\b/i,'piano music'],[/\bguitar\b/i,'guitar music'],[/\bindie\s+music\b/i,'indie music'],[/\bclassical\s+music\b/i,'classical music'],[/\brap\b/i,'rap music']],
 food:[[/\b(vegan|plant based)\b/i,'vegan recipes'],[/\bvegetarian\b/i,'vegetarian recipes'],[/\bpasta\b/i,'pasta recipes'],[/\bpizza\b/i,'pizza recipes'],[/\bbaking\b/i,'baking'],[/\bdesserts?\b/i,'desserts']],
 nature:[[/\bforests?\b/i,'forest walks'],[/\b(beach(?:es)?|ocean)\b/i,'ocean scenery'],[/\bmountains?\b/i,'mountain scenery'],[/\bwaterfalls?\b/i,'waterfalls'],[/\b(northern lights|aurora)\b/i,'northern lights']],
 gaming:[[/\bminecraft\b/i,'minecraft'],[/\bfortnite\b/i,'fortnite'],[/\broblox\b/i,'roblox'],[/\bchess\b/i,'chess'],[/\bcozy\s+games?\b/i,'cozy games']],
 travel:[[/\bjapan\b/i,'japan travel'],[/\bfinland\b/i,'finland travel'],[/\bitaly\b/i,'italy travel'],[/\bparis\b/i,'paris travel'],[/\bbackpacking\b/i,'backpacking']],
 creativity:[[/\bcrochet\b/i,'crochet'],[/\bknitting\b/i,'knitting'],[/\bpainting\b/i,'painting'],[/\bpottery\b/i,'pottery'],[/\bdrawing\b/i,'drawing']],
 sports:[[/\bfootball\b/i,'football'],[/\bbasketball\b/i,'basketball'],[/\btennis\b/i,'tennis'],[/\bskiing\b/i,'skiing'],[/\bhockey\b/i,'hockey'],[/\bskateboarding\b/i,'skateboarding'],[/\bsurfing\b/i,'surfing'],[/\bmountain biking\b/i,'mountain biking']],
 fitness:[[/\byoga\b/i,'yoga'],[/\bpilates\b/i,'pilates'],[/\brunning\b/i,'running'],[/\bstretching\b/i,'stretching']],
 technology:[[/\bcoding\b/i,'coding projects'],[/\brobotics\b/i,'robotics'],[/\bgadgets?\b/i,'gadgets']],
 books:[[/\bfantasy\s+books?\b/i,'fantasy books'],[/\bpoetry\b/i,'poetry']],
 movies:[[/\banime\b/i,'anime'],[/\bcomedy\s+movies?\b/i,'comedy movies']],
 science:[[/\b(astronomy|space)\b/i,'space astronomy'],[/\bphysics\b/i,'physics'],[/\bbiology\b/i,'biology']],
 beauty:[[/\bskincare\b/i,'skincare'],[/\bmakeup\b/i,'makeup'],[/\b(?:haircare|hairstyles?)\b/i,'haircare']],
 fashion:[[/\bstreetwear\b/i,'streetwear'],[/\bvintage\s+fashion\b/i,'vintage fashion']],
 dance:[[/\bballet\b/i,'ballet'],[/\bchoreography\b/i,'dance choreography']],
 satisfying:[[/\basmr\b/i,'asmr'],[/\bmeditation\b/i,'meditation']]
};
const negative=/^(don't|do not|no|not|avoid|exclude|without|less|stop)\b/;
function requests(note:string){
 const positive=new Map<Category,Set<string>>(),excludedTopics=new Set<Category>(),excludedSubjects=new Set<string>();
 for(const clause of note.slice(0,500).toLowerCase().replace(/’/g,"'").split(/[.!?;,]|\b(?:but|however|instead)\b/)){
 const cues=[...clause.matchAll(/\b(don't(?:\s+(?:show|include|want))?|do not(?:\s+(?:show|include|want))?|no(?:\s+more)?|not|avoid|exclude|without|less|stop(?:\s+showing)?|show|include|more|want)\b/g)];
 const isNegative=(index:number)=>negative.test(cues.filter(c=>c.index!<=index).at(-1)?.[0]??'');
 const specifics:{topic:Category;phrase:string;start:number;end:number;blocked:boolean}[]=[];
 for(const [topic,patterns] of Object.entries(subjects) as [Category,readonly [RegExp,string][]][]){for(const [pattern,phrase] of patterns){for(const hit of clause.matchAll(new RegExp(pattern.source,'gi')))specifics.push({topic,phrase,start:hit.index!,end:hit.index!+hit[0].length,blocked:isNegative(hit.index!)});}}
 for(const item of specifics){if(item.blocked)excludedSubjects.add(item.phrase);else{if(!positive.has(item.topic))positive.set(item.topic,new Set());positive.get(item.topic)!.add(item.phrase);}}
 // Category names are separate from specific exclusions: "dogs, no cats" still allows dogs.
 for(const {topic,word,index:position} of topicWords(clause)){
 if(specifics.some(s=>s.topic===topic&&position>=s.start&&position<s.end))continue;
 if(word==='funny'&&specifics.some(s=>!s.blocked))continue;
 if(isNegative(position))excludedTopics.add(topic);else if(!positive.has(topic))positive.set(topic,new Set());
 }

 if(/\bfunny\b/.test(clause)&&!isNegative(clause.indexOf('funny'))&&!specifics.some(s=>!s.blocked)&&!positive.size)positive.set('comedy',new Set());
 }
 return {positive,excludedTopics,excludedSubjects};
}
export function hasRecognizedRequest(note:string){const parsed=requests(note);return parsed.positive.size+parsed.excludedTopics.size+parsed.excludedSubjects.size>0;}
export type SearchChoice={query:string;topic:Category;subject:string|null;key:string};
export function searchCandidates(mood:Mood,note:string,intention:Intention):SearchChoice[]{
 const parsed=requests(note),fallback=searchTopics(createSearchProfile(mood,'',intention));
 const topics=parsed.positive.size?[...parsed.positive.keys()]:fallback;
 const result:SearchChoice[][]=[];
 for(const topic of topics){
 if(parsed.excludedTopics.has(topic))continue;
 const specific=[...(parsed.positive.get(topic)??[])].filter(p=>!parsed.excludedSubjects.has(p));
 if(parsed.positive.get(topic)?.size&&!specific.length)continue;
 if(specific.length){
 const qualifiers=topic==='cars'?['highlights','design','carspotting','restorations','road trips','details']:topic==='food'?['ideas','tutorials','inspiration','easy recipes','step by step','discoveries']:topic==='music'?['performances','live sessions','discoveries','instrumentals','practice','melodies']:['moments','highlights','discoveries','ideas','clips','favorites'];
 result.push(Array.from({length:6},(_,i)=>specific.map(subject=>{
 const funny=/\bfunny\b/i.test(note)&&!/(?:no|not|avoid)\s+funny/i.test(note)&&topic==='animals'?'funny ':'';
 const red=/\bred\b/i.test(note)&&!/(?:no|not|avoid)\s+red/i.test(note)&&topic==='cars'?'red ':'';
 return {query:`${funny}${red}${subject} ${qualifiers[i]}`,topic,subject,key:`${topic}|${subject}|${i}`};
 })).flat());
 }else result.push(phrases[topic].map((query,index)=>({query,topic,subject:null,key:`${topic}|default|${index}`})));
 }
 const flat=Array.from({length:Math.max(0,...result.map(r=>r.length))},(_,i)=>result.map(r=>r[i]).filter(Boolean)).flat();
 return flat.filter((choice,index)=>flat.findIndex(other=>other.query===choice.query)===index&&!Object.values(subjects).flatMap(patterns=>patterns??[]).some(([pattern,subject])=>parsed.excludedSubjects.has(subject)&&pattern.test(choice.query)));
}
export function searchOptions(mood:Mood,note:string,intention:Intention):string[]{return searchCandidates(mood,note,intention).map(choice=>choice.query);}
export type SearchSelection=Pick<SearchChoice,'topic'|'subject'|'key'>;
export type SearchLearning={weights:Record<string,number>;recent:string[];last:SearchSelection&{vote?:'more'|'less'}|null;undo:Record<string,number>|null};
export function emptyLearning():SearchLearning{return {weights:{},recent:[],last:null,undo:null};}
export function normalizeLearning(input:Partial<SearchLearning>|null|undefined):SearchLearning{
 const result=emptyLearning();if(!input||typeof input!=='object')return result;
 const cleanWeights=(values:Record<string,number>|undefined|null)=>Object.fromEntries(Object.entries(values??{}).filter(([key,value])=>/^(topic|subject|choice):/.test(key)&&key.length<160&&Number.isFinite(value)).slice(-250).map(([key,value])=>[key,Math.max(-5,Math.min(5,value))]));
 result.weights=cleanWeights(input.weights);
 result.recent=Array.isArray(input.recent)?input.recent.filter(value=>typeof value==='string'&&value.length<130).slice(-6):[];
 const last=input.last;
 if(last&&typeof last.topic==='string'&&last.topic in phrases&&typeof last.key==='string'&&last.key.startsWith(last.topic+'|')&&(last.subject===null||typeof last.subject==='string'&&last.subject.length<100))result.last={topic:last.topic,subject:last.subject,key:last.key,...(last.vote==='more'||last.vote==='less'?{vote:last.vote}:{})};
 if(input.undo&&result.last?.vote)result.undo=cleanWeights(input.undo);
 return result;
}
export function recordSearch(learning:SearchLearning,choice:SearchSelection):SearchLearning{return {...learning,recent:[...learning.recent,choice.key].slice(-6),last:{topic:choice.topic,subject:choice.subject,key:choice.key},undo:null};}
export function giveFeedback(learning:SearchLearning,more:boolean):SearchLearning{
 if(!learning.last||learning.last.vote)return learning;
 const weights={...learning.weights},last=learning.last,change=more?1:-1;
 for(const [key,multiplier] of [['topic:'+last.topic,1],...(last.subject?[['subject:'+last.subject,2]]:[]),['choice:'+last.key,2]] as [string,number][]){weights[key]=Math.max(-5,Math.min(5,(weights[key]??0)+change*multiplier));}
 return {...learning,weights,last:{...last,vote:more?'more':'less'},undo:{...learning.weights}};
}
export function undoFeedback(learning:SearchLearning):SearchLearning{
 if(!learning.undo||!learning.last)return learning;
 return {...learning,weights:{...learning.undo},last:{topic:learning.last.topic,subject:learning.last.subject,key:learning.last.key},undo:null};
}
export function relatedSearch(mood:Mood,note:string,intention:Intention,cursor=0,learning:SearchLearning=emptyLearning()):SearchChoice&{url:string}|null{
 const candidates=searchCandidates(mood,note,intention);if(!candidates.length)return null;
 const offset=Number.isSafeInteger(cursor)&&cursor>=0?cursor:0;
 let pool=candidates;
 if(Object.keys(learning.weights).length){
 const score=(choice:SearchChoice)=>(learning.weights['topic:'+choice.topic]??0)+(choice.subject?(learning.weights['subject:'+choice.subject]??0):0);
 const best=Math.max(...candidates.map(score));
 // Keep some exploration rather than locking permanently to the first liked topic.
 if(offset%4!==3)pool=candidates.filter(choice=>score(choice)===best);
 const unseen=pool.filter(choice=>!learning.recent.includes(choice.key));
 if(unseen.length)pool=unseen;
 else{const notLast=pool.filter(choice=>choice.key!==learning.recent.at(-1));if(notLast.length)pool=notLast;}
 const variantBest=Math.max(...pool.map(choice=>learning.weights['choice:'+choice.key]??0));
 const preferred=pool.filter(choice=>(learning.weights['choice:'+choice.key]??0)===variantBest);if(preferred.length)pool=preferred;
 }
 const choice=pool[offset%pool.length];
 return {...choice,url:'https://www.tiktok.com/search?q='+encodeURIComponent(choice.query)};
}

// Ratings are transient; only bounded derived preferences leave page memory.
export function learnFromFeelings(learning:SearchLearning,choice:SearchSelection,before:number,after:number):SearchLearning{
 if(![before,after].every(value=>Number.isInteger(value)&&value>=1&&value<=5))return learning;
 const change=Math.sign(after-before),weights={...learning.weights};
 if(!change)return learning;
 for(const key of ['topic:'+choice.topic,...(choice.subject?['subject:'+choice.subject]:[]),'choice:'+choice.key])weights[key]=Math.max(-5,Math.min(5,(weights[key]??0)+change));
 return {...learning,weights,undo:null};
}
export function headspaceTip(mood:Mood):string{
 const tips:Record<Mood,string>={
 Stressed:'Try a short screen break. Notice a few sights and sounds around you, without needing to change how you feel.',
 Sad:'Consider one manageable act of connection: send a message to someone you trust, or arrange a little time together.',
 Happy:'Make room for something you enjoy offline too, such as sharing a good moment with someone.',
 Focused:'Choose one small next task, and leave room for a gentle movement break.',
 Anxious:'If it feels comfortable, notice your surroundings and let your breathing stay natural. You can stop if this feels unhelpful.',
 Tired:'You can choose a screen break instead of another video. Consider a quiet pause and return when you want to.',
 Bored:'Try a small new skill or creative activity away from the screen, with no need to get it right.',
 Lonely:'A video can be company for a moment. You could also message someone you trust or plan a shared activity.',
 Excited:'Channel some energy into an enjoyable activity, like a little movement or making something.',
 Overwhelmed:'Choose just one small next step. A pause or a message to someone you trust can be enough for now.',
 Calm:'Notice what feels pleasant around you, or take a short walk if that is comfortable and accessible.'};
 return tips[mood];
}
