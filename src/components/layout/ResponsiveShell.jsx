import React from "react";
import { HeaderBar } from "./HeaderBar.jsx";
import { Sidebar } from "./Sidebar.jsx";
import { BottomNav } from "./BottomNav.jsx";

export function ResponsiveShell({
  profiles,
  activeProfile,
  onProfileChange,
  tabs,
  activeTab,
  onTabChange,
  children,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        profiles={profiles}
        activeProfile={activeProfile}
        onProfileChange={onProfileChange}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      <div className="app-main">
        <HeaderBar
          profiles={profiles}
          activeProfile={activeProfile}
          onProfileChange={onProfileChange}
        />

        <main className="screen-wrap">{children}</main>
      </div>

      <BottomNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
