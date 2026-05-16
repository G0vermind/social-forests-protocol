import React from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { validationQueue } from "../../data/mockData.js";

export function ValidatorFlow() {
  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Operação</p>
          <h1>Fila de validação.</h1>
          <p>Analise evidências, aprove registros e solicite correções quando necessário.</p>
        </div>
        <Badge tone="warning">3 pendentes</Badge>
      </section>

      <Card>
        <CardHeader eyebrow="Solicitações" title="Itens para análise" />
        <div className="list-stack">
          {validationQueue.map(([title, type, priority]) => (
            <div className="queue-row" key={title}>
              <div>
                <strong>{title}</strong>
                <span>{type}</span>
              </div>
              <Badge tone={priority === "Alta" ? "danger" : priority === "Média" ? "warning" : "default"}>
                {priority}
              </Badge>
              <Button variant="secondary" size="sm">Analisar</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
