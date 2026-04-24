import { rarity as rarityConfig } from '@/lib/design-tokens';

type RarityType = keyof typeof rarityConfig;

interface LeafBadgeProps {
  type: RarityType;
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

export function LeafBadge({ type, count, size = 'md' }: LeafBadgeProps) {
  const cfg = rarityConfig[type];
  const sz = { sm: 'text-xs px-2 py-1 gap-1', md: 'text-sm px-3 py-2 gap-2', lg: 'text-base px-4 py-3 gap-2' }[size];

  return (
    <div className={`
      inline-flex items-center rounded-2xl border font-medium
      ${cfg.bg} ${cfg.border} ${cfg.text} ${cfg.glow} ${sz}
      transition-all duration-300 hover:scale-105
    `}>
      <span>{cfg.emoji}</span>
      <span className="font-bold">{count.toLocaleString('pt-BR')}</span>
    </div>
  );
}
