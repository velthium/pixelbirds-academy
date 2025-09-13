"use client";

export function createRenderer(canvas, { width = 960, height = 720 } = {}) {
  const ctx = canvas.getContext("2d");

  // Hi-DPI support + crisp pixel art
  function resize() {
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const cssW = width;
    const cssH = height;
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
  resize();
  window.addEventListener("resize", resize);

  // CSS viewport size
  const viewW = width;
  const viewH = height;

  function clear() {
    ctx.clearRect(0, 0, viewW, viewH);
    const g = ctx.createLinearGradient(0, 0, 0, viewH);
    g.addColorStop(0, "#cceeff");
    g.addColorStop(1, "#e6ffe6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, viewW, viewH);
  }

  function drawScene(obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      if (o.type === "seed") {
        ctx.beginPath();
        ctx.arc(o.x, o.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "green";
        ctx.fill();
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(o.x, o.y, o.w, o.h);
      }
    }
  }

  function drawBird(img, bird) {
    if (img && img.complete) {
      ctx.drawImage(img, bird.x, bird.y, bird.w, bird.h);
    } else {
      ctx.fillStyle = "gold";
      ctx.fillRect(bird.x, bird.y, bird.w, bird.h);
    }
  }

  function drawHUD(score) {
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 22);
  }

  function drawGameOver() {
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText("GAME OVER", viewW / 2 - 70, viewH / 2);
    ctx.font = "14px Arial";
    ctx.fillText("Press Enter to restart • Esc to quit", viewW / 2 - 110, viewH / 2 + 28);
  }

  return {
    viewW,
    viewH,
    clear,
    drawScene,
    drawBird,
    drawHUD,
    drawGameOver,
  };
}
