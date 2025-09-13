"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPixelBirds } from "@/lib/stargaze";
import { useWallet } from "@/components/WalletProvider";

export default function SelectNFT({ onSelect }) {
  const { address } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetchPixelBirds(address)
      .then(setNfts)
      .catch(() => setNfts([]))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return null;

  return (
    <>
      <p className="text-muted mb-4">Choose your PixelBird NFT before starting the game:</p>
      {loading ? (
        <p className="text-muted">Loading your NFTs…</p>
      ) : nfts.length === 0 ? (
        <p className="text-muted">You don’t own any PixelBirds NFTs.</p>
      ) : (
        <div className="row g-4 justify-content-center">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="col-6 col-md-4 col-lg-3">
              <button
                type="button"
                onClick={() => onSelect(nft)}
                className="card h-100 shadow-sm border-success-subtle text-start w-100"
                style={{ cursor: "pointer" }}
              >
                {nft.image ? (
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={300}
                    height={300}
                    className="card-img-top rounded pixelated"
                  />
                ) : (
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center bg-body-secondary rounded"
                    style={{ height: 300 }}
                  >
                    <span className="text-muted">No image</span>
                  </div>
                )}
                <div className="card-body p-2">
                  <h6 className="mb-0">{nft.name}</h6>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
