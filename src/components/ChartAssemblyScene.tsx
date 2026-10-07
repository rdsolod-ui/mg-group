'use client';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ExtrudeGeometry, LatheGeometry, Shape, ShapeGeometry, Vector2, PMREMGenerator, MeshStandardMaterial, MeshPhysicalMaterial, Color, Vector3, DoubleSide, type Group, type OrthographicCamera } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { chartSectors, chartPhase, smooth, type ChartMotion } from './chart-assembly';
import type { ChartDatum } from '@/data/motion-data';

export type SceneProps = {
  data: ChartDatum[]; running: boolean; reduced: boolean; motion: RefObject<ChartMotion>;
  onReady: () => void; onError: () => void; onFocus: (index: number) => void;
  connector: RefObject<SVGPathElement | null>; selected: number; revision: number;
};
function Assembly({ data, running, reduced, motion, onReady, onError, onFocus, connector, selected, revision }: SceneProps) {
  const { gl, scene, camera, size, invalidate, setDpr } = useThree();
  const parts = useRef<(Group | null)[]>([]);
  const root = useRef<Group>(null);
  const lastFocus = useRef(-2);
  const manual = useRef({ revision: -1, from: [] as number[], to: [] as number[], elapsed: 1 });
  const amounts = useRef<number[]>([]);
  const ready = useRef(false);
  const readyFrame = useRef(0);
  const perf = useRef({ time: 0, frames: 0, lowered: false });
  const projected = useMemo(() => new Vector3(), []);
  const sectors = useMemo(() => chartSectors(data), [data]);
  const resources = useMemo(() => sectors.map(sector => {
    // Inset the bevel, rather than expanding the slice and colliding with its neighbour.
    const shape = new Shape();
    shape.absarc(0, 0, 2.35, sector.start, sector.end, false);
    shape.absarc(0, 0, 1.24, sector.end, sector.start, true);
    shape.closePath();
    const geometry = new ExtrudeGeometry(shape, { depth: .32, bevelEnabled: true, bevelThickness: .028,
      bevelSize: .012, bevelOffset: -.016, bevelSegments: 3, curveSegments: 96, steps: 1 });
    geometry.rotateX(-Math.PI / 2);
    const top = new MeshPhysicalMaterial({ color: sector.color, metalness: .88, roughness: .24,
      clearcoat: .25, clearcoatRoughness: .24, envMapIntensity: 1.25, side: DoubleSide });
    const side = new MeshStandardMaterial({ color: new Color(sector.color).multiplyScalar(.5), metalness: .72, roughness: .3, envMapIntensity: .8 });
    // A subtly crowned, machined face catches the studio reflections without changing angular shares.
    const profile = [new Vector2(1.245,.32),new Vector2(1.265,.35),new Vector2(1.36,.39),new Vector2(1.57,.425),new Vector2(1.8,.435),new Vector2(2.02,.425),new Vector2(2.23,.39),new Vector2(2.33,.35),new Vector2(2.345,.32)];
    const crown = new LatheGeometry(profile, Math.max(5, Math.ceil((sector.end-sector.start)*30)), sector.start+Math.PI/2, sector.end-sector.start);
    const capShape = new Shape(profile); capShape.closePath();
    const cap = new ShapeGeometry(capShape);
    return { geometry, crown, cap, materials: [top, side] };
  }), [sectors]);
  useEffect(() => () => cancelAnimationFrame(readyFrame.current), []);
  useEffect(() => () => resources.forEach(r => { r.geometry.dispose(); r.crown.dispose(); r.cap.dispose(); r.materials.forEach(m => m.dispose()); }), [resources]);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl), room = new RoomEnvironment();
    const env = pmrem.fromScene(room, .035);
    scene.environment = env.texture;
    room.dispose(); pmrem.dispose(); invalidate();
    return () => { scene.environment = null; env.dispose(); };
  }, [gl, scene, invalidate]);
  useEffect(() => {
    const c = camera as OrthographicCamera;
    c.zoom = Math.min(size.width / 6.5, size.height / 4.9);
    c.lookAt(0, .1, 0); c.updateProjectionMatrix(); invalidate();
  }, [camera, size, invalidate]);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onError(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onError]);
  useEffect(() => { invalidate(); }, [running, selected, revision, reduced, invalidate]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, .05);
    if (!running && motion.current.time === 0) motion.current.time = 2.3;
    if (running && selected < 0) motion.current.time += dt;
    const phase = chartPhase(motion.current.time, data.length);
    const focus = selected >= 0 ? selected : reduced ? -1 : phase.focus;
    if (lastFocus.current !== focus) { lastFocus.current = focus; onFocus(focus); }
    const m = manual.current;
    if (m.revision !== revision) {
      m.revision = revision; m.from = sectors.map((_, i) => amounts.current[i] || 0);
      m.to = sectors.map((_, i) => i === selected ? 1 : 0); m.elapsed = running && !reduced ? 0 : 1;
    }
    m.elapsed = reduced ? 1 : running ? Math.min(1, m.elapsed + dt / .65) : m.elapsed;
    const assembly = reduced || selected >= 0 ? 0 : phase.assembly;
    parts.current.forEach((part, i) => {
      if (!part) return;
      const target = selected >= 0 ? m.to[i] : reduced ? 0 : i === phase.focus ? phase.lift : 0;
      const amount = m.elapsed < 1 ? m.from[i] + (target - m.from[i]) * smooth(m.elapsed) : target;
      amounts.current[i] = amount;
      const distance = .035 + amount * .32 + assembly * .4;
      part.position.set(Math.cos(sectors[i].mid) * distance, amount * .36 + assembly * (.6 + i * .09), -Math.sin(sectors[i].mid) * distance);
      resources[i].materials[0].emissive.set(sectors[i].color);
      resources[i].materials[0].emissiveIntensity = amount * .08;
    });
    if (root.current) { root.current.rotation.y = reduced ? 0 : Math.sin(phase.t / (3.2 + data.length * 3.6 + 2) * Math.PI * 2) * .065; root.current.updateMatrixWorld(true); }
    if (connector.current) {
      const part = parts.current[focus];
      if (part && focus >= 0) {
        projected.set(Math.cos(sectors[focus].mid) * 2.12, .36, -Math.sin(sectors[focus].mid) * 2.12);
        part.localToWorld(projected); projected.project(camera);
        const x = (projected.x * .5 + .5) * 1000, y = (-projected.y * .5 + .5) * 700;
        connector.current.setAttribute('d', `M ${x} ${y} L ${Math.min(890, x + 55)} ${y - 30} L 930 85`);
        connector.current.style.opacity = String(Math.max(0, amounts.current[focus] || 0));
      } else connector.current.style.opacity = '0';
    }
    // These small scalar diagnostics also make pause/remount regression checks possible.
    gl.domElement.dataset.chartTime = motion.current.time.toFixed(4);
    gl.domElement.dataset.chartFocus = String(focus);
    gl.domElement.dataset.chartPose = parts.current.map(p => p?.position.toArray().map(v => v.toFixed(3)).join(',')).join(';');
    if (!ready.current) { ready.current = true; readyFrame.current = requestAnimationFrame(onReady); }
    if (running && selected < 0) {
      perf.current.time += delta; perf.current.frames++;
      if (perf.current.time > 3 && !perf.current.lowered) {
        if (perf.current.frames / perf.current.time < 32) { setDpr(1); perf.current.lowered = true; }
        perf.current.time = 0; perf.current.frames = 0;
      }
      invalidate();
    } else if (running && m.elapsed < 1 && !reduced) invalidate();
  });
  return <>
    <ambientLight intensity={.3} />
    <directionalLight position={[-3, 7, 4]} intensity={1.6} color="#fff0dc" castShadow shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-normalBias={.03} />
    <directionalLight position={[4, 3, -3]} intensity={1.8} color="#a9dfe9" />
    <group ref={root}>
      {sectors.map((sector, index) => <group key={sector.id} ref={p => { parts.current[index] = p; }}>
        <mesh geometry={resources[index].geometry} material={resources[index].materials} castShadow receiveShadow dispose={null} />
        <mesh geometry={resources[index].crown} material={resources[index].materials[0]} castShadow receiveShadow dispose={null} />
        <mesh geometry={resources[index].cap} material={resources[index].materials[0]} rotation={[0,sector.start,0]} dispose={null} />
        <mesh geometry={resources[index].cap} material={resources[index].materials[0]} rotation={[0,sector.end,0]} dispose={null} />
      </group>)}
      <mesh position={[0, -.13, 0]} receiveShadow><cylinderGeometry args={[2.5, 2.53, .14, 128]} /><meshStandardMaterial color="#123647" metalness={.8} roughness={.35} /></mesh>
      <mesh position={[0, -.045, 0]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[2.49, .014, 8, 128]} /><meshStandardMaterial color="#b0825f" metalness={.8} roughness={.3} /></mesh>
    </group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.23, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial opacity={.24} /></mesh>
  </>;
}
export default function ChartAssemblyScene(props: SceneProps) {
  return <Canvas orthographic shadows frameloop="demand" dpr={[1, 1.65]} camera={{ position: [0, 7.8, 8.3], near: .1, far: 60 }}
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} fallback={null}>
    <Assembly {...props} />
  </Canvas>;
}
