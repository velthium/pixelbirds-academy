"use client";

// No React hooks here — pure utility.
export function createGameLoop({
  canvas,
  nftImageUrl,
  onExit,
  renderer,
  address,     // optional (meta in onGameOver)
  tokenId,     // optional (meta in onGameOver)
  onGameOver,  // optional callback(finalStats, { address, tokenId })
}) {
  // ---------- SFX (Web Audio, zero assets) ----------
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
    flap()    { tone(660, 0.06, "sine", 0.12); },
    collect() { tone(880, 0.05, "square", 0.10); setTimeout(() => tone(1200, 0.06, "square", 0.08), 45); },
    hit()     { noise(0.12, 0.20); setTimeout(() => tone(140, 0.25, "sawtooth", 0.12), 10); },
  };
  // ---------------------------------------------------

  // ---------- Difficulty helpers ----------
  function computeDifficulty({ elapsedMs, trees }) {
    // 0 → 1 en ~90s + bonus par arbres
    const t = Math.min(1, elapsedMs / 90000);   // temps
    const a = Math.min(1, trees * 0.08);        // chaque arbre +0.08 (≈ +12 arbres → cap)
    // courbe douce
    return Math.min(1, t * 0.8 + a * 0.6);
  }
  const BASE_SPEED = 130;
  const MAX_BONUS  = 170; // BASE+MAX ≈ 300

  // ---------- State ----------
  const state = {
    birdY: 200,
    vel: 0,
    speed: BASE_SPEED,
    gravity: 900,    // px/s²
    jump: -280,      // px/s
    obstacles: [],
    gameOver: false,

    // Eco-stats
    forest: 0,         // 0..100 (%)
    trees: 0,          // +1 lorsque forest dépasse 100
    nest: 0,           // 0..5 (segments de nid)
    eggs: 0,           // +1 quand un nid est complété (5 brindilles)
    trashAvoided: 0,   // déchets/vitres passés sans collision

    // Dynamics
    combo: 0,          // 0..5
    windY: 0,          // px/s appliqué au piaf
  };

  // ---------- Timers / RAF ----------
  const timers = {
    spawnTimer: 0,
    spawnInterval: 900, // ms (réévalué à chaque frame)
    elapsed: 0,
    last: 0,
    raf: 0,
    running: false,
    attached: false,

    // events
    windT: 0,   // restant ms rafale
    waveT: 0,   // restant ms vague de vitres
    comboT: 0,  // restant ms avant decay combo
  };

  // ---------- Asset (bird image) ----------
  const birdImg = new Image();
  birdImg.crossOrigin = "anonymous";
  birdImg.src = nftImageUrl || "";

  // ---------- Spawning ----------
  function spawnObstacle(h, diff) {
    // poids dynamiques selon difficulté (plus de dangers quand diff↑)
    const weights = {
      seed:   Math.max(0.12, 0.28 - 0.10 * diff),
      berry:  Math.max(0.08,  0.16 - 0.05 * diff),
      insect: Math.max(0.08,  0.12 - 0.02 * diff),
      twig:   Math.max(0.08,  0.14 - 0.04 * diff),
      water:  0.10,
      trash:  0.14 + 0.15 * diff,
      glass:  0.06 + 0.16 * diff,
    };
    const entries = Object.entries(weights);
    const total = entries.reduce((s,[,v]) => s + v, 0);
    let r = Math.random() * total, pick = "trash";
    for (const [k, v] of entries) { if ((r -= v) <= 0) { pick = k; break; } }

    const y = Math.max(12, Math.random() * (h - 24));
    const w = pick === "glass" ? 22 : (pick === "insect" ? 16 : 18);
    state.obstacles.push({ x: renderer.viewW + 16, y, w, h: w, type: pick });
    if (state.obstacles.length > 200) state.obstacles.splice(0, 50);

    // chance de déclencher une vague de vitres quand c'est dur
    if (diff > 0.6 && timers.waveT <= 0 && Math.random() < 0.08) {
      timers.waveT = 2500; // 2.5s de “pattern vitres”
    }
  }

  // ---------- Inputs ----------
  function handleKeyDown(e) {
    if (e.code === "Escape" && onExit) onExit();
    if (e.code === "KeyM") { audio.enabled = !audio.enabled; return; }

    if (state.gameOver) {
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
    if (state.gameOver) { restart(); return; }
    state.vel = state.jump;
    sfx.flap();
  }
  function onVisibilityChange() {
    if (document.hidden) stop();
    else if (!timers.running && !state.gameOver) start();
  }

  // ---------- Core helpers ----------
  function restart() {
    state.birdY = 200;
    state.vel = 0;
    state.speed = BASE_SPEED;
    state.obstacles.length = 0;
    state.gameOver = false;

    // progression de manche
    state.forest = 0;
    state.nest = 0;

    // dynamics
    state.combo = 0;
    state.windY = 0;

    timers.spawnTimer = 0;
    timers.spawnInterval = 900;
    timers.elapsed = 0;

    timers.windT = 0;
    timers.waveT = 0;
    timers.comboT = 0;

    start();
  }

  // ---------- Game loop ----------
  function loop(now) {
    if (!timers.running) return;

    const dtMs = now - timers.last;
    timers.last = now;
    const dt = Math.min(0.033, dtMs / 1000);

    timers.elapsed += dtMs;
    timers.spawnTimer += dtMs;

    // difficulté (temps + arbres) + “spicy” via combo
    const diff = computeDifficulty({ elapsedMs: timers.elapsed, trees: state.trees });
    const spicy = Math.min(0.3, 0.05 * state.combo); // combo up to +0.25..0.30
    const effDiff = Math.min(1, diff + spicy);

    // vitesse/cadence pilotées par la difficulté
    state.speed = BASE_SPEED + MAX_BONUS * effDiff;        // 130 → ~300
    timers.spawnInterval = Math.round(900 - 400 * effDiff); // 900ms → 500ms

    // Physique
    state.vel += state.gravity * dt;
    state.birdY += state.vel * dt;

    // Rafales de vent (micros-événements)
    if (timers.windT <= 0 && Math.random() < 0.0015 * (1 + 2 * effDiff)) {
      timers.windT = 800 + Math.random() * 900; // 0.8s–1.7s
      state.windY = (Math.random() < 0.5 ? -1 : 1) * (40 + 120 * effDiff); // -/+ 40..160 px/s
    }
    if (timers.windT > 0) {
      state.birdY += state.windY * dt;
      timers.windT -= dtMs;
    } else {
      state.windY *= (1 - Math.min(1, 4 * dt)); // amorti
    }

    // Spawn normal
    if (timers.spawnTimer >= timers.spawnInterval) {
      timers.spawnTimer = 0;
      spawnObstacle(renderer.viewH, effDiff);
    }
    // Vague de vitres
    if (timers.waveT > 0) {
      timers.waveT -= dtMs;
      if (Math.random() < 0.20) {
        const y = Math.max(12, Math.random() * (renderer.viewH - 24));
        state.obstacles.push({ x: renderer.viewW + 16, y, w: 22, h: 22, type: "glass" });
      }
    }

    // Déplacement obstacles
    const step = state.speed * dt;
    for (let i = 0; i < state.obstacles.length; i++) state.obstacles[i].x -= step;

    // Collisions & effets
    const bird = { x: 80, y: state.birdY, w: 40, h: 40 };
    let hitTrash = false;

    const next = [];
    for (let i = 0; i < state.obstacles.length; i++) {
      const o = state.obstacles[i];

      // Sorti d'écran → “hazard avoided” si déchet/vitre
      if (o.x < -40) {
        if (o.type === "trash" || o.type === "glass") state.trashAvoided++;
        continue;
      }

      const hitX = o.x < bird.x + bird.w && o.x + o.w > bird.x;
      const hitY = bird.y < o.y + o.h && bird.y + bird.h > o.y;

      if (hitX && hitY) {
        switch (o.type) {
          case "seed":
          case "berry":
          case "insect":
          case "twig":
          case "water": {
            sfx.collect();
            // combo
            state.combo = Math.min(5, state.combo + 1);
            timers.comboT = 2500; // 2.5s pour en reprendre

            const comboMult = 1 + 0.15 * state.combo; // 1x → 1.75x
            if (o.type === "seed")   state.forest = Math.min(100, state.forest + Math.round(6 * comboMult));
            if (o.type === "berry")  state.forest = Math.min(100, state.forest + Math.round(4 * comboMult));
            if (o.type === "insect") state.forest = Math.min(100, state.forest + Math.round(3 * comboMult));
            if (o.type === "water")  state.forest = Math.min(100, state.forest + Math.round(2 * comboMult));
            if (o.type === "twig")   {
              state.nest = Math.min(5, state.nest + 1);
              if (state.nest === 5) { state.eggs++; state.nest = 0; }
            }
            break;
          }
          case "trash":
          case "glass":
          default:
            hitTrash = true;
            break;
        }
        continue; // on ne réinsère pas l’objet collecté/impacté
      }

      next.push(o);
    }
    state.obstacles = next;

    // Decay combo
    if (state.combo > 0) {
      timers.comboT -= dtMs;
      if (timers.comboT <= 0) {
        state.combo -= 1;
        timers.comboT = 800; // step decay
      }
    }

    // Boucle forêt → +1 arbre
    if (state.forest >= 100) {
      state.forest -= 100;
      state.trees += 1;
    }

    // Bords = mort
    if (bird.y > renderer.viewH - bird.h || bird.y < 0) hitTrash = true;

    // Tilt visuel de l'oiseau (optionnel)
    const angle = Math.max(-20, Math.min(45, state.vel * 0.06)); // dépend de la vitesse verticale

    // Rendu
    renderer.clear();
    renderer.drawScene(state.obstacles);
    renderer.drawBird(birdImg, { ...bird, angle });
    renderer.drawHUD({
      trees: state.trees,
      forest: state.forest,
      nest: state.nest,
      trashAvoided: state.trashAvoided,
      combo: state.combo,
      windActive: timers.windT > 0,
    });

    if (hitTrash) {
      sfx.hit();
      renderer.drawGameOver();
      state.gameOver = true;

      const finalStats = {
        trees: state.trees,
        eggs: state.eggs,
        forestPercent: Math.round(state.forest),
        trashAvoided: state.trashAvoided,
        timeSeconds: Math.floor(timers.elapsed / 1000),
        maxCombo: state.combo, // (si tu veux, remplace par un tracking dédié)
      };

      queueMicrotask(() => onGameOver?.(finalStats, { address, tokenId }));
      stop();
      return;
    }

    timers.raf = requestAnimationFrame(loop);
  }

  // ---------- Lifecycle ----------
  function start() {
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
    // Ne pas retirer les listeners (permet restart post-GameOver)
  }

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
