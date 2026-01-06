const fs = require("fs");

/* =======================
   CONFIG
======================= */
const WIDTH = 900;
const HEIGHT = 180;
const BASELINE = 90;
const POINTS = 140;

/* =======================
   GENERATE MUSIC WAVE
======================= */
function generateWavePoints() {
  const points = [];
  let phase = Math.random() * Math.PI * 2;

  for (let i = 0; i < POINTS; i++) {
    const t = i / POINTS;
    const amp =
      Math.sin(t * Math.PI * 2 + phase) * 28 +
      Math.sin(t * Math.PI * 6 + phase * 0.7) * 16 +
      Math.sin(t * Math.PI * 12) * 8;

    points.push(BASELINE - amp);
  }

  return points;
}

/* =======================
   BUILD SMOOTH PATH
======================= */
function buildPath(points) {
  const step = WIDTH / (points.length - 1);
  let d = `M 0 ${points[0]} `;

  for (let i = 1; i < points.length; i++) {
    const x = i * step;
    const prevX = (i - 1) * step;
    const cx = (prevX + x) / 2;

    d += `Q ${cx} ${points[i - 1]} ${x} ${points[i]} `;
  }

  return d;
}

/* =======================
   GENERATE SVG
======================= */
function generateSVG() {
  const waveA = buildPath(generateWavePoints());
  const waveB = buildPath(generateWavePoints());

  const svg = `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Cyberpunk Gradient -->
    <linearGradient id="cyberGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff2fdc"/>
      <stop offset="45%" stop-color="#9b5cff"/>
      <stop offset="75%" stop-color="#00f5ff"/>
      <stop offset="100%" stop-color="#00f5ff"/>
    </linearGradient>

    <!-- Neon Glow -->
    <filter id="neonGlow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#05010d"/>

  <!-- Music Wave -->
  <path d="${waveA}"
        stroke="url(#cyberGradient)"
        stroke-width="3.5"
        fill="none"
        filter="url(#neonGlow)">
    <animate
      attributeName="d"
      dur="2.4s"
      repeatCount="indefinite"
      values="
        ${waveA};
        ${waveB};
        ${waveA}
      " />
  </path>
</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
