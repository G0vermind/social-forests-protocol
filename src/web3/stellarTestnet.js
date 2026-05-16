export const stellarTestnetConfig = {
  network: import.meta.env.VITE_STELLAR_NETWORK || "testnet",
  networkPassphrase:
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
  horizonUrl: import.meta.env.VITE_STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
  rpcUrl: import.meta.env.VITE_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
  explorerUrl:
    import.meta.env.VITE_STELLAR_EXPLORER_URL || "https://stellar.expert/explorer/testnet",
};
