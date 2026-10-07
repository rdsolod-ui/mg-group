"use client";
import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Line, OrbitControls, useTexture } from '@react-three/drei';
import { SRGBColorSpace, Vector3, type Mesh } from 'three';
import parkLocations from '@/data/project-locations.json';

const point=(lat:number,lon:number,r=1)=>new Vector3(r*Math.cos(lat*Math.PI/180)*Math.cos(lon*Math.PI/180),r*Math.sin(lat*Math.PI/180),-r*Math.cos(lat*Math.PI/180)*Math.sin(lon*Math.PI/180));
const parkChapters: Record<string, number> = {skazka:7,'leo-tolstoy':8,vdnkh:9,izmaylovo:10,ohta:11,'minny-gorodok':12,'al-haffa':13,airport:14,blagoveshchensk:15};
export const globeLocations=Object.entries(parkLocations).map(([id,p])=>({id,name:p.en,lat:p.lat,lon:p.lng,chapter:parkChapters[id]}));
function Earth({go,onReady}:{go:(n:number)=>void;onReady:()=>void}){
  const earth=useRef<Mesh>(null!);
  const [hovered,setHovered]=useState<string|null>(null);
  const texture=useTexture('/mg-group/visuals/v2/earth-day.webp');texture.colorSpace=SRGBColorSpace;
  useEffect(onReady,[onReady]);
  return <>
    <mesh ref={earth}><sphereGeometry args={[1,96,64]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
    {globeLocations.map((p,i)=><group key={p.name} position={point(p.lat,p.lon,1.012)}>
      <mesh onClick={()=>go(p.chapter)} onPointerOver={()=>setHovered(p.id)} onPointerOut={()=>setHovered(null)}><sphereGeometry args={[.012,12,8]}/><meshBasicMaterial color="#ffb985"/></mesh>
      {hovered===p.id && <Html center occlude={[earth]} zIndexRange={[10,0]} style={{pointerEvents:'none'}}><span className={`globe-label globe-label-${i}`}>{p.name}</span></Html>}
    </group>)}
    {['minny-gorodok','al-haffa','blagoveshchensk'].map(id=>{const p=globeLocations.find(p=>p.id===id)!;const a=point(globeLocations[0].lat,globeLocations[0].lon),b=point(p.lat,p.lon);const points=Array.from({length:61},(_,j)=>a.clone().lerp(b,j/60).normalize().multiplyScalar(1.014+.12*Math.sin(Math.PI*j/60)));return <Line key={id} points={points} color="#efb48c" lineWidth={1.2} transparent opacity={.75}/>;})}
  </>;
}
export default function PortfolioGlobeScene({go,paused,onReady}:{go:(n:number)=>void;paused:boolean;onReady:()=>void}){
  return <Canvas frameloop={paused ? 'demand' : 'always'} dpr={[1,1.5]} camera={{position:point(35,70,3.45).toArray(),fov:40}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}>
    <ambientLight intensity={1.4}/><directionalLight position={[3,5,2]} intensity={1.4}/>
    <Suspense fallback={null}><Earth go={go} onReady={onReady}/></Suspense>
    <OrbitControls enablePan={false} enableZoom={false} enableDamping={false} rotateSpeed={.45} autoRotate={!paused} autoRotateSpeed={.22}/>
  </Canvas>;
}
