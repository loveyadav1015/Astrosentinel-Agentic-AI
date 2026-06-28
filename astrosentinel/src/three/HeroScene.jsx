import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { getTexture } from './ProceduralTextures';
import {
  PLANET_DATA,
  SUN_RADIUS,
  SUN_LIGHT_INTENSITY,
  ASTEROID_BELT,
  HERO_CAMERA,
  STAR_COUNT,
} from './SceneConfig';

// ── Helpers ──────────────────────────────────────────────────────────

const degToRad = THREE.MathUtils.degToRad;

function useOrbitPoints(radius, segments = 128) {
  return useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return pts;
  }, [radius, segments]);
}

// ── Sun ──────────────────────────────────────────────────────────────

function Sun() {
  const meshRef = useRef();
  const sunTexture = useMemo(() => getTexture('sun'), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03 * delta;
    }
  });

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>

      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[3.8, 64, 64]} />
        <meshBasicMaterial
          color="#FF8C00"
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Light source */}
      <pointLight
        position={[0, 0, 0]}
        color="#ffffff"
        intensity={SUN_LIGHT_INTENSITY}
        distance={200}
      />
    </group>
  );
}

// ── Planet ────────────────────────────────────────────────────────────

function Planet({ data }) {
  const orbitRef = useRef();
  const meshRef = useRef();
  const planetTexture = useMemo(() => getTexture(data.id), [data.id]);
  const ringTexture = useMemo(
    () => (data.hasRings ? getTexture('saturnRing') : null),
    [data.hasRings],
  );
  const orbitPoints = useOrbitPoints(data.orbitRadius);

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += data.speed * delta * 0.01 * 60;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      {/* Orbit path */}
      <Line
        points={orbitPoints}
        color="#3B82F6"
        lineWidth={0.3}
        transparent
        opacity={0.15}
      />

      {/* Orbital group – rotates around the sun */}
      <group ref={orbitRef}>
        {/* Planet positioned at orbit radius */}
        <group position={[data.orbitRadius, 0, 0]}>
          {/* Axial tilt wrapper */}
          <group rotation={[0, 0, degToRad(data.tilt)]}>
            <mesh ref={meshRef}>
              <sphereGeometry args={[data.radius, 48, 48]} />
              <meshStandardMaterial map={planetTexture} roughness={0.7} />
            </mesh>

            {/* Rings (Saturn) */}
            {data.hasRings && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry
                  args={[data.radius * 1.5, data.radius * 2.5, 64]}
                />
                <meshStandardMaterial
                  map={ringTexture}
                  side={THREE.DoubleSide}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}
          </group>

          {/* Moons */}
          {data.moons &&
            data.moons.map((moon) => (
              <Moon key={moon.name} moon={moon} />
            ))}
        </group>
      </group>
    </group>
  );
}

// ── Moon ──────────────────────────────────────────────────────────────

function Moon({ moon }) {
  const moonGroupRef = useRef();
  const moonTexture = useMemo(() => getTexture('moon'), []);

  useFrame((_, delta) => {
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += moon.speed * delta * 0.5;
    }
  });

  return (
    <group ref={moonGroupRef}>
      <mesh position={[moon.orbitRadius, 0, 0]}>
        <sphereGeometry args={[moon.radius, 32, 32]} />
        <meshStandardMaterial map={moonTexture} roughness={0.8} />
      </mesh>
    </group>
  );
}

// ── Asteroid Belt ────────────────────────────────────────────────────

function AsteroidBeltInstanced() {
  const instancedMeshRef = useRef();
  const groupRef = useRef();
  const count = ASTEROID_BELT.count;

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.08, 0), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#888888', roughness: 0.9 }),
    [],
  );

  // Compute matrices once, deterministically from index
  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    const mats = [];
    // seed-based pseudo-random using index
    const rng = (() => { let s = 42; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; })();
    for (let i = 0; i < count; i++) {
      const angle = rng() * Math.PI * 2;
      const radius = ASTEROID_BELT.innerRadius + rng() * (ASTEROID_BELT.outerRadius - ASTEROID_BELT.innerRadius);
      const y = (rng() - 0.5) * 1.5;
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.rotation.set(rng() * Math.PI, rng() * Math.PI, rng() * Math.PI);
      const s = 0.6 + rng() * 0.8;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
    }
    return mats;
  }, [count]);

  // Apply matrices after mesh mounts
  React.useEffect(() => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002 * delta;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={instancedMeshRef} args={[geometry, material, count]} />
    </group>
  );
}

// ── Incoming Asteroid (animated on curved path) ──────────────────────

