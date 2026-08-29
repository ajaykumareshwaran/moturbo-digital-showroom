import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshReflectorMaterial, Text, useGLTF, useTexture, Preload } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const PURPLE = "#e8c37a";
const GOLD = "#e8c37a";
const CARD = "#4a454f";

/** Scroll progress 0..1 read from a ref set by the parent (no re-renders). */
type P = {
  progress: React.MutableRefObject<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  onReady?: () => void;
  /** When true, R3F switches to demand-based rendering — used when the scene is faded out. */
  paused?: boolean;
};

/* ---------- Stylised supercar built from primitives ---------- */
function Car({ highQuality, progress }: { highQuality: boolean; progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/car2.glb");
  const accumulated = useRef(0);

  // Configure shadow flags directly — no clone needed, saves ~half the model RAM.
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = highQuality;
        obj.receiveShadow = highQuality;
      }
    });
  }, [scene, highQuality]);

  useFrame((_, dt) => {
    // Skip rotation when the scene is faded out — no-op saves CPU + overdraw.
    if (progress.current >= 0.93) return;
    accumulated.current += dt;
    const tick = highQuality ? 1 / 60 : 1 / 30;
    if (accumulated.current < tick) {
      return;
    }
    const step = accumulated.current;
    accumulated.current = 0;
    if (group.current) group.current.rotation.y += step * 0.035;
  });

  return (
    <group ref={group} position={[0, 0.08, 0]}>
      <primitive object={scene} scale={5.15} />
    </group>
  );
}

type QualityProfile = {
  tier: "high" | "medium" | "low";
  highQuality: boolean;
  dpr: number | [number, number];
  antialias: boolean;
  precision: "highp";
  fov: number;
  floatAnimations: boolean;
  /** HDR environment map resolution. Higher = richer IBL lighting. */
  envResolution: number;
  /** Enable the reflective floor material (skip on low-end mobile). */
  reflectorEnabled: boolean;
  /** Resolution of the reflector render target when enabled. */
  reflectorResolution: number;
};

