"use client";
import { useEffect, useRef, useState } from "react";
import { useWallet } from "@/components/WalletProvider";
import { createRenderer } from "./render";
import { createGameLoop } from "./useGameLoop";
import { submitScore } from "@/lib/submitScore";

export default function BirdGame({ nft, onExit, width = 960, height = 720 }) {
  const canvasRef = useRef(null);
  const { address } = useWallet();

  // NEW: on mémorise le dernier score pour proposer "Submit"
  const [lastScore, setLastScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = createRenderer(canvas, { width, height });
    const loop = createGameLoop({
      canvas,
      nftImageUrl: (nft && nft.image) || "",
      onExit,
      renderer,
      address,
      tokenId: nft?.tokenId,
      // ⛔️ Ne pas auto-soumettre ici
      onGameOver: (finalScore) => {
        setLastScore({ value: finalScore, tokenId: nft?.tokenId || null });
        // fire-and-forget: incrémente le compteur “Games played”
        fetch('/api/metrics/gameover', { method: 'POST' }).catch(() => {});
      },
    });

    loop.start();
    return () => loop.dispose?.();
  }, [nft, onExit, width, height, address]);

  async function handleSubmit() {
    if (!address || !lastScore) return;
    setSubmitting(true);
    setSubmitErr("");
    try {
      await submitScore({
        address,
        score: lastScore.value,
        tokenId: lastScore.tokenId,
      });
      // Option: on masque le bandeau après succès
      setLastScore(null);
    } catch (e) {
      setSubmitErr(e?.message || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "2px solid #1f2937", borderRadius: 8 }}
      />

      {/* Bandeau de fin de partie pour soumettre manuellement */}
      {lastScore !== null && (
        <div className="mt-3">
          <div className="alert alert-secondary d-flex align-items-center justify-content-between gap-3">
            <div>
              <strong>Game Over</strong> — Score:{" "}
              <span className="badge text-bg-dark">{lastScore.value}</span>
              {submitErr && (
                <span className="ms-3 text-danger">({submitErr})</span>
              )}
            </div>
            <div className="d-flex gap-2">
              {address ? (
                <button
                  onClick={handleSubmit}
                  className="btn btn-success btn-sm"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit score"}
                </button>
              ) : (
                <span className="text-muted">
                  Connect wallet to submit
                </span>
              )}
              <button
                onClick={() => setLastScore(null)}
                className="btn btn-outline-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-muted">
        Press <strong>SPACE</strong> or tap to fly • Collect seeds 🌱 • Avoid
        trash 🗑️ • Press <strong>ENTER</strong> or <strong>Click/Tap</strong>{" "}
        to restart • <strong>ESC</strong> to quit
      </p>
    </div>
  );
}
