import React from "react";

export function LogoMark({ compact = false }) {
  return (
    <div className={`brand-lockup ${compact ? "compact" : ""}`} aria-label="florestas.social">
      <span className="pixel-logo" aria-hidden="true">
        <i />
        <i className="g" />
        <i className="g" />
        <i />
        <i className="g" />
        <i className="g" />
        <i className="g" />
        <i className="g" />
        <i className="g" />
        <i className="g" />
        <i className="g" />
        <i className="g" />
        <i />
        <i className="g" />
        <i className="g" />
        <i />
      </span>
      {!compact && <span className="brand-name">florestas.social</span>}
    </div>
  );
}
