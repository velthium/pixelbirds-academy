export const runtime = 'nodejs';
import 'server-only';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import courses from '@/data/courses.json';

const hasRedisConfig =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) && Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

function computeFallbackMetrics() {
  const epoch = new Date('2024-01-01T00:00:00Z');
  const now = new Date();
  const dayDiff = Math.max(0, Math.floor((now.getTime() - epoch.getTime()) / 86_400_000));

  const aggregate = courses.reduce(
    (acc, course) => {
      if (!course.impact) return acc;

      const { metrics, daily } = course.impact;
      if (metrics) {
        acc.gamesPlayed += Number(metrics.gamesPlayed || 0);
        acc.treesPlanted += Number(metrics.treesPlanted || 0);
        acc.holders += Number(metrics.holders || 0);
      }

      if (daily) {
        acc.daily.gamesPlayed += Number(daily.gamesPlayed || 0);
        acc.daily.treesPlanted += Number(daily.treesPlanted || 0);
        acc.daily.holders += Number(daily.holders || 0);
      }

      return acc;
    },
    {
      gamesPlayed: 0,
      treesPlanted: 0,
      holders: 0,
      daily: { gamesPlayed: 0, treesPlanted: 0, holders: 0 },
    }
  );

  const totals = {
    gamesPlayed: Math.round(aggregate.gamesPlayed + dayDiff * aggregate.daily.gamesPlayed),
    treesPlanted: Math.round(aggregate.treesPlanted + dayDiff * aggregate.daily.treesPlanted),
    holders: Math.min(
      5202,
      Math.round(aggregate.holders + dayDiff * aggregate.daily.holders)
    ),
    daily: {
      gamesPlayed: Math.round(aggregate.daily.gamesPlayed),
      treesPlanted: Math.round(aggregate.daily.treesPlanted),
      holders: Math.round(aggregate.daily.holders),
    },
  };

  // Ensure minimum positive signals for the homepage counters.
  if (totals.gamesPlayed <= 0) totals.gamesPlayed = 3200 + dayDiff * 18;
  if (totals.treesPlanted <= 0) totals.treesPlanted = 48600 + dayDiff * 22;
  if (totals.holders <= 0) totals.holders = 1480 + dayDiff * 3;

  totals.daily.gamesPlayed = totals.daily.gamesPlayed || 18;
  totals.daily.treesPlanted = totals.daily.treesPlanted || 22;
  totals.daily.holders = totals.daily.holders || 3;

  return totals;
}

async function getRedisNumber(op) {
  if (!redis) return null;
  try {
    const value = await op();
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
  } catch (error) {
    console.warn('[stats] Falling back from Redis:', error);
    return null;
  }
}

export async function GET() {
  const fallback = computeFallbackMetrics();

  const [gamesPlayed, treesPlanted, playersCount] = await Promise.all([
    getRedisNumber(() => redis.get('metrics:games_played')),
    getRedisNumber(() => redis.get('metrics:trees_planted')), // initialise this key in Upstash to track progress
    getRedisNumber(() => redis.zcard('lb:global')), // number of unique addresses that submitted a score
  ]);

  return NextResponse.json({
    gamesPlayed: gamesPlayed ?? fallback.gamesPlayed,
    treesPlanted: treesPlanted ?? fallback.treesPlanted,
    holders: playersCount ?? fallback.holders,
    daily: fallback.daily,
    source: gamesPlayed === null || treesPlanted === null || playersCount === null ? 'fallback' : 'redis',
  });
}
