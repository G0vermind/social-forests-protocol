import React from 'react';
import { formatLeafs, getActivityReservedLeafs } from '../../utils/leafsMath.js';

export function InstitutionActivities({ institution }) {
  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Atividades criadas</p>
        <h2>Atividades da instituição</h2>
        <p>Acompanhe as atividades publicadas e a reserva de Folhas de cada uma.</p>
      </div>
      <div className="activity-list">
        {(institution.activities || []).map((activity) => (
          <article className="activity-row" key={activity.id}>
            <div>
              <strong>{activity.title}</strong>
              <p>{activity.description}</p>
              <small>{activity.participants}/{activity.participantLimit} participantes · prazo {activity.endDate}</small>
            </div>
            <div className="activity-meta">
              <span>{activity.status}</span>
              <strong>{formatLeafs(getActivityReservedLeafs(activity))} Folhas</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
