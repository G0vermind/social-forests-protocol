import React from 'react';
import { TREE_PACKAGES } from '../../data/treePackages.mock.js';
import { formatLeafs } from '../../utils/leafsMath.js';

export function AcquireTrees({ onAcquire }) {
  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Árvores</p>
        <h2>Adquirir árvores</h2>
        <p>
          Ao adquirir árvores de Mogno Africano, sua instituição recebe uma quantidade equivalente de Folhas para distribuir em atividades.
        </p>
      </div>

      <div className="package-grid">
        {TREE_PACKAGES.map((pack) => {
          const leafs = pack.trees * pack.leafsPerTree;
          return (
            <article className="package-card" key={pack.id}>
              <div>
                <p className="eyebrow">{pack.trees} árvores</p>
                <h3>{pack.name}</h3>
                <p>{pack.description}</p>
              </div>
              <div className="package-highlight">{formatLeafs(leafs)} Folhas</div>
              <p className="muted">{pack.priceLabel}</p>
              <button className="primary-button" type="button" onClick={() => onAcquire(pack)}>
                Adquirir pacote
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
