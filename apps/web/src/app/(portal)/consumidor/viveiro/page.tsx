'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ViveiroState } from '@/types';

// TODO: Substituir por hook useSbtReputation() que lê do contrato sbt_reputation
const mockViveiro: ViveiroState = {
  folhasComuns: 320,
  folhasRaras: 45,
  folhasLendarias: 3,
  totalFolhas: 368,
  metaParaArvore: 1000,
  progresso: 36.8,
  arvoresForjadas: 1,
  pontosImpacto: 18500,
  co2Sequestrado: 42.3,
};

const treeEmoji = (progresso: number) => {
  if (progresso >= 100) return '🌳';
  if (progresso >= 60) return '🌿';
  if (progresso >= 30) return '🌱';
  return '🌾';
};

export default function ViveiroPage() {
  const [viveiro] = useState<ViveiroState>(mockViveiro);

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-lg mx-auto space-y-5">

        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <h1 className="text-2xl font-bold text-white">Meu Viveiro Digital</h1>
          <p className="text-green-400/60 text-sm mt-1">Cultive sua árvore. Construa seu impacto.</p>
        </div>

        {/* Progresso visual da árvore */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Progresso para próxima árvore</p>
              <p className="text-4xl font-bold text-green-400">
                {viveiro.totalFolhas.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-white/30 mt-1">
                de {viveiro.metaParaArvore.toLocaleString('pt-BR')} folhas
              </p>
            </div>
            <div className="text-7xl" aria-label={`Nível: ${treeEmoji(viveiro.progresso)}`}>
              {treeEmoji(viveiro.progresso)}
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(viveiro.progresso, 100)}%` }}
              role="progressbar"
              aria-valuenow={viveiro.progresso}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-right text-xs text-green-400/60 mt-1.5">{viveiro.progresso.toFixed(1)}%</p>

          {viveiro.progresso >= 100 && (
            <button
              id="btn-forjar-arvore"
              className="mt-4 w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-900/30"
            >
              {/* TODO: Chamar hero_journey.forge_common_rwa() via Soroban */}
              🌳 Forjar Minha Árvore!
            </button>
          )}
        </div>

        {/* Coleção de folhas */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-5">
          <h2 className="font-semibold text-white/80 mb-4">Minha Coleção de Folhas</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '🍃', count: viveiro.folhasComuns, label: 'Comuns', bg: 'bg-white/5', text: 'text-white' },
              { emoji: '💎', count: viveiro.folhasRaras, label: 'Raras', bg: 'bg-blue-900/20', text: 'text-blue-300' },
              { emoji: '⭐', count: viveiro.folhasLendarias, label: 'Lendárias', bg: 'bg-yellow-900/20', text: 'text-yellow-300' },
            ].map(({ emoji, count, label, bg, text }) => (
              <div key={label} className={`${bg} border border-white/10 rounded-2xl p-4 text-center`}>
                <div className="text-2xl mb-1" aria-hidden="true">{emoji}</div>
                <p className={`text-2xl font-bold ${text}`}>{count}</p>
                <p className="text-xs text-white/30 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas de impacto */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: viveiro.arvoresForjadas.toString(), label: 'Árvores forjadas', bg: 'bg-green-900/40 border-green-700/30' },
            { value: `${viveiro.co2Sequestrado}kg`, label: 'CO₂ sequestrado', bg: 'bg-emerald-900/40 border-emerald-700/30' },
            { value: `${(viveiro.pontosImpacto / 1000).toFixed(1)}k`, label: 'Pts de impacto', bg: 'bg-teal-900/40 border-teal-700/30' },
          ].map(({ value, label, bg }) => (
            <div key={label} className={`${bg} border rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/40 mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA Missões */}
        <Link
          href="/consumidor/missoes"
          className="flex items-center justify-center gap-2 w-full text-center bg-white/5 border border-green-500/30 hover:border-green-400 hover:bg-green-900/20 text-green-400 font-semibold py-4 rounded-2xl transition-all"
        >
          🎯 Ver Missões Disponíveis
        </Link>

      </div>
    </div>
  );
}
