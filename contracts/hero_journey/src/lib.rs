#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, panic_with_error, Address,
    BytesN, Env,
};

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
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct TreeAnnualRecord {
    pub nft_id: u32,
    pub tree_id: u32,
    pub year: u32,
    pub height_cm: u32,
    pub carbon_kg: u32,
    pub health_score: u32,
    pub geo_hash: u64,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct CompanyBadge {
    pub company: Address,
    pub total_leaves_claimed: i128,
    pub ods_score: u32,
    pub carbon_credits: u32,
    pub lenda_bonus: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    LeavesBalance(Address),
    NFTCounter,
    NFTOwner(u32),
    NFTRarity(u32),
    TreeRecord(u32, u32),
    TreeLatestYear(u32),
    Partner(Address),
    MissionPool(Address),
    CompanyBadge(Address),
    UserCompany(Address),
    EsgMerkleRoot,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum ContractError {
    AlreadyInitialized = 1,
    Unauthorized = 2,
    InvalidAmount = 3,
    InsufficientLeaves = 4,
    MissionPoolEmpty = 5,
    CompanyNotPartner = 6,
    NftNotOwned = 7,
    AlreadyLenda = 8,
    InvalidTreeRecord = 9,
}

#[contractevent(topics = ["leaf", "reward"])]
pub struct EventRewardLeaves {
    pub user: Address,
    pub amount: i128,
}

#[contractevent(topics = ["tree", "update"])]
pub struct EventTreeUpdated {
    pub nft_id: u32,
    pub year: u32,
    pub carbon_kg: u32,
}

#[contractevent(topics = ["b2b", "partner"], data_format = "single-value")]
pub struct EventPartnerRegistered {
    pub company: Address,
}

#[contractevent(topics = ["b2b", "distrib"])]
pub struct EventLeavesDistributed {
    pub company: Address,
    pub amount: i128,
}

#[contractevent(topics = ["b2c", "claim"])]
pub struct EventMissionLeafClaimed {
    pub company: Address,
    pub user: Address,
    pub amount: i128,
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

#[contractevent(topics = ["b2b", "lenda"])]
pub struct EventLendaBonus {
    pub company: Address,
    pub user: Address,
    pub nft_id: u32,
}

#[contractevent(topics = ["esg", "root"], data_format = "single-value")]
pub struct EventEsgMerkleRootSet {
    pub root: BytesN<32>,
}

const DAY_IN_LEDGERS: u32 = 17_280;
const TTL_THRESHOLD: u32 = 30 * DAY_IN_LEDGERS;
const TTL_EXTEND: u32 = 90 * DAY_IN_LEDGERS;

const FORGE_COST: i128 = 100;
const ODS_DIVISOR: i128 = 10;
const CARBON_DIVISOR: i128 = 50;

const MAX_HEALTH_SCORE: u32 = 100;

fn evolve_cost_for_rarity(rarity: &Rarity) -> i128 {
    match rarity {
        Rarity::Plantador => 150,
        Rarity::Cultivador => 300,
        Rarity::Guardiao => 600,
        Rarity::Protetor => 1_000,
        Rarity::Lenda => 0,
    }
}

fn mogno_fraction_for_rarity(rarity: &Rarity) -> i128 {
    match rarity {
        Rarity::Plantador => 10_000,
        Rarity::Cultivador => 50_000,
        Rarity::Guardiao => 100_000,
        Rarity::Protetor => 500_000,
        Rarity::Lenda => 1_000_000,
    }
}

#[contract]
pub struct HeroJourney;

#[contractimpl]
impl HeroJourney {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(env, ContractError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::NFTCounter, &0u32);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

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
        env.storage()
            .persistent()
            .extend_ttl(&key, TTL_THRESHOLD, TTL_EXTEND);

        EventRewardLeaves { user, amount }.publish(&env);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    pub fn update_tree_record(env: Env, oracle: Address, record: TreeAnnualRecord) {
        oracle.require_auth();
        Self::assert_admin(&env, &oracle);

        if record.year == 0 || record.health_score > MAX_HEALTH_SCORE {
            panic_with_error!(env, ContractError::InvalidTreeRecord);
        }

        if !env
            .storage()
            .persistent()
            .has(&DataKey::NFTOwner(record.nft_id))
        {
            panic_with_error!(env, ContractError::NftNotOwned);
        }

        let rec_key = DataKey::TreeRecord(record.nft_id, record.year);
        env.storage().persistent().set(&rec_key, &record);
        env.storage()
            .persistent()
            .extend_ttl(&rec_key, TTL_THRESHOLD, TTL_EXTEND);

        let latest_key = DataKey::TreeLatestYear(record.nft_id);
        let current_latest: u32 = env.storage().persistent().get(&latest_key).unwrap_or(0);
        if record.year >= current_latest {
            env.storage().persistent().set(&latest_key, &record.year);
            env.storage()
                .persistent()
                .extend_ttl(&latest_key, TTL_THRESHOLD, TTL_EXTEND);
        }

        EventTreeUpdated {
            nft_id: record.nft_id,
            year: record.year,
            carbon_kg: record.carbon_kg,
        }
        .publish(&env);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

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

        EventPartnerRegistered { company }.publish(&env);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

    pub fn distribute_leaves(env: Env, company: Address, amount: i128) {
        company.require_auth();
        if amount <= 0 {
            panic_with_error!(env, ContractError::InvalidAmount);
        }
        Self::assert_partner(&env, &company);

        let pool_key = DataKey::MissionPool(company.clone());
        let pool: i128 = env.storage().persistent().get(&pool_key).unwrap_or(0);
        let new_pool = pool.checked_add(amount).unwrap();
        env.storage().persistent().set(&pool_key, &new_pool);
        env.storage()
            .persistent()
            .extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);

        EventLeavesDistributed { company, amount }.publish(&env);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

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

        let pool_key = DataKey::MissionPool(company.clone());
        let pool: i128 = env.storage().persistent().get(&pool_key).unwrap_or(0);
        if pool < amount {
            panic_with_error!(env, ContractError::MissionPoolEmpty);
        }
        env.storage().persistent().set(&pool_key, &(pool - amount));
        env.storage()
            .persistent()
            .extend_ttl(&pool_key, TTL_THRESHOLD, TTL_EXTEND);

        let bal_key = DataKey::LeavesBalance(user.clone());
        let balance: i128 = env.storage().persistent().get(&bal_key).unwrap_or(0);
        env.storage()
            .persistent()
            .set(&bal_key, &(balance + amount));
        env.storage()
            .persistent()
            .extend_ttl(&bal_key, TTL_THRESHOLD, TTL_EXTEND);

        let badge_key = DataKey::CompanyBadge(company.clone());
        let mut badge: CompanyBadge = env.storage().persistent().get(&badge_key).unwrap();
        badge.total_leaves_claimed += amount;
        badge.ods_score = (badge.total_leaves_claimed / ODS_DIVISOR) as u32;
        badge.carbon_credits = (badge.total_leaves_claimed / CARBON_DIVISOR) as u32;
        env.storage().persistent().set(&badge_key, &badge);
        env.storage()
            .persistent()
            .extend_ttl(&badge_key, TTL_THRESHOLD, TTL_EXTEND);

        let uc_key = DataKey::UserCompany(user.clone());
        env.storage().persistent().set(&uc_key, &company);
        env.storage()
            .persistent()
            .extend_ttl(&uc_key, TTL_THRESHOLD, TTL_EXTEND);

        EventMissionLeafClaimed {
            company,
            user,
            amount,
        }
        .publish(&env);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);
    }

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
            .unwrap_or(0);
        nft_id += 1;
        env.storage().instance().set(&DataKey::NFTCounter, &nft_id);
        env.storage()
            .instance()
            .extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        env.storage()
            .persistent()
            .set(&DataKey::NFTOwner(nft_id), &user);
        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &Rarity::Plantador);

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
        env.storage().persistent().set(&bal_key, &(balance - cost));

        let new_rarity = match current_rarity {
            Rarity::Plantador => Rarity::Cultivador,
            Rarity::Cultivador => Rarity::Guardiao,
            Rarity::Guardiao => Rarity::Protetor,
            Rarity::Protetor => Rarity::Lenda,
            Rarity::Lenda => panic!("Unreachable"),
        };

        env.storage()
            .persistent()
            .set(&DataKey::NFTRarity(nft_id), &new_rarity);

        if new_rarity == Rarity::Lenda {
            if let Some(company) = env
                .storage()
                .persistent()
                .get::<_, Address>(&DataKey::UserCompany(user.clone()))
            {
                if let Some(mut badge) = env
                    .storage()
                    .persistent()
                    .get::<_, CompanyBadge>(&DataKey::CompanyBadge(company.clone()))
                {
                    badge.lenda_bonus = true;
                    env.storage()
                        .persistent()
                        .set(&DataKey::CompanyBadge(company.clone()), &badge);
                    EventLendaBonus {
                        company,
                        user: user.clone(),
                        nft_id,
                    }
                    .publish(&env);
                }
            }
        }

        EventNftEvolved {
            user,
            nft_id,
            new_rarity: new_rarity.clone(),
        }
        .publish(&env);
        new_rarity
    }

    pub fn set_esg_merkle_root(env: Env, admin: Address, root: BytesN<32>) {
        admin.require_auth();
        Self::assert_admin(&env, &admin);
        env.storage().instance().set(&DataKey::EsgMerkleRoot, &root);
        EventEsgMerkleRootSet { root }.publish(&env);
    }

    pub fn get_esg_merkle_root(env: Env) -> Option<BytesN<32>> {
        env.storage().instance().get(&DataKey::EsgMerkleRoot)
    }

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

    pub fn get_tree_record(env: Env, nft_id: u32, year: u32) -> Option<TreeAnnualRecord> {
        env.storage()
            .persistent()
            .get(&DataKey::TreeRecord(nft_id, year))
    }

    pub fn get_latest_tree_record(env: Env, nft_id: u32) -> Option<TreeAnnualRecord> {
        let latest_year: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::TreeLatestYear(nft_id))?;
        env.storage()
            .persistent()
            .get(&DataKey::TreeRecord(nft_id, latest_year))
    }

    pub fn get_tree_latest_year(env: Env, nft_id: u32) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::TreeLatestYear(nft_id))
            .unwrap_or(0)
    }

    pub fn get_leaves(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::LeavesBalance(user))
            .unwrap_or(0)
    }

    pub fn get_nft_owner(env: Env, nft_id: u32) -> Option<Address> {
        env.storage().persistent().get(&DataKey::NFTOwner(nft_id))
    }

    pub fn get_nft_rarity(env: Env, nft_id: u32) -> Option<Rarity> {
        env.storage().persistent().get(&DataKey::NFTRarity(nft_id))
    }

    pub fn get_nft_mogno_fraction(env: Env, nft_id: u32) -> i128 {
        if !env.storage().persistent().has(&DataKey::NFTOwner(nft_id)) {
            return 0;
        }
        let rarity = env
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

#[cfg(test)]
mod test;
