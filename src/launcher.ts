// The toolbar button opens only our own interface. No website content is read.
let launchQueue:Promise<unknown>=Promise.resolve();
chrome.action.onClicked.addListener(()=>{
 launchQueue=launchQueue.catch(()=>{}).then(async()=>{
 const url=chrome.runtime.getURL('index.html');
 const saved=await chrome.storage.session.get('elevatokViewTab');
 if(Number.isInteger(saved.elevatokViewTab)){
 try{
 const tab=await chrome.tabs.get(saved.elevatokViewTab);
 if((tab.url??tab.pendingUrl)?.split('#')[0]!==url)throw new Error('The view was closed or navigated away');
 await chrome.tabs.update(tab.id!,{active:true,url:url+'#open-'+Date.now()+'-'+Math.random().toString(36).slice(2)});
 if(tab.windowId!==undefined)await chrome.windows.update(tab.windowId,{focused:true});
 return;
 }catch{/* Create a fresh local view if its old tab is no longer available. */}
 }
 const tab=await chrome.tabs.create({url,active:true});
 if(tab.id!==undefined)await chrome.storage.session.set({elevatokViewTab:tab.id});
 });
 return launchQueue;
});
