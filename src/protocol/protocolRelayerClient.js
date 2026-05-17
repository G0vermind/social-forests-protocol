import { CONTRACT_IDS, STELLAR_NETWORKS } from './contracts.js';

export function getRelayerBaseUrl() {
  return String(import.meta.env.VITE_PROTOCOL_RELAYER_URL || '').replace(/\/$/, '');
}

export function isRelayerConfigured() {
  return Boolean(getRelayerBaseUrl());
}

async function getPrivyToken(account) {
  if (typeof account?.getAccessToken !== 'function') return null;
  try {
    return await account.getAccessToken();
  } catch {
    return null;
  }
}

export async function callProtocolRelayer(action, payload, account) {
  const baseUrl = getRelayerBaseUrl();
  if (!baseUrl) {
    throw new Error('Relayer do protocolo não configurado. Defina VITE_PROTOCOL_RELAYER_URL na Vercel para executar contratos reais.');
  }

  const token = await getPrivyToken(account);
  const response = await fetch(`${baseUrl}${action.relayerPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Florestas-Action': action.id,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      actionId: action.id,
      network: {
        name: STELLAR_NETWORKS.testnet.name,
        passphrase: STELLAR_NETWORKS.testnet.passphrase,
        rpcUrl: STELLAR_NETWORKS.testnet.rpcUrl,
      },
      contracts: {
        orchestrator: CONTRACT_IDS.FINAL_ORCHESTRATOR,
        companySbt: CONTRACT_IDS.COMPANY_SBT,
        masterChief: CONTRACT_IDS.MASTERCHIEF_COLLATERAL,
        leafToken: CONTRACT_IDS.LEAF_TOKEN,
      },
      method: action.orchestratorMethod,
      actor: {
        privyUserId: account?.privyUserId || null,
        email: account?.email || null,
        walletAddress: account?.walletAddress || null,
        activeRole: account?.activeRole || null,
      },
      payload,
      idempotencyKey: payload?.idempotencyKey,
    }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || data?.ok === false) {
    throw new Error(data?.message || data?.error || 'Não foi possível concluir a ação no protocolo.');
  }

  return data || { ok: true };
}
