const fs = require("fs");

const WIDTH = 960;
const HEIGHT = 280;
const BASELINE = 150;
const POINTS = 240;
const BARS = 60;

/* ======================
   EQUALIZER (STABLE)
====================== */
function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const pos = i / BARS;

    let minH, maxH, dur;

    // Stereo field
    if (pos < 0.35) {
      minH = 40;
      maxH = 150;
      dur = 3 + Math.random() * 2;
    } else if (pos > 0.65) {
      minH = 20;
      maxH = 80;
      dur = 0.8 + Math.random() * 1;
    } else {
      minH = 30;
      maxH = 120;
      dur = 1.6 + Math.random() * 1.5;
    }

    const opacity = 0.4 + Math.random() * 0.4;

    bars.push(`
<rect x="${i * barWidth}"
      y="${HEIGHT - minH}"
      width="${barWidth - 2}"
      height="${minH}"
      fill="url(#grad)"
      opacity="${opacity}">

  <!-- MAIN HEIGHT -->
  <animate attributeName="height"
    dur="${dur}s"
    repeatCount="indefinite"
    values="${minH};${maxH};${minH}"
    keyTimes="0;0.5;1"
    calcMode="spline"
    keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>

  <!-- LOCK BOTTOM -->
  <animate attributeName="y"
    dur="${dur}s"
    repeatCount="indefinite"
    values="${HEIGHT - minH};${HEIGHT - maxH};${HEIGHT - minH}"
    keyTimes="0;0.5;1"
    calcMode="spline"
    keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>

  <!-- GLITCH (VISUAL ONLY) -->
  <animate attributeName="opacity"
    dur="${(0.3 + Math.random()).toFixed(2)}s"
    values="${opacity};1;${opacity}"
    repeatCount="indefinite"/>
</rect>
`);
  }

  return bars.join("");
}

/* ======================
   TILEABLE WAVE
====================== */
function generateWave(layer) {
  const points = [];
  const amp = [22, 14, 8][layer];
  const freq = [2, 3, 4][layer];
  const phase = Math.random() * Math.PI * 2;

  for (let i = 0; i <= POINTS; i++) {
    const t = i / POINTS;
    const y =
      Math.sin((t * Math.PI * 2 * freq) + phase) * amp +
      Math.sin((t * Math.PI * 4 * freq) + phase * 0.5) * amp * 0.4;

    points.push(BASELINE - y);
  }

  // force seamless
  points[points.length - 1] = points[0];

  return points;
}

function buildPath(points) {
  const step = WIDTH / (points.length - 1);
  let d = `M 0 ${points[0]} `;
  for (let i = 1; i < points.length; i++) {
    const x = i * step;
    const cx = x - step / 2;
    d += `Q ${cx} ${points[i - 1]} ${x} ${points[i]} `;
  }
  return d;
}

/* ======================
   SVG
====================== */
function generateSVG() {
  const waves = [2, 1, 0].map(l => buildPath(generateWave(l)));
  const speeds = ["18s", "10s", "5s"];
  const opacities = [0.18, 0.35, 1];

  const svg = `
<svg viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">

<defs>
  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#ff2fdc"/>
    <stop offset="40%" stop-color="#9b5cff"/>
    <stop offset="70%" stop-color="#00f5ff"/>
    <stop offset="100%" stop-color="#00f5ff"/>
  </linearGradient>

  <filter id="glow">
    <feGaussianBlur stdDeviation="4" result="b"/>
    <feMerge>
      <feMergeNode in="b"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>

<rect width="100%" height="100%" fill="#05010d"/>

<!-- EQUALIZER -->
<g filter="url(#glow)">
${generateBars()}
</g>

<!-- WAVES -->
${waves.map((d, i) => `
<g opacity="${opacities[i]}" ${i === 2 ? 'filter="url(#glow)"' : ""}>
  <path d="${d}" stroke="url(#grad)" stroke-width="${2 + i}" fill="none">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-${WIDTH} 0"
      dur="${speeds[i]}"
      repeatCount="indefinite"/>
  </path>
  <path d="${d}" stroke="url(#grad)" stroke-width="${2 + i}" fill="none"
        transform="translate(${WIDTH},0)">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-${WIDTH} 0"
      dur="${speeds[i]}"
      repeatCount="indefinite"/>
  </path>
</g>`).join("")}

<!-- BRAND -->
<text x="50%" y="52%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="32"
      letter-spacing="6"
      fill="#ffffff"
      opacity="0.85"
      style="font-family: monospace"
      filter="url(#glow)">
  LORDZEFAN
</text>

</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
