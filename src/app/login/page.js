'use client';
import { useState } from 'react';
import Link from 'next/link';
import ConnectWalletButton from '@/components/ConnectWalletButton';

export default function LoginPage() {
  const [address, setAddress] = useState(null);

  return (
    <main className="container py-5" id="login">
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <h1 className="display-6 text-center mb-3">Login</h1>
        <p className="lead text-center mb-4">
          Connecte ton wallet pour débloquer : <strong>skins NFT</strong>, <strong>bonus</strong> et <strong>leaderboard</strong>.
        </p>

        {!address ? (
          <div className="d-flex justify-content-center">
            <ConnectWalletButton onConnected={setAddress} className="btn-lg rounded-pill px-4" />
          </div>
        ) : (
          <div className="text-center">
            <div className="badge text-bg-success fs-6 px-3 py-2 rounded-pill mb-3">
              Connected: {address.slice(0, 8)}…{address.slice(-4)}
            </div>
            <div className="d-flex justify-content-center gap-3">
              <Link href="/" className="btn btn-outline-success rounded-pill px-4">🏠 Home</Link>
              <Link href="/play" className="btn btn-success rounded-pill px-4">🎮 Play</Link>
            </div>
          </div>
        )}

        <hr className="my-5" />
        <div className="row g-4 text-center">
          <div className="col-12 col-md-4"><div className="p-3 bg-success-subtle rounded-4">🎨 Skins exclusifs</div></div>
          <div className="col-12 col-md-4"><div className="p-3 bg-success-subtle rounded-4">🏆 Classement on-chain</div></div>
          <div className="col-12 col-md-4"><div className="p-3 bg-success-subtle rounded-4">🌳 Arbres +1 par score</div></div>
        </div>
      </div>
    </main>
  );
}
