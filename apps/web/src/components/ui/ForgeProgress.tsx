interface ForgeProgressProps {
  current: number;
  threshold: number;
  treesForged: number;
  isLoading?: boolean;
  onForge?: () => Promise<void>;
}

export function ForgeProgress({ current, threshold, treesForged, isLoading, onForge }: ForgeProgressProps) {
  const pct = Math.min(Math.floor((current / threshold) * 100), 100);
  const isNearComplete = pct >= 80;
  const canForge = pct >= 100;
  const treeStage = pct < 25 ? '🌱' : pct < 50 ? '🌿' : pct < 80 ? '🌳' : pct < 100 ? '🌲' : '🌴';

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">
            Próxima Árvore
          </p>
          <p className="text-3xl font-bold text-white">
            {current.toLocaleString('pt-BR')}
            <span className="text-base font-normal text-gray-500 ml-2">
              / {threshold.toLocaleString('pt-BR')}
            </span>
          </p>
        </div>
        <span className={`text-6xl transition-all duration-700 ${canForge ? 'animate-bounce' : ''}`}>
          {treeStage}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out
            bg-gradient-to-r from-green-500 to-emerald-400
            ${isNearComplete ? 'shadow-[0_0_12px_rgba(74,222,128,0.6)]' : ''}
          `}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{treesForged} forjada{treesForged !== 1 ? 's' : ''}</p>
        <p className={`text-xs font-medium ${isNearComplete ? 'text-green-400' : 'text-gray-500'}`}>
          {pct}%
        </p>
      </div>

      {canForge && onForge && (
        <button
          onClick={onForge}
          disabled={isLoading}
          className="mt-4 w-full py-3 rounded-2xl font-bold text-black
            bg-gradient-to-r from-green-400 to-emerald-300
            hover:from-green-300 hover:to-emerald-200
            shadow-lg shadow-green-500/30
            transition-all transform hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '⏳ Forjando...' : '🌳 Forjar Minha Árvore!'}
        </button>
      )}
    </div>
  );
}
