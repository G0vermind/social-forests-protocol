# Social Forest Protocol — Arquitetura de Contratos

> **Versão:** 1.0 · **Data:** 2026-04-20 · **Rede:** Stellar / Soroban  
> **Estado:** Production-ready (pré-audit SCF Audit Bank)

---

## 1. Visão do Sistema

O protocolo possui dois contratos Soroban independentes que partilham um modelo de confiança hierárquico.

```
┌──────────────────────────────────────────────────────────────────┐
│                    Social Forest Protocol                        │
│                                                                  │
│   ┌──────────────────────┐       ┌──────────────────────────┐   │
│   │     rwa_vault        │       │     sbt_reputation       │   │
│   │  (MOGNO SEP-41 RWA)  │       │  (Green Cashback SBT)    │   │
│   │                      │       │                          │   │
│   │  Admin (Oráculo PoF) │       │  Admin                   │   │
│   │     │                │       │    │                     │   │
│   │     ▼                │       │    ▼                     │   │
│   │  admin_mint ─────────┼───┐   │  register_company        │   │
│   │  admin_burn          │   │   │  revoke_company          │   │
│   │  pause / unpause     │   │   │  pause / unpause         │   │
│   │                      │   │   │    │                     │   │
│   │  User                │   │   │    ▼ (verified company)  │   │
│   │     │                │   └──▶│  distribute_green_       │   │
│   │     ▼                │       │  cashback(company,user)  │   │
│   │  transfer            │       │    │                     │   │
│   │  approve             │       │    ▼                     │   │
│   │  transfer_from       │       │  impact_points (read)    │   │
│   └──────────────────────┘       └──────────────────────────┘   │
│                                                                  │
│   Fluxo futuro (2026):  rwa_vault ──cross-contract──▶ vereda-core│
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Trust Assumptions (Modelo de Confiança)

| Ator | Permissões em `rwa_vault` | Permissões em `sbt_reputation` |
|---|---|---|
| **Admin** (Oráculo PoF) | `initialize`, `admin_mint`, `admin_burn`, `pause`, `unpause` | `initialize`, `register_company`, `revoke_company`, `pause`, `unpause` |
| **Empresa Verificada** | — | `distribute_green_cashback` |
| **Utilizador final** | `transfer`, `approve`, `transfer_from` | *(leitura)* `impact_points` |
| **Qualquer conta** | `balance`, `allowance`, `decimals`, `name`, `symbol`, `total_supply` | `is_verified_company`, `impact_points` |

### Regras de confiança
- O `Admin` é estabelecido em `initialize()` e **imutável** (sem `set_admin`).
- `require_auth()` é chamado em **todas** as funções privilegiadas.
- O `Admin` do `rwa_vault` e do `sbt_reputation` pode ser a **mesma multisig** ou contas separadas.
- As empresas verificadas **nunca** têm acesso ao `rwa_vault` — os dois contratos são isolados.

---

## 3. Fluxo Futuro: Cross-Contract com `vereda-core` (Vereda.Verify)

```
Stellar Testnet / Mainnet
│
│  vereda-core (vereda-verify-soroban)
│    └── verify_entity(company_address) → bool
│          │
│          │  Cross-contract call (Soroban invoke_contract)
│          ▼
│  sbt_reputation.register_company(company)
│    └── Substituirá a whitelist manual por prova on-chain de KYC
│
│  rwa_vault.admin_mint(to, amount)
│    └── Futuramente acionado por oráculo que consome
│        vereda-core.get_flourishing_proof(asset_id)
```

**Benefício:** A whitelist manual de empresas será substituída por uma chamada cross-contract ao `vereda-core`, eliminando a confiança centralizada no Admin para register/revoke.

---

## 4. Modelo de Storage

### `rwa_vault`

| Chave (`DataKey`) | Tipo | Storage | TTL (min / max) | Descrição |
|---|---|---|---|---|
| `Admin` | `Address` | `instance()` | 17_280 / 518_400 | Administrador do contrato |
| `Paused` | `bool` | `instance()` | 17_280 / 518_400 | Estado de pausa |
| `TotalSupply` | `i128` | `instance()` | 17_280 / 518_400 | Supply total em circulação |
| `Balance(Address)` | `i128` | `persistent()` | 17_280 / 518_400 | Saldo por endereço |
| `Allowance(Address, Address)` | `i128` | `persistent()` | 17_280 / 518_400 | Allowance (owner, spender) |

### `sbt_reputation`

| Chave (`DataKey`) | Tipo | Storage | TTL (min / max) | Descrição |
|---|---|---|---|---|
| `Admin` | `Address` | `instance()` | 100_000 / 100_000 | Administrador |
| `Paused` | `bool` | `instance()` | 100_000 / 100_000 | Estado de pausa |
| `VerifiedCompany(Address)` | `bool` | `persistent()` | 200_000 / 200_000 | Whitelist de empresas KYC |
| `ImpactPoints(Address)` | `i128` | `persistent()` | 100_000 / 100_000 | Pontos acumulados por utilizador |

---

## 5. Funções Públicas — Pré e Pós-condições

### `rwa_vault`

#### `initialize(admin: Address)`
- **Pré:** Contrato não inicializado (`!storage.has(Admin)`)
- **Pós:** `Admin`, `Paused=false`, `TotalSupply=0` gravados; TTL renovado

#### `pause()` / `unpause()`
- **Pré:** `Admin.require_auth()`; contrato inicializado
- **Pós:** `Paused` = `true`/`false`; evento emitido

#### `admin_mint(to, amount)`
- **Pré:** `!Paused`; `amount > 0`; `Admin.require_auth()`; `TotalSupply + amount ≤ MAX_SUPPLY`
- **Pós:** `Balance(to) += amount`; `TotalSupply += amount`; evento `mint` emitido

#### `admin_burn(from, amount)`
- **Pré:** `!Paused`; `amount > 0`; `Admin.require_auth()`; `Balance(from) ≥ amount`
- **Pós:** `Balance(from) -= amount`; `TotalSupply -= amount`; evento `burn` emitido

#### `transfer(from, to, amount)`
- **Pré:** `!Paused`; `amount > 0`; `from.require_auth()`; `Balance(from) ≥ amount`
- **Pós:** `Balance(from) -= amount`; `Balance(to) += amount`; evento `transfer` emitido

#### `approve(from, spender, amount, expiration_ledger)`
- **Pré:** `!Paused`; `amount ≥ 0`; `from.require_auth()`
- **Pós:** `Allowance(from, spender) = amount`; evento `approve` emitido

#### `transfer_from(spender, from, to, amount)`
- **Pré:** `!Paused`; `amount > 0`; `spender.require_auth()`; `Allowance(from,spender) ≥ amount`; `Balance(from) ≥ amount`
- **Pós:** `Allowance -= amount`; `Balance(from) -= amount`; `Balance(to) += amount`; evento `xfr_from` emitido

#### `balance(id)` / `allowance(from, spender)` / `total_supply()` / `decimals()` / `name()` / `symbol()`
- **Pré:** Nenhuma
- **Pós:** Retorna valor lido do storage; sem efeitos colaterais

---

### `sbt_reputation`

#### `initialize(admin: Address)`
- **Pré:** Contrato não inicializado
- **Pós:** `Admin`, `Paused=false` gravados

#### `pause()` / `unpause()`
- **Pré:** `Admin.require_auth()`
- **Pós:** `Paused` = `true`/`false`; evento emitido

#### `register_company(company)`
- **Pré:** `Admin.require_auth()`
- **Pós:** `VerifiedCompany(company) = true`; TTL 200_000; evento `reg_co` emitido

#### `revoke_company(company)`
- **Pré:** `Admin.require_auth()`
- **Pós:** `VerifiedCompany(company) = false`; evento `rev_co` emitido

#### `distribute_green_cashback(company, user, amount)`
- **Pré:** `!Paused`; `amount > 0`; `company.require_auth()`; `VerifiedCompany(company) = true`
- **Pós:** `ImpactPoints(user) += amount`; evento `cashback` emitido

#### `transfer(_from, _to, _amount)`
- **Pré:** Sempre
- **Pós:** Sempre falha com `TransferForbidden` — invariante soulbound

#### `impact_points(addr)` / `is_verified_company(company)`
- **Pré:** Nenhuma
- **Pós:** Retorna valor lido; sem efeitos colaterais

---

## 6. Constantes de Segurança

| Constante | Valor | Contrato | Significado |
|---|---|---|---|
| `MAX_SUPPLY` | `1_000_000_000_000_000` | `rwa_vault` | 100M MOGNO × 10^7 decimais |

---

## 7. Eventos Emitidos

| Evento | Contrato | Dados | Trigger |
|---|---|---|---|
| `("mint",)` | rwa_vault | `(to, amount)` | `admin_mint` |
| `("burn",)` | rwa_vault | `(from, amount)` | `admin_burn` |
| `("transfer",)` | rwa_vault | `(from, to, amount)` | `transfer` |
| `("approve",)` | rwa_vault | `(from, spender, amount)` | `approve` |
| `("xfr_from",)` | rwa_vault | `(spender, from, to, amount)` | `transfer_from` |
| `("paused",)` | ambos | `()` | `pause` |
| `("unpaused",)` | ambos | `()` | `unpause` |
| `("cashback",)` | sbt_reputation | `(company, user, amount)` | `distribute_green_cashback` |
| `("reg_co",)` | sbt_reputation | `company` | `register_company` |
| `("rev_co",)` | sbt_reputation | `company` | `revoke_company` |
