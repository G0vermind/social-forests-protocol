import React from "react";
import { usePrivy } from "@privy-io/react-auth";

function getDisplay(user) {
  return user?.email?.address || user?.phone?.number || "Conta ativa";
}

export function AccountStatus() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <section className="account-status">
        <p className="eyebrow">Conta</p>
        <strong>Preparando acesso...</strong>
      </section>
    );
  }

  if (!authenticated) {
    return (
      <section className="account-status">
        <div>
          <p className="eyebrow">Conta</p>
          <strong>Acesse sua conta para ver Folhas, Viveiro e Impacto.</strong>
        </div>
        <button className="button primary sm" type="button" onClick={login}>
          Entrar
        </button>
      </section>
    );
  }

  return (
    <section className="account-status success">
      <div>
        <p className="eyebrow">Conta ativa</p>
        <strong>{getDisplay(user)}</strong>
        <span>Pronta para registros verificáveis.</span>
      </div>
      <button className="button ghost sm" type="button" onClick={logout}>
        Sair
      </button>
    </section>
  );
}

export function AccountStatusCompact() {
  const { ready, authenticated, user, login } = usePrivy();

  if (!ready) {
    return <span className="account-chip">Preparando...</span>;
  }

  if (!authenticated) {
    return (
      <button className="account-chip action" type="button" onClick={login}>
        Entrar
      </button>
    );
  }

  return <span className="account-chip success">{getDisplay(user)}</span>;
}
