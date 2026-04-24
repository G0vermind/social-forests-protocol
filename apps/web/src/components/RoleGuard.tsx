'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Aguardar hidratação do cliente para não dar mismatch de servidor/cliente
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-5xl animate-bounce mb-4 text-emerald-400">🌳</div>
        <p className="text-slate-400 font-medium">Verificando credenciais...</p>
      </div>
    );
  }

  // Se não tem sessão, manda pro login
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 opacity-80" />
        <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Você precisa estar conectado para acessar esta área do protocolo.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all"
        >
          Ir para o Login
        </button>
      </div>
    );
  }

  // Se tem sessão mas o cargo não está na lista de permitidos
  if (!allowedRoles.includes(session.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner shadow-red-500/10">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
        <p className="text-slate-400 max-w-sm mb-2 leading-relaxed">
          Sua credencial de <strong>{session.role}</strong> não tem permissão para visualizar este painel.
        </p>
        <p className="text-xs text-slate-500 mb-8">
          Apenas perfis: {allowedRoles.join(' ou ')}
        </p>
        
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para Meu Espaço
        </button>
      </div>
    );
  }

  // Tudo ok, renderiza os filhos
  return <>{children}</>;
}
