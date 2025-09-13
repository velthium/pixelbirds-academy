'use client';
import { useWallet } from '@/components/WalletProvider';

export default function ConnectWalletButton({ className = '', children }) {
  const { address, short, connecting, connect, logout } = useWallet();

  if (address) {
    return (
      <div className={`d-inline-flex align-items-center gap-2 ${className}`}>
        <span className="badge text-bg-success rounded-pill px-3 py-2">{short}</span>
        <button onClick={logout} className="btn btn-outline-danger" disabled={connecting}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect} className={`btn btn-success ${className}`} disabled={connecting}>
      {connecting ? 'Connecting…' : (children ?? '🔗 Connect Wallet')}
    </button>
  );
}
