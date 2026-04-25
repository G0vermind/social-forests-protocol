'use client';

import { ArrowLeft, TrendingUp, Download, Globe2, Target, Users } from 'lucide-react';
import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';

export default function EmpresaAnalyticsPage() {
  
  // Dados Mockados para o Gráfico de Redução de C-DEBT
  const carbonHistory = [
    { month: 'Jan', emitted: 50, compensated: 10 },
    { month: 'Fev', emitted: 48, compensated: 15 },
    { month: 'Mar', emitted: 55, compensated: 25 },
    { month: 'Abr', emitted: 45, compensated: 30 },
    { month: 'Mai', emitted: 40, compensated: 45 },
    { month: 'Jun', emitted: 42, compensated: 60 }, // Net positive!
  ];

  const maxVal = 70; // Para escalar as barras

  return (
    <RoleGuard allowedRoles={['empresa']}>
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          
          <div className="flex justify-between items-center mb-4">
            <Link href="/empresa" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold transition-colors border border-slate-700">
              <Download className="w-4 h-4" /> Relatório GRI/SASB
            </button>
          </div>

          <header>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
              Analytics ESG <TrendingUp className="w-8 h-8 text-blue-400" />
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Monitore a redução do seu Débito de Carbono (C-DEBT) em tempo real. Os dados aqui apresentados 
              são ancorados no Soroban e lastreados pelas provas criptográficas do Oráculo.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GRÁFICO PRINCIPAL */}
            <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md flex flex-col">
              <h2 className="text-xl font-bold text-white mb-6">Emissão vs Compensação (C-DEBT)</h2>
              
              <div className="flex-1 flex items-end gap-2 sm:gap-6 pt-10 pb-4 border-b border-slate-800 relative">
                {/* Linhas de grade horizontais */}
                <div className="absolute w-full top-0 border-t border-slate-800/50" />
                <div className="absolute w-full top-1/2 border-t border-slate-800/50" />
                
                {carbonHistory.map((data, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    
                    {/* Tooltip Hover */}
                    <div className="absolute -top-12 bg-slate-800 text-xs text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      <span className="text-red-400 font-bold">{data.emitted}t Emitido</span> | <span className="text-emerald-400 font-bold">{data.compensated}t Compensado</span>
                    </div>

                    <div className="w-full flex justify-center items-end gap-1 h-48">
                      {/* Barra Emissão */}
                      <div 
                        className="w-1/3 max-w-[20px] bg-red-500/80 rounded-t-sm"
                        style={{ height: `${(data.emitted / maxVal) * 100}%` }}
                      />
                      {/* Barra Compensação */}
                      <div 
                        className="w-1/3 max-w-[20px] bg-emerald-500 rounded-t-sm"
                        style={{ height: `${(data.compensated / maxVal) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-500">{data.month}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500/80 rounded-sm" />
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">C-DEBT Gerado (Toneladas)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">C-CRED Aposentado (Toneladas)</span>
                </div>
              </div>
            </div>

            {/* MÉTRICAS SECUNDÁRIAS */}
            <div className="space-y-6">
              
              <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-md">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                  <Globe2 className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Net Zero</p>
                <p className="text-3xl font-black text-white mb-2">Alcançado 🏆</p>
                <p className="text-sm text-slate-400">
                  Em Junho, seus clientes forjaram ativos suficientes para compensar 142% das emissões do mês.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clientes Engajados</p>
                <p className="text-3xl font-black text-white mb-2">18.402</p>
                <p className="text-sm text-slate-400">
                  Consumidores únicos que receberam SBTs ou NFTs financiados pela sua tesouraria.
                </p>
              </div>

            </div>

            {/* ALINHAMENTO ODS */}
            <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-emerald-400" /> Alinhamento ODS (ONU)
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { ods: '13', title: 'Ação Contra a Mudança Global do Clima', value: '185t CO₂e', color: 'bg-emerald-700' },
                  { ods: '15', title: 'Vida Terrestre', value: '12.4ha', color: 'bg-green-600' },
                  { ods: '8', title: 'Trabalho Decente e Crescimento Econômico', value: 'R$ 45k', color: 'bg-red-800' },
                  { ods: '12', title: 'Consumo e Produção Responsáveis', value: '18k Selos', color: 'bg-amber-600' }
                ].map(item => (
                  <div key={item.ods} className="bg-black/30 border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-16 h-16 ${item.color} rounded-bl-full opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className="relative z-10">
                      <span className="text-xs font-black text-white/50 bg-white/10 px-2 py-0.5 rounded mb-3 inline-block">ODS {item.ods}</span>
                      <p className="text-xl font-bold text-white mb-1">{item.value}</p>
                      <p className="text-xs text-slate-400 leading-tight">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </RoleGuard>
  );
}
