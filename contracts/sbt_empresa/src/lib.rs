#![no_std]

use soroban_sdk::{
    Address, Env, String, Vec, contract, contracterror, contractevent, contractimpl, contracttype,
    panic_with_error, vec,
};

// ==========================================
// EVENTOS (Padrão Ouro v25+)
// ==========================================

#[contractevent(topics = ["company", "reg"], data_format = "single-value")]
pub struct EventCompanyRegistered {
    pub company: Address,
}

#[contractevent(topics = ["company", "verified"], data_format = "single-value")]
pub struct EventCompanyVerified {
    pub company: Address,
}

#[contractevent(topics = ["metrics", "update"])]
pub struct EventMetricsUpdated {
    pub company: Address,
    pub co2: u32,
}

#[contractevent(topics = ["sbt", "revoked"])]
pub struct EventSbtRevoked {
    pub company: Address,
    pub reason: String,
}

// ==========================================
// ESTRUTURAS
// ==========================================

#[contracttype]
#[derive(Clone, Debug)]
pub struct SbtEmpresaRecord {
    pub company_address: Address,
    pub verified_by_vereda: bool,
    pub co2e_tonnes: u32,
    pub native_species_count: u32,
    pub ods_badges: Vec<u32>,
    pub net_zero_status: bool,
    pub is_revoked: bool,
}

#[contracttype]
pub enum DataKey {
    Admin,
    Oracle,
    Empresa(Address),
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
#[repr(u32)]
pub enum SbtEmpresaError {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    Unauthorized = 3,
    NotVerified = 4,
    SbtRevoked = 5,
}

#[contract]
pub struct CompanySbt;

#[contractimpl]
impl CompanySbt {
    pub fn initialize(env: Env, admin: Address, oracle: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic_with_error!(&env, SbtEmpresaError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::Oracle, &oracle);
    }

    pub fn register_company(env: Env, company: Address) {
        company.require_auth();
        let key = DataKey::Empresa(company.clone());
        if env.storage().persistent().has(&key) {
            panic!("Já registada");
        }

        let record = SbtEmpresaRecord {
            company_address: company.clone(),
            verified_by_vereda: false,
            co2e_tonnes: 0,
            native_species_count: 0,
            ods_badges: vec![&env],
            net_zero_status: false,
            is_revoked: false,
        };

        env.storage().persistent().set(&key, &record);

        // PUBLICAR EVENTO NOVO
        EventCompanyRegistered { company }.publish(&env);
    }

    pub fn verify_company(env: Env, company: Address) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        let key = DataKey::Empresa(company.clone());
        let mut record: SbtEmpresaRecord = env.storage().persistent().get(&key).unwrap();

        record.verified_by_vereda = true;
        env.storage().persistent().set(&key, &record);

        // PUBLICAR EVENTO NOVO
        EventCompanyVerified { company }.publish(&env);
    }

    pub fn update_environmental_metrics(env: Env, company: Address, co2: u32, species: u32) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        let key = DataKey::Empresa(company.clone());
        let mut record: SbtEmpresaRecord = env.storage().persistent().get(&key).unwrap();

        if record.is_revoked {
            panic_with_error!(&env, SbtEmpresaError::SbtRevoked);
        }

        record.co2e_tonnes = co2;
        record.native_species_count = species;
        env.storage().persistent().set(&key, &record);

        // PUBLICAR EVENTO NOVO
        EventMetricsUpdated { company, co2 }.publish(&env);
    }

    pub fn revoke_sbt(env: Env, company: Address, reason: String) {
        let oracle: Address = env.storage().instance().get(&DataKey::Oracle).unwrap();
        oracle.require_auth();

        let key = DataKey::Empresa(company.clone());
        let mut record: SbtEmpresaRecord = env.storage().persistent().get(&key).unwrap();

        record.is_revoked = true;
        record.verified_by_vereda = false;
        env.storage().persistent().set(&key, &record);

        // PUBLICAR EVENTO NOVO
        EventSbtRevoked { company, reason }.publish(&env);
    }

    pub fn get_empresa_sbt(env: Env, company: Address) -> Option<SbtEmpresaRecord> {
        env.storage().persistent().get(&DataKey::Empresa(company))
    }
}
