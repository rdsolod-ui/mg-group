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
function Earth({location,running,onReady,onArrive,overlay}:{location:FlightLocation;running:boolean;onReady:()=>void;onArrive:()=>void;overlay:RefObject<HTMLDivElement|null>}) {
  const texture=useTexture('/mg-group/visuals/v2/earth-day.webp'); texture.colorSpace=SRGBColorSpace;
  const elapsed=useRef(0),arrived=useRef(false);
  const geometry=useMemo(()=>{
    const start=new Vector3(...globePoint({lat:15,lng:location.lng-45})).normalize();
    const end=new Vector3(...globePoint(location)).normalize();
    return {start,end,rotation:new Quaternion().setFromUnitVectors(start,end),q:new Quaternion(),v:new Vector3()};
  },[location]);
  useEffect(onReady,[onReady]);
  useFrame(({camera,gl},delta)=>{
    if(running&&!arrived.current)elapsed.current+=Math.min(delta,1);
    const t=elapsed.current;
    const progress=Math.min(1,t/4.8),ease=progress*progress*(3-2*progress);
    geometry.q.identity().slerp(geometry.rotation,ease);
    camera.position.copy(geometry.v.copy(geometry.start).applyQuaternion(geometry.q)).multiplyScalar(3.5-2.42*ease);
    camera.lookAt(0,0,0);
    if(overlay.current){const fade=Math.max(0,Math.min(1,(t-3.8)/1.1));overlay.current.style.opacity=String(fade);overlay.current.style.transform=`scale(${1.22-.22*Math.min(1,Math.max(0,(t-3.8)/4))})`;}
    gl.domElement.dataset.flightSeconds=t.toFixed(2);
    if(t>=8&&!arrived.current){arrived.current=true;onArrive();}
  });
  return <mesh><sphereGeometry args={[1,96,64]}/><meshBasicMaterial map={texture}/></mesh>;
}
export default function LocalParkFlight(props:Props & {id:string}) {
  const overlay=useRef<HTMLDivElement>(null);
  const [earthReady,setEarthReady]=useState(false),[mapReady,setMapReady]=useState(false);
  const announced=useRef(false);
  useEffect(()=>{if(earthReady&&mapReady&&!announced.current){announced.current=true;props.onReady();}},[earthReady,mapReady,props.onReady]);
  return <Boundary onError={props.onError}><div className="park-flight-local" data-provider="self-hosted" data-ready={earthReady&&mapReady}>
    <Canvas frameloop={props.running?'always':'demand'} camera={{position:globePoint({lat:15,lng:props.location.lng-45},3.5),fov:43,near:.01,far:30}} dpr={[1,1.5]} gl={{antialias:true,powerPreference:'low-power'}}>
      <Suspense fallback={null}><Earth {...props} onReady={()=>setEarthReady(true)} overlay={overlay}/></Suspense>
    </Canvas>
    <div ref={overlay} className="park-flight-local-plan"><img src={`/mg-group/maps/${props.id}.svg`} alt={`${props.location.en} — OpenStreetMap site plan`} onLoad={()=>setMapReady(true)} onError={props.onError}/><span className="local-map-target"/><span className="local-map-label">{props.location.en}<small>{props.location.lat.toFixed(5)}° N · {props.location.lng.toFixed(5)}° E</small></span></div>
    <div className="local-map-credit"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a><span> · NASA/GSFC · </span><a href={`/mg-group/maps/${props.id}.json`} download>Map data · ODbL</a></div>
  </div></Boundary>;
}
