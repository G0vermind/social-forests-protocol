"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { Leaf, Wallet, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { session } = useAuth();
  const address = session?.address || "";

  // Pegamos o saldo real de LEAF e XLM
  const { leafBalance, xlmBalance, isLoading } = useAccountBalance(address);

  // Detecção automática de idioma para traduzir "Folhas"
  const [lang, setLang] = useState("pt");
  useEffect(() => {
    const currentLang = document.documentElement.lang || "pt";
    setLang(currentLang.startsWith("pt") ? "pt" : "en");
  }, []);

  const text = {
    pt: { title: "Viveiro Digital", balanceLabel: "Saldo de Folhas", unit: "Folhas", account: "Conta Conectada" },
    en: { title: "Digital Nursery", balanceLabel: "Leaf Balance", unit: "LEAF", account: "Connected Account" }
  }[lang as "pt" | "en"];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10">

      {/* TÍTULO PRINCIPAL */}
      <div>
        <h1 className="text-5xl font-black text-white tracking-tight">{text.title}</h1>
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm mt-2">
          Social Forest Protocol
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* 🌿 CARD DE SALDO LEAF (O DESTAQUE) 🌿 */}
        <div className="bg-slate-900 border-2 border-emerald-500/20 rounded-[48px] p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.1)] group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-12">
              <div className="bg-emerald-500/20 p-5 rounded-3xl border border-emerald-500/30">
                <Leaf className="text-emerald-400" size={40} />
              </div>
              <div className="bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Ativo On-Chain</span>
              </div>
            </div>

            <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] mb-4">
              {text.balanceLabel}
            </p>

            <div className="flex items-baseline gap-4">
              <h2 className="text-8xl font-black text-white tracking-tighter">
                {isLoading ? "..." : leafBalance}
              </h2>
              <span className="text-emerald-500 font-bold text-3xl uppercase tracking-tighter">
                {text.unit}
              </span>
            </div>
          </div>
          {/* Folha gigante no fundo para design moderno */}
          <Leaf className="absolute -right-10 -bottom-10 opacity-[0.03] text-emerald-500" size={350} />
        </div>

        {/* 💳 CARD CONTA CONECTADA (CARTEIRA E XLM) 💳 */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[48px] p-12 shadow-2xl backdrop-blur-md">
          <div className="flex justify-between items-start mb-12">
            <div className="bg-blue-500/20 p-5 rounded-3xl border border-blue-500/30">
              <Wallet className="text-blue-400" size={40} />
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-xs font-black uppercase mb-1">Saldo em Carteira</p>
              <p className="text-3xl font-black text-white">
                {xlmBalance} <span className="text-blue-400 text-lg uppercase">xlm</span>
              </p>
            </div>
          </div>

          <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] mb-4">
            {text.account}
          </p>
          <div className="bg-black/40 p-6 rounded-3xl border border-slate-800/50 shadow-inner">
            <p className="text-emerald-400/90 font-mono text-xs break-all leading-relaxed">
              {address || "Desconectado"}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800/50 flex justify-between items-center text-xs">
            <span className="text-slate-600 font-bold uppercase tracking-widest">Rede Ativa:</span>
            <span className="text-emerald-500 font-black uppercase bg-emerald-500/5 px-3 py-1 rounded-lg">Stellar Testnet</span>
          </div>
        </div>

      </div>

      {/* BOTÃO DE AÇÃO MODERNO */}
      <div className="pt-8">
        <button className="group w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 px-16 rounded-[28px] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-500/20 uppercase tracking-widest text-lg">
          Forjar Novo Ativo
          <ArrowUpRight size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}