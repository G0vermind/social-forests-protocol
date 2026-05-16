import React from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { nurseryTrees } from "../../data/mockData.js";

export function MemberNursery() {
  return (
    <div className="screen-stack">
      <Card>
        <CardHeader eyebrow="Viveiro" title="Use Folhas para resgatar árvores" />
        <p>
          No MVP, o ativo rastreável e verificável é o Mogno Africano. Outras espécies podem aparecer
          como narrativa de preservação, mas não como plantio declarado.
        </p>
      </Card>

      <div className="tree-grid">
        {nurseryTrees.map((tree) => (
          <Card key={tree.id} className="tree-card">
            <div className="tree-visual" aria-hidden="true">
              <span />
            </div>
            <div className="card-row">
              <h3>{tree.name}</h3>
              <Badge tone={tree.status === "Disponível" ? "success" : "warning"}>
                {tree.status}
              </Badge>
            </div>
            <p className="muted">{tree.type}</p>
            <p>{tree.description}</p>
            <div className="card-row">
              <strong>{tree.leafCost} Folhas</strong>
              <Button variant="primary" disabled={tree.status !== "Disponível"}>
                Resgatar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
