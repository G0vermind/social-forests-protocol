#![cfg(test)]

use super::*;
use soroban_sdk::{Address, Env, testutils::Address as _};

fn setup() -> (Env, ReputationSbtClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(ReputationSbt, ());
    let client = ReputationSbtClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    (env, client, admin)
}

#[test]
fn test_create_and_get_sbt() {
    let (env, client, _) = setup();
    let user = Address::generate(&env);

    client.create_sbt(&user);

    let sbt = client.get_sbt(&user).unwrap();
    assert_eq!(sbt.level, 1);
    assert_eq!(sbt.xp, 0);
}

#[test]
fn test_add_xp_and_level_up() {
    let (env, client, _) = setup();
    let user = Address::generate(&env);

    client.create_sbt(&user);

    client.add_xp(&user, &500);

    let sbt = client.get_sbt(&user).unwrap();
    assert_eq!(sbt.xp, 500);
    assert_eq!(sbt.level, 2);
}

#[test]
fn test_multiple_xp_gains() {
    let (env, client, _) = setup();
    let user = Address::generate(&env);

    client.create_sbt(&user);

    client.add_xp(&user, &250);
    client.add_xp(&user, &250);

    let sbt = client.get_sbt(&user).unwrap();
    assert_eq!(sbt.level, 2);
}

#[test]
#[should_panic] // Agora sem string, para ser compatível com o Host do Soroban
fn test_cannot_create_duplicate_sbt() {
    let (env, client, _) = setup();
    let user = Address::generate(&env);

    client.create_sbt(&user);
    client.create_sbt(&user);
}
