export const STELLAR_NETWORKS = {
  testnet: {
    name: "Stellar Testnet",
    passphrase: import.meta.env.VITE_STELLAR_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
    horizonUrl: import.meta.env.VITE_STELLAR_HORIZON_URL || "https://horizon-testnet.stellar.org",
    rpcUrl: import.meta.env.VITE_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
    explorerUrl: import.meta.env.VITE_STELLAR_EXPLORER_URL || "https://stellar.expert/explorer/testnet",
  },
};

export const CONTRACT_IDS = {
  LEAF_TOKEN: "CDJQLHVAZDENXOXUMIDKYVZSLMXDRL3UUTMRP3SCC4YQAH6YLN6UU42X",
  GUARDIAN_SBT: "CBDHSG7DKVL3JUJALB5VKDQFYJLFKXXYM2WN2XE6GGXBQWSF7F5XGTSE",
  COMPANY_SBT: "CCMWNVLPVJ5WSD5BEQBUMQLE7JMTQS2THTFVI4G2OQ3UZISSSYLGSVEQ",
  MASTERCHIEF_COLLATERAL: "CAW55PMUSPCJYG3U66M4O544XHDH62YTPDN2GIIFXBR7LRS5Q333X76K",
  MYTHOS_VAULT_DNFT: "CBCTY64FH4GJBWDRU6CHLUHESEXCKAC3WNQR43FEPM5UOPSMDARMOX24",
  FINAL_ORCHESTRATOR: "CDPDH4H4XYEW3DQHYFKR33HXDTOO472IQLO4FNWYA5QZFM6JT74RXH57",
};

export const CONTRACT_LABELS = {
  LEAF_TOKEN: "Folhas",
  GUARDIAN_SBT: "Identidade Guardiã",
  COMPANY_SBT: "Registro da Instituição",
  MASTERCHIEF_COLLATERAL: "Gestor de Ativos Biológicos",
  MYTHOS_VAULT_DNFT: "Viveiro Rastreável",
  FINAL_ORCHESTRATOR: "Orquestrador do Protocolo",
};

export function getExplorerContractUrl(contractId) {
  const baseUrl = STELLAR_NETWORKS.testnet.explorerUrl;
  return `${baseUrl}/contract/${contractId}`;
}
