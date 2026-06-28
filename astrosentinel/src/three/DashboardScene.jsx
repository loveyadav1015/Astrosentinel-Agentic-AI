import React, { useRef, useMemo, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { getTexture } from './ProceduralTextures';
import { NEO_TIER_COLORS, DASHBOARD_CAMERA } from './SceneConfig';

// ── Earth (unchanged) ────────────────────────────────────────────────

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

// ── Critical threat line (dashed red line from NEO to Earth center) ──

function ThreatLine({ sphereRef }) {
  const lineRef = useRef();
  const materialRef = useRef();

  // Positions buffer: [neoX, neoY, neoZ, 0, 0, 0]
  const positions = useMemo(() => new Float32Array([0, 0, 0, 0, 0, 0]), []);

  useFrame((state) => {
    if (!sphereRef.current || !lineRef.current) return;

    const worldPos = new THREE.Vector3();
    sphereRef.current.getWorldPosition(worldPos);

    // Update line endpoints
    const posAttr = lineRef.current.geometry.getAttribute('position');
    posAttr.array[0] = worldPos.x;
    posAttr.array[1] = worldPos.y;
    posAttr.array[2] = worldPos.z;
    // [3,4,5] = Earth center (0,0,0)
    posAttr.needsUpdate = true;

    // Recompute line distances for dashes
    lineRef.current.computeLineDistances();

    // Pulse opacity
    if (materialRef.current) {
      materialRef.current.opacity =
        0.4 + 0.3 * Math.abs(Math.sin(state.clock.elapsedTime * 2));
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineDashedMaterial
        ref={materialRef}
        color={0xef4444}
        dashSize={0.3}
        gapSize={0.15}
        transparent
        opacity={0.7}
      />
    </line>
  );
}

// ── NEO Object (upgraded) ────────────────────────────────────────────

function NeoObject({ neo, index, totalCount, onSelect }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Data-driven orbit radius: use miss_distance_km if available, else fallback
  const orbitDistance = useMemo(() => {
    if (neo.miss_distance_km && neo.miss_distance_km > 0) {
      return THREE.MathUtils.mapLinear(
        Math.min(neo.miss_distance_km, 5_000_000),
        0, 5_000_000, 3.5, 16
      );
    }
    // Fallback for legacy data shape (distance in km as integer)
    if (neo.distance && neo.distance > 0) {
      return THREE.MathUtils.mapLinear(
        Math.min(neo.distance, 5_000_000),
        0, 5_000_000, 3.5, 16
      );
    }
    return 3.5 + index * 0.8;
  }, [neo.miss_distance_km, neo.distance, index]);

  const orbitSpeed = 0.08 + 0.04 / (orbitDistance / 3.5);

  // Data-driven size: use estimated_diameter_km if available
  const radius = useMemo(() => {
    if (neo.estimated_diameter_km && neo.estimated_diameter_km > 0) {
      return THREE.MathUtils.mapLinear(
        Math.min(neo.estimated_diameter_km, 2),
        0, 2, 0.06, 0.4
      );
    }
    // Fallback: sizeMax (in meters from old data)
    if (neo.sizeMax) return 0.08 + neo.sizeMax / 5000;
    // Fallback: diameter (in meters)
    if (neo.diameter) return 0.08 + neo.diameter / 5000;
    return 0.12;
  }, [neo.estimated_diameter_km, neo.sizeMax, neo.diameter]);

  // Determine tier from data
  const tier = neo.risk_tier || (neo.isHazardous ? 'Critical' : 'Watch');
  const tierColor = NEO_TIER_COLORS[tier] || '#3B82F6';
  const isCritical = tier === 'Critical';

  // Random initial angle so NEOs spread around Earth
  const initialAngle = useMemo(() => Math.random() * Math.PI * 2, []);

  // Orbit ring geometry
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
      const t = state.clock.elapsedTime * orbitSpeed + initialAngle;
      groupRef.current.position.x = Math.cos(t) * orbitDistance;
      groupRef.current.position.z = Math.sin(t) * orbitDistance;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
    if (meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback((e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    onSelect(neo);
  }, [neo, onSelect]);

  return (
    <>
      {/* Orbit ring */}
      <line geometry={ringGeometry}>
        <lineBasicMaterial
          color={tierColor}
          transparent
          opacity={hovered ? 0.45 : 0.25}
        />
      </line>

      {/* NEO sphere group */}
      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[radius, 16, 16]} />
          <meshStandardMaterial
            color={tierColor}
            emissive={tierColor}
            emissiveIntensity={hovered ? 0.8 : 0.3}
          />
        </mesh>

        {/* Label — show on hover only */}
        {hovered && (
          <Html
            position={[0, radius + 0.35, 0]}
            center
            distanceFactor={8}
            style={{ pointerEvents: 'none' }}
          >
            <div
              style={{
                color: 'white',
                fontSize: '11px',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.65)',
                padding: '3px 8px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                borderLeft: `2px solid ${tierColor}`,
              }}
            >
              {neo.name}
            </div>
          </Html>
        )}

        {/* Critical threat line */}
        {isCritical && <ThreatLine sphereRef={meshRef} />}
      </group>
    </>
  );
}

// ── Camera controller (lerp to clicked NEO) ──────────────────────────

function CameraController({ targetRef }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!targetRef.current) return;
    const { position, lookAt, frames } = targetRef.current;
    if (frames <= 0) return;

    camera.position.lerp(position, 0.06);
    targetRef.current.frames--;
  });

  return null;
}

// ── Main Scene ───────────────────────────────────────────────────────

export default function DashboardScene({ neoObjects = [], onSelectNeo, className }) {
  const displayObjects = neoObjects.slice(0, 8);
  const cameraTargetRef = useRef(null);

  const handleSelect = useCallback((neo) => {
    onSelectNeo(neo);
  }, [onSelectNeo]);

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
        raycaster={{ params: { Line: { threshold: 0.1 } } }}
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
              totalCount={displayObjects.length}
              onSelect={handleSelect}
            />
          ))}

          <CameraController targetRef={cameraTargetRef} />

          {/* OrbitControls: scroll to zoom, drag to rotate, right-drag to pan */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            enablePan
            minDistance={4}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
