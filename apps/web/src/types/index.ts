// =============================================================================
// TIPOS GLOBAIS — FLORESTAS.SOCIAL
// =============================================================================

// Perfis de usuário
export type UserRole = 'admin' | 'empresa' | 'consumidor' | null;

// Dados da sessão após login
export interface Session {
  address: string;       // Endereço Stellar
  role: UserRole;
  displayName?: string;  // Nome do Google se login Web2
  avatarUrl?: string;
  isWeb2: boolean;       // true = Google, false = Freighter
}

// Token RWA (MOGNO)
export interface RwaToken {
  id: string;
  amount: number;        // Com 7 decimais (padrão Stellar)
  owner: string;
  mintedAt: number;      // Timestamp UNIX
  pofProof?: string;     // Hash da prova de florescimento
}

// Empresa Verificada (B2B)
export interface EmpresaVerificada {
  address: string;
  razaoSocial: string;
  cnpj: string;
  planoAtivo: 'seed' | 'growth' | 'enterprise';
  loteRwa: number;       // Saldo de RWA para distribuição
  cashbackConfig: CashbackConfig;
  impactoTotal: number;  // Total de créditos distribuídos
}

// Configuração de Cashback
export interface CashbackConfig {
  folhasPorReal: number;                   // Ex: 10 folhas por R$1 gasto
  folhasPorSku: Record<string, number>;    // SKU específico → folhas
}

// Missão (SKU ou Serviço)
export interface Missao {
  id: string;
  titulo: string;
  descricao: string;
  empresa: string;
  tipo: 'sku' | 'servico' | 'engajamento';
  recompensa: number;    // Folhas
  raridade: 'comum' | 'rara' | 'lendaria';
  expiracao?: number;    // Timestamp UNIX
  qrCode?: string;
  ativa: boolean;
}

// Folha (NFT de progresso do consumidor)
export interface Folha {
  id: string;
  raridade: 'comum' | 'rara' | 'lendaria';
  origem: string;        // Endereço da empresa
  missaoId: string;
  ganha_em: number;      // Timestamp UNIX
}

// Estado do Viveiro Digital (B2C)
export interface ViveiroState {
  folhasComuns: number;
  folhasRaras: number;
  folhasLendarias: number;
  totalFolhas: number;
  metaParaArvore: number;  // Ex: 1000 folhas = 1 árvore
  progresso: number;       // 0 a 100 (%)
  arvoresForjadas: number;
  pontosImpacto: number;   // i128 do sbt_reputation
  co2Sequestrado: number;  // kg
}

// Lote PoF (Oracle — Admin)
export interface LotePof {
  id: string;
  fazenda: string;
  especie: string;
  quantidade: number;    // Árvores
  dap: number;           // Diâmetro à Altura do Peito (cm)
  altura: number;        // metros
  ultimaColeta: number;  // Timestamp UNIX
  statusPof: 'pendente' | 'validado' | 'rejeitado';
  hashProva?: string;
}

// Dados ESG da Empresa
export interface EsgData {
  co2Sequestrado: number;    // kg total
  arvoresVinculadas: number;
  usuariosImpactados: number;
  missoesConcluidas: number;
  ods: OdsProgress[];
}

export interface OdsProgress {
  numero: number;
  titulo: string;
  contribuicao: string;
  progresso: number;     // 0 a 100
}

// Governança $FLORA
export interface Proposta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'nova_fazenda' | 'nova_metodologia' | 'treasury' | 'outro';
  votosAFavor: number;
  votosContra: number;
  totalFlora: number;
  encerraEm: number;     // Timestamp UNIX
  status: 'ativa' | 'aprovada' | 'rejeitada';
}
