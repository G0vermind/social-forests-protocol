// apps/web/src/hooks/useFreighter.ts
import { useState, useEffect } from 'react';
import * as freighter from '@stellar/freighter-api';

export function useFreighter() {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [hasFreighter, setHasFreighter] = useState<boolean>(false);

    useEffect(() => {
        const checkFreighter = async () => {
            try {
                // 1. Verifica se a extensão da Freighter está instalada
                const connResponse = await freighter.isConnected();
                // Garante a leitura correta independente da versão da lib
                const isConn = typeof connResponse === 'object' ? connResponse.isConnected : connResponse;
                setHasFreighter(isConn);

                if (isConn) {
                    // 2. Verifica se a aplicação já tem permissão do usuário
                    const allowedResponse = await freighter.isAllowed();
                    const isUserAllowed = typeof allowedResponse === 'object' ? allowedResponse.isAllowed : allowedResponse;

                    if (isUserAllowed) {
                        // 3. Se já tiver permissão, pega a chave pública silenciosamente
                        const accessResponse = await freighter.requestAccess();
                        const pubKey = typeof accessResponse === 'object' && accessResponse !== null && 'address' in accessResponse
                            ? (accessResponse as any).address
                            : accessResponse;

                        if (typeof pubKey === 'string') {
                            setPublicKey(pubKey);
                        }
                    }
                }
            } catch (e) {
                console.error("Erro na verificação da Freighter", e);
            }
        };
        checkFreighter();
    }, []);

    const connect = async () => {
        try {
            // O requestAccess abre o popup se o usuário ainda não deu permissão.
            // Se ele já deu permissão, simplesmente retorna a chave.
            const accessResponse = await freighter.requestAccess();

            const pubKey = typeof accessResponse === 'object' && accessResponse !== null && 'address' in accessResponse
                ? (accessResponse as any).address
                : accessResponse;

            if (typeof pubKey === 'string') {
                setPublicKey(pubKey);
                return pubKey;
            }
            return null;
        } catch (error) {
            console.error("Erro ao conectar carteira:", error);
            return null;
        }
    };

    return { publicKey, hasFreighter, connect };
}