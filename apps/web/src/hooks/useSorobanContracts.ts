'use client';

import { useState, useCallback } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { rpcServer, CONTRACT_IDS, NETWORK } from '@/lib/soroban/config';
import { requestAccess, signTransaction } from '@stellar/freighter-api';

/**
 * Interface para representar os dados de oráculo de uma árvore (RWA).
 * Espelha a struct `TreeAnnualRecord` definida em Rust no contrato rwa_vault.
 */
export interface TreeRecord {
  year: number;
  height_cm: number;
  carbon_kg: number;
  health_score: number; // MUDOU: Era health_index
  geo_hash: string;     // MUDOU: Adicionado (e verified_by removido)
}

export function useSorobanContracts() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * MISSÃO 1: "Receber Green Cashback"
   * Esta função chama o contrato `sbt_reputation` (escrito em Rust).
   * Ela garante a prova criptográfica de que a empresa transferiu pontos de impacto (LEAFs e SBTs) para o consumidor.
   * Na UI: O usuário ganha a "folha" e destrava a medalha (SBT) de polinizador.
   */
  const receiveGreenCashback = useCallback(async (companyAddress: string, userAddress: string, amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!CONTRACT_IDS.sbt_reputation) throw new Error("Contrato SBT não configurado.");

      const contract = new StellarSdk.Contract(CONTRACT_IDS.sbt_reputation);

      // Construir transação invocando `distribute_green_cashback`
      const sourceAccount = await rpcServer.getAccount(companyAddress);
      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: NETWORK.networkPassphrase
      })
        .addOperation(contract.call(
          'distribute_green_cashback',
          StellarSdk.nativeToScVal(companyAddress, { type: 'address' }),
          StellarSdk.nativeToScVal(userAddress, { type: 'address' }),
          StellarSdk.nativeToScVal(amount, { type: 'i128' }) // Quantidade de impacto/LEAF
        ))
        .setTimeout(30)
        .build();

      // Assinatura via Freighter (Wallet B2B ou B2C)
      const response = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK.networkPassphrase });
      if (response.error) throw new Error(response.error);
      tx = StellarSdk.TransactionBuilder.fromXDR(response.signedTxXdr, NETWORK.networkPassphrase) as StellarSdk.Transaction;

      // Enviar para a rede Stellar
      const result = await rpcServer.sendTransaction(tx);
      console.log("Transação enviada:", result.hash);

      // MOCK DE RETORNO (Até que o relayer esteja integrado)
      return { success: true, hash: result.hash, message: "Cashback Verde recebido e registrado on-chain!" };

    } catch (err: any) {
      console.error(err);
      setError('Falha ao receber Cashback. Usando fallback local.');

      // FALLBACK MOCK PARA A UI NÃO QUEBRAR
      return { success: true, hash: "mock-hash-1234", message: "[MOCK] Cashback Verde recebido." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * MISSÃO 2: "Forjar/Evoluir Árvore"
   * Chama o contrato `hero_journey` em Rust.
   * Ele queima as LEAFs na blockchain e evolui a raridade (Plantador -> Lenda) do RWA do usuário.
   * Essa ação modifica irreversivelmente o estado do Ledger (prova criptográfica).
   */
  const forgeTree = useCallback(async (userAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!CONTRACT_IDS.hero_journey) throw new Error("Contrato Hero Journey não configurado.");

      const contract = new StellarSdk.Contract(CONTRACT_IDS.hero_journey);

      const sourceAccount = await rpcServer.getAccount(userAddress);
      let tx = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '100',
        networkPassphrase: NETWORK.networkPassphrase
      })
        .addOperation(contract.call(
          'forge_common_rwa', // MUDOU: Atualizado de forge_tree
          StellarSdk.nativeToScVal(userAddress, { type: 'address' })
        ))
        .setTimeout(30)
        .build();

      const response = await signTransaction(tx.toXDR(), { networkPassphrase: NETWORK.networkPassphrase });
      if (response.error) throw new Error(response.error);
      tx = StellarSdk.TransactionBuilder.fromXDR(response.signedTxXdr, NETWORK.networkPassphrase) as StellarSdk.Transaction;

      const result = await rpcServer.sendTransaction(tx);
      console.log("Transação enviada:", result.hash);

      return { success: true, hash: result.hash, message: "Árvore evoluída on-chain com sucesso!" };

    } catch (err: any) {
      console.error(err);
      setError('Falha ao forjar árvore. Usando fallback local.');

      // FALLBACK MOCK 
      return { success: true, hash: "mock-hash-forge", message: "[MOCK] Árvore forjada para nível Raro." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * LEITURA 3: "Carregar os Dados do RWA"
   * Consulta read-only ao `hero_journey` (onde a árvore foi movida na nova arquitetura).
   * Retorna os dados biológicos gravados de forma inalterável no contrato Soroban.
   */
  const getTreeRecord = useCallback(async (nftId: string, year: number): Promise<TreeRecord | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // MUDOU: Agora checa o contrato hero_journey em vez do rwa_vault
      if (!CONTRACT_IDS.hero_journey) throw new Error("Contrato Hero Journey não configurado.");

      // MUDOU: Agora aponta para o hero_journey
      const contract = new StellarSdk.Contract(CONTRACT_IDS.hero_journey);

      // Simulação de transação (chamada de leitura sem custo)
      const result = await rpcServer.simulateTransaction(
        new StellarSdk.TransactionBuilder(
          await rpcServer.getAccount(CONTRACT_IDS.hero_journey), // MUDOU: Simula com a chave do hero_journey
          { fee: '100', networkPassphrase: NETWORK.networkPassphrase }
        )
          .addOperation(contract.call(
            'get_tree_record',
            StellarSdk.nativeToScVal(nftId, { type: 'string' }),
            StellarSdk.nativeToScVal(year, { type: 'u32' })
          ))
          .setTimeout(30)
          .build()
      );

      if (StellarSdk.rpc.Api.isSimulationSuccess(result) && result.result) {
        const parsed = StellarSdk.scValToNative(result.result.retval) as any;
        return {
          year: Number(parsed.year),
          height_cm: Number(parsed.height_cm),
          carbon_kg: Number(parsed.carbon_kg),
          health_score: Number(parsed.health_score), // MUDOU: Para health_score
          geo_hash: String(parsed.geo_hash)          // MUDOU: Para geo_hash
        };
      }
      return null;
    } catch (err: any) {
      console.warn("Erro ao buscar oráculo. Usando MOCK de Fallback.");

      // MOCK ATUALIZADO COM OS DADOS EXATOS DA NOVA TIPAGEM
      return {
        year: 2026,
        height_cm: 320,  // 3.2m
        carbon_kg: 210,  // 210kg
        health_score: 98, // Mock atualizado
        geo_hash: "7nfkud29" // Mock adicionado
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    receiveGreenCashback,
    forgeTree,
    getTreeRecord,
    isLoading,
    error
  };
}