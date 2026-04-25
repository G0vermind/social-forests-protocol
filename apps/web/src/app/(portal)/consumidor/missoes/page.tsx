'use client';

import React, { useState } from 'react';
import { Leaf, Droplets, Zap, CheckCircle2, Timer, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'education' | 'partner';
  rewardLeaf: number;
  costDrops: number;
  progress: number; // 0 a 100
  isCompleted: boolean;
  icon: React.ElementType;
  partnerName?: string;
}

export default function MissoesPage() {
  const [energyDrops, setEnergyDrops] = useState(150);
  const [leafBalance, setLeafBalance] = useState(365);

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 'm1',
      title: 'Check-in no Oásis',
      description: 'Entre no Viveiro para regar suas sementes e ganhe folhas diariamente.',
      type: 'daily',
      rewardLeaf: 10,
      costDrops: 5,
      progress: 0,
      isCompleted: false,
      icon: Zap,
    },
    {
      id: 'm2',
      title: 'Educação: O Ciclo do Mogno',
      description: 'Leia o artigo sobre como o Mogno Africano recupera solos degradados.',
      type: 'education',
      rewardLeaf: 50,
      costDrops: 20,
      progress: 40,
      isCompleted: false,
      icon: BookOpen,
    },
    {
      id: 'm3',
      title: 'Compra Consciente',
      description: 'Compre qualquer produto na loja Parceira EcoWear usando o link do protocolo.',
      type: 'partner',
      rewardLeaf: 200,
      costDrops: 0,
      progress: 100,
      isCompleted: true,
      icon: ShoppingBag,
      partnerName: 'EcoWear',
    },
  ]);

  const handleCompleteMission = (id: string) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id && !m.isCompleted && energyDrops >= m.costDrops) {
        setEnergyDrops(e => e - m.costDrops);
        setLeafBalance(l => l + m.rewardLeaf);
        return { ...m, isCompleted: true, progress: 100 };
      }
      return m;
    }));
  };

  return (
    <RoleGuard allowedRoles={['consumidor']}>
      <div className="max-w-4xl mx-auto px-5 py-6 sm:py-8 min-h-screen relative overflow-hidden">
        
        {/* Background Decorativo */}
        <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <header className="mb-10">
            <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
              Quadro de Missões 🎯
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Gaste suas gotas de energia para completar missões. Acumule LEAFs para forjar Árvores e desbloquear Medalhas SBT de impacto ecológico.
            </p>
          </header>

          {/* Top Panel: Saldos */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Droplets className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Gotas de Energia</p>
                <p className="text-2xl font-bold text-white">{energyDrops} <span className="text-sm text-blue-400 font-normal">/ 200</span></p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">Saldo de LEAFs</p>
                <p className="text-2xl font-bold text-white">{leafBalance}</p>
              </div>
            </div>
          </div>

          {/* Lista de Missões */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Timer className="w-5 h-5 text-slate-400" /> Missões Disponíveis
            </h2>

            {missions.map(mission => (
              <div 
                key={mission.id}
                className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
                  mission.isCompleted 
                    ? 'bg-emerald-900/10 border-emerald-500/20 opacity-80' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 backdrop-blur-sm'
                }`}
              >
                {/* Progress bar background (for uncompleted with progress) */}
                {!mission.isCompleted && mission.progress > 0 && (
                  <div 
                    className="absolute top-0 left-0 bottom-0 bg-slate-800/50 -z-10" 
                    style={{ width: `${mission.progress}%` }}
                  />
                )}

                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  
                  <div className="flex gap-4 items-start">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      mission.isCompleted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                      mission.type === 'partner' ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' :
                      mission.type === 'education' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' :
                      'bg-blue-500/20 border-blue-500/30 text-blue-400'
                    }`}>
                      <mission.icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {mission.type === 'partner' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 uppercase tracking-wider font-bold">
                            Parceiro B2B: {mission.partnerName}
                          </span>
                        )}
                        {mission.type === 'daily' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 uppercase tracking-wider font-bold">
                            Diária
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{mission.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed max-w-lg">{mission.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-0 justify-between sm:justify-start">
                    
                    <div className="flex items-center gap-3">
                      {mission.costDrops > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-blue-400">
                          <Droplets className="w-3.5 h-3.5" /> -{mission.costDrops}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        +{mission.rewardLeaf} <Leaf className="w-4 h-4" />
                      </div>
                    </div>

                    {mission.isCompleted ? (
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-sm px-4 py-2">
                        <CheckCircle2 className="w-5 h-5" /> Concluída
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCompleteMission(mission.id)}
                        disabled={energyDrops < mission.costDrops}
                        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                      >
                        Completar <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </RoleGuard>
  );
}
