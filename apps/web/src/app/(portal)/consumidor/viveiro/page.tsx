'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Sprout, 
  Leaf, 
  TreePine, 
  Wind, 
  Droplets,
  Award,
  ArrowRight,
  TrendingUp,
  History,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

import RoleGuard from '@/components/RoleGuard';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { useHeroState } from '@/hooks/useHeroState';
import { useUserImpact } from '@/hooks/useUserImpact';

export default function ConsumidorDashboard() {
  const { session } = useAuth();
  
  // Hydration com Hooks Soroban SDK
  const { xlmBalance, isLoading: isBalanceLoading, error: balanceError } = useAccountBalance(session?.address ?? null);
  const heroState = useHeroState(session?.address ?? null);
  const { impactPoints, isLoading: isImpactLoading, error: impactError } = useUserImpact(session?.address ?? null);

  const isGlobalLoading = isBalanceLoading || heroState.isLoading || isImpactLoading;
  const hasError = balanceError || heroState.error || impactError;

  const arvoresMock = [
    {
      id: 'Mogno-01',
      nome: 'Mogno Africano #142',
      idade: '18 meses',
      status: 'Saudável',
      imagem: '🌲',
      co2: '150kg',
      local: 'Viveiro Maravilha'
    },
    {
      id: 'Mogno-02',
      nome: 'Mogno Africano #893',
      idade: '6 meses',
      status: 'Em Crescimento',
      imagem: '🌱',
      co2: '45kg',
      local: 'Viveiro Esperança'
    }
  ];

  const atividadesRecentes = [
    { id: 1, tipo: 'missao', titulo: 'Frete Eco-friendly', empresa: 'VerdeFast', valor: '+120 Folhas', tempo: 'Há 2 dias' },
    { id: 2, tipo: 'evolucao', titulo: 'Evolução de Muda', empresa: 'Protocolo', valor: 'Fase 2', tempo: 'Há 1 semana' },
    { id: 3, tipo: 'compra', titulo: 'Xampú Natural', empresa: 'NaturalCare', valor: '+80 Folhas', tempo: 'Há 2 semanas' },
  ];

  return (
    <RoleGuard allowedRoles={['consumidor']}>
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Banner de Fallback (Graecful Degradation) */}
        {hasError && !isGlobalLoading && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 mb-4 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-400/90 font-medium">
              Dados locais ativos — blockchain temporariamente indisponível. Seu impacto está salvo no seu dispositivo.
            </p>
          </div>
        )}

        {/* Header de Boas-Vindas */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Seu Viveiro Digital <Sprout className="w-8 h-8 text-emerald-400" />
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Bem-vindo de volta! Acompanhe seu impacto ambiental e evolução das suas mudas.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-2 pr-4 shadow-lg backdrop-blur-md">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
              {session?.address ? session.address.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Conta Conectada</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-mono text-emerald-400">
                  {session?.address ? `${session.address.slice(0, 6)}...${session.address.slice(-4)}` : 'Usuário'}
                </span>
                <span className="text-xs text-slate-500">| {xlmBalance} XLM</span>
              </div>
            </div>
          </div>
        </header>

        {isGlobalLoading ? (
           <div className="h-64 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
           </div>
        ) : (
          <>
            {/* Grid Principal de Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Saldo de Folhas */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Token de Utilidade
                  </span>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Saldo de Folhas</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{heroState.totalWeighted.toLocaleString()}</span>
                    <span className="text-emerald-400 font-medium">Folhas</span>
                  </div>
                </div>
              </div>

              {/* Impacto Ambiental (CO2) */}
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Wind className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    SBT Impact
                  </span>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Impacto Verificado</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{impactPoints}</span>
                    <span className="text-blue-400 font-medium">PTS</span>
                  </div>
                </div>
              </div>

              {/* Árvores e Evolução */}
              <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <TreePine className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> RWA
                  </span>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Árvores Reais</h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white">{heroState.treesForged}</span>
                        <span className="text-purple-400 font-medium">Forjadas</span>
                      </div>
                    </div>
                  </div>
                  {/* Barra de Progresso para próxima árvore */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Progresso para próxima semente</span>
                      <span className="text-purple-300 font-medium">{heroState.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${heroState.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Seção Principal Inferior */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              
              {/* Coleção de Árvores (Esquerda - Ocupa 2 colunas) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Sua Coleção <span className="text-slate-500 text-sm font-normal">({heroState.treesForged} ativos)</span>
                  </h2>
                  <Link href="/ativos" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                    Explorar RWAs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {arvoresMock.map((arvore) => (
                    <div key={arvore.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 hover:bg-slate-800/60 transition-colors cursor-pointer group">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl border border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                          {arvore.imagem}
                        </div>
                        <div>
                          <h3 className="text-white font-bold mb-1">{arvore.nome}</h3>
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {arvore.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/50">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Idade</span>
                          <span className="text-sm font-medium text-slate-300">{arvore.idade}</span>
                        </div>
                        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/50">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Captura CO₂</span>
                          <span className="text-sm font-medium text-blue-400 flex items-center gap-1">
                            {arvore.co2} <Wind className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> {arvore.local}
                        </span>
                        <button className="text-xs text-slate-400 hover:text-white transition-colors">
                          Ver Detalhes →
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Card de Espaço Vazio / Nova Árvore */}
                  <div className="bg-slate-900/30 border border-dashed border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center text-center hover:bg-slate-900/50 transition-colors group cursor-pointer">
                    <div className="w-14 h-14 bg-slate-800/50 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-700/50 transition-colors">
                      <Sprout className="w-6 h-6 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300">Plantar Nova Semente</h3>
                    <p className="text-xs text-slate-600 mt-1">Acumule folhas para forjar a próxima árvore.</p>
                  </div>
                </div>
              </div>

              {/* Histórico e Missões (Direita - Ocupa 1 coluna) */}
              <div className="space-y-4 lg:pl-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Atividade <History className="w-5 h-5 text-slate-500" />
                </h2>
                
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5">
                  <div className="space-y-4">
                    {atividadesRecentes.map((atividade) => (
                      <div key={atividade.id} className="flex items-start gap-3 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          atividade.tipo === 'missao' ? 'bg-green-500/10 text-green-400' :
                          atividade.tipo === 'compra' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {atividade.tipo === 'missao' ? <Award className="w-4 h-4" /> :
                          atividade.tipo === 'compra' ? <Droplets className="w-4 h-4" /> :
                          <TrendingUp className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{atividade.titulo}</p>
                          <p className="text-xs text-slate-500">{atividade.empresa}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-xs font-bold ${
                            atividade.tipo === 'evolucao' ? 'text-purple-400' : 'text-emerald-400'
                          }`}>
                            {atividade.valor}
                          </p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{atividade.tempo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Link href="/marketplace" className="mt-6 w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all border border-emerald-500/20 hover:border-emerald-500/40">
                    Ganhar mais Folhas
                  </Link>
                </div>
                
                {/* Banner Conquista */}
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-400">Nível Lenda Desbloqueado!</h3>
                    <p className="text-xs text-slate-300 mt-0.5">Sua dedicação está mudando o mundo.</p>
                  </div>
                </div>
                
              </div>
            </div>
          </>
        )}
      </div>
    </main>
    </RoleGuard>
  );
}
