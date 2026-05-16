import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";

export function Perfil({ connected }) {
  return (
    <div className="page-grid">
      <Card className="span-2">
        <CardHeader eyebrow="Perfil" title="Membro Florestas" />
        <div className="stack">
          <div className="row-between"><span>Status</span><Badge tone="success">ativo</Badge></div>
          <div className="row-between"><span>Privy</span><Badge tone="warning">configurar</Badge></div>
          <div className="row-between"><span>Wallet</span><Badge tone={connected ? "success" : "warning"}>{connected ? "conectada" : "pendente"}</Badge></div>
        </div>
      </Card>
    </div>
  );
}
