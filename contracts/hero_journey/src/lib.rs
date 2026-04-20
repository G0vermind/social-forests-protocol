// ============================================================
// Social Forest Protocol — Hero Journey Contract
// Mecânica: Recompensas em Folhas → Forja de NFTs RWA
//
// Camada B2B2C — Compensação ESG:
//   Empresa (B2B) → deposita LEAF no Pool de Missões
//   Usuário (B2C) → captura LEAF via missões patrocinadas
//   Badge ESG     → ativos de conformidade ODS/Carbono para o Dashboard B2B
//   NFT Legendary → desbloqueia Selos de Compensação Pesados (heavy badges)
//
// Segurança: Auth, TTL, Fail-Fast Panics (CLAUDE.md compliant)
// ============================================================
#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    panic_with_error, symbol_short,
    Address, Env,
};

// TODO(enzo): Verificar com o Vini se 100 folhas é o balanço ideal para o MVP B2C
//             ou se devemos reduzir para 50 na fase inicial de testes na Testnet.
// FIXME: A extensão do TTL está hardcoded para 90 dias. Precisamos parametrizar
//        futuramente para alinhar com o ciclo de vida real do Mogno.
// NOTA ARQUITETURAL: O SEP-08 ainda não está totalmente integrado no contrato de
//        jornada. Por enquanto, a tesouraria assume custódia provisória.
// TODO(b2b): Futuramente, `register_partner` deve ser delegado ao sbt_reputation
//        via cross-contract call para reuso da whitelist institucional (KYC).

// ==========================================
// RARIDADE DO NFT RWA
// ==========================================

/// Escala de raridade do NFT RWA (Mogno Africano).
/// Cada nível representa um estágio de maturidade do ativo florestal.
/// A evolução para Legendary desbloqueia selos ESG pesados no painel B2B.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Rarity {
    Common,    // Forjado com 100 Folhas — estágio inicial
    Uncommon,  // Fusão: +50 Folhas — ativo em crescimento
    Rare,      // Fusão: +50 Folhas — árvore jovem estabelecida
    Epic,      // Fusão: +50 Folhas — floresta madura
    Legendary, // Fusão: +50 Folhas — carbono certificável; desbloqueia heavy badges B2B
}

// ==========================================
// SELOS ESG (B2B DASHBOARD)
// ==========================================

/// Selos de Compensação ESG da Empresa Parceira.
///
/// Este struct é o ativo de conformidade central do modelo B2B2C:
/// cada folha capturada por clientes (B2C) via pool da empresa (B2B)
/// incrementa os contadores de ODS e Créditos de Carbono verificáveis.
/// Quando um cliente evolui seu NFT para Legendary, o `legendary_bonus`
/// é ativado, desbloqueando selos de compensação mais pesados no painel.
///
/// Fluxo:
///   Empresa deposita LEAF → Pool → Cliente captura → Badge acumula
///   NFT Legendary do cliente → legendary_bonus = true (heavy badges)
#[contracttype]
#[derive(Clone, Debug)]
pub struct CompanyBadge {
    /// Endereço da empresa parceira registada
    pub company: Address,
    /// Total de folhas capturadas por clientes via pool de missões desta empresa
    pub total_leaves_claimed: i128,
    /// Pontuação ODS acumulada: 1 ponto por cada 10 folhas capturadas
    /// (alinhado com os 17 Objetivos de Desenvolvimento Sustentável da ONU)
    pub ods_score: u32,
    /// Créditos de Carbono verificáveis: 1 crédito por cada 50 folhas capturadas
    /// (representa toneladas de CO₂ sequestradas pela floresta patrocinada)
    pub carbon_credits: u32,
    /// Desbloqueado quando ≥1 cliente evolui NFT para Legendary.
    /// Ativa selos de compensação de alta relevância no painel ESG B2B.
    pub legendary_bonus: bool,
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

