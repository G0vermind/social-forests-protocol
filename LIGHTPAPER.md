# 🌳 LIGHTPAPER: Social Forest Protocol
**Bridging Biological Assets and Programmable Liquidity on Stellar**

> 🇧🇷 [Versão em Português abaixo](#-lightpaper-social-forest-protocol-1)

> 💻 **Developers & Technical Auditors:** To explore our monorepo architecture and Soroban smart contracts, please refer to the [Technical README](./README.md).

---

## 1. Executive Summary

**Social Forest Protocol** is a decentralized infrastructure layer built for the **Climate Finance** market. By tokenizing high-value biological assets — specifically African Mahogany (*Khaya senegalensis*) cultivated in the Brazilian semi-arid region — the protocol dismantles the historical barriers of illiquidity and opacity that have long prevented institutional capital from flowing into regenerative silviculture.

We are not building another carbon credit marketplace. We are building the **financial rails** for a new asset class: living, growing, verifiable biological capital — anchored on the Stellar network and auditable in real time.

---

## 2. Market Thesis: The Green Gold

African Mahogany is among the most valued hardwoods globally, commanding premium prices in European, North American, and Asian markets. In Ceará, Brazil, it presents a convergence of biological, legal, and logistical advantages that no other region can replicate at scale.

### Why African Mahogany. Why Now.

**Biological Yield**
Unlike volatile financial instruments, trees grow physically every single day. The protocol captures this "accruing biological yield" and converts it into verifiable, programmable on-chain collateral — a fundamentally new primitive in decentralized finance.

**Legal Velocity**
As an exotic species in Brazil, African Mahogany is exempt from the Document of Forest Origin (DOF), enabling accelerated legal and physical liquidation compared to native species. This dramatically compresses compliance friction for institutional buyers.

**Asset Scarcity & Inflation Hedge**
High-quality tropical hardwood is a finite resource with structurally increasing global demand. Its value is denominated in real-world scarcity, not speculative sentiment — making it one of the few RWA classes with genuine inflation-hedging properties.

**Strategic Location**
Operating within the **ABC+ (Low Carbon Agriculture)** framework in Ceará positions Social Forest at the intersection of Brazil's bioeconomy and the **Pecém Port** logistics corridor — a direct gateway for future tokenized timber exports to global markets.

---

## 3. The Problem We Solve

The global market for sustainable forestry is estimated at hundreds of billions of dollars. Yet institutional capital struggles to access it due to four systemic failures:

| Traditional Challenge | Root Cause | Social Forest Solution |
| :--- | :--- | :--- |
| **Illiquidity** | 15–20 year harvest cycles with no secondary market | RWA fractionalization + secondary liquidity via Stellar AMMs |
| **Opaque Auditing** | Slow, manual, unverifiable reports | Proof of Flourishing (PoF): real-time AI + oracle validation |
| **Web3 Friction** | High technical barrier for corporate treasury entry | Stripe MPP: direct fiat-to-asset on-ramp for institutions |
| **Governance Capture** | Large holders dominate protocol decisions | Reputation SBTs: governance earned, not bought |

---

## 4. The Tech Engine: Proof of Flourishing (PoF)

At the heart of Social Forest is a simple but powerful principle: **active validation, not static recording**.

Traditional RWA protocols register an asset once and trust the issuer thereafter. We verify continuously.

### How PoF Works

**x402 Micropayment Protocol**
Every validation event is incentivized via x402 micropayments on Stellar. This creates a self-sustaining economic loop where validators — both AI oracles and human participants — are compensated for maintaining the integrity of the asset registry.

**AI Vision Layer**
Multispectral satellite and drone data is processed by our AI Vision system to confirm that each registered tree is alive, growing, and flourishing according to the protocol's biological benchmarks. This transforms subjective "ESG reporting" into objective, machine-verifiable proof.

**Soroban Smart Contracts (SEP-41)**
The `MOGNO` token is implemented as a fully compliant SEP-41 asset on Stellar's Soroban VM. The `admin_mint` function is gated behind the PoF oracle — tokens are only minted when flourishing is cryptographically proven, not claimed.

**Reputation SBTs (`sbt_reputation`)**
Protocol governance is not "bought" by whales. It is "earned" through non-transferable Soulbound Tokens awarded for mission completion, ecological stewardship, and validation history. One tree tended, one vote earned.

---

## 5. B2B2C Architecture: How the Economy Works

Social Forest is not a retail investment platform. It is a **B2B environmental services infrastructure** — corporations are the capital entry point, and consumers are the reputation and impact layer.

```
  ┌─────────────────────────────────┐
  │     ADMIN (Social Forest)       │
  │  Registers Verified Companies   │
  └────────────────┬────────────────┘
                   │ add_verified_company()
                   ▼
  ┌─────────────────────────────────┐
  │      B2B ANCHOR (Company)       │
  │  Buys MOGNO fractions in bulk   │
  │  for ESG balance sheets         │
  └────────────────┬────────────────┘
                   │ distribute_green_cashback()
                   ▼
  ┌─────────────────────────────────┐
  │      B2C USER (Consumer)        │
  │  Receives MOGNO micro-fraction  │
  │  + Impact Points (SBT)          │
  │  Non-transferable reputation    │
  └────────────────┬────────────────┘
                   │ get_user_impact()
                   ▼
  ┌─────────────────────────────────┐
  │    FRONTEND (Florestas.Social)  │
  │  Displays ecological score,     │
  │  Green Cashback history,        │
  │  Governance voice in DAO        │
  └─────────────────────────────────┘
```

**Capital flows in from B2B. Impact flows out to B2C. The planet is the beneficiary.**

---

## 6. Smart Contract Architecture

The protocol is built on two Soroban contracts that work together:

| Contract | File | Role |
| :--- | :--- | :--- |
| `rwa_vault` | `contracts/rwa_vault/lib.rs` | SEP-41 MOGNO token — mint, transfer, balance |
| `sbt_reputation` | `contracts/sbt_reputation/lib.rs` | Green Cashback distributor + non-transferable Impact Points |

### The MOGNO Token

| Property | Value |
| :--- | :--- |
| **Token Name** | Social Forest Mahogany RWA |
| **Symbol** | `MOGNO` |
| **Network** | Stellar (Soroban) |
| **Standard** | SEP-41 |
| **Decimals** | 7 |
| **Mint Authority** | PoF Oracle (`admin_mint`) |
| **Backing** | 1 fraction = verifiable share of standing African Mahogany biomass |

### The Reputation SBT

| Property | Behavior |
| :--- | :--- |
| **Type** | Soulbound — non-transferable by design |
| **Earned by** | Receiving Green Cashback from a Verified Company |
| **Unit** | Impact Points (same scale as MOGNO, 7 decimals) |
| **Transfer attempt** | `panic_with_error!(SoulboundNonTransferable)` |
| **Read by frontend** | `get_user_impact(user: Address) -> i128` |

---

## 7. Strategic & Legal Advantages

**Regulatory Clarity**
Full legal compliance is ensured through advisors specialized in Brazilian environmental jurisprudence (**UNICAP**), with a clear operational framework under the ABC+ Low Carbon Agriculture program.

**Logistics Infrastructure**
The **Pecém Port** (Ceará) provides direct access to Atlantic shipping lanes, positioning Social Forest for scalable tokenized timber exports as the protocol matures.

**Stellar Ecosystem Alignment**
Stellar's low-fee, high-throughput architecture and its established SEP standards make it the ideal settlement layer for an asset class where microtransactions, real-time validation, and institutional compliance must coexist.

---

## 8. Strategic Roadmap

### Phase 1 — Seed
- Deploy `rwa_vault` (SEP-41) and `sbt_reputation` contracts on Stellar Testnet
- Integrate Stripe MPP gateway for fiat on-ramp
- Register first cohort of trees in the PoF registry
- Onboard first B2B anchor partners (Verified Companies)

### Phase 2 — Growth
- Launch AI Vision oracle on Mainnet
- Activate Green Cashback distribution engine for B2C users
- Begin community-led "Flourishing Missions"
- Issue first SBT governance tokens to territory validators
- Expand Viveiro Maravilha nursery capacity

### Phase 3 — Scale
- Deploy secondary marketplace for `MOGNO` fractions (AMM integration)
- Full institutional onboarding pipeline
- Porto do Pecém export integration for tokenized timber
- Protocol DAO transition — governance by Impact Points

---

## 9. Why Stellar

Stellar was chosen not for speculation, but for infrastructure:

- **Sub-cent transaction fees** enable the x402 micropayment validation loop at scale — thousands of Green Cashback events per day without friction
- **SEP standards** provide institutional-grade compliance primitives out of the box — no custom compliance layer needed
- **Soroban** delivers the smart contract expressiveness required for cross-contract calls between `rwa_vault` and `sbt_reputation`
- **Anchors & AMMs** provide the liquidity rails for secondary `MOGNO` markets without building from scratch
- **Stellar.toml** enables transparent, machine-readable asset metadata for institutional due diligence

---

## 10. Closing Statement

The world's forests are collapsing not because we lack the will to protect them, but because we lack the financial infrastructure to make protecting them more profitable than destroying them.

**Social Forest Protocol is that infrastructure.**

Every `MOGNO` token minted is a tree verified to be alive and growing. Every Green Cashback distributed is a consumer who now has a direct, on-chain stake in a living ecosystem. Every Impact Point earned is governance that cannot be bought — only grown.

**We are not tokenizing trees. We are tokenizing the future of the planet — and making it liquid.**

---

**Social Forest Protocol**
*Leading the frontier of Real World Assets on Stellar.*

`contracts/rwa_vault` · `contracts/sbt_reputation` · `SEP-41` · `Soroban` · `x402` · `PoF`

---
---

# 🌳 LIGHTPAPER: Social Forest Protocol

**Conectando Ativos Biológicos à Liquidez Programável na Rede Stellar**

> 🇺🇸 [English version above](#-lightpaper-social-forest-protocol)

> 💻 **Desenvolvedores e Auditores Técnicos:** Para explorar a arquitetura do monorepo e os contratos Soroban, consulte o [README Técnico](./README.md).

---

## 1. Resumo Executivo

O **Social Forest Protocol** é uma camada de infraestrutura descentralizada construída para o mercado de **Finanças Climáticas**. Através da tokenização de ativos biológicos de alto valor — especificamente o Mogno Africano (*Khaya senegalensis*) cultivado no semiárido brasileiro — o protocolo derruba as barreiras históricas de iliquidez e opacidade que impedem o fluxo de capital institucional para a silvicultura regenerativa.

Não estamos construindo mais um marketplace de crédito de carbono. Estamos construindo os **trilhos financeiros** para uma nova classe de ativos: capital biológico vivo, em crescimento e verificável — ancorado na rede Stellar e auditável em tempo real.

---

## 2. Tese de Mercado: O Ouro Verde

O Mogno Africano está entre as madeiras nobres mais valorizadas do mundo, com preços premium em mercados europeus, norte-americanos e asiáticos. No Ceará, Brasil, ele apresenta uma convergência de vantagens biológicas, jurídicas e logísticas que nenhuma outra região consegue replicar em escala.

### Por que Mogno Africano. Por que agora.

**Yield Biológico**
Diferente de instrumentos financeiros voláteis, as árvores crescem fisicamente todos os dias. O protocolo captura esse "rendimento biológico acumulado" (*accruing biological yield*) e o converte em colateral *on-chain* verificável e programável — um primitivo fundamentalmente novo nas finanças descentralizadas.

**Velocidade Jurídica**
Como espécie exótica no Brasil, o Mogno Africano é isento do Documento de Origem Florestal (DOF), permitindo uma liquidação física e jurídica acelerada em relação às espécies nativas. Isso comprime drasticamente a fricção de compliance para compradores institucionais.

**Escassez de Ativos e Hedge contra Inflação**
Madeira tropical de alta qualidade é um recurso finito com demanda global estruturalmente crescente. Seu valor é denominado em escassez real, não em sentimento especulativo — tornando-o uma das poucas classes de RWA com propriedades genuínas de proteção contra a inflação.

**Localização Estratégica**
Operar dentro do framework **ABC+ (Agricultura de Baixo Carbono)** no Ceará posiciona o Social Forest na interseção da bioeconomia brasileira com o corredor logístico do **Porto do Pecém** — uma porta de entrada direta para futuras exportações de madeira tokenizada para os mercados globais.

---

## 3. O Problema que Resolvemos

O mercado global de silvicultura sustentável é estimado em centenas de bilhões de dólares. Ainda assim, o capital institucional luta para acessá-lo devido a quatro falhas sistêmicas:

| Desafio Tradicional | Causa Raiz | Solução Social Forest |
| :--- | :--- | :--- |
| **Iliquidez** | Ciclos de colheita de 15 a 20 anos sem mercado secundário | Fracionamento RWA + liquidez secundária via AMMs da Stellar |
| **Auditoria Opaca** | Relatórios lentos, manuais e inverificáveis | Proof of Flourishing (PoF): validação em tempo real com IA + oráculos |
| **Fricção Web3** | Alta barreira técnica para entrada de tesourarias corporativas | Stripe MPP: *on-ramp* direto de fiat para ativo para instituições |
| **Captura de Governança** | Grandes detentores dominam as decisões do protocolo | SBTs de reputação: governança conquistada, não comprada |

---

## 4. O Motor Tecnológico: Proof of Flourishing (PoF)

No coração do Social Forest está um princípio simples, mas poderoso: **validação ativa, não registro estático**.

Protocolos RWA tradicionais registram um ativo uma vez e confiam no emissor a partir daí. Nós verificamos continuamente.

### Como o PoF funciona

**Protocolo de Micropagamentos x402**
Cada evento de validação é incentivado via micropagamentos x402 na Stellar. Isso cria um ciclo econômico autossustentável onde os validadores — tanto oráculos de IA quanto participantes humanos — são recompensados por manter a integridade do registro de ativos.

**Camada de Visão por IA**
Dados de satélite multiespectral e drones são processados pelo nosso sistema de IA para confirmar que cada árvore registrada está viva, crescendo e florescendo conforme os benchmarks biológicos do protocolo. Isso transforma o subjetivo "relatório de ESG" em prova objetiva e verificável por máquina.

**Smart Contracts Soroban (SEP-41)**
O token `MOGNO` é implementado como um ativo SEP-41 totalmente compatível na VM Soroban da Stellar. A função `admin_mint` está restrita ao oráculo PoF — tokens são cunhados apenas quando o florescimento é criptograficamente provado, não apenas declarado.

**SBTs de Reputação (`sbt_reputation`)**
A governança do protocolo não é "comprada" por *whales*. É "conquistada" através de Soulbound Tokens não-transferíveis concedidos por conclusão de missões, gestão ecológica e histórico de validações. Uma árvore cuidada, um voto conquistado.

---

## 5. Arquitetura B2B2C: Como a Economia Funciona

O Florestas.Social não é uma plataforma de investimento para o varejo. É uma **infraestrutura B2B de serviços ambientais** — as empresas são o ponto de entrada de capital, e os consumidores são a camada de reputação e impacto.

```
  ┌─────────────────────────────────┐
  │    ADMIN (Social Forest)        │
  │  Cadastra Empresas Verificadas  │
  └────────────────┬────────────────┘
                   │ add_verified_company()
                   ▼
  ┌─────────────────────────────────┐
  │     ÂNCORA B2B (Empresa)        │
  │  Compra frações MOGNO em lote   │
  │  para balanços ESG              │
  └────────────────┬────────────────┘
                   │ distribute_green_cashback()
                   ▼
  ┌─────────────────────────────────┐
  │    USUÁRIO B2C (Consumidor)     │
  │  Recebe micro-fração MOGNO      │
  │  + Pontos de Impacto (SBT)      │
  │  Reputação não-transferível     │
  └────────────────┬────────────────┘
                   │ get_user_impact()
                   ▼
  ┌─────────────────────────────────┐
  │   FRONTEND (Florestas.Social)   │
  │  Exibe score ecológico,         │
  │  histórico de Cashback Verde,   │
  │  voz na governança do DAO       │
  └─────────────────────────────────┘
```

**O capital entra pelo B2B. O impacto chega ao B2C. O planeta é o beneficiário.**

---

## 6. Arquitetura de Smart Contracts

O protocolo é construído sobre dois contratos Soroban que trabalham juntos:

| Contrato | Arquivo | Função |
| :--- | :--- | :--- |
| `rwa_vault` | `contracts/rwa_vault/lib.rs` | Token MOGNO SEP-41 — mint, transfer, balance |
| `sbt_reputation` | `contracts/sbt_reputation/lib.rs` | Distribuidor de Cashback Verde + Pontos de Impacto não-transferíveis |

### O Token MOGNO

| Propriedade | Valor |
| :--- | :--- |
| **Nome do Token** | Social Forest Mahogany RWA |
| **Símbolo** | `MOGNO` |
| **Rede** | Stellar (Soroban) |
| **Padrão** | SEP-41 |
| **Decimais** | 7 |
| **Autoridade de Mint** | Oráculo PoF (`admin_mint`) |
| **Lastro** | 1 fração = participação verificável na biomassa de Mogno Africano em pé |

### O SBT de Reputação

| Propriedade | Comportamento |
| :--- | :--- |
| **Tipo** | Soulbound — não-transferível por design |
| **Conquistado por** | Receber Cashback Verde de uma Empresa Verificada |
| **Unidade** | Pontos de Impacto (mesma escala do MOGNO, 7 decimais) |
| **Tentativa de transferência** | `panic_with_error!(SoulboundNonTransferable)` |
| **Leitura pelo frontend** | `get_user_impact(user: Address) -> i128` |

---

## 7. Vantagens Estratégicas e Jurídicas

**Clareza Regulatória**
Conformidade jurídica total garantida por consultores especializados em jurisprudência ambiental brasileira (**UNICAP**), com framework operacional claro dentro do programa ABC+ de Agricultura de Baixo Carbono.

**Infraestrutura Logística**
O **Porto do Pecém** (Ceará) oferece acesso direto às rotas marítimas do Atlântico, posicionando o Social Forest para exportações escaláveis de madeira tokenizada à medida que o protocolo amadurece.

**Alinhamento com o Ecossistema Stellar**
A arquitetura de baixas taxas e alta capacidade da Stellar, combinada com seus padrões SEP estabelecidos, faz dela a camada de liquidação ideal para uma classe de ativos onde microtransações, validação em tempo real e conformidade institucional precisam coexistir.

---

## 8. Roadmap Estratégico

### Fase 1 — Seed
- Implantar `rwa_vault` (SEP-41) e `sbt_reputation` na Testnet da Stellar
- Integrar gateway Stripe MPP para *on-ramp* de fiat
- Registrar a primeira coorte de árvores no registro PoF
- Integrar primeiros parceiros âncora B2B (Empresas Verificadas)

### Fase 2 — Crescimento
- Lançar oráculo de Visão por IA na Mainnet
- Ativar o motor de distribuição de Cashback Verde para usuários B2C
- Iniciar "Missões de Florescimento" lideradas pela comunidade
- Emitir primeiros tokens SBT de governança para validadores de território
- Expandir capacidade do Viveiro Maravilha

### Fase 3 — Escala
- Implantar marketplace secundário para frações de `MOGNO` (integração AMM)
- Pipeline completo de integração institucional
- Integração de exportação pelo Porto do Pecém para madeira tokenizada
- Transição para DAO do protocolo — governança por Pontos de Impacto

---

## 9. Por que Stellar

A Stellar foi escolhida não por especulação, mas por infraestrutura:

- **Taxas abaixo de um centavo** viabilizam o loop de validação por micropagamentos x402 em escala — milhares de eventos de Cashback Verde por dia sem fricção
- **Padrões SEP** oferecem primitivos de conformidade de nível institucional prontos para uso — sem camada de compliance customizada
- **Soroban** entrega a expressividade de contratos inteligentes necessária para chamadas *cross-contract* entre `rwa_vault` e `sbt_reputation`
- **Âncoras e AMMs** fornecem os trilhos de liquidez para os mercados secundários de `MOGNO` sem construir do zero
- **Stellar.toml** permite metadados de ativos legíveis por máquina para *due diligence* institucional

---

## 10. Considerações Finais

As florestas do mundo estão desaparecendo não porque nos falta a vontade de protegê-las, mas porque nos falta a infraestrutura financeira para tornar a proteção mais lucrativa do que a destruição.

**O Social Forest Protocol é essa infraestrutura.**

Cada token `MOGNO` cunhado representa uma árvore verificada estar viva e crescendo. Cada Cashback Verde distribuído é um consumidor que agora tem uma participação direta, *on-chain*, em um ecossistema vivo. Cada Ponto de Impacto conquistado é governança que não pode ser comprada — apenas cultivada.

**Não estamos tokenizando árvores. Estamos tokenizando o futuro do planeta — e tornando-o líquido.**

---

**Social Forest Protocol**
*Liderando a fronteira de Real World Assets na Stellar.*

`contracts/rwa_vault` · `contracts/sbt_reputation` · `SEP-41` · `Soroban` · `x402` · `PoF`
