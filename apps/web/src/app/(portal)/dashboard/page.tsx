'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) { 
      router.push('/'); 
      return; 
    }
    
    // Redirecionamento automático baseado no papel
    if (session.role === 'admin') { 
      router.push('/admin'); 
      return; 
    }
    if (session.role === 'empresa') { 
      router.push('/empresa'); 
      return; 
    }
    // Padrão para Consumidor e outros
    router.push('/consumidor/viveiro');
  }, [session, router]);

  // Tela de transição enquanto redireciona
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="text-5xl animate-bounce mb-4">🌳</div>
      <p className="text-emerald-400 font-medium">Carregando seu espaço sustentável...</p>
    </main>
  );
}
