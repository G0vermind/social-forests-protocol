import React from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { AccountStatus } from "../../components/account/AccountStatus.jsx";
import {
  institutionActivities,
  institutionMetrics,
  institutionProfile,
} from "../../data/mockData.js";

export function InstitutionPublicPage({ slug }) {
  const profile = { ...institutionProfile, slug };
  const pageStyle = {
    "--institution-primary": profile.primaryColor,
    "--institution-support": profile.supportColor,
  };

  return (
    <main className="institution-public-page" style={pageStyle}>
      <section className="institution-public-hero">
        <div className="institution-public-topbar">
          <div className="institution-public-logo">{profile.logoText}</div>
          <div>
            <strong>{profile.name}</strong>
            <span>Impacto assegurado por Florestas</span>
          </div>
        </div>

        <div className="institution-public-copy">
          <Badge tone="success">Página da instituição</Badge>
          <h1>{profile.welcome}</h1>
          <p>{profile.message}</p>
          <Button>{profile.cta}</Button>
        </div>
      </section>

      <section className="institution-public-content">
        <AccountStatus />

        <div className="stat-grid">
          {institutionMetrics.map(([label, value]) => (
            <Card key={label} className="stat-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader eyebrow="Atividades disponíveis" title="Participe e receba Folhas" />
          <div className="list-stack">
            {institutionActivities.map((activity) => (
              <article className="public-activity-card" key={activity.id}>
                <div>
                  <Badge tone={activity.status === "Disponível" ? "success" : "warning"}>{activity.status}</Badge>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
                <div>
                  <strong>+{activity.reward} Folhas</strong>
                  <Button size="sm">Participar</Button>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <Card className="trust-card">
          <CardHeader eyebrow="Confiança" title="Impacto acompanhado pela Florestas Social">
            <p>
              Esta instituição adquiriu árvores de Mogno Africano e ativou Folhas para incentivar sua comunidade.
              Detalhes técnicos ficam disponíveis apenas para quem deseja conferir os comprovantes.
            </p>
          </CardHeader>
          <button type="button" className="link-button">Ver detalhes do comprovante</button>
        </Card>
      </section>
    </main>
  );
}
