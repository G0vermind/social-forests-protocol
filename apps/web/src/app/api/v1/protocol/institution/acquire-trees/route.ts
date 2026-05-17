// =============================================================================
// POST /api/v1/protocol/institution/acquire-trees
// Relayer endpoint para o frontend Vite (frontv1)
// Executa institutional_onboarding no journey_orchestrator
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
    const { payload, actor, contracts, network } = body;

    // Validação
    if (!payload?.treeCount || !actor?.walletAddress) {
      return NextResponse.json(
        { ok: false, error: "Missing payload.treeCount or actor.walletAddress" },
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
    const contract = new Contract(CONTRACT_IDS.journeyOrchestrator);

    const treeCount = Number(payload.treeCount);
    const leafsPerTree = 1000_0000000; // 1000 LEAF por árvore (7 decimais)
    const totalLeafs = BigInt(treeCount * leafsPerTree);
    const carbonDebt = BigInt(treeCount * 500_0000000); // 500 C-Debt por árvore

    // Monta a chamada institutional_onboarding(company, units, carbon_debt, notary_hash, leaf_cashback)
    const sdk = await import("@stellar/stellar-sdk");
    const companyAddress = new Address(actor.walletAddress).toScVal();
    const notaryHash = sdk.nativeToScVal(
      `privy:${actor.privyUserId || "anonymous"}`,
      { type: "string" }
    );

    const call = contract.call(
      "institutional_onboarding",
      companyAddress,
      nativeToScVal(treeCount, { type: "u32" }),
      nativeToScVal(carbonDebt, { type: "i128" }),
      notaryHash,
      nativeToScVal(totalLeafs, { type: "i128" })
    );

    // Usa a conta do relayer como source (ele paga o gas)
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
        { ok: false, error: "Contract simulation failed", details: simulated },
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
        message: "Árvores adquiridas e Folhas liberadas para distribuição.",
        txHash: sendResponse.hash,
        ledger: getResponse.ledger,
        institution: {
          acquiredTrees: treeCount,
          leafsUnlocked: Number(totalLeafs) / 10_000_000,
          carbonDebtAssigned: Number(carbonDebt) / 10_000_000,
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
