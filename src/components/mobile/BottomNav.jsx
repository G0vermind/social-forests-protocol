const memberItems = [
  ["home", "Início"], ["activities", "Atividades"], ["nursery", "Viveiro"], ["impact", "Impacto"], ["account", "Conta"]
];
const workItems = [["home", "Painel"], ["activities", "Ações"], ["impact", "Impacto"], ["account", "Conta"]];

export function BottomNav({ profileId, activeTab, onChange }) {
  const items = profileId === "member" ? memberItems : workItems;
  return <nav className="bottom-nav" aria-label="Navegação principal">
    {items.map(([id, label]) => <button key={id} className={activeTab === id ? "active" : ""} onClick={() => onChange(id)} type="button"><span>{iconFor(id)}</span><small>{label}</small></button>)}
  </nav>;
}
function iconFor(id){ return ({home:"⌂",activities:"✦",nursery:"♧",impact:"◌",account:"◍"})[id] || "•"; }
