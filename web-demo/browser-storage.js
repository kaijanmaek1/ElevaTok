// Browser-only session storage adapter. No network or user data uploads.
(()=>{
 const memory={};
 const area=(store,prefix)=>({
 async get(keys){const result={};for(const key of (Array.isArray(keys)?keys:[keys])){try{const raw=store.getItem(prefix+key);if(raw!==null)result[key]=JSON.parse(raw);}catch{if(key in memory)result[key]=memory[key];}}return result;},
 async set(values){for(const [key,value] of Object.entries(values)){memory[key]=value;try{store.setItem(prefix+key,JSON.stringify(value));}catch{}}},
 async remove(keys){for(const key of keys){delete memory[key];try{store.removeItem(prefix+key);}catch{}}}
 });
 let session,local;try{session=window.sessionStorage;local=window.localStorage;}catch{session=local={getItem(){return null},setItem(){throw Error('unavailable')},removeItem(){}};}
 window.chrome=window.chrome||{};if(!window.chrome.storage)window.chrome.storage={session:area(session,'elevatokDemo:'),local:area(local,'')};
})();