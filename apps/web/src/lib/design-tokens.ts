export const glass = {
  card:   'bg-white/5 backdrop-blur-md border border-white/10 shadow-xl',
  cardHover: 'hover:bg-white/10 hover:border-white/20 transition-all duration-300',
  panel:  'bg-black/40 backdrop-blur-xl border border-white/5',
  input:  'bg-white/10 border border-white/20 focus:border-green-400/60 backdrop-blur-sm',
} as const;

export const gradients = {
  forestDark: 'from-green-950 via-emerald-900 to-green-900',
  leafGlow:   'from-green-400/20 to-emerald-500/20',
  rareGlow:   'from-blue-400/20 to-blue-600/20',
  legendGlow: 'from-amber-400/30 via-yellow-500/20 to-orange-400/20',
  adminDark:  'from-gray-950 to-gray-900',
  companyDark:'from-slate-900 to-blue-950',
} as const;

export const rarity = {
  common:    { bg: 'bg-gray-500/20', border: 'border-gray-500/40', text: 'text-gray-300',   glow: '', emoji: '🍃' },
  rare:      { bg: 'bg-blue-500/20', border: 'border-blue-400/40', text: 'text-blue-300',   glow: 'shadow-blue-500/20 shadow-lg', emoji: '💎' },
  legendary: { bg: 'bg-amber-500/20',border: 'border-amber-400/40',text: 'text-amber-300',  glow: 'shadow-amber-500/30 shadow-xl animate-pulse', emoji: '⭐' },
} as const;
