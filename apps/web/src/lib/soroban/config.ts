import * as StellarSdk from '@stellar/stellar-sdk';

export const NETWORK = {
  name: 'testnet',
  networkPassphrase: StellarSdk.Networks.TESTNET,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  horizonUrl: 'https://horizon-testnet.stellar.org', // Link para saldo de XLM
} as const;

export const CONTRACT_IDS = {
  rwa_vault: 'CBBECVILQYMFY3FQ3EEKQYGY3AIW2MVVQLSDXWSYPLITZXCF4SPHZPSL',
  hero_journey: 'CBNPPKTNIO3GRMDMSFK2YLBDBMYM3CPG6KY7XER6KBYD56UV3W4WH72X',
  leaf_token: 'CBBECVILQYMFY3FQ3EEKQYGY3AIW2MVVQLSDXWSYPLITZXCF4SPHZPSL',
  sbt_reputation: 'CBBECVILQYMFY3FQ3EEKQYGY3AIW2MVVQLSDXWSYPLITZXCF4SPHZPSL',
} as const;

// Motor para Smart Contracts (Soroban)
export const rpcServer = new StellarSdk.rpc.Server(NETWORK.rpcUrl);

// 🟢 MOTOR PARA SALDO DE MOEDAS (Horizon) - ADICIONADO PARA TIRAR O ERRO
export const horizonServer = new StellarSdk.Horizon.Server(NETWORK.horizonUrl);