'use client';

import { useEffect, useMemo, useState } from 'react';
import { fetchPixelBirds } from '@/lib/stargaze';
import { useWallet } from '@/components/WalletProvider';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  GRANTED: 'granted',
  DENIED: 'denied',
  ERROR: 'error',
};

export default function usePixelBirdAccess() {
  const { address } = useWallet();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!address) {
      setTokens([]);
      setError(null);
      setStatus(STATUS.IDLE);
      return undefined;
    }

    setStatus(STATUS.LOADING);
    setError(null);

    fetchPixelBirds(address)
      .then((list) => {
        if (cancelled) return;
        setTokens(list);
        setStatus(list.length > 0 ? STATUS.GRANTED : STATUS.DENIED);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Unable to verify PixelBird ownership', err);
        setError(err);
        setTokens([]);
        setStatus(STATUS.ERROR);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  return useMemo(
    () => ({
      address,
      status,
      tokens,
      error,
      isHolder: status === STATUS.GRANTED,
      isLoading: status === STATUS.LOADING,
    }),
    [address, status, tokens, error]
  );
}

export { STATUS as ACCESS_STATUS };
