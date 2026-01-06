const fs = require("fs");

/* =======================
   PRESET
======================= */
const PRESET = "CYBER"; // CYBER | EDM | LOFI

const PRESETS = {
  CYBER: { bpm: 110, waveAmp: 1.0 },
  EDM:   { bpm: 140, waveAmp: 1.3 },
  LOFI:  { bpm: 80,  waveAmp: 0.6 }
};

const CFG = PRESETS[PRESET];

/* =======================
   CORE CONFIG
======================= */
const WIDTH = 960;
const HEIGHT = 280;
const BASELINE = 140;
const POINTS = 200;
const BARS = 60;

/* =======================
   WAVE (TRUE PARALLAX)
======================= */
function generateWave(layer) {
  const points = [];
  const phase = Math.random() * Math.PI * 2;
  const depthFactor = 1 - layer * 0.25;

  for (let i = 0; i < POINTS; i++) {
    const t = i / POINTS;

    const noise =
      Math.sin(t * Math.PI * 2 + phase) * 28 +
      Math.sin(t * Math.PI * (6 + layer * 2) + phase * 0.7) * 14 +
      Math.sin(t * Math.PI * (12 + layer * 3)) * 6;

    points.push(
      BASELINE -
      noise *
      CFG.waveAmp *
      depthFactor
    );
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
   CHAOTIC EQUALIZER
======================= */
function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const minH = 20 + Math.random() * 20;
    const maxH = minH + Math.random() * 90;

    const dur = (0.3 + Math.random() * 0.9).toFixed(2);

    const yMin = HEIGHT - minH;
    const yMax = HEIGHT - maxH;

    bars.push(`
      <rect x="${i * barWidth}"
            y="${yMin}"
            width="${barWidth - 2}"
            height="${minH}"
            fill="url(#grad)"
            opacity="${0.35 + Math.random() * 0.45}">
        <animate attributeName="height"
                 dur="${dur}s"
                 repeatCount="indefinite"
                 values="${minH};${maxH};${minH}" />
        <animate attributeName="y"
                 dur="${dur}s"
                 repeatCount="indefinite"
                 values="${yMin};${yMax};${yMin}" />
      </rect>
    `);
  }

  return bars.join("");
}


/* =======================
   SVG OUTPUT
======================= */
function generateSVG() {
  const waveBack  = buildPath(generateWave(2));
  const waveMid   = buildPath(generateWave(1));
  const waveFront = buildPath(generateWave(0));

  const svg = `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

<defs>
  <!-- CYBER GRADIENT -->
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
  <pattern id="scanline" width="4" height="4">
    <rect width="4" height="1" fill="rgba(255,255,255,0.05)"/>
  </pattern>
</defs>

<!-- BACKGROUND -->
<rect width="100%" height="100%" fill="#05010d"/>
<rect width="100%" height="100%" fill="url(#scanline)"/>

<!-- EQUALIZER (CHAOTIC) -->
<g filter="url(#glow)">
  ${generateBars()}
</g>

<!-- TRUE PARALLAX WAVES -->
<path d="${waveBack}" stroke="url(#grad)" stroke-width="2"
      opacity="0.18" fill="none">
  <animateTransform type="translate"
                    from="0 0" to="-40 0"
                    dur="9s" repeatCount="indefinite"/>
</path>

<path d="${waveMid}" stroke="url(#grad)" stroke-width="3"
      opacity="0.35" fill="none">
  <animateTransform type="translate"
                    from="0 0" to="-22 0"
                    dur="5.5s" repeatCount="indefinite"/>
</path>

<g filter="url(#glow)">
  <path d="${waveFront}" stroke="url(#grad)" stroke-width="4"
        fill="none">
    <animateTransform type="translate"
                      from="0 0" to="-10 0"
                      dur="3s" repeatCount="indefinite"/>
  </path>
</g>

<!-- BRANDING -->
<text x="50%" y="50%"
      text-anchor="middle"
      font-size="30"
      letter-spacing="5"
      fill="#ffffff"
      opacity="0.9"
      style="font-family: monospace"
      filter="url(#glow)">
  LORDZEFAN
</text>

</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
