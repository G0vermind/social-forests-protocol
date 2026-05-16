import React from "react";
import { AccountStatus } from "../../components/account/AccountStatus.jsx";
import { Card, CardHeader } from "../../components/ui/Card.jsx";

export function MemberAccount() {
  return (
    <div className="screen-stack">
      <AccountStatus />

      <Card>
        <CardHeader eyebrow="Conta" title="Preferências" />
        <div className="settings-list">
          <button type="button">Notificações de atividades</button>
          <button type="button">Idioma</button>
          <button type="button">Detalhes técnicos</button>
        </div>
      </Card>

      <Card>
        <CardHeader eyebrow="Modo avançado" title="Comprovantes técnicos" />
        <p>
          Esta área será usada para exibir endereço técnico, rede de teste e comprovantes verificáveis
          sem expor termos complexos na jornada principal.
        </p>
      </Card>
    </div>
  );
}
