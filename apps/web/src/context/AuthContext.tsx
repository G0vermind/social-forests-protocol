'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Session, UserRole } from '@/types';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  connectFreighter: () => Promise<void>;
  connectGoogle: () => Promise<void>;
  disconnect: () => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectFreighter = useCallback(async () => {
    setIsLoading(true);
    try {
      // Importação dinâmica — Freighter é browser-only
      const { isConnected, requestAccess } = await import('@stellar/freighter-api');
      const { isConnected: connected } = await isConnected();

      if (!connected) {
        throw new Error('Freighter não instalado. Acesse freighter.app');
      }

      const { address, error } = await requestAccess();
      if (error || !address) throw new Error(error || 'Acesso negado');

      setSession({
        address,
        role: null, // Will be set after on-chain verification
        isWeb2: false,
      });
    } catch (err) {
      console.error('Erro Freighter:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectGoogle = useCallback(async () => {
    // TODO: Integrar com NextAuth ou Privy para Account Abstraction real
    setIsLoading(true);
    try {
      setSession({
        address: 'GPLACEHOLDER000000000000000000000000000000000000000',
        role: 'consumidor',
        displayName: 'Usuário Google',
        isWeb2: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setSession(null);
  }, []);

  const setRole = useCallback((role: UserRole) => {
    setSession(prev => (prev ? { ...prev, role } : null));
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
