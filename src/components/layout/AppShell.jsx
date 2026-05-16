import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";
import { MobileNav } from "./MobileNav.jsx";

export function AppShell({ children, activePage, onNavigate, connected, walletAddress, onToggleWallet }) {
  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="main-area">
        <Topbar connected={connected} walletAddress={walletAddress} onToggleWallet={onToggleWallet} />
        <main className="page-content">{children}</main>
      </div>
      <MobileNav activePage={activePage} onNavigate={onNavigate} />
    </div>
  );
}
