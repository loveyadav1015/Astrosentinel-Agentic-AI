// ── Shared 3D scene configuration ────────────────────────────────────

export const STAR_COUNT = 3000;

// Planet scale multipliers (visual scale, not astronomical)
export const PLANET_DATA = [
  { id: 'mercury', name: 'Mercury', radius: 0.8, orbitRadius: 4,  speed: 4.15,  tilt: 0.01 },
  { id: 'venus',   name: 'Venus',   radius: 1.8, orbitRadius: 6, speed: 1.62,  tilt: 177 },
  { id: 'earth',   name: 'Earth',   radius: 2.0, orbitRadius: 8.5, speed: 1.0,   tilt: 23.4 },
  { id: 'mars',    name: 'Mars',    radius: 1.0, orbitRadius: 11, speed: 0.53,  tilt: 25.2 },
  { id: 'jupiter', name: 'Jupiter', radius: 5.6, orbitRadius: 16, speed: 0.084, tilt: 3.1,
    moons: [
      { name: 'Io',       radius: 0.15, orbitRadius: 3.5, speed: 3.0 },
      { name: 'Europa',   radius: 0.13, orbitRadius: 4.2, speed: 2.4 },
      { name: 'Ganymede', radius: 0.2,  orbitRadius: 5.2, speed: 1.8 },
      { name: 'Callisto', radius: 0.18, orbitRadius: 6.5, speed: 1.2 },
    ],
  },
  { id: 'saturn', name: 'Saturn', radius: 4.6, orbitRadius: 21, speed: 0.034, tilt: 26.7, hasRings: true,
    moons: [
      { name: 'Titan',     radius: 0.2,  orbitRadius: 4.5, speed: 1.5 },
      { name: 'Enceladus', radius: 0.08, orbitRadius: 3.0, speed: 3.5 },
      { name: 'Rhea',      radius: 0.1,  orbitRadius: 3.8, speed: 2.2 },
      { name: 'Iapetus',   radius: 0.12, orbitRadius: 5.5, speed: 0.8 },
    ],
  },
  { id: 'uranus', name: 'Uranus', radius: 2.8, orbitRadius: 26, speed: 0.012, tilt: 97.8,
    moons: [
      { name: 'Miranda', radius: 0.06, orbitRadius: 2.2, speed: 3.0 },
      { name: 'Titania', radius: 0.12, orbitRadius: 3.5, speed: 1.8 },
    ],
  },
  { id: 'neptune', name: 'Neptune', radius: 2.6, orbitRadius: 30, speed: 0.006, tilt: 28.3,
    moons: [
      { name: 'Triton', radius: 0.14, orbitRadius: 3.0, speed: 2.0 },
    ],
  },
];

// NEO color map by tier
export const NEO_TIER_COLORS = {
  Critical: '#EF4444',
  Elevated: '#F59E0B',
  Watch:    '#3B82F6',
};

// Default camera positions
export const HERO_CAMERA = { position: [0, 20, 60], fov: 50 };
export const DASHBOARD_CAMERA = { position: [0, 2, 8], fov: 45 };
export const ABOUT_CAMERA = { position: [0, 2, 14], fov: 50 };

// Asteroid belt
export const ASTEROID_BELT = {
  count: 300,
  innerRadius: 13,
  outerRadius: 15,
};

// Sun
export const SUN_RADIUS = 3.0;
export const SUN_LIGHT_INTENSITY = 3.0;
