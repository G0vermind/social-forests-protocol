'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';

export default function Dashboard() {
  const { session, setRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) { router.push('/'); return; }
    if (session.role === 'admin') { router.push('/admin'); return; }
    if (session.role === 'empresa') { router.push('/empresa'); return; }
    if (session.role === 'consumidor') { router.push('/consumidor/viveiro'); return; }
  }, [session, router]);

  if (!session) return null;

  const options: Array<{ role: UserRole; href: string; emoji: string; label: string; sub: string; color: string; border: string }> = [
    {
      role: 'admin',
      href: '/admin',
      emoji: '🔐',
      label: 'Admin do Protocolo',
      sub: 'Gerenciar contratos, oráculo PoF e empresas verificadas',
      color: 'text-red-400',
      border: 'hover:border-red-500/50',
    },
    {
      role: 'empresa',
      href: '/empresa',
      emoji: '🏢',
      label: 'Empresa Parceira',
      sub: 'Distribuir Green Cashback e acessar analytics ESG',
      color: 'text-blue-400',
      border: 'hover:border-blue-500/50',
    },
    {
      role: 'consumidor',
      href: '/consumidor/viveiro',
      emoji: '🌱',
      label: 'Consumidor',
      sub: 'Coletar Folhas, cultivar árvores e acompanhar impacto',
      color: 'text-green-400',
      border: 'hover:border-green-500/50',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">

        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🌳</div>
          <h1 className="text-2xl font-bold text-white">Como você usa o protocolo?</h1>
          <p className="text-green-400/50 text-sm mt-2 font-mono">
            {session.address.slice(0, 8)}...{session.address.slice(-8)}
          </p>
        </div>

        <div className="grid gap-4">
          {options.map(({ role, href, emoji, label, sub, color, border }) => (
            <button
              key={role}
              id={`btn-role-${role}`}
              onClick={() => { setRole(role); router.push(href); }}
              className={`group w-full p-6 bg-white/5 backdrop-blur border border-white/10 ${border} rounded-2xl text-left transition-all duration-200 hover:bg-white/10`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl" aria-hidden="true">{emoji}</span>
                <div>
                  <p className={`font-semibold text-white group-hover:${color} transition-colors`}>
                    {label}
                  </p>
                  <p className="text-sm text-white/40 mt-0.5">{sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
