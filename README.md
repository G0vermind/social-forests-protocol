<div align="center">

# 🌳 Social Forest Protocol

**Decentralized Infrastructure for Green RWA & Climate Finance on Stellar**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg)](./LICENSE)
[![Stellar Network](https://img.shields.io/badge/Network-Stellar%20Soroban-7B6FEE)](https://stellar.org)
[![Built with Rust](https://img.shields.io/badge/Contracts-Rust%20%2B%20Soroban-orange)](https://www.rust-lang.org/)
[![Standard: SEP-41](https://img.shields.io/badge/Standard-SEP--41-blue)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md)
[![Stack: Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)

> 🇧🇷 [Versão em Português abaixo](#-social-forest-protocol-1)

</div>

---

Social Forest converts the **ecological flourishing** of African Mahogany (*Khaya senegalensis*) in the Brazilian semi-arid region into programmable on-chain collateral on the Stellar network.

Unlike static carbon credit models, Social Forest introduces **Proof of Flourishing (PoF)** — a dynamic, AI-audited proof of biome health that enables a circular **B2B2C** economy where every token minted is backed by a verified, living tree.

---

## 📄 Documentation

| Document | Description |
| :--- | :--- |
| [LIGHTPAPER.md](./LIGHTPAPER.md) | Climate Finance thesis, B2B2C strategy, token architecture |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Dev environment setup, branch workflow, code standards |
| [AGENTS.md](./AGENTS.md) | Instructions for AI agents (Antgravity) |
| [CLAUDE.md](./CLAUDE.md) | Context file for Claude |
| Whitepaper *(coming soon)* | Full Soroban contract architecture + x402 integration spec |

---

## 🏗️ Technical Architecture

The protocol is built on three integration pillars within the Stellar network:

### 1. Smart Contracts — Soroban & Rust

Two contracts form the protocol core:

**`contracts/rwa_vault/`** — SEP-41 Token (`MOGNO`)
- Manages ecological growth rights and fractional RWA minting
- `admin_mint` gated behind the PoF oracle — tokens minted only when flourishing is cryptographically proven
- Storage: `instance()` for admin, `persistent()` for balances and allowances
- Full SEP-41 compliance: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`

**`contracts/sbt_reputation/`** — Green Cashback Engine + Soulbound Reputation
- `distribute_green_cashback(company, user, amount)` — Verified Companies push MOGNO fractions to consumers
- Impact Points are **non-transferable by design** — `transfer_reputation()` always panics with `SoulboundNonTransferable`
- `get_user_impact(user) -> i128` — read endpoint consumed by the Next.js frontend
- Only admin-registered `Verified Companies` can trigger cashback events (`require_auth`)

### 2. Institutional On-ramp — Stripe MPP

To enable the B2B model without crypto custody friction:

- **Fiat-to-Asset:** Corporate treasuries acquire MOGNO fractions via fiat — no crypto wallet required at entry
- **KYB Automation:** Know Your Business compliance integrated directly into the RWA investment flow
- **ESG Reporting:** On-chain transaction history serves as auditable proof for corporate sustainability reports

### 3. Proof of Flourishing Engine — x402 + AI Vision

The audit layer that replaces static "Proof of Growth" with continuous verification:

- **AI Vision Layer:** Multispectral satellite + drone data processed to confirm each registered tree is alive and growing
- **x402 Micropayments:** Every successful PoF validation triggers an economic event on Stellar — updating the intrinsic RWA value on-chain
- **n8n Automation:** Orchestrates the oracle pipeline, triggering `admin_mint` on the `rwa_vault` contract when PoF thresholds are met

---

## 🌲 The B2B2C Model

Social Forest is **not a retail investment platform**. It is a B2B environmental services infrastructure — corporations are the capital entry point, consumers are the impact and reputation layer.

```
  Admin (Social Forest)
    └─ registers Verified Companies
           │
           ▼
  B2B Anchor (Company)
    └─ buys MOGNO in bulk for ESG balance sheets
           │  distribute_green_cashback()
           ▼
  B2C User (Consumer)
    └─ receives MOGNO micro-fraction + Impact Points (SBT)
           │  get_user_impact()
           ▼
  Frontend (Florestas.Social)
    └─ displays ecological score, cashback history,
       governance voice in the Green Treasury DAO
```

**Capital flows in from B2B. Impact flows out to B2C. The planet is the beneficiary.**

---

## 📁 Repository Structure

```
social-forests-protocol/
│
├── contracts/                  # Rust workspace — Soroban smart contracts
│   ├── rwa_vault/              # SEP-41 MOGNO token (mint, transfer, balance)
│   │   ├── Cargo.toml
│   │   └── lib.rs
│   ├── sbt_reputation/         # Green Cashback engine + non-transferable SBT
│   │   ├── Cargo.toml
│   │   └── lib.rs
│   └── governance/             # Weighted voting via PoF + Impact Points (SBT)
│
├── src/                        # Next.js frontend (Florestas.Social)
│   └── app/                    # B2B2C dashboard + B2B corporate panel
│
├── services/                   # Backend integrations
│   ├── stripe_gateway/         # Stripe MPP fiat on-ramp
│   └── pof_oracle/             # AI Vision + x402 PoF engine (n8n)
│
├── public/                     # Static assets
├── .well-known/                # stellar.toml — asset definitions + metadata
│
├── AGENTS.md                   # AI agent instructions (Antgravity)
├── CLAUDE.md                   # Claude context file
├── CONTRIBUTING.md             # Dev setup, branch workflow, code standards
├── LIGHTPAPER.md               # Vision, strategy, tokenomics
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

```bash
# Rust + WASM target
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Stellar CLI
cargo install stellar-cli

# Node.js v18+
node --version
```

### Setup

```bash
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol
npm install
```

### Build & Test Contracts

```bash
# Build rwa_vault (MOGNO SEP-41 token)
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml

# Build sbt_reputation (Green Cashback + SBT)
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/sbt_reputation/Cargo.toml

# Run all contract tests
cargo test --manifest-path contracts/rwa_vault/Cargo.toml
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml
```

### Run Frontend

```bash
npm run dev
# → http://localhost:3000
```

---

## 👥 Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silviculturist and entrepreneur in high-value hardwoods since the late 90s. Stellar Network Ambassador for Brazil/Ceará. Builder of the Green RWA tech-stack and strategic node within the ABC+ Ceará low-carbon agriculture ecosystem.
[LinkedIn](https://www.linkedin.com/in/gustavo-gonçalves-9a4a1523/)

**Vinicius Brás Rocha** · `ReFi Architect`
P2P glocal explorer and netweaver co-creating regenerative cyberculture in Web3 through ReRe (Regenerative Resources). Whitehat hacker from the 1990s cypherpunk movement with roots in the pre-launch Bitcoin ecosystem.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/)

**Clarkson Luiz Buriche** · `Environmental Dev & AI`
Impact-driven developer and senior environmental engineer. Specialist in translating socio-environmental complexity into scalable digital systems. Rust and AI architect building secure tech-stacks for climate regeneration and natural resource governance.
[LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/)

**Iara Magalhães** · `Web3 Developer`
Web3 developer and blockchain enthusiast mastering Rust and decentralized systems. Explorer of secure smart contract architectures within the Soroban ecosystem and contributor to Social Forest's technical development.
[LinkedIn](https://www.linkedin.com/in/iaiakedemy)

---

## ⚖️ Advisors — Council of Guardians

**Francisco das Chagas Rosa** · `Agronomic Advisor`
Agronomist engineer and senior technical consultant in tropical silviculture. Specialist in high-yield African Mahogany management and forest restoration. Bridge between biological complexity and agronomic data validation for the PoF oracle.

**Patricia Lemos** · `Legal Advisor`
Law degree from UNICAP. Web3 legal architect specialized in environmental law and regulatory compliance. Strategist in forest asset jurisprudence and DOF-exempt exotic species legislation. Guardian of the protocol's legal framework bridging legacy law to decentralized programmable finance.

---

## 🗺️ Roadmap

| Phase | Status | Milestones |
| :--- | :---: | :--- |
| **Phase 1 — Seed** | 🔨 Building | `rwa_vault` + `sbt_reputation` on Testnet · Stripe MPP integration · First PoF tree registry · B2B pilot |
| **Phase 2 — Growth** | 🔜 Planned | AI Vision oracle on Mainnet · Green Cashback activation · Flourishing Missions · SBT governance tokens |
| **Phase 3 — Scale** | 🔜 Planned | Secondary MOGNO marketplace · Full institutional onboarding · Pecém Port export integration · DAO transition |

---

## 📜 License

[Apache 2.0](./LICENSE) — Social Forest Protocol

---

<div align="center">

**Social Forest Protocol**
*Converting Ecological Flourishing into Programmable Prosperity on Stellar.*

`rwa_vault` · `sbt_reputation` · `SEP-41` · `Soroban` · `x402` · `PoF`

</div>

---
---

<div align="center">

# 🌳 Social Forest Protocol

**Infraestrutura Descentralizada para Green RWA & Finanças Climáticas na Stellar**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg)](./LICENSE)
[![Stellar Network](https://img.shields.io/badge/Rede-Stellar%20Soroban-7B6FEE)](https://stellar.org)
[![Built with Rust](https://img.shields.io/badge/Contratos-Rust%20%2B%20Soroban-orange)](https://www.rust-lang.org/)
[![Standard: SEP-41](https://img.shields.io/badge/Padrão-SEP--41-blue)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md)
[![Stack: Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)

> 🇺🇸 [English version above](#-social-forest-protocol)

</div>

---

O Social Forest converte o **florescimento ecológico** do Mogno Africano (*Khaya senegalensis*) no semiárido brasileiro em colateral programável *on-chain* na rede Stellar.

Diferente de modelos de créditos de carbono estáticos, o Social Forest introduz o **Proof of Flourishing (PoF)** — uma prova dinâmica de saúde biômica auditada por IA que viabiliza uma economia circular **B2B2C** onde cada token cunhado é lastreado por uma árvore viva e verificada.

---

## 📄 Documentação

| Documento | Descrição |
| :--- | :--- |
| [LIGHTPAPER.md](./LIGHTPAPER.md) | Tese de Finanças Climáticas, estratégia B2B2C, arquitetura de tokens |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Configuração do ambiente, fluxo de branches, padrões de código |
| [AGENTS.md](./AGENTS.md) | Instruções para agentes de IA (Antgravity) |
| [CLAUDE.md](./CLAUDE.md) | Arquivo de contexto para o Claude |
| Whitepaper *(em breve)* | Arquitetura completa dos contratos Soroban + spec de integração x402 |

---

## 🏗️ Arquitetura Técnica

O protocolo é construído sobre três pilares de integração na rede Stellar:

### 1. Smart Contracts — Soroban & Rust

Dois contratos formam o núcleo do protocolo:

**`contracts/rwa_vault/`** — Token SEP-41 (`MOGNO`)
- Gerencia direitos sobre o crescimento ecológico e a cunhagem fracionada de RWA
- `admin_mint` restrito ao oráculo PoF — tokens cunhados apenas quando o florescimento é criptograficamente provado
- Storage: `instance()` para admin, `persistent()` para balances e allowances
- SEP-41 completo: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`

**`contracts/sbt_reputation/`** — Motor de Green Cashback + SBT de Reputação
- `distribute_green_cashback(company, user, amount)` — Empresas Verificadas enviam frações de MOGNO a consumidores
- Pontos de Impacto são **não-transferíveis por design** — `transfer_reputation()` sempre falha com `SoulboundNonTransferable`
- `get_user_impact(user) -> i128` — endpoint de leitura consumido pelo frontend Next.js
- Apenas Empresas Verificadas cadastradas pelo admin podem disparar cashback (`require_auth`)

### 2. On-ramp Institucional — Stripe MPP

Para viabilizar o modelo B2B sem fricção de custódia cripto:

- **Fiat-to-Asset:** Tesourarias corporativas adquirem frações MOGNO via moeda fiduciária — sem carteira cripto na entrada
- **Automação KYB:** Compliance Know Your Business integrado diretamente ao fluxo de investimento em RWA
- **Relatórios ESG:** Histórico de transações *on-chain* serve como prova auditável para relatórios de sustentabilidade corporativa

### 3. Motor de Proof of Flourishing — x402 + IA Vision

A camada de auditoria que substitui o estático "Proof of Growth" por verificação contínua:

- **Camada de Visão por IA:** Dados de satélite multiespectral + drones processados para confirmar que cada árvore registrada está viva e crescendo
- **Micropagamentos x402:** Cada validação PoF bem-sucedida dispara um evento econômico na Stellar — atualizando o valor intrínseco do RWA *on-chain*
- **Automação n8n:** Orquestra o pipeline do oráculo, disparando `admin_mint` no contrato `rwa_vault` quando os limiares de PoF são atingidos

---

## 🌲 O Modelo B2B2C

O Florestas.Social **não é uma plataforma de investimento para o varejo**. É uma infraestrutura B2B de serviços ambientais — as empresas são o ponto de entrada de capital, os consumidores são a camada de impacto e reputação.

```
  Admin (Social Forest)
    └─ cadastra Empresas Verificadas
           │
           ▼
  Âncora B2B (Empresa)
    └─ compra MOGNO em lote para balanços ESG
           │  distribute_green_cashback()
           ▼
  Usuário B2C (Consumidor)
    └─ recebe micro-fração MOGNO + Pontos de Impacto (SBT)
           │  get_user_impact()
           ▼
  Frontend (Florestas.Social)
    └─ exibe score ecológico, histórico de cashback,
       voz na governança da Tesouraria Verde DAO
```

**O capital entra pelo B2B. O impacto chega ao B2C. O planeta é o beneficiário.**

---

## 📁 Estrutura do Repositório

```
social-forests-protocol/
│
├── contracts/                  # Workspace Rust — contratos Soroban
│   ├── rwa_vault/              # Token SEP-41 MOGNO (mint, transfer, balance)
│   │   ├── Cargo.toml
│   │   └── lib.rs
│   ├── sbt_reputation/         # Motor de Green Cashback + SBT não-transferível
│   │   ├── Cargo.toml
│   │   └── lib.rs
│   └── governance/             # Voto ponderado por PoF + Pontos de Impacto
│
├── src/                        # Frontend Next.js (Florestas.Social)
│   └── app/                    # Dashboard B2B2C + painel corporativo B2B
│
├── services/                   # Integrações de back-end
│   ├── stripe_gateway/         # On-ramp fiat via Stripe MPP
│   └── pof_oracle/             # IA Vision + motor PoF x402 (n8n)
│
├── public/                     # Assets estáticos
├── .well-known/                # stellar.toml — definição de ativos e metadados
│
├── AGENTS.md                   # Instruções para agentes de IA (Antgravity)
├── CLAUDE.md                   # Arquivo de contexto para o Claude
├── CONTRIBUTING.md             # Setup do ambiente, workflow, padrões de código
├── LIGHTPAPER.md               # Visão, estratégia, tokenomics
└── README.md
```

---

## ⚡ Início Rápido

### Pré-requisitos

```bash
# Rust + target WASM
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Stellar CLI
cargo install stellar-cli

# Node.js v18+
node --version
```

### Instalação

```bash
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol
npm install
```

### Build & Testes dos Contratos

```bash
# Build rwa_vault (token MOGNO SEP-41)
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml

# Build sbt_reputation (Green Cashback + SBT)
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/sbt_reputation/Cargo.toml

# Rodar todos os testes
cargo test --manifest-path contracts/rwa_vault/Cargo.toml
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml
```

### Rodar o Frontend

```bash
npm run dev
# → http://localhost:3000
```

---

## 👥 Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silvicultor e empreendedor dedicado a madeiras nobres de alto valor desde o final dos anos 90. Embaixador da Rede Stellar no Brasil/Ceará. Builder do tech-stack Green RWA e nó estratégico no ABC+ Ceará impulsionando agricultura de baixo carbono e bioeconomia.
[LinkedIn](https://www.linkedin.com/in/g0vermind/))

**Vinicius Brás Rocha** · `Arquiteto ReFi`
Explorador glocal P2P e netweaver focado em co-criar uma cibercultura regenerativa no Web3 através do ReRe (Regenerative Resources). Hacker whitehat com raízes no movimento cypherpunk dos anos 90 e no ecossistema pré-lançamento do Bitcoin.
[LinkedIn](https://www.linkedin.com/in/vrselfmedia/)

**Clarkson Luiz Buriche** · `Dev Ambiental & IA`
Desenvolvedor focado em impacto e engenheiro ambiental sênior com sólida bagagem em ESG e gestão territorial. Especialista em traduzir complexidade socioambiental em sistemas digitais escaláveis. Arquiteto Rust e IA para regeneração climática e governança de recursos naturais.
[LinkedIn](https://www.linkedin.com/in/clarkson-luiz-buriche-bartalini-80446a6b/)

**Iara Magalhães** · `Web3 Developer`
Desenvolvedora Web3 e entusiasta de blockchain dominando Rust e sistemas descentralizados. Exploradora de arquiteturas seguras de smart contracts no ecossistema Soroban e contribuidora do desenvolvimento técnico do Social Forest.
[LinkedIn](https://www.linkedin.com/in/iaiakedemy)

---

## ⚖️ Advisors — Council of Guardians

**Francisco das Chagas Rosa** · `Consultor Agronômico`
Engenheiro agrônomo e consultor técnico sênior em silvicultura tropical. Especialista no manejo de alta performance de Mogno Africano e restauração florestal. Ponte entre a complexidade biológica e a validação de dados agronômicos para o oráculo PoF.

**Patricia Lemos** · `Consultora Jurídica`
Formada em Direito pela UNICAP. Arquiteta jurídica Web3 especializada em direito ambiental e conformidade regulatória. Estrategista em jurisprudência de ativos florestais e legislação de espécies exóticas isentas de DOF. Guardiã da estrutura legal do protocolo, unindo o direito tradicional às finanças programáveis descentralizadas.

---

## 🗺️ Roadmap

| Fase | Status | Marcos |
| :--- | :---: | :--- |
| **Fase 1 — Seed** | 🔨 Construindo | `rwa_vault` + `sbt_reputation` na Testnet · Integração Stripe MPP · Primeiro registro PoF · Piloto B2B |
| **Fase 2 — Crescimento** | 🔜 Planejado | Oráculo IA Vision na Mainnet · Ativação do Cashback Verde · Missões de Florescimento · Tokens SBT de governança |
| **Fase 3 — Escala** | 🔜 Planejado | Marketplace secundário MOGNO · Integração institucional completa · Exportação pelo Porto do Pecém · Transição para DAO |

---

## 📜 Licença

[Apache 2.0](./LICENSE) — Social Forest Protocol

---

<div align="center">

**Social Forest Protocol**
*Convertendo Florescimento Ecológico em Prosperidade Programável na Stellar.*

`rwa_vault` · `sbt_reputation` · `SEP-41` · `Soroban` · `x402` · `PoF`

</div>
