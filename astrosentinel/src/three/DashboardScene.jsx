import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { getTexture } from './ProceduralTextures';
import { NEO_TIER_COLORS, DASHBOARD_CAMERA } from './SceneConfig';

function Earth() {
  const meshRef = useRef();
  const textures = useMemo(() => {
    const map = getTexture('earth');
    const bumpMap = getTexture('earth');
    return { map, bumpMap };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(23.4)]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={textures.map}
          bumpMap={textures.bumpMap}
          bumpScale={0.02}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}

function NeoObject({ neo, index, onSelect }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const orbitDistance = 3 + index * 0.8;
  const orbitSpeed = 0.3 + index * 0.15;
  const radius = 0.08 + neo.diameter / 5000;
  const tierColor = NEO_TIER_COLORS[neo.tier] || '#3B82F6';

  const ringGeometry = useMemo(() => {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * orbitDistance,
          0,
          Math.sin(angle) * orbitDistance
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [orbitDistance]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * orbitSpeed;
      groupRef.current.position.x = Math.cos(t) * orbitDistance;
      groupRef.current.position.z = Math.sin(t) * orbitDistance;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <>
      <line geometry={ringGeometry}>
        <lineBasicMaterial
          color={tierColor}
          transparent
          opacity={0.15}
        />
      </line>

      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(neo);
          }}
          style={{ cursor: 'pointer' }}
        >
          <sphereGeometry args={[radius, 16, 16]} />
          <meshBasicMaterial color={tierColor} />
        </mesh>

        <Html
          position={[0, radius + 0.3, 0]}
          center
          distanceFactor={8}
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-[#111827] text-xs px-2 py-0.5 rounded border border-[#1F2937] text-white whitespace-nowrap">
            {neo.name}
          </div>
        </Html>
      </group>
    </>
  );
}

export default function DashboardScene({ neoObjects = [], onSelectNeo, className }) {
  const displayObjects = neoObjects.slice(0, 5);

  return (
    <div
      className={className}
      style={{
        height: 280,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #1F2937',
      }}
    >
      <Canvas
        camera={{
          ...DASHBOARD_CAMERA,
          position: [0, 2, 8],
          fov: 45,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={2} />
          <hemisphereLight intensity={0.8} />
          <pointLight position={[0, 0, 0]} intensity={3} />

          <Stars count={500} radius={50} />

          <Earth />

          {displayObjects.map((neo, index) => (
            <NeoObject
              key={neo.id}
              neo={neo}
              index={index}
              onSelect={onSelectNeo}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
