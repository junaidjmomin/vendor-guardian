import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

interface RiskOrbInnerProps {
  score: number;
}

function RiskSphere({ score }: RiskOrbInnerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const color = useMemo(() => {
    if (score <= 24) return new THREE.Color("hsl(0, 72%, 51%)");
    if (score <= 49) return new THREE.Color("hsl(0, 72%, 51%)");
    if (score <= 74) return new THREE.Color("hsl(38, 92%, 50%)");
    return new THREE.Color("hsl(190, 90%, 50%)");
  }, [score]);

  const distort = useMemo(() => {
    if (score <= 24) return 0.6;
    if (score <= 49) return 0.45;
    if (score <= 74) return 0.3;
    return 0.15;
  }, [score]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={3}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function ParticleRing({ score }: RiskOrbInnerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.3;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);

  const particleColor = useMemo(() => {
    if (score <= 49) return "#ef4444";
    if (score <= 74) return "#f59e0b";
    return "#22d3ee";
  }, [score]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={particleColor} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

interface RiskOrbProps {
  score: number;
  className?: string;
}

export function RiskOrb({ score, className }: RiskOrbProps) {
  return (
    <div className={`relative ${className}`} style={{ height: 220 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#22d3ee" />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#a855f7" />
        <Stars radius={10} depth={30} count={300} factor={2} saturation={0} fade speed={1} />
        <RiskSphere score={score} />
        <ParticleRing score={score} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="font-mono text-3xl font-bold text-foreground drop-shadow-lg">{score}</span>
          <p className="text-[10px] text-muted-foreground font-mono tracking-widest mt-0.5">RISK SCORE</p>
        </div>
      </div>
    </div>
  );
}
