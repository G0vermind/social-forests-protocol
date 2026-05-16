import { Badge } from "../ui/Badge.jsx";
import { shortenAddress, stellarConfig } from "../../web3/stellar.js";

export function WalletStatus({ connected, address }) {
  return (
    <div className="wallet-status">
      <Badge tone={connected ? "success" : "warning"}>
        {connected ? "Web3 ativo" : "Web3 pendente"}
      </Badge>
      <span>{connected ? shortenAddress(address) : "Conecte para ações on-chain"}</span>
      <small>{stellarConfig.network} · Stellar</small>
    </div>
  );
}
