import { getProtocolAction } from './actionMap.js';
import { callProtocolRelayer, isRelayerConfigured } from './protocolRelayerClient.js';
import { createTechnicalReceipt, saveLastReceipt } from './technicalReceipts.js';

const EXECUTION_MODE = import.meta.env.VITE_PROTOCOL_EXECUTION_MODE || 'relayer';

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function buildLocalFallbackResult(action, payload) {
  return {
    ok: true,
    simulated: true,
    message: action.userFacingSuccess,
    txHash: null,
    ledger: null,
    receiptId: `${action.id}-local-${Date.now()}`,
    institution: {
      acquiredTrees: payload?.treeCount,
      leafsUnlocked: payload?.leafsUnlocked,
    },
  };
}

export async function executeProtocolAction(actionId, payload = {}, account = {}) {
  const action = getProtocolAction(actionId);

  if (!account?.authenticated) {
    account?.login?.();
    throw new Error('Entre na conta para continuar.');
  }

  let relayerResult;
  if (EXECUTION_MODE === 'mock') {
    await wait(550);
    relayerResult = buildLocalFallbackResult(action, payload);
  } else if (isRelayerConfigured()) {
    relayerResult = await callProtocolRelayer(action, payload, account);
  } else {
    throw new Error('Relayer do protocolo não configurado. Configure VITE_PROTOCOL_RELAYER_URL para comprar árvores e emitir Folhas nos contratos reais.');
  }

  const receipt = createTechnicalReceipt({ action, payload, account, relayerResult });
  saveLastReceipt(receipt);

  return {
    ok: true,
    action,
    receipt,
    relayerResult,
    message: relayerResult?.message || action.userFacingSuccess,
  };
}
