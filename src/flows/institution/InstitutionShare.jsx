import React, { useMemo, useState } from 'react';
import { getInstitutionPublicLink, publishInstitutionPage } from '../../services/institutionService.js';

export function InstitutionShare({ institution, onSave, onTabChange }) {
  const [copied, setCopied] = useState(false);
  const publicLink = useMemo(() => getInstitutionPublicLink(institution), [institution]);

  async function copyLink() {
    const next = publishInstitutionPage(institution);
    onSave?.(next);
    await navigator.clipboard?.writeText(getInstitutionPublicLink(next));
    setCopied(true);
  }

  async function shareLink() {
    const next = publishInstitutionPage(institution);
    onSave?.(next);
    const link = getInstitutionPublicLink(next);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Página de impacto de ${next.name}`, text: next.welcomeMessage, url: link });
      } else {
        await navigator.clipboard?.writeText(link);
        setCopied(true);
      }
    } catch {
      await navigator.clipboard?.writeText(link);
      setCopied(true);
    }
  }

  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Compartilhar</p>
          <h1>Convide sua comunidade.</h1>
          <p>Distribua o link da página da instituição para clientes, consumidores, membros ou colaboradores participarem das atividades.</p>
        </div>
      </section>

      <section className="share-card form-card">
        <div className="section-heading compact">
          <p className="eyebrow">Link público</p>
          <h2>Página da instituição</h2>
          <p>Ao compartilhar, a página fica marcada como publicada.</p>
        </div>
        <div className="share-link-box"><span>{publicLink}</span></div>
        <div className="inline-actions wrap">
          <button className="button primary md" type="button" onClick={shareLink}>Compartilhar página</button>
          <button className="button secondary md" type="button" onClick={copyLink}>Copiar link</button>
          <button className="button ghost md" type="button" onClick={() => window.open(publicLink, '_blank', 'noopener,noreferrer')}>Abrir página</button>
          <button className="button ghost md" type="button" onClick={() => onTabChange?.('page')}>Editar página</button>
        </div>
        {copied ? <p className="form-feedback">Link copiado. Agora sua comunidade já pode participar.</p> : null}
      </section>
    </div>
  );
}
