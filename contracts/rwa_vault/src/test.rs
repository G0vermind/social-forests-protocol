#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Env};

// Mocks
#[contract]
pub struct MockToken;
#[contractimpl]
impl MockToken {
    pub fn burn_from(_env: Env, _spender: Address, _from: Address, _amount: i128) {}
}

#[contract]
pub struct MockSbt;
#[contractimpl]
impl MockSbt {
    pub fn add_xp(_env: Env, _user: Address, _amount: u32) {}
}

#[test]
fn test_mint_integration_with_sbt_and_token() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // AVISOS RESOLVIDOS AQUI
    let token_id = env.register(MockToken, ());
    let sbt_id = env.register(MockSbt, ());
    let vault_id = env.register(MognoVault, ());

    let client = MognoVaultClient::new(&env, &vault_id);
    client.initialize(&admin, &token_id, &sbt_id);

    let dnft_id = client.mint(&user);

    assert_eq!(dnft_id, 1, "O ID do primeiro dNFT deve ser 1");

    let dnft = client.get_dnft(&dnft_id).unwrap();
    assert_eq!(dnft.owner, user, "O dono da arvore deve ser o utilizador");
    assert_eq!(
        dnft.phase,
        Phase::Semente,
        "A arvore deve nascer na Fase Semente"
    );
    assert_eq!(dnft.tier, Tier::Common, "A arvore deve nascer como Comum");
    assert_eq!(dnft.tree_count, 1, "Deve representar 1 arvore física");
    assert_eq!(
        dnft.is_locked, true,
        "A semente deve estar bloqueada nos primeiros 90 dias"
    );
}
