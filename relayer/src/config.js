import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT || 8787),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "*",

  stellar: {
    network: process.env.STELLAR_NETWORK || "testnet",
    rpcUrl: required("STELLAR_RPC_URL"),
    networkPassphrase: required("STELLAR_NETWORK_PASSPHRASE"),
    relayerSecretKey: required("RELAYER_SECRET_KEY"),
  },

  contracts: {
    orchestrator: required("FINAL_ORCHESTRATOR_CONTRACT_ID"),
    leafToken: required("LEAF_TOKEN_CONTRACT_ID"),
    companySbt: required("COMPANY_SBT_CONTRACT_ID"),
    masterChief: required("MASTERCHIEF_COLLATERAL_CONTRACT_ID"),
    mythosVault: required("MYTHOS_VAULT_CONTRACT_ID"),
    guardianSbt: required("GUARDIAN_SBT_CONTRACT_ID"),
  },

  protocol: {
    leafsPerTree: Number(process.env.LEAFS_PER_TREE || 1000),
    leafDecimals: Number(process.env.LEAF_DECIMALS || 7),
  },
};