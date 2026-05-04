// apps/web/src/components/ForestGallery.tsx
'use client';

import { useForest } from '../hooks/useForest';
import { FLORESTAS_CONFIG } from '../lib/soroban/config';

export default function ForestGallery({ publicKey }: { publicKey: string }) {
    const { nfts, loading } = useForest(publicKey);

    if (loading) return <div className="text-neutral-500" > Carregando seus ativos...</div>;

    return (
        <div className= "grid grid-cols-1 md:grid-cols-3 gap-6 mt-8" >
        {
            nfts.map((nft) => (
                <div key= { nft.id } className = "bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-green-500/50 transition-all group" >
                <div className="h-32 w-full bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-lg mb-4 flex items-center justify-center" >
            <span className="text-4xl group-hover:scale-110 transition-transform" >🌳</span>
            </div>
            < div className = "flex justify-between items-start mb-2" >
            <h4 className="font-bold text-lg" > Mogno Africano #{ nft.id } </h4>
            < span className = "text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded uppercase" >
            { nft.rarity }
            </span>
            </div>
            < p className = "text-xs text-neutral-500 mb-4" > { nft.species } </p>
            < div className = "pt-4 border-t border-neutral-800 flex justify-between items-center" >
            <span className="text-[10px] text-neutral-600 font-mono" > ID: { FLORESTAS_CONFIG.contracts.rwaVault.substring(0, 6) }...</span>
            < button className = "text-xs text-green-400 hover:underline" > Ver Certificado </button>
            </div>
            </div>
            ))
        }
        </div>
  );
}