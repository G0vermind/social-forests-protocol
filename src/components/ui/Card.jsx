import React from "react";

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function CardHeader({ eyebrow, title, children }) {
  return (
    <div className="card-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}
