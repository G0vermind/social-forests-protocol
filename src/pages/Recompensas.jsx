import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";

const rewards = [
  { id: 1, title: "Resgate de Mogno Africano", cost: 1000, type: "viveiro" },
  { id: 2, title: "Badge de impacto", cost: 300, type: "perfil" },
  { id: 3, title: "Acesso a campanha especial", cost: 500, type: "marca" },
];

export function Recompensas({ leafsBalance }) {
  return (
    <div className="page-grid">
      <section className="page-title span-3">
        <p className="eyebrow">Recompensas</p>
        <h2>Use Leafs para ativar benefícios.</h2>
        <p>Resgates de impacto real exigem validação e, futuramente, registro on-chain.</p>
      </section>

      {rewards.map((reward) => (
        <Card key={reward.id}>
          <CardHeader eyebrow={reward.type} title={reward.title} />
          <div className="row-between">
            <strong>{reward.cost} Leafs</strong>
            <Badge tone={leafsBalance >= reward.cost ? "success" : "warning"}>
              {leafsBalance >= reward.cost ? "disponível" : "saldo insuficiente"}
            </Badge>
          </div>
          <button className="btn btn-secondary" disabled={leafsBalance < reward.cost} type="button">
            Resgatar
          </button>
        </Card>
      ))}
    </div>
  );
}
