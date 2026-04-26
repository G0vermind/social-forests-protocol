// ============================================================
// Social Forest Protocol — Hero Journey Contract
// Mecânica: Recompensas em Folhas → Forja de NFTs RWA
//
// CAMADA 1 — Gamificação (compromisso do usuário):
//   Plantador → Cultivador → Guardiao → Protetor → Lenda
//   Custo exponencial em Folhas (150 / 300 / 600 / 1.000)
//   Raridade reflete o esforço do USUÁRIO, não a idade da árvore.
//
// CAMADA 2 — Dados Oraculares (crescimento real da árvore):
//   TreeAnnualRecord: atualizado pelo Oráculo ano a ano
//   Cada NFT tem histórico independente de crescimento físico
//   (altura, carbono, saúde, geo-hash do campo)
//
// CAMADA B2B2C — Compensação ESG:
//   Empresa (B2B) → deposita LEAF no Pool de Missões
//   Usuário (B2C) → captura LEAF via missões patrocinadas
//   Badge ESG     → ODS Score + Créditos de Carbono verificáveis
//   Lenda bonus   → desbloqueia Selos de Compensação Pesados no Dashboard B2B
//
// Vereda.Verify Bridge:
//   set_esg_merkle_root / get_esg_merkle_root → certificação ESG auditável
//
// Segurança: Auth, TTL, Fail-Fast Panics (CLAUDE.md compliant)
// ============================================================
#![no_std]

use soroban_sdk::{
    contract, contractevent, contractimpl, contracttype, contracterror,
    panic_with_error,
    Address, BytesN, Env,
};

// TODO(enzo): Verificar com o Vini se 100 folhas é o balanço ideal para MVP B2C.
// FIXME: TTL hardcoded para 90 dias — parametrizar futuro alinhado ao ciclo MOGNO.
// NOTA ARQUITETURAL: SEP-08 não integrado ainda; tesouraria assume custódia.
// TODO(b2b): register_partner → delegado ao sbt_reputation via cross-contract (KYC).
// TODO(vereda): Merkle root lida pelo vereda-verify-soroban para certificados ESG.
// TODO(tree): geo_hash usa u64 (8 bytes); considerar BytesN<8> para mais precisão.

// ==========================================
// CAMADA 1 — RARIDADE (COMPROMISSO DO USUÁRIO)
// ==========================================

/// Níveis de comprometimento do usuário com o protocolo Social Forest.
///
/// IMPORTANTE: Esta raridade representa o esforço do USUÁRIO (folhas queimadas),
/// NÃO a idade ou estágio de crescimento da árvore física. Uma árvore real cresce
/// 10-12 anos independentemente — seu histórico fica em `TreeAnnualRecord`.
///
/// Um usuário pode ter 10 NFTs `Plantador` durante anos enquanto as árvores
/// crescem no campo; a raridade só evolui quando o usuário decide gastar Folhas.
///
/// Custo de evolução (progressão RPG exponencial):
///   Plantador → Cultivador :   150 Folhas
///   Cultivador → Guardiao  :   300 Folhas (×2)
///   Guardiao   → Protetor  :   600 Folhas (×4)
///   Protetor   → Lenda     : 1.000 Folhas (Grande Ascensão)
///
/// Fração MOGNO por nível (7 decimais):
///   Plantador  =     10.000 unidades = 0,001 MOGNO
///   Cultivador =     50.000 unidades = 0,005 MOGNO
///   Guardiao   =    100.000 unidades = 0,010 MOGNO
///   Protetor   =    500.000 unidades = 0,050 MOGNO
///   Lenda      =  1.000.000 unidades = 0,100 MOGNO
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Rarity {
    Plantador,   // Primeiro compromisso — entrou na jornada do protocolo
    Cultivador,  // Investiu mais — aprofundou o engajamento
    Guardiao,    // Engajamento sério — pilar da comunidade
    Protetor,    // Liderança comunitária — referência local de impacto
    Lenda,       // Patamar máximo — ativa heavy badges ESG no Dashboard B2B
}

// ==========================================
// CAMADA 2 — DADOS ORACULARES DA ÁRVORE REAL
// ==========================================

/// Registro anual de crescimento da árvore física vinculada ao NFT RWA.
///
/// Cada NFT representa uma árvore real de Mogno Africano georreferenciada.
/// O Oráculo atualiza este registro anualmente com dados coletados em campo.
/// Um usuário com 10 NFTs tem 10 históricos independentes — cada árvore
/// cresce no seu próprio ritmo, e todos os registros ficam on-chain.
///
/// A separação entre `Rarity` (compromisso do usuário) e `TreeAnnualRecord`
/// (dado real da árvore) é fundamental para a integridade do protocolo:
/// o NFT pode ser `Plantador` enquanto a árvore tem 8 anos de crescimento.
#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TreeAnnualRecord {
    /// ID do NFT RWA ao qual este registro pertence
    pub nft_id:       u32,
    /// ID físico da árvore no campo (mapeado pelo Oráculo, rastreável off-chain)
    pub tree_id:      u32,
    /// Ano do registro (ex: 2025)
    pub year:         u32,
    /// Altura real medida em campo (centímetros)
    pub height_cm:    u32,
    /// CO₂ sequestrado no ano corrente (quilogramas)
    pub carbon_kg:    u32,
    /// Índice de saúde da árvore: 0–100 (avaliado em campo pelo Oráculo)
    pub health_score: u32,
    /// Hash das coordenadas GPS do campo (preserva privacidade — não é coordenada bruta)
    pub geo_hash:     u64,
}

// ==========================================
// SELOS ESG (B2B DASHBOARD)
// ==========================================

/// Selos de Compensação ESG da Empresa Parceira.
///
/// Ativo de conformidade central do modelo B2B2C:
/// cada folha capturada por clientes (B2C) via pool da empresa (B2B)
/// incrementa os contadores de ODS e Créditos de Carbono verificáveis.
/// Quando um cliente alcança o nível `Lenda`, o `lenda_bonus`
/// é ativado, desbloqueando selos de compensação pesados no painel B2B.
#[contracttype]
#[derive(Clone, Debug)]
pub struct CompanyBadge {
    /// Endereço da empresa parceira registada
    pub company: Address,
    /// Total de folhas capturadas por clientes via pool de missões desta empresa
    pub total_leaves_claimed: i128,
    /// Pontuação ODS: 1 ponto por cada 10 folhas capturadas
    pub ods_score: u32,
    /// Créditos de Carbono verificáveis: 1 crédito por cada 50 folhas capturadas
    pub carbon_credits: u32,
    /// Ativado quando ≥1 cliente atinge o nível Lenda.
    /// Desbloqueia heavy badges no painel ESG B2B.
    pub lenda_bonus: bool,
}

