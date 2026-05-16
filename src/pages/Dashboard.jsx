import { Card, CardHeader } from "../components/ui/Card.jsx";
import { StatCard } from "../components/ui/StatCard.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { leafsWallet, leafsHistory } from "../features/folhas/leafs.mock.js";
import { impactStats } from "../features/impacto/impact.mock.js";
import { StellarAccountCard } from "../components/web3/StellarAccountCard.jsx";

export function Dashboard({ onNavigate, connected }) {
  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Dashboard do membro</p>
          <h2>Seu viveiro está pronto para crescer.</h2>
          <p>
            Acumule Leafs em atividades, resgate árvores de Mogno Africano e acompanhe o impacto assegurado no protocolo.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate("viveiro")} type="button">
          Resgatar no viveiro
        </button>
      </section>

      <div className="stats-grid">
        <StatCard label="Leafs disponíveis" value={leafsWallet.balance.toLocaleString("pt-BR")} hint={leafsWallet.conversionHint} />
        <StatCard label="Leafs pendentes" value={leafsWallet.pending.toLocaleString("pt-BR")} hint="Aguardando validação" />
        <StatCard label="Árvores vinculadas" value={impactStats.linkedTrees} hint={impactStats.verifiedAsset} />
        <StatCard label="Impacto assegurado" value={impactStats.assuredImpact} hint={impactStats.location} />
      </div>

      <Card className="span-2">
        <CardHeader eyebrow="Leafs" title="Histórico recente" />
        <div className="list">
          {leafsHistory.map((item) => (
            <div className="list-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.amount} Leafs</span>
              </div>
              <Badge tone={item.status === "confirmado" ? "success" : "warning"}>{item.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <StellarAccountCard connected={connected} />
    </div>
  );
}
