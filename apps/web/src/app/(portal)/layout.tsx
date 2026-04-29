'use client';

import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LogOut, Settings, Target, Sprout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 📋 DEFINIÇÃO DOS 3 PILARES (LIMPEZA VISUAL)
const NAV_ITEMS = [
  { href: '/consumidor/viveiro', icon: Sprout, label: 'Viveiro' },
  { href: '/consumidor/missoes', icon: Target, label: 'Missões' },
  { href: '/dashboard', icon: Settings, label: 'Ajustes' },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { session, disconnect, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500 font-bold">Carregando...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo className="h-7 w-auto" />
          <button
            onClick={() => disconnect()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/5 text-red-400/80 hover:bg-red-500/10 transition-all text-xs font-medium"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      {/* ── CONTEÚDO PRINCIPAL (COM RESPIRO pb-40) ── */}
      <main className="flex-1 pt-24 pb-40 px-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* ── NAVEGAÇÃO FLUTUANTE (DANDO ESPAÇO PARA A VISTA) ── */}
      <nav className="fixed bottom-6 left-6 right-6 z-50 max-w-md mx-auto">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center py-3 rounded-2xl transition-all ${isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                <Icon size={22} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}