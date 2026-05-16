import { routes } from "../../app/routes.jsx";

export function MobileNav({ activePage, onNavigate }) {
  return (
    <nav className="mobile-nav" aria-label="Navegação mobile">
      {routes.slice(0, 5).map((route) => (
        <button
          key={route.id}
          className={activePage === route.id ? "active" : ""}
          onClick={() => onNavigate(route.id)}
          type="button"
        >
          {route.label}
        </button>
      ))}
    </nav>
  );
}
