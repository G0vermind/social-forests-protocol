import { getExplorerContractUrl, getExplorerTransactionUrl } from './contracts.js';

export function createTechnicalReceipt({ action, payload, account, relayerResult }) {
  const now = new Date();
  const txHash = relayerResult?.txHash || relayerResult?.hash || relayerResult?.transactionHash || null;

  return {
    id: relayerResult?.receiptId || `${action.id}-${now.getTime()}`,
    actionId: action.id,
    label: action.userFacingLabel,
    technicalLabel: action.technicalLabel,
    status: txHash ? 'registrado' : 'confirmado',
    network: 'Stellar Testnet',
    createdAt: relayerResult?.createdAt || now.toISOString(),
    ledger: relayerResult?.ledger || null,
    txHash,
    txUrl: getExplorerTransactionUrl(txHash),
    account: {
      privyUserId: account?.privyUserId || null,
      email: account?.email || null,
      activeRole: account?.activeRole || null,
    },
    contract: {
      id: action.primaryContract,
      url: getExplorerContractUrl(action.primaryContract),
    },
    touchedContracts: action.touchedContracts.map((contractId) => ({ id: contractId, url: getExplorerContractUrl(contractId) })),
    plannedSorobanMethod: action.orchestratorMethod,
    payload,
    relayerResult,
    note: txHash
      ? 'Comprovante técnico gerado a partir de transação enviada pelo relayer do protocolo.'
      : 'Ação confirmada pelo relayer. A transação ainda não retornou hash público.',
  };
}

export function saveLastReceipt(receipt) {
  localStorage.setItem('fs_last_protocol_receipt', JSON.stringify(receipt));
}

export function getLastReceipt() {
  try { return JSON.parse(localStorage.getItem('fs_last_protocol_receipt') || 'null'); } catch { return null; }
}
