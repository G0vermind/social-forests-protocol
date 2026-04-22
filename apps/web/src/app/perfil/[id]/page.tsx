'use client';

import { useParams } from 'next/navigation';
import { Sprout, TreePine, Award, Leaf } from 'lucide-react';

export default function PerfilPublico() {
  const params = useParams();
  const id = params.id as string;

  // Em um cenário real, faríamos um fetch() para buscar o ViveiroState deste 'id'.
  // Aqui usamos dados mockados para demonstração da interface read-only.
  const mockViveiro = {
    totalFolhas: 1250,
    arvoresForjadas: 5,
    co2Sequestrado: 1500, // kg
    pontosImpacto: 4200,
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Background Decorativo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        
        {/* Header do Perfil */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500" />
          
          <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center border-4 border-emerald-500/30 mb-4 shadow-inner">
            <span className="text-4xl">🌱</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Perfil Sustentável</h1>
          <p className="text-sm font-mono text-emerald-400/70 bg-emerald-500/10 inline-block px-3 py-1 rounded-lg">
            {id === 'me' ? 'Visualização do Seu Perfil' : `${id.slice(0, 8)}...${id.slice(-8)}`}
          </p>
          <p className="mt-4 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Este explorador contribui ativamente para o reflorestamento e finanças regenerativas no protocolo Social Forest.
          </p>
        </div>

        {/* Métricas de Impacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="bg-green-500/20 p-2 rounded-xl mb-3">
              <Leaf className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{mockViveiro.totalFolhas}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Folhas Coletadas</span>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="bg-emerald-500/20 p-2 rounded-xl mb-3">
              <TreePine className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-white">{mockViveiro.arvoresForjadas}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Árvores Reais</span>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="bg-blue-500/20 p-2 rounded-xl mb-3">
              <Sprout className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{mockViveiro.co2Sequestrado}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Kg CO₂</span>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col items-center text-center">
            <div className="bg-purple-500/20 p-2 rounded-xl mb-3">
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-white">{mockViveiro.pontosImpacto}</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Impact Points</span>
          </div>
        </div>

        {/* Coleção de Árvores (Mock) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TreePine className="w-5 h-5 text-emerald-500" />
            Árvores Financiadas (RWAs)
          </h2>
          
          <div className="grid gap-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    🌲
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">Mogno Africano #{i + 142}</p>
                    <p className="text-xs text-slate-500">Fazenda Vereda • Plantada em 2023</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                    Validado PoF
                  </p>
                </div>
              </div>
            ))}
            
            <button className="w-full mt-2 py-3 rounded-xl border border-dashed border-slate-700 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors">
              Ver todas as {mockViveiro.arvoresForjadas} árvores
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Dados verificados na rede Stellar • Social Forests Protocol
        </p>

      </div>
    </main>
  );
}
