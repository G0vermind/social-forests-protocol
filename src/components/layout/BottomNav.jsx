import React from "react";

export function BottomNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav" aria-label="Navegação mobile">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav-item ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="bottom-dot" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
