"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreePine, Sprout, Target, Settings, Landmark, Vote, Wallet } from "lucide-react";

// ✨ IMPORTAÇÕES DO SEU CONTEXTO ✨
import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";

// 📋 OS 3 PILARES: VIVEIRO, MISSÕES E AJUSTES
const navItems = [
  {
    label: "Viveiro",
    href: "/consumidor/viveiro",
    icon: Sprout,
    description: "Suas mudas & evolução",
  },
  {
    label: "Missões",
    href: "/consumidor/missoes",
    icon: Target,
    description: "Ganhe LEAFs agora",
  },
  {
    label: "Ajustes",
    href: "/dashboard",
    icon: Settings,
    description: "Configurações e RWA",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { session, disconnect } = useAuth();
  const address = session?.address || null;
  const { leafBalance, isLoading } = useAccountBalance(address);

  return (
    <>
      {/* ── SIDEBAR DESKTOP (Lateral para PC) ── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-slate-950 border-r border-slate-800/60 px-4 py-6 shrink-0">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 px-3 mb-8 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
            <TreePine className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-emerald-400 tracking-tight">Social Forest</span>
            <span className="text-[10px] text-slate-600 tracking-widest uppercase">Protocol v2.5</span>
          </div>
        </Link>

        {/* 🌿 CARD DE SALDO LEAF 🌿 */}
        <div className="px-3 mb-8">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500/70">
                Saldo de Leaf
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-100">
                {isLoading ? "..." : leafBalance}
              </span>
              <span className="text-xs font-medium text-emerald-400">LEAF</span>
            </div>
          </div>
        </div>

        {/* MENU DE NAVEGAÇÃO */}
        <nav className="flex flex-col gap-1.5 flex-1">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Navegação
          </p>

          {navItems.map(({ label, href, icon: Icon, description }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200
                  ${isActive
                    ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
                  }
                `}
              >
                <div className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors
                  ${isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800/70 text-slate-500"}
                `}>
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-sm font-semibold truncate">{label}</span>
                  <span className="text-[11px] truncate opacity-60">{description}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* SAIR */}
        <button
          onClick={() => disconnect()}
          className="w-full flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/40 px-3 py-3 text-xs text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <span>🚪</span> Sair da Conta
        </button>
      </aside>

      {/* ── MENU MOBILE FLUTUANTE (Dando o "respiro" que você pediu) ── */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 flex md:hidden bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-white/10 px-2 py-2 shadow-2xl">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 ${isActive ? "text-emerald-400" : "text-slate-500"}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}