/* ---------- Detailing Lab niche — left wall ---------- */
function DetailingLabNiche({ animate }: { animate: boolean }) {
  const floatRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!animate || !floatRef.current) return;
    floatRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.006;
  });
  return (
    <group position={[-10.55, 3.1, -9.5]}>
      {/* Architectural frame — dark titanium */}
      <mesh position={[-0.13, 2.16, 0]}>
        <boxGeometry args={[0.52, 0.22, 3.92]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      <mesh position={[-0.13, -2.16, 0]}>
        <boxGeometry args={[0.52, 0.22, 3.92]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      <mesh position={[-0.13, 0, -1.94]}>
        <boxGeometry args={[0.52, 4.32, 0.22]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      <mesh position={[-0.13, 0, 1.94]}>
        <boxGeometry args={[0.52, 4.32, 0.22]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      {/* Gold inner-edge trim */}
      <mesh position={[0.1, 2.05, 0]}>
        <boxGeometry args={[0.026, 0.026, 3.72]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.1, -2.05, 0]}>
        <boxGeometry args={[0.026, 0.026, 3.72]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.1, 0, -1.84]}>
        <boxGeometry args={[0.026, 4.1, 0.026]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.1, 0, 1.84]}>
        <boxGeometry args={[0.026, 4.1, 0.026]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      {/* Niche back plate */}
      <mesh position={[-0.36, 0, 0]}>
        <boxGeometry args={[0.04, 4.08, 3.72]} />
        <meshStandardMaterial color="#090910" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Three shelves with LED strips */}
      {([-1.1, 0.06, 1.22] as number[]).map((sy, si) => (
        <group key={si}>
          <mesh position={[-0.14, sy, 0]}>
            <boxGeometry args={[0.44, 0.058, 3.62]} />
            <meshStandardMaterial color="#18171d" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[-0.13, sy - 0.036, 0]}>
            <boxGeometry args={[0.38, 0.008, 3.5]} />
            <meshBasicMaterial color="#ffe8a0" toneMapped={false} />
          </mesh>
          {animate && <pointLight
            position={[-0.1, sy - 0.08, 0]}
            intensity={2.6}
            color="#ffd580"
            distance={1.7}
            decay={2}
          />}
        </group>
      ))}
      {/* Purple ambient + gold warm fill */}
      {animate && <pointLight
        position={[-0.3, 0, 0]}
        intensity={3.0}
        color="#6e38b2"
        distance={4.2}
        decay={2}
      />}
      {animate && <pointLight position={[0.1, 1.4, 0]} intensity={5.0} color={GOLD} distance={4.8} decay={2} />}
      {/* Products with subtle float */}
      <group ref={floatRef}>
        {/* Bottom shelf — featured wheel + brake set */}
        <group position={[-0.1, -0.95, -0.76]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.22, 0.065, 14, 36]} />
            <meshStandardMaterial color="#0c0c0d" roughness={0.92} metalness={0.1} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.09, 24]} />
            <meshStandardMaterial color="#bdbfc8" roughness={0.24} metalness={0.9} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.1, 14]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        <group position={[-0.1, -0.94, 0.68]}>
          <mesh>
            <boxGeometry args={[0.19, 0.22, 0.27]} />
            <meshStandardMaterial color="#b32121" roughness={0.42} metalness={0.56} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[0.21, 0.055, 0.29]} />
            <meshStandardMaterial color="#cb2b2b" roughness={0.38} metalness={0.6} />
          </mesh>
        </group>

        {/* Mid shelf — steering wheel + headlight module */}
        <group position={[-0.1, 0.18, -0.76]} rotation={[0.2, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.24, 0.025, 12, 34]} />
            <meshStandardMaterial color="#111116" roughness={0.64} metalness={0.22} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.05, 14]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        <group position={[-0.1, 0.1, 0.52]}>
          <mesh>
            <boxGeometry args={[0.18, 0.12, 0.56]} />
            <meshStandardMaterial color="#11121a" roughness={0.4} metalness={0.42} />
          </mesh>
          <mesh position={[0, 0.005, 0]}>
            <boxGeometry args={[0.182, 0.04, 0.52]} />
            <meshBasicMaterial color="#f6e4bf" toneMapped={false} />
          </mesh>
        </group>

        {/* Upper shelf — polisher + helmet + carbon spoiler */}
        <group position={[-0.1, 1.35, -0.9]}>
          <mesh>
            <cylinderGeometry args={[0.11, 0.12, 0.16, 24]} />
            <meshStandardMaterial color="#191a22" roughness={0.38} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.034, 0.034, 0.2, 12]} />
            <meshStandardMaterial color="#2a2b31" roughness={0.42} metalness={0.44} />
          </mesh>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 20]} />
            <meshStandardMaterial color="#ebc37a" roughness={0.76} metalness={0.08} />
          </mesh>
        </group>
        <group position={[-0.1, 1.35, 0.0]}>
          <mesh>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#111119" roughness={0.32} metalness={0.52} />
          </mesh>
          <mesh position={[0.03, 0.02, 0.1]}>
            <boxGeometry args={[0.08, 0.05, 0.01]} />
            <meshBasicMaterial color="#a5ecff" toneMapped={false} />
          </mesh>
        </group>
        <group position={[-0.1, 1.36, 0.92]}>
          <mesh>
            <boxGeometry args={[0.07, 0.16, 0.48]} />
            <meshStandardMaterial color="#121218" roughness={0.28} metalness={0.5} />
          </mesh>
          <mesh position={[0.036, 0, 0]}>
            <boxGeometry args={[0.005, 0.13, 0.39]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>

        {/* Detailing support tools and microfiber (kept subtle) */}
        <group position={[-0.1, -0.96, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.055, 0.066, 0.2, 12]} />
            <meshStandardMaterial color="#23232c" roughness={0.42} metalness={0.32} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        <group position={[-0.1, 0.2, 1.03]}>
          <mesh>
            <boxGeometry args={[0.18, 0.14, 0.28]} />
            <meshStandardMaterial color="#f0eef8" roughness={0.92} metalness={0.01} />
          </mesh>
          <mesh position={[0.08, 0, 0]}>
            <boxGeometry args={[0.004, 0.05, 0.05]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {/* Label */}
      <Text
        position={[0.08, 1.76, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.115}
        letterSpacing={0.14}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
      >
        DETAILING LAB
      </Text>
    </group>
  );
}

/* ---------- Accessory Workroom niche — right wall ---------- */
function AccessoryWorkroomNiche({ animate }: { animate: boolean }) {
  const floatRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!animate || !floatRef.current) return;
    floatRef.current.position.y = Math.sin(clock.elapsedTime * 0.44 + 1.1) * 0.006;
  });
  return (
    <group position={[10.55, 3.1, -9.5]}>
      {/* Architectural frame — dark titanium */}
      <mesh position={[0.13, 2.16, 0]}>
        <boxGeometry args={[0.52, 0.22, 3.92]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      <mesh position={[0.13, -2.16, 0]}>
        <boxGeometry args={[0.52, 0.22, 3.92]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      <mesh position={[0.13, 0, -1.94]}>
        <boxGeometry args={[0.52, 4.32, 0.22]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      <mesh position={[0.13, 0, 1.94]}>
        <boxGeometry args={[0.52, 4.32, 0.22]} />
        <meshStandardMaterial color="#131218" roughness={0.44} metalness={0.46} />
      </mesh>
      {/* Gold inner-edge trim */}
      <mesh position={[-0.1, 2.05, 0]}>
        <boxGeometry args={[0.026, 0.026, 3.72]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.1, -2.05, 0]}>
        <boxGeometry args={[0.026, 0.026, 3.72]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.1, 0, -1.84]}>
        <boxGeometry args={[0.026, 4.1, 0.026]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-0.1, 0, 1.84]}>
        <boxGeometry args={[0.026, 4.1, 0.026]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.9}
          roughness={0.18}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      {/* Niche back plate */}
      <mesh position={[0.36, 0, 0]}>
        <boxGeometry args={[0.04, 4.08, 3.72]} />
        <meshStandardMaterial color="#090910" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Three shelves with LED strips */}
      {([-1.1, 0.06, 1.22] as number[]).map((sy, si) => (
        <group key={si}>
          <mesh position={[0.14, sy, 0]}>
            <boxGeometry args={[0.44, 0.058, 3.62]} />
            <meshStandardMaterial color="#18171d" roughness={0.5} metalness={0.3} />
          </mesh>
          <mesh position={[0.13, sy - 0.036, 0]}>
            <boxGeometry args={[0.38, 0.008, 3.5]} />
            <meshBasicMaterial color="#ffe8a0" toneMapped={false} />
          </mesh>
          {animate && <pointLight
            position={[0.1, sy - 0.08, 0]}
            intensity={2.6}
            color="#ffd580"
            distance={1.7}
            decay={2}
          />}
        </group>
      ))}
      {/* Purple ambient + gold warm fill */}
      {animate && <pointLight position={[0.3, 0, 0]} intensity={3.0} color="#6e38b2" distance={4.2} decay={2} />}
      {animate && <pointLight position={[-0.1, 1.4, 0]} intensity={5.0} color={GOLD} distance={4.8} decay={2} />}
      {/* Products */}
      <group ref={floatRef}>
        {/* Shelf 1 — alloy wheel lying flat */}
        <group position={[0.1, -0.97, -0.55]}>
          <mesh>
            <torusGeometry args={[0.22, 0.065, 14, 36]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.155, 0.155, 0.08, 24]} />
            <meshStandardMaterial color="#c4c4cc" roughness={0.22} metalness={0.9} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.09, 14]} />
            <meshStandardMaterial color={GOLD} roughness={0.18} metalness={0.9} />
          </mesh>
          {([0, 1, 2, 3, 4] as number[]).map((s) => (
            <mesh key={s} rotation={[0, (s * Math.PI * 2) / 5, 0]}>
              <boxGeometry args={[0.016, 0.085, 0.28]} />
              <meshStandardMaterial color="#ccccd4" roughness={0.25} metalness={0.88} />
            </mesh>
          ))}
        </group>
        {/* Shelf 1 — brake caliper */}
        <group position={[0.1, -0.955, 0.72]}>
          <mesh>
            <boxGeometry args={[0.18, 0.22, 0.28]} />
            <meshStandardMaterial color="#a81c1c" roughness={0.42} metalness={0.58} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <boxGeometry args={[0.2, 0.055, 0.3]} />
            <meshStandardMaterial color="#be2020" roughness={0.38} metalness={0.62} />
          </mesh>
          <mesh position={[-0.06, 0.13, -0.08]}>
            <cylinderGeometry args={[0.015, 0.015, 0.055, 8]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.06, 0.13, -0.08]}>
            <cylinderGeometry args={[0.015, 0.015, 0.055, 8]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[-0.06, 0.13, 0.08]}>
            <cylinderGeometry args={[0.015, 0.015, 0.055, 8]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0.06, 0.13, 0.08]}>
            <cylinderGeometry args={[0.015, 0.015, 0.055, 8]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[-0.098, 0, 0]}>
            <boxGeometry args={[0.004, 0.08, 0.2]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
        {/* Shelf 2 — steering wheel */}
        <group position={[0.1, 0.2, -0.7]} rotation={[0.18, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.24, 0.026, 12, 36]} />
            <meshStandardMaterial color="#0e0e0e" roughness={0.65} metalness={0.22} />
          </mesh>
          <mesh position={[-0.1, 0, 0]}>
            <boxGeometry args={[0.016, 0.36, 0.016]} />
            <meshStandardMaterial color="#181818" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh>
            <boxGeometry args={[0.016, 0.36, 0.016]} />
            <meshStandardMaterial color="#181818" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.016, 0.36, 0.016]} />
            <meshStandardMaterial color="#181818" roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.055, 14]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.244, 0.005, 8, 36]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.38}
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
        </group>
        {/* Shelf 2 — carbon fibre panel */}
        <group position={[0.1, 0.25, 0.82]}>
          <mesh>
            <boxGeometry args={[0.055, 0.26, 0.44]} />
            <meshStandardMaterial color="#111114" roughness={0.28} metalness={0.48} />
          </mesh>
          <mesh position={[-0.029, -0.1, 0]}>
            <boxGeometry args={[0.003, 0.004, 0.43]} />
            <meshBasicMaterial color="#222228" toneMapped={false} />
          </mesh>
          <mesh position={[-0.029, -0.02, 0]}>
            <boxGeometry args={[0.003, 0.004, 0.43]} />
            <meshBasicMaterial color="#222228" toneMapped={false} />
          </mesh>
          <mesh position={[-0.029, 0.06, 0]}>
            <boxGeometry args={[0.003, 0.004, 0.43]} />
            <meshBasicMaterial color="#222228" toneMapped={false} />
          </mesh>
          <mesh position={[-0.029, 0.14, 0]}>
            <boxGeometry args={[0.003, 0.004, 0.43]} />
            <meshBasicMaterial color="#222228" toneMapped={false} />
          </mesh>
          <mesh position={[-0.029, 0, 0]}>
            <boxGeometry args={[0.003, 0.24, 0.004]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
        {/* Shelf 3 — exhaust tip */}
        <group position={[0.1, 1.39, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.13, 0.1, 0.5, 24]} />
            <meshStandardMaterial color="#c4c4c4" roughness={0.18} metalness={0.92} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <torusGeometry args={[0.13, 0.011, 10, 28]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.5}
              roughness={0.18}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <torusGeometry args={[0.1, 0.011, 10, 28]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        {/* Shelf 3 — accessory boxes */}
        <group position={[0.1, 1.375, 0.12]}>
          <mesh>
            <boxGeometry args={[0.14, 0.18, 0.2]} />
            <meshStandardMaterial color="#0c0c14" roughness={0.25} metalness={0.5} />
          </mesh>
          <mesh position={[-0.075, 0.06, 0]}>
            <boxGeometry args={[0.004, 0.1, 0.16]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
        <group position={[0.1, 1.375, 0.72]}>
          <mesh>
            <boxGeometry args={[0.14, 0.18, 0.2]} />
            <meshStandardMaterial color="#14100c" roughness={0.25} metalness={0.5} />
          </mesh>
          <mesh position={[-0.075, 0.06, 0]}>
            <boxGeometry args={[0.004, 0.1, 0.16]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
        <group position={[0.1, 1.375, 1.3]}>
          <mesh>
            <boxGeometry args={[0.14, 0.18, 0.2]} />
            <meshStandardMaterial color="#0c140c" roughness={0.25} metalness={0.5} />
          </mesh>
          <mesh position={[-0.075, 0.06, 0]}>
            <boxGeometry args={[0.004, 0.1, 0.16]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {/* Label */}
      <Text
        position={[-0.08, 1.76, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.115}
        letterSpacing={0.1}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
      >
        ACCESSORY WORKROOM
      </Text>
    </group>
  );
}

function CenterCinematicWallDisplay({ animate }: { animate: boolean }) {
  const sweepRef = useRef<THREE.Mesh>(null);
  const showroomPhoto = useTexture("/showroom-bg.jpg");
  const [photoReady, setPhotoReady] = useState(false);

  useEffect(() => {
    const image = (showroomPhoto as THREE.Texture & { image?: HTMLImageElement | ImageData }).image;
    if (image && (image as HTMLImageElement).width && (image as HTMLImageElement).height) {
      setPhotoReady(true);
      return;
    }

    const handleReady = () => setPhotoReady(true);
    showroomPhoto.addEventListener("update", handleReady);
    return () => showroomPhoto.removeEventListener("update", handleReady);
  }, [showroomPhoto]);

  useMemo(() => {
    showroomPhoto.colorSpace = THREE.SRGBColorSpace;
    showroomPhoto.needsUpdate = true;
    return showroomPhoto;
  }, [showroomPhoto]);

  useFrame(({ clock }) => {
    if (!animate || !sweepRef.current) return;
    sweepRef.current.position.x = Math.sin(clock.elapsedTime * 0.55) * 2.2;
  });

  return (
    <group position={[0, 4.52, -9.8]} rotation={[0, 0, 0]}>
      {/* Recess pocket */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[9.5, 2.5, 0.36]} />
        <meshStandardMaterial color="#121218" roughness={0.58} metalness={0.18} />
      </mesh>

      {/* Gold illuminated frame */}
      <mesh position={[0, 1.07, 0.06]}>
        <boxGeometry args={[8.7, 0.06, 0.05]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, -1.07, 0.06]}>
        <boxGeometry args={[8.7, 0.06, 0.05]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-4.32, 0, 0.06]}>
        <boxGeometry args={[0.06, 2.2, 0.05]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[4.32, 0, 0.06]}>
        <boxGeometry args={[0.06, 2.2, 0.05]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>

      {/* Real car photo screen */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[8.2, 2.05]} />
        <meshStandardMaterial color="#07080d" roughness={0.3} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.01, 0.1]}>
        <planeGeometry args={[8.0, 1.95]} />
        <meshBasicMaterial
          map={showroomPhoto}
          transparent
          opacity={photoReady ? 1 : 0}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.01, 0.105]}>
        <planeGeometry args={[8.0, 1.95]} />
        <meshBasicMaterial color="#11131e" transparent opacity={photoReady ? 0.16 : 0} toneMapped={false} />
      </mesh>

      {/* Smoke and reflection sweep */}
      <mesh position={[1.0, 0.22, 0.14]}>
        <planeGeometry args={[3.3, 0.7]} />
        <meshBasicMaterial color="#9da3b6" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <mesh position={[-1.9, -0.02, 0.14]}>
        <planeGeometry args={[2.8, 0.62]} />
        <meshBasicMaterial color="#c6c8d2" transparent opacity={0.08} toneMapped={false} />
      </mesh>
      <mesh ref={sweepRef} position={[0, 0, 0.15]}>
        <planeGeometry args={[1.0, 1.94]} />
        <meshBasicMaterial color="#f9f0cf" transparent opacity={0.06} toneMapped={false} />
      </mesh>

      {animate && <pointLight position={[0, 0.2, 0.35]} intensity={7.5} color={GOLD} distance={8} decay={2} />}
      {animate && <pointLight
        position={[0, 0.1, 0.34]}
        intensity={3.4}
        color="#6d3ba8"
        distance={7}
        decay={2}
      />}
    </group>
  );
}

