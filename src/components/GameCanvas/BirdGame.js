"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { useWallet } from "@/components/WalletProvider";
import { createRenderer } from "./render";
import { createGameLoop } from "./useGameLoop"; // <- assure-toi que le fichier s'appelle bien createGameLoop.js
import { submitScore } from "@/lib/submitScore";

export default function BirdGame({ nft, onExit, width = 960, height = 720 }) {
  const canvasRef = useRef(null);
  const { address } = useWallet();

  // Objet de stats renvoyé par onGameOver: {trees, eggs, forestPercent, trashAvoided}
  const [lastResult, setLastResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  // Chaîne lisible pour éviter de rendre un objet brut
  const resultText = useMemo(() => {
    if (!lastResult) return "";
    const { trees, eggs, forestPercent, trashAvoided } = lastResult;
    return `Trees ${trees} • Eggs ${eggs} • Forest ${forestPercent}% • Hazards avoided ${trashAvoided}`;
  }, [lastResult]);

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
      onGameOver: (finalStats) => {
        setLastResult(finalStats); // objet complet
        // fire-and-forget metric (optionnel)
        fetch("/api/metrics/gameover", { method: "POST" }).catch(() => {});
      },
    });

    loop.start();
    return () => loop.dispose?.();
  }, [nft, onExit, width, height, address]);

  async function handleSubmit() {
    if (!address || !lastResult) return;
    setSubmitting(true);
    setSubmitErr("");
    try {
      // Choix d'une métrique numérique : ex. trees
      await submitScore({
        address,
        score: Number(lastResult.trees || 0),
        tokenId: nft?.tokenId ?? null,
      });
      setLastResult(null); // ferme le bandeau après succès
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

      {/* Bandeau de fin: afficher du texte formaté (jamais l'objet brut) */}
      {lastResult && (
        <div className="mt-3">
          <div className="alert alert-secondary d-flex align-items-center justify-content-between gap-3">
            <div>
              <strong>Game Over</strong> — {resultText}
              {submitErr && <span className="ms-3 text-danger">({submitErr})</span>}
            </div>
            <div className="d-flex gap-2">
              {address ? (
                <button
                  onClick={handleSubmit}
                  className="btn btn-success btn-sm"
                  disabled={submitting}
                >
                  {submitting ? "Submitting…" : "Submit trees"}
                </button>
              ) : (
                <span className="text-muted">Connect wallet to submit</span>
              )}
              <button onClick={() => setLastResult(null)} className="btn btn-outline-secondary btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="mt-3 text-muted">
        SPACE / Tap to fly • Collect 🌱🍓🐛🪵💧 • Avoid 🗑️ & 🪟 • ENTER/Click to restart • ESC to quit
      </p>
    </div>
  );
}
