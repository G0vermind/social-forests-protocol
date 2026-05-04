#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    Env,
};

mod leaf_token {
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/leaf_token.wasm");
}
mod rwa_vault {
    soroban_sdk::contractimport!(file = "../../target/wasm32v1-none/release/rwa_vault.wasm");
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Rarity {
    Plantador,
    Cultivador,
    Guardiao,
    Protetor,
    Lenda,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct CompanyBadge {
    pub company: Address,
    pub total_leaves_distributed: i128,
    pub ods_score: u32,
    pub lenda_bonus: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    LeafToken,
    RwaVault,
    NFTCounter,
    NFTOwner(u32),
    NFTRarity(u32),
    Partner(Address),
    MissionPool(Address),
    CompanyBadge(Address),
    UserCompany(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized = 1,
    Unauthorized = 2,
    InsufficientLeaves = 4,
    MissionPoolEmpty = 5,
    CompanyNotPartner = 6,
    NftNotOwned = 7,
    AlreadyLenda = 8,
}

#[contractevent(topics = ["nft", "forge"])]
pub struct EventNftForged {
    pub user: Address,
    pub nft_id: u32,
}

#[contractevent(topics = ["nft", "evolve"])]
pub struct EventNftEvolved {
    pub user: Address,
    pub nft_id: u32,
    pub new_rarity: Rarity,
}

const FORGE_COST: i128 = 1000_0000; // 100 LEAF (7 decimais)

#[contract]
pub struct HeroJourney;

#[contractimpl]
impl HeroJourney {
    pub fn initialize(env: Env, admin: Address, leaf_token: Address, rwa_vault: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::LeafToken, &leaf_token);
        env.storage().instance().set(&DataKey::RwaVault, &rwa_vault);
        env.storage().instance().set(&DataKey::NFTCounter, &0u32);
    }

    pub fn register_partner(env: Env, admin: Address, company: Address) {
        admin.require_auth();
        let stored_admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        if admin != stored_admin {
            panic_with_error!(env, ContractError::Unauthorized);
        }

        env.storage()
            .persistent()
            .set(&DataKey::Partner(company.clone()), &true);

        let badge = CompanyBadge {
            company: company.clone(),
            total_leaves_distributed: 0,
            ods_score: 0,
            lenda_bonus: false,
        };
        env.storage()
            .persistent()
            .set(&DataKey::CompanyBadge(company), &badge);
    }

    pub fn deposit_mission_funds(env: Env, company: Address, amount: i128) {
        company.require_auth();
        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let leaf_client = leaf_token::Client::new(&env, &leaf_address);

        leaf_client.transfer(&company, &env.current_contract_address(), &amount);

        let pool_key = DataKey::MissionPool(company.clone());
        let current_pool: i128 = env.storage().persistent().get(&pool_key).unwrap_or(0);
        env.storage()
            .persistent()
            .set(&pool_key, &(current_pool + amount));
    }

    pub fn forge_dnft(env: Env, user: Address) -> u32 {
        user.require_auth();
        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let leaf_client = leaf_token::Client::new(&env, &leaf_address);

        leaf_client.burn(&user, &FORGE_COST);

        let mut nft_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::NFTCounter)
            .unwrap_or(0);
        nft_id += 1;

        env.storage().instance().set(&DataKey::NFTCounter, &nft_id);
        env.storage()
            .persistent()
            .set(&DataKey::NFTOwner(nft_id), &user);
        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &Rarity::Plantador);

        let vault_address: Address = env.storage().instance().get(&DataKey::RwaVault).unwrap();
        let vault_client = rwa_vault::Client::new(&env, &vault_address);
        vault_client.deposit_dnft(&user, &nft_id);

        EventNftForged { user, nft_id }.publish(&env);
        nft_id
    }

    pub fn evolve_nft(env: Env, user: Address, nft_id: u32) -> Rarity {
        user.require_auth();
        let owner: Address = env
            .storage()
            .persistent()
            .get(&DataKey::NFTOwner(nft_id))
            .unwrap();
        if owner != user {
            panic_with_error!(env, ContractError::NftNotOwned);
        }

        let current_rarity: Rarity = env
            .storage()
            .persistent()
            .get(&DataKey::NFTRarity(nft_id))
            .unwrap();
        if current_rarity == Rarity::Lenda {
            panic_with_error!(env, ContractError::AlreadyLenda);
        }

        let cost = match current_rarity {
            Rarity::Plantador => 150_0000,
            Rarity::Cultivador => 300_0000,
            Rarity::Guardiao => 600_0000,
            Rarity::Protetor => 1000_0000,
            _ => 0,
        };

        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        let leaf_client = leaf_token::Client::new(&env, &leaf_address);
        leaf_client.burn(&user, &cost);

        let new_rarity = match current_rarity {
            Rarity::Plantador => Rarity::Cultivador,
            Rarity::Cultivador => Rarity::Guardiao,
            Rarity::Guardiao => Rarity::Protetor,
            Rarity::Protetor => Rarity::Lenda,
            _ => current_rarity,
        };

        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &new_rarity);

        EventNftEvolved {
            user,
            nft_id,
            new_rarity: new_rarity.clone(),
        }
        .publish(&env);
        new_rarity
    }

    pub fn get_nft_rarity(env: Env, nft_id: u32) -> Option<Rarity> {
        env.storage().persistent().get(&DataKey::NFTRarity(nft_id))
    }
}
