"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import locations from '@/data/project-locations.json';
import {useNetwork} from './NetworkPreferences';
export default function ParkFlight({id,active,paused,reduced}:{id:string;active:boolean;paused:boolean;reduced:boolean}){
 const location=locations[id as keyof typeof locations],network=useNetwork();
 const root=useRef<HTMLDivElement>(null);const [near,setNear]=useState(false),[phase,setPhase]=useState('loading');
 const [Scene,setScene]=useState<typeof import('./LocalParkFlight').default|null>(null);
 const eligible=!reduced&&!network.economy&&network.online;
 const ready=useCallback(()=>setPhase('flight'),[]),arrive=useCallback(()=>setPhase('location'),[]),error=useCallback(()=>setPhase('error'),[]);
 useEffect(()=>{if(!root.current)return;const io=new IntersectionObserver(([e])=>setNear(e.isIntersecting),{threshold:.2});io.observe(root.current);return()=>io.disconnect();},[]);
 useEffect(()=>{if(!active||!near||!eligible||Scene)return;let current=true;import('./LocalParkFlight').then(m=>{if(current)setScene(()=>m.default);},error);return()=>{current=false;};},[active,near,eligible,Scene,error]);
 useEffect(()=>{if(!active)setPhase('loading');},[active]);
 useEffect(()=>{if(!active||!near||!eligible||phase!=='loading')return;const timer=setTimeout(error,22000);return()=>clearTimeout(timer);},[active,near,eligible,phase,error]);
 return <div ref={root} className="park-flight" data-flight={id} data-flight-phase={eligible?phase:'static'}>
  <div className="park-flight-stage">
   <img className="map-static" src={`/mg-group/maps/${id}.svg`} alt={`${location.en} — OpenStreetMap location`} loading="lazy"/>
   {active&&near&&eligible&&phase!=='error'&&Scene?<Scene id={id} location={location} running={!paused&&phase==='flight'} onReady={ready} onArrive={arrive} onError={error}/>:<><span className="local-map-target"/><div className="local-map-credit">© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a></div></>}
  </div>
  <div className="park-flight-tools"><a href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=17/${location.lat}/${location.lng}`} target="_blank" rel="noreferrer">{location.en} · {location.lat.toFixed(5)}° N · {location.lng.toFixed(5)}° E</a></div>
 </div>;
}
