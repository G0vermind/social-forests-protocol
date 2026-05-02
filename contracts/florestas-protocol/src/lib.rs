#![no_std]
use soroban_sdk::{Address, Env, String, contract, contractimpl, contracttype};

// ==============================================================================
// 1. ESTRUTURAS DE DADOS (A Alma dos dNFTs do Florestas.Social)
// ==============================================================================

// 🌳 A Nomenclatura Oficial da Evolução (Coleção "Mythos da Floresta")
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DNftStage {
    AwakeningSeed = 1,  // Fase 1: A Semente do Despertar
    RunicSentinel = 2,  // Fase 2: O Sentinela Rúnico
    AncestralTitan = 3, // Fase 3: O Titã Ancestral
    ForestSpirit = 4,   // Fase 4: O Espírito da Floresta (O Avatar abstrato)
    LegendaryRelic = 5, // Fase 5: O Relicário Lendário (Móvel de luxo da Sómogno)
}

// O Registro principal do dNFT
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DNftRecord {
    pub owner: Address,
    pub stage: DNftStage,
    pub ipfs_uri: String, // JSON Híbrido: Arte Fantástica (Florestas) + Dados (Vereda)
    pub minted_at: u64,
}

// O Registro do SBT (O Selo de Impacto Nativo - Mecenas da Biodiversidade)
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SbtRecord {
    pub corporate_owner: Address,
    pub farmer_address: Address,
    pub native_species: String,
}

// Chaves de Armazenamento do Contrato
#[contracttype]
pub enum DataKey {
    OracleAdmin,
    LeafToken,
    TotalDNfts,
    DNft(u32), // Mapeamento ID -> DNftRecord
    Sbt(u32),  // Mapeamento ID -> SbtRecord
}

// ==============================================================================
// 2. O PROTOCOLO FLORESTAS.SOCIAL (Aplicação B2B)
// ==============================================================================

#[contract]
pub struct FlorestasProtocol;

#[contractimpl]
impl FlorestasProtocol {
    // Configuração Inicial do Motor
    pub fn initialize(env: Env, oracle_admin: Address, leaf_token: Address) {
        oracle_admin.require_auth();
        env.storage()
            .instance()
            .set(&DataKey::OracleAdmin, &oracle_admin);
        env.storage()
            .instance()
            .set(&DataKey::LeafToken, &leaf_token);
        env.storage().instance().set(&DataKey::TotalDNfts, &0u32);
    }

    // 🌳 A FORJA ÉPICA: Minta o dNFT e o SBT simultaneamente
    pub fn forge_mythic_dnft(
        env: Env,
        buyer: Address,
        farmer: Address,
        initial_uri: String,
        native_species: String,
    ) -> u32 {
        buyer.require_auth();

        let mut current_id: u32 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDNfts)
            .unwrap_or(0);
        current_id += 1;

        // O ativo comercial nasce na primeira fase
        let new_dnft = DNftRecord {
            owner: buyer.clone(),
            stage: DNftStage::AwakeningSeed,
            ipfs_uri: initial_uri,
            minted_at: env.ledger().timestamp(),
        };

        // O selo de impacto da muda gêmea nasce vinculado à mesma transação
        let new_sbt = SbtRecord {
            corporate_owner: buyer.clone(),
            farmer_address: farmer,
            native_species,
        };

        // Salva as estruturas persistentemente
        env.storage()
            .persistent()
            .set(&DataKey::DNft(current_id), &new_dnft);
        env.storage()
            .persistent()
            .set(&DataKey::Sbt(current_id), &new_sbt);
        env.storage()
            .instance()
            .set(&DataKey::TotalDNfts, &current_id);

        current_id
    }

    // 🆙 A EVOLUÇÃO (Gatilho automatizado pelo sistema Vereda Verify)
    pub fn evolve_dnft(env: Env, dnft_id: u32, new_stage: DNftStage, new_ipfs_uri: String) {
        let oracle: Address = env.storage().instance().get(&DataKey::OracleAdmin).unwrap();
        oracle.require_auth();

        let mut dnft: DNftRecord = env
            .storage()
            .persistent()
            .get(&DataKey::DNft(dnft_id))
            .expect("dNFT inexistente");

        dnft.stage = new_stage;
        dnft.ipfs_uri = new_ipfs_uri;

        env.storage()
            .persistent()
            .set(&DataKey::DNft(dnft_id), &dnft);
    }

    // ==============================================================================
    // 3. FUNÇÕES DE LEITURA (Para o front-end do Antgravity)
    // ==============================================================================

    pub fn get_dnft(env: Env, dnft_id: u32) -> DNftRecord {
        env.storage()
            .persistent()
            .get(&DataKey::DNft(dnft_id))
            .expect("dNFT inexistente")
    }

    pub fn get_sbt(env: Env, dnft_id: u32) -> SbtRecord {
        env.storage()
            .persistent()
            .get(&DataKey::Sbt(dnft_id))
            .expect("SBT inexistente")
    }
}
