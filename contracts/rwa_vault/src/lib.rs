#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum VaultError {
    NotInitialized = 1,
    Unauthorized = 2,
    InsufficientCollateral = 3,
    AssetLocked = 4,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct CollateralRecord {
    pub user: Address,
    pub nft_id: u32,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Oracle,
    Collateral(Address, u32),
    CCredBalance(Address),
    TotalCCred,
}

#[contractevent(topics = ["vault", "deposit"])]
pub struct EventDeposit {
    pub user: Address,
    pub nft_id: u32,
}

#[contractevent(topics = ["vault", "mint_ccred"])]
pub struct EventMintCCred {
    pub user: Address,
    pub amount: i128,
}

#[contract]
pub struct RwaVault;

#[contractimpl]
impl RwaVault {
    pub fn initialize(env: Env, admin: Address, oracle: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, VaultError::Unauthorized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
    }

    pub fn deposit_dnft(env: Env, user: Address, nft_id: u32) {
        user.require_auth();

        let key = DataKey::Collateral(user.clone(), nft_id);
        let record = CollateralRecord {
            user: user.clone(),
            nft_id,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&key, &record);
        env.storage().persistent().extend_ttl(&key, 17_280, 518_400);

        EventDeposit { user, nft_id }.publish(&env);
    }

    pub fn withdraw_dnft(env: Env, user: Address, nft_id: u32) {
        user.require_auth();
        let key = DataKey::Collateral(user.clone(), nft_id);

        if !env.storage().persistent().has(&key) {
            panic_with_error!(&env, VaultError::InsufficientCollateral);
        }

        env.storage().persistent().remove(&key);
    }

    pub fn mint_c_cred(env: Env, user: Address, amount: i128) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        let bal_key = DataKey::CCredBalance(user.clone());
        let current_bal = env.storage().persistent().get(&bal_key).unwrap_or(0i128);

        env.storage()
            .persistent()
            .set(&bal_key, &(current_bal + amount));
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, 17_280, 518_400);

        let total_key = DataKey::TotalCCred;
        let total: i128 = env.storage().instance().get(&total_key).unwrap_or(0i128);
        env.storage().instance().set(&total_key, &(total + amount));

        EventMintCCred { user, amount }.publish(&env);
    }

    pub fn burn_c_cred(env: Env, user: Address, amount: i128) {
        user.require_auth();
        let bal_key = DataKey::CCredBalance(user.clone());
        let current_bal = env.storage().persistent().get(&bal_key).unwrap_or(0i128);

        if current_bal < amount {
            panic_with_error!(&env, VaultError::InsufficientCollateral);
        }

        env.storage()
            .persistent()
            .set(&bal_key, &(current_bal - amount));

        let total_key = DataKey::TotalCCred;
        let total: i128 = env.storage().instance().get(&total_key).unwrap_or(0i128);
        env.storage().instance().set(&total_key, &(total - amount));
    }

    pub fn get_ccred_balance(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::CCredBalance(user))
            .unwrap_or(0i128)
    }
}
