import React from 'react';
import { formatLeafs, getAvailableLeafs, getReservedLeafsFromActivities, getTotalLeafsCapacity } from '../../utils/leafsMath.js';

export function InstitutionLeafs({ institution }) {
  const total = getTotalLeafsCapacity(institution);
  const reserved = getReservedLeafsFromActivities(institution.activities || []);
  const distributed = institution.distributedLeafs || 0;
  const available = getAvailableLeafs(institution);

  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Folhas</p>
        <h2>Capacidade de distribuição</h2>
        <p>As Folhas da instituição funcionam como um orçamento de engajamento para sua comunidade.</p>
      </div>

      <div className="stat-grid four">
        <article className="stat-card"><span>Total liberado</span><strong>{formatLeafs(total)}</strong></article>
        <article className="stat-card"><span>Disponível</span><strong>{formatLeafs(available)}</strong></article>
        <article className="stat-card"><span>Reservado</span><strong>{formatLeafs(reserved)}</strong></article>
        <article className="stat-card"><span>Distribuído</span><strong>{formatLeafs(distributed)}</strong></article>
      </div>
    </section>
  );
}
