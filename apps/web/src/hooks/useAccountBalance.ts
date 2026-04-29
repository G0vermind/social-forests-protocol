'use client';

import { useState, useEffect, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import {
  horizonServer,
  rpcServer,
  CONTRACT_IDS,
  NETWORK
} from '@/lib/soroban/config';

export function useAccountBalance(address: string | null) {
  const [xlmBalance, setXlmBalance] = useState('0.00');
  const [leafBalance, setLeafBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------
  // 🔄 FUNÇÃO DE BUSCA (XLM e LEAF)
  // ---------------------------------------------------------
  const fetchBalance = useCallback(async () => {
    if (!address || !CONTRACT_IDS.leaf_token) return;

    setIsLoading(true);

    try {
      // 🔵 1. BUSCAR SALDO DE XLM (Via Horizon)
      const account = await horizonServer.loadAccount(address);
      const native = account.balances.find((b: any) => b.asset_type === 'native');
      setXlmBalance(native ? parseFloat(native.balance).toFixed(2) : '0.00');

      // 🟢 2. BUSCAR SALDO DE LEAF (Simulação Soroban)
      const contract = new StellarSdk.Contract(CONTRACT_IDS.leaf_token);
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

        // Converte o valor "bruto" da rede para o formato decimal amigável
        const cleanValue = typeof raw === 'string' ? raw.replace(/[^\d]/g, '') : raw;
        const mathBalance = Number(cleanValue) / 10_000_000;

        setLeafBalance(mathBalance.toFixed(2));
      }

    } catch (err) {
      // Silencioso para não poluir a tela com erros de rede instável
      console.warn("Rede Stellar ocupada...");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // ---------------------------------------------------------
  // 🕒 CONTROLE DE ATUALIZAÇÃO (A cada 10 segundos)
  // ---------------------------------------------------------
  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [fetchBalance]);

  // ---------------------------------------------------------
  // 🎁 RETORNO PARA O SITE
  // ---------------------------------------------------------
  return {
    xlmBalance,
    leafBalance, // Se quiser "forçar" 1000 para teste, mude para: '1000.00'
    isLoading
  };
}