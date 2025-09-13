"use client";
import { useEffect, useRef, useState } from "react";

export default function BirdGame({ nft, onExit }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // état mutable pour perf
  const birdYRef = useRef(200);
  const velRef = useRef(0);
  const obstaclesRef = useRef([]);
  const imgRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = (nft && nft.image) || "";
    imgRef.current = img;
  }, [nft]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    const gravity = 0.5;
    const jump = -8;

    const onKey = (e) => {
      if (e.code === "Space" && !isGameOver) velRef.current = jump;
      if (e.code === "Enter" && isGameOver) restart();
      if (e.code === "Escape" && onExit) onExit();
    };
    window.addEventListener("keydown", onKey);

    function restart() {
      birdYRef.current = 200;
      velRef.current = 0;
      obstaclesRef.current = [];
      setScore(0);
      setIsGameOver(false);
      loop();
    }

    function loop() {
      // physics
      velRef.current += gravity;
      birdYRef.current += velRef.current;

      // clear + background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      g.addColorStop(0, "#cceeff");
      g.addColorStop(1, "#e6ffe6");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // spawn
      if (Math.random() < 0.02) {
        const type = Math.random() < 0.7 ? "seed" : "trash";
        const y = Math.random() * (canvas.height - 30);
        obstaclesRef.current.push({ x: canvas.width, y, type });
      }

      // update/draw obstacles
      obstaclesRef.current.forEach((o) => {
        o.x -= 3.2;
        if (o.type === "seed") {
          ctx.beginPath();
          ctx.arc(o.x, o.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "green";
          ctx.fill();
        } else {
          ctx.fillStyle = "red";
          ctx.fillRect(o.x, o.y, 16, 16);
        }
      });

      // bird
      const birdX = 80;
      const birdY = birdYRef.current;
      const birdW = 40;
      const birdH = 40;
      const img = imgRef.current;

      if (img && img.complete) {
        ctx.drawImage(img, birdX, birdY, birdW, birdH);
      } else {
        ctx.fillStyle = "gold";
        ctx.fillRect(birdX, birdY, birdW, birdH);
      }

      // collisions
      obstaclesRef.current = obstaclesRef.current.filter((o) => {
        if (o.x < -24) return false;
        const hitX = o.x < birdX + birdW && o.x + 16 > birdX;
        const objH = 16;
        const hitY = birdY < o.y + objH && birdY + birdH > o.y;

        if (hitX && hitY) {
          if (o.type === "seed") {
            setScore((s) => s + 10);
            return false; // collected
          } else {
            setIsGameOver(true);
            return false;
          }
        }
        return true;
      });

      // bounds
      if (birdY > canvas.height - birdH || birdY < 0) {
        setIsGameOver(true);
      }

      // HUD
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.fillText("Score: " + score, 10, 22);

      if (!isGameOver) {
        raf = requestAnimationFrame(loop);
      } else {
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 70, canvas.height / 2);
        ctx.font = "14px Arial";
        ctx.fillText("Press Enter to restart • Esc to quit", canvas.width / 2 - 110, canvas.height / 2 + 28);
      }
    }

    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [isGameOver, onExit, score]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        style={{ border: "2px solid #1f2937", borderRadius: 8, background: "#cceeff" }}
      />
      <p className="mt-3 text-muted">
        SPACE to fly • Collect seeds 🌱 • Avoid trash 🗑️ • ESC to quit
      </p>
    </div>
  );
}
