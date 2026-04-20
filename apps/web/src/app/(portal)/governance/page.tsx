'use client';

import { useState } from 'react';
import { Proposta } from '@/types';

// TODO: Substituir por hook useGovernance() que lê propostas do contrato governance
const mockPropostas: Proposta[] = [
  {
    id: 'PROP-001',
    titulo: 'Adicionar Fazenda Caatinga Viva (RN) ao Protocolo',
    descricao: 'Proposta para incluir 2.000 hectares de reflorestamento no Rio Grande do Norte ao pool de lotes PoF válidos. DAP médio: 9cm, Khaya senegalensis.',
    tipo: 'nova_fazenda',
    votosAFavor: 145_000,
    votosContra: 12_000,
    totalFlora: 200_000,
    encerraEm: Date.now() + 5 * 86_400_000,
    status: 'ativa',
  },
  {
    id: 'PROP-002',
    titulo: 'Adotar Metodologia GRI 305-1 para Cálculo de CO₂',
    descricao: 'Atualizar o oráculo PoF para usar a metodologia GRI 305-1 (emissões diretas Escopo 1) como padrão de cálculo do sequestro de carbono dos lotes.',
    tipo: 'nova_metodologia',
    votosAFavor: 88_000,
    votosContra: 34_000,
    totalFlora: 200_000,
    encerraEm: Date.now() + 12 * 86_400_000,
    status: 'ativa',
  },
  {
    id: 'PROP-003',
    titulo: 'Alocar 5% do Treasury para Fundo de Emergência Climática',
    descricao: 'Reservar 5% do Green Treasury ($FLORA) em fundo dedicado a eventos climáticos extremos que afetem os lotes PoF ativos.',
    tipo: 'treasury',
    votosAFavor: 210_000,
    votosContra: 5_000,
    totalFlora: 250_000,
    encerraEm: Date.now() - 86_400_000,
    status: 'aprovada',
  },
  {
    id: 'PROP-004',
    titulo: 'Parceria com Vereda.Verify para Auditoria de Lotes',
    descricao: 'Integrar o contrato vereda-core como oráculo de auditoria para a validação cross-contract dos lotes PoF. Fase 2 do roadmap.',
    tipo: 'outro',
    votosAFavor: 67_000,
    votosContra: 89_000,
    totalFlora: 200_000,
    encerraEm: Date.now() - 2 * 86_400_000,
    status: 'rejeitada',
  },
];

const TIPO_LABEL: Record<Proposta['tipo'], { emoji: string; label: string }> = {
  nova_fazenda:    { emoji: '🌿', label: 'Nova Fazenda' },
  nova_metodologia:{ emoji: '📐', label: 'Metodologia' },
  treasury:        { emoji: '💰', label: 'Treasury' },
  outro:           { emoji: '📋', label: 'Outro' },
};

const STATUS_STYLES: Record<Proposta['status'], { badge: string; label: string }> = {
  ativa:     { badge: 'bg-green-900/40 text-green-300 border-green-700/30', label: '🗳 Ativa' },
  aprovada:  { badge: 'bg-blue-900/40 text-blue-300 border-blue-700/30',   label: '✅ Aprovada' },
  rejeitada: { badge: 'bg-red-900/40 text-red-300 border-red-700/30',      label: '❌ Rejeitada' },
};

function daysLeft(timestamp: number): string {
  const d = Math.ceil((timestamp - Date.now()) / 86_400_000);
  if (d < 0) return 'Encerrada';
  if (d === 0) return 'Encerra hoje';
  return `Encerra em ${d}d`;
}

export default function GovernancePage() {
  const [filtro, setFiltro] = useState<Proposta['status'] | 'todos'>('todos');

  const filtradas = mockPropostas.filter(p =>
    filtro === 'todos' ? true : p.status === filtro
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="pt-2">
          <div className="flex items-end gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Governança</h1>
            <span className="font-mono text-green-400 text-sm pb-0.5">$FLORA</span>
          </div>
          <p className="text-white/40 text-sm">
            Detentores de $FLORA votam nas decisões estratégicas do protocolo
          </p>
        </div>

        {/* Saldo $FLORA (mock) */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-400/60 uppercase tracking-wide mb-1">Seu saldo $FLORA</p>
            <p className="text-3xl font-bold text-white">2.500</p>
            <p className="text-xs text-white/30 mt-1">
              {/* TODO: Ler do contrato governance via Soroban */}
              Poder de voto proporcional
            </p>
          </div>
          <div className="text-5xl" aria-hidden="true">🗳️</div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['todos', 'ativa', 'aprovada', 'rejeitada'] as const).map(f => (
            <button
              key={f}
              id={`filtro-gov-${f}`}
              onClick={() => setFiltro(f)}
              className={`shrink-0 capitalize text-xs font-medium px-3.5 py-2 rounded-full border transition-all ${
                filtro === f
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
              }`}
            >
              {f === 'todos' ? 'Todas' : STATUS_STYLES[f].label}
            </button>
          ))}
        </div>

        {/* Lista de propostas */}
        <div className="space-y-4">
          {filtradas.map((prop) => {
            const total = prop.votosAFavor + prop.votosContra;
            const pctFavor = total > 0 ? (prop.votosAFavor / total) * 100 : 0;
            const tipo = TIPO_LABEL[prop.tipo];
            const statusStyle = STATUS_STYLES[prop.status];

            return (
              <div
                key={prop.id}
                className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 space-y-4"
              >
                {/* Cabeçalho */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs text-white/30 font-mono">{prop.id}</span>
                      <span className="text-xs bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">
                        {tipo.emoji} {tipo.label}
                      </span>
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${statusStyle.badge}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm leading-tight">{prop.titulo}</h3>
                    <p className="text-xs text-white/40 mt-2 leading-relaxed">{prop.descricao}</p>
                  </div>
                </div>

                {/* Barra de votação */}
                <div>
                  <div className="flex justify-between text-xs text-white/30 mb-1.5">
                    <span>✅ A favor: {prop.votosAFavor.toLocaleString('pt-BR')} $FLORA</span>
                    <span>❌ Contra: {prop.votosContra.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${pctFavor}%` }}
                      role="progressbar"
                      aria-valuenow={pctFavor}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${pctFavor.toFixed(1)}% a favor`}
                    />
                  </div>
                  <p className="text-right text-xs text-green-400/60 mt-1">{pctFavor.toFixed(1)}% a favor</p>
                </div>

                {/* Footer: deadline + voto */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-xs text-white/30">{daysLeft(prop.encerraEm)}</span>
                  {prop.status === 'ativa' && (
                    <div className="flex gap-2">
                      <button
                        id={`btn-votar-contra-${prop.id}`}
                        className="bg-red-900/20 hover:bg-red-900/30 border border-red-700/30 text-red-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      >
                        {/* TODO: Chamar governance.vote(false) via Soroban */}
                        ❌ Contra
                      </button>
                      <button
                        id={`btn-votar-favor-${prop.id}`}
                        className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                      >
                        {/* TODO: Chamar governance.vote(true) via Soroban */}
                        ✅ A Favor
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
