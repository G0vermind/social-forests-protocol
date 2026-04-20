'use client';

import Link from 'next/link';
import { EsgData } from '@/types';

// TODO: Substituir por hook useEmpresaData() que lê do sbt_reputation contract
const mockEsg: EsgData = {
  co2Sequestrado: 1240,
  arvoresVinculadas: 89,
  usuariosImpactados: 3420,
  missoesConcluidas: 156,
  ods: [
    { numero: 13, titulo: 'Ação Climática', contribuicao: 'Sequestro de carbono verificado', progresso: 72 },
    { numero: 15, titulo: 'Vida Terrestre', contribuicao: 'Manejo florestal certificado', progresso: 85 },
    { numero: 12, titulo: 'Consumo Responsável', contribuicao: 'Green Cashback ativo', progresso: 60 },
    { numero: 8, titulo: 'Trabalho Decente', contribuicao: 'Empregos rurais no Ceará', progresso: 45 },
  ],
};

interface KpiCard {
  label: string;
  value: string;
  icon: string;
  bg: string;
  border: string;
}

const kpis: KpiCard[] = [
  { label: 'CO₂ Sequestrado', value: `${mockEsg.co2Sequestrado}kg`, icon: '🌿', bg: 'bg-green-900/20', border: 'border-green-700/30' },
  { label: 'Árvores Vinculadas', value: String(mockEsg.arvoresVinculadas), icon: '🌳', bg: 'bg-emerald-900/20', border: 'border-emerald-700/30' },
  { label: 'Consumidores', value: mockEsg.usuariosImpactados.toLocaleString('pt-BR'), icon: '👥', bg: 'bg-blue-900/20', border: 'border-blue-700/30' },
  { label: 'Missões Ativas', value: String(mockEsg.missoesConcluidas), icon: '🎯', bg: 'bg-yellow-900/20', border: 'border-yellow-700/30' },
];

export default function EmpresaDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard ESG</h1>
            <p className="text-green-400/60 text-sm mt-0.5">Empresa Parceira Verificada ✅</p>
          </div>
          <Link
            href="/empresa/cashback"
            className="bg-green-500 hover:bg-green-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
          >
            + Distribuir Cashback
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className={`${kpi.bg} ${kpi.border} border rounded-2xl p-4`}>
              <div className="text-2xl mb-3" aria-hidden="true">{kpi.icon}</div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-white/40 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Contribuição ODS */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-5">Contribuição aos ODS da ONU</h2>
          <div className="space-y-5">
            {mockEsg.ods.map((ods) => (
              <div key={ods.numero}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-white/80">
                    ODS {ods.numero} — {ods.titulo}
                  </p>
                  <span className="text-xs text-green-400 font-mono">{ods.progresso}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${ods.progresso}%` }}
                    role="progressbar"
                    aria-valuenow={ods.progresso}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <p className="text-xs text-white/30 mt-1">{ods.contribuicao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { href: '/empresa/missoes', icon: '🎯', label: 'Criar Missão' },
            { href: '/empresa/cashback', icon: '💚', label: 'Config. Cashback' },
            { href: '/empresa/analytics', icon: '📊', label: 'Relatório ESG' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white/5 border border-white/10 hover:border-green-500/40 hover:bg-green-900/10 rounded-2xl p-4 text-center transition-all group"
            >
              <div className="text-2xl mb-2" aria-hidden="true">{action.icon}</div>
              <p className="text-sm font-medium text-white/70 group-hover:text-green-300 transition-colors">
                {action.label}
              </p>
            </Link>
          ))}
        </div>

        {/* Saldo RWA disponível */}
        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-700/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-400/60 uppercase tracking-wide mb-1">Saldo RWA MOGNO disponível</p>
            <p className="text-3xl font-bold text-white">12.500</p>
            <p className="text-xs text-white/30 mt-1">tokens SEP-41 para distribuição</p>
          </div>
          <div className="text-5xl" aria-hidden="true">🌿</div>
        </div>

      </div>
    </div>
  );
}
