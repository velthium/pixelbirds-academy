'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import GameCanvas from '@/components/GameCanvas';

export default function PlayPage() {
  const { address } = useWallet();
  const router = useRouter();

  // Redirect if not connected
  useEffect(() => {
    if (!address) {
      router.push('/login');
    }
  }, [address, router]);

  // If not connected → show nothing (or a loader)
  if (!address) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Redirecting to login...</p>
      </div>
    );
  }

  // If connected → display the game
  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">🎮 Play PixelBirds</h1>
      <p className="text-muted">Catch seeds, avoid trash, grow your forest!</p>
      <div className="d-flex justify-content-center my-4">
        <GameCanvas />
      </div>
    </div>
  );
}
