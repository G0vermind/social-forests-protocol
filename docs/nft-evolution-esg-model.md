# Social Forest Protocol — Modelo de Evolução NFT RWA & Registro ESG

> **Versão:** 3.0 | **Contrato:** `hero_journey` | **Rede:** Stellar / Soroban  
> **Token RWA:** MOGNO (SEP-41, 7 decimais) | **Certificação:** Vereda.Verify

---

## 1. O Princípio das Duas Camadas

A inovação central do protocolo é separar **o que o usuário faz** do **que a natureza faz**:

```
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 1 — Gamificação (compromisso do usuário)                │
│                                                                 │
│  Plantador → Cultivador → Guardiao → Protetor → Lenda          │
│                                                                 │
│  • Reflete o esforço em Folhas queimadas pelo USUÁRIO           │
│  • Custo exponencial: 150 / 300 / 600 / 1.000 Folhas           │
│  • O usuário decide quando e se evolui                          │
│  • Evolução é voluntária — não automática                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 2 — Dados Oraculares (crescimento real da árvore)       │
│                                                                 │
│  TreeAnnualRecord { nft_id, year, height_cm, carbon_kg, ... }  │
│                                                                 │
│  • Atualizado pelo Oráculo ano a ano                            │
│  • A árvore cresce independentemente — 10 a 12 anos             │
│  • Cada NFT tem histórico próprio e auditável                   │
│  • Nenhum usuário precisa fazer nada — a natureza trabalha      │
└─────────────────────────────────────────────────────────────────┘
```

**Exemplo concreto:** Um usuário com **10 NFTs Plantador** comprados em 2024 terá, em 2034:
- 10 NFTs ainda no nível Plantador (se não quiser evoluir gamisticamente)
- 10 registros anuais por NFT (100 entradas históricas on-chain)
- Cada árvore com dados reais: altura, carbono sequestrado, saúde
- Fração MOGNO acumulada correspondente ao crescimento real do ativo

---

## 2. Camada 1 — Níveis de Comprometimento do Usuário

### 2.1 Tabela de Evolução

| Nível | Nome | Custo do Nível | Total Acumulado | Fração MOGNO | Significado |
|:---:|---|---:|---:|---|---|
| 0 | **Plantador** | 100 (forja) | **100** | 0,001 MOGNO | Primeiro compromisso com o protocolo |
| 1 | **Cultivador** | 150 | **250** | 0,005 MOGNO | Aprofundou o engajamento |
| 2 | **Guardiao** | 300 | **550** | 0,010 MOGNO | Pilar da comunidade de impacto |
| 3 | **Protetor** | 600 | **1.150** | 0,050 MOGNO | Liderança comunitária regional |
| 4 | **Lenda** | 1.000 | **2.150** | 0,100 MOGNO | Referência máxima — heavy badges B2B |

### 2.2 Diagrama de Progressão RPG

```
  100 Folhas          150 Folhas        300 Folhas        600 Folhas       1.000 Folhas
  [FORJA]             [FUSÃO 1]         [FUSÃO 2]         [FUSÃO 3]     [GRANDE ASCENSÃO]
     │                    │                 │                 │                 │
     ▼                    ▼                 ▼                 ▼                 ▼
 PLANTADOR ──────▶ CULTIVADOR ──────▶ GUARDIAO ──────▶ PROTETOR ──────▶  LENDA ★
 0,001 MOGNO        0,005 MOGNO        0,010 MOGNO       0,050 MOGNO      0,100 MOGNO
```

### 2.3 Por que custo exponencial?

- **Plantador → Cultivador (×1,5):** acessível, encoraja a exploração
- **Cultivador → Guardiao (×2,0):** requer comprometimento real
- **Guardiao → Protetor (×2,0):** liderança — só os dedicados chegam
- **Protetor → Lenda (×1,67):** Grande Ascensão — genuinamente raro

Um NFT **Lenda** vale **100× mais MOGNO** que um Plantador, mas o custo total é **21,5×** — o usuário paga com esforço, não apenas com dinheiro.

### 2.4 Relação de Valor Lenda vs. Plantador

```
Plantador:  100 Folhas →   10.000 unidades MOGNO = 0,001 MOGNO
Lenda:    2.150 Folhas → 1.000.000 unidades MOGNO = 0,100 MOGNO

Múltiplo de valor: 100×
Múltiplo de custo: 21,5×
→ Premium de esforço: o protocolo recompensa dedicação com valor desproporcional
```

---

## 3. Camada 2 — Registros Anuais de Crescimento (TreeAnnualRecord)

### 3.1 Estrutura de Dados

