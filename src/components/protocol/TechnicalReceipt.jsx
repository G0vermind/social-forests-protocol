import React, { useState } from "react";

export function TechnicalReceipt({ receipt }) {
  const [open, setOpen] = useState(false);

  if (!receipt) return null;

  return (
    <section className="technical-receipt">
      <button className="ghost-button small" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Ocultar comprovante técnico" : "Ver comprovante técnico"}
      </button>

      {open ? (
        <div className="technical-receipt-panel">
          <p className="eyebrow">Registro verificável</p>
          <strong>{receipt.label}</strong>
          <span>{receipt.network}</span>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{receipt.status}</dd>
            </div>
            <div>
              <dt>Contrato principal</dt>
              <dd>
                <a href={receipt.contract.url} target="_blank" rel="noreferrer">
                  {receipt.contract.id.slice(0, 8)}...{receipt.contract.id.slice(-6)}
                </a>
              </dd>
            </div>
            <div>
              <dt>Método planejado</dt>
              <dd>{receipt.plannedSorobanMethod}</dd>
            </div>
            <div>
              <dt>Referência</dt>
              <dd>{receipt.id}</dd>
            </div>
          </dl>
          <p className="field-hint">{receipt.note}</p>
        </div>
      ) : null}
    </section>
  );
}