function IncomingAsteroid() {
  const asteroidRef = useRef();
  const trailRef = useRef();
  const tRef = useRef(0);

  // Flight path: far top-right → near origin → past origin
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(12,  8, -4),
    new THREE.Vector3( 5,  3,  0),
    new THREE.Vector3( 2,  1,  1),
    new THREE.Vector3(-3, -2,  3),
  ]), []);

  // Fire trail particles
  const PARTICLE_COUNT = 100;
  const trailData = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);
    const sizes     = new Float32Array(PARTICLE_COUNT);
    return { positions, colors, sizes };
  }, []);

  useFrame((state, delta) => {
    if (!asteroidRef.current) return;

    // Advance along curve
    tRef.current = (tRef.current + delta * 0.10) % 1;
    const point = curve.getPointAt(tRef.current);
    asteroidRef.current.position.copy(point);

    // Face direction of travel
    const tangent = curve.getTangentAt(tRef.current);
    asteroidRef.current.lookAt(point.clone().add(tangent));

    // Slow tumble
    asteroidRef.current.rotation.x += delta * 0.8;
    asteroidRef.current.rotation.z += delta * 0.5;

    // Update fire trail
    if (trailRef.current) {
      const { positions, colors, sizes } = trailData;

      // Shift particles back
      for (let i = PARTICLE_COUNT - 1; i > 0; i--) {
        positions[i * 3]     = positions[(i - 1) * 3];
        positions[i * 3 + 1] = positions[(i - 1) * 3 + 1];
        positions[i * 3 + 2] = positions[(i - 1) * 3 + 2];

        const ratio = i / PARTICLE_COUNT;
        colors[i * 3]     = 1 - ratio * 0.5;     // R: 1 → 0.5
        colors[i * 3 + 1] = (1 - ratio) * 0.45;  // G: 0.45 → 0
        colors[i * 3 + 2] = 0;                    // B: always 0
        sizes[i] = Math.max(0, 1 - ratio) * 0.15;
      }

      // Insert new particle at asteroid position
      positions[0] = point.x;
      positions[1] = point.y;
      positions[2] = point.z;
      colors[0] = 1; colors[1] = 0.6; colors[2] = 0.1;
      sizes[0] = 0.15;

      trailRef.current.geometry.attributes.position.needsUpdate = true;
      trailRef.current.geometry.attributes.color.needsUpdate    = true;
      trailRef.current.geometry.attributes.size.needsUpdate     = true;
    }
  });

  const distToOrigin = asteroidRef.current
    ? asteroidRef.current.position.length()
    : 999;

  return (
    <>
      {/* Asteroid mesh */}
      <mesh ref={asteroidRef}>
        <icosahedronGeometry args={[0.18, 1]} />
        <meshStandardMaterial
          color={0x8B7355}
          roughness={0.9}
          metalness={0.1}
        />

        {/* Tooltip: show when near Earth (within 6 units of Sun/origin) */}
        <AsteroidTooltip asteroidRef={asteroidRef} />
      </mesh>

      {/* Fire trail particles */}
      <points ref={trailRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={trailData.positions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={trailData.colors}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={trailData.sizes}
            count={PARTICLE_COUNT}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
        />
      </points>
    </>
  );
}

// ── Asteroid Tooltip ─────────────────────────────────────────────────

function AsteroidTooltip({ asteroidRef }) {
  const [visible, setVisible] = useState(false);

  useFrame(() => {
    if (!asteroidRef.current) return;
    const dist = asteroidRef.current.position.length();
    setVisible(dist < 6);
  });

  if (!visible) return null;

  return (
    <Html
      position={[0.5, 0.5, 0]}
      center={false}
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          color: 'white',
          background: 'rgba(0,0,0,0.72)',
          border: '1px solid rgba(31,41,55,0.9)',
          padding: '8px 12px',
          borderRadius: '8px',
          lineHeight: '1.6',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.1em' }}>
          INCOMING ASTEROID
        </div>
        TRAJECTORY: <span style={{ color: '#22c55e' }}>Confirmed</span><br />
        SIZE: ~50m<br />
        VELOCITY: 18 km/s
      </div>
    </Html>
  );
}

// ── Status Bar (bottom of scene) ─────────────────────────────────────

function StatusBar() {
  const [opacity, setOpacity] = useState(1);

  useFrame((state) => {
    // Pulse: 1 → 0.3 every 1s
    setOpacity(0.65 + 0.35 * Math.abs(Math.sin(state.clock.elapsedTime * Math.PI)));
  });

  return (
    <Html
      position={[0, -3.6, 0]}
      center
      style={{ pointerEvents: 'none' }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          color: '#22c55e',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ opacity }}>●</span> System Operational — Monitoring Active
      </div>
    </Html>
  );
}

// ── HeroScene (default export) ───────────────────────────────────────

export default function HeroScene({ className, style }) {
  return (
    <Canvas
      camera={{
        position: HERO_CAMERA.position,
        fov: HERO_CAMERA.fov,
      }}
      dpr={[1, 2]}
      style={style}
      className={className}
    >
      <Suspense fallback={null}>
        {/* Ambient lighting */}
        <ambientLight intensity={1.5} color="#ffffff" />
        <hemisphereLight skyColor="#1a1aff" groundColor="#0a0a0a" intensity={0.8} />

        {/* Star field */}
        <Stars
          count={STAR_COUNT}
          radius={200}
          depth={80}
          factor={2}
          fade
        />

        {/* Sun */}
        <Sun />

        {/* Planets */}
        {PLANET_DATA.map((planet) => (
          <Planet key={planet.id} data={planet} />
        ))}

        {/* Asteroid belt */}
        <AsteroidBeltInstanced />

        {/* Incoming asteroid with fire trail + tooltip */}
        <IncomingAsteroid />

        {/* Status bar at bottom */}
        <StatusBar />

        {/* Camera controls */}
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.3}
          enableZoom
          enablePan={false}
          minDistance={15}
          maxDistance={120}
          maxPolarAngle={Math.PI / 2.2}
        />
      </Suspense>
    </Canvas>
  );
}

