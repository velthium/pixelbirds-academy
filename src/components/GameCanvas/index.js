"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import SelectNFT from "./SelectNFT";

// charge le jeu uniquement côté client
const BirdGame = dynamic(() => import("./BirdGame"), { ssr: false });

export default function GameCanvas() {
  const [selected, setSelected] = useState(null);

  if (!selected) {
    return (
      <div>
        <h2 className="mb-3">Choose your bird</h2>
        <SelectNFT onSelect={setSelected} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 d-inline-flex align-items-center gap-3">
        <span className="badge text-bg-success">{selected.name}</span>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelected(null)}>
          ← Change NFT
        </button>
      </div>
      <BirdGame nft={selected} onExit={() => setSelected(null)} />
    </div>
  );
}
