export async function submitScore({ chainId = 'stargaze-1', address, score, tokenId }) {
  const payload = {
    address,
    score,
    tokenId: tokenId ?? null,
    ts: Date.now(),
    nonce: (crypto?.randomUUID && crypto.randomUUID()) || String(Math.random()),
  };
  const data = JSON.stringify(payload);

  const w = window.keplr || window.leap;
  if (!w) throw new Error('No wallet available');

  // ADR-36
  const sig = await w.signArbitrary(chainId, address, data);
  const { pubKey } = await w.getKey(chainId);

  const pubkeyB64 = (typeof Buffer !== 'undefined')
    ? Buffer.from(pubKey).toString('base64')
    : btoa(String.fromCharCode(...pubKey));

  const res = await fetch('/api/scores/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payload: data,
      signature: typeof sig === 'string' ? sig : sig.signature,
      pubkey: pubkeyB64,
    }),
  });
  if (!res.ok) throw new Error('Submit failed');
  return res.json();
}
