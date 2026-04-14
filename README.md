<div align="center">

# 🌳 Social Forest Protocol

**Decentralized Infrastructure for Green RWA & Climate Finance on Stellar**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg)](./LICENSE)
[![Network: Stellar Soroban](https://img.shields.io/badge/Network-Stellar%20Soroban-7B6FEE)](https://stellar.org)
[![Contracts: Rust](https://img.shields.io/badge/Contracts-Rust%20%2B%20Soroban-orange)](https://www.rust-lang.org/)
[![Standard: SEP-41](https://img.shields.io/badge/Standard-SEP--41-blue)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md)
[![Payments: x402 + MPP](https://img.shields.io/badge/Payments-x402%20%2B%20MPP-brightgreen)](https://developers.stellar.org/docs/build/agentic-payments)
[![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)

> 🇧🇷 [Versão em Português abaixo](#-social-forest-protocol-1)

</div>

---

Social Forest converts the **ecological flourishing** of African Mahogany (*Khaya senegalensis*) in the Brazilian semi-arid region into programmable on-chain collateral on the Stellar network — transforming trees into autonomous economic agents that generate environmental and financial dividends through multilateralism and ecological integrity.

Unlike static carbon credit models, Social Forest introduces **Proof of Flourishing (PoF)**: a dynamic, AI-audited proof of biome health that enables a circular **B2B2C** economy where every token minted is backed by a verified, living tree.

---

## 📄 Documentation

| Document | Description |
| :--- | :--- |
| [LIGHTPAPER.md](./LIGHTPAPER.md) | Climate Finance thesis, B2B2C strategy, token architecture |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Dev environment setup, branch workflow, code standards |
| [AGENTS.md](./AGENTS.md) | Instructions for AI agents (Antgravity) |
| [CLAUDE.md](./CLAUDE.md) | Context file for Claude |
| Whitepaper *(coming soon)* | Full Soroban contract architecture + x402/MPP integration spec |

---

## 🪙 Protocol Tokenomics

The ecosystem is built on the interaction of five digital assets:

| Token | Type | Role |
| :--- | :--- | :--- |
| **RWA** | Real World Asset | Represents land tenure + real tree fractions. Grants ownership and harvest profit rights. Backed by standing African Mahogany biomass. |
| **C-CRED** | Carbon Credit | Ex-post ecocredit issued based on verified real CO₂ capture. Follows rigorous scientific methodologies. Tradeable in the B2B DeFi settlement layer. |
| **S-CRED** | Stewardship (PSA) | Payment for Environmental Services token. Rewards continuous conservation and biodiversity stewardship — independent of carbon sequestration. |
| **C-DEBT** | Carbon Debt Ledger | On-chain audit registry for companies to declare and monitor their carbon footprints (Scopes 1, 2 and 3) and prove credit retirement toward Net Zero. |
| **$FLORA** | Governance | Utility token for protocol voting. Acts as Credit Class Admin — curating new areas, approving methodologies, and managing the authorized registry agent list. |

---

## 🏗️ Technical Architecture

### Smart Contracts — Soroban & Rust

Two contracts form the live protocol core:

**`contracts/rwa_vault/`** — SEP-41 RWA Token (`MOGNO`)
- Manages ecological growth rights and fractional RWA minting
- `admin_mint` gated behind the PoF oracle — tokens minted only when flourishing is cryptographically proven
- Full SEP-41: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`
- Storage: `instance()` for admin, `persistent()` for balances and allowances

**`contracts/sbt_reputation/`** — Green Cashback Engine + Soulbound Reputation
- `distribute_green_cashback(company, user, amount)` — Verified Companies push RWA fractions to consumers
- Impact Points are **non-transferable by design** — `transfer_reputation()` always panics (`SoulboundNonTransferable`)
- `get_user_impact(user) -> i128` — read endpoint consumed by the Next.js frontend
- Only admin-registered Verified Companies can trigger cashback (`require_auth`)

Additional contracts in roadmap: `governance/` (weighted $FLORA voting), `c_cred/` (ex-post carbon credit issuance), `c_debt/` (corporate carbon ledger), `amm_impact/` (non-speculative DeFi settlement).

---

### Proof of Flourishing Engine — x402 + MPP + AI Vision

The audit layer that replaces static "Proof of Growth" with continuous, machine-verifiable validation:

**AI Vision Layer**
Multispectral satellite and drone data processed to confirm each registered tree is alive and growing according to biological benchmarks. Objective, machine-verifiable ESG proof — not a self-reported claim.

**Regen Data Stream**
Physical growth data (DAP and height) collected by human monitors or IoT sensors, updated via AI/WhatsApp, anchored directly on-chain. Creates an immutable data flow that replaces bulky reports with verifiable streams.

**x402 Protocol** *(Coinbase Developer Platform)*
The official Stellar agentic payments protocol. Uses HTTP status `402 Payment Required` as a real payment negotiation layer. Every successful PoF validation triggers an economic event on Stellar — updating the RWA's intrinsic value on-chain. Founding coalition includes Google, Visa, AWS, Circle, Anthropic and Vercel.

**MPP — Machine Payments Protocol** *(Stripe / Stellar)*
Allows AI agents to pay for API services directly via HTTP, per request, without intermediaries. Works like a vending machine for digital services — the agent sends a request, pays the fee, and instantly receives data or service.

> Social Forest runs **both** official Stellar agentic payment protocols:
> `x402` (Coinbase) for validation event micropayments · `MPP` (Stripe) for institutional B2B on-ramp flows

**n8n Automation**
Orchestrates the oracle pipeline — triggers `admin_mint` on `rwa_vault` when PoF thresholds are met, and `distribute_green_cashback` on `sbt_reputation` when a B2B partner sale event fires.

**Channel Accounts**
Stellar channel accounts enable simultaneous transaction processing at scale — essential for high-frequency Green Cashback distribution events.

**UNEA-7 AI Alignment**
AI usage aligned with the UNEA-7 resolution for AI applied to environmental efficiency and biomass monitoring.

---

### Institutional On-ramp — Stripe MPP

Removing Web3 friction for corporate treasuries:

- **Fiat-to-Asset:** Companies acquire RWA fractions via BRL or USD corporate credit cards — no crypto custody required at entry
- **Automated Soroban Settlement:** Stripe Checkout approval triggers immediate `mint` and token transfer via Soroban contracts
- **KYB Automation:** Know Your Business compliance integrated into the RWA investment flow
- **Web2-Compatible Accounting:** Generates invoices and receipts finance departments already understand, while simultaneously feeding C-DEBT with on-chain data for high-integrity sustainability reporting
- **Audit Trail:** Payment proof linked to token issuance creates a financial audit trail that complements the Regen Data Stream ecological audit trail — enabling transparent **Greenshouting** (B Lab framework)

---

## 🌲 The B2B2C Model

Social Forest is **not a retail investment platform**. It is a B2B environmental services infrastructure.

```
  Admin (Social Forest)
    └─ registers Verified Companies + approves PoF thresholds
           │
           ▼
  B2B Anchor (Company)
    └─ buys RWA fractions in bulk via Stripe MPP (fiat)
       configures Green Cashback rules per SKU/service
       accesses ESG Analytics + Greenshouting dashboard
           │  distribute_green_cashback() via x402
           ▼
  B2C User (Consumer)
    └─ receives RWA micro-fraction + Impact Points (SBT)
       collects Leaves (Common / Rare / Legendary)
       forges real tree certificate when threshold reached
       participates in Mission Marketplace
           │  get_user_impact()
           ▼
  Frontend (Florestas.Social)
    └─ Digital Nursery · Impact History · SDG Dashboard
       governance voice in Green Treasury DAO ($FLORA)
```

**Capital flows in from B2B. Impact flows out to B2C. The planet is the beneficiary.**

---

## 🎮 B2B2C Platform — Engagement Engine

### Partner Dashboard (B2B View)

For SMEs, large retailers, and influencers — transforming partners into "sustainability agents":

- **RWA Lot Management:** Acquire tree fractions for distribution; set emission quantities freely
- **Green Cashback Rules:** Define how many "Leaves" each purchase or specific SKU generates
- **Mission Builder:** Self-service tool to create challenges (follow on Instagram, rate the service, buy item X) with automatic rewards
- **ESG Analytics:** Real-time impact reports ready for ethical marketing and compliance
- **Greenshouting Guide (B Lab):** Built-in tool to help brands communicate environmental goals with courage and verified evidence — combating Greenhushing

### Consumer Wallet (B2C View)

A gamified web app that hides Stellar blockchain complexity, focusing on a "digital cultivation" journey:

- **Digital Nursery:** Visual interface where users collect Common, Rare and Legendary Leaves on a progress branch
- **RWA Synthesis:** When the Leaf threshold is reached, the user triggers the smart contract to "forge" their real tree and receive the RWA certificate in their wallet
- **Mission Marketplace:** Tasks from multiple brands where users can "mine" forest assets through consumption or engagement
- **Impact History:** Detailed log of CO₂ sequestered and which SDGs the user is actively supporting

### SKU-Level Marketing Mechanics

- **SKU Missions:** Unique QR codes on physical packaging — impact attributed to the specific product the customer holds, not just the brand
- **Service Missions:** Validation after service delivery (consulting, freight, beauty) — incentivizing feedback and recurrence
- **Rarity Levels:** Legendary Leaves (limited editions or large purchases) accelerate harvest time or unlock future benefits

---

## 🏦 B2B DeFi — Non-Speculative Settlement Layer

A non-speculative DeFi environment on Soroban focused on real economy and climate integrity:

- **C-CRED Trading:** Companies that exceed sustainability targets can offer verified ex-post credits to the ecosystem
- **C-DEBT Settlement:** Organizations with carbon debts can acquire credits directly from B2B partners to "retire" their debt and reach Net Zero compliance
- **Non-Speculative Mechanism:** Exchange values driven by real forest restoration and maintenance costs (PSA), curated by the DAO via $FLORA to prevent artificial volatility
- **Impact AMM:** Liquidity pools on Stellar where the exchange "currency" is proven environmental impact — allowing SMEs to settle small carbon footprints quickly without intermediaries
- **Institutional Integration:** Connected directly to the Partner Dashboard — finance departments manage environmental assets as part of the corporate balance sheet

*Planned for Phase 3 — Systemic Evolution (2026)*

---

## 🗳️ Decentralized Governance — Social Forest DAO

The protocol adopts a DAO structure via the `$FLORA` governance token with progressive decentralization:

### Credit Class Administration
$FLORA holders vote on: admission of new farms and silviculture projects · approval of new planting methodologies · management of the authorized registry agent list

### Community Treasury
A micro-fee on C-DEBT settlement transactions and new RWA issuance feeds the DAO Treasury. The community decides fund allocation via on-chain proposals: frontier agricultural technology, regional nursery expansion, retail adoption incentives.

### Buffer Pool Management
- **Reserve Buffer Pool:** Reserves credits that cannot be sold to guarantee environmental solvency against unintentional reversals (climate events, tree loss)
- **Permanence Reversal Buffer:** Dedicated account ensuring long-term carbon permanence as required by international standards

### Progressive Decentralization
Early phases: Core Team + Advisory Council hold protocol control for rapid `x402` and Soroban contract deployment. As TVL grows and partner base solidifies, voting power transfers progressively and securely to the community.

---

## 🌍 SDG Alignment

| SDG | Contribution |
| :--- | :--- |
| **1 & 2** | Rural income diversification (intercropped beekeeping); food security |
| **5** | Gender equality in asset management; women-led nursery teams; autonomous rural digital wallets (Stellar) |
| **6** | Ecosystem restoration protecting watersheds |
| **8** | Decent work in inland Ceará; DeFi infrastructure innovation |
| **9** | Digitization of natural assets; open NbS infrastructure |
| **10** | Stellar enables vulnerable populations to access global markets without traditional financial intermediaries |
| **12** | Green Cashback model; responsible consumption and production |
| **13** | Carbon sequestration; Paris Agreement + Kunming-Montreal alignment |
| **15** | Forest management and biodiversity protection |
| **16 & 17** | DAO governance; global B2B2C partnerships; Agenda 2030 implementation |

*Aligned with GEO-7 (environmental action can generate trillions in additional global GDP), UNEA-7, and the Adaptation Gap Report (up to USD 365 billion/year needed for developing nations).*

---

## 🤖 Stellar AI Ecosystem Integration

Social Forest is built to integrate natively with Stellar's emerging AI infrastructure:

**Stella** — AI assistant for developers navigating Stellar documentation and Soroban smart contracts. Available on [developers.stellar.org](https://developers.stellar.org) and the `#stella-help` Discord channel.

**Contract Copilot** — Streamlines Soroban contract creation via boilerplate generation, security linting, and unified testing.

**x402** *(Coinbase Developer Platform)* — Agentic payments protocol activating HTTP `402 Payment Required` as a real payment mechanism. Founding coalition: Google, Visa, AWS, Circle, Anthropic, Vercel. [Docs](https://developers.stellar.org/docs/build/agentic-payments)

**MPP** *(Stripe / Stellar)* — Machine Payments Protocol for AI agent API payments per request, without intermediaries. [Docs](https://developers.stellar.org/docs/build/agentic-payments)

---

## 📁 Repository Structure

```
social-forests-protocol/
│
├── contracts/                  # Rust workspace — Soroban smart contracts
│   ├── rwa_vault/              # SEP-41 RWA token (mint, transfer, balance)
│   ├── sbt_reputation/         # Green Cashback engine + non-transferable SBT
│   ├── governance/             # $FLORA weighted voting via PoF + Impact Points
│   ├── c_cred/                 # Ex-post carbon credit issuance (roadmap)
│   ├── c_debt/                 # Corporate carbon audit ledger (roadmap)
│   └── amm_impact/             # Non-speculative DeFi settlement AMM (roadmap)
│
├── src/                        # Next.js frontend (Florestas.Social)
│   └── app/                    # B2B2C dashboard + B2B corporate panel
│
├── services/                   # Backend integrations
│   ├── stripe_gateway/         # Stripe MPP fiat on-ramp
│   └── pof_oracle/             # AI Vision + x402/MPP PoF engine (n8n)
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

```bash
# Prerequisites
rustup target add wasm32-unknown-unknown
cargo install stellar-cli

# Clone & install
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol && npm install

# Build contracts
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/sbt_reputation/Cargo.toml

# Test
cargo test --manifest-path contracts/rwa_vault/Cargo.toml
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml

# Frontend
npm run dev   # → http://localhost:3000
```

---

## 🗺️ Roadmap

| Phase | Status | Milestones |
| :--- | :---: | :--- |
| **Phase 1 — Seed** | 🔨 Building | `rwa_vault` + `sbt_reputation` on Testnet · Stripe MPP · First PoF registry · B2B pilot · Viveiro Maravilha "Client Zero" |
| **Phase 2 — Growth** | 🔜 Planned | AI Vision oracle on Mainnet · Green Cashback activation · Flourishing Missions · $FLORA SBT governance · Sómogno integration |
| **Phase 3 — Scale** | 🔜 Planned | `c_cred` + `c_debt` + `amm_impact` contracts · Secondary RWA marketplace · DAO transition · Pecém Port export · Full institutional onboarding |

---

## 👥 Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silviculturist and entrepreneur in high-value hardwoods since the late 90s. Stellar Network Ambassador for Brazil/Ceará. Builder of the Green RWA tech-stack and strategic node within the ABC+ Ceará low-carbon agriculture and bioeconomy ecosystem.
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
Law degree from UNICAP. Web3 legal architect specialized in environmental law and regulatory compliance. Strategist in forest asset jurisprudence and DOF-exempt exotic species legislation. Guardian of the protocol's legal framework bridging legacy law to programmable decentralized finance.

---

## 📜 License

[Apache 2.0](./LICENSE) — Social Forest Protocol

---

<div align="center">

**Social Forest Protocol**
*Converting Ecological Flourishing into Programmable Prosperity on Stellar.*

`rwa_vault` · `sbt_reputation` · `$FLORA` · `C-CRED` · `C-DEBT` · `S-CRED`
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `Regen Data Stream`

</div>

---
---

<div align="center">

# 🌳 Social Forest Protocol

**Infraestrutura Descentralizada para Green RWA & Finanças Climáticas na Stellar**

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-green.svg)](./LICENSE)
[![Rede: Stellar Soroban](https://img.shields.io/badge/Rede-Stellar%20Soroban-7B6FEE)](https://stellar.org)
[![Contratos: Rust](https://img.shields.io/badge/Contratos-Rust%20%2B%20Soroban-orange)](https://www.rust-lang.org/)
[![Padrão: SEP-41](https://img.shields.io/badge/Padr%C3%A3o-SEP--41-blue)](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md)
[![Pagamentos: x402 + MPP](https://img.shields.io/badge/Pagamentos-x402%20%2B%20MPP-brightgreen)](https://developers.stellar.org/docs/build/agentic-payments)
[![Frontend: Next.js](https://img.shields.io/badge/Frontend-Next.js-black)](https://nextjs.org/)

> 🇺🇸 [English version above](#-social-forest-protocol)

</div>

---

O Social Forest converte o **florescimento ecológico** do Mogno Africano (*Khaya senegalensis*) no semiárido brasileiro em colateral programável *on-chain* na rede Stellar — transformando árvores em agentes econômicos autônomos que geram dividendos ambientais e financeiros através do multilateralismo e da integridade ecológica.

Diferente de modelos de créditos de carbono estáticos, o Social Forest introduz o **Proof of Flourishing (PoF)**: uma prova dinâmica de saúde biômica auditada por IA que viabiliza uma economia circular **B2B2C** onde cada token cunhado é lastreado por uma árvore viva e verificada.

---

## 📄 Documentação

| Documento | Descrição |
| :--- | :--- |
| [LIGHTPAPER.md](./LIGHTPAPER.md) | Tese de Finanças Climáticas, estratégia B2B2C, arquitetura de tokens |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Configuração do ambiente, fluxo de branches, padrões de código |
| [AGENTS.md](./AGENTS.md) | Instruções para agentes de IA (Antgravity) |
| [CLAUDE.md](./CLAUDE.md) | Arquivo de contexto para o Claude |
| Whitepaper *(em breve)* | Arquitetura completa dos contratos Soroban + spec de integração x402/MPP |

---

## 🪙 Tokenomics do Protocolo

O ecossistema é construído sobre a interação de cinco ativos digitais:

| Token | Tipo | Função |
| :--- | :--- | :--- |
| **RWA** | Ativo do Mundo Real | Representa posse da terra (*land tenure*) + frações de árvores reais. Garante propriedade e direito ao lucro da colheita. Lastreado em biomassa de Mogno Africano em pé. |
| **C-CRED** | Crédito de Carbono | Ecocrédito *ex-post* emitido com base na captura real de CO₂ verificada. Segue metodologias científicas rigorosas. Negociável na camada DeFi B2B. |
| **S-CRED** | Stewardship (PSA) | Token de Pagamento por Serviços Ambientais. Recompensa a conservação e manutenção da biodiversidade — independente do sequestro de carbono. |
| **C-DEBT** | Ledger de Débito de Carbono | Registro de auditoria *on-chain* para empresas declararem e monitorarem pegadas de carbono (Escopos 1, 2 e 3) e comprovarem a "aposentadoria" de créditos rumo ao Net Zero. |
| **$FLORA** | Governança | Token de utilidade para votação no protocolo. Atua como *Credit Class Admin* — curando novas áreas, aprovando metodologias e gerindo a lista de agentes de registro autorizados. |

---

## 🏗️ Arquitetura Técnica

### Smart Contracts — Soroban & Rust

Dois contratos formam o núcleo ativo do protocolo:

**`contracts/rwa_vault/`** — Token RWA SEP-41 (`MOGNO`)
- Gerencia direitos sobre o crescimento ecológico e a cunhagem fracionada de RWA
- `admin_mint` restrito ao oráculo PoF — tokens cunhados apenas quando o florescimento é criptograficamente provado
- SEP-41 completo: `transfer`, `transfer_from`, `approve`, `allowance`, `balance`
- Storage: `instance()` para admin, `persistent()` para balances e allowances

**`contracts/sbt_reputation/`** — Motor de Green Cashback + SBT de Reputação
- `distribute_green_cashback(company, user, amount)` — Empresas Verificadas enviam frações de RWA a consumidores
- Pontos de Impacto **não-transferíveis por design** — `transfer_reputation()` sempre falha (`SoulboundNonTransferable`)
- `get_user_impact(user) -> i128` — endpoint de leitura consumido pelo frontend Next.js
- Apenas Empresas Verificadas cadastradas pelo admin podem disparar cashback (`require_auth`)

Contratos adicionais no roadmap: `governance/` (votação $FLORA ponderada), `c_cred/` (emissão de crédito de carbono ex-post), `c_debt/` (ledger de carbono corporativo), `amm_impact/` (liquidação DeFi não-especulativa).

---

### Motor Proof of Flourishing — x402 + MPP + IA Vision

A camada de auditoria que substitui o estático "Proof of Growth" por verificação contínua e verificável por máquina:

**Camada de Visão por IA**
Dados de satélite multiespectral e drones processados para confirmar que cada árvore registrada está viva e crescendo conforme os benchmarks biológicos do protocolo. Prova ESG objetiva — não uma declaração autorreportada.

**Regen Data Stream**
Dados físicos de crescimento (DAP e altura) coletados por monitores humanos ou sensores IoT, atualizados via IA/WhatsApp, ancorados diretamente *on-chain*. Cria um fluxo de dados imutável que substitui relatórios volumosos por streams verificáveis.

**Protocolo x402** *(Coinbase Developer Platform)*
O protocolo oficial de pagamentos agênticos da Stellar. Usa o status HTTP `402 Payment Required` como camada real de negociação de pagamento. Cada validação PoF bem-sucedida dispara um evento econômico na Stellar — atualizando o valor intrínseco do RWA *on-chain*. Coalizão fundadora: Google, Visa, AWS, Circle, Anthropic e Vercel.

**MPP — Machine Payments Protocol** *(Stripe / Stellar)*
Permite que agentes de IA paguem por serviços de API diretamente via HTTP, por requisição, sem intermediários. Funciona como uma máquina de venda automática para serviços digitais.

> O Social Forest opera **os dois** protocolos oficiais de pagamentos agênticos da Stellar:
> `x402` (Coinbase) para micropagamentos de eventos de validação · `MPP` (Stripe) para fluxos de *on-ramp* B2B institucional

**Automação n8n**
Orquestra o pipeline do oráculo — dispara `admin_mint` no `rwa_vault` quando limiares de PoF são atingidos, e `distribute_green_cashback` no `sbt_reputation` quando um evento de venda de parceiro B2B é acionado.

**Contas de Canal**
Contas de canal Stellar permitem processamento de transações simultâneas em escala — essencial para eventos de distribuição de Green Cashback de alta frequência.

**Alinhamento UNEA-7**
Uso de IA alinhado com a resolução da UNEA-7 para eficiência ambiental e monitoramento de biomassa.

---

### On-ramp Institucional — Stripe MPP

Removendo a fricção Web3 para tesourarias corporativas:

- **Fiat-to-Asset:** Empresas adquirem frações RWA via BRL ou USD com cartão corporativo — sem custódia cripto na entrada
- **Liquidação Automatizada Soroban:** Aprovação no Stripe Checkout dispara `mint` imediato e transferência de tokens via contratos Soroban
- **Automação KYB:** Compliance *Know Your Business* integrado ao fluxo de investimento em RWA
- **Contabilidade Web2-Compatível:** Gera faturas e comprovantes que os departamentos contábeis já conhecem, enquanto alimenta o C-DEBT com dados *on-chain* para relatórios de sustentabilidade de alta integridade
- **Trilha de Auditoria:** Prova de pagamento vinculada à emissão do token cria uma trilha de auditoria financeira que complementa o Regen Data Stream — viabilizando **Greenshouting** transparente (framework B Lab)

---

## 🌲 O Modelo B2B2C

O Florestas.Social **não é uma plataforma de investimento para o varejo**. É uma infraestrutura B2B de serviços ambientais.

```
  Admin (Social Forest)
    └─ cadastra Empresas Verificadas + aprova limiares PoF
           │
           ▼
  Âncora B2B (Empresa)
    └─ compra frações RWA em lote via Stripe MPP (fiat)
       configura regras de Cashback Verde por SKU/serviço
       acessa Analytics ESG + dashboard Greenshouting
           │  distribute_green_cashback() via x402
           ▼
  Usuário B2C (Consumidor)
    └─ recebe micro-fração RWA + Pontos de Impacto (SBT)
       coleciona Folhas (Comuns / Raras / Lendárias)
       forja certificado de árvore real ao atingir a meta
       participa do Marketplace de Missões
           │  get_user_impact()
           ▼
  Frontend (Florestas.Social)
    └─ Viveiro Digital · Histórico de Impacto · Dashboard ODS
       voz na governança da Tesouraria Verde DAO ($FLORA)
```

**O capital entra pelo B2B. O impacto chega ao B2C. O planeta é o beneficiário.**

---

## 🎮 Plataforma B2B2C — Motor de Engajamento

### Dashboard do Parceiro (Visão B2B)

Para PMEs, grandes varejistas e influenciadores — transformando parceiros em "agentes de sustentabilidade":

- **Gestão de Lotes RWA:** Adquire frações de árvores para distribuição; define quantitativos livremente
- **Regras de Cashback Verde:** Define quantas "Folhas" cada compra ou SKU específico gera
- **Criador de Missões:** Ferramenta *self-service* para criar desafios (siga no Instagram, avalie o serviço, compre o item X) com recompensas automáticas
- **Analytics ESG:** Relatórios de impacto em tempo real prontos para marketing ético e compliance
- **Guia de Greenshouting (B Lab):** Ferramenta integrada para ajudar marcas a comunicar metas ambientais com coragem e evidências verificáveis — combatendo o *Greenhushing*

### Carteira do Consumidor (Visão B2C)

Um web app gamificado que oculta a complexidade da blockchain Stellar, focando na jornada de "cultivo digital":

- **Viveiro Digital:** Interface visual onde o usuário coleciona Folhas Comuns, Raras e Lendárias em um galho de progresso
- **Síntese do RWA:** Ao atingir a meta de Folhas, o usuário aciona o contrato inteligente para "forjar" sua árvore real e receber o certificado RWA na carteira
- **Marketplace de Missões:** Tarefas de múltiplas marcas onde o usuário pode "minerar" ativos florestais por consumo ou engajamento
- **Histórico de Impacto:** Extrato detalhado de CO₂ sequestrado e quais ODS o usuário está apoiando ativamente

### Mecânica de Gamificação por SKU

- **Missões por Produto (SKU):** QR Codes únicos em embalagens físicas — impacto atribuído ao produto específico, não apenas à marca
- **Missões por Serviço:** Validação pós-prestação de serviços (consultorias, fretes, beleza) — incentivando feedback e recorrência
- **Níveis de Raridade:** Folhas Lendárias (edições limitadas ou grandes compras) aceleram o tempo de colheita ou desbloqueiam benefícios futuros

---

## 🏦 DeFi B2B — Camada de Liquidação Não-Especulativa

Ambiente DeFi em Soroban focado na economia real e na integridade climática:

- **Negociação de C-CRED:** Empresas que superam metas de sustentabilidade disponibilizam créditos verificados *ex-post* para o ecossistema
- **Liquidação de C-DEBT:** Organizações com débitos de carbono adquirem créditos diretamente de parceiros B2B para "aposentar" a dívida e atingir conformidade Net Zero
- **Mecanismo Não-Especulativo:** Valores orientados pelo custo real de restauração florestal (PSA), com curadoria da DAO via $FLORA para evitar volatilidade artificial
- **AMM de Impacto:** Pools de liquidez na Stellar onde a "moeda" de troca é o impacto ambiental comprovado — permite que PMEs liquidem pequenas pegadas de carbono de forma ágil e sem intermediários
- **Integração Institucional:** Conectado diretamente ao Dashboard do Parceiro — departamentos financeiros gerenciam ativos ambientais como parte do balanço patrimonial

*Previsto para a Fase 3 — Evolução Sistêmica (2026)*

---

## 🗳️ Governança Descentralizada — Social Forest DAO

O protocolo adota estrutura DAO via token de governança `$FLORA` com descentralização progressiva:

### Administração de Classe de Crédito
Detentores de $FLORA votam em: admissão de novas fazendas e projetos de silvicultura · aprovação de novas metodologias de plantio · gestão da lista de agentes de registro autorizados

### Tesouraria Comunitária
Microtaxa sobre transações de liquidação C-DEBT e emissão de novos RWAs alimenta a Tesouraria da DAO. A comunidade decide a alocação via propostas *on-chain*: tecnologia de ponta para o agronegócio sustentável, expansão de viveiros regionais, incentivos à adoção pelo varejo.

### Gestão de Buffer Pools
- **Buffer Pool de Reserva:** Reserva créditos que não podem ser vendidos para garantir a solvência ambiental do protocolo em reversões climáticas não intencionais
- **Permanence Reversal Buffer:** Conta dedicada para garantir a permanência do carbono sequestrado por períodos de longo prazo conforme exigido pelos padrões internacionais

### Descentralização Progressiva
Fases iniciais: Core Team + Conselho Consultivo mantêm o controle do protocolo para implantação rápida do x402 e dos contratos Soroban. À medida que o TVL cresce e a base de parceiros se solidifica, o poder de voto é transferido progressiva e seguramente para a comunidade.

---

## 🌍 Alinhamento com os ODS

| ODS | Contribuição |
| :--- | :--- |
| **1 e 2** | Diversificação de renda no campo (apicultura consorciada); segurança alimentar |
| **5** | Igualdade de gênero na gestão de ativos; equipes femininas nos viveiros; carteiras digitais autônomas para mulheres rurais (Stellar) |
| **6** | Restauração de ecossistemas protegendo bacias hidrográficas |
| **8** | Trabalho decente no interior do Ceará; inovação em infraestrutura DeFi |
| **9** | Digitalização de ativos naturais; infraestrutura NbS aberta |
| **10** | Tecnologia Stellar permite populações vulneráveis acessarem mercados globais sem intermediários financeiros tradicionais |
| **12** | Modelo Cashback Verde; consumo e produção responsáveis |
| **13** | Sequestro de carbono; alinhamento com o Acordo de Paris + Marco de Kunming-Montreal |
| **15** | Manejo florestal e proteção da biodiversidade |
| **16 e 17** | Governança DAO; parcerias B2B2C globais; implementação da Agenda 2030 |

*Alinhado com GEO-7, UNEA-7 e o Relatório sobre a Lacuna de Adaptação (até USD 365 bilhões/ano necessários para nações em desenvolvimento).*

---

## 🤖 Integração com o Ecossistema de IA da Stellar

O Social Forest é construído para integração nativa com a infraestrutura de IA emergente da Stellar:

**Stella** — Assistente de IA para desenvolvedores navegando na documentação Stellar e contratos Soroban. Disponível em [developers.stellar.org](https://developers.stellar.org) e no canal `#stella-help` do Discord da Stellar.

**Contract Copilot** — Agiliza a criação de contratos Soroban via geração de boilerplate, linting de segurança e testes unificados.

**x402** *(Coinbase Developer Platform)* — Protocolo de pagamentos agênticos que ativa o HTTP `402 Payment Required` como mecanismo real de pagamento. Coalizão fundadora: Google, Visa, AWS, Circle, Anthropic, Vercel. [Docs](https://developers.stellar.org/docs/build/agentic-payments)

**MPP** *(Stripe / Stellar)* — Machine Payments Protocol para pagamentos de agentes de IA por requisição, sem intermediários. [Docs](https://developers.stellar.org/docs/build/agentic-payments)

---

## 📁 Estrutura do Repositório

```
social-forests-protocol/
│
├── contracts/                  # Workspace Rust — contratos Soroban
│   ├── rwa_vault/              # Token RWA SEP-41 (mint, transfer, balance)
│   ├── sbt_reputation/         # Motor Green Cashback + SBT não-transferível
│   ├── governance/             # Votação $FLORA ponderada por PoF + Pontos de Impacto
│   ├── c_cred/                 # Emissão de crédito de carbono ex-post (roadmap)
│   ├── c_debt/                 # Ledger de auditoria de carbono corporativo (roadmap)
│   └── amm_impact/             # AMM de liquidação DeFi não-especulativa (roadmap)
│
├── src/                        # Frontend Next.js (Florestas.Social)
│   └── app/                    # Dashboard B2B2C + painel corporativo B2B
│
├── services/                   # Integrações de back-end
│   ├── stripe_gateway/         # On-ramp fiat via Stripe MPP
│   └── pof_oracle/             # IA Vision + motor PoF x402/MPP (n8n)
│
├── public/                     # Assets estáticos
├── .well-known/                # stellar.toml — definição de ativos e metadados
│
├── AGENTS.md                   # Instruções para agentes de IA (Antgravity)
├── CLAUDE.md                   # Arquivo de contexto para o Claude
├── CONTRIBUTING.md             # Setup, workflow, padrões de código
├── LIGHTPAPER.md               # Visão, estratégia, tokenomics
└── README.md
```

---

## ⚡ Início Rápido

```bash
# Pré-requisitos
rustup target add wasm32-unknown-unknown
cargo install stellar-cli

# Clone e instalação
git clone https://github.com/G0vermind/social-forests-protocol.git
cd social-forests-protocol && npm install

# Build dos contratos
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/rwa_vault/Cargo.toml
cargo build --target wasm32-unknown-unknown --release \
  --manifest-path contracts/sbt_reputation/Cargo.toml

# Testes
cargo test --manifest-path contracts/rwa_vault/Cargo.toml
cargo test --manifest-path contracts/sbt_reputation/Cargo.toml

# Frontend
npm run dev   # → http://localhost:3000
```

---

## 🗺️ Roadmap

| Fase | Status | Marcos |
| :--- | :---: | :--- |
| **Fase 1 — Seed** | 🔨 Construindo | `rwa_vault` + `sbt_reputation` na Testnet · Stripe MPP · Primeiro registro PoF · Piloto B2B · Viveiro Maravilha "Cliente Zero" |
| **Fase 2 — Crescimento** | 🔜 Planejado | Oráculo IA Vision na Mainnet · Ativação do Cashback Verde · Missões de Florescimento · Tokens SBT de governança $FLORA · Integração Sómogno |
| **Fase 3 — Escala** | 🔜 Planejado | Contratos `c_cred` + `c_debt` + `amm_impact` · Marketplace secundário RWA · Transição para DAO · Exportação pelo Porto do Pecém · Integração institucional completa |

---

## 👥 Core Team — The Netweavers

**Gustavo Gonçalves** · `Founder & Tech Lead`
Silvicultor e empreendedor dedicado a madeiras nobres de alto valor desde o final dos anos 90. Embaixador da Rede Stellar no Brasil/Ceará. Builder do tech-stack Green RWA e nó estratégico no ABC+ Ceará impulsionando agricultura de baixo carbono e bioeconomia.
[LinkedIn](https://www.linkedin.com/in/gustavo-gonçalves-9a4a1523/)

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

## 📜 Licença

[Apache 2.0](./LICENSE) — Social Forest Protocol

---

<div align="center">

**Social Forest Protocol**
*Convertendo Florescimento Ecológico em Prosperidade Programável na Stellar.*

`rwa_vault` · `sbt_reputation` · `$FLORA` · `C-CRED` · `C-DEBT` · `S-CRED`
`SEP-41` · `Soroban` · `x402` · `MPP` · `PoF` · `Regen Data Stream`

</div>
