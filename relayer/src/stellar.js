import {

  Address,

  Contract,

  Keypair,

  TransactionBuilder,

  nativeToScVal,

  rpc,

} from "@stellar/stellar-sdk";

import { config } from "./config.js";

export const server = new rpc.Server(config.stellar.rpcUrl);

export function getRelayerKeypair() {

  return Keypair.fromSecret(config.stellar.relayerSecretKey);

}

export function toContractAddress(address) {

  return new Address(address).toScVal();

}

export function toI128(value) {

  return nativeToScVal(BigInt(value), { type: "i128" });

}

export function toU32(value) {

  return nativeToScVal(Number(value), { type: "u32" });

}

export function toString(value) {

  return nativeToScVal(String(value), { type: "string" });

}

export async function invokeContract({

  contractId,

  method,

  args = [],

  fee = "100000",

}) {

  const relayer = getRelayerKeypair();

  const relayerPublicKey = relayer.publicKey();

  const account = await server.getAccount(relayerPublicKey);

  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {

    fee,

    networkPassphrase: config.stellar.networkPassphrase,

  })

    .addOperation(contract.call(method, ...args))

    .setTimeout(120)

    .build();

  const simulated = await server.simulateTransaction(tx);

  if (rpc.Api.isSimulationError(simulated)) {

    const error = new Error("Soroban simulation failed");

    error.details = simulated;

    throw error;

  }

  const preparedTx = rpc.assembleTransaction(tx, simulated).build();

  preparedTx.sign(relayer);

  const sendResponse = await server.sendTransaction(preparedTx);

  if (sendResponse.status === "ERROR") {

    const error = new Error("Soroban transaction submission failed");

    error.details = sendResponse;

    throw error;

  }

  let finalResponse = await server.getTransaction(sendResponse.hash);

  while (finalResponse.status === "NOT_FOUND") {

    await new Promise((resolve) => setTimeout(resolve, 1000));

    finalResponse = await server.getTransaction(sendResponse.hash);

  }

  if (finalResponse.status !== "SUCCESS") {

    const error = new Error("Soroban transaction failed on-chain");

    error.details = finalResponse;

    throw error;

  }

  return {

    txHash: sendResponse.hash,

    ledger: finalResponse.ledger,

    status: finalResponse.status,

    result: finalResponse,

  };

}