function SideAccessoryRack({ x, z, seed, animate }: { x: number; z: number; seed: number; animate: boolean }) {
  const floatRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!animate || !floatRef.current) return;
    floatRef.current.position.y = Math.sin(clock.elapsedTime * 0.42 + seed) * 0.004;
  });

  const side = x < 0 ? -1 : 1;
  const variant = seed % 4;

  return (
    <group position={[x, 2.78, z]}>
      <mesh position={[side * -0.11, 1.24, 0]}>
        <boxGeometry args={[0.42, 0.18, 2.22]} />
        <meshStandardMaterial color="#121219" roughness={0.46} metalness={0.42} />
      </mesh>
      <mesh position={[side * -0.11, -1.24, 0]}>
        <boxGeometry args={[0.42, 0.18, 2.22]} />
        <meshStandardMaterial color="#121219" roughness={0.46} metalness={0.42} />
      </mesh>
      <mesh position={[side * -0.11, 0, -1.08]}>
        <boxGeometry args={[0.42, 2.46, 0.18]} />
        <meshStandardMaterial color="#121219" roughness={0.46} metalness={0.42} />
      </mesh>
      <mesh position={[side * -0.11, 0, 1.08]}>
        <boxGeometry args={[0.42, 2.46, 0.18]} />
        <meshStandardMaterial color="#121219" roughness={0.46} metalness={0.42} />
      </mesh>

      <mesh position={[side * 0.07, 1.15, 0]}>
        <boxGeometry args={[0.022, 0.022, 2.02]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[side * 0.07, -1.15, 0]}>
        <boxGeometry args={[0.022, 0.022, 2.02]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.85}
          roughness={0.2}
          metalness={0.9}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[side * 0.31, 0, 0]}>
        <boxGeometry args={[0.036, 2.26, 2.0]} />
        <meshStandardMaterial color="#0a0a10" roughness={0.86} metalness={0.08} />
      </mesh>

      {([0.62, -0.12, -0.84] as number[]).map((sy, i) => (
        <group key={i}>
          <mesh position={[side * 0.12, sy, 0]}>
            <boxGeometry args={[0.3, 0.045, 1.86]} />
            <meshStandardMaterial color="#191921" roughness={0.5} metalness={0.28} />
          </mesh>
          <mesh position={[side * 0.1, sy - 0.03, 0]}>
            <boxGeometry args={[0.27, 0.007, 1.76]} />
            <meshBasicMaterial color="#ffe7a5" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {animate && <pointLight
        position={[side * 0.1, 0.72, 0]}
        intensity={2.8}
        color={GOLD}
        distance={3.6}
        decay={2}
      />}
      {animate && <pointLight
        position={[side * 0.12, 0.2, 0]}
        intensity={1.8}
        color="#6d39a8"
        distance={3.2}
        decay={2}
      />}

      <group ref={animate ? floatRef : undefined}>
        {variant === 0 ? (
          <>
            <group position={[side * 0.11, -0.88, -0.44]} rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.16, 0.045, 12, 28]} />
                <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} />
              </mesh>
              <mesh>
                <cylinderGeometry args={[0.1, 0.1, 0.07, 20]} />
                <meshStandardMaterial color="#bfc0c8" roughness={0.24} metalness={0.88} />
              </mesh>
            </group>
            <mesh position={[side * 0.11, -0.82, 0.45]}>
              <boxGeometry args={[0.16, 0.18, 0.22]} />
              <meshStandardMaterial color="#b92323" roughness={0.42} metalness={0.56} />
            </mesh>
          </>
        ) : variant === 1 ? (
          <>
            <group position={[side * 0.11, -0.82, -0.36]}>
              <mesh>
                <cylinderGeometry args={[0.09, 0.1, 0.13, 20]} />
                <meshStandardMaterial color="#1a1b22" roughness={0.36} metalness={0.55} />
              </mesh>
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
                <meshStandardMaterial color="#2a2c33" roughness={0.4} metalness={0.44} />
              </mesh>
            </group>
            <mesh position={[side * 0.11, -0.8, 0.45]}>
              <sphereGeometry args={[0.09, 14, 14]} />
              <meshStandardMaterial color="#12121a" roughness={0.32} metalness={0.5} />
            </mesh>
          </>
        ) : variant === 2 ? (
          <>
            <mesh position={[side * 0.11, -0.78, -0.34]}>
              <boxGeometry args={[0.16, 0.1, 0.42]} />
              <meshStandardMaterial color="#11121a" roughness={0.38} metalness={0.42} />
            </mesh>
            <mesh position={[side * 0.11, -0.78, -0.34]}>
              <boxGeometry args={[0.162, 0.03, 0.4]} />
              <meshBasicMaterial color="#f4e4bc" toneMapped={false} />
            </mesh>
            <mesh position={[side * 0.11, -0.8, 0.44]}>
              <boxGeometry args={[0.06, 0.18, 0.32]} />
              <meshStandardMaterial color="#121218" roughness={0.28} metalness={0.5} />
            </mesh>
          </>
        ) : (
          <>
            <group position={[side * 0.11, -0.85, -0.36]} rotation={[0.2, 0, 0]}>
              <mesh>
                <torusGeometry args={[0.16, 0.02, 10, 28]} />
                <meshStandardMaterial color="#111116" roughness={0.62} metalness={0.2} />
              </mesh>
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 0.04, 12]} />
                <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
              </mesh>
            </group>
            <mesh position={[side * 0.11, -0.8, 0.4]}>
              <boxGeometry args={[0.14, 0.14, 0.24]} />
              <meshStandardMaterial color="#24242c" roughness={0.7} metalness={0.12} />
            </mesh>
          </>
        )}

        <mesh position={[side * 0.11, -0.04, -0.58]}>
          <boxGeometry args={[0.16, 0.12, 0.22]} />
          <meshStandardMaterial color="#1a1a22" roughness={0.35} metalness={0.35} />
        </mesh>
        <mesh position={[side * 0.11, -0.02, 0.18]}>
          <boxGeometry args={[0.16, 0.12, 0.22]} />
          <meshStandardMaterial color="#2a2622" roughness={0.35} metalness={0.35} />
        </mesh>
        <mesh position={[side * 0.11, -0.01, 0.74]}>
          <boxGeometry args={[0.16, 0.12, 0.22]} />
          <meshStandardMaterial color="#232328" roughness={0.35} metalness={0.35} />
        </mesh>

        <mesh position={[side * 0.11, 0.74, -0.64]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.095, 0.08, 0.26, 20]} />
          <meshStandardMaterial color="#c7c7cf" roughness={0.2} metalness={0.9} />
        </mesh>
        <mesh position={[side * 0.11, 0.72, 0.12]}>
          <boxGeometry args={[0.16, 0.14, 0.24]} />
          <meshStandardMaterial color="#121218" roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[side * 0.11, 0.72, 0.74]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#111118" roughness={0.3} metalness={0.52} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Showroom architecture ---------- */
