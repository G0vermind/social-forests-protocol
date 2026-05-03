#![no_std]

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, vec, Address, Env, IntoVal,
    Symbol,
};

// ==========================================
// EVENTOS
// ==========================================

#[contractevent(topics = ["dnft", "planted"], data_format = "single-value")]
pub struct DnftPlantedEvent {
    pub dnft_id: u32,
}

// ==========================================
// ESTRUTURAS
// ==========================================

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Phase {
    Semente = 1,
    Muda = 2,
    Juvenil = 3,
    Adulta = 4,
    Madura = 5,
    Corte = 6,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Tier {
    Common = 1,
    Rare = 2,
    Epic = 3,
    Legendary = 4,
    Mythic = 5,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct DnftRecord {
    pub id: u32,
    pub owner: Address,
    pub tier: Tier,
    pub phase: Phase,
    pub tree_count: u32,
    pub is_locked: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    SbtContract,
    LeafToken,
    DnftCounter,
    Dnft(u32),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum DnftError {
    NotInitialized = 1,
    Unauthorized = 2,
    SbtNotConfigured = 3,
}

const MINT_LEAF_COST: i128 = 100_0000000;
const XP_PER_PLANT: u32 = 500;

#[contract]
pub struct MognoVault;

#[contractimpl]
impl MognoVault {
    pub fn initialize(env: Env, admin: Address, leaf_token: Address, sbt_contract: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::LeafToken, &leaf_token);
        env.storage()
            .instance()
            .set(&DataKey::SbtContract, &sbt_contract);
        env.storage().instance().set(&DataKey::DnftCounter, &0u32);
    }

    pub fn mint(env: Env, user: Address) -> u32 {
        user.require_auth();

        let leaf_address: Address = env.storage().instance().get(&DataKey::LeafToken).unwrap();
        env.invoke_contract::<()>(
            &leaf_address,
            &Symbol::new(&env, "burn_from"),
            vec![
                &env,
                env.current_contract_address().into_val(&env),
                user.to_val(),
                MINT_LEAF_COST.into_val(&env),
            ],
        );

        let mut dnft_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::DnftCounter)
            .unwrap_or(0);
        dnft_id += 1;
        env.storage()
            .instance()
            .set(&DataKey::DnftCounter, &dnft_id);

        let record = DnftRecord {
            id: dnft_id,
            owner: user.clone(),
            tier: Tier::Common,
            phase: Phase::Semente,
            tree_count: 1,
            is_locked: true,
        };
        env.storage()
            .persistent()
            .set(&DataKey::Dnft(dnft_id), &record);

        let sbt_address: Address = env.storage().instance().get(&DataKey::SbtContract).unwrap();
        env.invoke_contract::<()>(
            &sbt_address,
            &Symbol::new(&env, "add_xp"),
            vec![&env, user.to_val(), XP_PER_PLANT.into_val(&env)],
        );

        // AVISO RESOLVIDO AQUI
        DnftPlantedEvent { dnft_id }.publish(&env);

        dnft_id
    }

    pub fn get_dnft(env: Env, id: u32) -> Option<DnftRecord> {
        env.storage().persistent().get(&DataKey::Dnft(id))
    }
}

#[cfg(test)]
mod test;
