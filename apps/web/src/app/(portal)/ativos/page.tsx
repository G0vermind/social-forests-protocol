import {
  Sprout,
  Hammer,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Package,
  Trees,
  BadgeDollarSign,
  ExternalLink,
} from "lucide-react";

const assets = [
  {
    id: "viveiro-maravilha",
    phase: "Fase 01",
    phaseColor: "emerald",
    title: "Viveiro Maravilha",
    subtitle: "Cultivo de Mudas · Mogno Africano",
    icon: Sprout,
    location: "Pará, Brasil",
    description:
      "Centro de produção e aclimatação de mudas de Mogno Africano (Khaya senegalensis) em larga escala. O Viveiro Maravilha é a origem de cada token — cada Muda é cultivada, monitorada e certificada antes de ser tokenizada no protocolo.",
    stats: [
      { label: "Capacidade", value: "50.000", unit: "mudas/ciclo", icon: Trees },
      { label: "Ciclo médio", value: "18", unit: "meses", icon: TrendingUp },
      { label: "Certificação", value: "IBAMA", unit: "verificado", icon: ShieldCheck },
    ],
    tags: ["Reflorestamento", "Carbon Credit", "RWA Fase 1"],
    accentBg: "from-emerald-900/30 to-slate-900",
    borderColor: "border-emerald-500/20",
    glowColor: "from-emerald-500/30 to-teal-500/10",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    phaseTagColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    id: "somogno-serraria",
    phase: "Fase 02",
    phaseColor: "amber",
    title: "Sómogno",
    subtitle: "Beneficiamento · Geração de Valor",
    icon: Hammer,
    location: "Paragominas, PA",
    description:
      "A serraria Sómogno representa a conclusão do ciclo econômico do protocolo. Árvores maduras têm sua madeira certificada, serrada e comercializada, gerando receita real que é distribuída proporcionalmente aos detentores dos tokens de Árvore Real.",
    stats: [
      { label: "Produção", value: "1.200", unit: "m³/mês", icon: Package },
      { label: "Retorno est.", value: "12-18%", unit: "a.a.", icon: BadgeDollarSign },
      { label: "Rastreabilidade", value: "FSC", unit: "certificado", icon: ShieldCheck },
    ],
    tags: ["Madeira Certificada", "Revenue Share", "RWA Fase 2"],
    accentBg: "from-amber-900/20 to-slate-900",
    borderColor: "border-amber-500/20",
    glowColor: "from-amber-500/25 to-orange-500/10",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    phaseTagColor: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
];

export default function AtivosPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-emerald-600/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 h-80 w-80 rounded-full bg-amber-600/8 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-8 md:py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs text-slate-400 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Ativos Verificados On-Chain
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Lastro Físico
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Os RWAs (Real World Assets) que garantem o valor do protocolo — do cultivo ao beneficiamento, cada etapa rastreável e tokenizada.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {assets.map(
            ({
              id,
              phase,
              title,
              subtitle,
              icon: Icon,
              location,
              description,
              stats,
              tags,
              accentBg,
              borderColor,
              glowColor,
              tagColor,
              phaseTagColor,
              iconBg,
            }) => (
              <div key={id} className="group relative">
                {/* Card glow */}
                <div
                  className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${glowColor} opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100`}
                />

                <div
                  className={`relative rounded-2xl border ${borderColor} bg-gradient-to-br ${accentBg} backdrop-blur-sm overflow-hidden`}
                >
                  {/* Top accent bar */}
                  <div className={`h-px w-full bg-gradient-to-r ${glowColor}`} />

                  <div className="p-6">
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg} border border-white/5`}>
                          <Icon className="h-6 w-6" strokeWidth={1.5} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white leading-tight">
                            {title}
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                        </div>
                      </div>

                      <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wider ${phaseTagColor}`}>
                        {phase}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-4 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {location}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      {description}
                    </p>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {stats.map(({ label, value, unit, icon: StatIcon }) => (
                        <div
                          key={label}
                          className="flex flex-col gap-1 rounded-xl bg-slate-800/50 border border-slate-700/40 p-3"
                        >
                          <StatIcon className="h-4 w-4 text-slate-500 mb-0.5" strokeWidth={1.5} />
                          <span className="text-base font-bold text-white leading-none">
                            {value}
                          </span>
                          <span className="text-[10px] text-slate-500 leading-tight">
                            {unit}
                          </span>
                          <span className="text-[10px] text-slate-600 leading-tight">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tagColor}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors group/link">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span className="group-hover/link:underline">
                        Ver documentação do ativo
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center text-xs text-slate-700 leading-relaxed">
          Todos os ativos são auditados e registrados em contrato inteligente.<br />
          Dados atualizados a cada ciclo de governança da DAO.
        </p>
      </div>
    </main>
  );
}
