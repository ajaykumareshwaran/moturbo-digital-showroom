import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshReflectorMaterial, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PURPLE = "#8b5cf6";
const GOLD = "#e8c37a";

/** Scroll progress 0..1 read from a ref set by the parent (no re-renders). */
type P = { progress: React.MutableRefObject<number>; pointer: React.MutableRefObject<{ x: number; y: number }> };

/* ---------- Stylised supercar built from primitives ---------- */
function Car() {
  const group = useRef<THREE.Group>(null);
  const body = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0d0a14",
        metalness: 1,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 1.6,
      }),
    [],
  );
  const glass = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#120c1e", metalness: 0.4, roughness: 0.05, transmission: 0.72, thickness: 0.6 }),
    [],
  );
  const rim = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9ccd4", metalness: 1, roughness: 0.22 }), []);
  const tyre = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0a0c", roughness: 0.9 }), []);

  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.035;
  });

  const wheels: [number, number][] = [
    [1.35, 0.95],
    [1.35, -0.95],
    [-1.4, 0.95],
    [-1.4, -0.95],
  ];

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* lower body */}
      <mesh castShadow position={[0, 0.52, 0]} material={body}>
        <boxGeometry args={[4.5, 0.5, 2]} />
      </mesh>
      {/* mid body */}
      <mesh castShadow position={[0, 0.85, 0]} material={body}>
        <boxGeometry args={[4.1, 0.38, 1.9]} />
      </mesh>
      {/* nose */}
      <mesh castShadow position={[2.3, 0.55, 0]} rotation={[0, 0, -0.12]} material={body}>
        <boxGeometry args={[0.9, 0.3, 1.85]} />
      </mesh>
      {/* cabin */}
      <mesh castShadow position={[-0.15, 1.2, 0]} material={glass}>
        <boxGeometry args={[2.1, 0.42, 1.62]} />
      </mesh>
      {/* roof */}
      <mesh castShadow position={[-0.3, 1.42, 0]} material={body}>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
      </mesh>
      {/* rear wing */}
      <mesh castShadow position={[-2.15, 1.15, 0]} material={body}>
        <boxGeometry args={[0.55, 0.06, 1.8]} />
      </mesh>
      <mesh position={[-2.05, 0.95, 0.72]} material={body}>
        <boxGeometry args={[0.1, 0.36, 0.08]} />
      </mesh>
      <mesh position={[-2.05, 0.95, -0.72]} material={body}>
        <boxGeometry args={[0.1, 0.36, 0.08]} />
      </mesh>
      {/* headlights */}
      {[0.62, -0.62].map((z) => (
        <mesh key={z} position={[2.62, 0.62, z]}>
          <boxGeometry args={[0.08, 0.12, 0.5]} />
          <meshStandardMaterial color="#ffffff" emissive="#dbe6ff" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      ))}
      {/* tail light bar */}
      <mesh position={[-2.42, 0.78, 0]}>
        <boxGeometry args={[0.06, 0.1, 1.6]} />
        <meshStandardMaterial color="#ff2d55" emissive="#ff2d55" emissiveIntensity={3.5} toneMapped={false} />
      </mesh>
      {/* underglow */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 2.2]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      {/* wheels */}
      {wheels.map(([x, z], i) => (
        <group key={i} position={[x, 0.48, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow material={tyre}>
            <cylinderGeometry args={[0.48, 0.48, 0.34, 32]} />
          </mesh>
          <mesh position={[0, z > 0 ? 0.06 : -0.06, 0]} material={rim}>
            <cylinderGeometry args={[0.3, 0.3, 0.26, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------- Showroom architecture ---------- */
function Showroom() {
  const strips = useMemo(() => [-9, -4.5, 0, 4.5, 9, 13.5, 18], []);
  return (
    <group>
      {/* reflective black floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[120, 120]} />
        <MeshReflectorMaterial
          blur={[400, 120]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.75}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#08070c"
          metalness={0.85}
          mirror={0}
        />
      </mesh>

      {/* gold LED ceiling strips */}
      {strips.map((z) => (
        <mesh key={`led${z}`} position={[0, 6.4, z]}>
          <boxGeometry args={[26, 0.05, 0.12]} />
          <meshBasicMaterial color={GOLD} toneMapped={false} />
        </mesh>
      ))}

      {/* glass walls */}
      {[-11, 11].map((x) => (
        <mesh key={`wall${x}`} position={[x, 3.4, 6]}>
          <boxGeometry args={[0.08, 6.8, 60]} />
          <meshPhysicalMaterial color="#150f22" transmission={0.6} thickness={0.4} roughness={0.12} metalness={0.2} />
        </mesh>
      ))}

      {/* structural columns */}
      {strips.map((z) =>
        [-10.4, 10.4].map((x) => (
          <mesh key={`col${z}${x}`} position={[x, 3.4, z]}>
            <boxGeometry args={[0.35, 6.8, 0.35]} />
            <meshStandardMaterial color="#151122" metalness={0.9} roughness={0.35} />
          </mesh>
        )),
      )}

      {/* accessory display wall (right) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`disp${i}`} position={[9.6, 1.4 + (i % 3) * 1.3, 8 + Math.floor(i / 3) * 2.2]}>
          <boxGeometry args={[0.5, 0.7, 1.4]} />
          <meshStandardMaterial color="#221a35" metalness={0.7} roughness={0.3} emissive={PURPLE} emissiveIntensity={0.25} />
        </mesh>
      ))}

      {/* lounge + reception blocks (left) */}
      {[
        [-8.4, 0.45, 9, 3, 0.9, 1.6],
        [-8.4, 0.45, 12.5, 3, 0.9, 1.6],
        [-8, 0.6, 20, 4.2, 1.2, 1.2],
      ].map((b, i) => (
        <mesh key={`furn${i}`} position={[b[0]!, b[1]!, b[2]!]}>
          <boxGeometry args={[b[3]!, b[4]!, b[5]!]} />
          <meshStandardMaterial color="#1a1428" metalness={0.5} roughness={0.5} emissive={GOLD} emissiveIntensity={0.06} />
        </mesh>
      ))}

      {/* detailing bay plinths ahead */}
      {[7, 12, 17].map((z, i) => (
        <mesh key={`plinth${i}`} position={[i % 2 === 0 ? 4.5 : -4.5, 0.12, z]}>
          <cylinderGeometry args={[1.5, 1.7, 0.24, 48]} />
          <meshStandardMaterial color="#120f1c" metalness={0.9} roughness={0.25} emissive={PURPLE} emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* illuminated MOTURBO logo at reception */}
      <Text
        position={[0, 3.2, 25.6]}
        fontSize={1.5}
        letterSpacing={0.28}
        color={GOLD}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0}
      >
        MOTURBO
      </Text>
      <mesh position={[0, 3.2, 26]}>
        <planeGeometry args={[22, 7]} />
        <meshStandardMaterial color="#0d0a16" metalness={0.6} roughness={0.4} emissive={PURPLE} emissiveIntensity={0.22} />
      </mesh>
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

function Lights() {
  const spot = useRef<THREE.SpotLight>(null);
  useFrame(({ clock }) => {
    if (spot.current) spot.current.intensity = 130 + Math.sin(clock.elapsedTime * 1.5) * 12;
  });
  return (
    <>
      <ambientLight intensity={0.22} color={PURPLE} />
      <hemisphereLight intensity={0.25} color={PURPLE} groundColor="#000000" />
      <spotLight ref={spot} position={[0, 8, 2]} angle={0.55} penumbra={1} intensity={130} color="#ffffff" castShadow />
      <spotLight position={[-7, 6, 6]} angle={0.7} penumbra={1} intensity={70} color={PURPLE} />
      <spotLight position={[7, 6, 10]} angle={0.7} penumbra={1} intensity={60} color={GOLD} />
      <pointLight position={[0, 1.2, 16]} intensity={40} color={PURPLE} distance={20} />
      <pointLight position={[0, 3, 25]} intensity={60} color={GOLD} distance={22} />
    </>
  );
}

export default function ShowroomScene({ progress, pointer }: P) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.6, 13], fov: 42, near: 0.1, far: 200 }}
    >
      <color attach="background" args={["#06050a"]} />
      <fogExp2 attach="fog" args={["#0a0713", 0.035]} />
      <Lights />
      <Environment preset="night" />
      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.18}>
        <Car />
      </Float>
      <Showroom />
      <CameraRig progress={progress} pointer={pointer} />
    </Canvas>
  );
}