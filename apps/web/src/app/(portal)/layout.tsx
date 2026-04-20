'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ReactNode } from 'react';

// ─── Nav items por role ───────────────────────────────────────

interface NavItem { href: string; emoji: string; label: string }

const NAV_ITEMS: Record<NonNullable<UserRole>, NavItem[]> = {
  consumidor: [
    { href: '/consumidor/viveiro',   emoji: '🌱', label: 'Viveiro' },
    { href: '/consumidor/missoes',   emoji: '🎯', label: 'Missões' },
    { href: '/consumidor/historico', emoji: '📜', label: 'Histórico' },
    { href: '/marketplace',          emoji: '🛒', label: 'Marketplace' },
  ],
  empresa: [
    { href: '/empresa',           emoji: '📊', label: 'Dashboard' },
    { href: '/empresa/cashback',  emoji: '💚', label: 'Cashback' },
    { href: '/empresa/missoes',   emoji: '🎯', label: 'Missões' },
    { href: '/empresa/analytics', emoji: '📈', label: 'Analytics' },
  ],
  admin: [
    { href: '/admin',         emoji: '📋', label: 'Contratos' },
    { href: '/admin/oracle',  emoji: '🔮', label: 'Oracle' },
    { href: '/admin/empresas',emoji: '🏢', label: 'Empresas' },
    { href: '/admin/lotes',   emoji: '🌿', label: 'Lotes' },
  ],
};

// ─── Bottom Navigation Bar ────────────────────────────────────

function BottomNav({ role }: { role: NonNullable<UserRole> }) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-white/10 safe-area-inset-bottom"
    >
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {items.map(({ href, emoji, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-2 flex-1 text-center transition-colors ${
                active ? 'text-green-400' : 'text-white/30 hover:text-white/60'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="text-xl leading-none" aria-hidden="true">{emoji}</span>
              <span className={`text-[10px] font-medium ${active ? 'text-green-400' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Top Header Bar ───────────────────────────────────────────

function TopBar({ role, address }: { role: NonNullable<UserRole>; address: string }) {
  const { disconnect } = useAuth();

  const ROLE_LABEL: Record<NonNullable<UserRole>, string> = {
    consumidor: '🌱 Consumidor',
    empresa: '🏢 Empresa',
    admin: '🔐 Admin',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-white/5 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">🌳</span>
          <span className="font-bold text-white text-sm">Florestas<span className="text-green-400">.Social</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            {ROLE_LABEL[role]}
          </span>
          <span className="text-xs text-white/20 font-mono hidden sm:block">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
          <button
            onClick={disconnect}
            className="text-xs text-white/30 hover:text-red-400 transition-colors"
            aria-label="Desconectar carteira"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Layout Wrapper ───────────────────────────────────────────

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { session } = useAuth();

  // Sem sessão ou role: apenas renderiza (dashboard/redirect vai cuidar disso)
  if (!session?.role) {
    return <>{children}</>;
  }

  const role = session.role;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <TopBar role={role} address={session.address} />

      {/* Conteúdo com padding-bottom para não ficar sob a nav */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      <BottomNav role={role} />
    </div>
  );
}
