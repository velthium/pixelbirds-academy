"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import SelectNFT from "./SelectNFT";

const BirdGame = dynamic(() => import("./BirdGame"), { ssr: false });

export default function GameCanvas() {
  const [selected, setSelected] = useState(null);
  const [lastResult, setLastResult] = useState(null); // objet {trees, eggs, forestPercent, trashAvoided}

  const formatResult = (r) =>
    !r ? "" :
    `Trees ${r.trees} • Eggs ${r.eggs} • Forest ${r.forestPercent}% • Trash avoided ${r.trashAvoided}`;

  if (!selected) {
    return (
      <div>
        {lastResult && (
          <p className="text-muted mb-3">Last run: {formatResult(lastResult)}</p>
        )}
        <h2 className="mb-3">Choose your bird</h2>
        <SelectNFT onSelect={setSelected} />
      </div>
    );
  }

  return (
    <div>
      {lastResult && (
        <p className="text-muted mb-3">Last run: {formatResult(lastResult)}</p>
      )}

      <div className="mb-3 d-inline-flex align-items-center gap-3">
        <span className="badge text-bg-success">{selected.name}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setSelected(null)}
        >
          ← Change NFT
        </button>
      </div>

      <BirdGame
        nft={selected}
        onExit={() => setSelected(null)}
        // IMPORTANT: on stocke l'objet, on ne l'affiche jamais brut
        onGameOver={(finalStats) => setLastResult(finalStats)}
        width={960}
        height={720}
      />
    </div>
  );
}
