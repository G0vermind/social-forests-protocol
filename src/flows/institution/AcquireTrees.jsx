import React from 'react';
import { TREE_PACKAGES } from '../../data/treePackages.mock.js';
import { ProtocolActionButton } from '../../components/protocol/ProtocolActionButton.jsx';
import { useProtocolAccount } from '../../protocol/useProtocolAccount.js';
import { acquireTreePackage } from '../../services/institutionService.js';
import { formatLeafs, getTreePackageLeafs } from '../../utils/leafsMath.js';

function buildIdempotencyKey(institution, pack) {
  return `institution-tree-purchase:${institution?.id || 'unknown'}:${pack.id}:${Date.now()}`;
}

export function AcquireTrees({ institution, onSave, onAcquire }) {
  const account = useProtocolAccount('institution');

  function handleProtocolSuccess(pack, result) {
    const nextInstitution = acquireTreePackage(institution, pack, result);
    onSave?.(nextInstitution);
    onAcquire?.(pack, nextInstitution, result);
  }

  return (
    <section className="institution-section">
      <div className="section-heading">
        <p className="eyebrow">Árvores</p>
        <h2>Adquirir árvores</h2>
        <p>
          Ao adquirir árvores de Mogno Africano, sua instituição ativa lastro de impacto e recebe Folhas para distribuir em atividades.
        </p>
      </div>

      <div className="protocol-info-card">
        <strong>Fluxo do protocolo</strong>
        <span>Orquestrador → Registro da Instituição → Gestor de Ativos → Folhas</span>
        <small>A compra só atualiza o saldo da instituição depois da confirmação do protocolo.</small>
      </div>

      <div className="package-grid">
        {TREE_PACKAGES.map((pack) => {
          const leafs = getTreePackageLeafs(pack);
          const trees = Number(pack.trees || pack.treeCount || 0);

          return (
            <article className="package-card" key={pack.id}>
              <div>
                <p className="eyebrow">{trees} árvores</p>
                <h3>{pack.name}</h3>
                <p>{pack.description}</p>
              </div>

              <div className="package-highlight">{formatLeafs(leafs)} Folhas</div>
              <p className="muted">{pack.priceLabel}</p>

              <ProtocolActionButton
                actionId="INSTITUTION_ACQUIRE_TREES"
                account={account}
                payload={{
                  idempotencyKey: buildIdempotencyKey(institution, pack),
                  institutionId: institution?.id,
                  institutionName: institution?.name || institution?.profile?.name,
                  packageId: pack.id,
                  packageName: pack.name,
                  treeCount: trees,
                  leafsPerTree: Number(pack.leafsPerTree || 1000),
                  leafsUnlocked: leafs,
                  asset: 'Mogno Africano',
                }}
                onSuccess={(result) => handleProtocolSuccess(pack, result)}
              >
                Adquirir pacote
              </ProtocolActionButton>
            </article>
          );
        })}
      </div>
    </section>
  );
}
