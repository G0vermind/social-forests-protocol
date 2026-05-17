import { CONTRACT_IDS } from './contracts.js';

export const PROTOCOL_ACTIONS = {
  INSTITUTION_ACQUIRE_TREES: {
    id: 'INSTITUTION_ACQUIRE_TREES',
    userFacingLabel: 'Adquirir árvores',
    userFacingSuccess: 'Árvores adquiridas e Folhas liberadas para distribuição.',
    technicalLabel: 'Aquisição institucional de árvores e emissão de Folhas',
    primaryContract: CONTRACT_IDS.FINAL_ORCHESTRATOR,
    touchedContracts: [
      CONTRACT_IDS.FINAL_ORCHESTRATOR,
      CONTRACT_IDS.COMPANY_SBT,
      CONTRACT_IDS.MASTERCHIEF_COLLATERAL,
      CONTRACT_IDS.LEAF_TOKEN,
    ],
    relayerPath: '/v1/protocol/institution/acquire-trees',
    orchestratorMethod: "institutional_onboarding",
    status: 'relayer-required',
  },
  INSTITUTION_CREATE_ACTIVITY: {
    id: 'INSTITUTION_CREATE_ACTIVITY',
    userFacingLabel: 'Criar atividade',
    userFacingSuccess: 'Atividade criada e Folhas reservadas.',
    technicalLabel: 'Reserva de Folhas para atividade institucional',
    primaryContract: CONTRACT_IDS.FINAL_ORCHESTRATOR,
    touchedContracts: [CONTRACT_IDS.FINAL_ORCHESTRATOR, CONTRACT_IDS.LEAF_TOKEN],
    relayerPath: '/v1/protocol/institution/create-activity',
    orchestratorMethod: 'reserve_activity_leafs',
    status: 'relayer-ready',
  },
};

export function getProtocolAction(actionId) {
  const action = PROTOCOL_ACTIONS[actionId];
  if (!action) throw new Error(`Ação de protocolo desconhecida: ${actionId}`);
  return action;
}
