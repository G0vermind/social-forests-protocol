"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { Trophy, Leaf, Zap } from "lucide-react";

export default function MissoesPage() {
  const { session } = useAuth();
  const address = session?.address || null;

  // 💰 Buscando o saldo real do contrato
  const { leafBalance, isLoading } = useAccountBalance(address);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="text-yellow-500 h-8 w-8" />
          Missões de Impacto
        </h1>
        <p className="text-slate-400 mt-2">Transforme suas ações em ativos biológicos.</p>
      </header>

      {/* CARD DE SALDO REAL */}
      <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Seu Saldo Atual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">
              {isLoading ? "..." : leafBalance}
            </span>
            <span className="text-emerald-500 font-bold text-sm">LEAF</span>
          </div>
        </div>
        <Leaf className="text-emerald-500/40 h-12 w-12" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4 opacity-50">
          <div className="bg-blue-500/20 p-3 rounded-lg"><Zap className="text-blue-400" /></div>
          <div>
            <h3 className="font-bold text-white">Mão na Massa</h3>
            <p className="text-slate-500 text-sm">Missão concluída: 50 LEAFs recebidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}