    // ── B2B: Parceiros e Pool de Missões ──
    /// bool: empresa está registada como parceira B2B
    Partner(Address),
    /// i128: saldo de LEAF disponível no pool de missões da empresa
    MissionPool(Address),
    /// CompanyBadge: selos ESG e métricas de conformidade da empresa
    CompanyBadge(Address),
    /// Address: última empresa B2B associada ao user via claim_mission_leaf
    /// Usado para rastrear qual empresa recebe o legendary_bonus quando
    /// o NFT do user evolui para Legendary.
    UserCompany(Address),
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
    /// Pool de missões da empresa não tem folhas suficientes para o claim
    MissionPoolEmpty    = 5,
    /// Endereço não está registado como Parceira B2B do protocolo
    CompanyNotPartner   = 6,
    /// NFT não pertence ao utilizador que tenta evoluí-lo
    NftNotOwned         = 7,
    /// NFT já se encontra na raridade máxima (Legendary) — não pode evoluir mais
    AlreadyLegendary    = 8,
}

// ==========================================
// CONSTANTES
// ==========================================

// ── TTL: proteção contra State Expiration ─
const DAY_IN_LEDGERS: u32 = 17_280;
const TTL_THRESHOLD: u32  = 30 * DAY_IN_LEDGERS;  // ~30 dias
const TTL_EXTEND: u32     = 90 * DAY_IN_LEDGERS;  // ~90 dias

// ── Economia de Folhas ─────────────────────
/// Custo em Folhas para forjar um NFT Common (entrada na jornada)
const FORGE_COST: i128     = 100;
/// Custo em Folhas para evoluir o NFT um nível (fusão)
const EVOLVE_COST: i128    = 50;

