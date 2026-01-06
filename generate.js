const fs = require("fs");

const WIDTH = 960;
const HEIGHT = 280;

/* ===== SAFE ZONES ===== */
const EQ_BASE = HEIGHT;
const EQ_MAX_HEIGHT = 110;

const BASELINE = 140;
const POINTS = 220;
const BARS = 60;

/* ======================
   EQUALIZER (CLAMPED)
====================== */
function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const pos = i / BARS;

    let minH, maxH, dur;

    if (pos < 0.35) {
      minH = 30;
      maxH = 90;
      dur = 3 + Math.random() * 2;
    } else if (pos > 0.65) {
      minH = 15;
      maxH = 60;
      dur = 0.8 + Math.random();
    } else {
      minH = 22;
      maxH = 80;
      dur = 1.6 + Math.random() * 1.4;
    }

    maxH = Math.min(maxH, EQ_MAX_HEIGHT);

    const opacity = 0.4 + Math.random() * 0.4;

    bars.push(`
<rect x="${i * barWidth}"
      y="${EQ_BASE - minH}"
      width="${barWidth - 2}"
      height="${minH}"
      fill="url(#grad)"
      opacity="${opacity}">
  <animate attributeName="height"
    dur="${dur}s"
    repeatCount="indefinite"
    values="${minH};${maxH};${minH}"
    keyTimes="0;0.5;1"
    calcMode="spline"
    keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
  <animate attributeName="y"
    dur="${dur}s"
    repeatCount="indefinite"
    values="${EQ_BASE - minH};${EQ_BASE - maxH};${EQ_BASE - minH}"
    keyTimes="0;0.5;1"
    calcMode="spline"
    keySplines="0.4 0 0.6 1;0.4 0 0.6 1"/>
</rect>
`);
  }

  return bars.join("");
}

/* ======================
   STATIC WAVE PATH
====================== */
function buildWavePath(amplitude) {
  const pts = [];
  for (let i = 0; i <= POINTS; i++) {
    const t = i / POINTS;
    const y =
      Math.sin(t * Math.PI * 2) * amplitude +
      Math.sin(t * Math.PI * 6) * amplitude * 0.35;
    pts.push(BASELINE - y);
  }

  const step = WIDTH / POINTS;
  let d = `M 0 ${pts[0]} `;
  for (let i = 1; i < pts.length; i++) {
    const x = i * step;
    const cx = x - step / 2;
    d += `Q ${cx} ${pts[i - 1]} ${x} ${pts[i]} `;
  }

  return d;
}

/* ======================
   SVG
====================== */
function generateSVG() {
  const waves = [
    { amp: 18, dur: "6s", opacity: 0.18, glow: false },
    { amp: 12, dur: "4s", opacity: 0.35, glow: false },
    { amp: 8,  dur: "2.8s", opacity: 1, glow: true }
  ];

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

<!-- VERTICAL WAVES -->
${waves.map(w => `
<g opacity="${w.opacity}" ${w.glow ? 'filter="url(#glow)"' : ""}>
  <path d="${buildWavePath(w.amp)}"
        stroke="url(#grad)"
        stroke-width="${w.amp > 10 ? 3 : 4}"
        fill="none">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 -6"
      to="0 6"
      dur="${w.dur}"
      repeatCount="indefinite"
      direction="alternate"/>
  </path>
</g>`).join("")}

<!-- BRAND -->
<text x="50%" y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="32"
      letter-spacing="6"
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
