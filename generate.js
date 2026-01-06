const fs = require("fs");

/* ======================
   CANVAS CONFIG
====================== */
const WIDTH = 960;
const HEIGHT = 280;
const BASELINE = 140;
const POINTS = 200;
const BARS = 60;

/* ======================
   GLOBAL SPEED CONTROL
   (SEMakin besar = semakin pelan)
====================== */
const GLOBAL_SPEED = 1.6;

/* ======================
   PARALLAX WAVE
====================== */
function generateWave(layer) {
  const points = [];
  const phase = Math.random() * Math.PI * 2;
  const depth = 1 - layer * 0.25;

  for (let i = 0; i < POINTS; i++) {
    const t = i / POINTS;

    const noise =
      Math.sin(t * Math.PI * 2 + phase) * 28 +
      Math.sin(t * Math.PI * (6 + layer * 2) + phase * 0.7) * 14 +
      Math.sin(t * Math.PI * (12 + layer * 3)) * 6;

    points.push(BASELINE - noise * depth);
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

/* ======================
   STEREO + CHAOTIC + GLITCH EQUALIZER (SLOWED)
====================== */
function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {
    const pos = i / BARS;
    let minH, midH, maxH, baseDur, chaos;

    if (pos < 0.35) {
      // LEFT – BASS
      minH = 28 + Math.random() * 15;
      midH = minH + Math.random() * 30;
      maxH = midH + Math.random() * 45;
      baseDur = 4.5 + Math.random() * 3.5;
      chaos = 0.5;

    } else if (pos > 0.65) {
      // RIGHT – TREBLE
      minH = 14 + Math.random() * 12;
      midH = minH + Math.random() * 22;
      maxH = midH + Math.random() * 32;
      baseDur = 2.4 + Math.random() * 2.2;
      chaos = 1.0;

    } else {
      // CENTER – MIX
      minH = 18 + Math.random() * 12;
      midH = minH + Math.random() * 26;
      maxH = midH + Math.random() * 40;
      baseDur = 3.6 + Math.random() * 3;
      chaos = 0.85;
    }

    /* ======================
       FINAL SPEED (PER BAR)
    ====================== */
    const speedVariance = 0.85 + Math.random() * 0.3;
    const finalDur = (baseDur * speedVariance * GLOBAL_SPEED).toFixed(2);

    const yMin = HEIGHT - minH;
    const yMid = HEIGHT - midH;
    const yMax = HEIGHT - maxH;

    const opacity = 0.3 + Math.random() * 0.5;

    // Glitch (lebih jarang & singkat)
    const glitchHeight = maxH * (1.1 + Math.random() * 0.2);
    const glitchY = HEIGHT - glitchHeight;
    const glitchDelay = (Math.random() * finalDur * 1.2).toFixed(2);
    const glitchDur = (0.05 + Math.random() * 0.08).toFixed(2);

    bars.push(`
      <rect x="${i * barWidth}"
            y="${yMin}"
            width="${barWidth - 2}"
            height="${minH}"
            fill="url(#grad)"
            opacity="${opacity}">

        <animate attributeName="height"
          dur="${finalDur}s"
          repeatCount="indefinite"
          values="${minH};${maxH};${midH};${maxH * chaos};${minH}"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          keySplines="
            0.4 0 0.2 1;
            0.4 0 0.2 1;
            0.4 0 0.2 1;
            0.4 0 0.2 1
          " />

        <animate attributeName="y"
          dur="${finalDur}s"
          repeatCount="indefinite"
          values="${yMin};${yMax};${yMid};${HEIGHT - maxH * chaos};${yMin}"
          keyTimes="0;0.25;0.5;0.75;1"
          calcMode="spline"
          keySplines="
            0.4 0 0.2 1;
            0.4 0 0.2 1;
            0.4 0 0.2 1;
            0.4 0 0.2 1
          " />

        <!-- GLITCH -->
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
   SVG OUTPUT
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

  <pattern id="scanline" width="4" height="4">
    <rect width="4" height="1" fill="rgba(255,255,255,0.05)"/>
  </pattern>
</defs>

<rect width="100%" height="100%" fill="#05010d"/>
<rect width="100%" height="100%" fill="url(#scanline)"/>

<g filter="url(#glow)">
  ${generateBars()}
</g>

<path d="${waveBack}" stroke="url(#grad)" stroke-width="2"
      opacity="0.18" fill="none">
  <animateTransform type="translate" from="0 0" to="-40 0"
    dur="9s" repeatCount="indefinite"/>
</path>

<path d="${waveMid}" stroke="url(#grad)" stroke-width="3"
      opacity="0.35" fill="none">
  <animateTransform type="translate" from="0 0" to="-22 0"
    dur="5.5s" repeatCount="indefinite"/>
</path>

<g filter="url(#glow)">
  <path d="${waveFront}" stroke="url(#grad)" stroke-width="4"
        fill="none">
    <animateTransform type="translate" from="0 0" to="-10 0"
      dur="3s" repeatCount="indefinite"/>
  </path>
</g>

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
