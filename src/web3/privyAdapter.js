export function getPrivyUserSummary(user) {
  if (!user) {
    return {
      label: "Conta não conectada",
      detail: "Entre para ativar sua conta de impacto.",
    };
  }

  const email = user.email?.address;
  const phone = user.phone?.number;
  const wallet = user.wallet?.address;

  return {
    label: email || phone || "Conta ativa",
    detail: wallet
      ? `Conta técnica vinculada: ${wallet.slice(0, 6)}...${wallet.slice(-4)}`
      : "Conta pronta para receber registros verificáveis.",
  };
}
