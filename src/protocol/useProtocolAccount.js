import { useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";

function getEmail(user) {
  return user?.email?.address || user?.google?.email || user?.twitter?.email || null;
}

export function useProtocolAccount(activeRole = "member") {
  const { ready, authenticated, user, login, logout } = usePrivy();

  return useMemo(() => {
    const email = getEmail(user);
    const walletAddress = user?.wallet?.address || user?.linkedAccounts?.find((a) => a.type === "wallet")?.address || null;

    return {
      ready,
      authenticated,
      user,
      login,
      logout,
      privyUserId: user?.id || null,
      email,
      walletAddress,
      activeRole,
      isInstitution: activeRole === "institution",
      isMember: activeRole === "member",
      isProducer: activeRole === "producer",
      isValidator: activeRole === "validator",
    };
  }, [ready, authenticated, user, login, logout, activeRole]);
}
