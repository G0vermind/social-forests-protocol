import { Button } from "../components/ui/Button.jsx";

export function Landing({ onEnter }) {
  return (
    <main className="landing-page">
      <section className="hero-card">
        <p className="eyebrow">dApp · Stellar Testnet · MVP</p>
        <h1>Transforme relacionamento em impacto florestal rastreável.</h1>
        <p>
          O Florestas.social conecta marcas, membros e ativos reais de Mogno Africano por meio de Leafs, viveiro digital e impacto assegurado.
        </p>
        <div className="hero-actions">
          <Button onClick={onEnter}>Entrar no dApp</Button>
          <Button variant="ghost" onClick={onEnter}>Ver viveiro</Button>
        </div>
      </section>
    </main>
  );
}