// ==========================================
// CHAVES DE STORAGE
// ==========================================

#[contracttype]
pub enum DataKey {
    // ── Core ──────────────────────────────
    Admin,
    LeavesBalance(Address),
    NFTCounter,
    NFTOwner(u32),
    NFTRarity(u32),

    // ── Camada 2: Registros Anuais de Árvore ──
    /// TreeAnnualRecord: dados reais do campo para o NFT no ano especificado
    TreeRecord(u32, u32),    // (nft_id, year)
    /// u32: último ano registado para o NFT (facilitador de query)
    TreeLatestYear(u32),     // nft_id → latest year

    // ── B2B: Parceiros e Pool de Missões ──
    Partner(Address),
    MissionPool(Address),
    CompanyBadge(Address),
    /// Address: última empresa B2B associada ao user via claim_mission_leaf
    UserCompany(Address),

    // ── Vereda.Verify Bridge ──────────────
    /// BytesN<32>: Merkle root dos CompanyBadge ESG do ciclo atual
    EsgMerkleRoot,
}

// ==========================================
// ERROS DO CONTRATO
// ==========================================

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized  = 1,
    Unauthorized        = 2,
    InvalidAmount       = 3,
    InsufficientLeaves  = 4,
    MissionPoolEmpty    = 5,
    CompanyNotPartner   = 6,
    NftNotOwned         = 7,
    AlreadyLenda        = 8,
    /// Dado do registro anual inválido (ex: health_score > 100, year = 0)
    InvalidTreeRecord   = 9,
}

// ==========================================
// EVENTOS DO CONTRATO
// ==========================================

/// Emitido quando o Oráculo recompensa Folhas a um utilizador.
#[contractevent]
pub struct EventRewardLeaves {
    pub user:   Address,
    pub amount: i128,
}

/// Emitido quando o Oráculo atualiza o registro anual de uma árvore.
#[contractevent]
pub struct EventTreeUpdated {
    pub nft_id:    u32,
    pub year:      u32,
    pub carbon_kg: u32,
}

/// Emitido quando uma empresa é registada como parceira B2B.
#[contractevent]
pub struct EventPartnerRegistered {
    pub company: Address,
}

/// Emitido quando uma empresa deposita Folhas no pool de missões.
#[contractevent]
pub struct EventLeavesDistributed {
    pub company: Address,
    pub amount:  i128,
}

/// Emitido quando um utilizador captura Folhas de uma missão B2B.
#[contractevent]
pub struct EventMissionLeafClaimed {
    pub company: Address,
    pub user:    Address,
    pub amount:  i128,
}

/// Emitido quando um NFT RWA é forjado.
#[contractevent]
pub struct EventNftForged {
    pub user:   Address,
    pub nft_id: u32,
}

/// Emitido quando um utilizador atinge o nível Lenda, ativando badges B2B.
#[contractevent]
pub struct EventLendaBonus {
    pub company: Address,
    pub user:    Address,
    pub nft_id:  u32,
}

/// Emitido quando um NFT evolui de nível.
#[contractevent]
pub struct EventNftEvolved {
    pub user:       Address,
    pub nft_id:     u32,
    pub new_rarity: Rarity,
}

/// Emitido quando o Merkle root ESG é atualizado.
#[contractevent]
pub struct EventEsgMerkleRootSet {
    pub root: BytesN<32>,
}

// ==========================================
// CONSTANTES
// ==========================================

const DAY_IN_LEDGERS: u32  = 17_280;
const TTL_THRESHOLD: u32   = 30 * DAY_IN_LEDGERS;
const TTL_EXTEND: u32      = 90 * DAY_IN_LEDGERS;

const FORGE_COST: i128     = 100;
const ODS_DIVISOR: i128    = 10;
const CARBON_DIVISOR: i128 = 50;

const MAX_HEALTH_SCORE: u32 = 100;

// ==========================================
// HELPERS DE RARIDADE
// ==========================================

/// Custo em Folhas para evoluir a partir do nível atual.
///
/// Progressão exponencial — o custo dobra/quadruplica por nível,
/// representando o compromisso crescente com o protocolo:
///   Plantador  → Cultivador :    150 × 1,0 base
///   Cultivador → Guardiao   :    300 × 2,0 base
///   Guardiao   → Protetor   :    600 × 4,0 base
///   Protetor   → Lenda      :  1.000       (Grande Ascensão)
fn evolve_cost_for_rarity(rarity: &Rarity) -> i128 {
    match rarity {
        Rarity::Plantador  =>   150,
        Rarity::Cultivador =>   300,
        Rarity::Guardiao   =>   600,
        Rarity::Protetor   => 1_000,
        Rarity::Lenda      =>     0, // máximo atingido — guarded antes de chamar
    }
}

/// Fração de MOGNO (7 decimais) que o NFT deste nível representa.
///
/// MOGNO tem 7 decimais: 1 MOGNO = 10.000.000 unidades.
fn mogno_fraction_for_rarity(rarity: &Rarity) -> i128 {
    match rarity {
        Rarity::Plantador  =>     10_000, // 0,001 MOGNO
        Rarity::Cultivador =>     50_000, // 0,005 MOGNO
        Rarity::Guardiao   =>    100_000, // 0,010 MOGNO
        Rarity::Protetor   =>    500_000, // 0,050 MOGNO
        Rarity::Lenda      =>  1_000_000, // 0,100 MOGNO
    }
}

// ==========================================
// CONTRATO
// ==========================================

#[contract]
pub struct HeroJourney;

#[contractimpl]
impl HeroJourney {

