'use client';

import { useParams } from 'next/navigation';
import { Target, Users, Leaf, Globe2 } from 'lucide-react';

export default function PerfilEmpresaPublico() {
  const params = useParams();
  const id = params.id as string;

  // Dados mockados para empresa
  const mockEmpresa = {
    nome: id === 'me' ? 'Sua Empresa (Preview)' : 'EcologCorp LTDA',
    impactoTotal: 15400, // Folhas distribuídas
    co2Sequestrado: 25000, // kg
    arvoresVinculadas: 150,
    usuariosImpactados: 840,
    ods: [
      { numero: 13, titulo: 'Ação Contra a Mudança Global do Clima', progresso: 85 },
      { numero: 15, titulo: 'Vida Terrestre', progresso: 70 },
      { numero: 12, titulo: 'Consumo e Produção Responsáveis', progresso: 90 },
    ]
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl w-full relative z-10 space-y-8">
        
        {/* Header da Empresa */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-green-500" />
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-28 h-28 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner shrink-0">
              <span className="text-5xl">🏢</span>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">{mockEmpresa.nome}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  <Globe2 className="w-3.5 h-3.5" /> Parceiro Verificado
                </span>
              </div>
              <p className="text-sm font-mono text-slate-500 mb-4">
                ID: {id === 'me' ? 'GXYZ...' : `${id.slice(0, 12)}...`}
              </p>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                Empresa comprometida com a neutralização de carbono e incentivo à economia verde. Este parceiro financia florestas de Mogno Africano e distribui impacto via Green Cashback.
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard de Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            icon={<Leaf className="w-5 h-5 text-emerald-400" />}
            title="Folhas Distribuídas"
            value={mockEmpresa.impactoTotal.toLocaleString()}
            color="emerald"
          />
          <MetricCard 
            icon={<Globe2 className="w-5 h-5 text-blue-400" />}
            title="CO₂ Sequestrado"
            value={`${(mockEmpresa.co2Sequestrado / 1000).toFixed(1)}t`}
            color="blue"
          />
          <MetricCard 
            icon={<Target className="w-5 h-5 text-purple-400" />}
            title="Árvores Financiadas"
            value={mockEmpresa.arvoresVinculadas}
            color="purple"
          />
          <MetricCard 
            icon={<Users className="w-5 h-5 text-orange-400" />}
            title="Clientes Impactados"
            value={mockEmpresa.usuariosImpactados}
            color="orange"
          />
        </div>

        {/* Impacto ODS */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Contribuição ODS (ONU)
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Acompanhamento de metas de desenvolvimento sustentável.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {mockEmpresa.ods.map((ods, idx) => (
              <div key={idx} className="bg-slate-950 rounded-2xl p-5 border border-slate-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-white shadow-sm border border-slate-700">
                    {ods.numero}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 leading-tight">
                    {ods.titulo}
                  </h3>
                </div>
                
                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Impacto Mensurado</span>
                    <span className="text-emerald-400">{ods.progresso}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${ods.progresso}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 pt-4">
          Transparência garantida pela rede Stellar • Social Forests Protocol
        </p>

      </div>
    </main>
  );
}

// Subcomponente
function MetricCard({ icon, title, value, color }: { icon: React.ReactNode, title: string, value: string | number, color: 'emerald' | 'blue' | 'purple' | 'orange' }) {
  const bgColors = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
    purple: 'bg-purple-500/10 border-purple-500/20',
    orange: 'bg-orange-500/10 border-orange-500/20',
  };

  return (
    <div className={`rounded-2xl p-5 flex flex-col justify-center border backdrop-blur-sm ${bgColors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-white/5 shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
      </div>
      <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
    </div>
  );
}
