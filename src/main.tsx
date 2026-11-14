import React,{useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {mountSearch} from './search-ui';
function App(){const root=useRef<HTMLDivElement>(null);useEffect(()=>root.current?mountSearch(root.current):undefined,[]);return <div ref={root}/>;}
createRoot(document.getElementById('root')!).render(<App/>);
