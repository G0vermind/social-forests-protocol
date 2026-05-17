import crypto from 'node:crypto';
import { Keypair } from '@stellar/stellar-sdk';

const memoryAccounts = new Map();

function unauthorized(message = 'Unauthorized') {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

function badRequest(message = 'Bad request') {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return null;
  }

  return header.replace('Bearer ', '').trim();
}

function decodeJwtPayload(token) {
  const parts = String(token).split('.');

  if (parts.length < 2) {
    throw unauthorized('Token Privy inválido.');
  }

  try {
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const json = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    throw unauthorized('Não foi possível decodificar o token Privy.');
  }
}

function getPrivyIdentityFromToken(token) {
  const payload = decodeJwtPayload(token);

  const privyUserId =
    payload.sub ||
    payload.user_id ||
    payload.userId ||
    payload.did ||
    null;

  if (!privyUserId) {
    throw unauthorized('Token Privy sem identificador de usuário.');
  }

  return {
    privyUserId,
    email: payload.email || null,
  };
}

function createDeterministicAccount(privyUserId) {
  const hash = crypto
    .createHash('sha256')
    .update(`social-forests:${privyUserId}`)
    .digest();

  const keypair = Keypair.fromRawEd25519Seed(hash.subarray(0, 32));

  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}

export async function ensureProtocolAccount(req) {
  const token = getBearerToken(req);

  if (!token) {
    throw unauthorized('Authorization Bearer token ausente.');
  }

  const identity = getPrivyIdentityFromToken(token);

  const activeRole =
    req.body?.actor?.activeRole ||
    req.query?.activeRole ||
    'institution';

  if (memoryAccounts.has(identity.privyUserId)) {
    return {
      ...memoryAccounts.get(identity.privyUserId),
      activeRole,
    };
  }

  const generated = createDeterministicAccount(identity.privyUserId);

  const account = {
    privyUserId: identity.privyUserId,
    email: identity.email,
    stellarWalletAddress: generated.publicKey,
    stellarSecretKey: generated.secretKey,
    activeRole,
    createdAt: new Date().toISOString(),
  };

  memoryAccounts.set(identity.privyUserId, account);

  return account;
}

export function getAccountOrFail(privyUserId) {
  const account = memoryAccounts.get(privyUserId);

  if (!account) {
    throw badRequest('Carteira institucional ainda não foi criada.');
  }

  return account;
}