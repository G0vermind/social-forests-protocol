'use client';

import { useState } from 'react';
import { ArrowLeft, Target, Plus, Search, Timer, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import RoleGuard from '@/components/RoleGuard';

export default function EmpresaMissoesPage() {
  const [activeTab, setActiveTab] = useState<'ativas' | 'criar'>('ativas');

  const campanhas = [
    { id: 1, nome: 'Compra de Produto Sustentável', status: 'Ativa', recompensa: 50, participacoes: 2100, conversao: '68%' },
    { id: 2, nome: 'Siga a marca no Instagram', status: 'Ativa', recompensa: 10, participacoes: 5430, conversao: '92%' },
    { id: 3, nome: 'Recicle uma embalagem', status: 'Pausada', recompensa: 100, participacoes: 420, conversao: '12%' },
  ];

  return (
    <RoleGuard allowedRoles={['empresa']}>
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          
          <Link href="/empresa" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>

          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
                Campanhas & Missões <Target className="w-8 h-8 text-purple-400" />
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Crie e gerencie as missões que aparecerão no Oásis B2C dos consumidores. 
                Recompense o engajamento distribuindo folhas da sua tesouraria.
              </p>
            </div>
            
            <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
              <button 
                onClick={() => setActiveTab('ativas')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'ativas' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}
              >
                Gerenciar
              </button>
              <button 
                onClick={() => setActiveTab('criar')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'criar' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-400 hover:text-white'}`}
              >
                Nova Missão
              </button>
            </div>
          </header>

          {activeTab === 'ativas' ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <div className="flex items-center gap-4 bg-black/30 border border-white/5 rounded-xl px-4 py-3 mb-6">
                <Search className="w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Buscar campanha..." 
                  className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {campanhas.map(camp => (
                  <div key={camp.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${camp.status === 'Ativa' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {camp.status}
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        {camp.recompensa} LEAFs
                      </span>
                    </div>
                    <h3 className="font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">{camp.nome}</h3>
                    <div className="flex justify-between border-t border-white/5 pt-4 text-xs text-slate-400">
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 mb-1">Participações</span>
                        <span className="font-bold text-slate-300">{camp.participacoes.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-slate-500 mb-1">Conversão</span>
                        <span className="font-bold text-slate-300">{camp.conversao}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
                <h2 className="text-xl font-bold text-white mb-6">Configurar Nova Missão</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Título da Missão</label>
                    <input type="text" placeholder="Ex: Avalie nosso aplicativo" className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50" />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Descrição (Mostrada ao Consumidor)</label>
                    <textarea placeholder="Explique o que o usuário precisa fazer..." rows={3} className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Recompensa (LEAFs)</label>
                      <input type="number" defaultValue={50} className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-emerald-400 font-bold outline-none focus:border-purple-500/50" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Tipo de Validação</label>
                      <select className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 appearance-none">
                        <option>API Automática (Webhook)</option>
                        <option>Envio de Link / Foto</option>
                        <option>Check-in Geográfico</option>
                      </select>
                    </div>
                  </div>

                  <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-900/20">
                    <Plus className="w-5 h-5" /> Publicar Missão no Oásis B2C
                  </button>
                </div>
              </div>

              {/* Preview UI */}
              <div className="lg:col-span-2">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Timer className="w-4 h-4" /> Preview no App B2C
                  </h3>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                        <Target className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 uppercase tracking-wider font-bold">
                            Parceiro B2B
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-1">Título da Missão</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">Explique o que o usuário precisa fazer... O texto aparecerá exatamente assim para ele na tela de missões.</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                        +50 <Leaf className="w-3.5 h-3.5" />
                      </div>
                      <button className="px-4 py-1.5 bg-white text-slate-950 rounded-lg text-xs font-bold">
                        Completar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>
    </RoleGuard>
  );
}
