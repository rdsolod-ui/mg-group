"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
const draco = new DRACOLoader().setDecoderPath("/mg-group/decoders/draco/").setWorkerLimit(2);
const cameraConfig = { position: [15, 6.4, 8] as [number, number, number], fov: 36, near: .1, far: 100 };
const wideCameraConfig = { ...cameraConfig, position: [5, 4.2, 9] as [number, number, number] };

function WideFraming({ horizontal }: { horizontal: boolean }) {
  const { camera, size, invalidate } = useThree();
  const previous = useRef(1);
  useEffect(() => {
    if (!horizontal) return;
    const factor = Math.max(1, 1.35 / (size.width / size.height));
    const target = new THREE.Vector3(0, 1.3, 0);
    camera.position.sub(target).multiplyScalar(factor / previous.current).add(target);
    previous.current = factor; camera.updateProjectionMatrix(); invalidate();
  }, [camera, horizontal, size.width, size.height, invalidate]);
  return null;
}

function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.035);
    scene.environment = env.texture;
    return () => { scene.environment = null; env.dispose(); room.dispose(); pmrem.dispose(); };
  }, [gl, scene]);
  return null;
}

function Model({ url, paused, onReady }: { url: string; paused: boolean; onReady: () => void }) {
  const gltf = useLoader(GLTFLoader, url, loader => {
    loader.setDRACOLoader(draco);
  });
  useEffect(() => () => {
    // Object URLs belong to one download session; do not retain every visited model.
    useLoader.clear(GLTFLoader, url);
    const resources = new Set<{ dispose: () => void }>();
    gltf.scene.traverse(child => {
      if (!(child instanceof THREE.Mesh)) return;
      resources.add(child.geometry);
      for (const material of Array.isArray(child.material) ? child.material : [child.material]) {
        resources.add(material);
        for (const value of Object.values(material)) if (value instanceof THREE.Texture) resources.add(value);
      }
    });
    resources.forEach(resource => resource.dispose());
  }, [gltf, url]);
  const { object, mixer, scale, offset, ownedMaterials } = useMemo(() => {
    const object = gltf.scene.clone(true);
    const box = new THREE.Box3().setFromObject(object), size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
    const scale = 8 / Math.max(size.x, size.y, size.z);
    const mixer = new THREE.AnimationMixer(object);
    const glass = new Map<THREE.Material, THREE.Material>();
    const webFinish = (source: THREE.Material) => {
      if (!(source instanceof THREE.MeshPhysicalMaterial) || source.transmission === 0) return source;
      if (!glass.has(source)) {
        const material = source.clone();
        material.transmission = 0; material.transparent = true; material.opacity = .62;
        material.depthWrite = false; material.roughness = .18; material.metalness = .15;
        glass.set(source, material);
      }
      return glass.get(source)!;
    };
    object.traverse(child => { if (child instanceof THREE.Mesh) {
      child.castShadow = true; child.receiveShadow = true;
      child.material = Array.isArray(child.material) ? child.material.map(webFinish) : webFinish(child.material);
    } });
    return { object, mixer, scale, ownedMaterials: [...glass.values()], offset: [-center.x * scale, -box.min.y * scale, -center.z * scale] as [number, number, number] };
  }, [gltf]);
  useEffect(() => {
    gltf.animations.forEach(clip => mixer.clipAction(clip).play());
    onReady();
    return () => { mixer.stopAllAction(); mixer.uncacheRoot(object); ownedMaterials.forEach(material => material.dispose()); };
  }, [gltf, mixer, object, onReady, ownedMaterials]);
  useFrame((_, delta) => { if (!paused) mixer.update(Math.min(delta, .05)); });
  return <group scale={scale} position={offset}><primitive object={object} /></group>;
}

export default function RideViewer({ slug, url, paused, onReady }: { slug: string; url: string; paused: boolean; onReady: () => void }) {
  const horizontal = slug === "boomerang" || slug === "lightning";
  return <Canvas shadows={{ type: THREE.PCFShadowMap }} frameloop={paused ? "demand" : "always"} dpr={[1, 1.5]} camera={horizontal ? wideCameraConfig : cameraConfig} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.setClearColor("#10212e"); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.3; }}>
    <Studio />
    <WideFraming horizontal={horizontal} />
    <fog attach="fog" args={["#10212e", 30, 90]} />
    <ambientLight intensity={.4} />
    <directionalLight position={[-5, 12, 7]} intensity={3.8} color="#fff1d7" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={12} shadow-camera-bottom={-5} shadow-bias={-.001} />
    <directionalLight position={[7, 7, -5]} intensity={2.3} color="#bcdcff" />
    <Suspense fallback={null}><Model key={url} url={url} paused={paused} onReady={onReady} /></Suspense>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.025, 0]} receiveShadow><planeGeometry args={[1000, 1000]} /><meshStandardMaterial color="#10212e" roughness={.67} metalness={.12} /></mesh>
    <OrbitControls makeDefault target={[0, horizontal ? 1.3 : 3.8, 0]} enablePan={false} enableZoom minDistance={5} maxDistance={35} minPolarAngle={.15} maxPolarAngle={Math.PI * .485} autoRotate={horizontal && !paused} autoRotateSpeed={.5} enableDamping dampingFactor={.08} />
  </Canvas>;
}
