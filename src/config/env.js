export const env = {
  privyAppId: import.meta.env.VITE_PRIVY_APP_ID || "",
  stellarNetwork: import.meta.env.VITE_STELLAR_NETWORK || "testnet",
  stellarHorizonUrl:
    import.meta.env.VITE_STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
  stellarRpcUrl:
    import.meta.env.VITE_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
  stellarNetworkPassphrase:
    import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
};
