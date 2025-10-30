// client/utils/score.js
export async function submitScore({ chainId = 'stargaze-1', address, score, tokenId }) {
  const payload = {
    address,
    score,
    tokenId,
    ts: Date.now(),             // prevents replay attacks
    nonce: crypto.randomUUID(), // unique identifier per submission
  };
  const data = JSON.stringify(payload);

  // 1) ADR-36 signature
  const sig = await window.keplr.signArbitrary(chainId, address, data);

  // 2) Fetch the public key so the server can verify the signature
  const { pubKey } = await window.keplr.getKey(chainId); // Uint8Array

  const body = {
    payload: data,
    signature: typeof sig === 'string' ? sig : sig.signature, // Keplr returns a base64 string
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
