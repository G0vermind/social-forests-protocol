import React, { useState } from 'react';
import { ACTIVITY_TEMPLATES } from '../../data/activity.mock.js';
import { createInstitutionActivity } from '../../services/institutionService.js';
import { formatLeafs, getActivityReservedLeafs, getAvailableLeafs } from '../../utils/leafsMath.js';

export function CreateActivity({ institution, onSave }) {
  const [form, setForm] = useState({
    title: 'Complete seu cadastro',
    description: 'Convide sua comunidade a completar uma ação simples e receber Folhas.',
    rewardLeafs: 100,
    participantLimit: 25,
    endDate: '30/06/2026',
  });
  const [feedback, setFeedback] = useState('');

  const reservedPreview = getActivityReservedLeafs(form);
  const available = getAvailableLeafs(institution);
  const canCreate = available > 0 && reservedPreview <= available;

  function update(key, value) {
    setFeedback('');
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (available <= 0) {
      setFeedback('Adquira árvores primeiro para liberar Folhas para distribuição.');
      return;
    }
    if (reservedPreview > available) {
      setFeedback('Esta atividade reserva mais Folhas do que o saldo disponível.');
      return;
    }

    const next = createInstitutionActivity(institution, form);
    onSave?.(next);
    setFeedback('Atividade criada e Folhas reservadas. Agora você pode personalizar e compartilhar a página da instituição.');
    setForm((current) => ({ ...current, title: '', description: '' }));
  }

  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Atividades</p>
        <h2>Criar atividade</h2>
        <p>Defina uma ação para sua comunidade e escolha quantas Folhas cada participante poderá receber.</p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <label>
          Modelo rápido
          <select value={form.title} onChange={(event) => update('title', event.target.value)}>
            {ACTIVITY_TEMPLATES.map((template) => <option key={template}>{template}</option>)}
          </select>
        </label>
        <label>
          Nome da atividade
          <input value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="Ex: Responda à pesquisa" />
        </label>
        <label>
          Descrição
          <textarea value={form.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <div className="form-row">
          <label>
            Folhas por participação
            <input type="number" min="1" value={form.rewardLeafs} onChange={(event) => update('rewardLeafs', event.target.value)} />
          </label>
          <label>
            Limite de participantes
            <input type="number" min="1" value={form.participantLimit} onChange={(event) => update('participantLimit', event.target.value)} />
          </label>
        </div>
        <label>
          Encerramento
          <input value={form.endDate} onChange={(event) => update('endDate', event.target.value)} />
        </label>

        <div className="reserve-preview">
          <span>Esta atividade vai reservar</span>
          <strong>{formatLeafs(reservedPreview)} Folhas</strong>
          <small>Disponível agora: {formatLeafs(available)} Folhas</small>
        </div>

        <button className="button primary md" type="submit" disabled={!canCreate}>Publicar atividade</button>
        {feedback ? <p className="form-feedback">{feedback}</p> : null}
      </form>
    </section>
  );
}
