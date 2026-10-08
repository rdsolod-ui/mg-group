"use client";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { SRGBColorSpace, Vector3, Quaternion } from 'three';
import { globePoint } from './globe-geometry';
export type FlightLocation = { lat:number; lng:number; range:number; ar:string; en:string };
type Props = { location:FlightLocation; running:boolean; onReady:()=>void; onArrive:()=>void; onError:()=>void };
class Boundary extends Component<{children:ReactNode;onError:()=>void},{failed:boolean}> {
  state={failed:false}; static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onError();} render(){return this.state.failed?null:this.props.children;}
}
function Earth({id,location,running,onReady,onArrive,overlay}:{id:string;location:FlightLocation;running:boolean;onReady:()=>void;onArrive:()=>void;overlay:RefObject<HTMLDivElement|null>}) {
  const texture=useTexture('/mg-group/visuals/v2/earth-day.webp'); texture.colorSpace=SRGBColorSpace;
  const elapsed=useRef(0),arrived=useRef(false);
  const geometry=useMemo(()=>{
    const start=new Vector3(...globePoint({lat:15,lng:location.lng-45})).normalize();
    const end=new Vector3(...globePoint(location)).normalize();
    return {start,end,rotation:new Quaternion().setFromUnitVectors(start,end),q:new Quaternion(),v:new Vector3()};
  },[location]);
  useEffect(()=>{onReady();},[onReady]);
  useFrame(({camera,gl},delta)=>{
    if(running&&!arrived.current)elapsed.current+=Math.min(delta,1);
    const t=elapsed.current;
    const progress=Math.min(1,t/4.8),ease=progress*progress*(3-2*progress);
    geometry.q.identity().slerp(geometry.rotation,ease);
    camera.position.copy(geometry.v.copy(geometry.start).applyQuaternion(geometry.q)).multiplyScalar(3.5-2.42*ease);
    camera.lookAt(0,0,0);
    if(overlay.current){
      const layers=overlay.current.children;
      for(let i=0;i<3;i++){
        const start=3.2+i*3.2,p=Math.max(0,Math.min(1,(t-start)/3.2));
        const el=layers[i] as HTMLElement;
        el.style.opacity=String(Math.max(0,Math.min(1,(t-start)/.85)));
        el.style.transform=`scale(${1+(i===2?.15:i===0?(id==='nizwa'?1.67:5.47):(id==='nizwa'?4.4:9.2))*p*p})`;
      }
      overlay.current.dataset.zoomStage=t<3.2?'planet':t<6.4?'region':t<9.6?'city':'location';
    }
    gl.domElement.dataset.flightSeconds=t.toFixed(2);
    if(t>=12.8&&!arrived.current){arrived.current=true;onArrive();}
  });
  return <mesh><sphereGeometry args={[1,96,64]}/><meshBasicMaterial map={texture}/></mesh>;
}
export default function LocalParkFlight(props:Props & {id:string}) {
  const overlay=useRef<HTMLDivElement>(null);
  const [earthReady,setEarthReady]=useState(false),[mapReady,setMapReady]=useState(0);
  const announced=useRef(false);
  useEffect(()=>{if(earthReady&&mapReady===3&&!announced.current){announced.current=true;props.onReady();}},[earthReady,mapReady,props.onReady]);
  return <Boundary onError={props.onError}><div className="park-flight-local" data-provider="self-hosted" data-ready={earthReady&&mapReady===3}>
    <Canvas frameloop={props.running?'always':'demand'} camera={{position:globePoint({lat:15,lng:props.location.lng-45},3.5),fov:43,near:.01,far:30}} dpr={[1,1.5]} gl={{antialias:true,powerPreference:'low-power'}}>
      <Suspense fallback={null}><Earth {...props} onReady={()=>setEarthReady(true)} overlay={overlay}/></Suspense>
    </Canvas>
    <div ref={overlay} className="park-flight-layers" data-zoom-stage="planet">
      {['region','city','location'].map(stage=><div key={stage} className="park-flight-layer"><img src={stage==='location'?`/mg-group/maps/${props.id}.svg`:`/mg-group/maps/context/${props.id}-${stage}.svg`} alt={`${props.location.en} — ${stage} map`} onLoad={()=>setMapReady(n=>n+1)} onError={props.onError}/></div>)}
      <div className="map-stage-titles"><span>الأرض / Planet</span><span>المنطقة / Region</span><span>المدينة / City</span><span>الموقع / Location</span></div>
      <span className="local-map-target"/><span className="local-map-label">{props.location.en}<small>{props.location.lat.toFixed(5)}° N · {props.location.lng.toFixed(5)}° E</small></span>
    </div>
    <div className="local-map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a><span> · NASA/GSFC · </span><a href={`/mg-group/maps/${props.id}.json`} download>Site data</a><span> · </span><a href={`/mg-group/maps/context/${['skazka','leo-tolstoy','vdnkh','izmaylovo','airport'].includes(props.id)?'moscow':props.id}.json`} download>Region data · ODbL</a></div>
  </div></Boundary>;
}