```rust
pub struct TreeAnnualRecord {
    pub nft_id:       u32,  // NFT RWA vinculado
    pub tree_id:      u32,  // ID físico da árvore no campo (mapeado pelo Oráculo)
    pub year:         u32,  // Ano do registro (ex: 2025)
    pub height_cm:    u32,  // Altura medida em campo (centímetros)
    pub carbon_kg:    u32,  // CO₂ sequestrado no ano (quilogramas)
    pub health_score: u32,  // Saúde da árvore: 0–100 (avaliado em campo)
    pub geo_hash:     u64,  // Hash das coordenadas GPS (privacidade preservada)
}
```

### 3.2 Fluxo do Oráculo

```
Ano 1 (2024):
  Oráculo vai a campo → mede árvore → chama update_tree_record(nft_id, year=2024, ...)
  → TreeRecord(nft_id, 2024) gravado on-chain
  → TreeLatestYear(nft_id) = 2024
  → Evento tree_upd emitido → indexado pelo dashboard

Ano 2 (2025):
  Oráculo repete → TreeRecord(nft_id, 2025) adicionado
  → TreeLatestYear(nft_id) = 2025
  → Histórico de 2024 preservado e consultável

Ano N:
  N registros históricos, todos auditáveis, nenhum sobrescreve o anterior
```

### 3.3 Usuário com 10 NFTs — Visão de Portfólio

```
NFT #001 — Plantador | Árvore #501 | São Paulo Interior
  2024: altura 60cm  | carbono 2kg  | saúde 92%
  2025: altura 140cm | carbono 9kg  | saúde 95%
  2026: altura 230cm | carbono 20kg | saúde 97%

NFT #002 — Plantador | Árvore #502 | São Paulo Interior
  2024: altura 55cm  | carbono 2kg  | saúde 88%
  2025: altura 130cm | carbono 8kg  | saúde 91%
  2026: altura 210cm | carbono 18kg | saúde 94%

... (NFTs #003 a #010 — cada um com seu histórico independente)

Observação: todos ainda são PLANTADOR — o nível de comprometimento não mudou
porque o usuário não quis gastar Folhas para evoluir. As árvores crescem por si.
```

### 3.4 Queries Disponíveis

| Função | Descrição |
|---|---|
| `get_tree_record(nft_id, year)` | Registro de um ano específico |
| `get_latest_tree_record(nft_id)` | Registro mais recente disponível |
| `get_tree_latest_year(nft_id)` | Último ano com dados registados |

---

## 4. Sistema de Selos ESG — CompanyBadge (B2B Dashboard)

### 4.1 CompanyBadge

```rust
pub struct CompanyBadge {
    pub company:              Address,
    pub total_leaves_claimed: i128,   // total capturado por todos os clientes
    pub ods_score:            u32,    // 1 ponto / 10 folhas (alinhado ODS/ONU)
    pub carbon_credits:       u32,    // 1 crédito / 50 folhas (CO₂ rastreável)
    pub lenda_bonus:          bool,   // true quando cliente atinge nível Lenda
}
```

### 4.2 Fluxo de Registro B2B Completo

```
1. Admin → register_partner(company)
   → Partner(company) = true
   → CompanyBadge zerado criado
   → MissionPool(company) = 0
   → Evento: reg_ptr

2. Empresa → distribute_leaves(amount)
   → MissionPool(company) += amount
   → Evento: dist_lf  [rastreável no Dashboard B2B]

3. Cliente realiza ação de impacto no mundo real
   → Oráculo valida (Proof of Flourishing)

4. Admin → claim_mission_leaf(user, company, amount)
   → MissionPool(company) -= amount
   → LeavesBalance(user) += amount
   → CompanyBadge.ods_score     = total_leaves / 10
   → CompanyBadge.carbon_credits = total_leaves / 50
   → UserCompany(user) = company
   → Evento: leaf_clm  ← DASHBOARD B2B TEMPO REAL

5. [Opcional] Cliente evolui NFT até Lenda
   → CompanyBadge.lenda_bonus = true
   → Evento: lgnd_bon  ← HEAVY BADGES DESBLOQUEADOS
```

### 4.3 Tabela de Selos por Limiar

| Selo | Condição | Descrição |
|---|---|---|
| 🌱 Parceiro Ativo | Pool > 0 | Empresa financiou missões |
| 🌿 Impacto ODS | ods_score ≥ 10 | 100+ folhas capturadas (10 pts ODS) |
| 🌳 Carbono Verificável | carbon_credits ≥ 5 | 250+ folhas → 5 créditos CO₂ |
| 🏆 Comunidade Lendária | `lenda_bonus = true` | Cliente atingiu nível Lenda |
| ⭐ ESG Premium | Lenda + carbon ≥ 20 | Elegível para relatórios GRI/TCFD |

---

## 5. Vereda.Verify — Ponte de Certificação ESG

### 5.1 Por que é necessário?

