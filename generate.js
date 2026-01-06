const fs = require("fs");

/* =======================
   CONFIG
======================= */
const WIDTH = 900;
const HEIGHT = 220;
const BASELINE = 110;
const POINTS = 160;
const BARS = 48;

/* =======================
   FAKE BPM SYSTEM
======================= */
const BPM = 120;
const BEAT_DURATION = 60 / BPM;

/* =======================
   WAVE GENERATION
======================= */
function generateWave(mult = 1, phaseShift = 0) {
  const points = [];
  const phase = Math.random() * Math.PI * 2 + phaseShift;

  for (let i = 0; i < POINTS; i++) {
    const t = i / POINTS;
    const amp =
      Math.sin(t * Math.PI * 2 + phase) * 28 * mult +
      Math.sin(t * Math.PI * 6 + phase * 0.6) * 14 * mult +
      Math.sin(t * Math.PI * 12) * 6 * mult;

    points.push(BASELINE - amp);
  }
  return points;
}

function buildPath(points) {
  const step = WIDTH / (points.length - 1);
  let d = `M 0 ${points[0]} `;

  for (let i = 1; i < points.length; i++) {
    const x = i * step;
    const px = (i - 1) * step;
    const cx = (px + x) / 2;
    d += `Q ${cx} ${points[i - 1]} ${x} ${points[i]} `;
  }
  return d;
}

/* =======================
   EQUALIZER BARS
======================= */
function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const h1 = 20 + Math.random() * 60;
    const h2 = 20 + Math.random() * 60;

    bars.push(`
      <rect x="${i * barWidth}"
            y="${HEIGHT - h1}"
            width="${barWidth - 3}"
            height="${h1}"
            fill="url(#cyberGradient)"
            opacity="0.55">
        <animate attributeName="height"
                 dur="${BEAT_DURATION}s"
                 repeatCount="indefinite"
                 values="${h1};${h2};${h1}" />
        <animate attributeName="y"
                 dur="${BEAT_DURATION}s"
                 repeatCount="indefinite"
                 values="${HEIGHT - h1};${HEIGHT - h2};${HEIGHT - h1}" />
      </rect>
    `);
  }
  return bars.join("");
}

/* =======================
   GENERATE SVG
======================= */
function generateSVG() {
  const waveFront = buildPath(generateWave(1.0, 0));
  const waveMid   = buildPath(generateWave(0.7, 2));
  const waveBack  = buildPath(generateWave(0.4, 4));

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

    <!-- Beat Pulse -->
    <animateTransform id="pulse"
      attributeName="transform"
      type="scale"
      from="1"
      to="1.03"
      dur="${BEAT_DURATION}s"
      repeatCount="indefinite"
      additive="sum" />
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#05010d"/>

  <!-- Equalizer -->
  <g filter="url(#neonGlow)">
    ${generateBars()}
  </g>

  <!-- Back Wave -->
  <path d="${waveBack}"
        stroke="url(#cyberGradient)"
        stroke-width="2"
        opacity="0.25"
        fill="none">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-20 0"
      dur="6s"
      repeatCount="indefinite"/>
  </path>

  <!-- Mid Wave -->
  <path d="${waveMid}"
        stroke="url(#cyberGradient)"
        stroke-width="3"
        opacity="0.45"
        fill="none">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-12 0"
      dur="4s"
      repeatCount="indefinite"/>
  </path>

  <!-- Front Wave -->
  <g filter="url(#neonGlow)">
    <path d="${waveFront}"
          stroke="url(#cyberGradient)"
          stroke-width="4"
          fill="none">
      <animateTransform
        attributeName="transform"
        type="translate"
        from="0 0"
        to="-6 0"
        dur="2.5s"
        repeatCount="indefinite"/>
    </path>
  </g>

</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
