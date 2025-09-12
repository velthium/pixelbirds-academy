'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import Image from 'next/image';

// FIXED address of your PixelBirds collection contract (SG721)
const COLLECTION_ADDR = 'stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2';

export default function PlayPage() {
  const { address } = useWallet();
  const router = useRouter();

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState(null);

  // Redirect if not connected
  useEffect(() => {
    if (!address) router.push('/login');
  }, [address, router]);

  // Fetch NFTs owned by the player in YOUR collection
  useEffect(() => {
    if (!address) return;

    async function fetchNFTs() {
      setLoading(true);
      const ctrl = new AbortController();
      try {
        const res = await fetch('https://graphql.mainnet.stargaze-apis.com/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          signal: ctrl.signal,
          body: JSON.stringify({
            query: `
              query Tokens($owner: String!, $collectionAddr: String!, $limit: Int = 50) {
                tokens(owner: $owner, collectionAddr: $collectionAddr, limit: $limit) {
                  tokens {
                    tokenId
                    name
                    media { url }
                    imageUrl
                  }
                }
              }
            `,
            variables: { owner: address, collectionAddr: COLLECTION_ADDR, limit: 50 },
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          console.error('GraphQL HTTP error:', res.status, text);
          setNfts([]);
          return;
        }

        const payload = await res.json();
        const list = payload?.data?.tokens?.tokens ?? [];

        const normalizeUrl = (u) => {
          if (!u) return '';
          if (u.startsWith('ipfs://')) return `https://ipfs.io/ipfs/${u.replace('ipfs://', '')}`;
          return u;
        };

        const normalized = list.map((t) => ({
          tokenId: t?.tokenId ?? '',
          name: t?.name || `PixelBird #${t.tokenId}`,
          image: normalizeUrl(t?.media?.url || t?.imageUrl || ''),
        }));

        setNfts(normalized);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Error fetching NFTs:', err);
        setNfts([]);
      } finally {
        setLoading(false);
      }

      // cleanup if the component unmounts during fetch
      return () => ctrl.abort();
    }

    fetchNFTs();
  }, [address]);

  if (!address) return null;

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">🎮 Play PixelBirds</h1>

      {/* STEP 1 — NFT selection */}
      {!selectedNFT ? (
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
                    onClick={() => setSelectedNFT(nft)}
                    className="card h-100 shadow-sm border-success-subtle text-start w-100"
                    style={{ cursor: 'pointer' }}
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
      ) : (
        // STEP 2 — Selected NFT + Start button
        <>
          <div className="mb-4">
            <h5 className="mb-3">You selected:</h5>
            <div className="card mx-auto border-success-subtle shadow-sm" style={{ maxWidth: 300 }}>
              {selectedNFT.image ? (
                <Image
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
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
                <h6 className="mb-0">{selectedNFT.name}</h6>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => setSelectedNFT(null)}
            >
              ← Change NFT
            </button>
            <button
              className="btn btn-success btn-lg rounded-pill px-4"
              onClick={() => {
                // Hook your game start logic here (or navigate)
                // e.g., setShowGame(true) or router.push('/play/game')
                alert(`Start Game with ${selectedNFT.name} (#${selectedNFT.tokenId})`);
              }}
            >
              🚀 Start Game
            </button>
          </div>
        </>
      )}
    </div>
  );
}
