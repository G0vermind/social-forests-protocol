import { copy } from "../../copy/glossary.js";
import { Button } from "../ui/Button.jsx";

export function HeaderBar({ profile, onProfileChange, accountReady, onEnterAccount }) {
  return <header className="header-bar">
    <div><p className="eyebrow">{copy.appName}</p><h1>Olá, {profile.label}</h1></div>
    <Button variant={accountReady ? "ghost" : "primary"} onClick={onEnterAccount}>{accountReady ? "Conta ativa" : "Entrar"}</Button>
  </header>;
}
