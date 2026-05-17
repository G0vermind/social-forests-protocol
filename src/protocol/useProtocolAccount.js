import { useEffect, useMemo, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { getActiveRoleProfile, setActiveRoleProfile } from '../auth/roleProfileStore.js';
import { fetchProtocolAccount, isRelayerConfigured } from './protocolRelayerClient.js';

function isStellarPublicKey(value) {
  return typeof value === 'string' && /^G[A-Z2-7]{55}$/.test(value);
}

function getEmail(user) {
  return user?.email?.address || user?.google?.email || user?.discord?.email || null;
}

function getWalletAddressFromPrivy(user) {
  const linkedAccounts = Array.isArray(user?.linkedAccounts) ? user.linkedAccounts : [];

  const directCandidates = [
    user?.wallet?.address,
    user?.embeddedWallet?.address,
    user?.smartWallet?.address,
  ];

  const linkedCandidates = linkedAccounts.flatMap((account) => [
    account?.address,
    account?.walletAddress,
    account?.publicKey,
  ]);

  const allCandidates = [...directCandidates, ...linkedCandidates].filter(Boolean);

  const stellarAddress = allCandidates.find(isStellarPublicKey);
  if (stellarAddress) return stellarAddress;

  return null;
}

function getFallbackWalletAddress() {
  const fallbackInstitutionWallet = import.meta.env.VITE_INSTITUTION_TEST_WALLET;
  if (isStellarPublicKey(fallbackInstitutionWallet)) return fallbackInstitutionWallet;
  return null;
}

function getProtocolWalletAddress(protocolAccount) {
  const candidates = [
    protocolAccount?.stellarWalletAddress,
    protocolAccount?.walletAddress,
    protocolAccount?.institutionWalletAddress,
    protocolAccount?.companyAddress,
  ].filter(Boolean);

  return candidates.find(isStellarPublicKey) || null;
}

export function useProtocolAccount() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();

  const [protocolAccount, setProtocolAccount] = useState(null);
  const [protocolAccountLoading, setProtocolAccountLoading] = useState(false);
  const [protocolAccountError, setProtocolAccountError] = useState(null);

  const activeRole = useMemo(() => {
    return getActiveRoleProfile()?.role || 'institution';
  }, []);

  const baseAccount = useMemo(() => {
    return {
      ready,
      authenticated,
      privyUserId: user?.id || null,
      email: getEmail(user),
      activeRole,
      login,
      logout,
      getAccessToken,
      setActiveRole: setActiveRoleProfile,
    };
  }, [ready, authenticated, user, activeRole, login, logout, getAccessToken]);

  useEffect(() => {
    let cancelled = false;

    async function loadProtocolAccount() {
      if (!ready || !authenticated || !user?.id) {
        setProtocolAccount(null);
        setProtocolAccountError(null);
        setProtocolAccountLoading(false);
        return;
      }

      if (!isRelayerConfigured()) {
        setProtocolAccount(null);
        setProtocolAccountError('Relayer não configurado.');
        setProtocolAccountLoading(false);
        return;
      }

      try {
        setProtocolAccountLoading(true);
        setProtocolAccountError(null);

        const data = await fetchProtocolAccount({
          ...baseAccount,
          user,
        });

        if (!cancelled) {
          setProtocolAccount(data);
        }
      } catch (error) {
        if (!cancelled) {
          setProtocolAccount(null);
          setProtocolAccountError(error instanceof Error ? error.message : 'Erro ao carregar conta de protocolo.');
        }
      } finally {
        if (!cancelled) {
          setProtocolAccountLoading(false);
        }
      }
    }

    loadProtocolAccount();

    return () => {
      cancelled = true;
    };
  }, [ready, authenticated, user?.id]);

  const walletAddress =
    getProtocolWalletAddress(protocolAccount) ||
    getWalletAddressFromPrivy(user) ||
    getFallbackWalletAddress();

  return {
    ...baseAccount,
    user,
    protocolAccount,
    protocolAccountLoading,
    protocolAccountError,
    walletAddress,
    hasProtocolWallet: isStellarPublicKey(walletAddress),
  };
}