function Showroom({ highQuality, tier, floatAnimations, reflectorEnabled, reflectorResolution }: {
  highQuality: boolean;
  tier: "high" | "medium" | "low";
  floatAnimations: boolean;
  reflectorEnabled: boolean;
  reflectorResolution: number;
}) {
  const strips = useMemo(() => [-9, -4.5, 0, 4.5, 9, 13.5, 18], []);
  const wallStrips = useMemo(
    (): [number, number, number, number, number, number][] => [
      [-10.78, 5.4, -6.2, 0.12, 1.6, 0.06],
      [-10.78, 4.2, -1.0, 0.12, 1.9, 0.06],
      [-10.78, 5.1, 4.6, 0.12, 1.7, 0.06],
      [10.78, 5.4, 10.5, 0.12, 1.6, 0.06],
      [10.78, 4.1, 15.4, 0.12, 1.9, 0.06],
      [10.78, 5.0, 20.2, 0.12, 1.7, 0.06],
      [-6.8, 5.75, 25.08, 1.7, 0.08, 0.06],
      [-2.2, 5.75, 25.08, 1.7, 0.08, 0.06],
      [2.2, 5.75, 25.08, 1.7, 0.08, 0.06],
      [6.8, 5.75, 25.08, 1.7, 0.08, 0.06],
      [-6.8, 1.15, 25.08, 1.7, 0.08, 0.06],
      [-2.2, 1.15, 25.08, 1.7, 0.08, 0.06],
      [2.2, 1.15, 25.08, 1.7, 0.08, 0.06],
      [6.8, 1.15, 25.08, 1.7, 0.08, 0.06],
    ],
    [],
  );
  const productTones = useMemo(() => ["#111111", "#242424", "#c7a24f", "#f3f3f3"], []);
  return (
    <group>
      {/* reflective studio floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        {!reflectorEnabled ? (
          <meshStandardMaterial color="#b9b7bb" roughness={0.12} metalness={0.45} />
        ) : (
          <MeshReflectorMaterial
            blur={[40, 10]}
            resolution={reflectorResolution}
            mixBlur={0.15}
            mixStrength={highQuality ? 8 : 5}
            roughness={0.5}
            depthScale={0.2}
            minDepthThreshold={0.6}
            maxDepthThreshold={1.2}
            color="#b9b7bb"
            metalness={0.08}
            mirror={0.05}
          />
        )}
      </mesh>

      {/* gold LED ceiling strips */}
      {strips.map((z) => (
        <group key={`led${z}`}>
          <mesh position={[0, 6.4, z]}>
            <boxGeometry args={[26, 0.05, 0.12]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={1.5}
              roughness={0.18}
              metalness={0.08}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 6.36, z]}>
            <boxGeometry args={[26, 0.14, 0.22]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.16} toneMapped={false} />
          </mesh>
          {highQuality && <pointLight position={[0, 6.1, z]} intensity={8} color={GOLD} distance={16} decay={2} />}
        </group>
      ))}

      {/* solid studio side panels (no transmission to avoid color fringing) */}
      {[-11, 11].map((x) => (
        <mesh key={`wall${x}`} position={[x, 3.4, 6]}>
          <boxGeometry args={[0.08, 6.8, 60]} />
          <meshStandardMaterial color={CARD} roughness={0.6} metalness={0.08} />
        </mesh>
      ))}

      {/* extra gold accent strips for emptier wall areas */}
      {wallStrips.map(([x, y, z, w, h, d], index) => (
        <group key={`accentStrip${index}`} position={[x, y, z]}>
          <mesh>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={1.15}
              roughness={0.2}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[w + 0.08, h + 0.12, d + 0.03]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.12} toneMapped={false} />
          </mesh>
          {highQuality && (
            <pointLight
              position={[0, 0, 0.1]}
              intensity={2.6}
              color={GOLD}
              distance={4.5}
              decay={2}
            />
          )}
        </group>
      ))}

      {/* horizontal gold base strip along both walls */}
      {[-10.82, 10.82].map((x) => (
        <group key={`basestrip${x}`}>
          <mesh position={[x, 0.06, 6]}>
            <boxGeometry args={[0.07, 0.12, 58]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.9}
              roughness={0.22}
              metalness={0.1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[x, 0.13, 6]}>
            <boxGeometry args={[0.1, 0.18, 58]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.1} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Premium architectural wall niche displays */}
      <DetailingLabNiche animate={floatAnimations} />
      <AccessoryWorkroomNiche animate={floatAnimations} />
      <CenterCinematicWallDisplay animate={floatAnimations} />
      {[
        { x: -10.55, z: -6.2, seed: 1 },
        { x: -10.55, z: 1.6, seed: 2 },
        { x: -10.55, z: 7.8, seed: 3 },
        { x: -10.55, z: 11.2, seed: 9 },
        { x: -10.55, z: 19.2, seed: 4 },
        { x: 10.55, z: -6.2, seed: 5 },
        { x: 10.55, z: 1.6, seed: 6 },
        { x: 10.55, z: 7.8, seed: 11 },
        { x: 10.55, z: 11.2, seed: 10 },
        { x: 10.55, z: 16.8, seed: 7 },
        { x: 10.55, z: 22.1, seed: 8 },
      ].map((rack) => (
        <SideAccessoryRack key={`${rack.x}-${rack.z}`} x={rack.x} z={rack.z} seed={rack.seed} animate={floatAnimations} />
      ))}

      {/* highlighted lounge platform + table set */}
      <group position={[8.6, 0.02, 12.8]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[2.95, 3.2, 0.3, 32]} />
          <meshStandardMaterial color="#2a272f" roughness={0.58} metalness={0.18} />
        </mesh>
        <mesh position={[0, 0.41, 0]}>
          <cylinderGeometry args={[1.65, 1.85, 0.22, 32]} />
          <meshStandardMaterial color="#1f1e24" roughness={0.5} metalness={0.22} />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <torusGeometry args={[1.77, 0.028, 12, 36]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.95}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.49, 0]}>
          <cylinderGeometry args={[1.2, 1.22, 0.08, 24]} />
          <meshStandardMaterial color="#1b1d26" roughness={0.18} metalness={0.55} />
        </mesh>
        <mesh position={[0.55, 0.57, -0.1]}>
          <boxGeometry args={[0.32, 0.09, 0.22]} />
          <meshStandardMaterial color="#d7d7dc" roughness={0.24} metalness={0.62} />
        </mesh>
        <mesh position={[0.55, 0.64, -0.1]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#141418" roughness={0.35} metalness={0.25} />
        </mesh>
        <pointLight position={[0, 0.55, 0]} intensity={5.8} color={GOLD} distance={3.8} decay={2} />
        <pointLight
          position={[-1.0, -0.06, 0.7]}
          intensity={4.8}
          color="#8d63d0"
          distance={3.2}
          decay={2}
        />
      </group>

      {/* structural columns */}
      {strips.map((z) =>
        [-10.4, 10.4].map((x) => (
          <mesh key={`col${z}${x}`} position={[x, 3.4, z]}>
            <boxGeometry args={[0.35, 6.8, 0.35]} />
            <meshStandardMaterial color="#7c7680" metalness={0.12} roughness={0.45} />
          </mesh>
        )),
      )}

      {/* accessory display wall (right) — kept visible on mobile as a static rack when motion is reduced */}
      {Array.from({ length: 12 }).map((_, i) => {
        const y = 1.4 + (i % 3) * 1.3;
        const z = 8 + Math.floor(i / 3) * 2.2;
        const toneA = productTones[i % productTones.length]!;
        const toneB = productTones[(i + 1) % productTones.length]!;
        const toneC = productTones[(i + 2) % productTones.length]!;
        const variant = i % 8;

        return (
          <group key={`disp${i}`} position={[9.72, y, z]}>
            {/* shelf back plate */}
            <mesh position={[0.16, 0, 0]}>
              <boxGeometry args={[0.05, 0.64, 1.22]} />
              <meshStandardMaterial color="#222129" metalness={0.22} roughness={0.52} />
            </mesh>
            {/* shelf tray */}
            <mesh position={[-0.02, -0.19, 0]}>
              <boxGeometry args={[0.24, 0.045, 1.18]} />
              <meshStandardMaterial
                color="#1a1a21"
                metalness={0.35}
                roughness={0.35}
                emissive={GOLD}
                emissiveIntensity={0.04}
              />
            </mesh>
            {/* slim side lips */}
            <mesh position={[-0.02, -0.155, 0.58]}>
              <boxGeometry args={[0.23, 0.025, 0.03]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={0.45}
                metalness={0.9}
                roughness={0.2}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[-0.02, -0.155, -0.58]}>
              <boxGeometry args={[0.23, 0.025, 0.03]} />
              <meshStandardMaterial
                color={GOLD}
                emissive={GOLD}
                emissiveIntensity={0.45}
                metalness={0.9}
                roughness={0.2}
                toneMapped={false}
              />
            </mesh>

            {variant === 0 ? (
              <>
                {/* alloy wheel + brake disc */}
                <group position={[0.0, -0.01, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
                  <mesh>
                    <torusGeometry args={[0.2, 0.06, 14, 34]} />
                    <meshStandardMaterial color="#101011" roughness={0.9} metalness={0.1} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry args={[0.13, 0.13, 0.09, 20]} />
                    <meshStandardMaterial color="#bfc0c7" roughness={0.26} metalness={0.88} />
                  </mesh>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <mesh key={s} rotation={[0, (s * Math.PI * 2) / 5, 0]}>
                      <boxGeometry args={[0.014, 0.075, 0.22]} />
                      <meshStandardMaterial color="#cfd0d8" roughness={0.24} metalness={0.9} />
                    </mesh>
                  ))}
                </group>
                <mesh position={[0.0, -0.01, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.12, 0.013, 10, 24]} />
                  <meshStandardMaterial color="#888a92" roughness={0.22} metalness={0.85} />
                </mesh>
              </>
            ) : variant === 1 ? (
              <>
                {/* steering wheel + gear knob */}
                <group position={[0.0, 0.06, -0.2]} rotation={[0.18, 0, 0]}>
                  <mesh>
                    <torusGeometry args={[0.19, 0.022, 12, 30]} />
                    <meshStandardMaterial color="#0e0e10" roughness={0.62} metalness={0.22} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry args={[0.042, 0.042, 0.05, 14]} />
                    <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
                  </mesh>
                </group>
                <mesh position={[0.04, -0.02, 0.48]}>
                  <sphereGeometry args={[0.085, 12, 12]} />
                  <meshStandardMaterial color="#18181f" roughness={0.28} metalness={0.6} />
                </mesh>
              </>
            ) : variant === 2 ? (
              <>
                {/* LED headlight bar + electronics module */}
                <mesh position={[0.0, 0.04, -0.14]}>
                  <boxGeometry args={[0.18, 0.12, 0.58]} />
                  <meshStandardMaterial color="#101015" roughness={0.38} metalness={0.42} />
                </mesh>
                <mesh position={[0.0, 0.04, -0.14]}>
                  <boxGeometry args={[0.182, 0.04, 0.56]} />
                  <meshBasicMaterial color="#f4e4bc" toneMapped={false} />
                </mesh>
                <mesh position={[0.02, -0.03, 0.38]}>
                  <boxGeometry args={[0.14, 0.2, 0.25]} />
                  <meshStandardMaterial color={toneA} roughness={0.34} metalness={0.38} />
                </mesh>
              </>
            ) : variant === 3 ? (
              <>
                {/* exhaust tip + carbon panel */}
                <group position={[0.0, 0.0, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
                  <mesh>
                    <cylinderGeometry args={[0.11, 0.09, 0.34, 22]} />
                    <meshStandardMaterial color="#c9c9cf" roughness={0.18} metalness={0.92} />
                  </mesh>
                  <mesh position={[0, 0.18, 0]}>
                    <torusGeometry args={[0.11, 0.009, 10, 24]} />
                    <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
                  </mesh>
                </group>
                <mesh position={[0.0, -0.02, 0.44]}>
                  <boxGeometry args={[0.07, 0.22, 0.42]} />
                  <meshStandardMaterial color="#121218" roughness={0.28} metalness={0.48} />
                </mesh>
              </>
            ) : variant === 4 ? (
              <>
                {/* speaker + tweeter + amp */}
                <mesh position={[0.0, -0.01, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.11, 0.11, 0.08, 22]} />
                  <meshStandardMaterial color="#111112" roughness={0.82} metalness={0.14} />
                </mesh>
                <mesh position={[0.0, -0.01, -0.34]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.062, 0.062, 0.081, 18]} />
                  <meshStandardMaterial color="#8f9097" roughness={0.3} metalness={0.72} />
                </mesh>
                <mesh position={[-0.08, 0.12, 0.14]}>
                  <sphereGeometry args={[0.045, 10, 10]} />
                  <meshStandardMaterial color="#16161a" roughness={0.46} metalness={0.45} />
                </mesh>
                <mesh position={[0.04, -0.03, 0.44]}>
                  <boxGeometry args={[0.16, 0.13, 0.24]} />
                  <meshStandardMaterial color={toneB} roughness={0.34} metalness={0.4} />
                </mesh>
              </>
            ) : variant === 5 ? (
              <>
                {/* floor mat roll + seat cover fold */}
                <mesh position={[0.0, -0.03, -0.22]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.09, 0.09, 0.46, 20]} />
                  <meshStandardMaterial color="#17171b" roughness={0.9} metalness={0.05} />
                </mesh>
                <mesh position={[0.02, -0.03, 0.34]}>
                  <boxGeometry args={[0.19, 0.16, 0.29]} />
                  <meshStandardMaterial color="#26262d" roughness={0.72} metalness={0.12} />
                </mesh>
                <mesh position={[0.09, 0.0, 0.34]}>
                  <boxGeometry args={[0.004, 0.09, 0.12]} />
                  <meshBasicMaterial color={GOLD} toneMapped={false} />
                </mesh>
              </>
            ) : variant === 6 ? (
              <>
                {/* detailing machine + foam cannon + brush */}
                <group position={[-0.01, -0.01, -0.2]}>
                  <mesh>
                    <cylinderGeometry args={[0.105, 0.115, 0.16, 20]} />
                    <meshStandardMaterial color="#19191e" roughness={0.36} metalness={0.55} />
                  </mesh>
                  <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.034, 0.034, 0.22, 12]} />
                    <meshStandardMaterial color="#2a2a31" roughness={0.42} metalness={0.45} />
                  </mesh>
                </group>
                <group position={[0.06, -0.02, 0.34]}>
                  <mesh>
                    <cylinderGeometry args={[0.06, 0.07, 0.2, 12]} />
                    <meshStandardMaterial color={toneC} roughness={0.36} metalness={0.36} />
                  </mesh>
                  <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.026, 0.026, 0.1, 10]} />
                    <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.9} />
                  </mesh>
                </group>
                <group position={[-0.1, 0.08, 0.46]}>
                  {/* spark plug + compact parts box to avoid decorative vase look */}
                  <mesh>
                    <boxGeometry args={[0.12, 0.08, 0.16]} />
                    <meshStandardMaterial color="#1f1f26" roughness={0.4} metalness={0.28} />
                  </mesh>
                  <mesh position={[0, 0.07, 0]}>
                    <boxGeometry args={[0.124, 0.02, 0.164]} />
                    <meshStandardMaterial
                      color={GOLD}
                      emissive={GOLD}
                      emissiveIntensity={0.25}
                      roughness={0.2}
                      metalness={0.9}
                      toneMapped={false}
                    />
                  </mesh>
                  <group position={[0.06, 0.1, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
                    <mesh>
                      <cylinderGeometry args={[0.014, 0.014, 0.12, 10]} />
                      <meshStandardMaterial color="#c7c8cf" roughness={0.22} metalness={0.9} />
                    </mesh>
                    <mesh position={[0, 0.055, 0]}>
                      <cylinderGeometry args={[0.022, 0.022, 0.03, 10]} />
                      <meshStandardMaterial color="#f3f3f3" roughness={0.35} metalness={0.05} />
                    </mesh>
                    <mesh position={[0, -0.055, 0]}>
                      <cylinderGeometry args={[0.017, 0.017, 0.024, 6]} />
                      <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.88} />
                    </mesh>
                  </group>
                </group>
              </>
            ) : (
              <>
                {/* helmet + micro electronics */}
                <mesh position={[0.0, 0.01, -0.24]}>
                  <sphereGeometry args={[0.12, 18, 18]} />
                  <meshStandardMaterial color="#111118" roughness={0.3} metalness={0.52} />
                </mesh>
                <mesh position={[0.03, 0.03, -0.11]}>
                  <boxGeometry args={[0.08, 0.05, 0.01]} />
                  <meshBasicMaterial color="#a9ecff" toneMapped={false} />
                </mesh>
                <mesh position={[0.04, -0.05, 0.38]}>
                  <boxGeometry args={[0.16, 0.12, 0.2]} />
                  <meshStandardMaterial color={toneA} roughness={0.36} metalness={0.34} />
                </mesh>
                <mesh position={[-0.04, -0.05, 0.38]}>
                  <boxGeometry args={[0.05, 0.05, 0.02]} />
                  <meshBasicMaterial color={GOLD} toneMapped={false} />
                </mesh>
              </>
            )}

            {/* front brand strip */}
            <mesh position={[-0.02, -0.2, 0]}>
              <boxGeometry args={[0.22, 0.02, 1.12]} />
              <meshBasicMaterial color={GOLD} toneMapped={false} />
            </mesh>
          </group>
        );
      })}

      {/* lounge + reception blocks (left) */}
      {[
        [-8.4, 0.45, 9, 3, 0.9, 1.6],
        [-8.4, 0.45, 12.5, 3, 0.9, 1.6],
        [-8, 0.6, 20, 4.2, 1.2, 1.2],
      ].map((b, i) => (
        <mesh key={`furn${i}`} position={[b[0]!, b[1]!, b[2]!]}>
          <boxGeometry args={[b[3]!, b[4]!, b[5]!]} />
          <meshStandardMaterial
            color={CARD}
            metalness={0.08}
            roughness={0.5}
            emissive={GOLD}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}

      {/* wall-mounted detailing station on the left bay wall */}
      <group position={[-10.72, 2.55, 12.5]}>
        {/* back mounting plate */}
        <mesh position={[0.04, 0, 0]}>
          <boxGeometry args={[0.07, 2.1, 3.2]} />
          <meshStandardMaterial color="#252228" roughness={0.5} metalness={0.12} />
        </mesh>
        {/* gold top border strip */}
        <mesh position={[0.06, 1.08, 0]}>
          <boxGeometry args={[0.06, 0.07, 3.24]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>
        {/* gold bottom border strip */}
        <mesh position={[0.06, -1.08, 0]}>
          <boxGeometry args={[0.06, 0.07, 3.24]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* pressure washer unit (top-left) */}
        <group position={[0.12, 0.55, -0.95]}>
          <mesh>
            <boxGeometry args={[0.28, 0.82, 0.52]} />
            <meshStandardMaterial color="#1a1a1e" roughness={0.38} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.44, 0]}>
            <boxGeometry args={[0.18, 0.1, 0.18]} />
            <meshStandardMaterial color={CARD} roughness={0.45} metalness={0.08} />
          </mesh>
          {/* hose reel */}
          <mesh position={[0, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.14, 0.04, 10, 28]} />
            <meshStandardMaterial color="#2e2e30" roughness={0.6} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.1, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.06, 14]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.85} />
          </mesh>
          {/* power LED */}
          <mesh position={[0.1, 0.38, 0.27]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#00e5ff" toneMapped={false} />
          </mesh>
          {/* gold accent line */}
          <mesh position={[0, -0.38, 0.27]}>
            <boxGeometry args={[0.22, 0.025, 0.03]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>

        {/* orbital polisher unit (top-right) */}
        <group position={[0.12, 0.55, 0.72]}>
          <mesh>
            <cylinderGeometry args={[0.26, 0.28, 0.62, 28]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.35} metalness={0.55} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.38, 14]} />
            <meshStandardMaterial color="#2a2a2c" roughness={0.4} metalness={0.45} />
          </mesh>
          <mesh position={[0, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.045, 0.045, 0.38, 12]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.38} metalness={0.5} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.27, 0.015, 10, 36]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.3}
              roughness={0.18}
              metalness={0.88}
            />
          </mesh>
          <mesh position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.065, 28]} />
            <meshStandardMaterial color="#e8c37a" roughness={0.75} metalness={0.08} />
          </mesh>
          {/* status LED */}
          <mesh position={[0.15, 0.14, 0.2]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#00ff88" toneMapped={false} />
          </mesh>
        </group>

        {/* tool hook bar (bottom row) */}
        <mesh position={[0.12, -0.62, 0]}>
          <boxGeometry args={[0.08, 0.06, 2.8]} />
          <meshStandardMaterial color="#3a3640" roughness={0.45} metalness={0.15} />
        </mesh>
        {/* hanging tools — microfiber brush heads */}
        {([-1.0, -0.5, 0.0, 0.5, 1.0] as number[]).map((tz, hi) => (
          <group key={hi} position={[0.15, -0.68, tz]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.28, 10]} />
              <meshStandardMaterial color="#555" roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial
                color={hi % 2 === 0 ? "#e8c37a" : "#f0f0f0"}
                roughness={0.8}
                metalness={0.05}
              />
            </mesh>
          </group>
        ))}

        <pointLight position={[0.3, 0, 0]} intensity={6} color={GOLD} distance={5} decay={2} />
      </group>

      {/* orbital polisher / detailing machine on the bay work block */}
      <group position={[-8.2, 0.92, 12.5]}>
        {/* main body — flat disc housing */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.18, 32]} />
          <meshStandardMaterial color="#1c1c1e" roughness={0.35} metalness={0.55} />
        </mesh>
        {/* grip barrel */}
        <mesh position={[0, 0.34, 0]} rotation={[0.18, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.42, 18]} />
          <meshStandardMaterial color="#2a2a2c" roughness={0.4} metalness={0.45} />
        </mesh>
        {/* top T-handle */}
        <mesh position={[0, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.42, 14]} />
          <meshStandardMaterial color="#1c1c1e" roughness={0.38} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.56, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.055, 0.055, 0.42, 14]} />
          <meshStandardMaterial color="#1c1c1e" roughness={0.38} metalness={0.5} />
        </mesh>
        {/* gold accent ring */}
        <mesh position={[0, 0.12, 0]}>
          <torusGeometry args={[0.29, 0.018, 12, 40]} />
          <meshStandardMaterial
            color={GOLD}
            roughness={0.18}
            metalness={0.88}
            emissive={GOLD}
            emissiveIntensity={0.35}
          />
        </mesh>
        {/* polishing pad */}
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 0.07, 32]} />
          <meshStandardMaterial color="#e8c37a" roughness={0.75} metalness={0.08} />
        </mesh>
        {/* speed dial on body */}
        <mesh position={[0.18, 0.18, 0.14]}>
          <cylinderGeometry args={[0.045, 0.045, 0.03, 16]} />
          <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.85} />
        </mesh>
        {/* status LED dot */}
        <mesh position={[-0.16, 0.2, 0.14]}>
          <sphereGeometry args={[0.022, 10, 10]} />
          <meshBasicMaterial color="#00ff88" toneMapped={false} />
        </mesh>
        {/* power cable looping off the side */}
        <mesh position={[0.3, 0.14, -0.1]} rotation={[0.4, 0, 0.6]}>
          <cylinderGeometry args={[0.018, 0.018, 0.55, 10]} />
          <meshStandardMaterial color="#111111" roughness={0.85} metalness={0.05} />
        </mesh>
        <pointLight position={[0, 0.4, 0]} intensity={3.5} color={GOLD} distance={3} decay={2} />
      </group>

      {/* detailing bay plinths ahead */}
      {[7, 12, 17].map((z, i) => (
        <mesh key={`plinth${i}`} position={[i % 2 === 0 ? 4.5 : -4.5, 0.12, z]}>
          <cylinderGeometry args={[1.5, 1.7, 0.24, 24]} />
          <meshStandardMaterial
            color="#5a5560"
            metalness={0.2}
            roughness={0.35}
            emissive={GOLD}
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}

      {/* reception desk in front of the MOTURBO wall */}
      <group position={[0, 0.55, 24.1]}>
        {/* rack-inspired structural shell */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[6.56, 0.98, 1.28]} />
          <meshStandardMaterial color="#14141c" metalness={0.22} roughness={0.46} />
        </mesh>
        <mesh position={[-3.22, 0.4, 0]}>
          <boxGeometry args={[0.24, 1.02, 1.28]} />
          <meshStandardMaterial color="#121219" metalness={0.32} roughness={0.4} />
        </mesh>
        <mesh position={[3.22, 0.4, 0]}>
          <boxGeometry args={[0.24, 1.02, 1.28]} />
          <meshStandardMaterial color="#121219" metalness={0.32} roughness={0.4} />
        </mesh>

        {/* recessed modular front channel */}
        <mesh position={[0, 0.39, 0.61]}>
          <boxGeometry args={[6.02, 0.66, 0.075]} />
          <meshStandardMaterial color="#0d0d14" metalness={0.14} roughness={0.82} />
        </mesh>
        {[-2.02, 0, 2.02].map((x, i) => (
          <mesh key={i} position={[x, 0.39, 0.63]}>
            <boxGeometry args={[1.76, 0.56, 0.018]} />
            <meshStandardMaterial
              color="#221f2a"
              roughness={0.62}
              metalness={0.24}
              emissive="#2d1848"
              emissiveIntensity={0.03}
            />
          </mesh>
        ))}

        {/* top cap */}
        <mesh position={[0, 0.86, 0]}>
          <boxGeometry args={[6.78, 0.08, 1.44]} />
          <meshStandardMaterial color="#cecad4" metalness={0.24} roughness={0.3} />
        </mesh>

        {/* gold trims echoing wall rack language */}
        <mesh position={[0, 0.82, 0.69]}>
          <boxGeometry args={[6.78, 0.018, 0.028]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.95}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.02, 0.69]}>
          <boxGeometry args={[6.5, 0.018, 0.025]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.7}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-3.3, 0.41, 0]}>
          <boxGeometry args={[0.022, 0.82, 1.34]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.7}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[3.3, 0.41, 0]}>
          <boxGeometry args={[0.022, 0.82, 1.34]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.7}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>

        <pointLight
          position={[0, 0.42, 0.72]}
          intensity={4.2}
          color={GOLD}
          distance={5.6}
          decay={2}
        />
        <pointLight
          position={[0, 0.2, 0.62]}
          intensity={2.2}
          color="#6d3ea8"
          distance={4.6}
          decay={2}
        />
      </group>

      {/* modern recessed performance board on the MOTURBO wall */}
      <group position={[-7.7, 2.0, 25.1]}>
        <mesh>
          <boxGeometry args={[0.05, 1.9, 2.42]} />
          <meshStandardMaterial color="#13131a" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0.028, 0, 0]}>
          <boxGeometry args={[0.01, 1.72, 2.24]} />
          <meshStandardMaterial color="#0d0d14" roughness={0.82} metalness={0.08} />
        </mesh>

        {/* flat gold trims */}
        <mesh position={[0.034, 0.78, 0]}>
          <boxGeometry args={[0.01, 0.014, 2.06]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0.034, -0.78, 0]}>
          <boxGeometry args={[0.01, 0.014, 2.06]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>

        {/* minimal flat icon */}
        <mesh position={[0.034, 0.05, 0]}>
          <boxGeometry args={[0.004, 0.2, 1.05]} />
          <meshBasicMaterial color="#f0ead9" toneMapped={false} />
        </mesh>
        <mesh position={[0.034, -0.12, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.004, 16]} />
          <meshBasicMaterial color="#111111" toneMapped={false} />
        </mesh>
        <mesh position={[0.034, -0.12, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.004, 16]} />
          <meshBasicMaterial color="#111111" toneMapped={false} />
        </mesh>

        <pointLight
          position={[0.06, 0.06, 0]}
          intensity={2.5}
          color={GOLD}
          distance={3.2}
          decay={2}
        />
      </group>

      {/* detailing equipment cart — right of reception desk */}
      <group position={[8.2, 0, 22.5]}>
        {/* trolley base */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.9, 0.44, 0.55]} />
          <meshStandardMaterial
            color={CARD}
            roughness={0.45}
            metalness={0.12}
            emissive={GOLD}
            emissiveIntensity={0.04}
          />
        </mesh>
        {/* gold accent strip on front */}
        <mesh position={[0, 0.1, 0.28]}>
          <boxGeometry args={[0.88, 0.06, 0.03]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.1}
            toneMapped={false}
          />
        </mesh>
        {/* drawer handle */}
        <mesh position={[0, 0.25, 0.285]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.32, 10]} />
          <meshStandardMaterial color="#d6c27a" roughness={0.22} metalness={0.82} />
        </mesh>
        {/* top shelf */}
        <mesh position={[0, 0.46, 0]}>
          <boxGeometry args={[0.94, 0.05, 0.58]} />
          <meshStandardMaterial color="#d2ccd8" roughness={0.32} metalness={0.22} />
        </mesh>
        {/* orbital polisher on top */}
        <group position={[-0.18, 0.65, 0]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.18, 0.12, 28]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.35} metalness={0.55} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.17, 0.012, 10, 32]} />
            <meshStandardMaterial
              color={GOLD}
              emissive={GOLD}
              emissiveIntensity={0.4}
              roughness={0.18}
              metalness={0.85}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.046, 0.046, 0.28, 12]} />
            <meshStandardMaterial color="#2a2a2c" roughness={0.4} metalness={0.45} />
          </mesh>
          <mesh position={[0, 0.26, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.032, 0.032, 0.28, 10]} />
            <meshStandardMaterial color="#1c1c1e" roughness={0.4} metalness={0.45} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.04, 28]} />
            <meshStandardMaterial color="#e8c37a" roughness={0.78} metalness={0.06} />
          </mesh>
          <mesh position={[0.1, 0.04, 0.12]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#00ff88" toneMapped={false} />
          </mesh>
        </group>
        {/* spray bottle on top */}
        <group position={[0.22, 0.62, 0.05]}>
          <mesh>
            <cylinderGeometry args={[0.055, 0.065, 0.28, 14]} />
            <meshStandardMaterial color="#1e1e22" roughness={0.42} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 10]} />
            <meshStandardMaterial color={GOLD} roughness={0.2} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.08, 0.06, 0.01]} />
            <meshBasicMaterial color={GOLD} toneMapped={false} />
          </mesh>
        </group>
        {/* small wheels */}
        {([-0.35, 0.35] as number[]).flatMap((x) =>
          ([-0.2, 0.2] as number[]).map((z, wi) => (
            <mesh key={`w${x}${z}`} position={[x, 0.06, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 14]} />
              <meshStandardMaterial color="#222" roughness={0.7} metalness={0.2} />
            </mesh>
          )),
        )}
        <pointLight position={[0, 1.1, 0]} intensity={5} color={GOLD} distance={4} decay={2} />
      </group>

      {/* rack-style MOTURBO wall display */}
      <group position={[0, 3.2, 26]}>
        {/* outer architectural slab */}
        <mesh>
          <boxGeometry args={[22.2, 7.1, 0.22]} />
          <meshStandardMaterial color="#2f2b35" metalness={0.12} roughness={0.52} />
        </mesh>

        {/* recessed center panel */}
        <mesh position={[0, 0, -0.09]}>
          <boxGeometry args={[20.9, 6.0, 0.06]} />
          <meshStandardMaterial color="#1b1922" metalness={0.16} roughness={0.74} />
        </mesh>

        {/* gold trims matching rack language */}
        <mesh position={[0, 2.78, 0.02]}>
          <boxGeometry args={[20.2, 0.06, 0.04]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.95}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, -2.78, 0.02]}>
          <boxGeometry args={[20.2, 0.06, 0.04]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.95}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[-10.12, 0, 0.02]}>
          <boxGeometry args={[0.06, 5.64, 0.04]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[10.12, 0, 0.02]}>
          <boxGeometry args={[0.06, 5.64, 0.04]} />
          <meshStandardMaterial
            color={GOLD}
            emissive={GOLD}
            emissiveIntensity={0.9}
            roughness={0.2}
            metalness={0.9}
            toneMapped={false}
          />
        </mesh>

        <Text
          position={[0, 0.02, -0.145]}
          rotation={[0, Math.PI, 0]}
          fontSize={1.48}
          letterSpacing={0.25}
          color={GOLD}
          anchorX="center"
          anchorY="middle"
          outlineWidth={highQuality ? 0.015 : 0}
          outlineColor={highQuality ? "#0f0d14" : GOLD}
        >
          MOTURBO
        </Text>
      </group>
    </group>
  );
}

