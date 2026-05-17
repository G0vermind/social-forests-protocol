import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { AcquireTrees } from './AcquireTrees.jsx';
import { InstitutionActivities } from './InstitutionActivities.jsx';
import { InstitutionLeafs } from './InstitutionLeafs.jsx';
import { InstitutionPageBuilder } from './InstitutionPageBuilder.jsx';
import { InstitutionShare } from './InstitutionShare.jsx';
import { getInstitutionSummary, getInstitutionPublicLink, loadInstitution, saveInstitution } from '../../services/institutionService.js';

const formatNumber = (value) => new Intl.NumberFormat('pt-BR').format(value || 0);

function LockedStep({ title, description, cta, onClick }) {
  return (
    <section className="institution-section screen-stack">
      <div className="section-heading">
        <p className="eyebrow">Próxima etapa</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <button className="button primary md" type="button" onClick={onClick}>{cta}</button>
    </section>
  );
}

function InstitutionHome({ institution, onTabChange }) {
  const summary = getInstitutionSummary(institution);
  const canCreateActivities = summary.availableLeafs > 0;
  const canCustomizePage = summary.activitiesCount > 0;

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
          <Button variant="secondary" onClick={() => canCreateActivities ? onTabChange('activities') : onTabChange('trees')}>
            Criar atividade
          </Button>
          <Button variant="secondary" onClick={() => canCustomizePage ? onTabChange('page') : onTabChange(canCreateActivities ? 'activities' : 'trees')}>
            Editar página
          </Button>
        </div>
      </section>

      <div className="stat-grid">
        <Card className="stat-card"><span>Árvores adquiridas</span><strong>{formatNumber(summary.acquiredTrees)}</strong></Card>
        <Card className="stat-card"><span>Folhas disponíveis</span><strong>{formatNumber(summary.availableLeafs)}</strong></Card>
        <Card className="stat-card"><span>Atividades</span><strong>{formatNumber(summary.activitiesCount)}</strong></Card>
        <Card className="stat-card"><span>Participantes</span><strong>{formatNumber(summary.participants)}</strong></Card>
      </div>

      <Card>
        <CardHeader eyebrow="Jornada" title="Da árvore à atividade" />
        <div className="timeline-list">
          <div><Badge tone={summary.acquiredTrees ? 'success' : 'warning'}>1</Badge><span>Adquirir árvores e ativar impacto assegurado</span></div>
          <div><Badge tone={summary.totalLeafs ? 'success' : 'warning'}>2</Badge><span>Receber Folhas disponíveis para distribuir</span></div>
          <div><Badge tone={summary.activitiesCount ? 'success' : 'warning'}>3</Badge><span>Criar atividades para a comunidade</span></div>
          <div><Badge tone={institution.pagePublished ? 'success' : undefined}>4</Badge><span>Personalizar e compartilhar a página da instituição</span></div>
        </div>
      </Card>

      <Card className="share-card">
        <CardHeader eyebrow="Página compartilhável" title={institution.pagePublished ? 'Página publicada' : 'Finalize sua página'}>
          <p>{institution.pagePublished ? 'Sua página já pode ser distribuída para a comunidade.' : 'Crie ao menos uma atividade antes de compartilhar sua página.'}</p>
        </CardHeader>
        <div className="share-link-box"><span>{getInstitutionPublicLink(institution)}</span></div>
        <div className="inline-actions wrap">
          <Button onClick={() => canCustomizePage ? onTabChange('page') : onTabChange(canCreateActivities ? 'activities' : 'trees')}>
            {institution.pagePublished ? 'Editar página' : 'Finalizar página'}
          </Button>
          <Button variant="secondary" onClick={() => canCustomizePage ? onTabChange('share') : onTabChange(canCreateActivities ? 'activities' : 'trees')}>Compartilhar</Button>
        </div>
      </Card>
    </div>
  );
}

export function InstitutionFlow({ tab = 'home', onTabChange }) {
  const [institution, setInstitution] = useState(() => loadInstitution());
  const summary = getInstitutionSummary(institution);

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
  if (tab === 'activities') return summary.availableLeafs > 0
    ? <InstitutionActivities institution={institution} onSave={handleSave} onTabChange={onTabChange} />
    : <LockedStep title="Adquira árvores antes de criar atividades" description="A criação de atividades é habilitada quando a instituição possui Folhas disponíveis para distribuir." cta="Adquirir árvores" onClick={() => onTabChange?.('trees')} />;
  if (tab === 'page') return summary.activitiesCount > 0
    ? <InstitutionPageBuilder institution={institution} onSave={handleSave} onTabChange={onTabChange} />
    : <LockedStep title="Crie uma atividade antes de customizar a página" description="A página pública apresenta as atividades disponíveis para a comunidade. Publique a primeira atividade para liberar esta etapa." cta="Criar atividade" onClick={() => onTabChange?.(summary.availableLeafs > 0 ? 'activities' : 'trees')} />;
  if (tab === 'share') return summary.activitiesCount > 0
    ? <InstitutionShare institution={institution} onSave={handleSave} onTabChange={onTabChange} />
    : <LockedStep title="Publique uma atividade antes de compartilhar" description="Assim sua comunidade já encontra uma ação ativa ao acessar o link da instituição." cta="Criar atividade" onClick={() => onTabChange?.(summary.availableLeafs > 0 ? 'activities' : 'trees')} />;
  return <InstitutionHome institution={institution} onTabChange={onTabChange} />;
}
