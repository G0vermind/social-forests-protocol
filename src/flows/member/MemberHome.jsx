import React from "react";
import { AccountStatus } from "../../components/account/AccountStatus.jsx";
import { EnterAccountButton } from "../../components/account/EnterAccountButton.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import { memberSummary } from "../../data/mockData.js";

export function MemberHome() {
  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Florestas Social</p>
          <h1>Seu impacto começa com Folhas.</h1>
          <p>
            Participe de atividades, acumule Folhas e acompanhe o vínculo com árvores reais no Viveiro.
          </p>
        </div>
        <EnterAccountButton />
      </section>

      <AccountStatus />

      <div className="stat-grid">
        <Card className="stat-card">
          <span>Folhas</span>
          <strong>{memberSummary.leafs.toLocaleString("pt-BR")}</strong>
          <small>Disponíveis para resgate</small>
        </Card>
        <Card className="stat-card">
          <span>Viveiro</span>
          <strong>{memberSummary.trees}</strong>
          <small>Árvores vinculadas</small>
        </Card>
      </div>

      <Card>
        <CardHeader eyebrow="Próximo passo" title="Continue sua jornada" />
        <Progress value={memberSummary.nextGoal} label="Meta para novo resgate" />
        <div className="inline-actions">
          <Badge tone="success">{memberSummary.impactStatus}</Badge>
          <span className="muted">Sem termos técnicos no caminho. O registro fica por baixo do capô.</span>
        </div>
      </Card>
    </div>
  );
}
