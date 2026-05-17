// =============================================================================
// POST /api/v1/protocol/institution/create-activity
// Relayer endpoint para o frontend Vite (frontv1)
// Reserva LEAFs para uma atividade institucional
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import {
  Contract,
  TransactionBuilder,
  Networks,
  Keypair,
  rpc,
  nativeToScVal,
  Address,
} from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, CONTRACT_IDS } from "@/lib/soroban/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload, actor } = body;

    if (!payload?.leafAmount || !actor?.walletAddress) {
      return NextResponse.json(
        { ok: false, error: "Missing payload.leafAmount or actor.walletAddress" },
        { status: 400 }
      );
    }

    const relayerSecret = process.env.RELAYER_SECRET_KEY;
    if (!relayerSecret) {
      return NextResponse.json(
        { ok: false, error: "Relayer not configured" },
        { status: 503 }
      );
    }

    const relayerKeypair = Keypair.fromSecret(relayerSecret);
    const server = new rpc.Server(NETWORK_CONFIG.rpcUrl);
    const contract = new Contract(CONTRACT_IDS.leafToken);

    const leafAmount = BigInt(Number(payload.leafAmount) * 10_000_000); // 7 decimais

    // Transfere LEAFs da empresa para o contrato (reserva para atividade)
    const call = contract.call(
      "transfer",
      new Address(actor.walletAddress).toScVal(),
      new Address(CONTRACT_IDS.journeyOrchestrator).toScVal(),
      nativeToScVal(leafAmount, { type: "i128" })
    );

    const account = await server.getAccount(relayerKeypair.publicKey());
    const tx = new TransactionBuilder(account, {
      fee: "50000",
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(call)
      .setTimeout(120)
      .build();

    const simulated = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(simulated)) {
      return NextResponse.json(
        { ok: false, error: "Simulation failed", details: simulated },
        { status: 422 }
      );
    }

    const preparedTx = rpc.assembleTransaction(tx, simulated).build();
    preparedTx.sign(relayerKeypair);

    const sendResponse = await server.sendTransaction(preparedTx);

    if (sendResponse.status === "ERROR") {
      return NextResponse.json(
        { ok: false, error: "Transaction failed", details: sendResponse },
        { status: 500 }
      );
    }

    // Aguarda confirmação
    let getResponse = await server.getTransaction(sendResponse.hash);
    let attempts = 0;
    while (getResponse.status === "NOT_FOUND" && attempts < 30) {
      await new Promise((r) => setTimeout(r, 1000));
      getResponse = await server.getTransaction(sendResponse.hash);
      attempts++;
    }

    if (getResponse.status === "SUCCESS") {
      return NextResponse.json({
        ok: true,
        message: "Atividade criada e Folhas reservadas.",
        txHash: sendResponse.hash,
        ledger: getResponse.ledger,
        activity: {
          leafsReserved: Number(leafAmount) / 10_000_000,
          activityName: payload.activityName || "Atividade",
        },
      });
    }

    return NextResponse.json(
      { ok: false, error: "Transaction not confirmed", status: getResponse.status },
      { status: 500 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
