import React from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { producerLots } from "../../data/mockData.js";

export function ProducerFlow() {
  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Produtor</p>
          <h1>Área produtiva e evidências.</h1>
          <p>Acompanhe lotes de Mogno Africano, status de validação e histórico de manejo.</p>
        </div>
        <Badge tone="success">Cadastro ativo</Badge>
      </section>

      <Card>
        <CardHeader eyebrow="Lotes" title="Árvores cadastradas" />
        <div className="table-list">
          {producerLots.map(([lot, species, quantity, status]) => (
            <div key={lot} className="table-row">
              <strong>{lot}</strong>
              <span>{species}</span>
              <span>{quantity}</span>
              <Badge tone={status === "Verificado" ? "success" : "warning"}>{status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
