# CLAUDE.md — Social Forest Protocol
> This file is automatically read by Claude (via Antgravity or Claude Code) at the start of every session.
> It provides the strategic, architectural, and behavioral context Claude needs to operate effectively within this project.
> For agent-specific tool instructions, see [AGENTS.md](./AGENTS.md).

---

## 🧠 What This Project Is

**Social Forest Protocol** is a **B2B environmental services infrastructure** built on the Stellar network. It tokenizes African Mahogany (*Khaya senegalensis*) as Real World Assets (RWA) and connects institutional capital (B2B) to end consumers (B2C) through a Green Cashback engine.

**This is NOT:**
- A retail investment platform
- A speculative crypto token
- A carbon credit marketplace (in the traditional sense)

**This IS:**
- A B2B2C protocol where companies buy RWA fractions for ESG balance sheets and distribute them as Green Cashbacks to their customers
- A Proof of Flourishing (PoF) engine that validates living trees on-chain via AI + x402/MPP micropayments
- An infrastructure layer — open for any company or developer to integrate via x402

---

## 🏗️ Architecture Overview

### Live Contracts (Soroban / Rust)
| Contract | Path | Status |
| :--- | :--- | :--- |
| `rwa_vault` | `contracts/rwa_vault/lib.rs` | Active — SEP-41 MOGNO token |
| `sbt_reputation` | `contracts/sbt_reputation/lib.rs` | Active — Green Cashback + non-transferable SBT |

### Roadmap Contracts
| Contract | Purpose |
| :--- | :--- |
| `governance` | $FLORA weighted voting |
| `c_cred` | Ex-post carbon credit issuance |
| `c_debt` | Corporate carbon audit ledger |
| `amm_impact` | Non-speculative DeFi settlement AMM |

### Frontend
- **Framework:** Next.js (TypeScript)
- **Path:** `src/app/`
- **Purpose:** B2B2C dashboard (Partner Panel + Consumer Wallet)

### Backend / Oracle
- **Path:** `services/pof_oracle/`
- **Stack:** n8n automation + AI Vision (multispectral data)
- **Triggers:** `admin_mint` on `rwa_vault` when PoF threshold met; `distribute_green_cashback` on `sbt_reputation` when B2B sale event fires

### Payment Protocols
- **x402** (Coinbase) — micropayments for PoF validation events
- **MPP** (Stripe) — institutional fiat-to-asset on-ramp for B2B partners

---

## 🪙 Token System

| Token | Symbol | Type | Key Rule |
| :--- | :--- | :--- | :--- |
| African Mahogany RWA | `MOGNO` | SEP-41 | Only minted by PoF oracle via `admin_mint` |
| Carbon Credit | `C-CRED` | Ex-post ecocredit | Issued after verified CO₂ capture |
| Stewardship | `S-CRED` | PSA payment | Rewards conservation independent of carbon |
| Carbon Debt Ledger | `C-DEBT` | Audit record | Tracks corporate Scope 1/2/3 footprints |
| Governance | `$FLORA` | Utility/governance | Earned, not bought — Credit Class Admin |

---

## 📐 Coding Standards

### Rust / Soroban (Critical — always follow)
- `#![no_std]` at the top of every contract
- **Storage:** `storage().instance()` → admin only; `storage().persistent()` → balances, allowances, company registry, impact points
- **TTL:** always bump TTL on every persistent read and write
- **Errors:** `ContractError` enum with `#[contracterror]` — use `panic_with_error!()` for all errors
- **Auth:** `require_auth()` on every state-changing function that has an actor (admin, company, user)
- **SDK version:** `soroban-sdk = { version = "21", features = ["testutils"] }`
- **Build target:** `wasm32-unknown-unknown`
- **Profile:** `opt-level = "z"`, `overflow-checks = true`, `lto = true`
- Comment all public functions in Portuguese explaining: who can call it, what it does, why

### TypeScript / Next.js
- Follow `eslint.config.mjs` — no overrides
- Components: `PascalCase` | Functions: `camelCase`
- No `any` — explicit typing always
- No hardcoded Stellar keys or secrets — use `.env.local`

### Git
- Branch naming: `feat/`, `fix/`, `docs/`, `test/`, `refactor/`, `chore/`
- Commit style: Conventional Commits — `feat(contract): add admin_mint with require_auth`
- Never commit directly to `main`
- Never commit `.env`, private keys, or seed phrases

