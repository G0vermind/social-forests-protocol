import { env } from "../config/env.js";

export const privyConfig = {
  appId: env.privyAppId,
  loginMethods: ["email", "wallet"],
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  appearance: {
    theme: "light",
    accentColor: "#2F6B3F",
  },
};
