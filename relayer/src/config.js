import dotenv from 'dotenv';

dotenv.config();

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }

  return value;
}

function optional(name, fallback = '') {
  return process.env[name] || fallback;
}

export const config = {
  port: Number(optional('PORT', '8787')),
  nodeEnv: optional('NODE_ENV', 'development'),

  stellar: {
    network: optional('STELLAR_NETWORK', 'testnet'),
    rpcUrl: required('STELLAR_RPC_URL'),
    networkPassphrase: required('STELLAR_NETWORK_PASSPHRASE'),
    relayerSecretKey: required('RELAYER_SECRET_KEY'),
  },

  contracts: {
    orchestrator: required('FINAL_ORCHESTRATOR_CONTRACT_ID'),
    companySbt: required('COMPANY_SBT_CONTRACT_ID'),
    masterChief: required('MASTERCHIEF_COLLATERAL_CONTRACT_ID'),
    leafToken: required('LEAF_TOKEN_CONTRACT_ID'),
  },

  privy: {
    appId: required('PRIVY_APP_ID'),
    appSecret: required('PRIVY_APP_SECRET'),
  },

  corsOrigin: optional('CORS_ORIGIN', '*'),
};