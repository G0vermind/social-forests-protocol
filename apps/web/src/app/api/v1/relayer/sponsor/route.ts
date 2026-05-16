// =============================================================================
// POST /api/v1/relayer/sponsor
// Fee-Bump Relayer — Patrocina gas para transações de usuários B2C
// O protocolo paga as taxas de rede em nome do usuário final.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  TransactionBuilder,
  Keypair,
  Networks,
  Transaction,
  FeeBumpTransaction,
} from "@stellar/stellar-sdk";

/**
 * Payload esperado:
 * {
 *   transactionXDR: string  // Transação assinada pelo usuário (sem fee suficiente)
 * }
 *
 * Retorna:
 * {
 *   success: true,
 *   feeBumpXDR: string  // Transação com fee-bump assinada pelo relayer
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Autenticação básica — em produção usar rate limiting + API key
    const body = await req.json();
    const { transactionXDR } = body;

    if (!transactionXDR || typeof transactionXDR !== "string") {
      return NextResponse.json(
        { error: "Missing required field: transactionXDR" },
        { status: 400 }
      );
    }

    // Chave do relayer (conta que paga as fees)
    const relayerSecret = process.env.RELAYER_SECRET_KEY;
    if (!relayerSecret) {
      return NextResponse.json(
        { error: "Relayer not configured. Set RELAYER_SECRET_KEY env var." },
        { status: 503 }
      );
    }

    const relayerKeypair = Keypair.fromSecret(relayerSecret);
    const networkPassphrase = Networks.TESTNET;

    // Decodifica a transação do usuário
    const innerTx = TransactionBuilder.fromXDR(
      transactionXDR,
      networkPassphrase
    ) as Transaction;

    // Cria a fee-bump transaction (relayer paga o gas)
    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      relayerKeypair,
      "50000", // Fee máxima que o relayer está disposto a pagar (5000 stroops)
      innerTx,
      networkPassphrase
    );

    // Assina com a chave do relayer
    feeBumpTx.sign(relayerKeypair);

    return NextResponse.json({
      success: true,
      feeBumpXDR: feeBumpTx.toXDR(),
      relayerAddress: relayerKeypair.publicKey(),
      message: "Transaction fee sponsored by Social Forest Protocol",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