Auditores externos (GRI, TCFD, SBTi, bancos de fomento) não lêem dados brutos de blockchain. Precisam de **certificados verificáveis** que:
- Comprovem dados sem expor outras empresas
- Sejam verificáveis off-chain por qualquer auditor
- Sejam imutáveis e com timestamp confiável

### 5.2 Arquitetura Merkle

```
hero_journey                         vereda-verify-soroban
     │                                        │
     │  [Ciclo mensal — Oráculo off-chain]    │
     │  1. Coleta todos os CompanyBadge       │
     │  2. Gera Merkle Tree                   │
     │  3. set_esg_merkle_root(admin, root)   │
     │  → EsgMerkleRoot = BytesN<32>          │
     │  → Evento: esg_root                   │
     │                                        │
     │                             [Auditoria]│
     │                 verify_esg_badge(       │
     │                   company,             │
     │                   badge_snapshot,      │
     │                   merkle_proof         │
     │                 ) → bool              │
     │                             ←──────────│
     │                             lê o root  │
     └─────────────────────────────────────────
```

### 5.3 Padrões de Compliance

| Padrão | Aplicação | Mapeamento |
|---|---|---|
| **GRI 305** | Emissões GHG | `carbon_credits` (Camada 1) + `carbon_kg` (Camada 2) |
| **TCFD** | Risco climático | `ods_score` + Merkle proof |
| **SBTi** | Science-Based Targets | `lenda_bonus` + certificado Vereda |
| **ISO 14001** | Gestão ambiental | `TreeAnnualRecord.health_score` (Camada 2) |

---

## 6. Referência Técnica Completa

### 6.1 Eventos On-Chain

| Evento | Tópico | Payload | Consumidor |
|---|---|---|---|
| Forja NFT | `forge` | `(user, nft_id)` | Frontend B2C |
| Recompensa | `reward` | `(user, amount)` | Dashboard Admin |
| Registro Parceiro | `reg_ptr` | `(company)` | Dashboard B2B |
| Depósito Pool | `dist_lf` | `(company, amount)` | Dashboard B2B |
| **Captura Missão** | **`leaf_clm`** | **`(company, user, amount)`** | **Dashboard B2B (tempo real)** |
| Evolução NFT | `evolve` | `(user, nft_id, rarity)` | Frontend B2C |
| **Lenda Bonus** | **`lgnd_bon`** | **`(company, user, nft_id)`** | **Dashboard B2B (heavy badges)** |
| Registro Árvore | `tree_upd` | `(nft_id, year, carbon_kg)` | Dashboard impacto real |
| Merkle ESG | `esg_root` | `(root: BytesN<32>)` | Vereda.Verify indexer |

### 6.2 Constantes do Protocolo

```rust
FORGE_COST     = 100        // Plantador (forja)
EVOLVE_COSTS   = {
  Plantador  → 150,         // Cultivador
  Cultivador → 300,         // Guardiao
  Guardiao   → 600,         // Protetor
  Protetor   → 1_000,       // Lenda
}

ODS_DIVISOR    = 10         // 1 ponto ODS / 10 Folhas
CARBON_DIVISOR = 50         // 1 crédito carbono / 50 Folhas
MAX_HEALTH     = 100        // Limite de health_score no TreeAnnualRecord
MOGNO_DECIMALS = 7          // Padrão Stellar
```

### 6.3 Cobertura de Testes: 58/58 ✅

| Grupo | Testes |
|---|---|
| Inicialização | 1 |
| `reward_leaves` | 5 |
| Forja — Plantador | 6 |
| Evolução RPG (custos exponenciais) | 8 |
| Fração MOGNO | 2 |
| Camada 2 — TreeAnnualRecord | 10 |
| Parceiros B2B | 4 |
| `distribute_leaves` | 5 |
| `claim_mission_leaf` | 7 |
| Lenda Bonus B2B | 2 |
| Vereda.Verify Merkle Root | 3 |
| `get_nft_rarity` | 2 |
| Integração B2B2C completa | 1 |
| **Total** | **58** ✅ |

---

## 7. Próximos Passos

| # | Funcionalidade | Localização | Prioridade |
|---|---|---|---|
| 1 | `revoke_partner()` — remoção segura com devolução de pool | `hero_journey` | 🔴 Alta |
| 2 | Multi-empresa por usuário (`UserCompanies: Vec<Address>`) | `hero_journey` | 🟡 Média |
| 3 | `verify_esg_badge(company, badge_data, proof)` | `vereda-verify` | 🟡 Média |
| 4 | Cross-contract `register_partner` → `sbt_reputation` KYC | Ambos | 🟢 Arquitetura |
| 5 | Dashboard de portfólio de árvores (Camada 2) | Frontend | 🟢 UX |
| 6 | Certificado SBT de conformidade emitido via `sbt_reputation` | `sbt_reputation` | ⭐ Enterprise |
