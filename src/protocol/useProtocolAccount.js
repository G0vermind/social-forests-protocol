import { useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

function getEmail(user) {
  return user?.email?.address || user?.google?.email || user?.twitter?.email || null;
}

function getWalletAddress(user) {
  return user?.wallet?.address || user?.linkedAccounts?.find((account) => account.type === 'wallet')?.address || null;
}

export function useProtocolAccount(activeRole = 'member') {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy();

  return useMemo(() => ({
    ready,
    authenticated,
    user,
    login,
    logout,
    getAccessToken,
    privyUserId: user?.id || null,
    email: getEmail(user),
    walletAddress: getWalletAddress(user),
    activeRole,
    isInstitution: activeRole === 'institution',
    isMember: activeRole === 'member',
    isProducer: activeRole === 'producer',
    isValidator: activeRole === 'validator',
  }), [ready, authenticated, user, login, logout, getAccessToken, activeRole]);
}
