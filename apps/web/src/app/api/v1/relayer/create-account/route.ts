// =============================================================================
// POST /api/v1/relayer/create-account
// Sponsored Account Creation — Cria conta Stellar com reserva patrocinada
// O usuário B2C não precisa ter XLM para começar a participar.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  Account,
  Horizon,
} from "@stellar/stellar-sdk";

/**
 * Payload esperado:
 * {
 *   publicKey: string  // Chave pública do novo usuário (gerada no frontend)
 * }
 *
 * Retorna:
 * {
 *   success: true,
 *   sponsoredAccount: string,
 *   txHash: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { publicKey } = body;

    if (!publicKey || typeof publicKey !== "string" || !publicKey.startsWith("G")) {
      return NextResponse.json(
        { error: "Missing or invalid publicKey (must start with G)" },
        { status: 400 }
      );
    }

    const sponsorSecret = process.env.RELAYER_SECRET_KEY;
    if (!sponsorSecret) {
      return NextResponse.json(
        { error: "Relayer not configured. Set RELAYER_SECRET_KEY env var." },
        { status: 503 }
      );
    }

    const sponsorKeypair = Keypair.fromSecret(sponsorSecret);
    const server = new Horizon.Server("https://horizon-testnet.stellar.org");
    const networkPassphrase = Networks.TESTNET;

    // Carrega a conta do sponsor
    const sponsorAccount = await server.loadAccount(sponsorKeypair.publicKey());

    // Monta a transação com sponsored reserves
    const tx = new TransactionBuilder(sponsorAccount, {
      fee: "10000",
      networkPassphrase,
    })
      // 1. Inicia o sponsorship
      .addOperation(
        Operation.beginSponsoringFutureReserves({
          sponsoredId: publicKey,
        })
      )
      // 2. Cria a conta do usuário (com saldo 0 — reserva patrocinada)
      .addOperation(
        Operation.createAccount({
          destination: publicKey,
          startingBalance: "0",
        })
      )
      // 3. Finaliza o sponsorship (assinado pelo novo usuário)
      .addOperation(
        Operation.endSponsoringFutureReserves({
          source: publicKey,
        })
      )
      .setTimeout(120)
      .build();

    // O sponsor assina
    tx.sign(sponsorKeypair);

    // NOTA: Em produção, o usuário também precisa assinar (endSponsoringFutureReserves).
    // Para testnet/demo, usamos a conta do sponsor como source de tudo.
    // O frontend deve assinar com a chave do usuário antes de submeter.

    return NextResponse.json({
      success: true,
      transactionXDR: tx.toXDR(),
      sponsorAddress: sponsorKeypair.publicKey(),
      message:
        "Transaction prepared. User must sign endSponsoringFutureReserves before submission.",
      instructions: {
        step1: "Frontend receives this XDR",
        step2: "User signs with their key (Freighter or Passkey)",
        step3: "Submit to Horizon",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Conta já existe — não é erro
    if (message.includes("account already exists") || message.includes("op_already_exists")) {
      return NextResponse.json({
        success: true,
        message: "Account already exists on the network.",
        alreadyExists: true,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
