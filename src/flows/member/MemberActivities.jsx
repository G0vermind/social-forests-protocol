import React from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { activities } from "../../data/mockData.js";

export function MemberActivities() {
  return (
    <div className="screen-stack">
      <Card>
        <CardHeader
          eyebrow="Atividades"
          title="Ganhe Folhas participando"
        >
          <p>As marcas criam experiências e você recebe Folhas ao concluir cada etapa.</p>
        </CardHeader>
      </Card>

      <div className="list-stack">
        {activities.map((activity) => (
          <Card key={activity.id} className="activity-card">
            <div>
              <div className="card-row">
                <h3>{activity.title}</h3>
                <Badge tone={activity.status === "Disponível" ? "success" : "warning"}>
                  {activity.status}
                </Badge>
              </div>
              <p>{activity.description}</p>
              <strong className="leaf-reward">+{activity.reward} Folhas</strong>
            </div>
            <Button variant="secondary">Participar</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
