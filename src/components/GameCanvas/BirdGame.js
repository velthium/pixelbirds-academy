"use client";
import { useEffect, useRef } from "react";
import { createGameLoop } from "./useGameLoop";
import { createRenderer } from "./render";

export default function BirdGame({ nft, onExit, width = 960, height = 720 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createRenderer(canvas, { width, height });
    const loop = createGameLoop({
      canvas,
      nftImageUrl: (nft && nft.image) || "",
      onExit,
      renderer,
    });

    loop.start();
    return () => loop.stop();
  }, [nft, onExit, width, height]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "2px solid #1f2937", borderRadius: 8 }}
      />
      <p className="mt-3 text-muted">
        Press <strong>SPACE</strong> or tap to fly • Collect seeds 🌱 • Avoid trash 🗑️ •
        Press <strong>ESC</strong> to quit
      </p>
    </div>
  );
}
