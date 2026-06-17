// ── Mock NEO Objects ────────────────────────────────────────────────

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function randomInRange(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(1);
}

export const neoObjects = [
  {
    id: 'neo-001',
    name: '2025 HT3',
    diameter: 780,
    velocity: 28.4,
    missDistance: 2.1,
    approachDate: daysFromNow(3),
    tier: 'Critical',
    confidence: 94,
    rationale: 'Object 2025 HT3 presents a critical risk profile due to its exceptionally large estimated diameter of 780 meters combined with a close approach distance of only 2.1 Lunar Distances. At a relative velocity of 28.4 km/s, the kinetic energy upon potential impact would exceed 1,200 megatons TNT equivalent. The orbital uncertainty parameter is low (U=1), indicating a well-constrained trajectory. Continuous monitoring and contingency planning is strongly recommended.',
  },
  {
    id: 'neo-002',
    name: '2024 BX1',
    diameter: 340,
    velocity: 22.1,
    missDistance: 4.8,
    approachDate: daysFromNow(7),
    tier: 'Critical',
    confidence: 88,
    rationale: 'Object 2024 BX1 has a diameter of approximately 340 meters and is approaching within 4.8 Lunar Distances at 22.1 km/s. While the miss distance provides some margin, the object\'s size places it in the city-destroyer category. Its orbital elements suggest a possible resonance return in 2031, warranting sustained observation. MOID (Minimum Orbit Intersection Distance) is 0.008 AU.',
  },
  {
    id: 'neo-003',
    name: '2025 KR7',
    diameter: 520,
    velocity: 31.2,
    missDistance: 1.3,
    approachDate: daysFromNow(12),
    tier: 'Critical',
    confidence: 91,
    rationale: 'Object 2025 KR7 is flagged critical due to an exceptionally tight miss distance of 1.3 LD — well within the geostationary orbit zone when accounting for uncertainty margins. At 520 meters, a ground impact would create a crater approximately 8 km wide. The high approach velocity of 31.2 km/s leaves minimal time for deflection if the trajectory shifts within error bounds.',
  },
  {
    id: 'neo-004',
    name: '2025 AB12',
    diameter: 210,
    velocity: 18.7,
    missDistance: 6.2,
    approachDate: daysFromNow(15),
    tier: 'Elevated',
    confidence: 76,
    rationale: 'Object 2025 AB12 measures approximately 210 meters in diameter with a miss distance of 6.2 LD. While not an immediate threat, its orbital inclination of 12.4° and eccentricity of 0.58 place it in a dynamically interesting orbit that could experience perturbations from Jupiter\'s gravitational influence. Elevated monitoring frequency is warranted.',
  },
  {
    id: 'neo-005',
    name: '2024 WN4',
    diameter: 155,
    velocity: 24.3,
    missDistance: 8.1,
    approachDate: daysFromNow(22),
    tier: 'Elevated',
    confidence: 72,
    rationale: 'Object 2024 WN4 has an estimated diameter of 155 meters approaching at 24.3 km/s with a miss distance of 8.1 LD. The object was only recently discovered, and its orbital arc spans just 14 days of observations. The uncertainty parameter (U=4) indicates the trajectory could shift meaningfully with additional data. Classification may change with further astrometry.',
  },
  {
    id: 'neo-006',
    name: '2025 FQ9',
    diameter: 280,
    velocity: 15.9,
    missDistance: 9.4,
    approachDate: daysFromNow(28),
    tier: 'Elevated',
    confidence: 81,
    rationale: 'Object 2025 FQ9 at 280 meters diameter represents a significant mass with approach distance of 9.4 LD. Its relatively low velocity of 15.9 km/s suggests a near-Earth orbit with low eccentricity. The Yarkovsky effect may alter its trajectory over multi-decade timescales. Continued tracking recommended to refine long-term impact probability estimates.',
  },
  {
    id: 'neo-007',
    name: '2025 DM5',
    diameter: 95,
    velocity: 19.8,
    missDistance: 11.3,
    approachDate: daysFromNow(35),
    tier: 'Elevated',
    confidence: 68,
    rationale: 'Object 2025 DM5 is a smaller body at 95 meters but maintains elevated status due to its 11.3 LD approach and a calculated Palermo Scale value of -3.2. While individually not catastrophic, objects of this size can cause significant regional damage. Its short synodic period means frequent close approaches.',
  },
  {
    id: 'neo-008',
    name: '2024 PL2',
    diameter: 72,
    velocity: 12.4,
    missDistance: 14.7,
    approachDate: daysFromNow(41),
    tier: 'Watch',
    confidence: 55,
    rationale: 'Object 2024 PL2 at 72 meters diameter and 14.7 LD miss distance falls within standard Watch parameters. Its slow approach velocity of 12.4 km/s and well-characterized orbit (arc = 180 days) provide confidence in the predicted trajectory. No actionable risk at this time. Routine monitoring continues.',
  },
  {
    id: 'neo-009',
    name: '2025 GE8',
    diameter: 58,
    velocity: 14.1,
    missDistance: 16.5,
    approachDate: daysFromNow(48),
    tier: 'Watch',
    confidence: 52,
    rationale: 'Object 2025 GE8 is a relatively small body at 58 meters with a comfortable miss distance of 16.5 LD. It was identified during routine survey operations by the Catalina Sky Survey. At this size, atmospheric entry would result in an airburst event rather than ground impact. Torino Scale rating: 0.',
  },
  {
    id: 'neo-010',
    name: '2025 LM1',
    diameter: 120,
    velocity: 21.6,
    missDistance: 12.9,
    approachDate: daysFromNow(55),
    tier: 'Watch',
    confidence: 60,
    rationale: 'Object 2025 LM1 has a diameter of approximately 120 meters and will pass at 12.9 LD. The approach velocity of 21.6 km/s is moderate. Spectroscopic analysis suggests an S-type (siliceous) composition. The object is currently at magnitude 24.1 and brightening as it approaches. Standard Watch classification maintained pending further observations.',
  },
  {
    id: 'neo-011',
    name: '2024 YQ6',
    diameter: 65,
    velocity: 10.8,
    missDistance: 18.2,
    approachDate: daysFromNow(62),
    tier: 'Watch',
    confidence: 48,
    rationale: 'Object 2024 YQ6 is a small Apollo-class asteroid at 65 meters. Its 18.2 LD miss distance places it well outside any immediate concern threshold. The object\'s low velocity of 10.8 km/s indicates an orbit similar to Earth\'s. First observed in December 2024, it has been tracked through two apparitions.',
  },
  {
    id: 'neo-012',
    name: '2025 NR3',
    diameter: 88,
    velocity: 16.3,
    missDistance: 19.8,
    approachDate: daysFromNow(75),
    tier: 'Watch',
    confidence: 45,
    rationale: 'Object 2025 NR3 is an Aten-class asteroid with a semi-major axis less than 1 AU. At 88 meters and 19.8 LD, it presents minimal risk during this passage. Its orbital period of 0.87 years means it will return for another close approach in approximately 11 months. Future approaches may be closer due to secular perturbations.',
  },
];

