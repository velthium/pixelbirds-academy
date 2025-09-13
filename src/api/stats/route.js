export const runtime = 'nodejs';
import 'server-only';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function GET() {
  const [gamesPlayed, treesPlanted, playersCount] = await Promise.all([
    redis.get('metrics:games_played').then(n => Number(n || 0)),
    redis.get('metrics:trees_planted').then(n => Number(n || 0)), // tu peux initialiser cette clé dans Upstash
    redis.zcard('lb:global').then(n => Number(n || 0)),           // nb d’adresses ayant soumis un score
  ]);

  return NextResponse.json({
    gamesPlayed,
    treesPlanted,
    holders: playersCount, // label “holders” pour l’instant = joueurs uniques
  });
}
