# 🌳 Contributing Guide — Social Forest Protocol

> 🇧🇷 [Versão em Português abaixo](#-guia-de-contribuição--social-forest-protocol)

Welcome to the **Social Forest Protocol** development team.
We are building a B2B RWA infrastructure on the Stellar network, focused on environmental services and African Mahogany tokenization (*Khaya senegalensis*). Our development environment is **Antgravity** and our technical standard is excellence — every line of code submitted represents a real-world asset.

---

## 🛠️ Our Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Soroban (Rust) — SEP-41 standard |
| Core Asset | African Mahogany RWA (`MOGNO`) |
| Oracle | n8n — Proof of Flourishing |
| Payments | x402-stellar SDK |
| Frontend | Next.js (`/src` folder) |
| Blockchain | Stellar Network (Testnet / Mainnet) |

---

## ⚙️ Environment Setup

### Prerequisites

- [Rust](https://rustup.rs/) with WASM target: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install stellar-cli`
- [Node.js](https://nodejs.org/) v18+ and npm
- [Antgravity](https://antgravity.dev/) installed in VS Code

### Installation

```bash
# Clone the repository
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Install frontend dependencies
npm install

# Verify Rust/Soroban environment
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
```

---

## 🌿 Contribution Workflow

### 1. Never commit directly to `main`

Every contribution starts on a descriptive branch:

```bash
git checkout -b feat/feature-name
# examples:
# feat/admin-mint-oracle
# fix/balance-storage-ttl
# docs/lightpaper-update
```

### 2. Commit standard (Conventional Commits)

```
feat(contract): add admin_mint function with require_auth
fix(storage): fix TTL bump on persistent allowances
docs(readme): update tokenization section
test(vault): add transfer test with insufficient balance
```

| Prefix | Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `test` | Add or fix tests |
| `refactor` | Refactor without behavior change |
| `chore` | Config, CI, dependencies |

### 3. Before opening a Pull Request

- [ ] Contract compiles: `cargo build --target wasm32-unknown-unknown --release`
- [ ] Tests pass: `cargo test`
- [ ] Complex functions are commented
- [ ] No private keys, seed phrases or `.env` files were committed
- [ ] PR has a clear title and description of what was changed and why

### 4. Code review

Every PR requires at least **1 approval** before merging. Soroban contract PRs require Gustavo's review before going to `main`.

---

## 📁 Project Structure

```
social-forests-protocol/
├── contracts/
│   └── rwa_vault/          # Main SEP-41 contract (Rust/Soroban)
│       ├── Cargo.toml
│       └── lib.rs
├── src/                    # Next.js frontend
│   └── app/
├── public/                 # Static assets
├── .well-known/            # Stellar config (stellar.toml)
├── AGENTS.md               # Instructions for AI agents (Antgravity)
├── CLAUDE.md               # Context for Claude
├── LIGHTPAPER.md           # Protocol technical document
└── README.md
```

---

## 🔐 Security

- **Never** commit private keys, seeds or `.env` files
- Sensitive variables go in `.env.local` (already in `.gitignore`)
- Contracts involving `admin_mint` or fund transfers require mandatory review
- Report vulnerabilities by opening a **private Issue** or contacting Gustavo directly

---

## 🧪 Running Tests

```bash
# Soroban contract tests
cargo test --manifest-path contracts/rwa_vault/Cargo.toml

# Frontend tests
npm run test

# Full validation build
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
```

---

## 📜 Code Standards

### Rust / Soroban

- Use `#![no_std]` in all contracts
- Storage: `instance()` for admin, `persistent()` for balances and allowances
- Errors: `ContractError` enum with `#[contracterror]` and `panic_with_error!`
- Comment all public functions with `///`

### TypeScript / Next.js

- Follow the `eslint.config.mjs` already configured in the project
- Components in `PascalCase`, functions in `camelCase`
- No `any` — explicit typing always

---

## ❓ Questions

Open an [Issue](https://github.com/G0vermind/social-forests-protocol/issues) on GitHub or talk to **Gustavo** in the project group.

> _"Every MOGNO token represents a real tree. Every line of code, a commitment to the planet."_

---
---

# 🌳 Guia de Contribuição — Social Forest Protocol

> 🇺🇸 [English version above](#-contributing-guide--social-forest-protocol)

Bem-vindo à equipe de desenvolvimento do **Social Forest Protocol**.
Estamos construindo uma infraestrutura B2B de RWA na rede Stellar, com foco em serviços ambientais e tokenização de Mogno Africano (*Khaya senegalensis*). Nosso ambiente de desenvolvimento é o **Antgravity** e nosso padrão técnico é excelência — cada linha de código enviada representa um ativo real no mundo.

---

## 🛠️ Nossa Stack

| Camada | Tecnologia |
|---|---|
| Smart Contracts | Soroban (Rust) — padrão SEP-41 |
| Ativo Principal | Mogno Africano RWA (`MOGNO`) |
| Oráculo | n8n — Proof of Flourishing |
| Pagamentos | x402-stellar SDK |
| Frontend | Next.js (pasta `/src`) |
| Blockchain | Stellar Network (Testnet / Mainnet) |

---

## ⚙️ Configuração do Ambiente

### Pré-requisitos

- [Rust](https://rustup.rs/) com target WASM: `rustup target add wasm32-unknown-unknown`
- [Stellar CLI](https://developers.stellar.org/docs/tools/stellar-cli): `cargo install stellar-cli`
- [Node.js](https://nodejs.org/) v18+ e npm
- [Antgravity](https://antgravity.dev/) instalado no VS Code

### Instalação

```bash
# Clone o repositório
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol

# Instale as dependências do frontend
npm install

# Verifique o ambiente Rust/Soroban
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
```

---

## 🌿 Fluxo de Contribuição

### 1. Nunca commite direto na `main`

Toda contribuição começa em uma branch descritiva:

```bash
git checkout -b feat/nome-da-funcionalidade
# exemplos:
# feat/admin-mint-oracle
# fix/balance-storage-ttl
# docs/lightpaper-update
```

### 2. Padrão de commits (Conventional Commits)

```
feat(contract): adiciona função admin_mint com require_auth
fix(storage): corrige bump de TTL em allowances persistentes
docs(readme): atualiza seção de tokenização
test(vault): adiciona teste de transfer com saldo insuficiente
```

| Prefixo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Documentação apenas |
| `test` | Adição ou correção de testes |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Configuração, CI, dependências |

### 3. Antes de abrir um Pull Request

- [ ] O contrato compila: `cargo build --target wasm32-unknown-unknown --release`
- [ ] Os testes passam: `cargo test`
- [ ] Funções complexas estão comentadas
- [ ] Nenhuma chave privada, seed phrase ou `.env` foi commitado
- [ ] O PR tem título claro e descrição do que foi alterado e por quê

### 4. Revisão de código

Todo PR precisa de pelo menos **1 aprovação** antes do merge. PRs de contratos Soroban precisam de revisão do Gustavo antes de ir para `main`.

---

## 📁 Estrutura do Projeto

```
social-forests-protocol/
├── contracts/
│   └── rwa_vault/          # Contrato principal SEP-41 (Rust/Soroban)
│       ├── Cargo.toml
│       └── lib.rs
├── src/                    # Frontend Next.js
│   └── app/
├── public/                 # Assets estáticos
├── .well-known/            # Configurações Stellar (stellar.toml)
├── AGENTS.md               # Instruções para agentes de IA (Antgravity)
├── CLAUDE.md               # Contexto para Claude
├── LIGHTPAPER.md           # Documento técnico do protocolo
└── README.md
```

---

## 🔐 Segurança

- **Nunca** commite chaves privadas, seeds ou arquivos `.env`
- Variáveis sensíveis ficam em `.env.local` (já no `.gitignore`)
- Contratos que envolvem `admin_mint` ou transferência de fundos precisam de revisão obrigatória
- Reporte vulnerabilidades abrindo uma **Issue privada** ou contactando Gustavo diretamente

---

## 🧪 Rodando os Testes

```bash
# Testes do contrato Soroban
cargo test --manifest-path contracts/rwa_vault/Cargo.toml

# Testes do frontend
npm run test

# Build completo de validação
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
```

---

## 📜 Padrões de Código

### Rust / Soroban

- Use `#![no_std]` em todos os contratos
- Storage: `instance()` para admin, `persistent()` para balances e allowances
- Erros: enum `ContractError` com `#[contracterror]` e `panic_with_error!`
- Comente todas as funções públicas com `///`

### TypeScript / Next.js

- Siga o `eslint.config.mjs` já configurado no projeto
- Componentes em `PascalCase`, funções em `camelCase`
- Sem `any` — tipagem explícita sempre

---

## ❓ Dúvidas

Abra uma [Issue](https://github.com/G0vermind/social-forests-protocol/issues) no GitHub ou fale com **Gustavo** no grupo do projeto.

> _"Cada token MOGNO representa uma árvore real. Cada linha de código, um compromisso com o planeta."_