// ── Thresholds ESG (B2B Badge) ─────────────
/// Folhas necessárias para ganhar 1 ponto de ODS
const ODS_DIVISOR: i128    = 10;
/// Folhas necessárias para ganhar 1 Crédito de Carbono verificável
const CARBON_DIVISOR: i128 = 50;

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

    /// Inicializa o contrato com a conta administradora (Tesouraria/Oráculo).
    /// Só pode ser chamada uma vez; panics com `AlreadyInitialized` se repetida.
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

    /// Valida que `caller` é o admin registado no contrato.
    fn assert_admin(env: &Env, caller: &Address) {
        let admin = Self::get_admin(env);
        if *caller != admin {
            panic_with_error!(env, ContractError::Unauthorized);
        }
    }

    /// Valida que `company` é uma empresa parceira registada.
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
    // ADMIN: EMISSÃO DE FOLHAS (B2C direto — Oráculo)
    // ──────────────────────────────────────────────────────────

    /// Recompensa o utilizador com Folhas (Leaves).
    /// Ativado pelo Oráculo após verificação de Proof of Flourishing.
    /// Apenas o Admin pode invocar.
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

        env.events().publish((symbol_short!("reward"),), (user.clone(), amount));
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // B2B: GESTÃO DE PARCEIROS
    // ──────────────────────────────────────────────────────────

    /// Regista uma empresa como Parceira B2B do protocolo Social Forest.
    ///
    /// Cria o `CompanyBadge` inicial zerado e inicializa o pool de missões.
    /// A empresa passa a poder depositar Folhas no pool via `distribute_leaves`.
    ///
    /// No modelo B2B2C: a empresa paga para patrocinar missões de sustentabilidade
    /// que os seus clientes (B2C) realizam, gerando impacto ESG rastreável on-chain.
    ///
    /// Apenas o Admin (Tesouraria) pode registar parceiros.
    pub fn register_partner(env: Env, admin: Address, company: Address) {
        admin.require_auth();
        Self::assert_admin(&env, &admin);

        // Registar como parceira
        let partner_key = DataKey::Partner(company.clone());
        env.storage().persistent().set(&partner_key, &true);
        env.storage().persistent().extend_ttl(&partner_key, TTL_THRESHOLD, TTL_EXTEND);

        // Criar CompanyBadge inicial (se não existir, preservar badge existente em re-registro)
        let badge_key = DataKey::CompanyBadge(company.clone());
        if !env.storage().persistent().has(&badge_key) {
            let initial_badge = CompanyBadge {
                company: company.clone(),
                total_leaves_claimed: 0,
                ods_score: 0,
                carbon_credits: 0,
                legendary_bonus: false,
            };
            env.storage().persistent().set(&badge_key, &initial_badge);
            env.storage().persistent().extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        // Inicializar pool de missões
        let pool_key = DataKey::MissionPool(company.clone());
        if !env.storage().persistent().has(&pool_key) {
            env.storage().persistent().set(&pool_key, &0i128);
            env.storage().persistent().extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        env.events().publish((symbol_short!("reg_ptr"),), company.clone());
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // B2B: DISTRIBUIÇÃO DE FOLHAS PARA O POOL DE MISSÕES
    // ──────────────────────────────────────────────────────────

    /// A empresa parceira deposita tokens LEAF no seu pool de missões.
    ///
    /// Estes tokens são a "verba de patrocínio" da empresa: cada LEAF depositado
    /// será resgatado por um cliente (B2C) ao completar missões de sustentabilidade.
    /// O pool é uma reserva on-chain auditável que garante transparência ESG.
    ///
    /// Pré-condições:
    ///   - `company` assina a transação
    ///   - `company` está registada como parceira B2B
    ///   - `amount` > 0
    ///
    /// Pós-condições:
    ///   - `MissionPool(company)` aumenta por `amount`
    ///   - Evento `dist_lf` emitido (rastreável no Dashboard B2B)
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
        env.storage().persistent().extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);

        // Renovar TTL do badge da empresa
        let badge_key = DataKey::CompanyBadge(company.clone());
        if env.storage().persistent().has(&badge_key) {
            env.storage().persistent().extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        env.events()
            .publish((symbol_short!("dist_lf"),), (company.clone(), amount));
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // B2B2C: CAPTURA DE FOLHAS PELO USUÁRIO (MISSÃO)
    // ──────────────────────────────────────────────────────────

    /// O Oráculo (Admin) confirma que o utilizador completou uma missão
    /// patrocinada pela empresa parceira e libera Folhas do pool B2B.
    ///
    /// Este é o coração do modelo B2B2C:
    ///   • Empresa B2B financia o pool → Oráculo valida o impacto real →
    ///     Usuário B2C recebe Folhas → Badge ESG da empresa é atualizado
    ///
    /// O evento `leaf_clm` é captado pelo Dashboard B2B da empresa,
    /// fornecendo rastreabilidade em tempo real do impacto comunitário.
    ///
    /// Pré-condições:
    ///   - Admin assina a transação
    ///   - `company` é parceira registada
    ///   - Pool da empresa tem ≥ `amount` folhas
    ///   - `amount` > 0
    ///
    /// Pós-condições:
    ///   - `MissionPool(company)` decresce por `amount`
    ///   - `LeavesBalance(user)` cresce por `amount`
    ///   - `CompanyBadge.total_leaves_claimed` atualizado
    ///   - `CompanyBadge.ods_score` = total / ODS_DIVISOR (1 pt / 10 folhas)
    ///   - `CompanyBadge.carbon_credits` = total / CARBON_DIVISOR (1 créd / 50 folhas)
    ///   - `UserCompany(user)` → `company` (rastreio para legendary_bonus)
    ///   - Evento `leaf_clm` emitido → Dashboard B2B
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
        env.storage().persistent().extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);

        // Creditar folhas ao utilizador
        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        let new_balance = balance
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InvalidAmount));
        env.storage().persistent().set(&bal_key, &new_balance);
        env.storage().persistent().extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        // Atualizar CompanyBadge ESG — o impacto comunitário vira ativo de conformidade
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
                legendary_bonus: false,
            });

        badge.total_leaves_claimed = badge
            .total_leaves_claimed
            .checked_add(amount)
            .unwrap_or(badge.total_leaves_claimed); // saturação silenciosa em overflow extremo

        // Recalcular selos ESG com base no total acumulado
        badge.ods_score     = (badge.total_leaves_claimed / ODS_DIVISOR) as u32;
        badge.carbon_credits = (badge.total_leaves_claimed / CARBON_DIVISOR) as u32;

        env.storage().persistent().set(&badge_key, &badge);
        env.storage().persistent().extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);

        // Registar associação user → empresa (para legendary_bonus em evolve_nft)
        let uc_key = DataKey::UserCompany(user.clone());
        env.storage().persistent().set(&uc_key, &company);
        env.storage().persistent().extend_ttl(&uc_key, TTL_THRESHOLD, TTL_EXTEND);

        // Evento para o Dashboard B2B — rastreabilidade em tempo real
        env.events().publish(
            (symbol_short!("leaf_clm"),),
            (company.clone(), user.clone(), amount),
        );
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ──────────────────────────────────────────────────────────
    // NFT RWA: FORJA (ENTRADA NA JORNADA)
    // ──────────────────────────────────────────────────────────

    /// O utilizador queima 100 Folhas e Forja 1 NFT RWA Common (Mogno Africano).
    /// Requer assinatura do utilizador (ou Abstração de Conta via Fee Bump).
    pub fn forge_common_rwa(env: Env, user: Address) -> u32 {
        user.require_auth();

        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);

        if balance < FORGE_COST {
            panic_with_error!(env, ContractError::InsufficientLeaves);
        }

        // Queimar folhas
        env.storage()
            .persistent()
            .set(&bal_key, &(balance - FORGE_COST));
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        // Mintagem: incrementar contador global de NFTs
        let mut nft_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0u32);
        nft_id += 1;
        env.storage().instance().set(&DataKey::NFTCounter, &nft_id);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        // Gravar metadados do NFT
        env.storage()
            .persistent()
            .set(&DataKey::NFTOwner(nft_id), &user);
        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &Rarity::Common);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTOwner(nft_id), TTL_THRESHOLD, TTL_EXTEND);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTRarity(nft_id), TTL_THRESHOLD, TTL_EXTEND);

        env.events()
            .publish((symbol_short!("forge"),), (user.clone(), nft_id));

        nft_id
    }

    // ──────────────────────────────────────────────────────────
    // NFT RWA: EVOLUÇÃO DE RARIDADE (B2B2C UPGRADE)
    // ──────────────────────────────────────────────────────────

    /// Evolui o NFT `nft_id` para o próximo nível de raridade, queimando
    /// EVOLVE_COST (50) Folhas do utilizador.
    ///
    /// Escala de evolução (custo acumulado):
    ///   Common (0) → Uncommon (50) → Rare (100) → Epic (150) → Legendary (200)
    ///
    /// Quando o NFT atinge `Legendary`, o contrato:
    ///   1. Verifica se o user completou missões via pool B2B (`UserCompany`)
    ///   2. Ativa `legendary_bonus = true` no `CompanyBadge` da empresa
    ///   3. Emite evento `lgnd_bon` → selos pesados desbloqueados no Dashboard B2B
    ///
    /// Pré-condições:
    ///   - `user` assina e é dono do NFT
    ///   - `user` tem ≥ 50 Folhas
    ///   - NFT não está já em Legendary
    ///
    /// Pós-condições:
    ///   - `LeavesBalance(user)` decresce por 50
    ///   - `NFTRarity(nft_id)` sobe um nível
    ///   - Se Legendary: `CompanyBadge.legendary_bonus = true` + evento `lgnd_bon`
    ///   - Evento `evolve` emitido
    pub fn evolve_nft(env: Env, user: Address, nft_id: u32) -> Rarity {
        user.require_auth();

        // Verificar propriedade do NFT
        let owner: Address = env
            .storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::NftNotOwned));
        if owner != user {
            panic_with_error!(env, ContractError::NftNotOwned);
        }

        // Verificar raridade atual
        let current_rarity: Rarity = env
            .storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
            .unwrap_or(Rarity::Common);
        if current_rarity == Rarity::Legendary {
            panic_with_error!(env, ContractError::AlreadyLegendary);
        }

        // Verificar folhas suficientes
        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        if balance < EVOLVE_COST {
            panic_with_error!(env, ContractError::InsufficientLeaves);
        }

        // Queimar folhas de fusão
        let new_balance = balance
            .checked_sub(EVOLVE_COST)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::InsufficientLeaves));
        env.storage().persistent().set(&bal_key, &new_balance);
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        // Calcular nova raridade
        let new_rarity = match current_rarity {
            Rarity::Common   => Rarity::Uncommon,
            Rarity::Uncommon => Rarity::Rare,
            Rarity::Rare     => Rarity::Epic,
            Rarity::Epic     => Rarity::Legendary,
            // Caso Legendary já tratado acima; ramo aqui satisfaz o compilador
            Rarity::Legendary => panic_with_error!(env, ContractError::AlreadyLegendary),
        };

        // Gravar nova raridade com TTL renovado
        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &new_rarity);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTRarity(nft_id), TTL_THRESHOLD, TTL_EXTEND);
        env.storage()
            .persistent()
            .extend_ttl(&DataKey::NFTOwner(nft_id), TTL_THRESHOLD, TTL_EXTEND);

        // ── LEGENDARY UNLOCK: ativa selos pesados no Dashboard B2B ──────────
        // Quando o cliente B2C evolui para Legendary, o esforço comunitário
        // converte-se em ativo ESG de alto valor para a empresa parceira B2B.
        if new_rarity == Rarity::Legendary {
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
                    badge.legendary_bonus = true;
                    env.storage().persistent().set(&badge_key, &badge);
                    env.storage()
                        .persistent()
                        .extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);

                    // Evento: Selos de Compensação Pesados desbloqueados → Dashboard B2B
                    env.events().publish(
                        (symbol_short!("lgnd_bon"),),
                        (company.clone(), user.clone(), nft_id),
                    );
                }
            }
        }

        // Evento de evolução (capturado pelo frontend B2C)
        env.events().publish(
            (symbol_short!("evolve"),),
            (user.clone(), nft_id, new_rarity.clone()),
        );
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        new_rarity
    }

    // ──────────────────────────────────────────────────────────
    // CONSULTAS — B2B DASHBOARD
    // ──────────────────────────────────────────────────────────

    /// Retorna o CompanyBadge (estado ESG completo) de uma empresa parceira.
    /// Utilizado pelo Dashboard B2B para renderizar ODS, Carbono e heavy badges.
    pub fn get_company_badge(env: Env, company: Address) -> Option<CompanyBadge> {
        env.storage()
            .persistent()
            .get(&DataKey::CompanyBadge(company))
    }

    /// Retorna o saldo atual do pool de missões de uma empresa.
    /// Empresa pode validar se há orçamento disponível antes de novas campanhas.
    pub fn get_mission_pool(env: Env, company: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::MissionPool(company))
            .unwrap_or(0)
    }

    /// Verifica se um endereço está registado como Parceira B2B.
    pub fn is_partner(env: Env, company: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::Partner(company))
            .unwrap_or(false)
    }

    // ──────────────────────────────────────────────────────────
    // CONSULTAS — B2C / JORNADA
    // ──────────────────────────────────────────────────────────

    /// Consulta o saldo de Folhas de um utilizador.
    /// Read-Bump: renova o TTL se a chave existir (evita expiração passiva).
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

    /// Consulta o dono de um NFT RWA.
    pub fn get_nft_owner(env: Env, nft_id: u32) -> Option<Address> {
        env.storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
    }

    /// Consulta a raridade atual de um NFT RWA.
    pub fn get_nft_rarity(env: Env, nft_id: u32) -> Option<Rarity> {
        env.storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
    }

    /// Consulta o total de NFTs já emitidos pelo protocolo.
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
    use soroban_sdk::Env;

    /// Helper: configura ambiente padrão com admin e um user genérico.
    fn setup() -> (Env, HeroJourneyClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, HeroJourney);
        let client = HeroJourneyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user  = Address::generate(&env);

        client.initialize(&admin);

        (env, client, admin, user)
    }

    /// Helper: configura ambiente com empresa parceira B2B já registada.
    fn setup_with_partner() -> (Env, HeroJourneyClient<'static>, Address, Address, Address) {
        let (env, client, admin, user) = setup();
        let company = Address::generate(&env);
        client.register_partner(&admin, &company);
        (env, client, admin, user, company)
    }

    // =========================================================
    // TESTES ORIGINAIS (preservados + hardening)
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
        let fake_admin = Address::generate(&env);
        client.reward_leaves(&fake_admin, &user, &100i128);
    }

    #[test]
    #[should_panic]
    fn test_reward_leaves_zero_amount_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &0i128);
    }

    #[test]
    #[should_panic]
    fn test_reward_leaves_negative_amount_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &-1i128);
    }

    #[test]
    fn test_forge_common_rwa_succeeds() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(nft_id, 1u32);
        assert_eq!(client.get_leaves(&user), 0i128);
        assert_eq!(client.get_nft_counter(), 1u32);
    }

    #[test]
    fn test_forge_burns_exactly_100_leaves() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &250i128);
        client.forge_common_rwa(&user);
        assert_eq!(client.get_leaves(&user), 150i128);
    }

    #[test]
    fn test_forge_multiple_nfts_increments_counter() {
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
    fn test_forge_with_zero_leaves_fails() {
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
    fn test_nft_owner_of_nonexistent_returns_none() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.get_nft_owner(&999u32), None);
    }

    // =========================================================
    // TESTES B2B: GESTÃO DE PARCEIROS
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
        assert!(!badge.legendary_bonus);
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
        let fake_admin = Address::generate(&env);
        let company    = Address::generate(&env);
        client.register_partner(&fake_admin, &company);
    }

    // =========================================================
    // TESTES B2B: DISTRIBUTE_LEAVES (POOL DE MISSÕES)
    // =========================================================

    #[test]
    fn test_distribute_leaves_increases_pool() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        assert_eq!(client.get_mission_pool(&company), 0i128);
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
    fn test_distribute_leaves_unregistered_company_fails() {
        let (env, client, _admin, _user) = setup();
        let unregistered = Address::generate(&env);
        client.distribute_leaves(&unregistered, &100i128);
    }

    #[test]
    #[should_panic]
    fn test_distribute_leaves_zero_amount_fails() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        client.distribute_leaves(&company, &0i128);
    }

    #[test]
    #[should_panic]
    fn test_distribute_leaves_negative_amount_fails() {
        let (_env, client, _admin, _user, company) = setup_with_partner();
        client.distribute_leaves(&company, &-10i128);
    }

    // =========================================================
    // TESTES B2B2C: CLAIM_MISSION_LEAF
    // =========================================================

    #[test]
    fn test_claim_mission_leaf_credits_user() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &200i128);
        client.claim_mission_leaf(&admin, &user, &company, &50i128);
        assert_eq!(client.get_leaves(&user), 50i128);
    }

    #[test]
    fn test_claim_mission_leaf_debits_pool() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &200i128);
        client.claim_mission_leaf(&admin, &user, &company, &50i128);
        assert_eq!(client.get_mission_pool(&company), 150i128);
    }

    #[test]
    fn test_claim_updates_ods_score() {
        let (_env, client, admin, user, company) = setup_with_partner();
        // 100 folhas → ods_score = 100 / 10 = 10
        client.distribute_leaves(&company, &200i128);
        client.claim_mission_leaf(&admin, &user, &company, &100i128);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.ods_score, 10u32);
        assert_eq!(badge.total_leaves_claimed, 100i128);
    }

    #[test]
    fn test_claim_updates_carbon_credits() {
        let (_env, client, admin, user, company) = setup_with_partner();
        // 150 folhas → carbon_credits = 150 / 50 = 3
        client.distribute_leaves(&company, &300i128);
        client.claim_mission_leaf(&admin, &user, &company, &150i128);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.carbon_credits, 3u32);
    }

    #[test]
    fn test_claim_badge_accumulates_across_multiple_users() {
        let (env, client, admin, user1, company) = setup_with_partner();
        let user2 = Address::generate(&env);
        client.distribute_leaves(&company, &500i128);
        // user1 captura 100, user2 captura 150 → total = 250
        client.claim_mission_leaf(&admin, &user1, &company, &100i128);
        client.claim_mission_leaf(&admin, &user2, &company, &150i128);
        let badge = client.get_company_badge(&company).unwrap();
        assert_eq!(badge.total_leaves_claimed, 250i128);
        assert_eq!(badge.ods_score, 25u32);          // 250 / 10
        assert_eq!(badge.carbon_credits, 5u32);      // 250 / 50
    }

    #[test]
    #[should_panic]
    fn test_claim_exceeds_pool_fails() {
        let (_env, client, admin, user, company) = setup_with_partner();
        client.distribute_leaves(&company, &30i128);
        // Tentar capturar mais do que o pool tem
        client.claim_mission_leaf(&admin, &user, &company, &50i128);
    }

    #[test]
    #[should_panic]
    fn test_claim_from_empty_pool_fails() {
        let (_env, client, admin, user, company) = setup_with_partner();
        // Pool zerado — nenhum depósito feito
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
        let fake_admin = Address::generate(&env);
        client.distribute_leaves(&company, &100i128);
        client.claim_mission_leaf(&fake_admin, &user, &company, &10i128);
    }

    // =========================================================
    // TESTES NFT: EVOLUÇÃO DE RARIDADE
    // =========================================================

    #[test]
    fn test_evolve_nft_common_to_uncommon() {
        let (_env, client, admin, user) = setup();
        // 100 (forge) + 50 (evolve) = 150 folhas
        client.reward_leaves(&admin, &user, &150i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Common));
        let new_rarity = client.evolve_nft(&user, &nft_id);
        assert_eq!(new_rarity, Rarity::Uncommon);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Uncommon));
        assert_eq!(client.get_leaves(&user), 0i128); // 150 - 100 - 50 = 0
    }

    #[test]
    fn test_evolve_nft_full_chain_to_legendary() {
        let (_env, client, admin, user) = setup();
        // Custo total: 100 (forge) + 4 * 50 (evolve) = 300
        client.reward_leaves(&admin, &user, &300i128);
        let nft_id = client.forge_common_rwa(&user);

        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Uncommon);
        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Rare);
        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Epic);
        assert_eq!(client.evolve_nft(&user, &nft_id), Rarity::Legendary);

        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Legendary));
        assert_eq!(client.get_leaves(&user), 0i128);
    }

    #[test]
    #[should_panic]
    fn test_evolve_nft_already_legendary_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &350i128); // 300 para chegar a Legendary + 50 extra
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id); // chega a Legendary
        client.evolve_nft(&user, &nft_id); // deve falhar com AlreadyLegendary
    }

    #[test]
    #[should_panic]
    fn test_evolve_nft_insufficient_leaves_fails() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128); // exato para forge, nada para evolve
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id); // deve falhar
    }

    #[test]
    #[should_panic]
    fn test_evolve_nft_wrong_owner_fails() {
        let (env, client, admin, user) = setup();
        let other = Address::generate(&env);
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        client.reward_leaves(&admin, &other, &50i128);
        // `other` tenta evoluir NFT do `user`
        client.evolve_nft(&other, &nft_id);
    }

    #[test]
    #[should_panic]
    fn test_evolve_nonexistent_nft_fails() {
        let (_env, client, _admin, user) = setup();
        client.evolve_nft(&user, &999u32);
    }

    // =========================================================
    // TESTES B2B2C: LEGENDARY BONUS → DASHBOARD B2B
    // =========================================================

    #[test]
    fn test_legendary_bonus_activated_for_b2b_partner() {
        let (_env, client, admin, user, company) = setup_with_partner();

        // Empresa deposita no pool e usuário captura (associa user → company)
        client.distribute_leaves(&company, &500i128);
        client.claim_mission_leaf(&admin, &user, &company, &10i128);

        // Verificar que legendary_bonus ainda está false
        let badge_before = client.get_company_badge(&company).unwrap();
        assert!(!badge_before.legendary_bonus);

        // Evoluir NFT até Legendary: 100 (forge) + 4*50 (evolve) = 300 folhas
        // Já tem 10 do claim; precisa de 290 a mais
        client.reward_leaves(&admin, &user, &290i128);
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id); // → Legendary

        // Badge da empresa deve ter legendary_bonus = true
        let badge_after = client.get_company_badge(&company).unwrap();
        assert!(badge_after.legendary_bonus);
    }

    #[test]
    fn test_legendary_bonus_not_activated_without_b2b_association() {
        // User que nunca fez claim_mission_leaf → não há UserCompany → sem bonus
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &300i128);
        let nft_id = client.forge_common_rwa(&user);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        client.evolve_nft(&user, &nft_id);
        let rarity = client.evolve_nft(&user, &nft_id);
        // Deve ser Legendary sem erros, mas sem badge B2B afetado
        assert_eq!(rarity, Rarity::Legendary);
    }

    #[test]
    fn test_full_b2b2c_esg_flow() {
        // Teste de integração completo do fluxo B2B2C
        let (env, client, admin, user1, company) = setup_with_partner();
        let user2 = Address::generate(&env);

        // 1. Empresa deposita 1000 LEAF no pool de missões
        client.distribute_leaves(&company, &1000i128);
        assert_eq!(client.get_mission_pool(&company), 1000i128);

        // 2. user1 captura 200 folhas via missão B2B
        client.claim_mission_leaf(&admin, &user1, &company, &200i128);
        // 3. user2 captura 300 folhas via missão B2B
        client.claim_mission_leaf(&admin, &user2, &company, &300i128);

        // Verificar pool e badge intermediários
        assert_eq!(client.get_mission_pool(&company), 500i128);
        let badge_mid = client.get_company_badge(&company).unwrap();
        assert_eq!(badge_mid.total_leaves_claimed, 500i128);
        assert_eq!(badge_mid.ods_score, 50u32);       // 500 / 10
        assert_eq!(badge_mid.carbon_credits, 10u32);  // 500 / 50

        // 4. user1 forja NFT (usa 100 das 200 que capturou, sobram 100)
        let nft_id = client.forge_common_rwa(&user1);
        assert_eq!(client.get_leaves(&user1), 100i128);

        // 5. user1 acumula mais folhas para evoluir até Legendary
        // Já tem 100, precisa de 4*50=200 para 4 evoluções → precisa de +100
        client.reward_leaves(&admin, &user1, &100i128);
        client.evolve_nft(&user1, &nft_id); // → Uncommon
        client.evolve_nft(&user1, &nft_id); // → Rare
        client.evolve_nft(&user1, &nft_id); // → Epic
        client.evolve_nft(&user1, &nft_id); // → Legendary

        // 6. Verificar que legendary_bonus foi ativado no badge da empresa
        let badge_final = client.get_company_badge(&company).unwrap();
        assert!(badge_final.legendary_bonus);
        assert_eq!(badge_final.total_leaves_claimed, 500i128); // unchanged by evolve
        assert_eq!(badge_final.ods_score, 50u32);
        assert_eq!(badge_final.carbon_credits, 10u32);
    }

    // =========================================================
    // TESTES DE CONSULTA — GET_NFT_RARITY
    // =========================================================

    #[test]
    fn test_get_nft_rarity_new_nft_is_common() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Common));
    }

    #[test]
    fn test_get_nft_rarity_nonexistent_returns_none() {
        let (_env, client, _admin, _user) = setup();
        assert_eq!(client.get_nft_rarity(&888u32), None);
    }
}
