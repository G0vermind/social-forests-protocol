export const signlessPolicy = {
  mode: "mvp-policy-preview",
  allowedWithoutSignature: [
    "view_dashboard",
    "view_viveiro",
    "view_impact",
    "claim_mock_leafs",
  ],
  requiresSignatureOrBackendPolicy: [
    "redeem_tree",
    "transfer_token",
    "mint_sbt",
    "register_impact_onchain",
  ],
};
