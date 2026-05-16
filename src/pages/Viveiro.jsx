import { Card, CardHeader } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { trees } from "../features/arvores/trees.mock.js";

export function Viveiro({ leafsBalance, onRedeemTree }) {
  return (
    <div className="page-grid">
      <section className="page-title span-3">
        <p className="eyebrow">Viveiro</p>
        <h2>Resgate árvores com Leafs.</h2>
        <p>
          No MVP, o ativo florestal rastreável e verificável é o Mogno Africano. Outras espécies podem aparecer como narrativa de preservação, não como promessa de plantio.
        </p>
      </section>

      {trees.map((tree) => (
        <Card key={tree.id}>
          <CardHeader eyebrow={tree.species} title={tree.name} />
          <p>{tree.description}</p>
          <div className="tree-meta">
            <span>{tree.location}</span>
            <Badge tone={tree.status === "disponivel" ? "success" : "warning"}>{tree.status}</Badge>
          </div>
          <div className="redeem-box">
            <strong>{tree.costLeafs.toLocaleString("pt-BR")} Leafs</strong>
            <button
              className="btn btn-primary"
              disabled={leafsBalance < tree.costLeafs || tree.status !== "disponivel"}
              onClick={() => onRedeemTree(tree)}
              type="button"
            >
              Resgatar
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
