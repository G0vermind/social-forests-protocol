import { getExplorerContractUrl } from "./contracts.js";

export function createTechnicalReceipt({ action, payload, account }) {
  const now = new Date();
  const receiptId = `${action.id}-${now.getTime()}`;

  return {
    id: receiptId,
    actionId: action.id,
    label: action.userFacingLabel,
    technicalLabel: action.technicalLabel,
    status: "simulado",
    network: "Stellar Testnet",
    createdAt: now.toISOString(),
    account: {
      privyUserId: account?.privyUserId || null,
      email: account?.email || null,
      activeRole: account?.activeRole || null,
    },
    contract: {
      id: action.primaryContract,
      url: getExplorerContractUrl(action.primaryContract),
    },
    touchedContracts: action.touchedContracts.map((contractId) => ({
      id: contractId,
      url: getExplorerContractUrl(contractId),
    })),
    plannedSorobanMethod: action.plannedSorobanMethod,
    payload,
    note: "Comprovante técnico simulado. Próxima fase: chamada real via backend relayer/Soroban.",
  };
}

export function saveLastReceipt(receipt) {
  localStorage.setItem("fs_last_protocol_receipt", JSON.stringify(receipt));
}

export function getLastReceipt() {
  try {
    return JSON.parse(localStorage.getItem("fs_last_protocol_receipt") || "null");
  } catch {
    return null;
  }
}
