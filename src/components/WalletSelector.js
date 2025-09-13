'use client';
import { useMemo } from 'react';
import { useWallet } from '@/components/WalletProvider';

export default function WalletSelector({ compact = false, className = '' }) {
  const { address, short, connecting, connectWith, logout } = useWallet();

  const detected = useMemo(() => ({
    keplr: !!globalThis.window?.keplr,
    leap:  !!globalThis.window?.leap,
  }), []);

  if (address) {
    return (
      <div className={`d-inline-flex align-items-center gap-2 ${className}`}>
        <span className="badge text-bg-success rounded-pill px-3 py-2">{short}</span>
        <button className="btn btn-outline-danger btn-sm" onClick={logout} disabled={connecting}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={`d-flex ${compact ? 'gap-2' : 'gap-3'} ${className}`}>
      <button
        className="btn btn-success btn-sm"
        onClick={() => connectWith('keplr')}
        disabled={connecting || !detected.keplr}
        title={detected.keplr ? 'Connect with Keplr' : 'Install Keplr first'}
      >
        {connecting ? 'Connecting…' : 'Keplr'}
      </button>

      <button
        className="btn btn-success btn-sm"
        onClick={() => connectWith('leap')}
        disabled={connecting || !detected.leap}
        title={detected.leap ? 'Connect with Leap' : 'Install Leap first'}
      >
        {connecting ? 'Connecting…' : 'Leap'}
      </button>

      {/* Optional: show install hints when not detected */}
      {!detected.keplr && !detected.leap && (
        <a
          href="https://www.keplr.app/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-secondary btn-sm"
        >
          Install a wallet
        </a>
      )}
    </div>
  );
}
