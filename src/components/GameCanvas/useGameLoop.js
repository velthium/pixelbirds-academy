"use client";

// Utility function (no hooks here)
export function createGameLoop({ canvas, nftImageUrl, onExit, renderer }) {
  // Game state (plain objects)
  const state = {
    birdY: 200,
    vel: 0,
    speed: 130,       // px/s
    gravity: 900,     // px/s²
    jump: -280,       // px/s
    obstacles: [],
    score: 0,
    gameOver: false,
  };

  // Timers / delta tracking
  const timers = {
    spawnTimer: 0,
    spawnInterval: 900, // ms
    elapsed: 0,
    last: 0,
    raf: 0,
    running: false,
  };

  // Assets
  const birdImg = new Image();
  birdImg.crossOrigin = "anonymous";
  birdImg.src = nftImageUrl || "";

  function restart() {
    state.birdY = 200;
    state.vel = 0;
    state.speed = 130;
    state.gravity = 900;
    state.jump = -280;
    state.obstacles.length = 0;
    state.score = 0;
    state.gameOver = false;

    timers.spawnTimer = 0;
    timers.spawnInterval = 900;
    timers.elapsed = 0;

    start();
  }

  function spawnObstacle(h) {
    const type = Math.random() < 0.7 ? "seed" : "trash";
    const y = Math.max(8, Math.random() * (h - 24));
    state.obstacles.push({ x: renderer.viewW + 16, y, w: 16, h: 16, type });
    if (state.obstacles.length > 200) state.obstacles.splice(0, 50);
  }

  function handleKeyDown(e) {
    if (e.code === "Space") {
      e.preventDefault();
      if (!state.gameOver) state.vel = state.jump;
    }
    if (e.code === "Enter" && state.gameOver) restart();
    if (e.code === "Escape" && onExit) onExit();
  }

  function handlePointerDown() {
    if (!state.gameOver) state.vel = state.jump;
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (!timers.running && !state.gameOver) start();
  }

  function loop(now) {
    if (!timers.running) return;

    const dtMs = now - timers.last;
    timers.last = now;
    const dt = Math.min(0.033, dtMs / 1000);

    timers.elapsed += dtMs;
    timers.spawnTimer += dtMs;

    // Progressive difficulty
    if (timers.elapsed % 2000 < dtMs) {
      state.speed = Math.min(state.speed + 6, 300);
      timers.spawnInterval = Math.max(timers.spawnInterval - 12, 500);
    }

    // Physics
    state.vel += state.gravity * dt;
    state.birdY += state.vel * dt;

    // Spawn obstacles
    if (timers.spawnTimer >= timers.spawnInterval) {
      timers.spawnTimer = 0;
      spawnObstacle(renderer.viewH);
    }

    // Move obstacles
    const step = state.speed * dt;
    for (let i = 0; i < state.obstacles.length; i++) state.obstacles[i].x -= step;
    state.obstacles = state.obstacles.filter((o) => o.x > -40);

    // Collision and scoring
    const bird = { x: 80, y: state.birdY, w: 40, h: 40 };
    let hitTrash = false;
    let collected = 0;

    for (let i = 0; i < state.obstacles.length; i++) {
      const o = state.obstacles[i];
      const hitX = o.x < bird.x + bird.w && o.x + o.w > bird.x;
      const hitY = bird.y < o.y + o.h && bird.y + bird.h > o.y;
      if (hitX && hitY) {
        if (o.type === "seed") {
          collected++;
          state.obstacles.splice(i, 1);
          i--;
        } else {
          hitTrash = true;
          break;
        }
      }
    }

    if (collected) state.score += 10 * collected;
    if (bird.y > renderer.viewH - bird.h || bird.y < 0) hitTrash = true;

    // Draw frame
    renderer.clear();
    renderer.drawScene(state.obstacles);
    renderer.drawBird(birdImg, bird);
    renderer.drawHUD(state.score);

    if (hitTrash) {
      renderer.drawGameOver();
      state.gameOver = true;
      stop();
      return;
    }

    timers.raf = requestAnimationFrame(loop);
  }

  function start() {
    if (timers.running) return;
    timers.running = true;

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("visibilitychange", onVisibilityChange);

    timers.last = performance.now();
    timers.raf = requestAnimationFrame(loop);
  }

  function stop() {
    timers.running = false;
    if (timers.raf) cancelAnimationFrame(timers.raf);
    timers.raf = 0;

    window.removeEventListener("keydown", handleKeyDown);
    canvas.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }

  return { start: restart, stop };
}
