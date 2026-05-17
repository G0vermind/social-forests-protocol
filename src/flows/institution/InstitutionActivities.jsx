import React from 'react';
import { CreateActivity } from './CreateActivity.jsx';
import { formatLeafs, getActivityReservedLeafs, getAvailableLeafs } from '../../utils/leafsMath.js';

export function InstitutionActivities({ institution, onSave, onTabChange }) {
  const available = getAvailableLeafs(institution);
  const activities = institution.activities || [];

  if (available <= 0 && activities.length === 0) {
    return (
      <section className="institution-section screen-stack">
        <div className="section-heading">
          <p className="eyebrow">Atividades</p>
          <h2>Adquira árvores para criar atividades</h2>
          <p>A instituição precisa ter Folhas disponíveis antes de publicar atividades para a comunidade.</p>
        </div>
        <button className="button primary md" type="button" onClick={() => onTabChange?.('trees')}>Adquirir árvores</button>
      </section>
    );
  }

  return (
    <div className="screen-stack">
      <CreateActivity institution={institution} onSave={onSave} />

      <section className="institution-section">
        <div className="section-heading">
          <p className="eyebrow">Atividades criadas</p>
          <h2>Atividades da instituição</h2>
          <p>Acompanhe as atividades publicadas e a reserva de Folhas de cada uma.</p>
        </div>
        {activities.length ? (
          <div className="activity-list">
            {activities.map((activity) => (
              <article className="activity-row" key={activity.id}>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                  <small>{activity.participants || 0}/{activity.participantLimit} participantes · prazo {activity.endDate}</small>
                </div>
                <div className="activity-meta">
                  <span>{activity.status}</span>
                  <strong>{formatLeafs(getActivityReservedLeafs(activity))} Folhas</strong>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="muted">Nenhuma atividade publicada ainda.</p>}
      </section>
    </div>
  );
}
