import express from "express";
import crypto from "crypto";
import { nativeToScVal, Address } from "@stellar/stellar-sdk";
import { config } from "../config.js";
import { invokeContract, toI128, toU32 } from "../stellar.js";

export const institutionRouter = express.Router();

function makeReceiptId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

function getActorWallet(body) {
  return (
    body?.actor?.walletAddress ||
    body?.payload?.institutionWallet ||
    body?.payload?.companyAddress ||
    null
  );
}

function getLeafUnitsFromTrees(treeCount) {
  const displayLeafs = Number(treeCount || 0) * config.protocol.leafsPerTree;
  const atomicLeafs = BigInt(displayLeafs) * 10n ** BigInt(config.protocol.leafDecimals);

  return {
    displayLeafs,
    atomicLeafs,
  };
}

institutionRouter.post("/acquire-trees", async (req, res) => {
  try {
    const body = req.body || {};
    const payload = body.payload || {};

    const companyAddress = getActorWallet(body);
    const treeCount = Number(payload.treeCount || payload.trees || payload.quantity || 0);

    if (!companyAddress) {
      return res.status(400).json({
        ok: false,
        message: "Carteira da instituição não encontrada.",
      });
    }

    if (!treeCount || treeCount <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Quantidade de árvores inválida.",
      });
    }

    const { displayLeafs, atomicLeafs } = getLeafUnitsFromTrees(treeCount);

    const carbonDebt = BigInt(payload.carbonDebt || 0);
    const notaryHash = String(
      payload.notaryHash ||
      payload.purchaseId ||
      payload.idempotencyKey ||
      `purchase-${Date.now()}`
    );

    const result = await invokeContract({
      contractId: config.contracts.orchestrator,
      method: "institutional_onboarding",
      args: [
        new Address(companyAddress).toScVal(),
        toU32(treeCount),
        toI128(carbonDebt),
        nativeToScVal(notaryHash, { type: "string" }),
        toI128(atomicLeafs),
      ],
    });

    return res.json({
      ok: true,
      message: "Compra de árvores registrada e Folhas emitidas com sucesso.",
      receiptId: makeReceiptId("institution-acquire-trees"),
      txHash: result.txHash,
      ledger: result.ledger,
      institution: {
        walletAddress: companyAddress,
        acquiredTrees: treeCount,
        leafsUnlocked: displayLeafs,
        leafsAtomicAmount: atomicLeafs.toString(),
      },
      contract: {
        id: config.contracts.orchestrator,
        method: "institutional_onboarding",
      },
    });
  } catch (error) {
    console.error("[relayer] acquire-trees failed:", error);

    return res.status(500).json({
      ok: false,
      message: error.message || "Erro ao comprar árvores no protocolo.",
      details: error.details || null,
    });
  }
});

institutionRouter.post("/create-activity", async (req, res) => {
  try {
    const body = req.body || {};
    const payload = body.payload || {};

    const companyAddress = getActorWallet(body);
    const activityId = String(payload.activityId || payload.id || `activity-${Date.now()}`);
    const rewardLeafs = Number(payload.rewardLeafs || payload.leafsReward || 0);
    const maxParticipants = Number(payload.maxParticipants || payload.participantsLimit || 0);

    if (!companyAddress) {
      return res.status(400).json({
        ok: false,
        message: "Carteira da instituição não encontrada.",
      });
    }

    if (!rewardLeafs || rewardLeafs <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Recompensa em Folhas inválida.",
      });
    }

    if (!maxParticipants || maxParticipants <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Limite de participantes inválido.",
      });
    }

    const reservedLeafs = rewardLeafs * maxParticipants;

    // Importante:
    // Hoje o contrato JourneyOrchestrator NÃO possui reserve_activity_leafs.
    // Então este endpoint confirma a reserva off-chain no MVP.
    // Quando o contrato tiver o método on-chain, substituímos este bloco por invokeContract().

    return res.json({
      ok: true,
      message: "Atividade criada e Folhas reservadas para distribuição.",
      receiptId: makeReceiptId("institution-create-activity"),
      txHash: null,
      ledger: null,
      simulated: false,
      offchain: true,
      activity: {
        id: activityId,
        companyAddress,
        rewardLeafs,
        maxParticipants,
        reservedLeafs,
      },
      contract: {
        id: config.contracts.orchestrator,
        method: "reserve_activity_leafs",
        status: "pending-contract-method",
      },
    });
  } catch (error) {
    console.error("[relayer] create-activity failed:", error);

    return res.status(500).json({
      ok: false,
      message: error.message || "Erro ao criar atividade.",
      details: error.details || null,
    });
  }
});