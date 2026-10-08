"use client";
import {useEffect,useRef,useState} from 'react';
export type FlightLocation={lat:number;lng:number;range:number;ar:string;en:string};
type Props={id:string;location:FlightLocation;running:boolean;economy:boolean;reduced:boolean;onReady:()=>void;onArrive:()=>void;onError:()=>void};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export default function LocalParkFlight(props:Props){
 const root=useRef<HTMLDivElement>(null),elapsed=useRef(0),announced=useRef(false),arrived=useRef(false);
 const [loaded,setLoaded]=useState<string[]>([]);
 // Connection estimates may change mid-flight; keep this visit's asset resolution stable.
 const [width]=useState(()=>props.economy?640:1280);
 const ready=loaded.length===4;
 useEffect(()=>{if(ready&&!announced.current){announced.current=true;props.onReady();}},[ready,props.onReady]);
 useEffect(()=>{
  const el=root.current;if(!el)return;
  const planet=el.querySelector<HTMLElement>('.flight-planet')!;
  const layers=el.querySelectorAll<HTMLElement>('.park-flight-layer');
  const draw=(t:number)=>{
   el.dataset.flightSeconds=t.toFixed(2);
   el.dataset.zoomStage=t<3.2?'planet':t<6.4?'region':t<9.6?'city':'location';
   planet.style.transform=`scale(${1+3.8*clamp(t/4.1)**2})`;
   planet.style.opacity=String(1-clamp((t-3.2)/1.1));
   for(let i=0;i<3;i++){
    const start=3.2+i*3.2,p=clamp((t-start)/3.2);
    layers[i].style.opacity=String(clamp((t-start)/.85));
    layers[i].style.transform=`scale(${1+(i===2?.15:i===0?1.4:1.7)*p*p})`;
   }
  };
  if(props.reduced)elapsed.current=12.8;
  draw(elapsed.current);
  if(!props.running||!ready||arrived.current)return;
  let frame=0,last:number|undefined;
  const tick=(now:number)=>{
   // Advance visible time only: resuming never skips a layer.
   if(last!==undefined)elapsed.current+=Math.min((now-last)/1000,1);
   last=now;draw(elapsed.current);
   if(elapsed.current>=12.8){arrived.current=true;props.onArrive();return;}
   frame=requestAnimationFrame(tick);
  };
  if(props.reduced){arrived.current=true;props.onArrive();return;}
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[props.running,props.reduced,props.id,props.onArrive,ready]);
 const imageReady=(stage:string)=>setLoaded(previous=>previous.includes(stage)?previous:[...previous,stage]);
 return <div ref={root} className="park-flight-local park-flight-layers" data-provider="self-hosted" data-ready={ready} data-zoom-stage={props.reduced?'location':'planet'} data-flight-seconds="0" data-resolution={width}>
  <div className="flight-planet"><img src={`/mg-group/maps/flight/${props.id}-planet.webp`} alt={`Earth centred on ${props.location.en}`} onLoad={()=>imageReady('planet')} onError={props.onError}/><span className="flight-planet-dot"/></div>
  {['region','city','location'].map(stage=><div key={stage} className="park-flight-layer"><img src={`/mg-group/maps/flight/${props.id}-${stage}-${width}.webp`} alt={`${props.location.en} — ${stage} map`} onLoad={()=>imageReady(stage)} onError={props.onError}/></div>)}
  <div className="map-stage-titles"><span>الأرض / Planet</span><span>المنطقة / Region</span><span>المدينة / City</span><span>الموقع / Location</span></div>
  {!ready&&<div className="flight-buffer" role="status"><span lang="ar" dir="rtl">جارٍ تجهيز الرحلة</span><small>Preparing the journey · {loaded.length}/4</small></div>}
  <span className="local-map-target"/><span className="local-map-label">{props.location.en}<small>{props.location.lat.toFixed(5)}° N · {props.location.lng.toFixed(5)}° E</small></span>
  <div className="local-map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a><span> · NASA/GSFC · </span><a href={`/mg-group/maps/${props.id}.json`} download>Site data</a><span> · </span><a href={`/mg-group/maps/context/${['skazka','leo-tolstoy','vdnkh','izmaylovo','airport'].includes(props.id)?'moscow':props.id}.json`} download>Region data · ODbL</a></div>
 </div>;
}
