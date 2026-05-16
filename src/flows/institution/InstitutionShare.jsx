import React, { useMemo, useState } from 'react';

export function InstitutionShare({ institution }) {
  const [copied, setCopied] = useState(false);
  const link = useMemo(() => `${window.location.origin}/i/${institution.slug}`, [institution.slug]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Compartilhar</p>
        <h2>Convide sua comunidade</h2>
        <p>Distribua este link para clientes, consumidores, membros ou colaboradores participarem das atividades.</p>
      </div>
      <div className="share-card">
        <span>{link}</span>
        <button className="primary-button" type="button" onClick={copyLink}>{copied ? 'Link copiado' : 'Copiar link'}</button>
      </div>
    </section>
  );
}