/* ---------- Cinematic scroll camera ---------- */
const KEYS: { pos: [number, number, number]; look: [number, number, number] }[] = [
  { pos: [0, 2.6, 13], look: [0, 1, 0] }, // wide shot
  { pos: [0.5, 1.7, 8.5], look: [0, 0.9, 0] }, // move in
  { pos: [5.2, 1.4, 5.2], look: [0, 0.85, 0] }, // orbit
  { pos: [5.4, 0.75, 1.2], look: [1.6, 0.7, 0] }, // headlights
  { pos: [3.2, 0.5, -2.6], look: [0.4, 0.5, 0] }, // wheels
  { pos: [-1.2, 1.35, -3.4], look: [-0.2, 1.1, 0] }, // interior
  { pos: [-3.5, 2.2, 4], look: [0, 1.2, 8] }, // deeper
  { pos: [-1.5, 2.1, 8.5], look: [4.5, 1, 12] }, // services bays
  { pos: [2.5, 1.9, 12], look: [9.6, 1.8, 12] }, // accessory wall
  { pos: [0, 2.2, 16], look: [-4.5, 1, 18] }, // booking
  { pos: [0, 2.6, 19], look: [0, 1.6, 24] }, // gallery
  { pos: [0, 2.4, 22], look: [-8, 1.2, 21] }, // reception
  { pos: [0, 2.9, 23.5], look: [0, 3, 26] }, // footer / logo
];

