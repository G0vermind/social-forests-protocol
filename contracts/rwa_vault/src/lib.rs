// ============================================================
// Social Forest Protocol — RWA Vault Contract
// Token: Social Forest Mahogany RWA (MOGNO)
// Padrão: SEP-41 (Stellar Token Interface)
// Oráculo: Proof of Flourishing (admin_mint)
// ============================================================
#![no_std]

use soroban_sdk::{
    contract, contracterror, contractimpl, panic_with_error,
    Address, Env, String,
};

// ─────────────────────────────────────────────
// Chaves de Storage
// ─────────────────────────────────────────────

/// Chave para o administrador do contrato (instance storage — TTL curto)
const ADMIN_KEY: &str = "admin";

/// Prefixos para persistent storage (balances e allowances)
const BALANCE_PREFIX: &str = "bal";
const ALLOWANCE_PREFIX: &str = "alw";

// ─────────────────────────────────────────────
// Erros do Contrato
// ─────────────────────────────────────────────

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    /// Contrato já foi inicializado
    AlreadyInitialized = 1,
    /// Chamador não é o administrador
    Unauthorized = 2,
    /// Saldo insuficiente para a operação
    InsufficientBalance = 3,
    /// Allowance insuficiente para transfer_from
    InsufficientAllowance = 4,
    /// Valor negativo ou zero inválido
    InvalidAmount = 5,
}

// ─────────────────────────────────────────────
// Helpers de Storage
// ─────────────────────────────────────────────

/// Lê o saldo de um endereço (retorna 0 se não existir)
fn get_balance(env: &Env, addr: &Address) -> i128 {
    let key = (BALANCE_PREFIX, addr);
    env.storage()
        .persistent()
        .get::<_, i128>(&key)
        .unwrap_or(0)
}

/// Grava o saldo e faz bump de TTL (~30 dias em ledgers)
fn set_balance(env: &Env, addr: &Address, amount: i128) {
    let key = (BALANCE_PREFIX, addr);
    env.storage().persistent().set(&key, &amount);
    // TTL mínimo de 17.280 ledgers (~1 dia) e máximo de 518.400 (~30 dias)
    env.storage()
        .persistent()
        .extend_ttl(&key, 17_280, 518_400);
}

/// Lê o allowance (owner → spender), retorna 0 se não existir
fn get_allowance(env: &Env, owner: &Address, spender: &Address) -> i128 {
    let key = (ALLOWANCE_PREFIX, owner, spender);
    env.storage()
        .persistent()
        .get::<_, i128>(&key)
        .unwrap_or(0)
}

/// Grava o allowance e faz bump de TTL
fn set_allowance(env: &Env, owner: &Address, spender: &Address, amount: i128) {
    let key = (ALLOWANCE_PREFIX, owner, spender);
    env.storage().persistent().set(&key, &amount);
    env.storage()
        .persistent()
        .extend_ttl(&key, 17_280, 518_400);
}

/// Lê o administrador (instance storage)
fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get::<_, Address>(&ADMIN_KEY)
        .unwrap_or_else(|| panic_with_error!(env, ContractError::Unauthorized))
}

// ─────────────────────────────────────────────
// Definição do Contrato
// ─────────────────────────────────────────────

#[contract]
pub struct MognoVault;

#[contractimpl]
impl MognoVault {
    // ───── Inicialização ─────────────────────

    /// Inicializa o contrato com um administrador.
    /// Só pode ser chamada uma vez; panics com `AlreadyInitialized` se repetida.
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN_KEY) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        // Armazena o admin e estende TTL da instance (~30 dias)
        env.storage().instance().set(&ADMIN_KEY, &admin);
        env.storage().instance().extend_ttl(17_280, 518_400);
    }

    // ───── Admin Functions ───────────────────

    /// Mintagem restrita ao admin — acionada pelo Oráculo de Proof of Flourishing.
    /// `amount` deve ser positivo e expresso com 7 casas decimais (e.g., 1 MOGNO = 10_000_000).
    pub fn admin_mint(env: Env, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        let admin = get_admin(&env);
        // Exige autenticação criptográfica do administrador
        admin.require_auth();

        let current = get_balance(&env, &to);
        set_balance(&env, &to, current + amount);

        // Renova TTL da instance a cada operação
        env.storage().instance().extend_ttl(17_280, 518_400);
    }

    // ───── SEP-41: Token Metadata ─────────────

    /// Retorna o número de casas decimais do token (7, padrão Stellar)
    pub fn decimals(_env: Env) -> u32 {
        7
    }

    /// Nome completo do token
    pub fn name(env: Env) -> String {
        String::from_str(&env, "Social Forest Mahogany RWA")
    }

    /// Símbolo do token
    pub fn symbol(env: Env) -> String {
        String::from_str(&env, "MOGNO")
    }

    // ───── SEP-41: Balance & Allowance ────────

    /// Retorna o saldo do endereço `id`
    pub fn balance(env: Env, id: Address) -> i128 {
        get_balance(&env, &id)
    }

    /// Aprova `spender` a gastar até `amount` tokens em nome do chamador
    pub fn approve(env: Env, from: Address, spender: Address, amount: i128, _expiration_ledger: u32) {
        if amount < 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        from.require_auth();
        set_allowance(&env, &from, &spender, amount);
        env.storage().instance().extend_ttl(17_280, 518_400);
    }

    /// Retorna o allowance atual de `spender` para gastar tokens de `from`
    pub fn allowance(env: Env, from: Address, spender: Address) -> i128 {
        get_allowance(&env, &from, &spender)
    }

    /// Transfere `amount` tokens do chamador para `to`
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        from.require_auth();

        let from_balance = get_balance(&env, &from);
        if from_balance < amount {
            panic_with_error!(env, ContractError::InsufficientBalance);
        }

        set_balance(&env, &from, from_balance - amount);
        let to_balance = get_balance(&env, &to);
        set_balance(&env, &to, to_balance + amount);
        env.storage().instance().extend_ttl(17_280, 518_400);
    }

    /// Transfere `amount` de `from` para `to` usando allowance de `spender`
    pub fn transfer_from(
        env: Env,
        spender: Address,
        from: Address,
        to: Address,
        amount: i128,
    ) {
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        spender.require_auth();

        let allowance = get_allowance(&env, &from, &spender);
        if allowance < amount {
            panic_with_error!(env, ContractError::InsufficientAllowance);
        }
        let from_balance = get_balance(&env, &from);
        if from_balance < amount {
            panic_with_error!(env, ContractError::InsufficientBalance);
        }

        set_allowance(&env, &from, &spender, allowance - amount);
        set_balance(&env, &from, from_balance - amount);
        let to_balance = get_balance(&env, &to);
        set_balance(&env, &to, to_balance + amount);
        env.storage().instance().extend_ttl(17_280, 518_400);
    }
}

