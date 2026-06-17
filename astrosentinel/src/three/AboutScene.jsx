import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ABOUT_CAMERA } from './SceneConfig';

function AgentNode({ position, label, description, color, shape }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = hovered
        ? 1.15
        : 0.95 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {shape === 'cube' ? (
          <boxGeometry args={[1.1, 1.1, 1.1]} />
        ) : (
          <sphereGeometry args={[0.9, 32, 32]} />
        )}
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      <Html position={[0, shape === 'cube' ? 1.2 : 1.15, 0]} center distanceFactor={8} style={{ background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', color: 'white', fontSize: '12px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
        <div className="font-semibold text-center">
          {label}
        </div>
      </Html>

      {hovered && (
        <Html position={[0, shape === 'cube' ? -1.0 : -0.95, 0]} center>
          <div className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-2 text-xs text-[#9CA3AF] max-w-[200px] shadow-xl">
            {description}
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionBeam({ start, end, color }) {
  const particleRefs = [useRef(), useRef(), useRef()];

  const startVec = useMemo(() => new THREE.Vector3(...start), [start]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end]);

  const points = useMemo(() => [startVec, endVec], [startVec, endVec]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particleRefs.forEach((ref, i) => {
      if (ref.current) {
        const offset = i / 3;
        const progress = ((t * 0.4 + offset) % 1);
        ref.current.position.lerpVectors(startVec, endVec, progress);
      }
    });
  });

  return (
    <>
      <Line
        points={points}
        color={color || '#3B82F6'}
        lineWidth={2}
        transparent
        opacity={0.4}
      />

      {particleRefs.map((ref, i) => (
        <mesh ref={ref} key={i}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial
            color="#7dd3fc"
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </>
  );
}

const NODES = [
  {
    id: 'monitor',
    label: 'Monitor Agent',
    description: 'Continuously scans NASA APIs for new NEO data, tracking orbital updates and close approach events in real-time.',
    position: [-5, 1, 0],
    color: '#3B82F6',
    shape: 'sphere',
  },
  {
    id: 'datastore',
    label: 'Shared Data Store',
    description: 'Central knowledge base that stores, indexes, and synchronizes NEO data across all agents in the pipeline.',
    position: [0, 0, 0],
    color: '#8B5CF6',
    shape: 'cube',
  },
  {
    id: 'reasoning',
    label: 'Reasoning Engine',
    description: 'Analyzes NEO trajectories and risk factors, classifying threat levels using multi-factor hazard models.',
    position: [5, 1, 0],
    color: '#F59E0B',
    shape: 'sphere',
  },
  {
    id: 'reporter',
    label: 'Reporter Agent',
    description: 'Generates human-readable alerts and notifications, delivering prioritized reports to stakeholders.',
    position: [0, -4, 0],
    color: '#EF4444',
    shape: 'sphere',
  },
];

const CONNECTIONS = [
  { start: [-5, 1, 0], end: [0, 0, 0], color: '#3B82F6' },
  { start: [0, 0, 0], end: [5, 1, 0], color: '#8B5CF6' },
  { start: [5, 1, 0], end: [0, -4, 0], color: '#F59E0B' },
];

export default function AboutScene() {
  return (
    <div
      style={{
        height: 420,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid #1F2937',
      }}
    >
      <Canvas camera={ABOUT_CAMERA}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <pointLight position={[5, 5, 5]} intensity={1} />

          {NODES.map((node) => (
            <AgentNode
              key={node.id}
              position={node.position}
              label={node.label}
              description={node.description}
              color={node.color}
              shape={node.shape}
            />
          ))}

          {CONNECTIONS.map((conn, i) => (
            <ConnectionBeam
              key={i}
              start={conn.start}
              end={conn.end}
              color={conn.color}
            />
          ))}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
