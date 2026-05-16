import { ConnectWalletButton } from "../web3/ConnectWalletButton.jsx";
import { WalletStatus } from "../web3/WalletStatus.jsx";

export function Topbar({ connected, walletAddress, onToggleWallet }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Social Forests Protocol</p>
        <h1>Florestas.social dApp</h1>
      </div>
      <div className="topbar-actions">
        <WalletStatus connected={connected} address={walletAddress} />
        <ConnectWalletButton connected={connected} onToggle={onToggleWallet} />
      </div>
    </header>
  );
}
