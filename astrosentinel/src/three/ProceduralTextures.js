import * as THREE from 'three';

// ── FBM Noise Utilities ─────────────────────────────────────────────

function noise2D(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x, y, seed, octaves = 5) {
  let value = 0, amplitude = 0.5, frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency, seed + i * 100);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function lerpColor(c1, c2, t) {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

// ── Canvas texture factory ──────────────────────────────────────────

function createCanvasTexture(w, h, drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, w, h);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── Planet drawers ──────────────────────────────────────────────────

function drawSun(ctx, w, h) {
  const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
  grad.addColorStop(0, '#FFEE88'); grad.addColorStop(0.3, '#FFCC44');
  grad.addColorStop(0.6, '#FF8800'); grad.addColorStop(1, '#CC4400');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    const n = fbm(x/w*8, y/h*8, 42);
    const b = 180 + n * 75;
    ctx.fillStyle = `rgba(${b},${b*0.7|0},${b*0.2|0},0.3)`;
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawRocky(ctx, w, h, base, crater, seed) {
  const bc = hexToRgb(base), cc = hexToRgb(crater);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = fbm(x/w*8, y/h*8, seed, 6);
    const c = lerpColor(bc, cc, n);
    const v = (noise2D(x/w*24, y/h*24, seed+50) - 0.5) * 30;
    ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,c.r+v))},${Math.max(0,Math.min(255,c.g+v))},${Math.max(0,Math.min(255,c.b+v))})`;
    ctx.fillRect(x, y, 1, 1);
  }
  const rng = seededRandom(seed);
  for (let i = 0; i < 40; i++) {
    const cx = rng()*w, cy = rng()*h, cr = 3 + rng()*12;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    g.addColorStop(0, `rgba(${cc.r-30},${cc.g-30},${cc.b-30},0.5)`);
    g.addColorStop(0.7, `rgba(${cc.r},${cc.g},${cc.b},0.3)`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI*2); ctx.fill();
  }
}

function drawEarth(ctx, w, h) {
  ctx.fillStyle = '#1a4d7a'; ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = fbm(x/w*10, y/h*8, 333, 6);
    if (n > 0.52) {
      const green = n > 0.65 ? '#2d5a1e' : n > 0.58 ? '#4a7a2e' : '#3d6b28';
      ctx.fillStyle = Math.abs(y/h - 0.5) > 0.4 ? '#ddeeff' : green;
      ctx.fillRect(x, y, 1, 1);
    } else if (n > 0.48) {
      ctx.fillStyle = '#2266aa'; ctx.fillRect(x, y, 1, 1);
    }
  }
  // Polar caps
  const pg = ctx.createLinearGradient(0,0,0,h);
  pg.addColorStop(0,'rgba(220,240,255,0.7)'); pg.addColorStop(0.12,'rgba(220,240,255,0)');
  pg.addColorStop(0.88,'rgba(220,240,255,0)'); pg.addColorStop(1,'rgba(220,240,255,0.7)');
  ctx.fillStyle = pg; ctx.fillRect(0,0,w,h);
  // Clouds
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = fbm(x/w*12+10, y/h*8, 334, 4);
    if (n > 0.6) { ctx.fillStyle = `rgba(255,255,255,${(n-0.6)*1.2})`; ctx.fillRect(x,y,1,1); }
  }
}

function drawGasGiant(ctx, w, h, colors, seed) {
  for (let y = 0; y < h; y++) {
    const bi = Math.floor((y/h)*colors.length);
    const band = hexToRgb(colors[Math.min(bi, colors.length-1)]);
    const next = hexToRgb(colors[Math.min(bi+1, colors.length-1)]);
    const t = ((y/h)*colors.length) % 1;
    const c = lerpColor(band, next, t);
    for (let x = 0; x < w; x++) {
      const n = fbm(x/w*12 + Math.sin(y/h*8)*0.5, y/h*6, seed, 4);
      const v = (n - 0.5) * 40;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,c.r+v))},${Math.max(0,Math.min(255,c.g+v))},${Math.max(0,Math.min(255,c.b+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function drawVenus(ctx, w, h) {
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#E8C87A'); g.addColorStop(0.5,'#D4A84A'); g.addColorStop(1,'#C09030');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = fbm(x/w*8+Math.sin(y/h*4)*0.8, y/h*5, 222, 5);
    if (n > 0.5) { ctx.fillStyle = `rgba(255,230,180,${(n-0.5)*0.6})`; ctx.fillRect(x,y,1,1); }
  }
}

function drawMars(ctx, w, h) {
  drawRocky(ctx, w, h, '#C1440E', '#8B3010', 444);
  const pg = ctx.createLinearGradient(0,0,0,h);
  pg.addColorStop(0,'rgba(230,220,210,0.6)'); pg.addColorStop(0.08,'rgba(230,220,210,0)');
  pg.addColorStop(0.92,'rgba(230,220,210,0)'); pg.addColorStop(1,'rgba(230,220,210,0.5)');
  ctx.fillStyle = pg; ctx.fillRect(0,0,w,h);
}

function drawJupiter(ctx, w, h) {
  drawGasGiant(ctx, w, h, ['#C4A46C','#A0784A','#D4B88C','#8A6030','#C8A060','#B8884A','#D0A868','#907040','#C4A46C','#A87A48','#D8B480','#9A6A3C','#C8A060'], 555);
  const sx = w*0.6, sy = h*0.55;
  const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, w*0.06);
  sg.addColorStop(0,'rgba(200,80,40,0.8)'); sg.addColorStop(0.5,'rgba(180,60,30,0.5)'); sg.addColorStop(1,'rgba(160,50,20,0)');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(sx, sy, w*0.06, h*0.03, 0, 0, Math.PI*2); ctx.fill();
}

function drawSaturn(ctx, w, h) {
  drawGasGiant(ctx, w, h, ['#E8D5A3','#D4C090','#F0E0B0','#C8B080','#E0CC98','#D0BC88','#ECD8A8','#C4AC78','#E8D5A3','#D8C494'], 666);
}

function drawUranus(ctx, w, h) {
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#8ED4C8'); g.addColorStop(0.3,'#9CE0D4'); g.addColorStop(0.5,'#7AC8BC'); g.addColorStop(0.7,'#9CE0D4'); g.addColorStop(1,'#8ED4C8');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  for (let y = 0; y < h; y++) { const n = fbm(0.5, y/h*6, 777, 2); if (n > 0.5) { ctx.fillStyle = `rgba(180,240,230,${(n-0.5)*0.3})`; ctx.fillRect(0,y,w,1); } }
}

function drawNeptune(ctx, w, h) {
  const g = ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'#3355FF'); g.addColorStop(0.3,'#4466FF'); g.addColorStop(0.5,'#2244DD'); g.addColorStop(0.7,'#4466FF'); g.addColorStop(1,'#3355FF');
  ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const n = fbm(x/w*10+Math.sin(y/h*12)*0.6, y/h*6, 888, 4);
    if (n > 0.55) { ctx.fillStyle = `rgba(100,150,255,${(n-0.55)*1.0})`; ctx.fillRect(x,y,1,1); }
  }
}

function drawSaturnRing(ctx, w, h) {
  for (let x = 0; x < w; x++) {
    const t = x / w;
    const b1 = Math.sin(t*Math.PI*30)*0.5+0.5, b2 = Math.sin(t*Math.PI*50+2)*0.3+0.5, b3 = Math.sin(t*Math.PI*80+5)*0.2+0.5;
    const brightness = (b1+b2+b3)/3;
    const r = Math.round(200+brightness*55), g = Math.round(180+brightness*50), b = Math.round(140+brightness*40);
    ctx.fillStyle = `rgba(${r},${g},${b},${brightness*0.7})`;
    ctx.fillRect(x, 0, 1, h);
  }
}

function drawMoon(ctx, w, h) {
  drawRocky(ctx, w, h, '#A0A0A0', '#707070', 999);
}

// ── Texture registry & cache ────────────────────────────────────────

const GENERATORS = {
  sun: drawSun, mercury: (c,w,h) => drawRocky(c,w,h,'#8C8C8C','#5A5A5A',111),
  venus: drawVenus, earth: drawEarth, mars: drawMars,
  jupiter: drawJupiter, saturn: drawSaturn, uranus: drawUranus, neptune: drawNeptune,
  moon: drawMoon, saturnRing: drawSaturnRing,
};

const cache = {};

export function getTexture(name) {
  if (cache[name]) return cache[name];
  const fn = GENERATORS[name];
  if (!fn) {
    const tex = createCanvasTexture(64, 64, (ctx, w, h) => { ctx.fillStyle = '#888'; ctx.fillRect(0,0,w,h); });
    cache[name] = tex; return tex;
  }
  const [w, h] = name === 'saturnRing' ? [1024, 128] : [1024, 512];
  const tex = createCanvasTexture(w, h, fn);
  cache[name] = tex;
  return tex;
}

export function disposeTextures() {
  Object.values(cache).forEach(t => t.dispose());
  Object.keys(cache).forEach(k => delete cache[k]);
}
