import React from "react";
import { LogoMark } from "./LogoMark.jsx";
import { AccountStatusCompact } from "../account/AccountStatus.jsx";

export function Sidebar({
  profiles,
  activeProfile,
  onProfileChange,
  tabs,
  activeTab,
  onTabChange,
}) {
  return (
    <aside className="sidebar">
      <LogoMark />

      <section className="sidebar-section">
        <p className="eyebrow">Perfil</p>
        <div className="sidebar-profile-list">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              className={`sidebar-profile ${activeProfile.id === profile.id ? "active" : ""}`}
              onClick={() => onProfileChange(profile.id)}
            >
              <strong>{profile.label}</strong>
              <span>{profile.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="sidebar-section grow">
        <p className="eyebrow">Navegação</p>
        <nav className="sidebar-nav" aria-label="Navegação principal">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              className={`sidebar-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </section>

      <AccountStatusCompact />
    </aside>
  );
}
