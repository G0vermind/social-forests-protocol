#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env}; // BytesN removido aqui

fn setup() -> (Env, HeroJourneyClient<'static>, Address, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(HeroJourney, ());
    let client = HeroJourneyClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    client.initialize(&admin);

    (env, client, admin, user)
}

fn setup_with_partner() -> (Env, HeroJourneyClient<'static>, Address, Address, Address) {
    let (env, client, admin, user) = setup();
    let company = Address::generate(&env);
    client.register_partner(&admin, &company);
    (env, client, admin, user, company)
}

#[test]
fn test_reward_leaves_and_forge() {
    let (_env, client, admin, user) = setup();

    client.reward_leaves(&admin, &user, &100i128);
    assert_eq!(client.get_leaves(&user), 100i128);

    let nft_id = client.forge_common_rwa(&user);
    assert_eq!(nft_id, 1u32);
    assert_eq!(client.get_nft_rarity(&nft_id), Some(Rarity::Plantador));
    assert_eq!(client.get_leaves(&user), 0i128);
}

#[test]
fn test_evolve_nft() {
    let (_env, client, admin, user) = setup();

    client.reward_leaves(&admin, &user, &250i128);
    let nft_id = client.forge_common_rwa(&user);

    let new_rarity = client.evolve_nft(&user, &nft_id);
    assert_eq!(new_rarity, Rarity::Cultivador);
    assert_eq!(client.get_leaves(&user), 0i128);
}

#[test]
fn test_b2b_flow() {
    let (_env, client, admin, user, company) = setup_with_partner();

    client.distribute_leaves(&company, &500i128);
    assert_eq!(client.get_mission_pool(&company), 500i128);

    client.claim_mission_leaf(&admin, &user, &company, &100i128);
    assert_eq!(client.get_leaves(&user), 100i128);
    assert_eq!(client.get_mission_pool(&company), 400i128);

    let badge = client.get_company_badge(&company).unwrap();
    assert_eq!(badge.total_leaves_claimed, 100i128);
    assert_eq!(badge.ods_score, 10u32);
}

#[test]
fn test_update_tree_record() {
    let (_env, client, admin, user) = setup();
    client.reward_leaves(&admin, &user, &100i128);
    let nft_id = client.forge_common_rwa(&user);

    let record = TreeAnnualRecord {
        nft_id,
        tree_id: 1,
        year: 2025,
        height_cm: 150,
        carbon_kg: 10,
        health_score: 95,
        geo_hash: 12345,
    };

    client.update_tree_record(&admin, &record);

    let fetched = client.get_tree_record(&nft_id, &2025u32).unwrap();
    assert_eq!(fetched.height_cm, 150u32);
    assert_eq!(fetched.carbon_kg, 10u32);
}
