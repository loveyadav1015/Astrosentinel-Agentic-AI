import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TinyAsteroid() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.008;
      meshRef.current.rotation.y += 0.012;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color="#94a3b8"
        roughness={0.4}
        metalness={0.6}
      />
    </mesh>
  );
}

export default function NeoAsteroidIcon() {
  return (
    <div style={{ width: 36, height: 36, display: 'inline-block', verticalAlign: 'middle' }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 2]} intensity={1.5} />
        <TinyAsteroid />
      </Canvas>
    </div>
  );
}
