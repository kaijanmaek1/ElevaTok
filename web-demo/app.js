(()=>{const categories = ['nature','animals','cars','creativity','sports','gaming','technology','travel','fitness','food','music','comedy','education','fashion','beauty','dance','books','movies','science','satisfying','news','conflict']         ;
                                                 
const moodOptions=[
 {value:'Stressed',icon:'〰',intention:'unwind'}, {value:'Sad',icon:'☁',intention:'lighten'},
 {value:'Happy',icon:'☀',intention:'lighten'}, {value:'Focused',icon:'◎',intention:'discover'},
 {value:'Anxious',icon:'≈',intention:'unwind'}, {value:'Tired',icon:'☾',intention:'unwind'},
 {value:'Bored',icon:'✧',intention:'discover'}, {value:'Lonely',icon:'♡',intention:'lighten'},
 {value:'Excited',icon:'↗',intention:'energize'}, {value:'Overwhelmed',icon:'≋',intention:'unwind'},
 {value:'Calm',icon:'❋',intention:'unwind'}
]         ;
                                                       
const intentions={
 unwind:['nature','satisfying','animals'],lighten:['comedy','animals','music'],discover:['science','education','creativity'],energize:['sports','music','dance'],
 comfort:['animals','food','music'],escape:['travel','nature','movies'],make:['creativity','food','fashion'],move:['fitness','dance','sports'],
 soundtrack:['music'],concentrate:['education','satisfying','music'],inspire:['creativity','technology','fashion'],play:['gaming','comedy','technology']
}         ;
                                              
const experienceOptions=[
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
]         ;
function defaultIntention(mood     )          {return moodOptions.find(option=>option.value===mood)?.intention??'unwind';}
                                                                                                                                              
function searchTopics(profile        ){
 const normalized=normalizeProfile(profile);
 const desired=normalized.intention||normalized.focus .length?normalized.focus :categories.filter(c=>normalized.weights[c]>0);
 return desired.filter(c=>!normalized.excluded .includes(c)&&normalized.weights[c]>=0).slice(0,5);
}
const terms                         = {
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
function topicWords(text       ){return categories.flatMap(topic=>[...text.matchAll(new RegExp(terms[topic].source,'gi'))].map(hit=>({topic,word:hit[0],index:hit.index })));}
function defaults(mood     )                        {
 const weights=Object.fromEntries(categories.map(c=>[c,0]))                           ;
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
function parseRequests(note       ){
 const included=new Set          (),excluded=new Set          ();
 for(const clause of note.toLowerCase().replace(/’/g,"'").split(/[.!?;,]|\b(?:but|however|instead)\b/)){
 const cues=[...clause.matchAll(/\b(don't(?:\s+(?:show|include|want))?|do not(?:\s+(?:show|include|want))?|no(?:\s+more)?|not|avoid|exclude|without|less|stop(?:\s+showing)?|show|include|more|want)\b/g)];
 for(const c of categories){
 for(const match of clause.matchAll(new RegExp(terms[c].source,'gi'))){
 const cue=cues.filter(cue=>cue.index <=match.index ).at(-1)?.[0];
 if(cue&&/^(don't|do not|no|not|avoid|exclude|without|less|stop)\b/.test(cue)){excluded.add(c);included.delete(c);}
 else{included.add(c);excluded.delete(c);}
 }
 }
 }
 return {focus:[...included],excluded:[...excluded]};
}
function normalizeProfile(profile        )        {
 const requests=parseRequests(profile.note);
 if(!requests.focus.length&&profile.intention&&intentions[profile.intention])requests.focus=[...intentions[profile.intention]].filter(c=>!requests.excluded.includes(c));
 return {...profile,weights:{...defaults(profile.mood),...profile.weights},...requests};
}
function createSearchProfile(mood     ,note       ,intention          =defaultIntention(mood))        {
 const profile=normalizeProfile({...createProfile(mood,note),intention});
 for(const c of profile.focus )profile.weights[c]=4;
 return profile;
}
function createProfile(mood     ,note       )         {
 note=note.slice(0,500);
 const weights=defaults(mood),{focus,excluded}=parseRequests(note);
 for(const c of focus)weights[c]=4;
 for(const c of excluded)weights[c]=-5;
 return {mood,note,weights,focus,excluded};
}
function classify(text       ,profile        ){
 const matched=categories.filter(c=>terms[c].test(text));
 profile=normalizeProfile(profile);
 const focus=profile.focus ,blocked=matched.filter(c=>profile.excluded .includes(c));
 const offTopic=focus.length>0&&matched.length>0&&!matched.some(c=>focus.includes(c));
 const score=blocked.length?-5:offTopic?-2:matched.length?Math.min(...matched.map(c=>profile.weights[c])):0;
 const verdict=score<0?'skip':'allow';
 return {verdict,score,categories:matched,reasons:blocked.length?[`Excluded topics: ${blocked.join(', ')}`]:offTopic?[`Outside requested topics: ${focus.join(', ')}`]:matched.length?matched.map(c=>`${c}: ${profile.weights[c]}`):['Uncertain metadata — allowed by default']}         ;
}
function adapt(profile        ,matched                    ,helpful        )         {
 profile=normalizeProfile(profile);
 const weights={...profile.weights}; for(const c of matched)weights[c]=Math.max(-5,Math.min(5,weights[c]+(helpful?1:-1)));
 return {...profile,weights};
}

const phrases                                   ={
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
const subjects                                                     ={
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
function requests(note       ){
 const positive=new Map                      (),excludedTopics=new Set          (),excludedSubjects=new Set        ();
 for(const clause of note.slice(0,500).toLowerCase().replace(/’/g,"'").split(/[.!?;,]|\b(?:but|however|instead)\b/)){
 const cues=[...clause.matchAll(/\b(don't(?:\s+(?:show|include|want))?|do not(?:\s+(?:show|include|want))?|no(?:\s+more)?|not|avoid|exclude|without|less|stop(?:\s+showing)?|show|include|more|want)\b/g)];
 const isNegative=(index       )=>negative.test(cues.filter(c=>c.index <=index).at(-1)?.[0]??'');
 const specifics                                                                         =[];
 for(const [topic,patterns] of Object.entries(subjects)                                           ){for(const [pattern,phrase] of patterns){for(const hit of clause.matchAll(new RegExp(pattern.source,'gi')))specifics.push({topic,phrase,start:hit.index ,end:hit.index +hit[0].length,blocked:isNegative(hit.index )});}}
 for(const item of specifics){if(item.blocked)excludedSubjects.add(item.phrase);else{if(!positive.has(item.topic))positive.set(item.topic,new Set());positive.get(item.topic) .add(item.phrase);}}
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
function hasRecognizedRequest(note       ){const parsed=requests(note);return parsed.positive.size+parsed.excludedTopics.size+parsed.excludedSubjects.size>0;}
                                                                                      
function searchCandidates(mood     ,note       ,intention          )               {
 const parsed=requests(note),fallback=searchTopics(createSearchProfile(mood,'',intention));
 const topics=parsed.positive.size?[...parsed.positive.keys()]:fallback;
 const result                 =[];
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
function searchOptions(mood     ,note       ,intention          )         {return searchCandidates(mood,note,intention).map(choice=>choice.query);}
                                                                       
                                                                                                                                                           
function emptyLearning()               {return {weights:{},recent:[],last:null,undo:null};}
function normalizeLearning(input                                       )               {
 const result=emptyLearning();if(!input||typeof input!=='object')return result;
 const cleanWeights=(values                                     )=>Object.fromEntries(Object.entries(values??{}).filter(([key,value])=>/^(topic|subject|choice):/.test(key)&&key.length<160&&Number.isFinite(value)).slice(-250).map(([key,value])=>[key,Math.max(-5,Math.min(5,value))]));
 result.weights=cleanWeights(input.weights);
 result.recent=Array.isArray(input.recent)?input.recent.filter(value=>typeof value==='string'&&value.length<130).slice(-6):[];
 const last=input.last;
 if(last&&typeof last.topic==='string'&&last.topic in phrases&&typeof last.key==='string'&&last.key.startsWith(last.topic+'|')&&(last.subject===null||typeof last.subject==='string'&&last.subject.length<100))result.last={topic:last.topic,subject:last.subject,key:last.key,...(last.vote==='more'||last.vote==='less'?{vote:last.vote}:{})};
 if(input.undo&&result.last?.vote)result.undo=cleanWeights(input.undo);
 return result;
}
function recordSearch(learning               ,choice                )               {return {...learning,recent:[...learning.recent,choice.key].slice(-6),last:{topic:choice.topic,subject:choice.subject,key:choice.key},undo:null};}
function giveFeedback(learning               ,more        )               {
 if(!learning.last||learning.last.vote)return learning;
 const weights={...learning.weights},last=learning.last,change=more?1:-1;
 for(const [key,multiplier] of [['topic:'+last.topic,1],...(last.subject?[['subject:'+last.subject,2]]:[]),['choice:'+last.key,2]]                     ){weights[key]=Math.max(-5,Math.min(5,(weights[key]??0)+change*multiplier));}
 return {...learning,weights,last:{...last,vote:more?'more':'less'},undo:{...learning.weights}};
}
function undoFeedback(learning               )               {
 if(!learning.undo||!learning.last)return learning;
 return {...learning,weights:{...learning.undo},last:{topic:learning.last.topic,subject:learning.last.subject,key:learning.last.key},undo:null};
}
function relatedSearch(mood     ,note       ,intention          ,cursor=0,learning               =emptyLearning())                               {
 const candidates=searchCandidates(mood,note,intention);if(!candidates.length)return null;
 const offset=Number.isSafeInteger(cursor)&&cursor>=0?cursor:0;
 let pool=candidates;
 if(Object.keys(learning.weights).length){
 const score=(choice             )=>(learning.weights['topic:'+choice.topic]??0)+(choice.subject?(learning.weights['subject:'+choice.subject]??0):0);
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
function learnFromFeelings(learning               ,choice                ,before       ,after       )               {
 if(![before,after].every(value=>Number.isInteger(value)&&value>=1&&value<=5))return learning;
 const change=Math.sign(after-before),weights={...learning.weights};
 if(!change)return learning;
 for(const key of ['topic:'+choice.topic,...(choice.subject?['subject:'+choice.subject]:[]),'choice:'+choice.key])weights[key]=Math.max(-5,Math.min(5,(weights[key]??0)+change));
 return {...learning,weights,undo:null};
}
function headspaceTip(mood     )       {
 const tips                    ={
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

function mountSearch(root            ){
 const icon=(paths       )=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
 const face=(mood       )=>{
 const mouths                      ={Stressed:'M8 16l2-2 2 2 2-2 2 2',Sad:'M8 16q4-5 8 0',Happy:'M8 14q4 5 8 0',Focused:'M9 15h6',Anxious:'M9 16q3-3 6 0',Tired:'M9 10h1m4 0h1M10 15h4',Bored:'M8 15h8',Lonely:'M9 16q3-4 6 0',Excited:'M8 13q4 7 8 0Z',Overwhelmed:'M8 8l3 3m0-3-3 3m5-3 3 3m0-3-3 3M9 16h6',Calm:'M8 10q1.5 2 3 0m2 0q1.5 2 3 0M9 15q3 2 6 0'};
 return '<svg class="mood-face" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/>'+(!['Calm','Tired','Overwhelmed'].includes(mood)?'<path d="M8.5 9.5h.1m6.8 0h.1" stroke-width="2.2"/>':'')+'<path d="'+(mouths[mood]??mouths.Calm)+'"/></svg>';
 };
 const icons={discover:icon('<path d="m4 10 16-6-6 16-3-7-7-3Z"/><path d="m11 13 4-4"/>'),forward:icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),arrow:icon('<path d="M5 12h14M13 6l6 6-6 6"/>'),rotate:icon('<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 6.1A8 8 0 0 1 19.6 9M4.4 15a8 8 0 0 0 13.5 2.9"/>'),plus:icon('<path d="M12 5v14M5 12h14"/>'),sun:icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),moon:icon('<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>'),spark:icon('<path d="m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z"/>')};
 root.innerHTML=`<dialog id="consent-dialog" class="consent-dialog" aria-labelledby="consent-title" aria-describedby="consent-description"><div class="consent-heading"><span class="eyebrow">JUNCTION 2026 DEMO</span><h2 id="consent-title" tabindex="-1">Your choice, every time.</h2></div><div id="consent-description"><p>ElevaTok uses your selected mood and optional note locally to suggest TikTok searches. Only generated topic words are sent to TikTok when you click Open TikTok. Your full note is not saved. Your selected headspace and current feeling rating are remembered locally for this tab session.</p><p>Search topics, feedback preferences and recent template identifiers stay in tab-session storage to personalize future searches. Your light/dark preference is saved separately on this device. ElevaTok does not read your TikTok activity. The current headspace and before rating are saved for this tab session. After ratings adjust session topic preferences and become your new saved current feeling when you complete a reflection.</p><p>Use fictional inputs for the demo and avoid private health details. Agreeing allows this local personalization, including any sensitive information you choose to enter. Declining pauses personalized searches; use Delete stored data to erase existing feedback and this check-in.</p></div><a href="privacy.html" target="_blank" rel="noopener" class="consent-privacy">Read the full privacy notice</a><p id="consent-status" role="status"></p><div class="consent-actions"><button id="consent-decline" class="secondary" type="button">Decline</button><button id="consent-accept" class="primary" type="button">Agree and continue</button></div><button id="consent-delete" class="text-button" type="button">Delete stored data</button></dialog><main class="app"><aside class="sidebar"><a id="home-logo" class="brand" href="#home" aria-label="ElevaTok home"><span class="brand-mark">${icons.arrow}</span>ElevaTok</a><div class="sidebar-section">YOUR WORKSPACE</div><nav aria-label="Workspace"><a id="home-nav" class="nav-item" href="#home" aria-current="false">${icons.spark}Home</a><a id="discover-nav" class="nav-item" href="#checkin" aria-current="page">${icons.discover}Discover</a></nav><div class="sidebar-bottom"><div class="local-label"><span aria-hidden="true"></span> A little more intentional</div><p>Your check-in stays here.<br>Your videos open on TikTok.</p><a class="privacy-link" href="privacy.html" target="_blank" rel="noopener">Privacy & how it works</a><button id="review-consent" type="button" class="consent-settings">Consent & data choices</button></div></aside><div class="workspace"><header><div class="breadcrumb">ElevaTok <span>/</span> <strong id="view-title">Discover</strong></div><div class="header-actions"><div class="theme-picker" role="group" aria-label="Appearance"><button id="theme-light" type="button" aria-pressed="true">${icons.sun} Light</button><button id="theme-dark" type="button" aria-pressed="false">${icons.moon} Dark</button></div><button id="fullscreen" type="button" class="fullscreen-button" aria-pressed="false">Full screen</button></div></header><div class="content"><section id="home-view" class="home-page" hidden aria-labelledby="home-title"><span class="eyebrow">${icons.spark} MEET ELEVATOK</span><h1 id="home-title" tabindex="-1">A little intention.<br>A better place to start.</h1><p class="home-lead">ElevaTok is a mood-guided search companion that helps you choose a more intentional starting point on TikTok. Instead of beginning with whatever appears in your feed, you begin with how you feel, what you need, and what you would enjoy seeing.</p><div class="home-description"><p>Some days you might want a laugh. On others, a quiet moment, a creative idea, a little movement, or something new to learn might feel more appealing. ElevaTok turns those choices into related searches and opens the results directly on TikTok, where you can watch and save videos using TikTok’s own tools.</p><p>ElevaTok doesn’t replace TikTok or build a second video feed. It helps you find a direction, try alternatives, and refine future searches through a few simple choices. You stay in control of when you search and which videos you choose to watch.</p></div><h2 class="home-section-title">From a check-in to your next discovery</h2><div class="home-steps"><article><span class="home-number">01</span><h2>Choose your headspace</h2><p>Start with one of eleven moods, including Stressed, Happy, Focused, Tired, Bored, Lonely, and Calm. Your choice suggests an experience that may suit that headspace. It is a starting preference, not a diagnosis or an assessment of your mental health.</p></article><article><span class="home-number">02</span><h2>Decide what would feel good</h2><p>Pick from twelve experiences, such as Help me unwind, Lighten my day, Spark my curiosity, or Get me moving. Each suggests a different group of topics. You can change the suggested experience whenever you want, regardless of the mood you selected.</p></article><article><span class="home-number">03</span><h2>Add a little detail</h2><p>The optional note makes supported interests more specific. You can ask for BMW cars, jazz, Japan travel, or funny dogs, and name topics you would rather leave out. Recognized requests take priority over the experience’s defaults. The matching uses keyword rules, so complex or unfamiliar wording may not be understood.</p></article><article><span class="home-number">04</span><h2>Open your results on TikTok</h2><p>Click Open TikTok when you are ready. ElevaTok opens related search results in a new TikTok tab, without a search-phrase preview. Only generated topic and subject words are sent in the search link; your full note and mood label stay here. TikTok selects and ranks the videos.</p></article><article><span class="home-number">05</span><h2>Try a different direction</h2><p>Each search can use another related phrase. Try another direction also changes the suggestion while keeping your note intact, and waits for you to click Open TikTok before navigating. Different phrases can lead to new discoveries, but TikTok may still return overlapping or unrelated videos.</p></article><article><span class="home-number">06</span><h2>Shape the next search</h2><p>Optionally rate your overall feeling before opening TikTok, then check in afterward. Reported improvement gently favors similar topics; worsening reduces their preference, and no change leaves weights unchanged. These are personal reports, not evidence of treatment benefit. Return to ElevaTok and use More like this or Less like this to rate your last search. One tap adjusts preferences for related topics, subjects, and phrase styles. Undo reverses the last vote before another search is opened. Feedback guides future searches, while explicit new requests and exclusions still take priority.</p></article></div><section class="home-detail-section"><h2>Your workspace, your pace</h2><p>Discover returns to your check-in without clearing its current note. The ElevaTok logo, Home, and About ElevaTok bring you back to this introduction. Use Light or Dark to choose the appearance, and Full screen for a distraction-free view. Press Esc or Exit full screen to return to the normal browser view.</p><p>The extension’s toolbar button opens ElevaTok in a full tab and reuses that tab when possible. This lets you leave your check-in open while exploring TikTok and return to give feedback without starting over.</p></section><section class="home-detail-section"><h2>What stays private</h2><p>Your full note is not saved. Your selected headspace and current feeling rating are saved locally for this tab session. Your note stays in the open page and clears when you close or reload it. Derived topic preferences, recent search-template identifiers, and last-search feedback are kept for the tab session so learning and variety can continue between view openings. Your theme choice is remembered separately on this device.</p><p>ElevaTok does not read your TikTok account, watch history, likes, comments, or saved videos. Feedback describes the last search you opened through ElevaTok, not an individual video. You can clear the learned preferences and known older-version data with Reset feedback and delete previous data under How ElevaTok works.</p></section><section class="home-detail-section home-limits"><h2>A helpful starting point, not a content guarantee</h2><p>ElevaTok does not filter TikTok’s results, change your For You recommendations, create Favorites collections, or guarantee that unwanted topics will never appear. Exclusions guide the suggested search, but TikTok controls what is shown. TikTok also applies its own privacy practices when you visit its website.</p><p>This is an independent Junction 2026 prototype for intentional discovery. It is not affiliated with TikTok, medical care, or a clinically validated way to improve your mood.</p></section><div class="home-actions"><button id="home-start" type="button" class="primary">${icons.forward} Start discovering</button><a class="home-privacy" href="privacy.html" target="_blank" rel="noopener">Read the full privacy information</a></div></section><div id="discover-view" class="journey" aria-label="Your check-in journey"><form id="checkin"><section id="journey-mood" class="journey-step"><div class="step-inner"><span class="journey-kicker">01 / 07 · CHECK IN</span><h1 id="journey-title" tabindex="-1">Find your headspace.</h1><p id="journey-status" class="journey-status" role="status"></p><p class="journey-lead">Choose the face that feels like you. Pause over a face to see its meaning.</p><fieldset><legend><span class="step">01</span> How are you feeling?</legend><div id="moods" class="moods emoji-moods"></div></fieldset><button id="flow-mood" class="secondary flow-next" type="button">Continue <span aria-hidden="true">↓</span></button></div></section><section id="journey-tip" class="journey-step"><div class="step-inner"><span class="journey-kicker">02 / 07 · A LITTLE SPACE</span><h1 tabindex="-1">A small step, just for you.</h1><section id="headspace-tips" class="wellbeing-card" aria-labelledby="tip-title"><h2 id="tip-title">A small step for your headspace</h2><p id="headspace-tip"></p><p class="wellbeing-caption">Optional everyday ideas, not treatment advice. If difficult feelings persist or worsen, consider contacting your care team or a trusted professional.</p><small class="tip-source">Inspired by <a href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/" target="_blank" rel="noopener noreferrer">NHS: 5 steps to mental wellbeing</a>. Adapted for your selected headspace.</small></section><button id="flow-tip" class="secondary flow-next" type="button">Continue <span aria-hidden="true">↓</span></button></div></section><section id="journey-before" class="journey-step"><div class="step-inner"><span class="journey-kicker">03 / 07 · BEFORE YOU EXPLORE</span><h1 tabindex="-1">Where are you right now?</h1><div class="before-field"><label for="feeling-before">Before you explore: how do you feel overall?</label><div class="feeling-slider"><output id="feeling-before-label" for="feeling-before" aria-live="polite">😐 In between</output><input id="feeling-before" type="range" min="1" max="5" step="1" value="3" aria-label="Current overall feeling" aria-valuetext="In between"><div class="slider-faces" aria-hidden="true"><span>😞</span><span>🙁</span><span>😐</span><span>🙂</span><span>😄</span></div></div><p class="wellbeing-caption">Optional. Return here afterward to compare. Your current feeling and headspace are remembered for this tab session. After reflection, the new feeling becomes your saved current feeling for the session.</p></div><button id="flow-before" class="secondary flow-next" type="button">Continue <span aria-hidden="true">↓</span></button></div></section><section id="journey-experience" class="journey-step"><div class="step-inner"><span class="journey-kicker">04 / 07 · YOUR DIRECTION</span><h1 tabindex="-1">Make room for what you need.</h1><div class="experience-field"><label for="experience"><span class="step">02</span> What would feel good right now?</label><div class="select-wrap"><select id="experience"></select><svg class="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg></div></div><button id="flow-experience" class="secondary flow-next" type="button">Continue <span aria-hidden="true">↓</span></button></div></section><section id="journey-note" class="journey-step"><div class="step-inner"><span class="journey-kicker">05 / 07 · MAKE IT YOURS</span><h1 tabindex="-1">Follow your curiosity.</h1><div class="note-field"><label for="note"><span class="step">03</span> Anything you’d like to see? <span class="optional">Optional</span></label><div class="composer"><textarea id="note" maxlength="500" rows="3" placeholder="Funny dogs, a little nature, no news today."></textarea></div></div><button id="flow-note" class="secondary flow-next" type="button">Ready when you are <span aria-hidden="true">↓</span></button></div></section><section id="journey-launch" class="journey-step"><div class="step-inner"><span class="journey-kicker">06 / 07 · EXPLORE</span><h1 tabindex="-1">A new direction awaits.</h1><p class="journey-lead">Explore at your own pace. Come back here afterward for a moment of reflection.</p><div class="actions"><button id="another" type="button" class="secondary">${icons.rotate} Try another direction</button><a id="open-tiktok" class="primary" target="_blank" rel="noopener noreferrer">${icons.forward}<span>Open TikTok</span></a></div><p id="status" role="status">Your check-in stays on this page.</p><button id="flow-launch" class="secondary flow-next" type="button">Continue to reflection <span aria-hidden="true">↓</span></button></div></section></form><section id="journey-reflect" class="journey-step"><div class="step-inner"><span class="journey-kicker">07 / 07 · CHECK BACK IN</span><h1 tabindex="-1">How did that feel?</h1><p class="journey-lead">Your experience matters more than another scroll. Open a search first, then reflect here.</p><section id="feedback" class="feedback-panel" hidden><div class="feedback-heading"><strong>Your last search</strong><span id="feedback-context"></span></div><div class="feedback-buttons"><button id="feedback-more" type="button">More like this</button><button id="feedback-less" type="button">Less like this</button></div><div class="feedback-footer"><span id="feedback-status" role="status">One tap helps shape your next searches.</span><button id="feedback-undo" type="button" hidden>Undo</button></div></section><section id="reflection" class="wellbeing-card" hidden aria-labelledby="reflection-title"><h2 id="reflection-title">A moment to check back in</h2><p id="reflection-context"></p><label for="feeling-after">How do you feel after exploring?</label><div class="feeling-slider"><output id="feeling-after-label" for="feeling-after" aria-live="polite">😐 In between</output><input id="feeling-after" type="range" min="1" max="5" step="1" value="3" aria-label="After overall feeling" aria-valuetext="In between"><div class="slider-faces" aria-hidden="true"><span>😞</span><span>🙁</span><span>😐</span><span>🙂</span><span>😄</span></div></div><div class="reflection-actions"><button id="save-feeling" type="button" class="secondary">Use this check-in</button><button id="skip-feeling" type="button" class="text-button">Skip</button></div><p id="reflection-status" role="status"></p><p class="wellbeing-caption">This reflects your experience, not proof that a search caused a change. You can stop scrolling at any time.</p></section><details class="about"><summary>How ElevaTok works</summary><p>We turn supported interests and your chosen experience into related topic words. Clicking Open TikTok sends those words to TikTok’s search page. Your full note and mood label are not sent to TikTok. Your current headspace and feeling are remembered locally for this session.</p><p>Session-only preferences help vary your searches and learn from your feedback. Watching and saving videos happen on TikTok. ElevaTok doesn’t read videos, filter results, create Favorites folders, or change recommendations.</p><p>This is keyword matching, not general language understanding or medical care. TikTok may show unrelated content.</p><button id="clear-legacy" type="button" class="text-button">Reset feedback and delete previous data</button></details><p class="journey-end">You made time to check in. That is enough for now.</p></div></section></div><footer><button id="about-link" type="button" class="about-link">About ElevaTok</button><button id="review-consent-footer" type="button" class="about-link">Consent & data choices</button><span class="demo-credit">Junction 2026 demo</span><span class="creator-credit">Created by Datamonnit</span><span>Independent prototype. Not affiliated with TikTok.</span></footer></div></div></main>`;
 const find=                       (selector       )=>root.querySelector   (selector) ;
 const note=find                     ('#note'),experience=find                   ('#experience'),open=find                   ('#open-tiktok'),status=find             ('#status');
 let mood     ='Stressed',cursor=0,ready=false,revision=0,disposed=false,accepted=false,consentEpoch=0;
 let learning=emptyLearning();
 let followUp                     =null;
 let currentFeeling=3;
 let pendingFeeling                                            =null;
 const searchNote=()=>note.value.trim()?note.value:followUp?.subject??followUp?.topic??'';
 function showView(view                  ){
 find             ('#home-view').hidden=view!=='home';find             ('#discover-view').hidden=view!=='discover';
 find             ('#view-title').textContent=view==='home'?'Home':'Discover';
 find                   ('#home-nav').setAttribute('aria-current',view==='home'?'page':'false');
 find                   ('#discover-nav').setAttribute('aria-current',view==='discover'?'page':'false');
 const target=find             (view==='home'?'#home-title':'#journey-title');target.focus?.({preventScroll:true});
 find             (view==='home'?'#home-view':'#discover-view').scrollIntoView?.({behavior:'auto',block:'start'});
 }
 for(const id of ['#home-logo','#home-nav','#about-link'])find             (id).onclick=event=>{event.preventDefault();showView('home');};
 for(const id of ['#discover-nav','#home-start'])find             (id).onclick=event=>{event.preventDefault();showView('discover');};
 for(const option of experienceOptions){const item=document.createElement('option');item.value=option.value;item.textContent=option.label;experience.append(item);}
 const fullscreen=find                   ('#fullscreen');
 let theme               ='light';
 function setTheme(value               ,remember=false){
 theme=value;document.documentElement.dataset.theme=value;
 find                   ('#theme-light').setAttribute('aria-pressed',String(value==='light'));
 find                   ('#theme-dark').setAttribute('aria-pressed',String(value==='dark'));
 if(remember)try{globalThis.localStorage?.setItem('elevatokTheme',value);}catch{/* Appearance still works when persistence is unavailable. */}
 }
 try{const saved=globalThis.localStorage?.getItem('elevatokTheme');theme=saved==='dark'||saved==='light'?saved:globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light';}catch{theme='light';}
 setTheme(theme);
 find                   ('#theme-light').onclick=()=>setTheme('light',true);
 find                   ('#theme-dark').onclick=()=>setTheme('dark',true);
 const syncFullscreen=()=>{fullscreen.textContent=document.fullscreenElement?'Exit full screen':'Full screen';fullscreen.setAttribute('aria-pressed',String(Boolean(document.fullscreenElement)));};
 fullscreen.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();syncFullscreen();}catch{status.textContent='Full screen is unavailable here. You can still use the full browser tab.';}};
 document.addEventListener('fullscreenchange',syncFullscreen);syncFullscreen();
 experience.value=defaultIntention(mood);
 function update(){
 if(!accepted||!ready){open.removeAttribute('href');open.setAttribute('aria-disabled','true');status.textContent=accepted?'Preparing your search...':'Personalization paused. Open Consent & data choices to continue.';return;}
 find             ('#headspace-tip').textContent=headspaceTip(mood);
 const result=relatedSearch(mood,searchNote(),experience.value             ,cursor,learning);
 for(const button of root.querySelectorAll                   ('[data-mood]'))button.setAttribute('aria-pressed',String(button.dataset.mood===mood));
 if(result){open.href=result.url;open.setAttribute('aria-disabled','false');status.textContent=followUp&&!note.value.trim()?'A follow-up to your last liked search is ready. Change your check-in to choose another direction.':note.value.trim()&&!hasRecognizedRequest(note.value)?'No supported topic recognized in your note. Using your chosen experience.':'Ready. Your videos will open directly on TikTok.';}
 else{open.removeAttribute('href');open.setAttribute('aria-disabled','true');status.textContent='No related topic remains. Adjust your interests or choose another experience.';}
 }
 function drawFeedback(){
 const panel=find             ('#feedback'),last=learning.last;panel.hidden=!last;
 find                   ('#feedback-more').disabled=Boolean(last?.vote);
 find                   ('#feedback-less').disabled=Boolean(last?.vote);
 find                   ('#feedback-more').setAttribute('aria-pressed',String(last?.vote==='more'));
 find                   ('#feedback-less').setAttribute('aria-pressed',String(last?.vote==='less'));
 find                   ('#feedback-undo').hidden=!learning.undo;
 find             ('#feedback-context').textContent=last?last.topic:'';
 find             ('#feedback-status').textContent=last?.vote?'Updated. Your next related searches will adapt.':'One tap helps shape your next searches.';
 }
 function saveLearning(){if(!accepted||!ready)return;try{if(globalThis.chrome?.storage?.session)void chrome.storage.session.set({elevatokFeedback:learning}).catch(()=>{});}catch{/* Feedback still works for this open page. */}}
 for(const [id,more] of [['#feedback-more',true],['#feedback-less',false]]         )find                   (id).onclick=()=>{
 if(!accepted||!ready||!learning.last||learning.last.vote)return;
 learning=giveFeedback(learning,more);if(!note.value.trim()&&revision===0)followUp=more?learning.last:null;saveLearning();drawFeedback();update();
 };
 find                   ('#feedback-undo').onclick=()=>{if(!accepted||!ready)return;learning=undoFeedback(learning);followUp=null;saveLearning();drawFeedback();update();};
 for(const option of moodOptions){const button=document.createElement('button');button.type='button';button.dataset.mood=option.value;button.innerHTML=face(option.value);button.setAttribute('aria-label',option.value);button.setAttribute('title',option.value);button.setAttribute('data-tooltip',option.value);button.onclick=()=>{mood=option.value;experience.value=defaultIntention(mood);followUp=null;revision++;saveCheckin();update();};find             ('#moods').append(button);}
 const feelingWords=['Very low','Low','In between','Good','Very good'],feelingFaces=['😞','🙁','😐','🙂','😄'];
 function syncFeeling(which                 ){
 const slider=find                  ('#feeling-'+which),value=Number(slider.value);
 const label=feelingWords[value-1]??'In between';slider.setAttribute('aria-valuetext',label);
 find             ('#feeling-'+which+'-label').textContent=(feelingFaces[value-1]??'😐')+' '+label;
 }
 function saveCheckin(){if(!accepted||!ready)return;try{void globalThis.chrome?.storage?.session?.set({elevatokCheckin:{mood,feeling:currentFeeling}}).catch(()=>{});}catch{}}
 find                  ('#feeling-before').value='3';find                  ('#feeling-after').value='3';
 find                  ('#feeling-before').oninput=()=>{if(!accepted||!ready)return;currentFeeling=Number(find                  ('#feeling-before').value);syncFeeling('before');saveCheckin();};
 find                  ('#feeling-after').oninput=()=>syncFeeling('after');
 const destinations={mood:'tip',tip:'before',before:'experience',experience:'note',note:'launch',launch:'reflect'};
 let travelFrame=0;
 function travelTo(step       ,wrap=false){
 const journey=find             ('#discover-view'),target=find             ('#journey-'+step);
 const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 if(travelFrame&&globalThis.cancelAnimationFrame)globalThis.cancelAnimationFrame(travelFrame);
 journey.dataset.activeStep=step;
 const finish=()=>{travelFrame=0;journey.style?.removeProperty('scroll-snap-type');target.querySelector             ('h1')?.focus?.({preventScroll:true});};
 if(!globalThis.requestAnimationFrame||reduced||wrap){target.scrollIntoView?.({behavior:'instant'                  ,block:'start',inline:'nearest'});finish();}
 else{
 const start=journey.scrollTop,end=target.offsetTop-journey.offsetTop;let began                 ;
 journey.style.scrollSnapType='none';
 const frame=(time       )=>{if(disposed){finish();return;}began??=time;const t=Math.min(1,(time-began)/1250),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;journey.scrollTop=start+(end-start)*ease;if(t<1)travelFrame=globalThis.requestAnimationFrame(frame);else finish();};
 travelFrame=globalThis.requestAnimationFrame(frame);
 }
 if(!reduced)target.querySelector             ('.step-inner')?.animate?.([{opacity:0,transform:'perspective(1000px) translateY(42px) translateZ(-90px) scale(.96)',filter:'blur(5px)'},{opacity:1,transform:'perspective(1000px) translateY(0) translateZ(0) scale(1)',filter:'blur(0)'}],{duration:1450,easing:'cubic-bezier(.16,1,.3,1)'});
 }
 for(const [from,to] of Object.entries(destinations))find                   ('#flow-'+from).onclick=()=>{if(!accepted||!ready)return;travelTo(to);};
 note.oninput=()=>{followUp=null;revision++;update();};experience.onchange=()=>{followUp=null;revision++;update();};
 find                   ('#another').onclick=()=>{if(!accepted||!ready)return;revision++;cursor++;update();status.textContent='Another direction is ready. Your note is unchanged.';};
 open.onclick=event=>{
 const result=accepted&&ready?relatedSearch(mood,searchNote(),experience.value             ,cursor,learning):null;
 if(!result){event.preventDefault();return;}
 open.href=result.url;
 const before=Number(find                   ('#feeling-before').value);
 pendingFeeling=before>=1&&before<=5?{choice:{topic:result.topic,subject:result.subject,key:result.key},before}:null;
 find             ('#reflection').hidden=!pendingFeeling;find                  ('#feeling-after').value=String(currentFeeling);syncFeeling('after');find             ('#reflection-status').textContent='';
 find             ('#reflection-context').textContent=pendingFeeling?'Before exploring: '+before+'/5. This check-in applies to your latest search.':'';
 currentFeeling=before;saveCheckin();
 learning=recordSearch(learning,result);cursor++;revision++;drawFeedback();travelTo('reflect',true);
 // Store derived search-topic feedback only, never the full note, mood label or URL.
 try{if(globalThis.chrome?.storage?.session)void chrome.storage.session.set({elevatokSearchCursor:cursor,elevatokFeedback:learning}).catch(()=>{});}catch{/* Rotation can stay in memory if session storage is unavailable. */}
 // Keep this click's URL until native link navigation has occurred.
 setTimeout(()=>{if(!disposed)update();},0);
 };
 find                   ('#save-feeling').onclick=()=>{
 if(!accepted||!ready||!pendingFeeling)return;
 const after=Number(find                   ('#feeling-after').value);
 if(!Number.isInteger(after)||after<1||after>5){find             ('#reflection-status').textContent='Choose an after feeling, or skip this check-in.';return;}
 const before=pendingFeeling.before;learning=learnFromFeelings(learning,pendingFeeling.choice,before,after);pendingFeeling=null;saveLearning();drawFeedback();update();
 find             ('#reflection').hidden=true;
 currentFeeling=after;find                  ('#feeling-before').value=String(after);syncFeeling('before');saveCheckin();
 find             ('#status').textContent=after===before?'Check-in complete. Your feeling was unchanged, so preferences stayed the same.':after>before?'Check-in complete. Similar topics get a small preference boost.':'Check-in complete. Similar topics get less preference. Consider a screen break or reaching out to someone you trust.';
 find             ('#journey-status').textContent=find             ('#status').textContent;travelTo('mood',true);
 };
 find                   ('#skip-feeling').onclick=()=>{pendingFeeling=null;find             ('#reflection').hidden=true;};
 find                 ('#checkin').onsubmit=event=>{event.preventDefault();if(open.hasAttribute('href'))open.click();};
 async function eraseData(clearCheckin=false){
 const localKeys=['moodloop','moodloopCollection','moodloopDiscovery','quicktokSpaces'];
 const sessionKeys=['quicktokDemoState','quicktokDemoSpaces','quicktokDemoConsent','elevatokSearchCursor','elevatokFeedback','elevatokCheckin'];
 try{
 if(globalThis.chrome?.storage){await chrome.storage.local.remove(localKeys);await chrome.storage.session.remove(sessionKeys);}
 else{for(const key of localKeys)localStorage.removeItem(key);for(const key of sessionKeys)sessionStorage.removeItem(key);}
 pendingFeeling=null;find             ('#reflection').hidden=true;currentFeeling=3;find                  ('#feeling-before').value='3';find                  ('#feeling-after').value='3';syncFeeling('before');syncFeeling('after');cursor=Math.floor(Math.random()*1000000);learning=emptyLearning();followUp=null;if(clearCheckin){note.value='';mood='Stressed';experience.value=defaultIntention(mood);try{globalThis.localStorage?.removeItem('elevatokTheme');}catch{}}drawFeedback();revision++;update();status.textContent='Stored feedback and previous data deleted.';return true;
 }catch{status.textContent='Could not delete old data. Removing the previous extension also removes its browser storage.';return false;}
 };
 find                   ('#clear-legacy').onclick=()=>eraseData();
 const consent=find                   ('#consent-dialog');
 function requestConsent(){
 accepted=false;ready=false;consentEpoch++;update();
 find             ('#consent-status').textContent='';
 if(!consent.open)consent.showModal();find             ('#consent-title').focus?.();
 }
 function declineConsent(){pendingFeeling=null;find             ('#reflection').hidden=true;currentFeeling=3;find                  ('#feeling-before').value='3';find                  ('#feeling-after').value='3';syncFeeling('before');syncFeeling('after');accepted=false;ready=false;consentEpoch++;learning=emptyLearning();followUp=null;drawFeedback();update();consent.close();showView('home');}
 find                   ('#consent-decline').onclick=declineConsent;
 consent.oncancel=event=>{event.preventDefault();declineConsent();};
 for(const id of ['#review-consent','#review-consent-footer'])find                   (id).onclick=requestConsent;
 find                   ('#consent-delete').onclick=async()=>{
 accepted=false;ready=false;consentEpoch++;
 const deleted=await eraseData(true);find             ('#consent-status').textContent=deleted?'Stored preferences and the current check-in were deleted. You can decline or start again.':'Deletion failed. Please try again or remove the extension.';
 };
 find                   ('#consent-accept').onclick=async()=>{
 accepted=true;ready=false;const epoch=++consentEpoch;consent.close();showView('discover');update();
 try{const result=globalThis.chrome?.storage?.session?await chrome.storage.session.get(['elevatokSearchCursor','elevatokFeedback','elevatokCheckin']):{};
 if(disposed||!accepted||epoch!==consentEpoch)return;
 learning=normalizeLearning(result.elevatokFeedback);
 const saved=result.elevatokCheckin;
 if(revision===0&&saved&&moodOptions.some(option=>option.value===saved.mood)&&Number.isInteger(saved.feeling)&&saved.feeling>=1&&saved.feeling<=5){mood=saved.mood;currentFeeling=saved.feeling;experience.value=defaultIntention(mood);}
 find                  ('#feeling-before').value=String(currentFeeling);syncFeeling('before');
 if(learning.last?.vote==='more'&&revision===0)followUp=learning.last;
 if(revision===0)cursor=Number.isSafeInteger(result.elevatokSearchCursor)&&result.elevatokSearchCursor>=0?result.elevatokSearchCursor:Math.floor(Math.random()*1000000);
 }catch{if(revision===0)cursor=Math.floor(Math.random()*1000000);}
 if(disposed||!accepted||epoch!==consentEpoch)return;
 ready=true;drawFeedback();update();
 };
 const onReopen=()=>{if(globalThis.location?.hash.startsWith('#open-'))requestConsent();};
 globalThis.addEventListener?.('hashchange',onReopen);
 find                   ('#discover-nav').onclick=event=>{event.preventDefault();if(!accepted){requestConsent();return;}showView('discover');};
 find                   ('#home-start').onclick=()=>{if(!accepted){requestConsent();return;}showView('discover');};
 requestConsent();
 return()=>{disposed=true;if(travelFrame&&globalThis.cancelAnimationFrame)globalThis.cancelAnimationFrame(travelFrame);consentEpoch++;if(consent.open)consent.close();globalThis.removeEventListener?.('hashchange',onReopen);document.removeEventListener('fullscreenchange',syncFullscreen);root.replaceChildren();};
}

mountSearch(document.getElementById('root') );

})();