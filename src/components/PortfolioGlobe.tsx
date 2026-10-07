'use client';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useNetwork } from './NetworkPreferences';
import MediaLoading from './MediaLoading';
import locations from '@/data/project-locations.json';
import { distanceKm, formatKm, moscowHub } from './globe-geometry';
const routes=Object.entries(locations).map(([id,p])=>({id,...p,km:distanceKm(moscowHub,p)}));
const tour=['riyam','minny-gorodok','al-haffa','blagoveshchensk','nizwa','ohta','skazka','leo-tolstoy','vdnkh','izmaylovo','airport'];
class GlobeBoundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  componentDidCatch(){this.props.onError();}render(){return this.state.failed?null:this.props.children;}
}
export default function PortfolioGlobe({go,paused,reduced,active}:{go:(id:string)=>void;paused:boolean;reduced:boolean;active:boolean}) {
  const ref=useRef<HTMLDivElement>(null),interacted=useRef(false);
  const[visible,setVisible]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState(false),[attempt,setAttempt]=useState(0);
  const[selected,setSelected]=useState('riyam'),[focusRevision,setFocusRevision]=useState(0);
  const network=useNetwork();const[Globe,setGlobe]=useState<typeof import('./PortfolioGlobeScene').default|null>(null);
  const loaded=active&&visible&&!network.economy&&network.online&&!error;
  const onReady=useCallback(()=>setReady(true),[]),onError=useCallback(()=>{setError(true);setReady(false);},[]);
  const onInteraction=useCallback(()=>{interacted.current=true;},[]);
  const select=useCallback((id:string)=>{interacted.current=true;setSelected(id);setFocusRevision(v=>v+1);},[]);
  useEffect(()=>{if(!loaded||Globe)return;let current=true;import('./PortfolioGlobeScene').then(m=>{if(current)setGlobe(()=>m.default);},()=>{if(current)onError();});return()=>{current=false;};},[loaded,Globe,attempt,onError]);
  useEffect(()=>{const el=ref.current;if(!el)return;const io=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:.1});io.observe(el);return()=>io.disconnect();},[]);
  useEffect(()=>{if(!loaded||ready)return;const timer=setTimeout(onError,30000);return()=>clearTimeout(timer);},[loaded,ready,onError]);
  useEffect(()=>{if(!loaded||paused||reduced||!ready)return;const timer=setInterval(()=>{if(!interacted.current)setSelected(id=>tour[(tour.indexOf(id)+1)%tour.length]);},8500);return()=>clearInterval(timer);},[loaded,paused,reduced,ready]);
  const current=routes.find(p=>p.id===selected)!;
  return <div className="portfolio-globe globe-experience visual" ref={ref} data-selected-route={selected} data-globe-state={error?'error':ready?'ready':'loading'}>
    <header className="globe-title"><div><h2 lang="ar" dir="rtl">من موسكو. إلى كل وجهة.</h2><p lang="en">From Moscow. To every destination.</p></div><span className="globe-count"><b>11</b><span lang="ar">موقعاً<span lang="en">locations</span></span></span></header>
    <div className="globe-layout">
      <div className="globe-view">
        <div className={`globe-stage ${ready?'is-ready':''}`} data-media-controls tabIndex={0} role="group" aria-label="Interactive satellite globe. Drag to rotate. Scroll or pinch to zoom.">
          {(!ready||!loaded)&&<img className="globe-preview" src="/mg-group/visuals/v2/earth-day.webp" alt="Satellite world map preview"/>}
          {loaded&&Globe&&<GlobeBoundary key={attempt} onError={onError}><Globe selected={selected} select={select} focusRevision={focusRevision} paused={paused||reduced||!visible} onReady={onReady} onInteraction={onInteraction}/></GlobeBoundary>}
          {loaded&&!ready&&<MediaLoading ar="جارٍ تحميل الكرة الأرضية" en="Loading the globe"/>}
          {error&&<button className="globe-retry" onClick={()=>{setError(false);setAttempt(v=>v+1);}}>إعادة المحاولة · Retry globe</button>}
        </div>
        <p className="globe-help"><span lang="ar" dir="rtl">اسحب للتدوير · مرّر أو باعد بين إصبعين للتكبير</span><span lang="en">Drag to rotate · Scroll or pinch to zoom</span></p>
        <div className="globe-destination"><div><span lang="ar" dir="rtl">{current.ar}</span><span lang="en">{current.en}</span></div><strong dir="ltr">≈ {formatKm(current.km)} <small>km</small></strong><button onClick={()=>go(selected)} aria-label={`Open ${current.en} project`}><span lang="ar">اكتشف المشروع<span lang="en">Explore project</span></span><ArrowUpRight size={18}/></button></div>
      </div>
      <aside className="globe-route-panel"><p><span lang="ar" dir="rtl">المسافة التقريبية من مكتب موسكو</span><span lang="en">Approximate distance from Moscow HQ</span></p><div className="globe-routes" data-media-controls>{routes.map(p=><button key={p.id} data-route={p.id} aria-pressed={selected===p.id} onClick={()=>select(p.id)}><span><span lang="ar" dir="rtl">{p.ar}</span><span lang="en">{p.en}</span></span><strong dir="ltr">{formatKm(p.km)} <small>km</small></strong></button>)}</div></aside>
    </div>
    <p className="globe-footnote"><span lang="ar" dir="rtl">مسافات جيوديسية تقريبية، وليست مسارات طرق أو رحلات جوية · موسكو، شارع أوسينيا ٢٣</span><span lang="en">Great-circle distances, not road or flight routes · Moscow, Osennyaya 23 · NASA/GSFC, Reto Stöckli imagery · Owner-supplied park GPS</span></p>
  </div>;
}
