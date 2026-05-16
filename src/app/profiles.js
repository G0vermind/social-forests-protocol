export const profiles = [
  { id: 'member', label: 'Membro', shortLabel: 'Membro', description: 'Participa de atividades, acumula Folhas e acompanha seu impacto.' },
  { id: 'institution', label: 'Instituição', shortLabel: 'Instituição', description: 'Adquire árvores, recebe Folhas para distribuir e cria atividades para sua comunidade.' },
  { id: 'producer', label: 'Produtor', shortLabel: 'Produtor', description: 'Acompanha lotes, árvores cadastradas e evidências de manejo.' },
  { id: 'validator', label: 'Operação', shortLabel: 'Operação', description: 'Valida evidências, aprova registros e acompanha solicitações.' },
];

export const memberTabs = [
  { id: 'home', label: 'Início' },
  { id: 'activities', label: 'Atividades' },
  { id: 'nursery', label: 'Viveiro' },
  { id: 'impact', label: 'Impacto' },
  { id: 'account', label: 'Conta' },
];

export const profileTabs = {
  institution: [
    { id: 'home', label: 'Painel' },
    { id: 'trees', label: 'Árvores' },
    { id: 'leafs', label: 'Folhas' },
    { id: 'activities', label: 'Atividades' },
    { id: 'page', label: 'Página' },
    { id: 'share', label: 'Compartilhar' },
  ],
  producer: [
    { id: 'home', label: 'Painel' },
    { id: 'lots', label: 'Lotes' },
    { id: 'evidence', label: 'Evidências' },
    { id: 'history', label: 'Histórico' },
    { id: 'account', label: 'Conta' },
  ],
  validator: [
    { id: 'home', label: 'Fila' },
    { id: 'review', label: 'Análise' },
    { id: 'records', label: 'Registros' },
    { id: 'history', label: 'Histórico' },
    { id: 'account', label: 'Conta' },
  ],
};
