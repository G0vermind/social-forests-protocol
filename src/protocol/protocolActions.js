import { getProtocolAction } from "./actionMap.js";
import { createTechnicalReceipt, saveLastReceipt } from "./technicalReceipts.js";

const MOCK_LATENCY_MS = 650;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeProtocolAction(actionId, payload = {}, account = {}) {
  const action = getProtocolAction(actionId);

  await wait(MOCK_LATENCY_MS);

  const receipt = createTechnicalReceipt({ action, payload, account });
  saveLastReceipt(receipt);

  return {
    ok: true,
    action,
    receipt,
    message: action.userFacingSuccess,
  };
}

export async function acquireInstitutionTrees({ institution, treePackage, quantity = 1 }, account) {
  return executeProtocolAction(
    "INSTITUTION_ACQUIRE_TREES",
    {
      institutionId: institution?.id,
      institutionName: institution?.profile?.name || institution?.name,
      packageId: treePackage?.id,
      packageName: treePackage?.name,
      treeCount: Number(treePackage?.treeCount || treePackage?.trees || 0) * Number(quantity || 1),
      leafsUnlocked: Number(treePackage?.leafs || treePackage?.totalLeafs || 0) * Number(quantity || 1),
      quantity,
    },
    account
  );
}