function CameraRig({ progress, pointer }: P) {
  const target = useRef(new THREE.Vector3(0, 1, 0));
  useFrame(({ camera }, dt) => {
    // Stop camera math when scene is faded — eliminates lerp + matrix work every frame.
    if (progress.current >= 0.93) return;
    const p = THREE.MathUtils.clamp(progress.current, 0, 0.9999);
    const f = p * (KEYS.length - 1);
    const i = Math.floor(f);
    const t = f - i;
    const a = KEYS[i]!;
    const b = KEYS[Math.min(i + 1, KEYS.length - 1)]!;
    const ease = t * t * (3 - 2 * t);

    const px = THREE.MathUtils.lerp(a.pos[0], b.pos[0], ease) + pointer.current.x * 0.5;
    const py = THREE.MathUtils.lerp(a.pos[1], b.pos[1], ease) - pointer.current.y * 0.25;
    const pz = THREE.MathUtils.lerp(a.pos[2], b.pos[2], ease);
    camera.position.lerp(new THREE.Vector3(px, py, pz), 1 - Math.pow(0.001, dt));

    target.current.lerp(
      new THREE.Vector3(
        THREE.MathUtils.lerp(a.look[0], b.look[0], ease),
        THREE.MathUtils.lerp(a.look[1], b.look[1], ease),
        THREE.MathUtils.lerp(a.look[2], b.look[2], ease),
      ),
      1 - Math.pow(0.002, dt),
    );
    camera.lookAt(target.current);
  });
  return null;
}

