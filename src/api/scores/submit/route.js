export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto';
import { fromBase64, toUtf8 } from '@cosmjs/encoding';
import { rawSecp256k1PubkeyToAddress } from '@cosmjs/amino';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,      // tu as déjà ces env vars
  token: process.env.KV_REST_API_TOKEN,  // (elles viennent d’Upstash via Vercel)
});

const BECH32_PREFIX = 'stars'; // Stargaze

export async function POST(req) {
  try {
    const { payload, signature, pubkey } = await req.json();
    if (!payload || !signature || !pubkey) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const obj = JSON.parse(payload);
    const { address, score, tokenId, ts, nonce } = obj;

    // Checks simples
    if (typeof address !== 'string' || typeof score !== 'number' || score < 0 || score > 1_000_000) {
      return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
    }
    if (!ts || Math.abs(Date.now() - Number(ts)) > 5 * 60 * 1000) {
      return NextResponse.json({ error: 'Stale timestamp' }, { status: 400 });
    }
    if (!nonce || typeof nonce !== 'string') {
      return NextResponse.json({ error: 'Missing nonce' }, { status: 400 });
    }

    // Vérif signature ADR-36
    const pub = fromBase64(pubkey);
    const sigBytes = fromBase64(signature);
    const hash = sha256(toUtf8(payload));
    const sig = Secp256k1Signature.fromFixedLength(sigBytes);
    const ok = await Secp256k1.verifySignature(sig, hash, pub);
    if (!ok) return NextResponse.json({ error: 'Bad signature' }, { status: 401 });

    const derived = rawSecp256k1PubkeyToAddress(pub, BECH32_PREFIX);
    if (derived !== address) {
      return NextResponse.json({ error: 'Address/pubkey mismatch' }, { status: 401 });
    }

    // Best score par wallet + leaderboard
    const key = `score:${address}`;
    const prev = Number((await redis.get(key)) || 0);
    const best = Math.max(prev, score);

    if (best !== prev) {
      await redis.set(key, best);
      await redis.zadd('lb:global', { member: address, score: best });
    }

    return NextResponse.json({ ok: true, best });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
