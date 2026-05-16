import { Card, CardHeader } from "../components/ui/Card.jsx";
import { StatCard } from "../components/ui/StatCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { impactStats } from "../features/impacto/impact.mock.js";

export function Impacto() {
  return (
    <div className="page-grid">
      <section className="page-title span-3">
        <p className="eyebrow">Impacto assegurado</p>
        <h2>Rastreabilidade antes de promessa.</h2>
        <p>O MVP trabalha com Mogno Africano como colateral florestal rastreável e verificável.</p>
      </section>

      <div className="stats-grid span-3">
        <StatCard label="Árvores vinculadas" value={impactStats.linkedTrees} hint={impactStats.verifiedAsset} />
        <StatCard label="Localização" value={impactStats.location} hint="Origem do ativo" />
        <StatCard label="Rede" value={impactStats.network} hint="Ambiente de teste" />
      </div>

      <Card className="span-2">
        <CardHeader eyebrow="Verificação" title="Linha do tempo" />
        <div className="timeline">
          <div><Badge tone="success">feito</Badge><span>Ativo mapeado no MVP</span></div>
          <div><Badge tone="warning">próximo</Badge><span>Integração Stellar Testnet</span></div>
          <div><Badge tone="warning">próximo</Badge><span>Registro de impacto on-chain</span></div>
        </div>
      </Card>
    </div>
  );
}