function Lights({ highQuality, progress }: { highQuality: boolean; progress: React.MutableRefObject<number> }) {
  const spot = useRef<THREE.SpotLight>(null);
  const accumulated = useRef(0);
  useFrame(({ clock }, dt) => {
    // Skip intensity animation when the scene is faded — zero GPU/CPU cost.
    if (progress.current >= 0.93) return;
    accumulated.current += dt;
    const tick = highQuality ? 1 / 60 : 1 / 24;
    if (accumulated.current < tick) {
      return;
    }
    const step = accumulated.current;
    accumulated.current = 0;
    if (spot.current) {
      spot.current.intensity = 130 + Math.sin((clock.elapsedTime + step) * 1.5) * 12;
    }
  });
  return (
    <>
      <ambientLight intensity={highQuality ? 0.55 : 0.45} color="#fff7e6" />
      <hemisphereLight intensity={highQuality ? 0.38 : 0.28} color="#fff8ea" groundColor="#d6c7a2" />
      <spotLight
        ref={spot}
        position={[0, 8, 2]}
        angle={0.55}
        penumbra={highQuality ? 1 : 0.6}
        intensity={highQuality ? 130 : 90}
        color="#ffffff"
        castShadow={highQuality}
      />
      {highQuality && (
        <>
          <spotLight position={[-7, 6, 6]} angle={0.7} penumbra={1} intensity={68} color="#fff6e8" />
          <spotLight position={[7, 6, 10]} angle={0.7} penumbra={1} intensity={62} color={GOLD} />
          <pointLight position={[0, 1.2, 16]} intensity={34} color="#fff6e8" distance={20} />
          <pointLight position={[0, 3, 25]} intensity={72} color={GOLD} distance={22} />
          <pointLight position={[-8.5, 5.7, 6]} intensity={18} color={GOLD} distance={18} />
          <pointLight position={[8.5, 5.7, 10]} intensity={18} color={GOLD} distance={18} />
        </>
      )}
    </>
  );
}

