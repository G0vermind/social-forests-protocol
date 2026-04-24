'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, ShieldCheck, TreePine, Globe2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg">🌳</span>
          <span className="text-xl font-bold text-white tracking-tight">Florestas<span className="text-green-400">.Social</span></span>
        </div>
        <Link 
          href="/login" 
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-full font-semibold transition-all backdrop-blur-md"
        >
          Acessar Plataforma
        </Link>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 mt-10 md:mt-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-8 animate-fade-in-up">
          <ShieldCheck className="w-4 h-4" />
          <span>Protocolo Soroban (Stellar Testnet)</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight mb-6 animate-fade-in-up" style={{animationDelay: '100ms'}}>
          Finanças Regenerativas com <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Mogno Africano</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed animate-fade-in-up" style={{animationDelay: '200ms'}}>
          Transforme seu engajamento sustentável em impacto real. Conectamos empresas e consumidores através de ativos tokenizados (RWAs) e Cashback Verde.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <Link 
            href="/login" 
            className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 text-lg font-bold px-8 py-4 rounded-full shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 hover:scale-105"
          >
            Entrar no Protocolo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="https://github.com/G0vermind/social-forests-protocol" 
            target="_blank" 
            rel="noreferrer"
            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-lg font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center backdrop-blur-md"
          >
            Ver no GitHub
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md hover:bg-slate-900/60 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
            <TreePine className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Ativos Reais (RWAs)</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Cada NFT no protocolo representa uma árvore de Mogno Africano real, com crescimento validado por oráculos.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md hover:bg-slate-900/60 transition-colors">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Cashback Verde</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Ganhe "Folhas" (Tokens de Utilidade) ao fazer escolhas sustentáveis com nossas empresas parceiras verificadas.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md hover:bg-slate-900/60 transition-colors">
          <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Impacto Imutável</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Seu esforço ecológico é registrado como Reputação Soulbound na blockchain da Stellar. Intransferível e eterno.
          </p>
        </div>
      </div>
    </main>
  );
}
