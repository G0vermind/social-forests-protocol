import React, { useState } from 'react';
import { ACTIVITY_TEMPLATES } from '../../data/activity.mock.js';
import { getAvailableLeafs, getActivityReservedLeafs, formatLeafs } from '../../utils/leafsMath.js';

export function CreateActivity({ institution, onCreate }) {
  const [form, setForm] = useState({
    title: 'Complete seu cadastro',
    description: 'Convide sua comunidade a completar uma ação simples e receber Folhas.',
    rewardLeafs: 100,
    participantLimit: 25,
    endDate: '30/06/2026',
  });
  const [feedback, setFeedback] = useState('');

  const preview = getActivityReservedLeafs(form);
  const available = getAvailableLeafs(institution);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const result = onCreate(form);
    setFeedback(result.ok ? 'Atividade criada e Folhas reservadas.' : result.error);
    if (result.ok) {
      setForm((current) => ({ ...current, title: '', description: '' }));
    }
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
          <select value={form.title} onChange={(e) => update('title', e.target.value)}>
            {ACTIVITY_TEMPLATES.map((template) => <option key={template}>{template}</option>)}
          </select>
        </label>
        <label>
          Nome da atividade
          <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Ex: Responda à pesquisa" />
        </label>
        <label>
          Descrição
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} />
        </label>
        <div className="form-row">
          <label>
            Folhas por participação
            <input type="number" min="1" value={form.rewardLeafs} onChange={(e) => update('rewardLeafs', e.target.value)} />
          </label>
          <label>
            Limite de participantes
            <input type="number" min="1" value={form.participantLimit} onChange={(e) => update('participantLimit', e.target.value)} />
          </label>
        </div>
        <label>
          Encerramento
          <input value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
        </label>

        <div className="reserve-preview">
          <span>Esta atividade vai reservar</span>
          <strong>{formatLeafs(preview)} Folhas</strong>
          <small>Disponível agora: {formatLeafs(available)} Folhas</small>
        </div>

        <button className="primary-button" type="submit">Publicar atividade</button>
        {feedback ? <p className="form-feedback">{feedback}</p> : null}
      </form>
    </section>
  );
}
