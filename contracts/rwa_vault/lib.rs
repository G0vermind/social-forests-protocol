#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct MognoVault;

#[contractimpl]
impl MognoVault {
    pub fn init(env: Env) {
        // O código do contrato de Mogno será escrito aqui pela equipe
    }
}
