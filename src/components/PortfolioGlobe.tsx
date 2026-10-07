"use client";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNetwork } from './NetworkPreferences';
import MediaLoading from './MediaLoading';
class GlobeBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(){this.props.onError();}
  render(){return this.state.failed?null:this.props.children;}
}
export default function PortfolioGlobe({go,paused}:{go:(n:number)=>void;paused:boolean}){
  const ref=useRef<HTMLDivElement>(null);const[visible,setVisible]=useState(false);const[loaded,setLoaded]=useState(false);
  const network=useNetwork();const[ready,setReady]=useState(false);const[error,setError]=useState(false);const[attempt,setAttempt]=useState(0);
  const[Globe,setGlobe]=useState<typeof import('./PortfolioGlobeScene').default|null>(null);
  const onReady=useCallback(()=>setReady(true),[]),onError=useCallback(()=>{setError(true);setLoaded(false);},[]);
  useEffect(()=>{
    if(!loaded)return;let current=true;
    void import('./PortfolioGlobeScene').then(module=>{if(current)setGlobe(()=>module.default);},()=>{if(current)onError();});
    return()=>{current=false;};
  },[loaded,attempt,onError]);
  useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));observer.observe(el);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(visible&&!network.economy&&network.online&&!error)setLoaded(true);},[visible,network.economy,network.online,error]);
  useEffect(()=>{if(!loaded||ready)return;const timer=setTimeout(onError,30000);return()=>clearTimeout(timer);},[loaded,ready,onError]);
  return <div className="portfolio-globe" ref={ref}>
    <div className="globe-stage" data-media-controls aria-label="Interactive satellite globe. Drag to rotate.">
      {!ready&&visible&&<img className="globe-preview" src="/mg-group/visuals/v2/earth-day.webp" alt="Satellite composite world map"/>}
      {loaded&&Globe&&<GlobeBoundary key={attempt} onError={onError}><Globe go={go} paused={paused || !visible} onReady={onReady}/></GlobeBoundary>}
      {loaded&&!ready&&<MediaLoading ar="جارٍ تحميل الخريطة" en="Loading interactive globe"/>}
      {!loaded&&<div className="model-load-panel"><button className="media-load-button" disabled={!network.online} onClick={()=>{setError(false);setAttempt(v=>v+1);setLoaded(true);}}><span lang="ar">تحميل الخريطة التفاعلية</span><span lang="en">{error?'Retry interactive globe':'Load interactive globe'}</span></button></div>}
    </div>
    <p className="globe-help"><span lang="ar" dir="rtl">اسحب لتدوير الكرة الأرضية</span><span lang="en">Drag to rotate the globe</span></p>
    <div className="map-links">{[['Moscow',7],['Saint Petersburg',11],['Vladivostok',12],['Salalah',13],['Blagoveshchensk',15],['Nizwa',16],['Riyam · Muscat',17]].map(([name,id])=><button key={name} onClick={()=>go(Number(id))}>{name}</button>)}</div>
    <p className="map-note" lang="en">NASA/GSFC, Reto Stöckli · July 2004 satellite composite. Park GPS supplied by the owner.</p>
  </div>;
}
