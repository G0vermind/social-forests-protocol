import React, { useMemo, useState } from 'react';
import { LogoUploader } from '../../components/institution/LogoUploader.jsx';
import { ColorControls } from '../../components/institution/ColorControls.jsx';
import { getInstitutionPublicLink, publishInstitutionPage, updateInstitutionPage } from '../../services/institutionService.js';

export function InstitutionPageBuilder({ institution, onSave, onTabChange }) {
  const [form, setForm] = useState({
    name: institution.name || '',
    logo: institution.logo || '',
    logoDataUrl: institution.logoDataUrl || '',
    slug: institution.slug || '',
    publicHeadline: institution.publicHeadline || `Cultive impacto com ${institution.name}.`,
    welcomeMessage: institution.welcomeMessage || '',
    primaryColor: institution.primaryColor || '#2f6b3f',
    supportColor: institution.supportColor || '#d9f2c7',
    ctaLabel: institution.ctaLabel || 'Participar agora',
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicLink = useMemo(() => getInstitutionPublicLink({ ...institution, ...form }), [institution, form]);
  const previewStyle = useMemo(
    () => ({ '--institution-primary': form.primaryColor, '--institution-support': form.supportColor }),
    [form.primaryColor, form.supportColor]
  );

  function update(key, value) {
    setSaved(false);
    setCopied(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateColors(colors) {
    setSaved(false);
    setForm((current) => ({ ...current, ...colors }));
  }

  function savePage({ publish = false } = {}) {
    const updated = updateInstitutionPage(institution, form);
    const next = publish ? publishInstitutionPage(updated) : updated;
    onSave(next);
    setSaved(true);
    return next;
  }

  async function sharePage() {
    const next = savePage({ publish: true });
    const link = getInstitutionPublicLink(next);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Página de impacto de ${next.name}`,
          text: next.welcomeMessage,
          url: link,
        });
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
    <section className="institution-section screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Página pública</p>
        <h2>Personalizar página da instituição</h2>
        <p>Suba a logo, escolha cores simples, salve a página e compartilhe o link com sua comunidade.</p>
      </div>

      <div className="builder-grid">
        <form className="form-card" onSubmit={(event) => { event.preventDefault(); savePage(); }}>
          <LogoUploader value={form.logoDataUrl} onChange={(logoDataUrl) => update('logoDataUrl', logoDataUrl)} />

          <div className="form-row">
            <label>Nome da instituição<input value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
            <label>Iniciais de apoio<input value={form.logo} onChange={(event) => update('logo', event.target.value.toUpperCase())} maxLength="4" /></label>
          </div>

          <label>Link público<input value={form.slug} onChange={(event) => update('slug', event.target.value)} /></label>
          <label>Chamada principal<input value={form.publicHeadline} onChange={(event) => update('publicHeadline', event.target.value)} /></label>
          <label>Mensagem de boas-vindas<textarea value={form.welcomeMessage} onChange={(event) => update('welcomeMessage', event.target.value)} /></label>
          <label>Texto do botão principal<input value={form.ctaLabel} onChange={(event) => update('ctaLabel', event.target.value)} /></label>

          <ColorControls primaryColor={form.primaryColor} supportColor={form.supportColor} onChange={updateColors} />

          <div className="inline-actions wrap sticky-actions">
            <button className="button primary md" type="submit">Salvar página</button>
            <button className="button secondary md" type="button" onClick={sharePage}>Compartilhar página</button>
            <button className="button ghost md" type="button" onClick={() => onTabChange?.('share')}>Ver link</button>
          </div>
          {saved ? <p className="form-feedback">Página atualizada e pronta para compartilhar.</p> : null}
          {copied ? <p className="form-feedback">Link copiado. Agora sua comunidade já pode participar.</p> : null}
        </form>

        <aside className="institution-preview live" style={previewStyle}>
          <div className="preview-top">
            {form.logoDataUrl ? <img className="institution-public-logo" src={form.logoDataUrl} alt={`Logo de ${form.name}`} /> : <div className="institution-public-logo-fallback">{(form.logo || form.name.slice(0, 2)).toUpperCase()}</div>}
            <div><strong>{form.name}</strong><span>Impacto assegurado por Florestas</span></div>
          </div>
          <p className="eyebrow">Prévia da página</p>
          <h2>{form.publicHeadline}</h2>
          <p>{form.welcomeMessage}</p>
          <button type="button">{form.ctaLabel}</button>
          <div className="public-link-preview">{publicLink}</div>
        </aside>
      </div>
    </section>
  );
}
