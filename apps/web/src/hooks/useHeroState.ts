'use client';

import { useState, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction, setAllowed } from "@stellar/freighter-api";
import { rpcServer, CONTRACT_IDS, NETWORK } from '@/lib/soroban/config';

export function useHeroState(address: string | null) {
  const [isForging, setIsForging] = useState(false);

  const forgeTree = useCallback(async () => {
    if (!address) return;
    setIsForging(true);

    try {
      await setAllowed();

      const contract = new StellarSdk.Contract(CONTRACT_IDS.hero_journey);
      const forgeOp = contract.call('forge_common_rwa', StellarSdk.nativeToScVal(address, { type: 'address' }));

      const source = await rpcServer.getAccount(address);
      const tx = new StellarSdk.TransactionBuilder(source, {
        fee: '1000',
        networkPassphrase: NETWORK.networkPassphrase,
      }).addOperation(forgeOp).setTimeout(60).build();

      const preparedTx = await rpcServer.prepareTransaction(tx);

      // 1. CHAMADA DA CARTEIRA
      const result = await signTransaction(preparedTx.toXDR(), {
        networkPassphrase: NETWORK.networkPassphrase,
        address: address
      });

      // 2. CORREÇÃO DO ERRO 2345: Extraímos apenas o XDR assinado
      // O Freighter pode retornar uma string ou um objeto. Tratamos os dois casos:
      const signedXdr = typeof result === 'string' ? result : (result as any).signedTxXdr;

      if (signedXdr) {
        // 3. ENVIANDO APENAS A STRING PARA A REDE
        const transaction = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK.networkPassphrase);
        await rpcServer.sendTransaction(transaction);

        alert("🌳 SUCESSO OPERACIONAL! NFT RWA criado na rede Stellar.");
      }

    } catch (e: any) {
      console.error("Falha no processo:", e);
      if (e.message?.includes("#4")) {
        alert("Erro: Saldo insuficiente de LEAF.");
      } else {
        alert("A transação foi cancelada ou bloqueada pelo navegador.");
      }
    } finally {
      setIsForging(false);
    }
  }, [address]);

  return {
    commonLeaves: 1000,
    progressPercent: 25,
    isForging,
    forgeTree
  };
}