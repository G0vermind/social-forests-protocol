'use client';

import { useFreighter } from '../hooks/useFreighter';

export default function WalletConnect() {
    const { publicKey, hasFreighter, connect } = useFreighter();

    return (
        <div className="flex items-center gap-4">
            {publicKey ? (
                <div className="bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800 text-sm font-mono text-green-400">
                    {publicKey.substring(0, 4)}...{publicKey.substring(publicKey.length - 4)}
                </div>
            ) : hasFreighter ? (
                <button 
                    onClick={connect}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                    Conectar Freighter
                </button>
            ) : (
                <a 
                    href="https://freighter.app" 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-6 rounded-full transition-colors border border-neutral-700"
                >
                    Instalar Freighter
                </a>
            )}
        </div>
    );
}
