export const memberSummary = {
  leafs: 1250,
  trees: 3,
  impactStatus: "Impacto assegurado",
  nextGoal: 72,
};

export const activities = [
  {
    id: "a1",
    title: "Participar da atividade da instituição",
    description: "Conclua a atividade proposta e receba Folhas para usar no Viveiro.",
    reward: 100,
    status: "Disponível",
  },
  {
    id: "a2",
    title: "Responder pesquisa de relacionamento",
    description: "Ajude a melhorar as próximas atividades de impacto.",
    reward: 50,
    status: "Disponível",
  },
  {
    id: "a3",
    title: "Compartilhar comprovante de participação",
    description: "Envie a evidência solicitada para validação.",
    reward: 80,
    status: "Em análise",
  },
];

export const nurseryTrees = [
  {
    id: "mogno-africano-01",
    name: "Mogno Africano",
    type: "Ativo rastreável do MVP",
    leafCost: 500,
    status: "Disponível",
    description:
      "Árvore vinculada ao viveiro do protocolo, com rastreabilidade e verificação de impacto.",
  },
  {
    id: "mogno-africano-02",
    name: "Mogno Africano",
    type: "Em validação",
    leafCost: 500,
    status: "Em validação",
    description:
      "Registro em conferência pela operação antes de aparecer como impacto assegurado.",
  },
];

export const impactRecords = [
  {
    id: "c1",
    title: "Resgate de Mogno Africano",
    date: "Hoje",
    status: "Registrado",
    detail: "Comprovante técnico disponível no modo avançado.",
  },
  {
    id: "c2",
    title: "Atividade concluída",
    date: "Ontem",
    status: "Validado",
    detail: "Folhas creditadas na conta.",
  },
];

export const institutionMetrics = [
  ["Árvores adquiridas", "120"],
  ["Folhas disponíveis", "24.000"],
  ["Atividades ativas", "4"],
  ["Participantes", "920"],
];

export const treePackages = [
  {
    id: "starter",
    name: "Viveiro Inicial",
    trees: 10,
    leafs: 10000,
    description: "Pacote para iniciar uma comunidade de impacto com atividades simples.",
    status: "Disponível",
  },
  {
    id: "growth",
    name: "Viveiro Crescimento",
    trees: 50,
    leafs: 50000,
    description: "Indicado para instituições com campanhas recorrentes ou públicos maiores.",
    status: "Disponível",
  },
  {
    id: "forest",
    name: "Viveiro Comunidade",
    trees: 120,
    leafs: 120000,
    description: "Para programas de relacionamento com impacto distribuído ao longo do tempo.",
    status: "Em proposta",
  },
];

export const institutionProfile = {
  name: "Instituto Verde",
  slug: "instituto-verde",
  logoText: "IV",
  welcome: "Bem-vindo ao espaço de impacto do Instituto Verde.",
  message: "Participe das atividades, acumule Folhas e acompanhe sua contribuição no Viveiro.",
  primaryColor: "#2f6b3f",
  supportColor: "#99bf4f",
  cta: "Participar agora",
  publicUrl: "/i/instituto-verde",
};

export const institutionActivities = [
  {
    id: "ia1",
    title: "Responder pesquisa da comunidade",
    description: "Compartilhe sua percepção e ajude a instituição a direcionar as próximas ações.",
    reward: 80,
    limit: 500,
    used: 214,
    status: "Disponível",
  },
  {
    id: "ia2",
    title: "Participar do encontro local",
    description: "Confirme presença, participe da ação e receba Folhas após validação.",
    reward: 150,
    limit: 120,
    used: 86,
    status: "Em andamento",
  },
  {
    id: "ia3",
    title: "Indicar um novo participante",
    description: "Convide alguém da comunidade para conhecer o espaço de impacto.",
    reward: 50,
    limit: 1000,
    used: 340,
    status: "Disponível",
  },
];

export const institutionLeafs = {
  available: 24000,
  distributed: 18400,
  reserved: 7600,
  expired: 0,
};

export const producerLots = [
  ["Lote A", "Mogno Africano", "124 árvores", "Verificado"],
  ["Lote B", "Mogno Africano", "87 árvores", "Em validação"],
];

export const validationQueue = [
  ["Solicitação #1042", "Resgate de árvore", "Alta"],
  ["Solicitação #1041", "Evidência de manejo", "Média"],
  ["Solicitação #1040", "Relatório de impacto", "Baixa"],
];
