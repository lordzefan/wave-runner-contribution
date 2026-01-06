function generateBars() {
  const bars = [];
  const barWidth = WIDTH / BARS;

  for (let i = 0; i < BARS; i++) {

    const pos = i / BARS;
    let minH, midH, maxH, baseDur, chaos;

    /* ======================
       STEREO BEHAVIOR
    ====================== */
    if (pos < 0.35) {
      // LEFT – BASS
      minH = 30 + Math.random() * 20;
      midH = minH + Math.random() * 50;
      maxH = midH + Math.random() * 90;
      baseDur = 2.5 + Math.random() * 2.5;
      chaos = 0.6;
    } else if (pos > 0.65) {
      // RIGHT – TREBLE
      minH = 10 + Math.random() * 15;
      midH = minH + Math.random() * 35;
      maxH = midH + Math.random() * 55;
      baseDur = 0.6 + Math.random() * 1.2;
      chaos = 1.2;
    } else {
      // CENTER – MIX
      minH = 20 + Math.random() * 15;
      midH = minH + Math.random() * 40;
      maxH = midH + Math.random() * 70;
      baseDur = 1.2 + Math.random() * 2;
      chaos = 1;
    }

    const yMin = HEIGHT - minH;
    const yMid = HEIGHT - midH;
    const yMax = HEIGHT - maxH;

    const opacity = 0.3 + Math.random() * 0.5;

    /* ======================
       GLITCH PARAM
    ====================== */
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

        <!-- MAIN HEIGHT -->
        <animate attributeName="height"
          dur="${baseDur}s"
          repeatCount="indefinite"
          values="${minH};${maxH};${midH};${maxH * chaos};${minH}"
          keyTimes="0;0.2;0.45;0.7;1"
          calcMode="spline"
          keySplines="
            0.8 0.2 0.2 1;
            0.2 0.8 0.4 1;
            0.9 0.1 0.1 0.9;
            0.1 0.9 0.9 0.1
          " />

        <!-- MAIN Y -->
        <animate attributeName="y"
          dur="${baseDur}s"
          repeatCount="indefinite"
          values="${yMin};${yMax};${yMid};${HEIGHT - maxH * chaos};${yMin}"
          keyTimes="0;0.2;0.45;0.7;1"
          calcMode="spline"
          keySplines="
            0.8 0.2 0.2 1;
            0.2 0.8 0.4 1;
            0.9 0.1 0.1 0.9;
            0.1 0.9 0.9 0.1
          " />

        <!-- GLITCH SPIKE HEIGHT -->
        <animate attributeName="height"
          begin="${glitchDelay}s"
          dur="${glitchDur}s"
          values="${minH};${glitchHeight};${minH}"
          repeatCount="indefinite" />

        <!-- GLITCH SPIKE Y -->
        <animate attributeName="y"
          begin="${glitchDelay}s"
          dur="${glitchDur}s"
          values="${yMin};${glitchY};${yMin}"
          repeatCount="indefinite" />

        <!-- GLITCH FLICKER -->
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
