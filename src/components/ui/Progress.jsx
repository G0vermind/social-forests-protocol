import React from "react";

export function Progress({ value = 0, label }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-block">
      <div className="progress-meta">
        <span>{label}</span>
        <strong>{safeValue}%</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
