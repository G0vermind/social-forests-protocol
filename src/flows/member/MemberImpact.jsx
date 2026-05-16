import React from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { impactRecords } from "../../data/mockData.js";

export function MemberImpact() {
  return (
    <div className="screen-stack">
      <Card className="impact-hero">
        <CardHeader eyebrow="Impacto" title="Impacto assegurado" />
        <p>
          Aqui você acompanha os registros vinculados à sua conta. Os detalhes técnicos ficam disponíveis
          apenas quando forem úteis.
        </p>
      </Card>

      <div className="list-stack">
        {impactRecords.map((record) => (
          <Card key={record.id}>
            <div className="card-row">
              <div>
                <h3>{record.title}</h3>
                <p className="muted">{record.date}</p>
              </div>
              <Badge tone="success">{record.status}</Badge>
            </div>
            <p>{record.detail}</p>
            <button className="link-button" type="button">
              Ver comprovante
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
