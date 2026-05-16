import React, { useEffect, useMemo, useState } from 'react';
import { AccountStatus } from '../../components/account/AccountStatus.jsx';
import { loadInstitution } from '../../services/institutionService.js';

function Logo({ institution }) {
  if (institution.logoDataUrl) {
    return <img className="institution-public-logo" src={institution.logoDataUrl} alt={`Logo de ${institution.name}`} />;
  }
  return <div className="institution-public-logo-fallback">{(institution.logo || institution.name.slice(0, 2)).toUpperCase()}</div>;
}

export function InstitutionPublicPage({ slug }) {
  const [institution, setInstitution] = useState(() => loadInstitution());

  useEffect(() => {
    function refresh() {
      setInstitution(loadInstitution());
    }
    window.addEventListener('florestas:institution-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('florestas:institution-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const activities = institution.activities || [];
  const pageStyle = useMemo(
    () => ({ '--institution-primary': institution.primaryColor, '--institution-support': institution.supportColor }),
    [institution.primaryColor, institution.supportColor]
  );

  return (
    <main className="institution-public-page" style={pageStyle}>
      <section className="institution-public-hero">
        <div className="institution-public-topbar">
          <Logo institution={institution} />
          <div>
            <strong>{institution.name}</strong>
            <span>Impacto assegurado por Florestas</span>
          </div>
        </div>

        <div className="institution-public-copy">
          <span className="badge success">Página da instituição</span>
          <h1>{institution.publicHeadline || `Cultive impacto com ${institution.name}.`}</h1>
          <p>{institution.welcomeMessage}</p>
          <button className="button primary md" type="button">{institution.ctaLabel || 'Participar agora'}</button>
        </div>
      </section>

      <section className="institution-public-content">
        <AccountStatus />

        <div className="stat-grid">
          <article className="card stat-card"><span>Árvores adquiridas</span><strong>{institution.acquiredTrees}</strong></article>
          <article className="card stat-card"><span>Folhas ativadas</span><strong>{Number(institution.acquiredTrees || 0) * Number(institution.leafsPerTree || 0)}</strong></article>
          <article className="card stat-card"><span>Participantes</span><strong>{institution.participants}</strong></article>
          <article className="card stat-card"><span>Atividades</span><strong>{activities.length}</strong></article>
        </div>

        <section className="card">
          <div className="card-header"><p className="eyebrow">Atividades disponíveis</p><h2>Participe e receba Folhas</h2></div>
          <div className="list-stack">
            {activities.map((activity) => (
              <article className="public-activity-card" key={activity.id}>
                <div>
                  <span className="badge success">{activity.status || 'Disponível'}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                </div>
                <div>
                  <strong>+{activity.rewardLeafs || activity.reward} Folhas</strong>
                  <button className="button secondary sm" type="button">Participar</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="card trust-card">
          <div className="card-header"><p className="eyebrow">Confiança</p><h2>Impacto acompanhado pela Florestas Social</h2></div>
          <p>Esta instituição adquiriu árvores de Mogno Africano e ativou Folhas para incentivar sua comunidade.</p>
          <button type="button" className="link-button">Ver detalhes do comprovante</button>
        </section>
      </section>
    </main>
  );
}