/**
 * One-shot FPS probe inside the Canvas. Runs for ~1.5 s after the scene loads,
 * then — if average FPS < 48 — gently reduces the WebGL pixel ratio so R3F
 * re-sizes the drawing buffer while CSS canvas dimensions stay intact.
 * Only fires once per mount; refs prevent re-triggering on re-renders.
 */
function PerformanceProbe({ initialDpr, onReduce }: {
  initialDpr: number;
  onReduce: (dpr: number) => void;
}) {
  const count = useRef(0);
  const ms    = useRef<number[]>([]);
  const last  = useRef(performance.now());
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    const now = performance.now();
    const dt  = now - last.current;
    last.current = now;
    if (dt >= 5 && dt <= 500) ms.current.push(dt);
    count.current++;
    if (count.current < 45 || ms.current.length < 16) return;
    fired.current = true;
    const avg = ms.current.reduce((s, v) => s + v, 0) / ms.current.length;
    const fps = 1000 / avg;
    if (fps < 40) {
      // Prefer gentle pixel-count reductions over drastic drops.
      const factor = Math.max(0.55, Math.sqrt(fps / 40));
      const newDpr = Math.max(0.6, Math.round(initialDpr * factor * 20) / 20);
      if (newDpr < initialDpr - 0.09) onReduce(newDpr);
    }
  });
  return null;
}

export default function ShowroomScene({ progress, pointer, onReady, paused = false }: P) {
  const profile = useMemo<QualityProfile>(() => {
    if (typeof window === "undefined") {
      return { tier: "high", highQuality: true, dpr: [1, 1.25], antialias: true, precision: "highp",
        fov: 42, floatAnimations: true, envResolution: 256, reflectorEnabled: true, reflectorResolution: 512 };
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = !isMobile && window.matchMedia("(max-width: 1199px)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile) {
      // physicalWidth = devicePixelRatio × CSS screen.width.
      // A high-DPR, high-resolution screen requires a capable GPU to drive it —
      // far more reliable than hardwareConcurrency (which misclassifies iPhones).
      // iOS Safari never exposes navigator.deviceMemory → defaults to 8 here.
      const nativeDpr     = window.devicePixelRatio ?? 1;
      const physicalWidth = (window.screen?.width ?? 390) * nativeDpr;
      const isIOS         = /iPhone|iPod/.test(navigator.userAgent);

      // ── MINIMAL ─────────────────────────────────────────────────────────
      // Forced minimum: user preference or genuinely constrained hardware.
      if (prefersReducedMotion || memory <= 1) {
        return { tier: "low", highQuality: false, dpr: 0.9, antialias: false, precision: "highp",
          fov: 52, floatAnimations: false, envResolution: 64, reflectorEnabled: false, reflectorResolution: 0 };
      }

      // ── FLAGSHIP ─────────────────────────────────────────────────────────
      // iPhone 13/14/15/16 · Galaxy S22+ · Pixel 7+
      // dpr:1.5 → buf=585px · phys=1170px · upscale=2.00× → clear
      // (old blurry was 4.29× — this is 2.15× sharper with no lag)
      // Reflector disabled: it renders the full scene a second time per frame
      // which is the dominant GPU cost. DPR alone is well within A15 budget.
      if ((isIOS && memory >= 4) || (nativeDpr >= 2.5 && physicalWidth >= 1000 && memory >= 4)) {
        return { tier: "medium", highQuality: false, dpr: 1.5, antialias: false, precision: "highp",
          fov: 48, floatAnimations: false, envResolution: 256, reflectorEnabled: false, reflectorResolution: 0 };
      }

      // ── HIGH MOBILE ───────────────────────────────────────────────────────
      // iPhone SE 2020 / iPhone 11–12 · strong mid-high Android
      // dpr:1.5 on DPR-2 phone → buf=562px · phys=750px · upscale=1.33× → SHARP
      if ((isIOS && memory >= 3) || (nativeDpr >= 2 && physicalWidth >= 800 && memory >= 3)) {
        return { tier: "medium", highQuality: false, dpr: 1.5, antialias: false, precision: "highp",
          fov: 49, floatAnimations: false, envResolution: 192, reflectorEnabled: false, reflectorResolution: 0 };
      }

      // ── MEDIUM MOBILE ─────────────────────────────────────────────────────
      // Solid mid-range: DPR 2, physicalWidth ≥ 680, memory ≥ 2
      // dpr:1.4 → buf=504px on 360px CSS · upscale=1.43× → SHARP
      if (isIOS || (nativeDpr >= 2 && physicalWidth >= 680 && memory >= 2)) {
        return { tier: "low", highQuality: false, dpr: 1.4, antialias: false, precision: "highp",
          fov: 50, floatAnimations: false, envResolution: 128, reflectorEnabled: false, reflectorResolution: 0 };
      }

      // ── LOW MOBILE ────────────────────────────────────────────────────────
      // Budget phones: DPR 1.5–2, reasonable screen width
      // dpr:1.1 → buf=396px on 360px CSS at DPR 1.5 · upscale=1.36× → SHARP
      if (nativeDpr >= 1.5 && physicalWidth >= 500) {
        return { tier: "low", highQuality: false, dpr: 1.1, antialias: false, precision: "highp",
          fov: 51, floatAnimations: false, envResolution: 96, reflectorEnabled: false, reflectorResolution: 0 };
      }

      // ── VERY LOW / OLD ────────────────────────────────────────────────────
      return { tier: "low", highQuality: false, dpr: 0.9, antialias: false, precision: "highp",
        fov: 52, floatAnimations: false, envResolution: 64, reflectorEnabled: false, reflectorResolution: 0 };
    }

    // MEDIUM — tablet, laptop, or low-core desktop
    if (isTablet || cores <= 6 || memory <= 4 || prefersReducedMotion) {
      return { tier: "medium", highQuality: false, dpr: 1.0, antialias: true, precision: "highp",
        fov: 46, floatAnimations: true, envResolution: 256, reflectorEnabled: true, reflectorResolution: 256 };
    }
    // HIGH — desktop with a capable GPU
    return { tier: "high", highQuality: true, dpr: [1, 1.25], antialias: true, precision: "highp",
      fov: 42, floatAnimations: true, envResolution: 256, reflectorEnabled: true, reflectorResolution: 512 };
  }, []);

  // If actual FPS < 48 after the scene loads, PerformanceProbe calls
  // setAdaptedDpr() once — R3F reacts to the new `dpr` prop automatically.
  const [adaptedDpr, setAdaptedDpr] = useState<number | null>(null);
  const effectiveDpr = adaptedDpr ?? profile.dpr;

  useEffect(() => {
    if (!onReady) {
      return;
    }
    const raf = window.requestAnimationFrame(() => onReady());
    return () => window.cancelAnimationFrame(raf);
  }, [onReady]);

  return (
    <Canvas
      shadows={profile.highQuality}
      dpr={effectiveDpr}
      gl={{
        antialias: profile.antialias,
        powerPreference: profile.highQuality ? "high-performance" : "default",
        precision: profile.precision,
        alpha: false,
      }}
      performance={{ min: 0.4, max: 1, debounce: 300 }}
      // frameloop: pause the RAF loop when the canvas is fully faded (saves GPU cycles).
      frameloop={paused ? "demand" : "always"}
      // far:55 matches real scene depth (~35 units) — tighter clip improves depth-buffer precision.
      camera={{ position: [0, 2.6, 13], fov: profile.fov, near: 0.1, far: 55 }}
    >
      <color attach="background" args={["#4a454f"]} />
      <fogExp2 attach="fog" args={["#4a454f", 0.012]} />
      <Lights highQuality={profile.highQuality} progress={progress} />
      <Environment files="/dikhololo_night_1k.hdr" resolution={profile.envResolution} />
      {!profile.floatAnimations ? (
        <Car highQuality={profile.highQuality} progress={progress} />
      ) : (
        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.18}>
          <Car highQuality={profile.highQuality} progress={progress} />
        </Float>
      )}
      <Showroom
        highQuality={profile.highQuality}
        tier={profile.tier}
        floatAnimations={profile.floatAnimations}
        reflectorEnabled={profile.reflectorEnabled}
        reflectorResolution={profile.reflectorResolution}
      />
      <CameraRig progress={progress} pointer={pointer} />
      <PerformanceProbe
        initialDpr={typeof effectiveDpr === "number" ? effectiveDpr : 1.25}
        onReduce={setAdaptedDpr}
      />
    </Canvas>
  );
}

useGLTF.setDecoderPath("/draco/gltf/");
useGLTF.preload("/models/car2.glb");
useTexture.preload("/showroom-bg.jpg");
