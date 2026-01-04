const fs = require("fs");
const axios = require("axios");

const USERNAME = "lordzefan";
const GRAPHQL_URL = "https://api.github.com/graphql";

/* =======================
   FETCH CONTRIBUTIONS
======================= */
async function fetchContributions() {
  const res = await axios.post(
    GRAPHQL_URL,
    {
      query: `
      query {
        user(login: "${USERNAME}") {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
      `
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    }
  );

  return res.data.data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap(w => w.contributionDays)
    .map(d => d.contributionCount);
}

/* =======================
   BUILD SMOOTH WAVE PATH
======================= */
function buildWavePath(data) {
  const points = data.slice(-90); // AMBIL 90 HARI
  let x = 0;
  const step = 8;

  let path = "M0 90 ";

  for (let i = 0; i < points.length; i++) {
    const c = Math.min(points[i], 10); // clamp
    const y = 90 - (c * c * 0.7);      // non-linear height
    const cx = x + step / 2;

    path += `Q ${cx} ${y} ${x + step} ${y} `;
    x += step;
  }

  path += `L${x} 120 L0 120 Z`;
  return { path, width: x };
}

/* =======================
   GENERATE SVG
======================= */
async function generateSVG() {
  const data = await fetchContributions();
  const { path: wavePath, width } = buildWavePath(data);

  const svg = `
<svg viewBox="0 0 ${width} 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00f5ff"/>
      <stop offset="100%" stop-color="#003344"/>
    </linearGradient>

    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="#050b14"/>

  <!-- Wave -->
  <path id="wavePath" d="${wavePath}" fill="url(#waveGradient)">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-8 0"
      dur="2.5s"
      repeatCount="indefinite" />
  </path>

  <!-- Invisible path for runner -->
  <path id="runnerPath" d="${wavePath}" fill="none"/>

  <!-- Runner -->
  <g filter="url(#glow)">
    <circle r="4" fill="#ffffff">
      <animateMotion
        dur="5s"
        repeatCount="indefinite"
        rotate="auto">
        <mpath href="#runnerPath"/>
      </animateMotion>
    </circle>
  </g>
</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
