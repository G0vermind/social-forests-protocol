import { Card, CardHeader } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { stellarConfig } from "../../web3/stellar.js";

export function StellarAccountCard({ connected }) {
  return (
    <Card>
      <CardHeader eyebrow="Stellar Testnet" title="Conta Web3" />
      <div className="stack">
        <div className="row-between">
          <span>Rede</span>
          <Badge tone="neutral">{stellarConfig.network}</Badge>
        </div>
        <div className="row-between">
          <span>Modal Privy</span>
          <Badge tone="warning">Próximo passo</Badge>
        </div>
        <div className="row-between">
          <span>Account abstraction</span>
          <Badge tone="warning">Policy preview</Badge>
        </div>
        <p className="muted">
          O MVP separa ações sem assinatura de ações que exigem política, backend ou smart wallet Soroban.
        </p>
      </div>
    </Card>
  );
}
