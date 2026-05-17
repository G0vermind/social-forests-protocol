import React, { useState } from 'react';

export function TechnicalReceipt({ receipt }) {
  const [open, setOpen] = useState(false);
  if (!receipt) return null;

  return (
    <div className="technical-receipt">
      <button type="button" className="link-button" onClick={() => setOpen((current) => !current)}>
        {open ? 'Ocultar comprovante técnico' : 'Ver comprovante técnico'}
      </button>
      {open ? (
        <div className="technical-receipt-box">
          <div><span>Status</span><strong>{receipt.status}</strong></div>
          <div><span>Rede</span><strong>{receipt.network}</strong></div>
          <div><span>Ação</span><strong>{receipt.technicalLabel}</strong></div>
          <div><span>Contrato principal</span><a href={receipt.contract.url} target="_blank" rel="noreferrer">{receipt.contract.id}</a></div>
          {receipt.txHash ? <div><span>Transação</span><a href={receipt.txUrl} target="_blank" rel="noreferrer">{receipt.txHash}</a></div> : null}
          {receipt.ledger ? <div><span>Ledger</span><strong>{receipt.ledger}</strong></div> : null}
          <details>
            <summary>Contratos envolvidos</summary>
            <ul>
              {receipt.touchedContracts.map((contract) => <li key={contract.id}><a href={contract.url} target="_blank" rel="noreferrer">{contract.id}</a></li>)}
            </ul>
          </details>
          <p>{receipt.note}</p>
        </div>
      ) : null}
    </div>
  );
}
