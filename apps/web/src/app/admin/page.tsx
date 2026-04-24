'use client';

import RoleGuard from '@/components/RoleGuard';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Activity, 
  Settings,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboard() {
  const { session } = useAuth();

  return (
    <RoleGuard allowedRoles={['admin']}>
      <main className="flex-1 p-6 lg:p-10 space-y-8 bg-[#0a0a0a] min-h-screen text-neutral-200">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              Painel de Controle Administrativo
            </h1>
            <p className="text-neutral-400 mt-2">
              Visão global e gerenciamento do Protocolo Social Forests.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm transition-colors text-white">
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>
        </header>

        {/* Visão Geral Rápida */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Building2 className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                +3 Novas
              </span>
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Empresas Parceiras</p>
            <h3 className="text-3xl font-bold text-white">24</h3>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
               <span className="text-xs font-medium px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                +145 Hoje
              </span>
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Usuários Ativos</p>
            <h3 className="text-3xl font-bold text-white">3,892</h3>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Transações (24h)</p>
            <h3 className="text-3xl font-bold text-white">1.2M</h3>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-sm relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
               <span className="text-xs font-medium px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                Urgente
              </span>
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">Auditorias Pendentes</p>
            <h3 className="text-3xl font-bold text-white">2</h3>
          </div>
        </div>

        {/* Gerenciamento de Acessos */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Controle de Segurança e Acessos</h2>
          
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-medium">RoleGuard Ativo</h3>
              <p className="text-sm text-neutral-400 mt-1">
                Todas as rotas críticas (/consumidor, /empresa, /admin) estão devidamente blindadas com o verificador de papéis baseado no LocalStorage Session. Acesso negado para perfis não autorizados sendo redirecionados para o painel padrão.
              </p>
            </div>
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}
