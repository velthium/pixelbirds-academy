'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/components/WalletProvider';
import WalletSelector from '@/components/WalletSelector';

function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/play';

  const { address, connecting } = useWallet();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (address) router.replace(next);
  }, [address, next, router]);

  return (
    <div className="container py-5 text-center">
      <h1 className="mb-3">Connect your wallet</h1>
      <p className="text-muted mb-4">Choose your preferred Cosmos wallet to continue.</p>

      {!showPicker ? (
        <button
          className="btn btn-success btn-lg rounded-pill px-4"
          onClick={() => setShowPicker(true)}
          disabled={connecting}
        >
          {connecting ? 'Connecting…' : '🔗 Connect Wallet'}
        </button>
      ) : (
        <div className="d-flex justify-content-center">
          <WalletSelector />
        </div>
      )}

      <p className="mt-4">
        <small className="text-muted">
          Need a wallet? Install Keplr or Leap, then come back.
        </small>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <p className="text-muted">Loading…</p>
        </div>
      }
    >
      <LoginScreen />
    </Suspense>
  );
}
