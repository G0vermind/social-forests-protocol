import {
  Address,
  Contract,
  Keypair,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
} from '@stellar/stellar-sdk';
import { config } from '../config.js';

const LEAFS_PER_TREE = 1000;
const LEAF_DECIMALS = 7;

function toLeafUnits(leafs) {
  return BigInt(Number(leafs || 0)) * BigInt(10 ** LEAF_DECIMALS);
}

function getNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

async function waitForTransaction(server, hash) {
  let response = await server.getTransaction(hash);

  while (response.status === 'NOT_FOUND') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    response = await server.getTransaction(hash);
  }

  return response;
}

async function invokeOrchestratorInstitutionalOnboarding({
  companyAddress,
  treeCount,
  carbonDebt,
  notaryHash,
  leafCashback,
}) {
  const server = new rpc.Server(config.stellar.rpcUrl);
  const relayerKeypair = Keypair.fromSecret(config.stellar.relayerSecretKey);
  const relayerPublicKey = relayerKeypair.publicKey();

  const account = await server.getAccount(relayerPublicKey);
  const contract = new Contract(config.contracts.orchestrator);

  const call = contract.call(
    'institutional_onboarding',
    new Address(companyAddress).toScVal(),
    nativeToScVal(Number(treeCount), { type: 'u32' }),
    nativeToScVal(BigInt(carbonDebt), { type: 'i128' }),
    nativeToScVal(String(notaryHash || 'florestas-social-mvp'), { type: 'string' }),
    nativeToScVal(BigInt(leafCashback), { type: 'i128' })
  );

  const tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: config.stellar.networkPassphrase || Networks.TESTNET,
  })
    .addOperation(call)
    .setTimeout(120)
    .build();

  const simulated = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simulated)) {
    const error = new Error('Simulação Soroban falhou ao comprar árvores.');
    error.statusCode = 422;
    error.details = simulated;
    throw error;
  }

  const preparedTx = rpc.assembleTransaction(tx, simulated).build();
  preparedTx.sign(relayerKeypair);

  const sendResponse = await server.sendTransaction(preparedTx);

  if (sendResponse.status === 'ERROR') {
    const error = new Error('Falha ao enviar transação Soroban.');
    error.statusCode = 500;
    error.details = sendResponse;
    throw error;
  }

  const confirmed = await waitForTransaction(server, sendResponse.hash);

  if (confirmed.status !== 'SUCCESS') {
  console.error('SOROBAN_TX_FAILED_DETAILS');
  console.dir(confirmed, { depth: null });

  const error = new Error(`Transação Soroban não confirmou com sucesso: ${confirmed.status}`);
  error.statusCode = 500;
  error.details = confirmed;
  throw error;
}

  return {
    txHash: sendResponse.hash,
    ledger: confirmed.ledger || null,
  };
}

export async function acquireTrees(body, account) {
  const payload = body?.payload || body || {};

  const treeCount = getNumber(
    payload.treeCount ||
      payload.trees ||
      payload.quantity ||
      payload.package?.trees,
    0
  );

  if (!treeCount || treeCount <= 0) {
    const error = new Error('Quantidade de árvores inválida.');
    error.statusCode = 400;
    throw error;
  }

  const leafsUnlocked = getNumber(
    payload.leafsUnlocked ||
      payload.totalLeafs ||
      treeCount * LEAFS_PER_TREE,
    treeCount * LEAFS_PER_TREE
  );

  const carbonDebt = BigInt(
    getNumber(payload.carbonDebt || payload.carbonDebtUnits || 0, 0)
  );

  const leafCashback = toLeafUnits(leafsUnlocked);

  const companyAddress =
    payload.institutionWalletAddress ||
    payload.companyAddress ||
    account.stellarWalletAddress;

  const notaryHash =
    payload.notaryHash ||
    payload.institutionId ||
    `privy:${account.privyUserId}`;

  const tx = await invokeOrchestratorInstitutionalOnboarding({
    companyAddress,
    treeCount,
    carbonDebt,
    notaryHash,
    leafCashback,
  });

  return {
    simulated: false,
    message: 'Árvores compradas e Folhas emitidas nos contratos do protocolo.',
    txHash: tx.txHash,
    ledger: tx.ledger,
    receiptId: `institution-acquire-trees-${Date.now()}`,
    institution: {
      walletAddress: companyAddress,
      acquiredTrees: treeCount,
      leafsUnlocked,
      leafsPerTree: LEAFS_PER_TREE,
    },
  };
}