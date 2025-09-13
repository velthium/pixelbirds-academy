export const runtime = 'nodejs';
import 'server-only';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST() {
  await redis.incr('metrics:games_played');
  return NextResponse.json({ ok: true });
}
