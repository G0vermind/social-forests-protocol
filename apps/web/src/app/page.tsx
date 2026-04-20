"use client";

import { Leaf, Sprout, Sparkles, Wallet, ChevronRight, TreePine } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-72 w-72 rounded-full bg-emerald-600/20 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] h-96 w-96 rounded-full bg-teal-500/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-emerald-900/30 blur-[80px]" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <TreePine className="h-6 w-6 text-emerald-400" strokeWidth={1.5} />
          <span className="text-xl font-bold tracking-tight text-emerald-400">
            Social Forest
          </span>
        </div>

        {/* Wallet chip */}
        <button className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm transition hover:border-emerald-500/60 hover:text-emerald-300 active:scale-95">
          <Wallet className="h-4 w-4" />
          <span>Conectar</span>
        </button>
      </header>

      {/* ── BODY ── */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-10 pt-4">

        {/* Saldo badge */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-5 py-2 text-sm text-emerald-300 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Viveiro Digital • Temporada 1
        </div>

        {/* ── MUDA CARD ── */}
        <div className="group relative w-full max-w-sm">
          {/* Card glow on hover */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-emerald-500/40 to-teal-400/20 opacity-60 blur-sm transition-all duration-500 group-hover:opacity-100 group-hover:blur-md" />

          <div className="relative flex flex-col items-center gap-6 rounded-3xl border border-slate-700/60 bg-slate-900/80 px-8 py-10 backdrop-blur-xl shadow-2xl">
            {/* NFT-style badge */}
            <div className="absolute top-4 right-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-xs font-semibold text-emerald-400 tracking-widest">
              NFT
            </div>

            {/* Icon orb */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-emerald-500/30 bg-gradient-to-br from-emerald-900/80 to-slate-900">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse" />
              <Sprout className="relative h-14 w-14 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" strokeWidth={1.2} />
            </div>

            {/* Info */}
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Espécie
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Mogno Africano
              </h1>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-bold text-amber-400">
                <Leaf className="h-3 w-3" />
                Muda Nível 1
              </span>
            </div>

            {/* Stats row */}
            <div className="grid w-full grid-cols-3 gap-2 rounded-2xl border border-slate-700/50 bg-slate-800/40 p-3">
              {[
                { label: "Crescimento", value: "0%" },
                { label: "Saúde", value: "100%" },
                { label: "Raridade", value: "C" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <span className="text-base font-bold text-emerald-300">{stat.value}</span>
                  <span className="text-[10px] text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SALDO COUNTER ── */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Saldo atual
          </p>
          <p className="text-5xl font-black tracking-tight text-white">
            150{" "}
            <span className="text-emerald-400">Folhas</span>{" "}
            <span className="text-3xl">🍃</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">≈ 0.075 ETH em créditos verdes</p>
        </div>

        {/* ── CTA BUTTON ── */}
        <div className="flex w-full max-w-sm flex-col gap-3">
          <button className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-95 text-base tracking-wide">
            {/* shine effect */}
            <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              <TreePine className="h-5 w-5" />
              Forjar Árvore Real
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <button className="w-full rounded-2xl border border-slate-700 bg-transparent px-6 py-3 text-sm text-slate-400 transition hover:border-slate-500 hover:text-slate-200 active:scale-95">
            Ver meu portfólio
          </button>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-slate-600 max-w-xs">
          Cada árvore forjada é plantada no mundo real via protocolo de impacto verificável 🌍
        </p>
      </section>
    </main>
  );
}
