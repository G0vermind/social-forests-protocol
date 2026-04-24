'use client';
import { useState, useEffect, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { rpcServer, CONTRACT_IDS, NETWORK } from '@/lib/soroban/config';

export interface UserImpactState {
  impactPoints: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserImpact(address: string | null): UserImpactState {
  const [impactPoints, setImpactPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    // Guard: só tenta se o contrato estiver configurado
    if (!address || !CONTRACT_IDS.sbt_reputation) {
      // Retorna mock enquanto contrato não está deployado
      setImpactPoints(450); // mock de CO2
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const contract = new StellarSdk.Contract(CONTRACT_IDS.sbt_reputation);

      const result = await rpcServer.simulateTransaction(
        new StellarSdk.TransactionBuilder(
          await rpcServer.getAccount(address),
          { fee: '100', networkPassphrase: NETWORK.networkPassphrase }
        )
          .addOperation(contract.call(
            'get_user_impact',
            StellarSdk.nativeToScVal(address, { type: 'address' })
          ))
          .setTimeout(30)
          .build()
      );

      if (StellarSdk.rpc.Api.isSimulationSuccess(result) && result.result) {
        const points = Number(StellarSdk.scValToNative(result.result.retval));
        setImpactPoints(points);
      }
    } catch {
      setError('Erro ao ler contrato SBT. Usando dados locais.');
      setImpactPoints(450); // fallback mock
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => { fetchState(); }, [fetchState]);

  return { impactPoints, isLoading, error, refetch: fetchState };
}
