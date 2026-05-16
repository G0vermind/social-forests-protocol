import { Button } from "../ui/Button.jsx";

export function ConnectWalletButton({ connected, onToggle }) {
  return (
    <Button variant={connected ? "ghost" : "primary"} onClick={onToggle}>
      {connected ? "Wallet conectada" : "Conectar wallet"}
    </Button>
  );
}
