'use client';

import Link from 'next/link';
import { LotePof } from '@/types';

// TODO: Substituir por hook usePofOracle() que lê do ledger via Soroban RPC
const mockLotes: LotePof[] = [
  {
    id: 'LOT-001',
    fazenda: 'Viveiro Maravilha',
    especie: 'Khaya senegalensis',
    quantidade: 500,
    dap: 8.2,
    altura: 4.5,
    ultimaColeta: Date.now() - 86_400_000,
    statusPof: 'pendente',
  },
  {
    id: 'LOT-002',
    fazenda: 'Fazenda Serra Verde',
    especie: 'Khaya senegalensis',
    quantidade: 1200,
    dap: 12.7,
    altura: 7.1,
    ultimaColeta: Date.now() - 172_800_000,
    statusPof: 'validado',
    hashProva: '0xc3a2...f91d',
  },
  {
    id: 'LOT-003',
    fazenda: 'Sítio Florestal CE',
    especie: 'Khaya senegalensis',
    quantidade: 300,
    dap: 6.1,
    altura: 3.2,
    ultimaColeta: Date.now() - 259_200_000,
    statusPof: 'rejeitado',
  },
  {
    id: 'LOT-004',
    fazenda: 'Caatinga Viva RN',
    especie: 'Khaya senegalensis',
    quantidade: 750,
    dap: 9.4,
    altura: 5.8,
    ultimaColeta: Date.now() - 43_200_000,
    statusPof: 'pendente',
  },
];

const STATUS_STYLES: Record<LotePof['statusPof'], string> = {
  pendente: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/30',
  validado: 'bg-green-900/40 text-green-300 border-green-700/30',
  rejeitado: 'bg-red-900/40 text-red-300 border-red-700/30',
};

const STATUS_EMOJI: Record<LotePof['statusPof'], string> = {
  pendente: '⏳',
  validado: '✅',
  rejeitado: '❌',
};

function timeAgo(timestamp: number): string {
  const h = Math.floor((Date.now() - timestamp) / 3_600_000);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
}

export default function AdminDashboard() {
  const contractList = [
    {
      nome: 'rwa_vault',
      descricao: 'SEP-41 MOGNO Token',
      status: 'deployed',
      funcoes: ['admin_mint', 'admin_burn', 'pause', 'total_supply'],
    },
    {
      nome: 'sbt_reputation',
      descricao: 'Green Cashback + SBT',
      status: 'deployed',
      funcoes: ['distribute_green_cashback', 'register_company', 'pause', 'impact_points'],
    },
    {
      nome: 'hero_journey',
      descricao: 'Leaves Economy + NFT Forge',
      status: 'deployed',
      funcoes: ['reward_leaves', 'forge_common_rwa', 'get_leaves'],
    },
  ];

  const pendentes = mockLotes.filter(l => l.statusPof === 'pendente');

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Admin 🔐</h1>
            <p className="text-white/30 text-sm font-mono">Social Forest Protocol — Soroban</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
            <span className="bg-green-900/40 text-green-400 text-xs font-mono px-3 py-1 rounded-full border border-green-700/30">
              Testnet
            </span>
          </div>
        </div>

        {/* Resumo numérico */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: '3', label: 'Contratos Ativos', icon: '📋' },
            { value: String(pendentes.length), label: 'Lotes Pendentes', icon: '⏳' },
            { value: '12', label: 'Empresas Verificadas', icon: '🏢' },
            { value: '100M', label: 'Supply Cap MOGNO', icon: '🪙' },
          ].map(({ value, label, icon }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xl mb-2" aria-hidden="true">{icon}</div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-white/30 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Contratos */}
        <div>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
            Contratos Soroban
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {contractList.map((c) => (
              <div key={c.nome} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-green-400 font-semibold text-sm">{c.nome}</p>
                  <span className="bg-green-900/40 text-green-400 text-xs px-2 py-0.5 rounded-full border border-green-700/30">
                    {c.status}
                  </span>
                </div>
                <p className="text-white/40 text-xs mb-3">{c.descricao}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.funcoes.map(fn => (
                    <span key={fn} className="bg-white/5 border border-white/10 text-white/50 text-xs font-mono px-2 py-0.5 rounded">
                      {fn}()
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lotes PoF */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">
              Lotes PoF{' '}
              {pendentes.length > 0 && (
                <span className="ml-2 bg-yellow-900/40 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-700/30">
                  {pendentes.length} pendentes
                </span>
              )}
            </h2>
            <Link href="/admin/oracle" className="text-xs text-green-400 hover:text-green-300 transition-colors">
              Ver Oracle →
            </Link>
          </div>

          <div className="space-y-3">
            {mockLotes.map((lote) => (
              <div
                key={lote.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-white text-sm">{lote.id}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLES[lote.statusPof]}`}>
                      {STATUS_EMOJI[lote.statusPof]} {lote.statusPof}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs">
                    {lote.fazenda} · {lote.quantidade.toLocaleString('pt-BR')} árvores ·
                    DAP {lote.dap}cm · Alt. {lote.altura}m · {timeAgo(lote.ultimaColeta)}
                  </p>
                  {lote.hashProva && (
                    <p className="text-xs font-mono text-green-400/60 mt-0.5">PoF: {lote.hashProva}</p>
                  )}
                </div>
                {lote.statusPof === 'pendente' && (
                  <button
                    id={`btn-validar-${lote.id}`}
                    className="shrink-0 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-xs font-medium px-4 py-2 rounded-lg transition-all"
                  >
                    {/* TODO: Chamar rwa_vault.admin_mint() via Soroban */}
                    Validar & Mint
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ações de emergência */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-red-900/20 border border-red-700/30 text-red-300 text-sm font-medium py-3 rounded-xl hover:bg-red-900/30 transition-all">
            {/* TODO: Chamar rwa_vault.pause() via Soroban */}
            ⏸ Pausar rwa_vault
          </button>
          <button className="bg-yellow-900/20 border border-yellow-700/30 text-yellow-300 text-sm font-medium py-3 rounded-xl hover:bg-yellow-900/30 transition-all">
            {/* TODO: Chamar sbt_reputation.pause() via Soroban */}
            ⏸ Pausar sbt_reputation
          </button>
        </div>

      </div>
    </div>
  );
}