// ── Alert History ────────────────────────────────────────────────────

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const channels = ['Slack', 'Email', 'Webhook', 'Slack, Email', 'Email, Webhook', 'Slack, Email, Webhook', 'Slack, Webhook'];
const statuses = ['Sent', 'Sent', 'Sent', 'Sent', 'Sent', 'Failed', 'Sent']; // mostly sent

export const alertHistory = [
  { id: 'a-001', timestamp: daysAgo(0), objectName: '2025 KR7', tier: 'Critical', diameter: 520, missDistance: 1.3, channels: 'Slack, Email, Webhook', status: 'Sent' },
  { id: 'a-002', timestamp: daysAgo(1), objectName: '2025 HT3', tier: 'Critical', diameter: 780, missDistance: 2.1, channels: 'Slack, Email, Webhook', status: 'Sent' },
  { id: 'a-003', timestamp: daysAgo(1), objectName: '2024 BX1', tier: 'Critical', diameter: 340, missDistance: 4.8, channels: 'Slack, Email', status: 'Sent' },
  { id: 'a-004', timestamp: daysAgo(2), objectName: '2025 AB12', tier: 'Elevated', diameter: 210, missDistance: 6.2, channels: 'Email, Webhook', status: 'Sent' },
  { id: 'a-005', timestamp: daysAgo(3), objectName: '2024 WN4', tier: 'Elevated', diameter: 155, missDistance: 8.1, channels: 'Slack', status: 'Sent' },
  { id: 'a-006', timestamp: daysAgo(4), objectName: '2025 FQ9', tier: 'Elevated', diameter: 280, missDistance: 9.4, channels: 'Email', status: 'Sent' },
  { id: 'a-007', timestamp: daysAgo(5), objectName: '2025 DM5', tier: 'Elevated', diameter: 95, missDistance: 11.3, channels: 'Slack, Email', status: 'Failed' },
  { id: 'a-008', timestamp: daysAgo(7), objectName: '2024 PL2', tier: 'Watch', diameter: 72, missDistance: 14.7, channels: 'Email', status: 'Sent' },
  { id: 'a-009', timestamp: daysAgo(8), objectName: '2025 GE8', tier: 'Watch', diameter: 58, missDistance: 16.5, channels: 'Slack', status: 'Sent' },
  { id: 'a-010', timestamp: daysAgo(10), objectName: '2025 LM1', tier: 'Watch', diameter: 120, missDistance: 12.9, channels: 'Webhook', status: 'Sent' },
  { id: 'a-011', timestamp: daysAgo(12), objectName: '2024 YQ6', tier: 'Watch', diameter: 65, missDistance: 18.2, channels: 'Email', status: 'Sent' },
  { id: 'a-012', timestamp: daysAgo(14), objectName: '2025 NR3', tier: 'Watch', diameter: 88, missDistance: 19.8, channels: 'Slack, Email', status: 'Sent' },
  { id: 'a-013', timestamp: daysAgo(16), objectName: '2025 KR7', tier: 'Critical', diameter: 520, missDistance: 1.5, channels: 'Slack, Email, Webhook', status: 'Sent' },
  { id: 'a-014', timestamp: daysAgo(18), objectName: '2025 AB12', tier: 'Elevated', diameter: 210, missDistance: 7.0, channels: 'Email', status: 'Sent' },
  { id: 'a-015', timestamp: daysAgo(20), objectName: '2024 WN4', tier: 'Elevated', diameter: 155, missDistance: 8.8, channels: 'Slack', status: 'Failed' },
  { id: 'a-016', timestamp: daysAgo(23), objectName: '2025 HT3', tier: 'Critical', diameter: 780, missDistance: 2.5, channels: 'Slack, Email, Webhook', status: 'Sent' },
  { id: 'a-017', timestamp: daysAgo(26), objectName: '2025 FQ9', tier: 'Elevated', diameter: 280, missDistance: 10.1, channels: 'Email, Webhook', status: 'Sent' },
  { id: 'a-018', timestamp: daysAgo(29), objectName: '2025 DM5', tier: 'Elevated', diameter: 95, missDistance: 12.0, channels: 'Slack', status: 'Sent' },
];

// ── Helper to get summary stats ─────────────────────────────────────
export function getDashboardStats() {
  const total = neoObjects.length;
  const critical = neoObjects.filter(n => n.tier === 'Critical').length;
  const elevated = neoObjects.filter(n => n.tier === 'Elevated').length;
  const watch = neoObjects.filter(n => n.tier === 'Watch').length;
  return { total, critical, elevated, watch };
}

export function getLastScanTime() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - 12);
  return d.toLocaleString();
}
