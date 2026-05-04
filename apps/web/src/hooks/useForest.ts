// apps/web/src/hooks/useForest.ts
import { useState, useEffect } from 'react';
import { rpc, Contract, Address } from '@stellar/stellar-sdk';
import { FLORESTAS_CONFIG } from '../lib/soroban/config';

const server = new rpc.Server(FLORESTAS_CONFIG.rpcUrl);

export function useForest(publicKey: string | null) {
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchForest = async () => {
        if (!publicKey) return;
        setLoading(true);

        try {
            // Aqui simulamos a busca dos dados. 
            // Em breve, usaremos o server.getLedgerEntries para listar seus dNFTs reais.

            // Mock inicial para visualização do dNFT de Mogno Africano (Khaya senegalensis)
            // que você já validou na rede.
            const mockData = [
                {
                    id: 1,
                    rarity: 'Plantador',
                    species: 'Mogno Africano',
                    origin: 'Viveiro Maravilha'
                }
            ];

            setNfts(mockData);
        } catch (e) {
            console.error("Erro ao carregar ativos florestais:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForest();
    }, [publicKey]);

    return { nfts, loading, refresh: fetchForest };
}