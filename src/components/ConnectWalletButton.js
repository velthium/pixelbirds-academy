'use client';
import { useState, useCallback } from 'react';

export default function ConnectWalletButton({ onConnected, className = '', children }) {
  const [busy, setBusy] = useState(false);

  const connect = useCallback(async () => {
    try {
      setBusy(true);
      const chainId = 'stargaze-1';
      if (!window.keplr) {
        alert('Keplr non détecté. Installe l’extension puis réessaie.');
        return;
      }
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const addr = accounts?.[0]?.address;
      if (addr) onConnected?.(addr);
    } catch (e) {
      console.error(e);
      alert("Impossible de se connecter à Keplr.");
    } finally {
      setBusy(false);
    }
  }, [onConnected]);

  return (
    <button onClick={connect} className={`btn btn-success ${className}`} disabled={busy}>
      {busy ? 'Connexion…' : (children ?? '🔗 Connect Wallet')}
    </button>
  );
}
