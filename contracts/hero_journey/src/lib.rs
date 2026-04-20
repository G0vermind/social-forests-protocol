// ============================================================
// Social Forest Protocol — Hero Journey Contract
// Mecânica: Recompensas em Folhas → Forja de NFTs RWA
// Segurança: Auth, TTL, Fail-Fast Panics (CLAUDE.md compliant)
// ============================================================
#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    panic_with_error, symbol_short,
    Address, Env,
};

// ==========================================
// ESTRUTURAS DE DADOS E RARIDADE
// ==========================================

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Rarity {
    Common,    // Custa 100 Folhas
    Uncommon,  // Requer Fusão
    Rare,      // Requer Fusão
    Epic,      // Requer Fusão
    Legendary, // Requer Missões Máximas + Fusão
}

#[contracttype]
pub enum DataKey {
    Admin,
    LeavesBalance(Address),
    NFTCounter,
    NFTOwner(u32),
    NFTRarity(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized  = 1,
    Unauthorized        = 2,
    InvalidAmount       = 3,
    InsufficientLeaves  = 4,
}

// ── TTL: proteção contra State Expiration ────────────────────
const DAY_IN_LEDGERS: u32 = 17_280;
const TTL_THRESHOLD: u32  = 30 * DAY_IN_LEDGERS;  // ~30 dias
const TTL_EXTEND: u32     = 90 * DAY_IN_LEDGERS;  // ~90 dias

// ── Constante de forja ────────────────────────────────────────
const FORGE_COST: i128 = 100;

// ─────────────────────────────────────────────────────────────
#[contract]
pub struct HeroJourney;

#[contractimpl]
impl HeroJourney {
    // ───── Inicialização ─────────────────────────────────────

    /// Inicializa o contrato com a conta administradora (Tesouraria/Oráculo).
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NFTCounter, &0u32);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ───── Admin: Emissão de Folhas ──────────────────────────

    /// Recompensa o utilizador com 'Folhas' (Leaves).
    /// Apenas o Admin (Oráculo/x402) pode invocar.
    pub fn reward_leaves(env: Env, admin: Address, user: Address, amount: i128) {
        // Segurança: exige assinatura criptográfica do admin
        admin.require_auth();

        // Valida que o `admin` passado é o admin registado no contrato
        let expected_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::Unauthorized));
        if admin != expected_admin {
            panic_with_error!(env, ContractError::Unauthorized);
        }

        // Fail-fast: amount deve ser positivo
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }

        let key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        let new_balance = balance + amount;

        env.storage().persistent().set(&key, &new_balance);
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND); // Prevenção de perda de dados

        env.events()
            .publish((symbol_short!("reward"),), (user.clone(), amount));
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    // ───── Forja de NFT Comum ────────────────────────────────

    /// O utilizador queima 100 Folhas e Forja 1 NFT Comum (RWA).
    /// Requer assinatura do utilizador (ou Abstração de Conta via Fee Bump).
    pub fn forge_common_rwa(env: Env, user: Address) -> u32 {
        // Segurança: o utilizador tem de assinar a transação
        user.require_auth();

        let key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);

        if balance < FORGE_COST {
            panic_with_error!(env, ContractError::InsufficientLeaves);
        }

        // Deduzir folhas
        env.storage()
            .persistent()
            .set(&key, &(balance - FORGE_COST));
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);

        // Mintagem do NFT
        let mut nft_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0u32);
        nft_id += 1;
        env.storage()
            .instance()
            .set(&DataKey::NFTCounter, &nft_id);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        // Gravar dono e raridade com TTL
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

    // ───── Consultas ────────────────────────────────────────

    /// Consulta o saldo de Folhas de um utilizador.
    /// Read-Bump: renova o TTL se a chave existir.
    pub fn get_leaves(env: Env, user: Address) -> i128 {
        let key = DataKey::LeavesBalance(user);
        let balance: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        // Só faz bump se a chave realmente existe (evita panic em chave nova)
        if env.storage().persistent().has(&key) {
            env.storage()
                .persistent()
                .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);
        }
        balance
    }

    /// Consulta o dono de um NFT
    pub fn get_nft_owner(env: Env, nft_id: u32) -> Option<Address> {
        env.storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
    }

    /// Consulta o total de NFTs já emitidos
    pub fn get_nft_counter(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0)
    }
}

// ─────────────────────────────────────────────────────────────
// Testes
// ─────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    fn setup() -> (Env, HeroJourneyClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, HeroJourney);
        let client = HeroJourneyClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);

        (env, client, admin, user)
    }

    // ─── Inicialização ────────────────────────────────────────

    #[test]
    #[should_panic]
    fn test_double_initialize_fails() {
        let (_env, client, admin, _user) = setup();
        client.initialize(&admin);
    }

    // ─── reward_leaves ────────────────────────────────────────

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

    // ─── forge_common_rwa ─────────────────────────────────────

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
        // Deve restar 150 após queimar 100
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
        client.reward_leaves(&admin, &user, &99i128); // 1 folha a menos
        client.forge_common_rwa(&user);
    }

    #[test]
    #[should_panic]
    fn test_forge_with_zero_leaves_fails() {
        let (_env, client, _admin, user) = setup();
        client.forge_common_rwa(&user);
    }

    // ─── get_nft_owner ────────────────────────────────────────

    #[test]
    fn test_nft_owner_is_correct() {
        let (_env, client, admin, user) = setup();
        client.reward_leaves(&admin, &user, &100i128);
        let nft_id = client.forge_common_rwa(&user);
        let owner = client.get_nft_owner(&nft_id);
        assert_eq!(owner, Some(user));
    }

    #[test]
    fn test_nft_owner_of_nonexistent_returns_none() {
        let (_env, client, _admin, _user) = setup();
        let owner = client.get_nft_owner(&999u32);
        assert_eq!(owner, None);
    }
}