---

## 🔐 Security Rules (Non-Negotiable)

1. **Never** generate, suggest, or handle private keys, seed phrases, or wallet secrets
2. **Never** mint MOGNO tokens outside of the PoF oracle flow — `admin_mint` is oracle-only
3. **Never** allow `transfer_reputation()` to succeed — it must always panic with `SoulboundNonTransferable`
4. **Only** registered Verified Companies (added by admin) can call `distribute_green_cashback()`
5. **Always** validate `amount > 0` before any mint or transfer operation
6. Cross-contract calls between `rwa_vault` and `sbt_reputation` must preserve auth context

---

## 🌲 Business Logic Rules

### The B2B2C Flow (always maintain this mental model)
```
Admin → registers Verified Companies
Verified Company → buys MOGNO in bulk → distributes to consumers via distribute_green_cashback()
Consumer → receives MOGNO fraction + Impact Points (SBT, non-transferable)
Frontend → reads get_user_impact() to display ecological score
```

### What "Proof of Flourishing" means in code
- PoF is the oracle — it calls `admin_mint()` on `rwa_vault`
- PoF validation is triggered by physical tree data (DAP, height) anchored via Regen Data Stream
- Tokens are minted ONLY after independent verification — not on claim

### Green Cashback ≠ Investment
- MOGNO fractions distributed via cashback are rewards, not investment instruments
- Impact Points (SBT) are reputation scores — they cannot be traded, sold, or transferred
- The consumer "forges" a tree certificate only after accumulating enough Leaves (gamification threshold)

---

## 🚫 What Claude Should NOT Do in This Project

- Do not suggest making `transfer_reputation()` transferable — it is intentionally a SBT
- Do not add retail investor UI flows — this is B2B infrastructure first
- Do not use `storage().temporary()` for balances or allowances — use `persistent()` only
- Do not generate code with hardcoded addresses or contract IDs
- Do not create new token standards — use SEP-41 for all fungible tokens
- Do not suggest moving to a different blockchain — Stellar/Soroban is the deliberate choice
- Do not skip TTL bumps on persistent storage — they will cause data expiry bugs in production
- Do not use `any` in TypeScript
- Do not commit or suggest committing secrets to the repository

---

## 📁 Key Files Reference

| File | Purpose |
| :--- | :--- |
| `contracts/rwa_vault/lib.rs` | SEP-41 MOGNO token contract |
| `contracts/sbt_reputation/lib.rs` | Green Cashback engine + SBT |
| `src/app/` | Next.js frontend |
| `services/pof_oracle/` | n8n PoF oracle pipeline |
| `services/stripe_gateway/` | Stripe MPP fiat on-ramp |
| `.well-known/stellar.toml` | Stellar asset metadata |
| `LIGHTPAPER.md` | Full product vision and tokenomics |
| `CONTRIBUTING.md` | Dev setup, branch workflow, standards |
| `AGENTS.md` | Agent tool instructions |

---

## 🌍 Project Context for Better Decisions

- **Location:** Ceará, Brazil — semi-arid region, ABC+ Low Carbon Agriculture framework
- **Physical anchor:** Viveiro Maravilha (nursery) + Sómogno Sawmill — the "Client Zero" that proves the protocol
- **Legal:** African Mahogany is DOF-exempt in Brazil (exotic species) — key legal velocity advantage
- **Compliance:** UNICAP environmental jurisprudence advisors; aligned with GRI, SASB, SBTi, B Lab Greenshouting Guide
- **Global alignment:** Paris Agreement, Kunming-Montreal Biodiversity Framework, UNEA-7, GEO-7, SDGs
- **Environment:** Windows + PowerShell — use backtick (`` ` ``) for multiline commands, not backslash (`\`)

---

## ✅ Before Generating Any Code

1. Read `contracts/rwa_vault/Cargo.toml` and `contracts/rwa_vault/lib.rs` to understand existing patterns
2. If creating a new contract, create it in `contracts/<contract_name>/` — never modify `rwa_vault` for unrelated features
3. Confirm SDK version is `soroban-sdk = "21"` before writing any Soroban code
4. After generating contract code, run: `cargo build --target wasm32-unknown-unknown --release` and `cargo test`
5. Report compilation result explicitly

---

*Social Forest Protocol — Converting Ecological Flourishing into Programmable Prosperity on Stellar.*
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `B2B2C` · `ReFi`
