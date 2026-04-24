'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Session, UserRole } from '@/types';
import { loginWithGoogle } from '@/lib/account-abstraction';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  connectFreighter: () => Promise<void>;
  connectGoogle: () => Promise<void>;
  disconnect: () => void;
  setRole: (role: UserRole) => void;
}

const MOCK_ADMINS = ['G...ADMIN']; // Substitua pelo admin real
const MOCK_EMPRESAS = ['G...EMPRESA1', 'G...EMPRESA2']; // Substitua pelas empresas reais

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa true para checar storage

  // Sincroniza com localStorage no carregamento inicial
  useEffect(() => {
    const stored = localStorage.getItem('sfp_session');
    if (stored) {
      try {
        setSessionState(JSON.parse(stored));
      } catch (e) {
        console.error('Erro ao parsear sessão', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Setter customizado que também salva no localStorage
  const setSession = useCallback((newSession: Session | null) => {
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem('sfp_session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('sfp_session');
    }
  }, []);

  const connectFreighter = useCallback(async () => {
    setIsLoading(true);
    try {
      const { isConnected, requestAccess } = await import('@stellar/freighter-api');
      const { isConnected: connected } = await isConnected();

      if (!connected) {
        throw new Error('Freighter não instalado. Acesse freighter.app');
      }

      const { address, error } = await requestAccess();
      if (error || !address) throw new Error(error || 'Acesso negado');

      // Resolve a role baseada na whitelist
      let resolvedRole: UserRole = 'consumidor';
      if (MOCK_ADMINS.includes(address)) resolvedRole = 'admin';
      else if (MOCK_EMPRESAS.includes(address)) resolvedRole = 'empresa';

      setSession({
        address,
        role: resolvedRole,
        isWeb2: false,
      });
    } catch (err) {
      console.error('Erro Freighter:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const connectGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const abstractAccount = await loginWithGoogle();
      setSession({
        address: abstractAccount.address,
        role: 'consumidor',
        displayName: abstractAccount.displayName,
        isWeb2: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [setSession]);

  const disconnect = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const setRole = useCallback((role: UserRole) => {
    setSessionState(prev => {
      const updated = prev ? { ...prev, role } : null;
      if (updated) localStorage.setItem('sfp_session', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, connectFreighter, connectGoogle, disconnect, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
