import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { AcquireTrees } from './AcquireTrees.jsx';
import { CreateActivity } from './CreateActivity.jsx';
import { InstitutionActivities } from './InstitutionActivities.jsx';
import { InstitutionLeafs } from './InstitutionLeafs.jsx';
import { InstitutionPageBuilder } from './InstitutionPageBuilder.jsx';
import { InstitutionShare } from './InstitutionShare.jsx';
import { getInstitutionSummary, getInstitutionPublicLink, loadInstitution, saveInstitution } from '../../services/institutionService.js';

const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value || 0);

function InstitutionHome({ institution, onTabChange }) {
  const summary = getInstitutionSummary(institution);
  return (
    <div className="screen-stack">
      <section className="hero-card institution-hero">
        <div>
          <p className="eyebrow">Instituição</p>
          <h1>Ative impacto com sua comunidade.</h1>
          <p>Adquira árvores de Mogno Africano, receba Folhas para distribuir e crie atividades para clientes, consumidores, membros ou colaboradores.</p>
        </div>
        <div className="inline-actions hero-actions wrap">
          <Button onClick={() => onTabChange('trees')}>Adquirir árvores</Button>
          <Button variant="secondary" onClick={() => onTabChange('activities')}>Criar atividade</Button>
          <Button variant="secondary" onClick={() => onTabChange('page')}>Editar página</Button>
        </div>
      </section>

      <div className="stat-grid">
        <Card className="stat-card"><span>Árvores adquiridas</span><strong>{formatNumber(institution.acquiredTrees)}</strong></Card>
        <Card className="stat-card"><span>Folhas disponíveis</span><strong>{formatNumber(summary.availableLeafs)}</strong></Card>
        <Card className="stat-card"><span>Atividades</span><strong>{formatNumber(summary.activitiesCount)}</strong></Card>
        <Card className="stat-card"><span>Participantes</span><strong>{formatNumber(summary.participants)}</strong></Card>
      </div>

      <Card>
        <CardHeader eyebrow="Jornada" title="Da árvore à atividade" />
        <div className="timeline-list">
          <div><Badge tone="success">1</Badge><span>Adquirir árvores e ativar impacto assegurado</span></div>
          <div><Badge tone="success">2</Badge><span>Receber Folhas disponíveis para distribuir</span></div>
          <div><Badge tone="warning">3</Badge><span>Criar atividades para a comunidade</span></div>
          <div><Badge>4</Badge><span>Compartilhar a página da instituição</span></div>
        </div>
      </Card>

      <Card className="share-card">
        <CardHeader eyebrow="Página compartilhável" title={institution.pagePublished ? 'Página publicada' : 'Finalize sua página'}>
          <p>{institution.pagePublished ? 'Sua página já pode ser distribuída para a comunidade.' : 'Personalize logo, cores e mensagem antes de compartilhar.'}</p>
        </CardHeader>
        <div className="share-link-box"><span>{getInstitutionPublicLink(institution)}</span></div>
        <div className="inline-actions wrap">
          <Button onClick={() => onTabChange('page')}>{institution.pagePublished ? 'Editar página' : 'Finalizar página'}</Button>
          <Button variant="secondary" onClick={() => onTabChange('share')}>Compartilhar</Button>
        </div>
      </Card>
    </div>
  );
}

export function InstitutionFlow({ tab = 'home', onTabChange }) {
  const [institution, setInstitution] = useState(() => loadInstitution());

  useEffect(() => {
    function refresh() { setInstitution(loadInstitution()); }
    window.addEventListener('florestas:institution-updated', refresh);
    return () => window.removeEventListener('florestas:institution-updated', refresh);
  }, []);

  function handleSave(next) {
    setInstitution(next);
    saveInstitution(next);
  }

  if (tab === 'trees') return <AcquireTrees institution={institution} onSave={handleSave} />;
  if (tab === 'leafs') return <InstitutionLeafs institution={institution} />;
  if (tab === 'activities') return <InstitutionActivities institution={institution} onSave={handleSave} onTabChange={onTabChange} />;
  if (tab === 'page') return <InstitutionPageBuilder institution={institution} onSave={handleSave} onTabChange={onTabChange} />;
  if (tab === 'share') return <InstitutionShare institution={institution} onSave={handleSave} onTabChange={onTabChange} />;
  return <InstitutionHome institution={institution} onTabChange={onTabChange} />;
}
