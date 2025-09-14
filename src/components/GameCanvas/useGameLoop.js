"use client";

// No React hooks here — pure utility.
export function createGameLoop({
  canvas,
  nftImageUrl,
  onExit,
  renderer,
  address,    // optional, passed to onGameOver meta
  tokenId,    // optional, passed to onGameOver meta
  onGameOver, // optional callback(finalScore, { address, tokenId })
}) {
  // ------- SFX (Web Audio minimal, sans fichiers) -------
  const audio = { ctx: null, enabled: true };

  function initAudio() {
    if (audio.ctx) return;
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return;
    audio.ctx = new AC();
  }
  function resumeAudio() {
    if (audio.ctx && audio.ctx.state === "suspended") audio.ctx.resume();
  }
  function tone(freq = 440, dur = 0.08, type = "sine", vol = 0.18) {
    if (!audio.enabled || !audio.ctx) return;
    const t = audio.ctx.currentTime;
    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(gain); gain.connect(audio.ctx.destination);
    osc.start(t); osc.stop(t + dur);
  }
  function noise(dur = 0.14, vol = 0.20) {
    if (!audio.enabled || !audio.ctx) return;
    const sr = audio.ctx.sampleRate;
    const len = Math.max(1, Math.floor(sr * dur));
    const buf = audio.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = audio.ctx.createBufferSource();
    src.buffer = buf;
    const g = audio.ctx.createGain();
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.001, audio.ctx.currentTime + dur);
    src.connect(g); g.connect(audio.ctx.destination);
    src.start();
  }
  const sfx = {
    flap() { tone(660, 0.06, "sine", 0.12); },
    seed() { tone(880, 0.05, "square", 0.10); setTimeout(() => tone(1200, 0.06, "square", 0.08), 45); },
    hit()  { noise(0.12, 0.20); setTimeout(() => tone(140, 0.25, "sawtooth", 0.12), 10); },
  };
  // ------------------------------------------------------

  // ------- State -------
  const state = {
    birdY: 200,
    vel: 0,
    speed: 130,     // px/s
    gravity: 900,   // px/s²
    jump: -280,     // px/s
    obstacles: [],
    score: 0,
    gameOver: false,
  };

  // ------- Timers / RAF -------
  const timers = {
    spawnTimer: 0,
    spawnInterval: 900, // ms
    elapsed: 0,
    last: 0,
    raf: 0,
    running: false,
    attached: false,    // listeners attached once
  };

  // ------- Asset (bird image) -------
  const birdImg = new Image();
  birdImg.crossOrigin = "anonymous";
  birdImg.src = nftImageUrl || "";

  // ------- Core helpers -------
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

  // ------- Inputs -------
  function handleKeyDown(e) {
    if (e.code === "Escape" && onExit) onExit();

    // M = mute toggle (optionnel)
    if (e.code === "KeyM") { audio.enabled = !audio.enabled; return; }

    if (state.gameOver) {
      // Allow restart after Game Over
      if (e.code === "Enter" || e.code === "Space") {
        e.preventDefault();
        initAudio(); resumeAudio();
        restart();
      }
      return;
    }

    if (e.code === "Space") {
      e.preventDefault();
      initAudio(); resumeAudio();
      state.vel = state.jump;
      sfx.flap();
    }
  }

  function handlePointerDown() {
    initAudio(); resumeAudio();
    if (state.gameOver) {
      restart();
      return;
    }
    state.vel = state.jump;
    sfx.flap();
  }

  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (!timers.running && !state.gameOver) start();
  }

  // ------- Game loop -------
  function loop(now) {
    if (!timers.running) return;

    // dt (clamped)
    const dtMs = now - timers.last;
    timers.last = now;
    const dt = Math.min(0.033, dtMs / 1000);

    timers.elapsed += dtMs;
    timers.spawnTimer += dtMs;

    // difficulty scaling
    if (timers.elapsed % 2000 < dtMs) {
      state.speed = Math.min(state.speed + 6, 300);
      timers.spawnInterval = Math.max(timers.spawnInterval - 12, 500);
    }

    // physics
    state.vel += state.gravity * dt;
    state.birdY += state.vel * dt;

    // spawn
    if (timers.spawnTimer >= timers.spawnInterval) {
      timers.spawnTimer = 0;
      spawnObstacle(renderer.viewH);
    }

    // move obstacles
    const step = state.speed * dt;
    for (let i = 0; i < state.obstacles.length; i++) state.obstacles[i].x -= step;
    state.obstacles = state.obstacles.filter((o) => o.x > -40);

    // collisions + scoring
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
          sfx.seed(); // 🔊 son de collecte
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

    // draw
    renderer.clear();
    renderer.drawScene(state.obstacles);
    renderer.drawBird(birdImg, bird);
    renderer.drawHUD(state.score);

    if (hitTrash) {
      sfx.hit(); // 🔊 son d'impact / game over
      renderer.drawGameOver();
      state.gameOver = true;
      const finalScore = state.score;
      // fire callback without blocking the frame
      queueMicrotask(() => onGameOver?.(finalScore, { address, tokenId }));
      stop(); // keep listeners so Enter/Click can restart
      return;
    }

    timers.raf = requestAnimationFrame(loop);
  }

  // ------- Lifecycle -------
  function start() {
    // attach listeners once
    if (!timers.attached) {
      window.addEventListener("keydown", handleKeyDown, { passive: false });
      canvas.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("visibilitychange", onVisibilityChange);
      timers.attached = true;
    }
    if (timers.running) return;
    timers.running = true;

    timers.last = performance.now();
    timers.raf = requestAnimationFrame(loop);
  }

  function stop() {
    timers.running = false;
    if (timers.raf) cancelAnimationFrame(timers.raf);
    timers.raf = 0;
    // Do NOT remove listeners here (so restart works after Game Over)
  }

  // detach everything on unmount
  function dispose() {
    if (timers.attached) {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      timers.attached = false;
    }
    stop();
  }

  return { start: restart, stop, dispose };
}
