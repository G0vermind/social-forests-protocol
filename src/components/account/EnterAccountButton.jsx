import React from "react";
import { usePrivy } from "@privy-io/react-auth";

export function EnterAccountButton({
  className = "button primary md",
  label = "Entrar na conta",
}) {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) {
    return (
      <button className={className} type="button" disabled>
        Preparando...
      </button>
    );
  }

  return (
    <button className={className} type="button" onClick={authenticated ? logout : login}>
      {authenticated ? "Sair da conta" : label}
    </button>
  );
}
