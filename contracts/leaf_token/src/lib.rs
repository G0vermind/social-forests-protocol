#![no_std]

use soroban_sdk::{
    Address, Env, String, contract, contracterror, contractimpl, contracttype, panic_with_error,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum TokenError {
    AlreadyInitialized = 1,
    InsufficientBalance = 2,
    InsufficientAllowance = 3,
    MaxSupplyExceeded = 4,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Balance(Address),
    Allowance(Address, Address),
    TotalSupply,
}

#[contract]
pub struct LeafToken;

#[contractimpl]
impl LeafToken {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, TokenError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalSupply, &0u128);
    }

    pub fn name(env: Env) -> String {
        String::from_str(&env, "Social Forest Leaf Token")
    }

    pub fn symbol(env: Env) -> String {
        String::from_str(&env, "LEAF")
    }

    pub fn decimals(_env: Env) -> u32 {
        7
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(id))
            .unwrap_or(0i128)
    }

    pub fn total_supply(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalSupply)
            .unwrap_or(0u128) as i128
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        let max_supply: i128 = 1_000_000_000_000_000_0;
        let current_supply = Self::total_supply(env.clone());

        if current_supply + amount > max_supply {
            panic_with_error!(&env, TokenError::MaxSupplyExceeded);
        }

        let to_key = DataKey::Balance(to.clone());
        let current_balance = Self::balance(env.clone(), to.clone());

        env.storage()
            .persistent()
            .set(&to_key, &(current_balance + amount));
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &((current_supply + amount) as u128));

        env.storage()
            .persistent()
            .extend_ttl(&to_key, 17_280, 518_400);
    }

    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();

        let from_key = DataKey::Balance(from.clone());
        let current_balance = Self::balance(env.clone(), from.clone());

        if current_balance < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let current_supply = Self::total_supply(env.clone());

        env.storage()
            .persistent()
            .set(&from_key, &(current_balance - amount));
        env.storage()
            .instance()
            .set(&DataKey::TotalSupply, &((current_supply - amount) as u128));
    }

    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        from.require_auth();

        let from_key = DataKey::Balance(from.clone());
        let to_key = DataKey::Balance(to.clone());

        let from_bal = Self::balance(env.clone(), from.clone());
        if from_bal < amount {
            panic_with_error!(&env, TokenError::InsufficientBalance);
        }

        let to_bal = Self::balance(env.clone(), to.clone());

        env.storage()
            .persistent()
            .set(&from_key, &(from_bal - amount));
        env.storage().persistent().set(&to_key, &(to_bal + amount));
    }
}
