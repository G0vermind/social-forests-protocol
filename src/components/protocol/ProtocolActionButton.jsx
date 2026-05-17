import React, { useState } from 'react';
import { executeProtocolAction } from '../../protocol/protocolActions.js';
import { TechnicalReceipt } from './TechnicalReceipt.jsx';

export function ProtocolActionButton({ actionId, payload, account, children, className = 'button primary md', disabled = false, disabledReason = '', onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [receipt, setReceipt] = useState(null);

  async function handleClick() {
    if (disabled) return;
    setLoading(true);
    setMessage('');

    try {
      const result = await executeProtocolAction(actionId, payload, account);
      setMessage(result.message);
      setReceipt(result.receipt);
      onSuccess?.(result);
    } catch (error) {
      setMessage(error.message || 'Não foi possível concluir a ação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="protocol-action">
      <button className={className} type="button" onClick={handleClick} disabled={disabled || loading}>
        {loading ? 'Confirmando...' : children}
      </button>
      {disabled && disabledReason ? <p className="protocol-action-message muted">{disabledReason}</p> : null}
      {message ? <p className="protocol-action-message">{message}</p> : null}
      <TechnicalReceipt receipt={receipt} />
    </div>
  );
}
