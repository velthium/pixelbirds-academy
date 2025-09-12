'use client';
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const WalletCtx = createContext(null);
export const useWallet = () => useContext(WalletCtx);

export default function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Raccourci
  const short = useMemo(() =>
    address ? `${address.slice(0, 8)}…${address.slice(-4)}` : null, [address]
  );

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      const chainId = 'stargaze-1';
      if (!window.keplr) {
        alert('Keplr non détecté. Installe l’extension puis réessaie.');
        return;
      }
      await window.keplr.enable(chainId);
      const offlineSigner = window.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const addr = accounts?.[0]?.address;
      if (addr) {
        setAddress(addr);
        localStorage.setItem('pb_wallet_addr', addr);
      }
    } catch (e) {
      console.error(e);
      alert('Connexion Keplr échouée.');
    } finally {
      setConnecting(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAddress(null);
    localStorage.removeItem('pb_wallet_addr');
  }, []);

  // Auto-restaure la session locale
  useEffect(() => {
    const saved = localStorage.getItem('pb_wallet_addr');
    if (saved) setAddress(saved);
  }, []);

  const value = useMemo(() => ({ address, short, connecting, connect, logout }), [address, short, connecting, connect, logout]);
  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}
