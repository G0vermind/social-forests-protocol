#![no_std]
#![forbid(unsafe_code)]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env, String,
};

// =============================================================================
// EVENTOS FINANCEIROS (SEP-41)
// =============================================================================
#[contractevent(topics = ["token", "transfer"])]
pub struct EventTransfer {
    pub from: Address,
    pub to: Address,
    pub amount: i128,
}

#[contractevent(topics = ["token", "mint"])]
pub struct EventMint {
    pub to: Address,
    pub amount: i128,
}

#[contractevent(topics = ["token", "burn"])]
pub struct EventBurn {
    pub from: Address,
    pub amount: i128,
}

// =============================================================================
// ESTRUTURAS E ERROS
// =============================================================================
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum TokenError {
    AlreadyInitialized = 1,
    InsufficientBalance = 2,
    Unauthorized = 3,
    NegativeAmount = 4,
}

#[contracttype]
pub enum DataKey {
    Admin,
    PendingAdmin,
    Balance(Address),
    Metadata,
    TotalSupply,
}

// TTL Constants
const DAY_IN_LEDGERS: u32 = 17_280;
const BALANCE_TTL_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const BALANCE_TTL_BUMP: u32 = 60 * DAY_IN_LEDGERS;

// 1 bilhão de LEAF × 10^7 decimais = supply máximo
const MAX_SUPPLY: i128 = 1_000_000_000 * 10_000_000;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenMetadata {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
}

// =============================================================================
// IMPLEMENTAÇÃO DO TOKEN $LEAF
// =============================================================================
#[contract]
pub struct LeafToken;

#[contractimpl]
impl LeafToken {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String, decimals: u32) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, TokenError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSupply, &0i128);
        env.storage().instance().set(
            &DataKey::Metadata,
            &TokenMetadata {
                name,
                symbol,
                decimals,
            },
        );
    }

    /// 1. EMISSÃO (MINT): Usado no On-ramp B2B
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if amount < 0 {
            panic_with_error!(&env, TokenError::NegativeAmount);
        }

        let current_supply = Self::total_supply(env.clone());
        let new_supply = current_supply.checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::NegativeAmount));
        if new_supply > MAX_SUPPLY {
            panic_with_error!(&env, TokenError::NegativeAmount); // reuse error for cap exceeded
        }

        let balance = Self::balance(env.clone(), to.clone());
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to.clone()), &(balance + amount));
        env.storage().instance().set(&DataKey::TotalSupply, &new_supply);

        EventMint { to, amount }.publish(&env);
    }

    /// 2. QUEIMA (BURN): Usado para pagar Plantio/Forja
    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();
        if amount < 0 {
            panic_with_error!(&env, TokenError::NegativeAmount);
        }

        let balance = Self::balance(env.clone(), from.clone());
        if balance < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        env.storage()
            .persistent()
            .set(&DataKey::Balance(from.clone()), &(balance - amount));

        let current_supply = Self::total_supply(env.clone());
        env.storage().instance().set(&DataKey::TotalSupply, &(current_supply - amount));

        EventBurn { from, amount }.publish(&env);
    }

    /// 3. TRANSFERÊNCIA (PADRÃO)
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();
        if amount < 0 {
            panic_with_error!(&env, TokenError::NegativeAmount);
        }

        let balance_from = Self::balance(env.clone(), from.clone());
        if balance_from < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let balance_to = Self::balance(env.clone(), to.clone());
        env.storage()
            .persistent()
            .set(&DataKey::Balance(from.clone()), &(balance_from - amount));
        env.storage()
            .persistent()
            .set(&DataKey::Balance(to.clone()), &(balance_to + amount));

        EventTransfer { from, to, amount }.publish(&env);
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        let key = DataKey::Balance(id);
        let bal: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        if bal > 0 {
            env.storage().persistent().extend_ttl(&key, BALANCE_TTL_THRESHOLD, BALANCE_TTL_BUMP);
        }
        bal
    }

    // --- FUNÇÕES DE METADADOS ---
    pub fn name(env: Env) -> String {
        env.storage()
            .instance()
            .get::<_, TokenMetadata>(&DataKey::Metadata)
            .unwrap()
            .name
    }

    pub fn symbol(env: Env) -> String {
        env.storage()
            .instance()
            .get::<_, TokenMetadata>(&DataKey::Metadata)
            .unwrap()
            .symbol
    }

    pub fn decimals(env: Env) -> u32 {
        env.storage()
            .instance()
            .get::<_, TokenMetadata>(&DataKey::Metadata)
            .unwrap()
            .decimals
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0i128)
    }

    /// Two-step admin transfer: propose new admin
    pub fn propose_admin(env: Env, new_admin: Address) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::PendingAdmin, &new_admin);
    }

    /// Two-step admin transfer: new admin accepts
    pub fn accept_admin(env: Env) {
        let pending: Address = env.storage().instance().get(&DataKey::PendingAdmin)
            .unwrap_or_else(|| panic_with_error!(&env, TokenError::Unauthorized));
        pending.require_auth();
        env.storage().instance().set(&DataKey::Admin, &pending);
        env.storage().instance().remove(&DataKey::PendingAdmin);
    }
}


// =============================================================================
// TESTES UNITÁRIOS
// =============================================================================
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env, String as SorobanString};

    fn setup() -> (Env, LeafTokenClient<'static>, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register(LeafToken, ());
        let client = LeafTokenClient::new(&env, &contract_id);
        let admin = Address::generate(&env);
        let name = SorobanString::from_str(&env, "Social Forest Leaf Token");
        let symbol = SorobanString::from_str(&env, "LEAF");
        client.initialize(&admin, &name, &symbol, &7);
        (env, client, admin)
    }

    #[test]
    fn test_mint_and_balance() {
        let (env, client, _admin) = setup();
        let user = Address::generate(&env);
        client.mint(&user, &1_000_0000000);
        assert_eq!(client.balance(&user), 1_000_0000000);
    }

    #[test]
    fn test_transfer() {
        let (env, client, _admin) = setup();
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);
        client.mint(&alice, &5_000_0000000);
        client.transfer(&alice, &bob, &2_000_0000000);
        assert_eq!(client.balance(&alice), 3_000_0000000);
        assert_eq!(client.balance(&bob), 2_000_0000000);
    }

    #[test]
    fn test_burn() {
        let (env, client, _admin) = setup();
        let user = Address::generate(&env);
        client.mint(&user, &1_000_0000000);
        client.burn(&user, &400_0000000);
        assert_eq!(client.balance(&user), 600_0000000);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #2)")]
    fn test_burn_insufficient_balance() {
        let (env, client, _admin) = setup();
        let user = Address::generate(&env);
        client.mint(&user, &100_0000000);
        client.burn(&user, &200_0000000);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #1)")]
    fn test_double_initialize() {
        let (env, client, _admin) = setup();
        let other = Address::generate(&env);
        let name = SorobanString::from_str(&env, "X");
        let symbol = SorobanString::from_str(&env, "X");
        client.initialize(&other, &name, &symbol, &7);
    }

    #[test]
    fn test_metadata() {
        let (_env, client, _admin) = setup();
        assert_eq!(client.decimals(), 7);
    }
}