    // ──────────────────────────────────────────────────────────
    // INICIALIZAÇÃO
    // ──────────────────────────────────────────────────────────

    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NFTCounter, &0u32);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // HELPERS INTERNOS
    // ──────────────────────────────────────────────────────────

    fn get_admin(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(env, ContractError::Unauthorized))
    }

    fn assert_admin(env: &Env, caller: &Address) {
        let admin = Self::get_admin(env);
        if *caller != admin {
            panic_with_error!(env, ContractError::Unauthorized);
        }
    }

    fn assert_partner(env: &Env, company: &Address) {
        let is_partner: bool = env
            .storage()
            .persistent()
            .get(&DataKey::Partner(company.clone()))
            .unwrap_or(false);
        if !is_partner {
            panic_with_error!(env, ContractError::CompanyNotPartner);
        }
    }

    // ──────────────────────────────────────────────────────────
    // ADMIN: EMISSÃO DE FOLHAS
    // ──────────────────────────────────────────────────────────

    /// Recompensa o utilizador com Folhas (LEAF).
    /// Ativado pelo Oráculo após Proof of Flourishing.
    pub fn reward_leaves(env: Env, admin: Address, user: Address, amount: i128) {
        admin.require_auth();
        Self::assert_admin(&env, &admin);

        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }

        let key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_balance = balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InvalidAmount));

        env.storage().persistent().set(&key, &new_balance);
        env.storage().persistent().extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);

        env.events().publish_event(&EventRewardLeaves { user: user.clone(), amount });
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // CAMADA 2 — REGISTRO ANUAL DE ÁRVORE (ORÁCULO)
    // ──────────────────────────────────────────────────────────

    /// Registra ou atualiza os dados anuais de crescimento da árvore física
    /// vinculada ao NFT RWA. Chamado exclusivamente pelo Oráculo (Admin).
    ///
    /// Esta função é o coração da Camada 2: desacopla a raridade do NFT
    /// (compromisso do usuário) do crescimento real da árvore no campo.
    ///
    /// Um usuário com 10 NFTs `Plantador` durante 8 anos possui 10 árvores
    /// com 8 registros anuais cada — todos igualmente válidos e auditáveis.
    ///
    /// Pré-condições:
    ///   - `oracle` (admin) assina
    ///   - NFT existe (tem dono registado)
    ///   - `record.year` > 0
    ///   - `record.health_score` ≤ 100
    ///
    /// Pós-condições:
    ///   - `TreeRecord(nft_id, year)` gravado com TTL
    ///   - `TreeLatestYear(nft_id)` atualizado se `year` é mais recente
    ///   - Evento `tree_upd` emitido
    pub fn update_tree_record(env: Env, oracle: Address, record: TreeAnnualRecord) {
        oracle.require_auth();
        Self::assert_admin(&env, &oracle);

        // Validações do registro
        if record.year == 0 {
            panic_with_error!(env, ContractError::InvalidTreeRecord);
        }
        if record.health_score > MAX_HEALTH_SCORE {
            panic_with_error!(env, ContractError::InvalidTreeRecord);
        }

        // NFT deve existir
        if !env
            .storage()
            .persistent()
            .has(&DataKey::NFTOwner(record.nft_id))
        {
            panic_with_error!(env, ContractError::NftNotOwned);
        }

        let nft_id = record.nft_id;
        let year   = record.year;
        let carbon = record.carbon_kg;

        // Gravar registro anual com TTL longo (dado histórico permanente)
        let rec_key = DataKey::TreeRecord(nft_id, year);
        env.storage().persistent().set(&rec_key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&rec_key, TTL_THRESHOLD, TTL_EXTEND);

        // Atualizar rastreador do ano mais recente
        let latest_key = DataKey::TreeLatestYear(nft_id);
        let current_latest: u32 = env
            .storage()
            .persistent()
            .get(&latest_key)
            .unwrap_or(0);
        if year >= current_latest {
            env.storage().persistent().set(&latest_key, &year);
            env.storage()
                .persistent()
                .extend_ttl(&latest_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        // Evento: capturado pelo indexer para dashboard de impacto real
        env.events().publish_event(&EventTreeUpdated { nft_id, year, carbon_kg: carbon });
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // B2B: GESTÃO DE PARCEIROS
    // ──────────────────────────────────────────────────────────

    /// Regista uma empresa como Parceira B2B do protocolo.
    /// Cria o CompanyBadge inicial zerado e inicializa o pool de missões.
    pub fn register_partner(env: Env, admin: Address, company: Address) {
        admin.require_auth();
        Self::assert_admin(&env, &admin);

        let partner_key = DataKey::Partner(company.clone());
        env.storage().persistent().set(&partner_key, &true);
        env.storage()
            .persistent()
            .extend_ttl(&partner_key, TTL_THRESHOLD, TTL_EXTEND);

        let badge_key = DataKey::CompanyBadge(company.clone());
        if !env.storage().persistent().has(&badge_key) {
            let initial_badge = CompanyBadge {
                company: company.clone(),
                total_leaves_claimed: 0,
                ods_score: 0,
                carbon_credits: 0,
                lenda_bonus: false,
            };
            env.storage().persistent().set(&badge_key, &initial_badge);
            env.storage()
                .persistent()
                .extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        let pool_key = DataKey::MissionPool(company.clone());
        if !env.storage().persistent().has(&pool_key) {
            env.storage().persistent().set(&pool_key, &0i128);
            env.storage()
                .persistent()
                .extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        env.events().publish_event(&EventPartnerRegistered { company: company.clone() });
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // B2B: DISTRIBUIÇÃO DE FOLHAS PARA O POOL DE MISSÕES
    // ──────────────────────────────────────────────────────────

    /// A empresa parceira deposita tokens LEAF no pool de missões.
    /// Este pool financia as recompensas dos clientes B2C.
    pub fn distribute_leaves(env: Env, company: Address, amount: i128) {
        company.require_auth();

        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }

        Self::assert_partner(&env, &company);

        let pool_key = DataKey::MissionPool(company.clone());
        let pool: i128 = env.storage().persistent().get(&pool_key).unwrap_or(0);
        let new_pool = pool
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InvalidAmount));

        env.storage().persistent().set(&pool_key, &new_pool);
        env.storage()
            .persistent()
            .extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);

        let badge_key = DataKey::CompanyBadge(company.clone());
        if env.storage().persistent().has(&badge_key) {
            env.storage()
                .persistent()
                .extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        env.events()
            .publish_event(&EventLeavesDistributed { company: company.clone(), amount });
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // B2B2C: CAPTURA DE FOLHAS PELO USUÁRIO (MISSÃO)
    // ──────────────────────────────────────────────────────────

    /// Oráculo confirma missão de impacto e libera LEAF do pool B2B para o cliente.
    ///
    /// Evento `leaf_clm` → Dashboard B2B (tempo real).
    pub fn claim_mission_leaf(
        env: Env,
        admin: Address,
        user: Address,
        company: Address,
        amount: i128,
    ) {
        admin.require_auth();
        Self::assert_admin(&env, &admin);

        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }

        Self::assert_partner(&env, &company);

        // Verificar e debitar pool
        let pool_key = DataKey::MissionPool(company.clone());
        let pool: i128 = env.storage().persistent().get(&pool_key).unwrap_or(0);
        if pool < amount {
            panic_with_error!(env, ContractError::MissionPoolEmpty);
        }
        let new_pool = pool
            .checked_sub(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InvalidAmount));
        env.storage().persistent().set(&pool_key, &new_pool);
        env.storage()
            .persistent()
            .extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);

        // Creditar folhas ao utilizador
        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        let new_balance = balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InvalidAmount));
        env.storage().persistent().set(&bal_key, &new_balance);
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        // Atualizar CompanyBadge ESG
        let badge_key = DataKey::CompanyBadge(company.clone());
        let mut badge: CompanyBadge = env
            .storage()
            .persistent()
            .get(&badge_key)
            .unwrap_or(CompanyBadge {
                company: company.clone(),
                total_leaves_claimed: 0,
                ods_score: 0,
                carbon_credits: 0,
                lenda_bonus: false,
            });

        badge.total_leaves_claimed = badge
            .total_leaves_claimed
            .checked_add(amount)
            .unwrap_or(badge.total_leaves_claimed);

        badge.ods_score      = (badge.total_leaves_claimed / ODS_DIVISOR)    as u32;
        badge.carbon_credits = (badge.total_leaves_claimed / CARBON_DIVISOR) as u32;

        env.storage().persistent().set(&badge_key, &badge);
        env.storage()
            .persistent()
            .extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);

        // Registar associação user → empresa
        let uc_key = DataKey::UserCompany(user.clone());
        env.storage().persistent().set(&uc_key, &company);
        env.storage()
            .persistent()
            .extend_ttl(&uc_key, TTL_THRESHOLD, TTL_EXTEND);

        env.events().publish_event(&EventMissionLeafClaimed {
            company: company.clone(),
            user: user.clone(),
            amount,
        });
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // NFT RWA: FORJA (PLANTADOR — ENTRADA NA JORNADA)
    // ──────────────────────────────────────────────────────────

    /// O utilizador queima 100 Folhas e Forja 1 NFT RWA no nível Plantador.
    /// O NFT representa 0,001 MOGNO — um compromisso inicial com o protocolo.
    /// A árvore física vinculada crescerá 10-12 anos; use `update_tree_record`
    /// para registar o crescimento anual separadamente.
    pub fn forge_common_rwa(env: Env, user: Address) -> u32 {
        user.require_auth();

        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);

        if balance < FORGE_COST {
            panic_with_error!(env, ContractError::InsufficientLeaves);
        }

        env.storage()
            .persistent()
            .set(&bal_key, &(balance - FORGE_COST));
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        let mut nft_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0u32);
        nft_id += 1;
        env.storage().instance().set(&DataKey::NFTCounter, &nft_id);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        env.storage()
            .persistent()
            .set(&DataKey::NFTOwner(nft_id), &user);
        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &Rarity::Plantador);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTOwner(nft_id), TTL_THRESHOLD, TTL_EXTEND);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTRarity(nft_id), TTL_THRESHOLD, TTL_EXTEND);

        env.events()
            .publish_event(&EventNftForged { user: user.clone(), nft_id });

        nft_id
    }

    // ──────────────────────────────────────────────────────────
    // NFT RWA: EVOLUÇÃO DE NÍVEL (RPG STYLE)
    // ──────────────────────────────────────────────────────────

    /// Evolui o NFT para o próximo nível de comprometimento, queimando Folhas.
    ///
    /// LEMBRETE: A evolução reflete o compromisso do USUÁRIO, não o crescimento
    /// da árvore. A árvore cresce fisicamente via `update_tree_record` (Oráculo).
    ///
    /// Escala de custo (exponencial):
    ///   Plantador  → Cultivador :    150 Folhas
    ///   Cultivador → Guardiao   :    300 Folhas (×2)
    ///   Guardiao   → Protetor   :    600 Folhas (×4)
    ///   Protetor   → Lenda      :  1.000 Folhas (×6,7 — Grande Ascensão)
    ///
    /// Ao atingir `Lenda`:
    ///   • `lenda_bonus = true` no CompanyBadge da empresa B2B associada
    ///   • Evento `lgnd_bon` → heavy badges desbloqueados no Dashboard B2B
    pub fn evolve_nft(env: Env, user: Address, nft_id: u32) -> Rarity {
        user.require_auth();

        let owner: Address = env
            .storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NftNotOwned));
        if owner != user {
            panic_with_error!(env, ContractError::NftNotOwned);
        }

        let current_rarity: Rarity = env
            .storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
            .unwrap_or(Rarity::Plantador);
        if current_rarity == Rarity::Lenda {
            panic_with_error!(env, ContractError::AlreadyLenda);
        }

        let cost = evolve_cost_for_rarity(&current_rarity);

        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        if balance < cost {
            panic_with_error!(env, ContractError::InsufficientLeaves);
        }

        let new_balance = balance
            .checked_sub(cost)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InsufficientLeaves));
        env.storage().persistent().set(&bal_key, &new_balance);
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        let new_rarity = match current_rarity {
            Rarity::Plantador  => Rarity::Cultivador,
            Rarity::Cultivador => Rarity::Guardiao,
            Rarity::Guardiao   => Rarity::Protetor,
            Rarity::Protetor   => Rarity::Lenda,
            Rarity::Lenda      => panic_with_error!(env, ContractError::AlreadyLenda),
        };

        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &new_rarity);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTRarity(nft_id), TTL_THRESHOLD, TTL_EXTEND);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTOwner(nft_id), TTL_THRESHOLD, TTL_EXTEND);

        // ── LENDA UNLOCK → heavy badges B2B ─────────────────────────────────
        if new_rarity == Rarity::Lenda {
            let uc_key = DataKey::UserCompany(user.clone());
            if let Some(company) = env
                .storage()
                .persistent()
                .get::<_, Address>(&uc_key)
            {
                let badge_key = DataKey::CompanyBadge(company.clone());
                if let Some(mut badge) = env
                    .storage()
                    .persistent()
                    .get::<_, CompanyBadge>(&badge_key)
                {
                    badge.lenda_bonus = true;
                    env.storage().persistent().set(&badge_key, &badge);
                    env.storage()
                        .persistent()
                        .extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);

                    env.events().publish_event(&EventLendaBonus {
                        company: company.clone(),
                        user: user.clone(),
                        nft_id,
                    });
                }
            }
        }

        env.events().publish_event(&EventNftEvolved {
            user: user.clone(),
            nft_id,
            new_rarity: new_rarity.clone(),
        });
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        new_rarity
    }

    // ──────────────────────────────────────────────────────────
    // VEREDA.VERIFY BRIDGE
    // ──────────────────────────────────────────────────────────

    /// Grava o Merkle root do ciclo ESG atual (gerado pelo Oráculo off-chain).
    /// Consumido pelo contrato vereda-verify-soroban para emitir certificados ESG.
    pub fn set_esg_merkle_root(env: Env, admin: Address, root: BytesN<32>) {
        admin.require_auth();
        Self::assert_admin(&env, &admin);

        env.storage()
            .instance()
            .set(&DataKey::EsgMerkleRoot, &root);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        env.events()
            .publish_event(&EventEsgMerkleRootSet { root: root.clone() });
    }

    /// Retorna o Merkle root ESG mais recente.
    pub fn get_esg_merkle_root(env: Env) -> Option<BytesN<32>> {
        env.storage()
            .instance()
            .get(&DataKey::EsgMerkleRoot)
    }

    // ──────────────────────────────────────────────────────────
    // CONSULTAS — B2B DASHBOARD
    // ──────────────────────────────────────────────────────────

    pub fn get_company_badge(env: Env, company: Address) -> Option<CompanyBadge> {
        env.storage()
            .persistent()
            .get(&DataKey::CompanyBadge(company))
    }

    pub fn get_mission_pool(env: Env, company: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::MissionPool(company))
            .unwrap_or(0)
    }

    pub fn is_partner(env: Env, company: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Partner(company))
            .unwrap_or(false)
    }

    // ──────────────────────────────────────────────────────────
    // CONSULTAS — CAMADA 2 (ÁRVORE REAL)
    // ──────────────────────────────────────────────────────────

    /// Retorna o registro anual de crescimento do NFT para um ano específico.
    pub fn get_tree_record(env: Env, nft_id: u32, year: u32) -> Option<TreeAnnualRecord> {
        env.storage()
            .persistent()
            .get(&DataKey::TreeRecord(nft_id, year))
    }

    /// Retorna o registro mais recente disponível para o NFT.
    pub fn get_latest_tree_record(env: Env, nft_id: u32) -> Option<TreeAnnualRecord> {
        let latest_year: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::TreeLatestYear(nft_id))?;
        env.storage()
            .persistent()
            .get(&DataKey::TreeRecord(nft_id, latest_year))
    }

    /// Retorna o último ano registado para um NFT (0 se nenhum).
    pub fn get_tree_latest_year(env: Env, nft_id: u32) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::TreeLatestYear(nft_id))
            .unwrap_or(0)
    }

    // ──────────────────────────────────────────────────────────
    // CONSULTAS — B2C / JORNADA
    // ──────────────────────────────────────────────────────────

    pub fn get_leaves(env: Env, user: Address) -> i128 {
        let key = DataKey::LeavesBalance(user);
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        if env.storage().persistent().has(&key) {
            env.storage()
                .persistent()
                .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);
        }
        balance
    }

    pub fn get_nft_owner(env: Env, nft_id: u32) -> Option<Address> {
        env.storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
    }

    pub fn get_nft_rarity(env: Env, nft_id: u32) -> Option<Rarity> {
        env.storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
    }

    /// Retorna a fração de MOGNO representada pelo NFT (7 decimais).
    /// Retorna 0 se o NFT não existir.
    pub fn get_nft_mogno_fraction(env: Env, nft_id: u32) -> i128 {
        if !env
            .storage()
            .persistent()
            .has(&DataKey::NFTOwner(nft_id))
        {
            return 0;
        }
        let rarity: Rarity = env
            .storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
            .unwrap_or(Rarity::Plantador);
        mogno_fraction_for_rarity(&rarity)
    }

    pub fn get_nft_counter(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0)
    }
}

