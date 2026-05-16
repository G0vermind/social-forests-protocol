import { env } from "../config/env.js";

export const stellarConfig = {
  network: env.stellarNetwork,
  horizonUrl: env.stellarHorizonUrl,
  rpcUrl: env.stellarRpcUrl,
  networkPassphrase: env.stellarNetworkPassphrase,
};

export function shortenAddress(address = "") {
  if (!address || address.length < 12) return address || "Não conectado";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}
