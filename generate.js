const fs = require("fs");

/* =======================
   PRESET CONFIG
======================= */
const PRESET = "SYNTHWAVE"; // EDM | LOFI | SYNTHWAVE

const PRESETS = {
  EDM:      { bpm: 140, waveAmp: 1.2, barAmp: 1.4 },
  LOFI:     { bpm: 80,  waveAmp: 0.6, barAmp: 0.5 },
  SYNTHWAVE:{ bpm: 110, waveAmp: 1.0, barAmp: 1.0 }
};

const CFG = PRESETS[PRESET];

/* =======================
   CORE CONFIG
======================= */
const WIDTH = 960;
const HEIGHT = 260;
const BASELINE = 130;
const POINTS = 180;
const BARS = 56;

const BEAT = 60 / CFG.bpm;

/* =======================
   WAVE GENERATOR
======================= */
function generateWave(mult = 1, phaseShift = 0) {
  const points = [];
  const phase = Math.random() * Math.PI * 2 + phaseShift;

  for (let i = 0; i < POINTS; i++) {
    const t = i / POINTS;
    const amp =
      Math.sin(t * Math.PI * 2 + phase) * 30 +
      Math.sin(t * Math.PI * 6 + phase * 0.7) * 14 +
      Math.sin(t * Math.PI * 12) * 6;

    points.push(BASELINE - amp * mult * CFG.waveAmp);
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
   EQUALIZER
======================= */
function generateBars() {
  const bars = [];
  const bw = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const h1 = (20 + Math.random() * 70) * CFG.barAmp;
    const h2 = (20 + Math.random() * 70) * CFG.barAmp;

    bars.push(`
      <rect x="${i * bw}"
            y="${HEIGHT - h1}"
            width="${bw - 3}"
            height="${h1}"
            fill="url(#grad)"
            opacity="0.55">
        <animate attributeName="height"
                 dur="${BEAT}s"
                 repeatCount="indefinite"
                 values="${h1};${h2};${h1}" />
        <animate attributeName="y"
                 dur="${BEAT}s"
                 repeatCount="indefinite"
                 values="${HEIGHT - h1};${HEIGHT - h2};${HEIGHT - h1}" />
      </rect>
    `);
  }
  return bars.join("");
}

/* =======================
   SVG OUTPUT
======================= */
function generateSVG() {
  const waveFront = buildPath(generateWave(1.0, 0));
  const waveMid   = buildPath(generateWave(0.7, 2));
  const waveBack  = buildPath(generateWave(0.4, 4));

  const svg = `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

<defs>
  <!-- CYBERPUNK GRADIENT -->
  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#ff2fdc"/>
    <stop offset="40%" stop-color="#9b5cff"/>
    <stop offset="70%" stop-color="#00f5ff"/>
    <stop offset="100%" stop-color="#00f5ff"/>
  </linearGradient>

  <!-- NEON GLOW -->
  <filter id="glow">
    <feGaussianBlur stdDeviation="4" result="b"/>
    <feMerge>
      <feMergeNode in="b"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>

  <!-- CRT SCANLINE -->
  <pattern id="scanline" width="4" height="4" patternUnits="userSpaceOnUse">
    <rect width="4" height="1" fill="rgba(255,255,255,0.04)"/>
  </pattern>
</defs>

<!-- BACKGROUND -->
<rect width="100%" height="100%" fill="#05010d"/>
<rect width="100%" height="100%" fill="url(#scanline)"/>

<!-- EQUALIZER -->
<g filter="url(#glow)">
  ${generateBars()}
</g>

<!-- WAVES -->
<path d="${waveBack}" stroke="url(#grad)" stroke-width="2"
      opacity="0.25" fill="none">
  <animateTransform type="translate" from="0 0" to="-24 0"
                    dur="7s" repeatCount="indefinite"/>
</path>

<path d="${waveMid}" stroke="url(#grad)" stroke-width="3"
      opacity="0.45" fill="none">
  <animateTransform type="translate" from="0 0" to="-14 0"
                    dur="4.5s" repeatCount="indefinite"/>
</path>

<g filter="url(#glow)">
  <path d="${waveFront}" stroke="url(#grad)" stroke-width="4"
        fill="none">
    <animateTransform type="translate" from="0 0" to="-7 0"
                      dur="2.6s" repeatCount="indefinite"/>
  </path>
</g>

<!-- BRANDING -->
<text x="50%" y="48%"
      text-anchor="middle"
      font-size="28"
      letter-spacing="4"
      fill="#ffffff"
      opacity="0.85"
      style="font-family: monospace"
      filter="url(#glow)">
  LORDZEFAN
  <animateTransform
    type="scale"
    from="1"
    to="1.04"
    dur="${BEAT}s"
    repeatCount="indefinite"
    additive="sum"/>
</text>

</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
