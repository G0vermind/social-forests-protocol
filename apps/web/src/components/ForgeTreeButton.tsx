'use client';

import { useState } from 'react';
import { forgeTreeTransaction } from '../lib/soroban/transactions';

export default function ForgeTreeButton({ userPublicKey }: { userPublicKey: string }) {
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleForge = async () => {
        setLoading(true);
        setError(null);
        setHash(null);
        try {
            const txHash = await forgeTreeTransaction(userPublicKey);
            setHash(txHash);
        } catch (err: any) {
            setError(err.message || 'Erro ao forjar árvore.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2">Transformar Estoque em Ativo</h3>
            <p className="text-sm text-neutral-400 mb-6">
                Forje um NFT que representa um lastro real de Mogno Africano. Custo: 100 LEAF.
            </p>
            
            <button 
                onClick={handleForge} 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
            >
                {loading ? 'Processando na Blockchain...' : 'Forjar dNFT (100 LEAF)'}
            </button>

            {hash && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded text-sm text-green-400 break-all">
                    Sucesso! Hash: {hash}
                </div>
            )}
            
            {error && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded text-sm text-red-400">
                    {error}
                </div>
            )}
        </div>
    );
}