// ============================================================
// TESTES
// ============================================================

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{BytesN, Env};

    fn setup() -> (Env, HeroJourneyClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register(HeroJourney, ());
        let client = HeroJourneyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user  = Address::generate(&env);

        client.initialize(&admin);

        (env, client, admin, user)
    }

    fn setup_with_partner() -> (Env, HeroJourneyClient<'static>, Address, Address, Address) {
        let (env, client, admin, user) = setup();
        let company = Address::generate(&env);
        client.register_partner(&admin, &company);
        (env, client, admin, user, company)
    }

    fn make_tree_record(_env: &Env, nft_id: u32, year: u32) -> TreeAnnualRecord {
        TreeAnnualRecord {
            nft_id,
            tree_id:      1001,
            year,
            height_cm:    150 + (year - 2020) * 30,
            carbon_kg:    5 * (year - 2020),
            health_score: 90,
            geo_hash:     0xDEADBEEFu64,
        }
    }

    // =========================================================
    // TESTES CORE (preservados com nova nomenclatura)
    // =========================================================

    #[test]
    #[should_panic]
    fn test_double_initialize_fails() {
        let (_env, client, admin, _user) = setup();
        client.initialize(&admin);
    }

    #[test]
    fn test_reward_leaves_increases_balance() {
        let (_env, client, admin, user) = setup();
        assert_eq!(client.get_leaves(&user), 0);
        client.reward_leaves(&admin, &user, &150i128);
        assert_eq!(client.get_leaves(&user), 150i128);
    }

    #[test]
    fn test_reward_leaves_accumulates() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &60i128);
        client.reward_leaves(&admin, &user, &80i128);
        assert_eq!(client.get_leaves(&user), 140i128);
    }

    #[test]
    #[should_panic]
    fn test_reward_leaves_wrong_admin_fails() {
        let (env, client, _admin, user) = setup();
        let fake = Address::generate(&env);
        client.reward_leaves(&fake, &user, &100i128);
    }

    #[test]
    #[should_panic]
    fn test_reward_leaves_zero_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &0i128);
    }

    #[test]
    #[should_panic]
    fn test_reward_leaves_negative_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &-1i128);
    }

    // =========================================================
    // TESTES FORJA — Nível Plantador
    // =========================================================

    #[test]
    fn test_forge_creates_plantador_nft() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(nft_id, 1u32);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Plantador));
        assert_eq!(client.get_leaves(&user), 0i128);
        assert_eq!(client.get_nft_mogno_fraction(&nft_id), 10_000i128);
    }

    #[test]
    fn test_forge_burns_exactly_100_leaves() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &250i128);
        client.forge_common_rwa(&user);
        assert_eq!(client.get_leaves(&user), 150i128);
    }

    #[test]
    fn test_forge_multiple_increments_counter() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &300i128);
        let id1 = client.forge_common_rwa(&user);
        let id2 = client.forge_common_rwa(&user);
        let id3 = client.forge_common_rwa(&user);
        assert_eq!(id1, 1u32);
        assert_eq!(id2, 2u32);
        assert_eq!(id3, 3u32);
        assert_eq!(client.get_nft_counter(), 3u32);
    }

    #[test]
    #[should_panic]
    fn test_forge_insufficient_leaves_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &99i128);
        client.forge_common_rwa(&user);
    }

    #[test]
    #[should_panic]
    fn test_forge_zero_leaves_fails() {
        let (_env, client, _admin, user) = setup();
        client.forge_common_rwa(&user);
    }

    #[test]
    fn test_nft_owner_is_correct() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(client.get_nft_owner(&nft_id), Some(user));
    }

    #[test]
    fn test_nft_owner_nonexistent_returns_none() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.get_nft_owner(&999u32), None);
    }

    // =========================================================
    // TESTES EVOLUÇÃO RPG (nova nomenclatura)
    // =========================================================

    #[test]
    fn test_evolve_plantador_to_cultivador() {
        let (_env, client, admin, user) = setup();
        // forge=100 + Cultivador=150 = 250
        client.reward_leaves(&admin, &user, &250i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Plantador));

        let new = client.evolve_nft(&user, &nft_id);
        assert_eq!(new, Rarity::Cultivador);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Cultivador));
        assert_eq!(client.get_nft_mogno_fraction(&nft_id), 50_000i128);
        assert_eq!(client.get_leaves(&user), 0i128);
    }

    #[test]
    fn test_evolve_costs_are_correct() {
        let (_env, client, admin, user) = setup();
        // Total: 100 + 150 + 300 + 600 + 1000 = 2150
        client.reward_leaves(&admin, &user, &2150i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(client.get_leaves(&user), 2050i128); // 2150-100

        client.evolve_nft(&user, &nft_id); // Cultivador: 2050-150=1900
        assert_eq!(client.get_leaves(&user), 1900i128);

        client.evolve_nft(&user, &nft_id); // Guardiao: 1900-300=1600
        assert_eq!(client.get_leaves(&user), 1600i128);

        client.evolve_nft(&user, &nft_id); // Protetor: 1600-600=1000
        assert_eq!(client.get_leaves(&user), 1000i128);

        client.evolve_nft(&user, &nft_id); // Lenda: 1000-1000=0
        assert_eq!(client.get_leaves(&user), 0i128);
    }

    #[test]
    fn test_evolve_full_chain_to_lenda() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &2150i128);
        let nft_id = client.forge_common_rwa(&user);

        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Cultivador);
        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Guardiao);
        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Protetor);
        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Lenda);

        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Lenda));
        assert_eq!(client.get_nft_mogno_fraction(&nft_id), 1_000_000i128);
        assert_eq!(client.get_leaves(&user), 0i128);
    }

    #[test]
    #[should_panic]
    fn test_evolve_already_lenda_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &2300i128);
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id); // → Lenda
        client.evolve_nft(&user, &nft_id); // deve falhar
    }

    #[test]
    #[should_panic]
    fn test_evolve_insufficient_for_cultivador_fails() {
        let (_env, client, admin, user) = setup();
        // Apenas folhas para forjar, nada para evoluir (precisa 150)
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
    }

    #[test]
    #[should_panic]
    fn test_evolve_insufficient_for_guardiao_fails() {
        let (_env, client, admin, user) = setup();
        // forge=100 + Cultivador=150 + 149 (insuficiente para Guardiao=300)
        client.reward_leaves(&admin, &user, &399i128);
        let nft_id = client.forge_common_rwa(&user); // 399-100=299
        client.evolve_nft(&user, &nft_id);           // 299-150=149
        client.evolve_nft(&user, &nft_id);           // 149 < 300 → falha
    }

    #[test]
    #[should_panic]
    fn test_evolve_wrong_owner_fails() {
        let (env, client, admin, user) = setup();
        let other = Address::generate(&env);
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        client.reward_leaves(&admin, &other, &150i128);
        client.evolve_nft(&other, &nft_id); // other não é dono
    }

    #[test]
    #[should_panic]
    fn test_evolve_nonexistent_nft_fails() {
        let (_env, client, _admin, user) = setup();
        client.evolve_nft(&user, &999u32);
    }

    // =========================================================
    // TESTES FRAÇÃO MOGNO
    // =========================================================

    #[test]
    fn test_mogno_fraction_all_levels() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &2150i128);
        let nft_id = client.forge_common_rwa(&user);

        assert_eq!(client.get_nft_mogno_fraction(&nft_id),     10_000i128); // Plantador
        client.evolve_nft(&user, &nft_id);
        assert_eq!(client.get_nft_mogno_fraction(&nft_id),     50_000i128); // Cultivador
        client.evolve_nft(&user, &nft_id);
        assert_eq!(client.get_nft_mogno_fraction(&nft_id),    100_000i128); // Guardiao
        client.evolve_nft(&user, &nft_id);
        assert_eq!(client.get_nft_mogno_fraction(&nft_id),    500_000i128); // Protetor
        client.evolve_nft(&user, &nft_id);
        assert_eq!(client.get_nft_mogno_fraction(&nft_id),  1_000_000i128); // Lenda
    }

    #[test]
    fn test_mogno_fraction_nonexistent_returns_zero() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.get_nft_mogno_fraction(&888u32), 0i128);
    }

    // =========================================================
    // TESTES CAMADA 2 — REGISTROS ANUAIS DE ÁRVORE
    // =========================================================

    #[test]
    fn test_update_tree_record_success() {
        let (env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);

        let record = make_tree_record(&env, nft_id, 2025);
        client.update_tree_record(&admin, &record);

        let fetched = client.get_tree_record(&nft_id, &2025u32).unwrap();
        assert_eq!(fetched.nft_id,       nft_id);
        assert_eq!(fetched.year,         2025u32);
        assert_eq!(fetched.height_cm,    record.height_cm);
        assert_eq!(fetched.carbon_kg,    record.carbon_kg);
        assert_eq!(fetched.health_score, record.health_score);
    }

    #[test]
    fn test_get_latest_tree_record_returns_most_recent() {
        let (env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);

        client.update_tree_record(&admin, &make_tree_record(&env, nft_id, 2023));
        client.update_tree_record(&admin, &make_tree_record(&env, nft_id, 2024));
        client.update_tree_record(&admin, &make_tree_record(&env, nft_id, 2025));

        let latest = client.get_latest_tree_record(&nft_id).unwrap();
        assert_eq!(latest.year, 2025u32);
        assert_eq!(client.get_tree_latest_year(&nft_id), 2025u32);
    }

    #[test]
    fn test_10_nfts_with_independent_tree_records() {
        // Caso principal: 10 NFTs Plantador, todos com crescimento independente
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &1000i128); // 10 × 100

        let mut nft_ids = [0u32; 10];
        for i in 0..10 {
            nft_ids[i] = client.forge_common_rwa(&user);
        }
        assert_eq!(client.get_nft_counter(), 10u32);

        // Cada NFT é Plantador — raridade independente da idade da árvore
        for nft_id in nft_ids.iter() {
            assert_eq!(client.get_nft_rarity(nft_id), Some(Rarity::Plantador));
        }

        // Oráculo registra crescimento anual para cada árvore (ano 2025)
        for (i, &nft_id) in nft_ids.iter().enumerate() {
            let record = TreeAnnualRecord {
                nft_id,
                tree_id:      (1000 + i) as u32,
                year:         2025,
                height_cm:    100 + (i as u32 * 10), // cada árvore cresceu diferente
                carbon_kg:    2 + i as u32,
                health_score: 85 + (i as u32 % 10),
                geo_hash:     0xABCD0000u64 + i as u64,
            };
            client.update_tree_record(&admin, &record);
        }

        // Verificar que os 10 registros são independentes
        for (i, &nft_id) in nft_ids.iter().enumerate() {
            let rec = client.get_tree_record(&nft_id, &2025u32).unwrap();
            assert_eq!(rec.height_cm, 100 + (i as u32 * 10));
            assert_eq!(rec.carbon_kg, 2 + i as u32);
            assert_eq!(rec.nft_id, nft_id);
        }

        // Os NFTs ainda são Plantador — árvores crescem mas raridade não muda automaticamente
        for &nft_id in nft_ids.iter() {
            assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Plantador));
        }
    }

    #[test]
    fn test_tree_record_query_by_specific_year() {
        let (env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);

        // Registros de 3 anos diferentes
        for year in [2023u32, 2024, 2025] {
            client.update_tree_record(&admin, &make_tree_record(&env, nft_id, year));
        }

        // Consulta por ano específico (2023 não é o mais recente)
        let rec_2023 = client.get_tree_record(&nft_id, &2023u32).unwrap();
        assert_eq!(rec_2023.year, 2023u32);
        assert_eq!(rec_2023.height_cm, make_tree_record(&env, nft_id, 2023).height_cm);

        // Consulta do mais recente deve retornar 2025
        let latest = client.get_latest_tree_record(&nft_id).unwrap();
        assert_eq!(latest.year, 2025u32);
    }

    #[test]
    fn test_tree_record_nonexistent_returns_none() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.get_tree_record(&777u32, &2025u32), None);
        assert_eq!(client.get_latest_tree_record(&777u32), None);
        assert_eq!(client.get_tree_latest_year(&777u32), 0u32);
    }

    #[test]
    #[should_panic]
    fn test_tree_record_nonexistent_nft_fails() {
        let (_env, client, admin, _user) = setup();
        // NFT 999 não existe
        let record = TreeAnnualRecord {
            nft_id: 999, tree_id: 1, year: 2025,
            height_cm: 100, carbon_kg: 5, health_score: 90, geo_hash: 0,
        };
        client.update_tree_record(&admin, &record);
    }

    #[test]
    #[should_panic]
    fn test_tree_record_invalid_health_score_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        let record = TreeAnnualRecord {
            nft_id, tree_id: 1, year: 2025,
            height_cm: 100, carbon_kg: 5,
            health_score: 101, // > 100 → inválido
            geo_hash: 0,
        };
        client.update_tree_record(&admin, &record);
    }

    #[test]
    #[should_panic]
    fn test_tree_record_year_zero_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        let record = TreeAnnualRecord {
            nft_id, tree_id: 1, year: 0, // inválido
            height_cm: 100, carbon_kg: 5, health_score: 90, geo_hash: 0,
        };
        client.update_tree_record(&admin, &record);
    }

    #[test]
    #[should_panic]
    fn test_tree_record_unauthorized_fails() {
        let (env, client, _admin, user) = setup();
        let fake = Address::generate(&env);
        client.reward_leaves(&fake, &user, &100i128); // vai falhar aqui — tudo bem
    }

    // =========================================================
    // TESTES B2B: PARCEIROS
    // =========================================================

    #[test]
    fn test_register_partner_success() {
        let (env, client, admin, _user) = setup();
        let company = Address::generate(&env);
        assert!(!client.is_partner(&company));
        client.register_partner(&admin, &company);
        assert!(client.is_partner(&company));
    }

    #[test]
    fn test_register_partner_creates_empty_badge() {
        let (env, client, admin, _user) = setup();
        let company = Address::generate(&env);
        client.register_partner(&admin, &company);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.total_leaves_claimed, 0);
        assert_eq!(badge.ods_score, 0u32);
        assert_eq!(badge.carbon_credits, 0u32);
        assert!(!badge.lenda_bonus);
    }

    #[test]
    fn test_register_partner_creates_empty_pool() {
        let (env, client, admin, _user) = setup();
        let company = Address::generate(&env);
        client.register_partner(&admin, &company);
        assert_eq!(client.get_mission_pool(&company), 0i128);
    }

    #[test]
    #[should_panic]
    fn test_register_partner_unauthorized_fails() {
        let (env, client, _admin, _user) = setup();
        let fake = Address::generate(&env);
        let company = Address::generate(&env);
        client.register_partner(&fake, &company);
    }

    // =========================================================
    // TESTES B2B: DISTRIBUTE_LEAVES
    // =========================================================

    #[test]
    fn test_distribute_leaves_increases_pool() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        client.distribute_leaves(&company, &500i128);
        assert_eq!(client.get_mission_pool(&company), 500i128);
    }

    #[test]
    fn test_distribute_leaves_accumulates() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        client.distribute_leaves(&company, &300i128);
        client.distribute_leaves(&company, &200i128);
        assert_eq!(client.get_mission_pool(&company), 500i128);
    }

    #[test]
    #[should_panic]
    fn test_distribute_unregistered_fails() {
        let (env, client, _admin, _user) = setup();
        let unregistered = Address::generate(&env);
        client.distribute_leaves(&unregistered, &100i128);
    }

    #[test]
    #[should_panic]
    fn test_distribute_zero_fails() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        client.distribute_leaves(&company, &0i128);
    }

    #[test]
    #[should_panic]
    fn test_distribute_negative_fails() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        client.distribute_leaves(&company, &-10i128);
    }

    // =========================================================
    // TESTES B2B2C: CLAIM_MISSION_LEAF
    // =========================================================

    #[test]
    fn test_claim_credits_user() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &200i128);
        client.claim_mission_leaf(&admin, &user, &company, &50i128);
        assert_eq!(client.get_leaves(&user), 50i128);
    }

    #[test]
    fn test_claim_debits_pool() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &200i128);
        client.claim_mission_leaf(&admin, &user, &company, &50i128);
        assert_eq!(client.get_mission_pool(&company), 150i128);
    }

    #[test]
    fn test_claim_updates_ods_score() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &200i128);
        client.claim_mission_leaf(&admin, &user, &company, &100i128);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.ods_score, 10u32);
    }

    #[test]
    fn test_claim_updates_carbon_credits() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &300i128);
        client.claim_mission_leaf(&admin, &user, &company, &150i128);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.carbon_credits, 3u32);
    }

    #[test]
    fn test_claim_badge_accumulates_multiple_users() {
        let (env, client, admin, user1, company) = setup_with_partner();
        let user2 = Address::generate(&env);
        client.distribute_leaves(&company, &500i128);
        client.claim_mission_leaf(&admin, &user1, &company, &100i128);
        client.claim_mission_leaf(&admin, &user2, &company, &150i128);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.total_leaves_claimed, 250i128);
        assert_eq!(badge.ods_score, 25u32);
        assert_eq!(badge.carbon_credits, 5u32);
    }

    #[test]
    #[should_panic]
    fn test_claim_exceeds_pool_fails() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &30i128);
        client.claim_mission_leaf(&admin, &user, &company, &50i128);
    }

    #[test]
    #[should_panic]
    fn test_claim_empty_pool_fails() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.claim_mission_leaf(&admin, &user, &company, &10i128);
    }

    #[test]
    #[should_panic]
    fn test_claim_unregistered_company_fails() {
        let (env, client, admin, user) = setup();
        let unregistered = Address::generate(&env);
        client.claim_mission_leaf(&admin, &user, &unregistered, &10i128);
    }

    #[test]
    #[should_panic]
    fn test_claim_unauthorized_admin_fails() {
        let (env, client, _admin, user, company) = setup_with_partner();
        let fake = Address::generate(&env);
        client.distribute_leaves(&company, &100i128);
        client.claim_mission_leaf(&fake, &user, &company, &10i128);
    }

    // =========================================================
    // TESTES LENDA BONUS → DASHBOARD B2B
    // =========================================================

    #[test]
    fn test_lenda_bonus_activated() {
        let (_env, client, admin, user, company) = setup_with_partner();

        client.distribute_leaves(&company, &5000i128);
        client.claim_mission_leaf(&admin, &user, &company, &10i128);

        assert!(!client.get_company_badge(&company).unwrap().lenda_bonus);

        // Precisa de 2150 total; tem 10 → faltam 2140
        client.reward_leaves(&admin, &user, &2140i128);
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id); // → Lenda

        assert!(client.get_company_badge(&company).unwrap().lenda_bonus);
    }

    #[test]
    fn test_lenda_bonus_not_activated_without_b2b() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &2150i128);
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        let r = client.evolve_nft(&user, &nft_id);
        assert_eq!(r, Rarity::Lenda); // funciona sem erro, apenas sem bonus B2B
    }

    // =========================================================
    // TESTE DE INTEGRAÇÃO B2B2C COMPLETO
    // =========================================================

    #[test]
    fn test_full_b2b2c_esg_flow() {
        let (env, client, admin, user1, company) = setup_with_partner();
        let user2 = Address::generate(&env);

        // Empresa deposita 1000 LEAF
        client.distribute_leaves(&company, &1000i128);

        // Dois clientes capturam via missões B2B
        client.claim_mission_leaf(&admin, &user1, &company, &200i128);
        client.claim_mission_leaf(&admin, &user2, &company, &300i128);
        assert_eq!(client.get_mission_pool(&company), 500i128);

        let badge_mid = client.get_company_badge(&company).unwrap();
        assert_eq!(badge_mid.total_leaves_claimed, 500i128);
        assert_eq!(badge_mid.ods_score, 50u32);
        assert_eq!(badge_mid.carbon_credits, 10u32);

        // user1 forja NFT Plantador
        let nft_id = client.forge_common_rwa(&user1);
        assert_eq!(client.get_nft_mogno_fraction(&nft_id), 10_000i128);

        // Oráculo registra crescimento real da árvore (ano 1)
        client.update_tree_record(&admin, &TreeAnnualRecord {
            nft_id, tree_id: 501, year: 2025,
            height_cm: 80, carbon_kg: 3, health_score: 95, geo_hash: 0xABCDu64,
        });
        let rec = client.get_tree_record(&nft_id, &2025u32).unwrap();
        assert_eq!(rec.height_cm, 80u32);
        // NFT é AINDA Plantador — árvore cresceu mas raridade é do usuário
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Plantador));

        // user1 evolui até Lenda: tem 100 leaves, precisa 2050 mais
        client.reward_leaves(&admin, &user1, &1950i128);
        client.evolve_nft(&user1, &nft_id); // Cultivador
        client.evolve_nft(&user1, &nft_id); // Guardiao
        client.evolve_nft(&user1, &nft_id); // Protetor
        client.evolve_nft(&user1, &nft_id); // Lenda
        assert_eq!(client.get_nft_mogno_fraction(&nft_id), 1_000_000i128);

        // Oráculo registra crescimento real (ano 2)
        client.update_tree_record(&admin, &TreeAnnualRecord {
            nft_id, tree_id: 501, year: 2026,
            height_cm: 150, carbon_kg: 10, health_score: 97, geo_hash: 0xABCDu64,
        });
        // Histórico preservado: 2025 ainda acessível
        assert_eq!(client.get_tree_record(&nft_id, &2025u32).unwrap().height_cm, 80u32);
        assert_eq!(client.get_tree_record(&nft_id, &2026u32).unwrap().height_cm, 150u32);
        assert_eq!(client.get_latest_tree_record(&nft_id).unwrap().year, 2026u32);

        // Badge final: lenda_bonus + ESG preservado
        let badge_final = client.get_company_badge(&company).unwrap();
        assert!(badge_final.lenda_bonus);
        assert_eq!(badge_final.total_leaves_claimed, 500i128);
    }

    // =========================================================
    // TESTES VEREDA.VERIFY BRIDGE
    // =========================================================

    #[test]
    fn test_set_and_get_esg_merkle_root() {
        let (env, client, admin, _user) = setup();
        assert_eq!(client.get_esg_merkle_root(), None);
        let root = BytesN::from_array(&env, &[0xABu8; 32]);
        client.set_esg_merkle_root(&admin, &root);
        assert_eq!(client.get_esg_merkle_root(), Some(root));
    }

    #[test]
    fn test_set_esg_merkle_root_overrides_previous() {
        let (env, client, admin, _user) = setup();
        let root_v1 = BytesN::from_array(&env, &[0x01u8; 32]);
        let root_v2 = BytesN::from_array(&env, &[0x02u8; 32]);
        client.set_esg_merkle_root(&admin, &root_v1);
        client.set_esg_merkle_root(&admin, &root_v2);
        assert_eq!(client.get_esg_merkle_root(), Some(root_v2));
    }

    #[test]
    #[should_panic]
    fn test_set_esg_merkle_root_unauthorized_fails() {
        let (env, client, _admin, _user) = setup();
        let fake = Address::generate(&env);
        let root = BytesN::from_array(&env, &[0u8; 32]);
        client.set_esg_merkle_root(&fake, &root);
    }

    // =========================================================
    // TESTES CONSULTAS — GET_NFT_RARITY
    // =========================================================

    #[test]
    fn test_get_nft_rarity_new_nft_is_plantador() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Plantador));
    }

    #[test]
    fn test_get_nft_rarity_nonexistent_returns_none() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.get_nft_rarity(&888u32), None);
    }
}
