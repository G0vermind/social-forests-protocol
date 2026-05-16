import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";

const activities = [
  { id: 1, title: "Complete a missão da campanha", reward: 100, status: "disponível" },
  { id: 2, title: "Indique um novo membro", reward: 250, status: "disponível" },
  { id: 3, title: "Valide presença em ação da marca", reward: 180, status: "em análise" },
];

export function Atividades() {
  return (
    <div className="page-grid">
      <section className="page-title span-3">
        <p className="eyebrow">Atividades</p>
        <h2>Ganhe Leafs em ações criadas pela marca.</h2>
        <p>O time de relacionamento distribui créditos de Leafs conforme participação e regras da campanha.</p>
      </section>

      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader eyebrow="Campanha" title={activity.title} />
          <div className="row-between">
            <strong>{activity.reward} Leafs</strong>
            <Badge tone={activity.status === "disponível" ? "success" : "warning"}>{activity.status}</Badge>
          </div>
          <button className="btn btn-secondary" type="button">Participar</button>
        </Card>
      ))}
    </div>
  );
}
