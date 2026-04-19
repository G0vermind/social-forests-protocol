# AGENTS.md — Social Forest Protocol

Operational instructions for AI agents (Antgravity, Claude Code, Codex, and similar).
This file defines **HOW** agents must act in this repository.

> **Note:** For strategic context, business logic, and coding standards, read `CLAUDE.md` first.

---

## ⚠️ Read This Before Doing Anything

1. **Always read `CLAUDE.md`** before starting any task. It contains the business logic rules, security constraints, and coding standards that govern all decisions in this project.
2. **Always read existing files before editing them.** Never overwrite a file you haven't read first.
3. **This project runs on Windows + PowerShell.** Use backtick (\`) for multiline terminal commands — not backslash (\\).
4. **Never commit to `main` directly.** All changes go through branches.
5. **Never generate, store, or suggest private keys, seed phrases, or secrets.**

---

```markdown
## 🗂️ Repository Map

```text
social-forests-protocol/
├── contracts/
│   ├── rwa_vault/         ← SEP-41 MOGNO token (ACTIVE — read before touching)
│   │   ├── Cargo.toml
│   │   └── lib.rs
│   └── sbt_reputation/    ← Green Cashback + SBT (ACTIVE — read before touching)
│       ├── Cargo.toml
│       └── lib.rs
├── src/app/               ← Next.js frontend (TypeScript)
├── services/
│   ├── pof_oracle/        ← n8n PoF pipeline + AI Vision
│   └── stripe_gateway/    ← Stripe MPP fiat on-ramp
├── public/
├── .well-known/           ← stellar.toml
├── AGENTS.md              ← YOU ARE HERE
├── CLAUDE.md              ← Read this first
├── CONTRIBUTING.md
└── LIGHTPAPER.md
```

---

## 🦀 Working with Rust / Soroban Contracts

### Before writing any contract code
1. Read the existing contracts first:
   * `contracts/rwa_vault/Cargo.toml`
   * `contracts/rwa_vault/lib.rs`
   * `contracts/sbt_reputation/Cargo.toml`
   * `contracts/sbt_reputation/lib.rs`
2. Verify Rust toolchain:
   ```powershell
   rustup show
   rustup target list --installed | Select-String "wasm32"
   ```

### Creating a new contract
Always create new contracts in their own folder — never add unrelated logic to `rwa_vault` or `sbt_reputation`:

```powershell
# Create new contract directory
New-Item -ItemType Directory -Path contracts/<contract_name>

# Navigate and initialize
cd contracts/<contract_name>
cargo init --lib
```

Every new `Cargo.toml` must follow this exact template:
```toml
[package]
name = "<contract_name>"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
soroban-sdk = { version = "21", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
lto = true
codegen-units = 1
panic = "abort"
```

Every new `lib.rs` must start with:
```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, contracterror,
                  Address, Env, String, panic_with_error};
```

### Building contracts
```powershell
# Build rwa_vault
cargo build --target wasm32-unknown-unknown --release `
  --manifest-path contracts/rwa_vault/Cargo.toml

# Build sbt_reputation
cargo build --target wasm32-unknown-unknown --release `
  --manifest-path contracts/sbt_reputation/Cargo.toml
```

### Running tests
```powershell
# Test a specific contract
cargo test --manifest-path contracts/rwa_vault/Cargo.toml

# Test with output
cargo test --manifest-path contracts/<contract_name>/Cargo.toml -- --nocapture
```

### Mandatory patterns for every contract

**Storage keys — always use an enum:**
```rust
#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address),
    Allowance(Address, Address),
    // add keys specific to the contract
}
```

**Error enum — always use `#[contracterror]`:**
```rust
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum ContractError {
    AlreadyInitialized = 1,
    Unauthorized       = 2,
    InsufficientBalance = 3,
    InvalidAmount      = 4,
    // add contract-specific errors starting at 5
}
```

**TTL bump — required on every persistent read/write:**
```rust
// On write:
env.storage().persistent().set(&key, &value);
env.storage().persistent().extend_ttl(&key, 100, 100);

// On read:
let value = env.storage().persistent().get(&key).unwrap();
env.storage().persistent().extend_ttl(&key, 100, 100);
```

**Auth — required on every actor-driven function:**
```rust
pub fn my_function(env: Env, caller: Address, ...) {
    caller.require_auth();
    // ... rest of logic
}
```

**Comment format — all public functions in Portuguese:**
```rust
/// Distribui cashback verde para o consumidor.
/// Quem pode chamar: Empresa Verificada (requer require_auth)
/// Fluxo: Empresa → envia fração MOGNO → incrementa Pontos de Impacto do usuário
pub fn distribute_green_cashback(env: Env, company: Address, user: Address, amount: i128) {
    // ...
}
```

---

## 🌐 Working with Next.js Frontend

⚠️ **Important — this is NOT the Next.js from training data.**
This project uses the App Router (`src/app/`). Before writing any frontend code, read the relevant guides.

**Key conventions:**
* All pages live in `src/app/` — not `pages/`
* Server Components by default — add `"use client"` only when needed (event handlers, hooks)
* No `getServerSideProps`, `getStaticProps` — use async Server Components and `fetch()` instead
* Routing: file-based via folders — `src/app/dashboard/page.tsx` → `/dashboard`
* Layouts: `layout.tsx` wraps children — never duplicate nav/header across pages

**TypeScript rules:**
```typescript
// ✅ Always type explicitly
const userImpact: bigint = await contract.get_user_impact(userAddress)

// ❌ Never use any
const data: any = await fetch(...)  // forbidden

// ✅ Use environment variables for contract IDs and keys
const CONTRACT_ID = process.env.NEXT_PUBLIC_RWA_VAULT_CONTRACT_ID
```

**Stellar SDK in frontend:**
```typescript
import { Contract, SorobanRpc } from "@stellar/stellar-sdk"

const server = new SorobanRpc.Server(process.env.NEXT_PUBLIC_SOROBAN_RPC_URL!)
const contract = new Contract(process.env.NEXT_PUBLIC_SBT_CONTRACT_ID!)
```

---

## 🔑 Environment Variables
Never hardcode values. Always use `.env.local` (already in `.gitignore`):

```env
# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=[https://soroban-testnet.stellar.org](https://soroban-testnet.stellar.org)

# Contract IDs (filled after deployment)
NEXT_PUBLIC_RWA_VAULT_CONTRACT_ID=
NEXT_PUBLIC_SBT_REPUTATION_CONTRACT_ID=

# Stripe MPP
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Oracle
POF_ORACLE_WEBHOOK_SECRET=
N8N_WEBHOOK_URL=
```

---

## 🚀 Stellar CLI — Deploying Contracts

```powershell
# Configure testnet identity (first time only)
stellar keys generate --global <identity-name> --network testnet

# Deploy rwa_vault to testnet
stellar contract deploy `
  --wasm contracts/rwa_vault/target/wasm32-unknown-unknown/release/rwa_vault.wasm `
  --source <identity-name> `
  --network testnet

# Initialize rwa_vault after deploy
stellar contract invoke `
  --id <CONTRACT_ID> `
  --source <identity-name> `
  --network testnet `
  -- initialize `
  --admin <ADMIN_ADDRESS>
```

---

## 🌿 Git Workflow

```powershell
# Always start from an updated main
git checkout main
git pull origin main

# Create a branch
git checkout -b feat/your-feature-name

# Stage and commit (Conventional Commits)
git add .
git commit -m "feat(contract): add admin_mint with require_auth"

# Push
git push origin feat/your-feature-name
```

**Branch naming:**
* `feat/` New feature or contract function
* `fix/` Bug fix
* `docs/` Documentation only
* `test/` Adding or fixing tests
* `refactor/` Refactor without behavior change

---

## ✅ Task Completion Checklist

**For Rust / Soroban tasks:**
- [ ] Read existing contracts before writing new code
- [ ] `cargo build --target wasm32-unknown-unknown --release` passes with zero errors
- [ ] `cargo test` passes — all tests green
- [ ] Every public function has a Portuguese `///` comment
- [ ] TTL bump present on every persistent storage operation
- [ ] `require_auth()` on every actor-driven function
- [ ] ContractError enum covers all failure paths
- [ ] No hardcoded addresses or contract IDs

**For TypeScript / Next.js tasks:**
- [ ] `npm run lint` passes with zero errors
- [ ] No `any` types
- [ ] No hardcoded keys or contract IDs — use `process.env`
- [ ] Server/Client component boundary is correct (`"use client"` only where needed)

**For all tasks:**
- [ ] No secrets committed
- [ ] Branch created (not committing to `main`)
- [ ] Commit message follows Conventional Commits format

---

## 🆘 Common Errors & Fixes

| Error | Likely Cause | Fix |
| :--- | :--- | :--- |
| `error[E0433]: failed to resolve` | Missing import in `lib.rs` | Add the correct `use soroban_sdk::...` import |
| `error: no such target wasm32-unknown-unknown` | WASM target not installed | `rustup target add wasm32-unknown-unknown` |
| **TTL expired in tests** | Missing `extend_ttl` on storage | Add `env.storage().persistent().extend_ttl(...)` after every set/get |
| **Auth error in tests** | Missing mock_auths in test setup | Add `env.mock_all_auths()` |
| `(os error 32)` | File locked by Windows/Antivirus | Run tests outside the editor in a separate PowerShell window |

*Social Forest Protocol — Converting Ecological Flourishing into Programmable Prosperity on Stellar.*
```
