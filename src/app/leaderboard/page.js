'use client';
import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Leaderboard</h1>
      <p className="text-muted mb-4">Top players (best score per wallet)</p>
      <Leaderboard />
    </div>
  );
}