'use client';
import { useState, useEffect, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { horizonServer, rpcServer, CONTRACT_IDS, NETWORK } from '@/lib/soroban/config';

export function useAccountBalance(address: string | null) {
  const [xlmBalance, setXlmBalance] = useState('0.00');
  const [leafBalance, setLeafBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!address || !CONTRACT_IDS.rwa_vault) return;
    setIsLoading(true);

    try {
      // 1. Puxa XLM
      const account = await horizonServer.loadAccount(address);
      const native = account.balances.find((b: any) => b.asset_type === 'native');
      setXlmBalance(native ? parseFloat(native.balance).toFixed(2) : '0.00');

      // 2. Puxa LEAF (Ajustado para o seu contrato)
      const contract = new StellarSdk.Contract(CONTRACT_IDS.rwa_vault);
      const addressVal = StellarSdk.nativeToScVal(address, { type: 'address' });

      const tx = new StellarSdk.TransactionBuilder(
        new StellarSdk.Account(address, "0"),
        { fee: '100', networkPassphrase: NETWORK.networkPassphrase }
      )
        .addOperation(contract.call('balance', addressVal))
        .setTimeout(30)
        .build();

      const result = await rpcServer.simulateTransaction(tx);

      if (StellarSdk.rpc.Api.isSimulationSuccess(result) && result.result) {
        const raw = StellarSdk.scValToNative(result.result.retval);

        // ✨ A MÁGICA: Transformamos o texto "500000000" em número e dividimos por 10^7
        const cleanValue = typeof raw === 'string' ? raw.replace(/[^\d]/g, '') : raw;
        const mathBalance = Number(cleanValue) / 10_000_000;

        setLeafBalance(mathBalance.toFixed(2));
      }

    } catch (err) {
      console.error("Erro ao buscar LEAF:", err);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { xlmBalance, leafBalance, isLoading };
}