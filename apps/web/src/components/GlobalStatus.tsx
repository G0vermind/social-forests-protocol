"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { Leaf, Wallet, Circle } from "lucide-react";

export default function GlobalStatus() {
    const { session } = useAuth();
    const address = session?.address || "";
    const { leafBalance, isLoading } = useAccountBalance(address);

    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "Desconectado";

    return (
        <div className="w-full bg-[#26170E] border-2 border-[#13E89B]/20 rounded-[32px] p-6 shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6">

            {/* SEÇÃO DA CARTEIRA (IGUAL À FOTO) */}
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700">
                        <Wallet size={32} className="text-blue-400" />
                    </div>
                    <Circle size={14} fill="#13E89B" className="absolute -top-1 -right-1 text-[#13E89B] animate-pulse" />
                </div>
                <div>
                    <p className="text-[#13E89B] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Status do Protocolo</p>
                    <p className="text-white font-mono text-lg font-bold">{shortAddress}</p>
                    <span className="text-emerald-500/60 text-[9px] font-black uppercase tracking-widest">Conectado via Freighter</span>
                </div>
            </div>

            {/* SEÇÃO DO SALDO (FOCADO EM LEITURA) */}
            <div className="bg-black/40 px-8 py-4 rounded-[24px] border-l-4 border-[#13E89B] flex items-center gap-6 min-w-[240px]">
                <div className="text-right">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Saldo em Folhas</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-5xl font-black text-white tracking-tighter">
                            {isLoading ? "..." : leafBalance}
                        </h2>
                        <span className="text-[#13E89B] font-black text-xl italic">LEAF</span>
                    </div>
                </div>
                <div className="bg-[#13E89B]/10 p-3 rounded-xl">
                    <Leaf size={35} className="text-[#13E89B]" />
                </div>
            </div>
        </div>
    );
}