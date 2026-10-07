'use client';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls, useTexture } from '@react-three/drei';
import { Quaternion, SRGBColorSpace, Vector3, type Mesh, type Object3D, type Camera } from 'three';
import type { OrbitControls as Controls } from 'three-stdlib';
import locations from '@/data/project-locations.json';
import { distanceKm, formatKm, globePoint, moscowHub, routePoint } from './globe-geometry';
const routes = Object.entries(locations).map(([id,p]) => ({id,...p,km:distanceKm(moscowHub,p),points:Array.from({length:81},(_,i)=>routePoint(moscowHub,p,i/80))}));
const labelProjection = new Vector3();
function labelPosition(object:Object3D,camera:Camera,size:{width:number;height:number}) {
  labelProjection.setFromMatrixPosition(object.matrixWorld).project(camera);
  return [Math.max(105,Math.min(size.width-105,(labelProjection.x+1)*size.width/2)),Math.max(42,Math.min(size.height-42,(1-labelProjection.y)*size.height/2))];
}
function Earth({selected,select,paused,onReady}:{selected:string;select:(id:string)=>void;paused:boolean;onReady:()=>void}) {
  const earth=useRef<Mesh>(null!),pulse=useRef<Mesh>(null!);
  const texture=useTexture('/mg-group/visuals/v2/earth-day.webp');texture.colorSpace=SRGBColorSpace;
  const current=routes.find(p=>p.id===selected)!;
  const rotation=useMemo(()=>new Quaternion().setFromUnitVectors(new Vector3(0,0,1),new Vector3(...globePoint(current)).normalize()),[current]);
  useEffect(onReady,[onReady]);
  const clock=useRef(0);
  useFrame((_,delta)=>{if(!paused)clock.current+=Math.min(delta,.05);if(pulse.current)pulse.current.scale.setScalar(1+.18*Math.sin(clock.current*2));});
  return <>
    <mesh ref={earth}><sphereGeometry args={[1,96,64]}/><meshStandardMaterial map={texture} roughness={1}/></mesh>
    <mesh scale={1.015}><sphereGeometry args={[1,64,48]}/><meshBasicMaterial color="#6ac4e8" wireframe transparent opacity={.018}/></mesh>
    {routes.map(p=><group key={p.id}>
      <Line points={p.points} color={p.id===selected?'#ffd09c':'#8bb7ca'} lineWidth={p.id===selected?2.2:1} transparent opacity={p.id===selected?.95:.24}/>
      <mesh position={globePoint(p,1.012)} onClick={e=>{e.stopPropagation();select(p.id);}}><sphereGeometry args={[p.id===selected?.016:.009,12,8]}/><meshBasicMaterial color={p.id===selected?'#ffd09c':'#8ddbe0'}/></mesh>
    </group>)}
    <mesh position={globePoint(moscowHub,1.018)}><sphereGeometry args={[.013,16,10]}/><meshBasicMaterial color="#fff"/></mesh>
    <mesh ref={pulse} position={globePoint(current,1.02)} quaternion={rotation}><ringGeometry args={[.023,.027,40]}/><meshBasicMaterial color="#ffd09c" transparent opacity={.8} depthWrite={false}/></mesh>
    <Html position={routePoint(moscowHub,current,.55)} calculatePosition={labelPosition} center occlude={[earth]} zIndexRange={[12,1]} style={{pointerEvents:'none'}}><span className="globe-distance" data-arc-label={current.id}><small>{current.en}</small><strong dir="ltr">≈ {formatKm(current.km)} km</strong></span></Html>
  </>;
}
function Navigation({selected,focusRevision,paused,onInteraction}:{selected:string;focusRevision:number;paused:boolean;onInteraction:()=>void}) {
  const controls=useRef<Controls>(null!);const{camera,gl}=useThree();const target=useRef<Vector3|null>(null);
  useEffect(()=>{target.current=new Vector3(...globePoint(locations[selected as keyof typeof locations],3.1));},[selected,focusRevision]);
  useFrame((_,delta)=>{
    if(target.current){camera.position.lerp(target.current,1-Math.exp(-Math.min(delta,.05)*4));if(camera.position.distanceTo(target.current)<.002)target.current=null;controls.current?.update();}
    gl.domElement.dataset.camera=camera.position.toArray().map(v=>v.toFixed(3)).join(',');gl.domElement.dataset.zoomDistance=camera.position.length().toFixed(3);
  });
  return <OrbitControls ref={controls} makeDefault enablePan={false} enableZoom zoomSpeed={.55} minDistance={1.28} maxDistance={5.4} enableDamping dampingFactor={.075} rotateSpeed={.5} autoRotate={false} onStart={()=>{target.current=null;onInteraction();}}/>;
}
export default function PortfolioGlobeScene({selected,select,focusRevision,paused,onReady,onInteraction}:{selected:string;select:(id:string)=>void;focusRevision:number;paused:boolean;onReady:()=>void;onInteraction:()=>void}) {
  return <Canvas frameloop={paused?'demand':'always'} dpr={[1,1.5]} camera={{position:globePoint({lat:34,lng:65},3.1),fov:43}} gl={{alpha:true,antialias:true,powerPreference:'low-power'}}>
    <ambientLight intensity={1.8}/><directionalLight position={[3,5,2]} intensity={1.5}/>
    <Suspense fallback={null}><Earth selected={selected} select={select} paused={paused} onReady={onReady}/></Suspense>
    <Navigation selected={selected} focusRevision={focusRevision} paused={paused} onInteraction={onInteraction}/>
  </Canvas>;
}
