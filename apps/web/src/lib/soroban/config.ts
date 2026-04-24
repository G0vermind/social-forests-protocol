import * as StellarSdk from '@stellar/stellar-sdk';

export const NETWORK = {
  name:              'testnet',
  networkPassphrase: StellarSdk.Networks.TESTNET,
  rpcUrl:            'https://soroban-testnet.stellar.org',
  horizonUrl:        'https://horizon-testnet.stellar.org',
} as const;

// Endereços dos contratos deployados na Testnet
// Atualizar após cada deploy com: stellar contract deploy ...
export const CONTRACT_IDS = {
  rwa_vault:       process.env.NEXT_PUBLIC_RWA_VAULT_ID       ?? '',
  sbt_reputation:  process.env.NEXT_PUBLIC_SBT_REPUTATION_ID  ?? '',
  hero_journey:    process.env.NEXT_PUBLIC_HERO_JOURNEY_ID    ?? '',
} as const;

export const rpcServer    = new StellarSdk.rpc.Server(NETWORK.rpcUrl);
export const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);
