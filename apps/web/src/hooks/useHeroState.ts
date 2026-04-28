'use client';
import { useState, useEffect, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { rpcServer, CONTRACT_IDS, NETWORK } from '@/lib/soroban/config';

export interface HeroStateOnChain {
  commonLeaves: number;
  rareLeaves: number;
  legendaryLeaves: number;
  totalWeighted: number;
  treesForged: number;
  progressPercent: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const FORGE_THRESHOLD = 1_000;

export function useHeroState(address: string | null): HeroStateOnChain {
  const [state, setState] = useState<Omit<HeroStateOnChain, 'isLoading' | 'error' | 'refetch'>>({
    commonLeaves: 0, rareLeaves: 0, legendaryLeaves: 0,
    totalWeighted: 0, treesForged: 0, progressPercent: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    // Se não tiver carteira ou contrato, resetamos para 0 (sem lixo na tela)
    if (!address || !CONTRACT_IDS.hero_journey) {
      setState({
        commonLeaves: 0, rareLeaves: 0, legendaryLeaves: 0,
        totalWeighted: 0, treesForged: 0, progressPercent: 0,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = new StellarSdk.Contract(CONTRACT_IDS.hero_journey);

      const result = await rpcServer.simulateTransaction(
        new StellarSdk.TransactionBuilder(
          await rpcServer.getAccount(address),
          { fee: '100', networkPassphrase: NETWORK.networkPassphrase }
        )
          .addOperation(contract.call(
            'get_hero_state',
            StellarSdk.nativeToScVal(address, { type: 'address' })
          ))
          .setTimeout(30)
          .build()
      );

      if (StellarSdk.rpc.Api.isSimulationSuccess(result) && result.result) {
        const parsed = StellarSdk.scValToNative(result.result.retval) as any;
        const totalWeighted = Number(parsed.total_weighted ?? 0);
        setState({
          commonLeaves: Number(parsed.common_leaves ?? 0),
          rareLeaves: Number(parsed.rare_leaves ?? 0),
          legendaryLeaves: Number(parsed.legendary_leaves ?? 0),
          totalWeighted,
          treesForged: Number(parsed.trees_forged ?? 0),
          progressPercent: Math.min(Math.floor((totalWeighted / FORGE_THRESHOLD) * 100), 100),
        });
      }
    } catch {
      // Se der erro, não mostramos 365, mostramos 0 para não confundir o usuário
      setState({
        commonLeaves: 0, rareLeaves: 0, legendaryLeaves: 0,
        totalWeighted: 0, treesForged: 0, progressPercent: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => { fetchState(); }, [fetchState]);

  return { ...state, isLoading, error, refetch: fetchState };
}