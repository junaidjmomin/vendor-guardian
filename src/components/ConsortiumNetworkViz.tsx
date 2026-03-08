import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

interface NodeData {
  id: string;
  bank: string;
  position: [number, number, number];
  status: "online" | "syncing" | "offline";
  vendorsMonitored: number;
}

const nodeData: NodeData[] = [
  { id: "n1", bank: "Bank Alpha", position: [0, 1.5, 0], status: "online", vendorsMonitored: 342 },
  { id: "n2", bank: "Bank Beta", position: [2.2, 0.5, -0.5], status: "online", vendorsMonitored: 287 },
  { id: "n3", bank: "Bank Gamma", position: [-2.2, 0.5, 0.5], status: "online", vendorsMonitored: 415 },
  { id: "n4", bank: "Bank Delta", position: [1.2, -1.5, 0.8], status: "syncing", vendorsMonitored: 198 },
  { id: "n5", bank: "Bank Epsilon", position: [-1.2, -1.5, -0.8], status: "offline", vendorsMonitored: 156 },
];

const connections: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 2], [1, 3],
  [2, 3], [2, 4],
  [3, 4],
];

function NetworkNode({ node }: { node: NodeData }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const color = useMemo(() => {
    if (node.status === "online") return new THREE.Color("#22c55e");
    if (node.status === "syncing") return new THREE.Color("#f59e0b");
    return new THREE.Color("#64748b");
  }, [node.status]);

  useFrame((state) => {
    if (meshRef.current && node.status !== "offline") {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + nodeData.indexOf(node)) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
    if (glowRef.current) {
      const opacity = node.status === "online"
        ? 0.15 + Math.sin(state.clock.elapsedTime * 3) * 0.08
        : node.status === "syncing" ? 0.1 : 0.03;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <group position={node.position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={node.status === "online" ? 0.8 : 0.3}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function NetworkEdge({ from, to, index }: { from: [number, number, number]; to: [number, number, number]; index: number }) {
  const lineRef = useRef<any>(null);

  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      lineRef.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5 + index * 0.5) * 0.1;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[from, to]}
      color="#22d3ee"
      lineWidth={1}
      transparent
      opacity={0.2}
    />
  );
}

function DataPulse({ from, to, index }: { from: [number, number, number]; to: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = ((state.clock.elapsedTime * 0.3 + index * 0.4) % 1);
    meshRef.current.position.set(
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
      from[2] + (to[2] - from[2]) * t
    );
    (meshRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * 0.8;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
    </mesh>
  );
}

function CentralLedger() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function NetworkFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-xs text-muted-foreground font-mono">Loading 3D Network...</p>
    </div>
  );
}

interface ConsortiumNetworkVizProps {
  className?: string;
}

export function ConsortiumNetworkViz({ className }: ConsortiumNetworkVizProps) {
  return (
    <div className={`relative ${className}`} style={{ height: 400, width: "100%" }}>
      <Suspense fallback={<NetworkFallback />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#22d3ee" />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#a855f7" />
          <Stars radius={15} depth={40} count={200} factor={2} saturation={0} fade speed={0.5} />

          <CentralLedger />

          {nodeData.map((node) => (
            <NetworkNode key={node.id} node={node} />
          ))}

          {connections.map(([i, j], idx) => (
            <group key={`edge-${idx}`}>
              <NetworkEdge from={nodeData[i].position} to={nodeData[j].position} index={idx} />
              {idx < 5 && <DataPulse from={nodeData[i].position} to={nodeData[j].position} index={idx} />}
            </group>
          ))}
        </Canvas>
      </Suspense>
      <div className="absolute top-3 left-3 rounded border border-border bg-card/80 backdrop-blur-sm px-2 py-1">
        <p className="text-[9px] font-mono text-primary tracking-widest">HYPERLEDGER FABRIC</p>
        <p className="text-[8px] text-muted-foreground">Permissioned DLT Network</p>
      </div>
    </div>
  );
}
