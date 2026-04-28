"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreePine, Sprout, Landmark, Vote, ExternalLink, Wallet } from "lucide-react";

// ✨ IMPORTAÇÕES CORRETAS PARA O SEU PROJETO ✨
import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";

const navItems = [
  {
    label: "Viveiro Digital",
    href: "/dashboard",
    icon: Sprout,
    description: "Suas mudas & saldo",
  },
  {
    label: "Lastro Físico",
    href: "/ativos",
    icon: Landmark,
    description: "RWAs verificados",
  },
  {
    label: "DAO",
    href: "/dao",
    icon: Vote,
    description: "Governança & votos",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  // 🔗 Conectando com a sua conta real do AuthContext
  const { session, disconnect } = useAuth();
  const address = session?.address || null;

  // 💰 Buscando o saldo de LEAF usando o endereço da sessão
  const { leafBalance, isLoading } = useAccountBalance(address);

  return (
    <>
      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-slate-950 border-r border-slate-800/60 px-4 py-6 shrink-0">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 px-3 mb-8 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
            <TreePine className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-emerald-400 tracking-tight">Social Forest</span>
            <span className="text-[10px] text-slate-600 tracking-widest uppercase">Protocol v0.1</span>
          </div>
        </Link>

        {/* 🌿 CARD DE SALDO LEAF (Onde os 50.00 aparecerão) 🌿 */}
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
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 rounded-r-full bg-emerald-400" />
                )}

                <div className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors
                  ${isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-slate-800/70 text-slate-500 group-hover:bg-slate-700/70 group-hover:text-slate-300"
                  }
                `}>
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col leading-tight min-w-0">
                  <span className="text-sm font-semibold truncate">{label}</span>
                  <span className={`text-[11px] truncate transition-colors ${isActive ? "text-emerald-500/70" : "text-slate-600 group-hover:text-slate-500"}`}>
                    {description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* BOTÃO DE SAIR */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => disconnect()}
            className="w-full flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-900/40 px-3 py-3 text-xs text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <div className="bg-slate-800 h-5 w-5 rounded-md flex items-center justify-center">
              <span className="text-[10px] text-red-400">🚪</span>
            </div>
            Sair da Conta
          </button>

          <div className="px-3 py-2">
            <p className="text-[10px] text-slate-600">Protocolo Florestas.Social</p>
          </div>
        </div>
      </aside>

      {/* ── MENU MOBILE (Apenas celulares) ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl px-2 py-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2 ${isActive ? "text-emerald-400" : "text-slate-500"}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}