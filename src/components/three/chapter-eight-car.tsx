import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const DEFENDER_MODEL_URL = "/models/defender-suv.glb";

function CarModel() {
  const root = useRef<THREE.Group>(null);
  const { scene } = useGLTF(DEFENDER_MODEL_URL);

  const model = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
    return cloned;
  }, [scene]);

  useFrame((_, dt) => {
    if (!root.current) return;
    root.current.rotation.y += dt * 0.55;
  });

  return (
    <group ref={root} position={[0, -0.58, 0]}>
      <primitive object={model} scale={1.0} />
    </group>
  );
}

export default function ChapterEightCar() {
  return (
    <Canvas
      dpr={[1, 1.15]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.25, 4.4], fov: 36, near: 0.1, far: 60 }}
    >
      <ambientLight intensity={1.12} color="#f7f2e8" />
      <directionalLight position={[2.6, 3.2, 2.4]} intensity={1.95} color="#ffffff" />
      <pointLight position={[-2.4, 1.2, 1.8]} intensity={1.0} color="#e8c37a" />
      <pointLight position={[2.1, 1.0, 1.4]} intensity={0.75} color="#cfd8ff" />
      <CarModel />
    </Canvas>
  );
}

// Note: Removed preload to defer defender model loading until component is visible
// useGLTF.preload(DEFENDER_MODEL_URL);
