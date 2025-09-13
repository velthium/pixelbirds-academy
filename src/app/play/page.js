'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import GameCanvas from '@/components/GameCanvas';
import Leaderboard from '@/components/Leaderboard';

export default function PlayPage() {
  const { address } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!address) router.push('/login');
  }, [address, router]);

  if (!address) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">🎮 Play PixelBirds</h1>
      <p className="text-muted">Catch seeds, avoid trash, grow your forest!</p>

      {/* Jeu centré */}
      <div className="d-flex justify-content-center my-4">
        <GameCanvas />
      </div>

      {/* Leaderboard en dessous */}
      <div className="my-5 text-start">
        <h2 className="h4 mb-3">Global Leaderboard</h2>
        <Leaderboard />
      </div>
    </div>
  );
}
