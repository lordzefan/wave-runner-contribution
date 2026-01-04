const fs = require("fs");
const axios = require("axios");

const USERNAME = "lordzefan";
const GRAPHQL_URL = "https://api.github.com/graphql";

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

function buildWavePath(data) {
  let x = 0;
  const step = 12;
  let path = "M0 80 ";

  data.slice(-30).forEach(count => {
    const height = 80 - Math.min(count * 6, 50);
    path += `L${x} ${height} `;
    x += step;
  });

  path += `L${x} 100 L0 100 Z`;
  return path;
}

async function generateSVG() {
  const data = await fetchContributions();
  const wavePath = buildWavePath(data);

  const svg = `
<svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wave" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00f5ff"/>
      <stop offset="100%" stop-color="#002233"/>
    </linearGradient>
  </defs>

  <rect width="100%" height="100%" fill="#050b14"/>

  <path d="${wavePath}" fill="url(#wave)">
    <animateTransform
      attributeName="transform"
      type="translate"
      from="0 0"
      to="-12 0"
      dur="2s"
      repeatCount="indefinite" />
  </path>

  <!-- Runner -->
  <g>
    <circle r="4" fill="#ffffff">
      <animateMotion
        dur="4s"
        repeatCount="indefinite"
        path="M0 60 L400 60" />
    </circle>
  </g>
</svg>
`;

  fs.writeFileSync("output.svg", svg.trim());
}

generateSVG();
