const fs = require("fs");

const WIDTH = 960;
const HEIGHT = 280;
const BASELINE = 150;
const POINTS = 200;
const BARS = 60;

/* ======================
   EQUALIZER BARS
====================== */
function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const pos = i / BARS;
    let minH, midH, maxH, baseDur, chaos;

    // STEREO FIELD
    if (pos < 0.35) {
      minH = 40 + Math.random() * 20;
      midH = minH + Math.random() * 60;
      maxH = midH + Math.random() * 100;
      baseDur = 2.5 + Math.random() * 2;
      chaos = 0.6;
    } else if (pos > 0.65) {
      minH = 15 + Math.random() * 15;
      midH = minH + Math.random() * 40;
      maxH = midH + Math.random() * 60;
      baseDur = 0.6 + Math.random() * 1.2;
      chaos = 1.3;
    } else {
      minH = 25 + Math.random() * 20;
      midH = minH + Math.random() * 50;
      maxH = midH + Math.random() * 80;
      baseDur = 1.2 + Math.random() * 2;
      chaos = 1;
    }

    const yMin = HEIGHT - minH;
    const yMid = HEIGHT - midH;
    const yMax = HEIGHT - maxH;

    const opacity = 0.35 + Math.random() * 0.5;

    // GLITCH
    const glitchHeight = maxH * (1.4 + Math.random() * 0.6);
    const glitchY = HEIGHT - glitchHeight;
    const glitchDelay = (Math.random() * baseDur).toFixed(2);
    const glitchDur = (0.08 + Math.random() * 0.15).toFixed(2);

    bars.push(`
<rect x="${i * barWidth}"
      y="${yMin}"
      width="${barWidth - 2}"
      height="${minH}"
      fill="url(#grad)"
      opacity="${opacity}">

  <animate attributeName="height"
    dur="${baseDur}s"
    repeatCount="indefinite"
    values="${minH};${maxH};${midH};${maxH * chaos};${minH}" />

  <animate attributeName="y"
    dur="${baseDur}s"
    repeatCount="indefinite"
    values="${yMin};${yMax};${yMid};${HEIGHT - maxH * chaos};${yMin}" />

  <animate attributeName="height"
    begin="${glitchDelay}s"
    dur="${glitchDur}s"
    values="${minH};${glitchHeight};${minH}"
    repeatCount="indefinite" />

  <animate attributeName="y"
    begin="${glitchDelay}s"
    dur="${glitchDur}s"
    values="${yMin};${glitchY};${yMin}"
    repeatCount="indefinite" />

  <animate attributeName="opacity"
    begin="${glitchDelay}s"
    dur="${glitchDur}s"
    values="${opacity};1;${opacity}"
    repeatCount="indefinite" />
</rect>
`);
  }

  return bars.join("");
}

/* ======================
   WAVES
====================== */
function generateWave(layer) {
  const points = [];
  const phase = Math.random() * Math.PI * 2;
  const depth = 1 - layer * 0.25;

  for (let i = 0; i < POINTS; i++) {
    const t = i / POINTS;
    const y =
      Math.sin(t * Math.PI * 2 + phase) * 28 +
      Math.sin(t * Math.PI * (6 + layer * 2) + phase * 0.6) * 14 +
      Math.sin(t * Math.PI * (12 + layer * 3)) * 6;

    points.push(BASELINE - y * depth);
  }

  return points;
}

function buildPath(points) {
  const step = WIDTH / (points.length - 1);
  let d = `M 0 ${points[0]} `;
  for (let i = 1; i < points.length; i++) {
    const x = i * step;
    const cx = (x + (i - 1) * step) / 2;
    d += `Q ${cx} ${points[i - 1]} ${x} ${points[i]} `;
  }
  return d;
}

/* ======================
   SVG BUILD
====================== */
function generateSVG() {
  const waveBack = buildPath(generateWave(2));
  const waveMid = buildPath(generateWave(1));
  const waveFront = buildPath(generateWave(0));

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

<!-- PARALLAX WAVES -->
${["14s","8s","4s"].map((dur,i)=>`
<g opacity="${[0.18,0.35,1][i]}" ${i===2?'filter="url(#glow)"':''}>
  <path d="${[waveBack,waveMid,waveFront][i]}"
        stroke="url(#grad)"
        stroke-width="${2+i}"
        fill="none">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-${WIDTH} 0"
      dur="${dur}"
      repeatCount="indefinite"/>
  </path>
  <path d="${[waveBack,waveMid,waveFront][i]}"
        stroke="url(#grad)"
        stroke-width="${2+i}"
        fill="none"
        transform="translate(${WIDTH},0)">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-${WIDTH} 0"
      dur="${dur}"
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
  <animate attributeName="opacity"
           values="0.6;1;0.6"
           dur="2.5s"
           repeatCount="indefinite"/>
</text>

</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
