// apps/web/src/app/page.tsx

import WalletConnect from '@/components/WalletConnect';
import ForgeTreeButton from '@/components/ForgeTreeButton';
import ForestGallery from '@/components/ForestGallery';
import { useFreighter } from '@/hooks/useFreighter';

export default function Home() {
  const { publicKey } = useFreighter();

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12">
      {/* Cabeçalho do Ecossistema */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-green-500">
            FLORESTAS.SOCIAL
          </h1>
          <p className="text-neutral-500">Protocolo de Lastro Ativo & RWA</p>
        </div>
        <WalletConnect />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Painel de Operações (Símbolo da Serraria/Viveiro) */}
        <div className="lg:col-span-1">
          <div className="sticky top-12 space-y-6">
            <h2 className="text-xl font-bold border-b border-neutral-800 pb-2">Operações</h2>

            {publicKey ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">
                  Bem-vindo ao terminal de forja. Aqui você transforma o estoque físico da <strong>Sómogno</strong> em ativos digitais auditáveis.
                </p>
                <ForgeTreeButton userPublicKey={publicKey} />
              </div>
            ) : (
              <div className="p-8 bg-neutral-900/30 border border-dashed border-neutral-800 rounded-2xl text-center">
                <p className="text-neutral-500 text-sm italic">
                  Conecte sua carteira para acessar o inventário on-chain.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Galeria de Ativos (Sua Floresta Digital) */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Inventário de Ativos Ambientais</h2>
            {publicKey && (
              <span className="text-[10px] bg-neutral-800 px-2 py-1 rounded text-neutral-400 uppercase tracking-widest">
                Rede: Stellar Testnet
              </span>
            )}
          </div>

          {publicKey ? (
            <ForestGallery publicKey={publicKey} />
          ) : (
            <div className="h-80 flex items-center justify-center border border-neutral-900 rounded-3xl bg-neutral-950/50">
              <div className="text-center">
                <span className="text-5xl block mb-4 opacity-20">🌳</span>
                <p className="text-neutral-600">Aguardando autenticação do parceiro...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Informativo (Importante para conformidade) */}
      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-neutral-900 text-center md:text-left">
        <p className="text-[10px] text-neutral-700 uppercase tracking-[0.2em]">
          Ativos lastreados em Mogno Africano (Khaya senegalensis) • Isento de DOF (Espécie Exótica) • Viveiro Maravilha
        </p>
      </footer>
    </main>
  );
}