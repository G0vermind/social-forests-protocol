'use client';

import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = {
  consumidor: [
    { href: '/consumidor/viveiro', emoji: '🌱', label: 'Viveiro' },
    { href: '/consumidor/missoes', emoji: '🎯', label: 'Missões' },
    { href: '/marketplace', emoji: '🛒', label: 'Marketplace' },
  ],
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { session, disconnect, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500">Carregando...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50">
      {/* HEADER LIMPO E MODERNO */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo className="h-8 w-auto" />
          <button
            onClick={() => disconnect()}
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
        {children}
      </main>

      {/* NAV INFERIOR DISCRETA */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#020617] border-t border-slate-800/50 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {(NAV_ITEMS.consumidor).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center py-4 transition-all ${pathname === item.href ? 'text-emerald-400' : 'text-slate-500'}`}
            >
              <span className="text-xl mb-1">{item.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}