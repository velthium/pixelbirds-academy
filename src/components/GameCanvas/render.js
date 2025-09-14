"use client";

/**
 * Renderer for PixelBirds.
 * - Emoji-only sprites (🌱🍓🐛🪵💧🗑️🪟)
 * - Hi-DPI scaling
 * - Cached background gradient
 * - Clean HUD (Forest %, Nest, Trees, Hazards avoided, Combo, Wind)
 * - dispose() to remove the resize listener
 */
export function createRenderer(canvas, { width = 960, height = 720 } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D context not available");

  // ---------- Sizing / DPR ----------
  let dpr = 1;
  let viewW = width;
  let viewH = height;
  let bgGrad = null;

  function resize() {
    dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    viewW = width;
    viewH = height;
    bgGrad = null; // recompute on next clear
  }

  resize();
  const onWinResize = () => resize();
  window.addEventListener("resize", onWinResize);

  // ---------- Helpers ----------
  function ensureBg() {
    if (!bgGrad) {
      bgGrad = ctx.createLinearGradient(0, 0, 0, viewH);
      bgGrad.addColorStop(0, "#cceeff");
      bgGrad.addColorStop(1, "#e6ffe6");
    }
  }

  function drawEmoji(emoji, x, y, px) {
    const prevAlign = ctx.textAlign;
    const prevBase = ctx.textBaseline;
    const prevFont = ctx.font;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${px}px system-ui, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.fillText(emoji, Math.round(x), Math.round(y) + 1);

    ctx.textAlign = prevAlign;
    ctx.textBaseline = prevBase;
    ctx.font = prevFont;
  }

  // ---------- Public drawing API ----------
  function clear() {
    ensureBg();
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, viewW, viewH);
  }

  function drawScene(obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      const size =
        o.type === "glass" ? 24 :
        o.type === "insect" ? 18 :
        22;

      switch (o.type) {
        case "seed":   drawEmoji("🌱", o.x, o.y, size); break;
        case "berry":  drawEmoji("🍓", o.x, o.y, size); break; // or 🫐
        case "insect": drawEmoji("🐛", o.x, o.y, size); break; // or 🐞
        case "twig":   drawEmoji("🪵", o.x, o.y, size); break; // or 🌿
        case "water":  drawEmoji("💧", o.x, o.y, size); break;
        case "glass":  drawEmoji("🪟", o.x, o.y, size); break;
        default:       drawEmoji("🗑️", o.x, o.y, size); break; // "trash"
      }
    }
  }

  // Bird (supports optional tilt: bird.angle in degrees)
  function drawBird(img, bird) {
    const { x, y, w, h, angle = 0 } = bird || {};
    const cx = x + w / 2;
    const cy = y + h / 2;

    ctx.save();
    if (angle) {
      ctx.translate(cx, cy);
      ctx.rotate((angle * Math.PI) / 180);
      if (img && img.complete) ctx.drawImage(img, -w / 2, -h / 2, w, h);
      else { ctx.fillStyle = "gold"; ctx.fillRect(-w / 2, -h / 2, w, h); }
    } else {
      if (img && img.complete) ctx.drawImage(img, x, y, w, h);
      else { ctx.fillStyle = "gold"; ctx.fillRect(x, y, w, h); }
    }
    ctx.restore();
  }

  // HUD with bars and counters
  // stats: { forest(0..100), nest(0..5), trees, trashAvoided, combo, windActive }
  function drawHUD(stats) {
    const {
      forest = 0,
      nest = 0,
      trees = 0,
      trashAvoided = 0,
      combo = 0,
      windActive = false,
    } = stats || {};

    // Forest bar
    const x = 10, y = 10, w = 240, h = 16;
    ctx.fillStyle = "rgba(0,0,0,.15)";
    ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(x, y, Math.max(0, Math.min(w, (forest / 100) * w)), h);

    ctx.fillStyle = "#000";
    ctx.font = "12px Arial";
    ctx.fillText(`Forest ${Math.round(forest)}%`, x + 6, y + 12);

    // Nest segments (5)
    const nx = x, ny = y + 24, segW = 40, segH = 10, gap = 4;
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = "#7c3e12";
      ctx.lineWidth = 2;
      const bx = nx + i * (segW + gap);
      ctx.strokeRect(bx, ny, segW, segH);
      if (i < nest) {
        ctx.fillStyle = "#a16207";
        ctx.fillRect(bx + 1, ny + 1, segW - 2, segH - 2);
      }
    }
    ctx.fillStyle = "#000";
    ctx.fillText(`Nest ${nest}/5`, nx + 5 * segW + 4 * gap + 8, ny + 9);

    // Counters
    ctx.fillText(`Trees 🌳 ${trees}`, x + 280, y + 12);
    ctx.fillText(`Hazards avoided 🧹 ${trashAvoided}`, x + 280, y + 24);

    // Combo & Wind tiny indicators
    if (combo > 0) {
      ctx.fillText(`Combo x${combo}`, x + 480, y + 12);
    }
    if (windActive) {
      ctx.fillText(`🌬️ Wind`, x + 480, y + 24);
    }
  }

  function drawGameOver() {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, viewW, viewH);
    ctx.restore();

    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.fillText("GAME OVER", Math.round(viewW / 2 - 70), Math.round(viewH / 2));
    ctx.font = "14px Arial";
    ctx.fillText(
      "Avoid trash 🗑️ & windows 🪟 — Enter/Space/Tap to restart • Esc to quit",
      Math.round(viewW / 2 - 240),
      Math.round(viewH / 2 + 28)
    );
  }

  // Cleanup
  function dispose() {
    window.removeEventListener("resize", onWinResize);
  }

  return {
    get viewW() { return viewW; },
    get viewH() { return viewH; },
    clear,
    drawScene,
    drawBird,
    drawHUD,
    drawGameOver,
    dispose,
  };
}
