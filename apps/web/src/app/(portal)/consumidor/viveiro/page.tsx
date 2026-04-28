"use client";

import { useAuth } from "@/context/AuthContext";
import { useHeroState } from "@/hooks/useHeroState";
import GlobalStatus from "@/components/GlobalStatus";
// ✅ IMPORTAÇÃO CORRIGIDA ABAIXO (Adicionado o Leaf)
import { Award, Star, Zap, ShieldCheck, Trophy, ArrowUp, Leaf } from "lucide-react";

export default function ViveiroPage() {
  const { session } = useAuth();
  const address = session?.address || "";
  const hero = useHeroState(address);

  return (
    <div className="max-w-6xl mx-auto p-6 pb-24 animate-in fade-in duration-700">

      {/* 💳 WIDGET DE STATUS (O que você quer em todo o app) */}
      <GlobalStatus />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* 🎮 LADO ESQUERDO: PROGRESSO DO GAME */}
        <div className="lg:col-span-2 space-y-10">

          {/* Card de Nível Principal */}
          <div className="bg-[#26170E] border-2 border-slate-800 rounded-[40px] p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-[#947D71] text-sm font-black uppercase tracking-[0.3em] mb-2">Rank Atual</h3>
                  <p className="text-[#FFA800] text-5xl font-black italic tracking-tighter shadow-orange-900/20">
                    GUARDIÃO BRONZE II
                  </p>
                </div>
                <Trophy size={80} className="text-[#FFA800] opacity-10 absolute right-4 top-4" />
              </div>

              {/* Barra de XP (Experiência) */}
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#C4A087]">
                  <span>Progresso para o Nível Prata</span>
                  <span className="bg-[#13E89B]/20 text-[#13E89B] px-3 py-1 rounded-lg">{hero.progressPercent}%</span>
                </div>
                <div className="w-full h-8 bg-black/60 rounded-full border border-white/5 overflow-hidden p-1.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#13E89B] to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(19,232,155,0.5)]"
                    style={{ width: `${hero.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
            {/* Brilho de fundo decorativo */}
            <div className="absolute -right-20 -bottom-20 bg-[#13E89B]/5 w-96 h-96 rounded-full blur-[100px]" />
          </div>

          {/* Grid de Inventário de Folhas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Comuns", value: hero.commonLeaves, color: "text-slate-400", bg: "bg-slate-500/10", icon: Leaf },
              { label: "Raras", value: hero.rareLeaves, color: "text-[#C4A087]", bg: "bg-[#C4A087]/10", icon: Star },
              { label: "Lendárias", value: hero.legendaryLeaves, color: "text-[#FFA800]", bg: "bg-[#FFA800]/10", icon: Zap },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/40 border-2 border-slate-800 p-8 rounded-[32px] flex items-center gap-6 group hover:border-[#13E89B]/40 transition-all cursor-default">
                <div className={`p-4 rounded-2xl ${item.bg} ${item.color} shadow-lg`}>
                  <item.icon size={32} />
                </div>
                <div>
                  <p className="text-[#947D71] text-xs font-black uppercase tracking-wider">{item.label}</p>
                  <p className="text-3xl font-black text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 LADO DIREITO: CONQUISTAS E AÇÃO */}
        <div className="space-y-8">
          <div className="bg-[#26170E]/50 border-2 border-slate-800 rounded-[40px] p-10 shadow-xl">
            <h4 className="text-white font-black text-md uppercase tracking-[0.2em] mb-10 border-b border-white/5 pb-4 italic">
              Badges de Honra
            </h4>

            <div className="space-y-8">
              {/* Badge Desbloqueada */}
              <div className="flex items-center gap-5">
                <div className="bg-emerald-500/10 p-4 rounded-full border-2 border-[#13E89B]/30 shadow-[0_0_15px_rgba(19,232,155,0.2)]">
                  <ShieldCheck className="text-[#13E89B]" size={32} />
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase">Pioneiro RWA</p>
                  <p className="text-[#13E89B] text-[10px] uppercase font-black tracking-widest">Ativo</p>
                </div>
              </div>

              {/* Badge Bloqueada */}
              <div className="flex items-center gap-5 opacity-30 grayscale">
                <div className="bg-slate-800 p-4 rounded-full border-2 border-slate-700">
                  <Award className="text-slate-500" size={32} />
                </div>
                <div>
                  <p className="text-slate-400 font-black text-sm uppercase text-wrap">Mestre do Mogno</p>
                  <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest">Bloqueado</p>
                </div>
              </div>
            </div>
          </div>

          <button className="group w-full bg-[#13E89B] hover:bg-emerald-400 text-[#26170E] font-black py-8 rounded-[28px] shadow-[0_10px_40px_rgba(19,232,155,0.2)] transition-all flex flex-col items-center justify-center gap-2 uppercase tracking-[0.2em] text-sm">
            <span className="flex items-center gap-3">
              Subir de Nível <ArrowUp size={22} className="group-hover:-translate-y-1 transition-transform" />
            </span>
            <span className="text-[10px] opacity-60 normal-case font-bold italic">Consumir folhas para evoluir</span>
          </button>
        </div>

      </div>
    </div>
  );
}