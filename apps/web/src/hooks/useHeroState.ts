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
    // Se não tiver carteira conectada ou IDs configurados, zera a tela
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
      const sourceAccount = await rpcServer.getAccount(address);

      // 1. CHAMADA 1: Buscar o total de Folhas (LEAF)
      let leavesVal = 0;
      const simLeaves = await rpcServer.simulateTransaction(
        new StellarSdk.TransactionBuilder(sourceAccount, { fee: '100', networkPassphrase: NETWORK.networkPassphrase })
          .addOperation(contract.call(
            'get_leaves',
            StellarSdk.nativeToScVal(address, { type: 'address' })
          ))
          .setTimeout(30)
          .build()
      );

      if (StellarSdk.rpc.Api.isSimulationSuccess(simLeaves) && simLeaves.result) {
        leavesVal = Number(StellarSdk.scValToNative(simLeaves.result.retval));
      }

      // 2. CHAMADA 2: Buscar o contador de NFTs (SBT / Árvores Forjadas)
      let nftVal = 0;
      const simNft = await rpcServer.simulateTransaction(
        new StellarSdk.TransactionBuilder(sourceAccount, { fee: '100', networkPassphrase: NETWORK.networkPassphrase })
          .addOperation(contract.call(
            'get_nft_counter',
            StellarSdk.nativeToScVal(address, { type: 'address' })
          ))
          .setTimeout(30)
          .build()
      );

      if (StellarSdk.rpc.Api.isSimulationSuccess(simNft) && simNft.result) {
        nftVal = Number(StellarSdk.scValToNative(simNft.result.retval));
      }

      // 3. ATUALIZAÇÃO DA INTERFACE: Mapeando os dados para manter a UI intacta
      setState({
        commonLeaves: leavesVal,
        rareLeaves: 0,      // Reservado para futuras expansões B2B
        legendaryLeaves: 0, // Reservado para futuras expansões B2B
        totalWeighted: leavesVal,
        treesForged: nftVal,
        progressPercent: Math.min(Math.floor((leavesVal / FORGE_THRESHOLD) * 100), 100),
      });

    } catch (err) {
      console.warn("Erro ao buscar Hero State on-chain:", err);
      // Fallback seguro em caso de falha na rede
      setState({
        commonLeaves: 0, rareLeaves: 0, legendaryLeaves: 0,
        totalWeighted: 0, treesForged: 0, progressPercent: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return { ...state, isLoading, error, refetch: fetchState };
}