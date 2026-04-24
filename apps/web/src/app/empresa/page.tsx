'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Leaf, 
  Target, 
  Globe2, 
  CreditCard, 
  TrendingUp,
  PlusCircle,
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function EmpresaDashboard() {
  const { session } = useAuth();
  const [showStripeModal, setShowStripeModal] = useState(false);

  // Dados mockados espelhando o contrato Soroban (CompanyBadge e MissionPool)
  const mockCompanyState = {
    nome: 'EcologCorp LTDA',
    status: 'Parceiro Verificado',
    // MissionPool (Saldo disponível para dar cashback)
    poolFolhas: 45000, 
    // CompanyBadge (Histórico de impacto distribuído)
    folhasDistribuidas: 125000,
    odsScore: 12500, // folhas / 10
    carbonCredits: 2500, // folhas / 50
    lendaBonusAtivo: true,
  };

  const campanhasAtivas = [
    { id: 1, nome: 'Frete Carbon Zero', tipo: 'Serviço', custoPorAcao: 120, totalUsos: 840, status: 'Ativo' },
    { id: 2, nome: 'Compra de Produto Sustentável', tipo: 'SKU', custoPorAcao: 50, totalUsos: 2100, status: 'Ativo' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER B2B */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">{mockCompanyState.nome}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> {mockCompanyState.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                Painel de Comando ESG • <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">CNPJ Verificado</span>
              </p>
            </div>
          </div>
          
          <div className="text-right w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Wallet Corporativa</p>
            <p className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 inline-block">
              {session?.address || 'G...EMPRESA'}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUNA ESQUERDA: Finanças & Pool de Missões */}
          <div className="space-y-6">
            
            {/* Mission Pool Card */}
            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Tesouraria de Folhas
                </h2>
              </div>
              
              <div className="relative z-10 mb-6">
                <p className="text-xs text-slate-400 mb-1">Saldo disponível para Cashback Verde</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{mockCompanyState.poolFolhas.toLocaleString()}</span>
                  <span className="text-emerald-400 font-medium">LEAF</span>
                </div>
              </div>

              <button 
                onClick={() => setShowStripeModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/50"
              >
                <CreditCard className="w-4 h-4" /> Comprar via Stripe (Fiat)
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-3">
                1 Folha = R$ 0,10. Conversão via contrato Soroban.
              </p>
            </div>

            {/* Quick Actions / Campaigns */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  Campanhas Ativas <Target className="w-4 h-4 text-blue-400" />
                </h2>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {campanhasAtivas.map(camp => (
                  <div key={camp.id} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{camp.nome}</h3>
                        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{camp.tipo}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                        -{camp.custoPorAcao} LEAF
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {camp.totalUsos} usos
                      </span>
                      <span className="text-xs text-blue-400 font-medium">Status: {camp.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* COLUNA DIREITA: Relatório ESG & Compliance (CompanyBadge) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  Relatório de Compliance ESG <Globe2 className="w-5 h-5 text-blue-400" />
                </h2>
                <p className="text-sm text-slate-400">
                  Métricas on-chain geradas automaticamente através do engajamento dos seus clientes. 
                  Os dados são garantidos pelo Oráculo e passíveis de auditoria.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* ODS Score */}
                <div className="bg-gradient-to-br from-blue-900/20 to-slate-950 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Score ODS (ONU)</p>
                    <p className="text-2xl font-bold text-white">{mockCompanyState.odsScore.toLocaleString()}</p>
                    <p className="text-[10px] text-blue-400 mt-1">1 ponto a cada 10 folhas distribuídas</p>
                  </div>
                </div>

                {/* Carbon Credits */}
                <div className="bg-gradient-to-br from-green-900/20 to-slate-950 border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400 shrink-0">
                    <Cloud className="w-6 h-6" /> {/* Mudança: Cloud icon */}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Créditos de Carbono</p>
                    <p className="text-2xl font-bold text-white">{mockCompanyState.carbonCredits.toLocaleString()}</p>
                    <p className="text-[10px] text-green-400 mt-1">1 crédito verificado a cada 50 folhas</p>
                  </div>
                </div>
              </div>

              {/* Lenda Bonus Area */}
              <div className="mt-auto">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Badges Corporativos</h3>
                
                <div className={`border rounded-2xl p-5 flex items-center gap-5 transition-all ${
                  mockCompanyState.lendaBonusAtivo 
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                    mockCompanyState.lendaBonusAtivo ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {mockCompanyState.lendaBonusAtivo ? <CheckCircle2 className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold ${mockCompanyState.lendaBonusAtivo ? 'text-amber-400' : 'text-slate-400'}`}>
                        Selo Lenda: Impacto Massivo
                      </h4>
                      {mockCompanyState.lendaBonusAtivo && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Desbloqueado</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                      Ativado porque um de seus clientes alcançou a raridade máxima no protocolo através da sua distribuição de recompensas. 
                      Isso garante um certificado público premium de ESG para a empresa.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Stripe Checkout Modal Simulado */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button 
              onClick={() => setShowStripeModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Recarregar Pool</h2>
              <p className="text-sm text-slate-400 mt-2">Simulação de integração com Stripe API para On-ramp Fiat.</p>
            </div>
            
            <div className="space-y-3 mb-6">
              <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 text-left transition-colors flex justify-between items-center group">
                <div>
                  <div className="text-white font-bold group-hover:text-emerald-400 transition-colors">10.000 Folhas</div>
                  <div className="text-xs text-slate-400">Pacote Básico</div>
                </div>
                <div className="font-mono text-emerald-400">R$ 1.000</div>
              </button>
              <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 text-left transition-colors flex justify-between items-center group">
                <div>
                  <div className="text-white font-bold group-hover:text-emerald-400 transition-colors">50.000 Folhas</div>
                  <div className="text-xs text-slate-400">Mais Popular</div>
                </div>
                <div className="font-mono text-emerald-400">R$ 5.000</div>
              </button>
            </div>

            <button 
              onClick={() => {
                alert("Redirecionaria para o Stripe Checkout. Ao pagar, o Webhook chamaria `distribute_leaves` no Soroban.");
                setShowStripeModal(false);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Ir para Checkout
            </button>
          </div>
        </div>
      )}

    </main>
  );
}

// Criando um SVG manual para a Cloud (para evitar erro de import se não existir no lucide)
function Cloud(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  );
}
