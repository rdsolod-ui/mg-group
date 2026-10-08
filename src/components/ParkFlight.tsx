"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import locations from '@/data/project-locations.json';
import {useNetwork} from './NetworkPreferences';
export default function ParkFlight({id,paused,reduced}:{id:string;active:boolean;paused:boolean;reduced:boolean}){
 const location=locations[id as keyof typeof locations],network=useNetwork();
 const root=useRef<HTMLDivElement>(null),[near,setNear]=useState(false),[phase,setPhase]=useState('loading');
 const [Scene,setScene]=useState<typeof import('./LocalParkFlight').default|null>(null);
 const ready=useCallback(()=>setPhase('flight'),[]),arrive=useCallback(()=>setPhase('location'),[]),error=useCallback(()=>setPhase('error'),[]);
 useEffect(()=>{if(!root.current)return;const io=new IntersectionObserver(([e])=>setNear(e.isIntersecting),{threshold:.2});io.observe(root.current);return()=>io.disconnect();},[]);
 useEffect(()=>{if(!near||Scene)return;let current=true;import('./LocalParkFlight').then(m=>{if(current)setScene(()=>m.default);},error);return()=>{current=false;};},[near,Scene,error]);
 useEffect(()=>{if(!near)setPhase('loading');},[near]);
 return <div ref={root} className="park-flight" data-flight={id} data-flight-phase={phase} data-flight-visible={near} data-flight-economy={network.economy} data-flight-reduced={reduced} data-flight-paused={paused}>
  <div className="park-flight-stage">
   <img className="map-static" src={`/mg-group/maps/satellite/${id}-location-640.webp`} alt={`${location.en} — Esri satellite imagery`} loading="lazy"/>
   {near&&phase!=='error'&&Scene?<Scene id={id} location={location} economy={network.economy} reduced={reduced} running={!paused&&phase==='flight'} onReady={ready} onArrive={arrive} onError={error}/>:<><span className="local-map-target"/><div className="local-map-credit"><a href="/mg-group/maps/satellite/credits.html" target="_blank" rel="noreferrer">Esri, Vantor, Earthstar Geographics, GIS User Community · Imagery dates vary</a></div>{phase==='error'&&<div className="flight-buffer" role="status"><span lang="ar" dir="rtl">تعذّر تحميل الرحلة</span><small>Journey unavailable. Location map shown.</small></div>}</>}
  </div>
  <div className="park-flight-tools"><a href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=17/${location.lat}/${location.lng}`} target="_blank" rel="noreferrer">{location.en} · {location.lat.toFixed(5)}° N · {location.lng.toFixed(5)}° E</a></div>
 </div>;
}
