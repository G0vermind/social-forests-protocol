import { CONTRACT_IDS } from "./contracts.js";

export const PROTOCOL_ACTIONS = {
  INSTITUTION_ACQUIRE_TREES: {
    id: "INSTITUTION_ACQUIRE_TREES",
    userFacingLabel: "Adquirir árvores",
    userFacingSuccess: "Árvores adquiridas e Folhas liberadas para distribuição.",
    technicalLabel: "Onboarding institucional / aquisição de lastro",
    primaryContract: CONTRACT_IDS.FINAL_ORCHESTRATOR,
    touchedContracts: [
      CONTRACT_IDS.FINAL_ORCHESTRATOR,
      CONTRACT_IDS.COMPANY_SBT,
      CONTRACT_IDS.MASTERCHIEF_COLLATERAL,
      CONTRACT_IDS.LEAF_TOKEN,
    ],
    plannedSorobanMethod: "institution_onboarding_purchase",
    status: "mocked-relayer-ready",
  },
  INSTITUTION_CREATE_ACTIVITY: {
    id: "INSTITUTION_CREATE_ACTIVITY",
    userFacingLabel: "Criar atividade",
    userFacingSuccess: "Atividade criada e Folhas reservadas.",
    technicalLabel: "Reserva off-chain de capacidade de distribuição",
    primaryContract: CONTRACT_IDS.FINAL_ORCHESTRATOR,
    touchedContracts: [CONTRACT_IDS.FINAL_ORCHESTRATOR, CONTRACT_IDS.LEAF_TOKEN],
    plannedSorobanMethod: "reserve_activity_leafs",
    status: "mocked-relayer-ready",
  },
  MEMBER_COMPLETE_ACTIVITY: {
    id: "MEMBER_COMPLETE_ACTIVITY",
    userFacingLabel: "Confirmar participação",
    userFacingSuccess: "Participação registrada e Folhas creditadas.",
    technicalLabel: "Liberação de recompensa de atividade",
    primaryContract: CONTRACT_IDS.FINAL_ORCHESTRATOR,
    touchedContracts: [CONTRACT_IDS.FINAL_ORCHESTRATOR, CONTRACT_IDS.LEAF_TOKEN, CONTRACT_IDS.GUARDIAN_SBT],
    plannedSorobanMethod: "complete_activity",
    status: "mocked-relayer-ready",
  },
  MEMBER_REDEEM_TREE: {
    id: "MEMBER_REDEEM_TREE",
    userFacingLabel: "Confirmar resgate",
    userFacingSuccess: "Resgate confirmado. Sua árvore foi vinculada ao Viveiro.",
    technicalLabel: "Burn LEAF + mint dNFT + XP Guardião",
    primaryContract: CONTRACT_IDS.FINAL_ORCHESTRATOR,
    touchedContracts: [
      CONTRACT_IDS.FINAL_ORCHESTRATOR,
      CONTRACT_IDS.LEAF_TOKEN,
      CONTRACT_IDS.MYTHOS_VAULT_DNFT,
      CONTRACT_IDS.GUARDIAN_SBT,
    ],
    plannedSorobanMethod: "plant_tree_b2c",
    status: "mocked-relayer-ready",
  },
};

export function getProtocolAction(actionId) {
  const action = PROTOCOL_ACTIONS[actionId];
  if (!action) {
    throw new Error(`Ação de protocolo desconhecida: ${actionId}`);
  }
  return action;
}
