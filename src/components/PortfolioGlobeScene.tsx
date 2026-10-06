"use client";
import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Line, OrbitControls, useTexture } from '@react-three/drei';
import { SRGBColorSpace, Vector3, type Mesh } from 'three';

const point=(lat:number,lon:number,r=1)=>new Vector3(r*Math.cos(lat*Math.PI/180)*Math.cos(lon*Math.PI/180),r*Math.sin(lat*Math.PI/180),-r*Math.cos(lat*Math.PI/180)*Math.sin(lon*Math.PI/180));
export const globeLocations=[
  {name:'Moscow',lat:55.75,lon:37.62,chapter:7},
  {name:'Saint Petersburg',lat:59.94,lon:30.31,chapter:11},
  {name:'Vladivostok',lat:43.12,lon:131.88,chapter:12},
  {name:'Salalah',lat:17.02,lon:54.09,chapter:13},
];
function Earth({go}:{go:(n:number)=>void}){
  const earth=useRef<Mesh>(null!);
  const texture=useTexture('/mg-group/visuals/v2/earth-day.webp');texture.colorSpace=SRGBColorSpace;
  return <>
    <mesh ref={earth}><sphereGeometry args={[1,96,64]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
    {globeLocations.map((p,i)=><group key={p.name} position={point(p.lat,p.lon,1.012)}>
      <mesh><sphereGeometry args={[.012,12,8]}/><meshBasicMaterial color="#ffb985"/></mesh>
      <Html center occlude={[earth]} zIndexRange={[10,0]} style={{pointerEvents:'none'}}><button className={`globe-label globe-label-${i}`} onClick={()=>go(p.chapter)} style={{pointerEvents:'auto'}}>{p.name}</button></Html>
    </group>)}
    {[2,3].map(i=>{const a=point(globeLocations[0].lat,globeLocations[0].lon),b=point(globeLocations[i].lat,globeLocations[i].lon);const points=Array.from({length:61},(_,j)=>a.clone().lerp(b,j/60).normalize().multiplyScalar(1.014+.12*Math.sin(Math.PI*j/60)));return <Line key={i} points={points} color="#efb48c" lineWidth={1.2} transparent opacity={.75}/>;})}
  </>;
}
export default function PortfolioGlobeScene({go}:{go:(n:number)=>void}){
  return <Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:point(35,70,3.45).toArray(),fov:40}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}>
    <ambientLight intensity={1.4}/><directionalLight position={[3,5,2]} intensity={1.4}/>
    <Suspense fallback={null}><Earth go={go}/></Suspense>
    <OrbitControls enablePan={false} enableZoom={false} enableDamping={false} rotateSpeed={.45}/>
  </Canvas>;
}
