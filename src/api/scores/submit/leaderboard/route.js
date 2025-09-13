export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET() {
  const rows = await redis.zrange('lb:global', 0, 49, { rev: true, withScores: true });
  const top = [];
  for (let i = 0; i < rows.length; i += 2) {
    top.push({ address: rows[i], best_score: Number(rows[i + 1]) });
  }
  return NextResponse.json({ top });
}
