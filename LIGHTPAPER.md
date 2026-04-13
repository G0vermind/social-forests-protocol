# Social Forest 🌳
**A Decentralized RWA & B2B2C ReFi Protocol on the Stellar Network**

> 📄 **Investors & Partners:** For a deep dive into our economic model, market thesis, and institutional vision, please read our [Executive Lightpaper](./LIGHTPAPER.md).

## 1. Overview
Social Forest is a production-ready Regenerative Finance (ReFi) protocol bridging physical forestry assets with the Stellar network. Built as a seamless B2B2C ecosystem, the protocol transforms high-yield silviculture into verifiable, programmable digital assets using Soroban smart contracts.

## 2. Real-World Asset (RWA) Collateral
Unlike purely theoretical protocols, Social Forest is anchored by a fully operational vertical supply chain in **Nova Russas, Ceará (Brazil)**.

* **The Asset:** African Mahogany (*Khaya senegalensis*).
* **Regulatory Advantage:** As an exotic species in the state of Ceará, our African Mahogany is explicitly **exempt from Document of Forest Origin (DOF) requirements** for transport when the origin is proven. This legal framework enables frictionless commercialization and increases asset liquidity.
* **Infrastructure:** The protocol integrates data from the seedling cultivation stage at **Viveiro Maravilha** through to the final timber processing at the **Sómogno** sawmill.

## 3. Monorepo Architecture
To provide maximum transparency for auditors and maintain high-quality CI/CD, this project operates as a monorepo:

* `/src`: The Next.js frontend containing the B2B Corporate Dashboard, B2C Gamified Digital Nursery, and AI Oracle interfaces.
* `/contracts`: The Soroban (Rust) smart contracts handling RWA state, token fractionalization, and the minting of C-CRED (Carbon) and S-CRED (Stewardship) tokens.

## 4. Technical Innovation: Proof of Growth (PoG)
* **Physical Oracle:** We utilize an AI Engine to process raw field biometric data (DBH and total height). 
* **Trustless Execution:** This validated data acts as an oracle, automatically triggering Soroban smart contracts to update the state and value of the RWA on-chain, eliminating the need for expensive, manual annual audits.

## 5. Tech Stack
* **Blockchain:** Stellar Network, Soroban (Rust), Freighter Wallet API.
* **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript.
* **Backend & Database:** Supabase (PostgreSQL), Edge Functions.
* **Fiat-On-Ramp:** Stripe Integration.

---
*Built with precision for the Stellar Ecosystem.*
*Social Forest: Tokenizing the lungs of the planet to build a regenerative economy.*