// ─────────────────────────────────────────────
// Testes
// ─────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    /// Configura o ambiente de teste e registra o contrato
    fn setup() -> (Env, MognoVaultClient<'static>, Address, Address) {
        let env = Env::default();
        // Desabilita verificação de auth nos testes (mock)
        env.mock_all_auths();

        let contract_id = env.register_contract(None, MognoVault);
        let client = MognoVaultClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);

        client.initialize(&admin);

        (env, client, admin, user)
    }

    // ─── Teste 1: admin_mint ───────────────────

    #[test]
    fn test_admin_mint_increases_balance() {
        let (_env, client, _admin, user) = setup();

        // Antes da mint, saldo é zero
        assert_eq!(client.balance(&user), 0);

        // Admin minta 100 MOGNO (7 decimais = 1_000_000_000)
        let amount: i128 = 100 * 10_000_000; // 100 MOGNO
        client.admin_mint(&user, &amount);

        // Verifica saldo atualizado
        assert_eq!(client.balance(&user), amount);
    }

    #[test]
    fn test_admin_mint_accumulates() {
        let (_env, client, _admin, user) = setup();

        client.admin_mint(&user, &10_000_000);
        client.admin_mint(&user, &20_000_000);

        assert_eq!(client.balance(&user), 30_000_000);
    }

    // ─── Teste 2: transfer ───────────────────

    #[test]
    fn test_transfer_moves_tokens() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);

        // Mint para o sender
        client.admin_mint(&sender, &50_000_000);

        // Transfere 20 MOGNO
        client.transfer(&sender, &receiver, &20_000_000);

        assert_eq!(client.balance(&sender), 30_000_000);
        assert_eq!(client.balance(&receiver), 20_000_000);
    }

    #[test]
    #[should_panic]
    fn test_transfer_fails_on_insufficient_balance() {
        let (env, client, _admin, sender) = setup();
        let receiver = Address::generate(&env);

        // Mint apenas 5 MOGNO, tenta transferir 10
        client.admin_mint(&sender, &5_000_000);
        client.transfer(&sender, &receiver, &10_000_000);
    }

    // ─── Teste 3: token metadata ─────────────

    #[test]
    fn test_token_metadata() {
        let (_env, client, _admin, _user) = setup();

        assert_eq!(client.decimals(), 7u32);
        // Verifica que name e symbol não causam panic
        let _ = client.name();
        let _ = client.symbol();
    }

    // ─── Teste 4: approve & transfer_from ────

    #[test]
    fn test_approve_and_transfer_from() {
        let (env, client, _admin, owner) = setup();
        let spender = Address::generate(&env);
        let receiver = Address::generate(&env);

        client.admin_mint(&owner, &100_000_000);
        client.approve(&owner, &spender, &50_000_000, &1_000_000u32);
        client.transfer_from(&spender, &owner, &receiver, &30_000_000);

        assert_eq!(client.balance(&owner), 70_000_000);
        assert_eq!(client.balance(&receiver), 30_000_000);
        assert_eq!(client.allowance(&owner, &spender), 20_000_000);
    }

    // ─── Teste 5: double initialize panics ───

    #[test]
    #[should_panic]
    fn test_double_initialize_fails() {
        let (_env, client, admin, _user) = setup();
        // Segunda chamada deve panics com AlreadyInitialized
        client.initialize(&admin);
    }
}
