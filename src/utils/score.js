// client/utils/score.js
export async function submitScore({ chainId = 'stargaze-1', address, score, tokenId }) {
  const payload = {
    address,
    score,
    tokenId,
    ts: Date.now(),             // anti-replay
    nonce: crypto.randomUUID(), // anti-replay
  };
  const data = JSON.stringify(payload);

  // 1) signature ADR-36
  const sig = await window.keplr.signArbitrary(chainId, address, data);

  // 2) pubkey pour vérification serveur
  const { pubKey } = await window.keplr.getKey(chainId); // Uint8Array

  const body = {
    payload: data,
    signature: typeof sig === 'string' ? sig : sig.signature, // Keplr renvoie string base64
    pubkey: Buffer.from(pubKey).toString('base64'),
  };

  const res = await fetch('/api/scores/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Score submit failed');
  return res.json();
}
