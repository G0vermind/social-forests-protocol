import React, { useState } from 'react';

export function InstitutionPageBuilder({ institution, onSave }) {
  const [form, setForm] = useState({
    name: institution.name,
    logo: institution.logo,
    slug: institution.slug,
    welcomeMessage: institution.welcomeMessage,
    primaryColor: institution.primaryColor,
    supportColor: institution.supportColor,
    ctaLabel: institution.ctaLabel,
  });
  const [saved, setSaved] = useState(false);

  function update(key, value) {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
    setSaved(true);
  }

  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Página pública</p>
        <h2>Personalizar página da instituição</h2>
        <p>Crie uma página compartilhável com a identidade da instituição, sem perder a consistência Florestas.</p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <div className="form-row">
          <label>Nome da instituição<input value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
          <label>Logo curto<input value={form.logo} onChange={(e) => update('logo', e.target.value)} maxLength="4" /></label>
        </div>
        <label>Link público<input value={form.slug} onChange={(e) => update('slug', e.target.value)} /></label>
        <label>Mensagem de boas-vindas<textarea value={form.welcomeMessage} onChange={(e) => update('welcomeMessage', e.target.value)} /></label>
        <div className="form-row">
          <label>Cor principal<input type="color" value={form.primaryColor} onChange={(e) => update('primaryColor', e.target.value)} /></label>
          <label>Cor de apoio<input type="color" value={form.supportColor} onChange={(e) => update('supportColor', e.target.value)} /></label>
        </div>
        <label>Texto do botão principal<input value={form.ctaLabel} onChange={(e) => update('ctaLabel', e.target.value)} /></label>
        <button className="primary-button" type="submit">Salvar página</button>
        {saved ? <p className="form-feedback">Página atualizada.</p> : null}
      </form>
    </section>
  );
}
