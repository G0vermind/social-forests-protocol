import React from 'react';
import { TREE_PACKAGES } from '../../data/treePackages.mock.js';
import { ProtocolActionButton } from '../../components/protocol/ProtocolActionButton.jsx';
import { useProtocolAccount } from '../../protocol/useProtocolAccount.js';
import { formatLeafs } from '../../utils/leafsMath.js';

function getPackageLeafs(pack) {
  return Number(pack.leafs || pack.totalLeafs || 0) || Number(pack.trees || 0) * Number(pack.leafsPerTree || 1000);
}

function buildNextInstitutionState(institution, pack) {
  const currentTrees = Number(institution?.acquiredTrees || 0);
  const currentLeafsPerTree = Number(institution?.leafsPerTree || pack.leafsPerTree || 1000);
  const nextTrees = currentTrees + Number(pack.trees || 0);

  return {
    ...institution,
    acquiredTrees: nextTrees,
    leafsPerTree: Number(pack.leafsPerTree || currentLeafsPerTree),
    lastTreePackage: {
      id: pack.id,
      name: pack.name,
      trees: Number(pack.trees || 0),
      leafsUnlocked: getPackageLeafs(pack),
      acquiredAt: new Date().toISOString(),
    },
  };
}

export function AcquireTrees({ institution, onSave, onAcquire }) {
  const account = useProtocolAccount('institution');

  function handlePackageAcquired(pack) {
    const nextInstitution = buildNextInstitutionState(institution, pack);
    onSave?.(nextInstitution);
    onAcquire?.(pack, nextInstitution);
  }

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
          const leafs = getPackageLeafs(pack);
          const trees = Number(pack.trees || 0);

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
                  institutionId: institution?.id,
                  institutionName: institution?.profile?.name || institution?.name,
                  packageId: pack.id,
                  packageName: pack.name,
                  treeCount: trees,
                  leafsUnlocked: leafs,
                  contractFlow: [
                    'Orquestrador Final',
                    'SBT Empresa',
                    'MasterChief Collateral',
                    'Leaf Token',
                  ],
                }}
                onSuccess={() => handlePackageAcquired(pack)}
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
