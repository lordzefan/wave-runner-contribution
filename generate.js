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
    const midH = minH + Math.random() * 40;
    const maxH = midH + Math.random() * 60;

    const dur = (0.3 + Math.random() * 0.9).toFixed(2);
    const baseDur = 1.2 + Math.random() * 2.5;

    const yMin = HEIGHT - minH;
    const yMid = HEIGHT - midH;
    const yMax = HEIGHT - maxH;

    bars.push(`
      <rect x="${i * barWidth}"
            y="${yMin}"
            width="${barWidth - 2}"
            height="${minH}"
            fill="url(#grad)"
            opacity="${0.35 + Math.random() * 0.45}">

        <!-- HEIGHT -->
        <animate attributeName="height"
                 dur="${dur}s"
                 repeatCount="indefinite"
                 values="${minH};${maxH};${minH}" />
          dur="${baseDur}s"
          repeatCount="indefinite"
          values="${minH};${maxH};${midH};${maxH};${minH}"
          keyTimes="0;0.2;0.5;0.7;1"
          calcMode="spline"
          keySplines="
            0.9 0.1 0.1 0.9;
            0.2 0.8 0.3 1;
            0.8 0 0.2 1;
            0.1 0.9 0.9 0.1
          " />

        <!-- Y -->
        <animate attributeName="y"
                 dur="${dur}s"
                 repeatCount="indefinite"
                 values="${yMin};${yMax};${yMin}" />
          dur="${baseDur}s"
          repeatCount="indefinite"
          values="${yMin};${yMax};${yMid};${yMax};${yMin}"
          keyTimes="0;0.2;0.5;0.7;1"
          calcMode="spline"
          keySplines="
            0.9 0.1 0.1 0.9;
            0.2 0.8 0.3 1;
            0.8 0 0.2 1;
            0.1 0.9 0.9 0.1
          " />
      </rect>
    `);
  }

  return bars.join("");
