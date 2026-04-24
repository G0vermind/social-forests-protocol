'use client';
import { useState, useEffect, useCallback } from 'react';
import { horizonServer } from '@/lib/soroban/config';

interface AccountState {
  xlmBalance: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAccountBalance(address: string | null): AccountState {
  const [xlmBalance, setXlmBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const account = await horizonServer.loadAccount(address);
      const native = account.balances.find(
        (b: { asset_type: string }) => b.asset_type === 'native'
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setXlmBalance(native ? parseFloat((native as any).balance).toFixed(2) : '0.00');
    } catch {
      setError('Conta não encontrada ou sem saldo.');
      setXlmBalance('0.00');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
    // Polling a cada 30s
    const interval = setInterval(fetchBalance, 30_000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { xlmBalance, isLoading, error, refetch: fetchBalance };
}
