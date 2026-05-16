import { Button } from "../ui/Button.jsx";

export function ActionSheet({ open, title, children, onClose, actionLabel, onAction }) {
  if (!open) return null;
  return <div className="sheet-backdrop" onClick={onClose}>
    <section className="action-sheet" onClick={(e) => e.stopPropagation()}>
      <div className="sheet-handle" />
      <h2>{title}</h2>
      <div>{children}</div>
      <div className="sheet-actions"><Button variant="ghost" onClick={onClose}>Voltar</Button><Button onClick={onAction}>{actionLabel || "Confirmar"}</Button></div>
    </section>
  </div>;
}
