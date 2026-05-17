import { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getActiveRoleProfile, setActiveRoleProfile } from '../auth/roleProfileStore.js';

function isStellarPublicKey(value) {
  return typeof value === 'string' && /^G[A-Z2-7]{55}$/.test(value.trim());
}

function normalizeAddress(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return isStellarPublicKey(trimmed) ? trimmed : null;
}

function getEmail(user) {
  return (
    user?.email?.address ||
    user?.google?.email ||
    user?.discord?.email ||
    user?.twitter?.email ||
    user?.github?.email ||
    null
  );
}

function getLinkedAccounts(user) {
  return Array.isArray(user?.linkedAccounts) ? user.linkedAccounts : [];
}

function getWalletLikeObjects(user) {
  const linkedAccounts = getLinkedAccounts(user);

  return [
    user?.wallet,
    user?.embeddedWallet,
    user?.smartWallet,
    user?.stellarWallet,
    user?.privyWallet,
    ...(Array.isArray(user?.wallets) ? user.wallets : []),
    ...(Array.isArray(user?.embeddedWallets) ? user.embeddedWallets : []),
    ...linkedAccounts,
  ].filter(Boolean);
}

function getWalletAddress(user) {
  const walletObjects = getWalletLikeObjects(user);

  const directCandidates = [
    user?.wallet?.address,
    user?.wallet?.publicKey,
    user?.embeddedWallet?.address,
    user?.embeddedWallet?.publicKey,
    user?.smartWallet?.address,
    user?.smartWallet?.publicKey,
    user?.stellarWallet?.address,
    user?.stellarWallet?.publicKey,
  ];

  const objectCandidates = walletObjects.flatMap((account) => [
    account?.address,
    account?.walletAddress,
    account?.publicKey,
    account?.public_key,
    account?.stellarAddress,
    account?.stellarPublicKey,
    account?.chainId === 'stellar' ? account?.address : null,
    account?.chain === 'stellar' ? account?.address : null,
    account?.type === 'wallet' ? account?.address : null,
    account?.type === 'stellar_wallet' ? account?.address : null,
    account?.walletClientType === 'stellar' ? account?.address : null,
  ]);

  const allCandidates = [...directCandidates, ...objectCandidates]
    .map(normalizeAddress)
    .filter(Boolean);

  const stellarAddress = allCandidates[0];
  if (stellarAddress) return stellarAddress;

  const fallbackInstitutionWallet = normalizeAddress(import.meta.env.VITE_INSTITUTION_TEST_WALLET);
  if (fallbackInstitutionWallet) return fallbackInstitutionWallet;

  return null;
}

function getPrivyDebugWallets(user) {
  if (!user) return [];

  return getWalletLikeObjects(user).map((account) => ({
    type: account?.type || null,
    chain: account?.chain || account?.chainId || null,
    walletClientType: account?.walletClientType || null,
    address: account?.address || account?.walletAddress || account?.publicKey || null,
  }));
}

export function useProtocolAccount() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();

  const activeRole = useMemo(() => {
    return getActiveRoleProfile()?.role || 'institution';
  }, []);

  const walletAddress = useMemo(() => getWalletAddress(user), [user]);
  const debugWallets = useMemo(() => getPrivyDebugWallets(user), [user]);

  return {
    ready,
    authenticated,
    privyUserId: user?.id || null,
    email: getEmail(user),
    walletAddress,
    hasWalletAddress: Boolean(walletAddress),
    activeRole,
    login,
    logout,
    getAccessToken,
    setActiveRole: setActiveRoleProfile,
    debugWallets,
  };
}