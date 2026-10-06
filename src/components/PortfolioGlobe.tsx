"use client";
import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
const Globe=dynamic(()=>import('./PortfolioGlobeScene'),{ssr:false});
class GlobeBoundary extends Component<{children:ReactNode},{failed:boolean}>{
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}
  render(){return this.state.failed?<img src="/mg-group/visuals/v2/earth-day.webp" alt="Satellite composite world map"/>:this.props.children;}
}
export default function PortfolioGlobe({go}:{go:(n:number)=>void}){
  const ref=useRef<HTMLDivElement>(null);const[visible,setVisible]=useState(false);
  useEffect(()=>{const el=ref.current;if(!el)return;const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));observer.observe(el);return()=>observer.disconnect();},[]);
  return <div className="portfolio-globe" ref={ref}>
    <div className="globe-stage" data-media-controls aria-label="Interactive satellite globe. Drag to rotate."><GlobeBoundary>{visible&&<Globe go={go}/>}</GlobeBoundary></div>
    <p className="globe-help"><span lang="ar" dir="rtl">اسحب لتدوير الكرة الأرضية</span><span lang="en">Drag to rotate the globe</span></p>
    <div className="map-links">{[['Moscow',7],['Saint Petersburg',11],['Vladivostok',12],['Salalah',13]].map(([name,id])=><button key={name} onClick={()=>go(Number(id))}>{name}</button>)}</div>
    <p className="map-note" lang="en">NASA/GSFC, Reto Stöckli · July 2004 satellite composite. City-level locations.</p>
  </div>;
}
