import React from "react";
import { LogoMark } from "./LogoMark.jsx";
import { AccountStatusCompact } from "../account/AccountStatus.jsx";

export function HeaderBar({ profiles, activeProfile, onProfileChange }) {
  return (
    <header className="header-bar">
      <LogoMark />

      <div className="profile-switch" aria-label="Selecionar perfil">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            type="button"
            className={`profile-pill ${activeProfile.id === profile.id ? "active" : ""}`}
            onClick={() => onProfileChange(profile.id)}
          >
            {profile.shortLabel}
          </button>
        ))}
      </div>

      <AccountStatusCompact />
    </header>
  );
}
