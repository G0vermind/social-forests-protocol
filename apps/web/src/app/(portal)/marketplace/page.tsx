'use client';

import { useState } from 'react';
import { Missao } from '@/types';

// TODO: Substituir por fetch de API que agrega missões de todas as empresas verificadas
const mockMissoes: Missao[] = [
  {
    id: 'M001',
    titulo: 'Compre o Kit Eco Maravilha',
    descricao: 'Adquira o kit sustentável e ganhe folhas raras. Cada real gasto = 15 folhas.',
    empresa: 'Eco Maravilha LTDA',
    tipo: 'sku',
    recompensa: 150,
    raridade: 'rara',
    expiracao: Date.now() + 14 * 86_400_000,
    ativa: true,
  },
  {
    id: 'M002',
    titulo: 'Avalie sua Entrega 🚚',
    descricao: 'Deixe sua avaliação no app após a entrega e ganhe folhas comuns.',
    empresa: 'VerdeFast Logística',
    tipo: 'engajamento',
    recompensa: 50,
    raridade: 'comum',
    expiracao: Date.now() + 7 * 86_400_000,
    ativa: true,
  },
  {
    id: 'M003',
    titulo: 'Consultoria Carbon Zero',
    descricao: 'Contrate uma sessão de consultoria em sustentabilidade e ganhe folhas lendárias.',
    empresa: 'BioConsult Soluções',
    tipo: 'servico',
    recompensa: 500,
    raridade: 'lendaria',
    expiracao: Date.now() + 30 * 86_400_000,
    ativa: true,
  },
  {
    id: 'M004',
    titulo: 'Xampú Florestal Premium',
    descricao: 'SKU especial com QR Code de impacto. Escaneie na embalagem para ganhar.',
    empresa: 'NaturalCare BR',
    tipo: 'sku',
    recompensa: 80,
    raridade: 'comum',
    expiracao: Date.now() + 21 * 86_400_000,
    ativa: true,
  },
  {
    id: 'M005',
    titulo: 'Frete Carbono Neutro',
    descricao: 'Escolha o frete compensado e ganhe por cada despacho responsável.',
    empresa: 'VerdeFast Logística',
    tipo: 'servico',
    recompensa: 120,
    raridade: 'rara',
    expiracao: Date.now() + 60 * 86_400_000,
    ativa: true,
  },
  {
    id: 'M006',
    titulo: 'Check-in Missão Raiz 🌱',
    descricao: 'Visite o viveiro parceiro e faça check-in no app. Folha lendária garantida.',
    empresa: 'Viveiro Maravilha',
    tipo: 'engajamento',
    recompensa: 1000,
    raridade: 'lendaria',
    expiracao: Date.now() + 90 * 86_400_000,
    ativa: true,
  },
];

type Filtro = 'todos' | Missao['tipo'] | Missao['raridade'];

const RARIDADE_STYLES: Record<Missao['raridade'], { bg: string; text: string; emoji: string; label: string }> = {
  comum:    { bg: 'bg-white/5 border-white/10',           text: 'text-white/60',     emoji: '🍃', label: 'Comum' },
  rara:     { bg: 'bg-blue-900/20 border-blue-700/30',    text: 'text-blue-300',     emoji: '💎', label: 'Rara' },
  lendaria: { bg: 'bg-yellow-900/20 border-yellow-700/30', text: 'text-yellow-300',  emoji: '⭐', label: 'Lendária' },
};

const TIPO_LABEL: Record<Missao['tipo'], string> = {
  sku: 'SKU',
  servico: 'Serviço',
  engajamento: 'Engajamento',
};

function daysLeft(timestamp: number): string {
  const d = Math.ceil((timestamp - Date.now()) / 86_400_000);
  if (d <= 0) return 'Expirada';
  if (d === 1) return '1 dia';
  return `${d} dias`;
}

export default function MarketplacePage() {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const filtros: Array<{ key: Filtro; label: string }> = [
    { key: 'todos', label: 'Todos' },
    { key: 'sku', label: 'SKU' },
    { key: 'servico', label: 'Serviço' },
    { key: 'engajamento', label: 'Engajamento' },
    { key: 'lendaria', label: '⭐ Lendárias' },
    { key: 'rara', label: '💎 Raras' },
  ];

  const missoesFiltradas = mockMissoes.filter(m => {
    if (filtro === 'todos') return true;
    return m.tipo === filtro || m.raridade === filtro;
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="pt-2">
          <h1 className="text-2xl font-bold text-white">Marketplace de Missões</h1>
          <p className="text-white/40 text-sm mt-1">
            Ganhe Folhas completando missões das empresas parceiras verificadas
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filtros.map(({ key, label }) => (
            <button
              key={key}
              id={`filtro-${key}`}
              onClick={() => setFiltro(key)}
              className={`shrink-0 text-xs font-medium px-3.5 py-2 rounded-full border transition-all ${
                filtro === key
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid de missões */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {missoesFiltradas.map((missao) => {
            const r = RARIDADE_STYLES[missao.raridade];
            return (
              <div
                key={missao.id}
                className={`${r.bg} border rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02]`}
              >
                {/* Raridade + tipo */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${r.text}`}>
                    {r.emoji} {r.label}
                  </span>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                    {TIPO_LABEL[missao.tipo]}
                  </span>
                </div>

                {/* Título e descrição */}
                <div>
                  <h3 className="font-semibold text-white text-sm leading-tight">{missao.titulo}</h3>
                  <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{missao.descricao}</p>
                </div>

                {/* Empresa + expiração */}
                <div className="flex items-center justify-between text-xs text-white/30">
                  <span>🏢 {missao.empresa}</span>
                  {missao.expiracao && (
                    <span>⏱ {daysLeft(missao.expiracao)}</span>
                  )}
                </div>

                {/* Recompensa + CTA */}
                <div className="flex items-center justify-between mt-auto pt-1 border-t border-white/5">
                  <div>
                    <span className="text-lg font-bold text-green-400">+{missao.recompensa}</span>
                    <span className="text-xs text-white/30 ml-1">Folhas</span>
                  </div>
                  <button
                    id={`btn-missao-${missao.id}`}
                    className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all"
                  >
                    {/* TODO: Navegar para QR code ou flow de missão */}
                    Participar →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {missoesFiltradas.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
            <p>Nenhuma missão encontrada para este filtro.</p>
          </div>
        )}

      </div>
    </div>
  );
}
