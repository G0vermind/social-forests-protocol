import { HeaderBar } from "./HeaderBar.jsx";
import { BottomNav } from "./BottomNav.jsx";

export function MobileShell({ profile, activeTab, setActiveTab, accountReady, onEnterAccount, children }) {
  return <div className="phone-shell">
    <HeaderBar profile={profile} accountReady={accountReady} onEnterAccount={onEnterAccount} />
    <main className="screen-scroll">{children}</main>
    <BottomNav profileId={profile.id} activeTab={activeTab} onChange={setActiveTab} />
  </div>;
}
