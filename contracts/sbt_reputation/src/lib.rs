// ============================================================
// Social Forest Protocol — SBT Reputation Contract
// Token: Green Cashback / Impact Points (Soulbound)
// Padrão: SEP-41 read-only (non-transferable by design)
// Segurança: Certora Soroban Audit Guide Compliant
// ============================================================
#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype,
    panic_with_error, symbol_short,
    Address, Env,
};

// ─────────────────────────────────────────────
// Chaves de Storage com namespace tipado        [T1-T2 / T7]
// ─────────────────────────────────────────────

#[contracttype]
pub enum DataKey {
    Admin,
    Paused,
    VerifiedCompany(Address),
    ImpactPoints(Address),
}

// ─────────────────────────────────────────────
// Erros do Contrato                            [T1-T2 / T7]
// ─────────────────────────────────────────────

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    NotInitialized      = 1,
    AlreadyInitialized  = 2,
    NotAuthorized       = 3,
    CompanyNotVerified  = 4,
    InsufficientBalance = 5,
    ArithmeticOverflow  = 6,
    SupplyCapExceeded   = 7,
    ContractPaused      = 8,
    BatchTooLarge       = 9,
    InvalidAmount       = 10,
    TransferForbidden   = 11,
}

// ─────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────

fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get::<_, Address>(&DataKey::Admin)
        .unwrap_or_else(|| panic_with_error!(env, ContractError::NotInitialized))
}

fn assert_not_paused(env: &Env) {
    if env
        .storage()
        .instance()
        .get::<_, bool>(&DataKey::Paused)
        .unwrap_or(false)
    {
        panic_with_error!(env, ContractError::ContractPaused);
    }
}

fn get_points(env: &Env, addr: &Address) -> i128 {
    env.storage()
        .persistent()
        .get::<_, i128>(&DataKey::ImpactPoints(addr.clone()))
        .unwrap_or(0)
}

/// Grava pontos e faz TTL bump (~30 dias)       [T8]
fn set_points(env: &Env, addr: &Address, amount: i128) {
    let key = DataKey::ImpactPoints(addr.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, 100_000, 100_000);
}

// ─────────────────────────────────────────────
// Definição do Contrato
// ─────────────────────────────────────────────

#[contract]
pub struct SbtReputation;

#[contractimpl]
impl SbtReputation {
    // ───── Inicialização ─────────────────────

    /// Inicializa o contrato. Só pode ser chamada uma vez.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Paused, &false);
        env.storage().instance().extend_ttl(100_000, 100_000); // [T8]
    }

    // ───── Emergency Pause                    [T6] ─────────

    pub fn pause(env: Env) {
        let admin = get_admin(&env);
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &true);
        env.events().publish((symbol_short!("paused"),), ()); // [T3]
        env.storage().instance().extend_ttl(100_000, 100_000); // [T8]
    }

    pub fn unpause(env: Env) {
        let admin = get_admin(&env);
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &false);
        env.events().publish((symbol_short!("unpaused"),), ()); // [T3]
        env.storage().instance().extend_ttl(100_000, 100_000); // [T8]
    }

    // ───── Gestão de Empresas Verificadas     [T7] ─────────

    /// Regista uma empresa como verificada (KYC institucional).
    /// Apenas o admin pode chamar.
    pub fn register_company(env: Env, company: Address) {
        let admin = get_admin(&env);
        admin.require_auth();
        let key = DataKey::VerifiedCompany(company.clone());
        env.storage().persistent().set(&key, &true);
        env.storage().persistent().extend_ttl(&key, 200_000, 200_000); // [T8]
        env.events().publish((symbol_short!("reg_co"),), company.clone()); // [T3]
        env.storage().instance().extend_ttl(100_000, 100_000); // [T8]
    }

    /// Remove a verificação de uma empresa.
    pub fn revoke_company(env: Env, company: Address) {
        let admin = get_admin(&env);
        admin.require_auth();
        let key = DataKey::VerifiedCompany(company.clone());
        env.storage().persistent().set(&key, &false);
        env.events().publish((symbol_short!("rev_co"),), company.clone()); // [T3]
        env.storage().instance().extend_ttl(100_000, 100_000); // [T8]
    }

    /// Verifica se um endereço é empresa registada
    pub fn is_verified_company(env: Env, company: Address) -> bool {
        env.storage()
            .persistent()
            .get::<_, bool>(&DataKey::VerifiedCompany(company))
            .unwrap_or(false)
    }

    // ───── Green Cashback                     [T7] ─────────

    /// Distribui pontos de impacto (Green Cashback) a um utilizador.
    /// Pré-condições:
    ///   - Contrato não pausado
    ///   - `company` é verificada e assina a transação
    ///   - `amount` > 0
    /// Pós-condições:
    ///   - `impact_points(user)` aumenta por `amount`
    ///   - Evento `cashback` emitido
    pub fn distribute_green_cashback(env: Env, company: Address, user: Address, amount: i128) {
        assert_not_paused(&env); // [T6]

        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }

        // Exige auth da empresa e valida whitelist              [T7]
        company.require_auth();
        let is_verified: bool = env
            .storage()
            .persistent()
            .get::<_, bool>(&DataKey::VerifiedCompany(company.clone()))
            .unwrap_or(false);
        if !is_verified {
            panic_with_error!(env, ContractError::CompanyNotVerified);
        }

        // Checked arithmetic                                    [T4]
        let current = get_points(&env, &user);
        let new_points = current
            .checked_add(amount)
            .unwrap_or_else(|| panic_with_error!(&env, ContractError::ArithmeticOverflow));

        set_points(&env, &user, new_points);

        env.events().publish(
            (symbol_short!("cashback"),),
            (company.clone(), user.clone(), amount),
        ); // [T3]
        env.storage().instance().extend_ttl(100_000, 100_000); // [T8]
    }

    // ───── Consultas ─────────────────────────

    /// Retorna os pontos de impacto acumulados de um endereço
    pub fn impact_points(env: Env, addr: Address) -> i128 {
        get_points(&env, &addr)
    }

    // ───── Soulbound: transfer proibida       [T7] ─────────

    /// SBT são intransferíveis. Esta função existe para tornar a
    /// invariante explícita e testável — sempre falha.
    pub fn transfer(_env: Env, _from: Address, _to: Address, _amount: i128) {
        panic_with_error!(_env, ContractError::TransferForbidden);
    }
}

