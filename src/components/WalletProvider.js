'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CHAIN_ID = 'stargaze-1';

const WalletContext = createContext({
  address: null,
  short: '',
  connecting: false,
  connect: async () => {},
  connectWith: async (_type) => {},
  logout: () => {},
});

async function getAddrWithKeplr() {
  const k = window.keplr;
  if (!k) throw new Error('KEPLR_NOT_FOUND');
  await k.enable(CHAIN_ID);
  const accounts = await window.getOfflineSigner(CHAIN_ID).getAccounts();
  return accounts?.[0]?.address || null;
}

async function getAddrWithLeap() {
  const l = window.leap;
  if (!l) throw new Error('LEAP_NOT_FOUND');
  await l.enable(CHAIN_ID);
  const accounts = await window.getOfflineSigner(CHAIN_ID).getAccounts();
  return accounts?.[0]?.address || null;
}

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const CONNECTORS = useMemo(
    () => ({
      keplr: getAddrWithKeplr,
      leap: getAddrWithLeap,
    }),
    []
  );

  const connectWith = useCallback(async (type) => {
    setConnecting(true);
    try {
      const fn = CONNECTORS[type];
      if (!fn) throw new Error('UNKNOWN_CONNECTOR');
      const addr = await fn();
      if (!addr) throw new Error('NO_ADDRESS');
      setAddress(addr);
      localStorage.setItem('pb_wallet', type);
    } finally {
      setConnecting(false);
    }
  }, [CONNECTORS]);

  const connect = useCallback(async () => {
    if (window.keplr) return connectWith('keplr');
    if (window.leap)  return connectWith('leap');
    throw new Error('NO_WALLET_FOUND');
  }, [connectWith]);

  const logout = useCallback(() => {
    setAddress(null);
    localStorage.removeItem('pb_wallet');
  }, []);

  // auto-reconnect
  useEffect(() => {
    const last = localStorage.getItem('pb_wallet');
    if (last) connectWith(last).catch(() => {});
  }, [connectWith]);

  // account change events
  useEffect(() => {
    const reauth = () => {
      const last = localStorage.getItem('pb_wallet');
      if (last) connectWith(last).catch(() => {});
    };
    window.addEventListener('keplr_keystorechange', reauth);
    window.addEventListener('leap_keystorechange', reauth);
    return () => {
      window.removeEventListener('keplr_keystorechange', reauth);
      window.removeEventListener('leap_keystorechange', reauth);
    };
  }, [connectWith]);

  const value = {
    address,
    short: address ? address.slice(0, 6) + '…' + address.slice(-4) : '',
    connecting,
    connect,
    connectWith,
    logout,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// ✅ named hook export
export function useWallet() {
  return useContext(WalletContext);
}

// (facultatif) export par défaut du provider
export default WalletProvider;
