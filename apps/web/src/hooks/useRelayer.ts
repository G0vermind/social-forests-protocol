// =============================================================================
// useRelayer — Hook para transações gas-less via Fee-Bump Relayer
// =============================================================================
// O protocolo paga as taxas de rede. O usuário só assina.
// =============================================================================

"use client";

import { useState, useCallback } from "react";
import { signTransaction, getAddress } from "@stellar/freighter-api";

interface RelayerState {
  loading: boolean;
  error: string | null;
  txHash: string | null;
}

interface UseRelayerReturn extends RelayerState {
  /**
   * Envia uma transação com fee patrocinada pelo protocolo.
   * 1. Usuário assina a transação original
   * 2. Envia para o relayer que adiciona fee-bump
   * 3. Submete on-chain
   */
  sponsorAndSubmit: (transactionXDR: string) => Promise<string | null>;

  /**
   * Cria uma conta Stellar patrocinada para um novo usuário.
   * O usuário não precisa ter XLM.
   */
  createSponsoredAccount: () => Promise<string | null>;

  reset: () => void;
}

export function useRelayer(): UseRelayerReturn {
  const [state, setState] = useState<RelayerState>({
    loading: false,
    error: null,
    txHash: null,
  });

  const reset = useCallback(() => {
    setState({ loading: false, error: null, txHash: null });
  }, []);

  const sponsorAndSubmit = useCallback(
    async (transactionXDR: string): Promise<string | null> => {
      setState({ loading: true, error: null, txHash: null });

      try {
        // 1. Usuário assina a transação
        const { address } = await getAddress();
        const { signedTxXdr, error: signError } = await signTransaction(
          transactionXDR,
          {
            address,
            networkPassphrase: "Test SDF Network ; September 2015",
          }
        );

        if (signError || !signedTxXdr) {
          throw new Error("User rejected the transaction.");
        }

        // 2. Envia para o relayer adicionar fee-bump
        const res = await fetch("/api/v1/relayer/sponsor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionXDR: signedTxXdr }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Relayer failed");
        }

        const { feeBumpXDR } = await res.json();

        // 3. Submete on-chain via Horizon
        const submitRes = await fetch(
          "https://horizon-testnet.stellar.org/transactions",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `tx=${encodeURIComponent(feeBumpXDR)}`,
          }
        );

        const submitData = await submitRes.json();

        if (!submitRes.ok) {
          throw new Error(
            submitData.extras?.result_codes?.transaction ||
              "Transaction submission failed"
          );
        }

        setState({ loading: false, error: null, txHash: submitData.hash });
        return submitData.hash;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ loading: false, error: message, txHash: null });
        return null;
      }
    },
    []
  );

  const createSponsoredAccount = useCallback(async (): Promise<string | null> => {
    setState({ loading: true, error: null, txHash: null });

    try {
      const { address } = await getAddress();
      if (!address) throw new Error("No wallet connected");

      const res = await fetch("/api/v1/relayer/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey: address }),
      });

      const data = await res.json();

      if (data.alreadyExists) {
        setState({ loading: false, error: null, txHash: null });
        return address;
      }

      if (!res.ok) throw new Error(data.error || "Failed to create account");

      // Usuário assina o endSponsoringFutureReserves
      const { signedTxXdr, error: signError } = await signTransaction(
        data.transactionXDR,
        {
          address,
          networkPassphrase: "Test SDF Network ; September 2015",
        }
      );

      if (signError || !signedTxXdr) {
        throw new Error("User rejected account creation.");
      }

      // Submete
      const submitRes = await fetch(
        "https://horizon-testnet.stellar.org/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `tx=${encodeURIComponent(signedTxXdr)}`,
        }
      );

      const submitData = await submitRes.json();
      if (!submitRes.ok) {
        throw new Error(
          submitData.extras?.result_codes?.transaction || "Submission failed"
        );
      }

      setState({ loading: false, error: null, txHash: submitData.hash });
      return address;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setState({ loading: false, error: message, txHash: null });
      return null;
    }
  }, []);

  return { ...state, sponsorAndSubmit, createSponsoredAccount, reset };
}
