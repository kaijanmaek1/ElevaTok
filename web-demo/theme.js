// Apply the display preference before rendering; no check-in data is accessed.
(()=>{
 let theme=globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light';
 try{const saved=localStorage.getItem('elevatokTheme');if(saved==='light'||saved==='dark')theme=saved;}catch{}
 document.documentElement.dataset.theme=theme;
})();
