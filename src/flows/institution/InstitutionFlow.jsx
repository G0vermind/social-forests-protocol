import React, { useMemo, useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";
import { Progress } from "../../components/ui/Progress.jsx";
import {
  institutionActivities,
  institutionLeafs,
  institutionMetrics,
  institutionProfile,
  treePackages,
} from "../../data/mockData.js";

const formatNumber = (value) => new Intl.NumberFormat("pt-BR").format(value);

function InstitutionHome({ onTabChange }) {
  return (
    <div className="screen-stack">
      <section className="hero-card institution-hero">
        <div>
          <p className="eyebrow">Instituição</p>
          <h1>Ative impacto com sua comunidade.</h1>
          <p>
            Adquira árvores de Mogno Africano, receba Folhas para distribuir e crie atividades para clientes, consumidores, membros ou colaboradores.
          </p>
        </div>
        <div className="inline-actions hero-actions">
          <Button onClick={() => onTabChange("activities")}>Criar atividade</Button>
          <Button variant="secondary" onClick={() => onTabChange("page")}>Editar página</Button>
        </div>
      </section>

      <div className="stat-grid">
        {institutionMetrics.map(([label, value]) => (
          <Card key={label} className="stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </Card>
        ))}
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
    </div>
  );
}

function AcquireTrees() {
  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Árvores</p>
          <h1>Adquira árvores e libere Folhas.</h1>
          <p>
            Cada pacote ativa árvores de Mogno Africano e uma quantidade equivalente de Folhas para distribuir em atividades da instituição.
          </p>
        </div>
      </section>

      <div className="package-grid">
        {treePackages.map((pkg) => (
          <Card key={pkg.id} className="package-card">
            <div className="package-visual"><span>{pkg.trees}</span></div>
            <CardHeader eyebrow="Pacote" title={pkg.name}>
              <p>{pkg.description}</p>
            </CardHeader>
            <div className="package-meta">
              <strong>{formatNumber(pkg.trees)} árvores</strong>
              <span>{formatNumber(pkg.leafs)} Folhas para distribuir</span>
            </div>
            <div className="inline-actions">
              <Button>Adquirir pacote</Button>
              <Badge tone={pkg.status === "Disponível" ? "success" : "warning"}>{pkg.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InstitutionActivities() {
  const [draftReward, setDraftReward] = useState(100);
  const reserved = draftReward * 100;

  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Atividades</p>
          <h1>Crie ações para distribuir Folhas.</h1>
          <p>
            Defina uma atividade, escolha a recompensa em Folhas e publique para a comunidade da instituição.
          </p>
        </div>
        <Button>Publicar atividade</Button>
      </section>

      <Card className="form-card">
        <CardHeader eyebrow="Nova atividade" title="Configuração rápida">
          <p>Este formulário é mockado para validar fluxo, campos e copy antes da integração com backend.</p>
        </CardHeader>
        <div className="form-grid">
          <label>
            Nome da atividade
            <input defaultValue="Responder pesquisa da comunidade" />
          </label>
          <label>
            Público-alvo
            <select defaultValue="clientes">
              <option value="clientes">Clientes / consumidores</option>
              <option value="membros">Membros</option>
              <option value="colaboradores">Colaboradores</option>
            </select>
          </label>
          <label>
            Folhas por participação
            <input type="number" value={draftReward} onChange={(event) => setDraftReward(Number(event.target.value))} />
          </label>
          <label>
            Limite de participantes
            <input type="number" defaultValue="100" />
          </label>
          <label className="span-2">
            Descrição
            <textarea defaultValue="Compartilhe sua percepção e ajude a instituição a direcionar as próximas ações." />
          </label>
        </div>
        <div className="activity-budget">
          <Badge tone="warning">Reserva estimada</Badge>
          <strong>{formatNumber(reserved)} Folhas</strong>
          <span>As Folhas ficam reservadas enquanto a atividade estiver ativa.</span>
        </div>
      </Card>

      <div className="list-stack">
        {institutionActivities.map((activity) => (
          <Card key={activity.id} className="activity-card">
            <div>
              <Badge tone={activity.status === "Disponível" ? "success" : "warning"}>{activity.status}</Badge>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <strong className="leaf-reward">+{activity.reward} Folhas por participação</strong>
            </div>
            <div className="activity-side">
              <Progress value={Math.round((activity.used / activity.limit) * 100)} label={`${activity.used}/${activity.limit} participantes`} />
              <Button variant="secondary" size="sm">Editar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function InstitutionLeafs() {
  const total = institutionLeafs.available + institutionLeafs.distributed + institutionLeafs.reserved;

  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Folhas</p>
          <h1>Controle a distribuição.</h1>
          <p>
            As Folhas da instituição funcionam como capacidade de engajamento: disponíveis, reservadas em atividades e já distribuídas à comunidade.
          </p>
        </div>
      </section>

      <div className="stat-grid">
        <Card className="stat-card"><span>Disponíveis para distribuir</span><strong>{formatNumber(institutionLeafs.available)}</strong></Card>
        <Card className="stat-card"><span>Reservadas em atividades</span><strong>{formatNumber(institutionLeafs.reserved)}</strong></Card>
        <Card className="stat-card"><span>Já distribuídas</span><strong>{formatNumber(institutionLeafs.distributed)}</strong></Card>
        <Card className="stat-card"><span>Total ativado</span><strong>{formatNumber(total)}</strong></Card>
      </div>

      <Card>
        <CardHeader eyebrow="Distribuição" title="Uso das Folhas" />
        <div className="progress-block spaced">
          <Progress value={Math.round((institutionLeafs.distributed / total) * 100)} label="Folhas distribuídas" />
          <Progress value={Math.round((institutionLeafs.reserved / total) * 100)} label="Folhas reservadas" />
        </div>
      </Card>
    </div>
  );
}

function InstitutionPageBuilder() {
  const [primary, setPrimary] = useState(institutionProfile.primaryColor);
  const [support, setSupport] = useState(institutionProfile.supportColor);
  const previewStyle = useMemo(() => ({ "--institution-primary": primary, "--institution-support": support }), [primary, support]);

  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Página da instituição</p>
          <h1>Crie uma entrada compartilhável.</h1>
          <p>
            Personalize mensagem, marca e cores simples para ambientar o espaço da instituição dentro da Florestas Social.
          </p>
        </div>
        <Button>Salvar página</Button>
      </section>

      <div className="builder-grid">
        <Card className="form-card">
          <CardHeader eyebrow="Customização" title="Identidade do espaço" />
          <div className="form-grid single">
            <label>Nome da instituição<input defaultValue={institutionProfile.name} /></label>
            <label>Slug do link<input defaultValue={institutionProfile.slug} /></label>
            <label>Mensagem de boas-vindas<input defaultValue={institutionProfile.welcome} /></label>
            <label>Texto do botão principal<input defaultValue={institutionProfile.cta} /></label>
            <label>Cor principal<input type="color" value={primary} onChange={(event) => setPrimary(event.target.value)} /></label>
            <label>Cor de apoio<input type="color" value={support} onChange={(event) => setSupport(event.target.value)} /></label>
          </div>
        </Card>

        <Card className="institution-preview" style={previewStyle}>
          <div className="institution-public-logo">{institutionProfile.logoText}</div>
          <p className="eyebrow">Impacto assegurado por Florestas</p>
          <h2>{institutionProfile.welcome}</h2>
          <p>{institutionProfile.message}</p>
          <button type="button">{institutionProfile.cta}</button>
        </Card>
      </div>
    </div>
  );
}

function InstitutionShare() {
  const publicLink = `${window.location.origin}${institutionProfile.publicUrl}`;

  async function copyLink() {
    await navigator.clipboard?.writeText(publicLink);
  }

  return (
    <div className="screen-stack">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Compartilhar</p>
          <h1>Convide sua comunidade.</h1>
          <p>
            Distribua o link da página da instituição para clientes, consumidores, membros ou colaboradores participarem das atividades.
          </p>
        </div>
      </section>

      <Card className="share-card">
        <CardHeader eyebrow="Link público" title="Página da instituição" />
        <div className="share-link">{publicLink}</div>
        <div className="inline-actions">
          <Button onClick={copyLink}>Copiar link</Button>
          <a className="button secondary" href={institutionProfile.publicUrl} target="_blank" rel="noreferrer">Abrir página</a>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Checklist" title="Antes de compartilhar" />
        <div className="timeline-list">
          <div><Badge tone="success">✓</Badge><span>Perfil da instituição preenchido</span></div>
          <div><Badge tone="success">✓</Badge><span>Árvores adquiridas e Folhas ativadas</span></div>
          <div><Badge tone="warning">!</Badge><span>Atividades publicadas para a comunidade</span></div>
          <div><Badge>→</Badge><span>Link pronto para canais próprios da instituição</span></div>
        </div>
      </Card>
    </div>
  );
}

export function InstitutionFlow({ tab, onTabChange }) {
  if (tab === "trees") return <AcquireTrees />;
  if (tab === "activities") return <InstitutionActivities />;
  if (tab === "leafs") return <InstitutionLeafs />;
  if (tab === "page") return <InstitutionPageBuilder />;
  if (tab === "share") return <InstitutionShare />;
  return <InstitutionHome onTabChange={onTabChange} />;
}