// ─────────────────────────────────────────────
// Testes                                       [T9]
// ─────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    fn setup() -> (Env, SbtReputationClient<'static>, Address, Address) {
        let env = Env::default();
        env.mock_all_auths();

        let contract_id = env.register_contract(None, SbtReputation);
        let client = SbtReputationClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let company = Address::generate(&env);

        client.initialize(&admin);

        (env, client, admin, company)
    }

    // ─── Empresa verificada pode distribuir cashback ───────

    #[test]
    fn test_cashback_verified_company() {
        let (env, client, _admin, company) = setup();
        let user = Address::generate(&env);

        client.register_company(&company);
        assert_eq!(client.impact_points(&user), 0);

        client.distribute_green_cashback(&company, &user, &500i128);
        assert_eq!(client.impact_points(&user), 500i128);
    }

    // ─── Empresa não verificada deve falhar ────────────────

    #[test]
    #[should_panic]
    fn test_cashback_unverified_company() {
        let (env, client, _admin, _company) = setup();
        let unverified = Address::generate(&env);
        let user = Address::generate(&env);
        // Sem register_company — deve panicar com CompanyNotVerified
        client.distribute_green_cashback(&unverified, &user, &100i128);
    }

    // ─── Invariante soulbound: transfer sempre falha ───────

    #[test]
    #[should_panic]
    fn test_soulbound_transfer_always_fails() {
        let (env, client, _admin, _company) = setup();
        let alice = Address::generate(&env);
        let bob = Address::generate(&env);
        // SBT não tem transfer — deve falhar com TransferForbidden
        client.transfer(&alice, &bob, &1i128);
    }

    // ─── Pontos acumulam corretamente ──────────────────────

    #[test]
    fn test_impact_accumulates_correctly() {
        let (env, client, _admin, company) = setup();
        let user = Address::generate(&env);

        client.register_company(&company);
        client.distribute_green_cashback(&company, &user, &100i128);
        client.distribute_green_cashback(&company, &user, &250i128);
        client.distribute_green_cashback(&company, &user, &150i128);

        assert_eq!(client.impact_points(&user), 500i128);
    }

    // ─── Pause bloqueia cashback ───────────────────────────

    #[test]
    #[should_panic]
    fn test_pause_blocks_cashback() {
        let (env, client, _admin, company) = setup();
        let user = Address::generate(&env);

        client.register_company(&company);
        client.pause();
        // Deve panicar com ContractPaused
        client.distribute_green_cashback(&company, &user, &100i128);
    }

    // ─── revoke_company invalida cashback ──────────────────

    #[test]
    #[should_panic]
    fn test_revoke_company_blocks_cashback() {
        let (env, client, _admin, company) = setup();
        let user = Address::generate(&env);

        client.register_company(&company);
        client.distribute_green_cashback(&company, &user, &100i128); // OK
        client.revoke_company(&company);
        client.distribute_green_cashback(&company, &user, &100i128); // Deve falhar
    }

    // ─── Dupla inicialização deve falhar ───────────────────

    #[test]
    #[should_panic]
    fn test_double_initialize_fails() {
        let (_env, client, admin, _company) = setup();
        client.initialize(&admin);
    }
}
