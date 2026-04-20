# Security Policy — Social Forest Protocol

## Reportar Vulnerabilidades

Para reportar uma vulnerabilidade de segurança, envie um email para:
**security@florestas.social**

Não abra issues públicas para vulnerabilidades de segurança.
Response time esperado: 48 horas.

---

## Invariantes de Segurança

Estas propriedades são verificadas em cada PR e nunca podem ser violadas:

| Invariante | Contrato | Como é garantida |
|---|---|---|
| `total_supply` nunca excede `MAX_SUPPLY` (100M MOGNO) | `rwa_vault` | Guard em `admin_mint` + `SupplyCapExceeded` |
| `transfer_reputation()` SEMPRE falha | `sbt_reputation` | `panic_with_error!(TransferForbidden)` incondicional |
| Apenas admin pode chamar `admin_mint` e `pause` | `rwa_vault` | `admin.require_auth()` + comparação com storage |
| Apenas empresas na whitelist podem distribuir cashback | `sbt_reputation` | `company.require_auth()` + `VerifiedCompany` storage check |
| Aritmética nunca transborda silenciosamente | ambos | `checked_add` / `checked_sub` + `ArithmeticOverflow` |

---

## Padrões de Segurança Aplicados

### Auth
- Todas as funções privilegiadas chamam `address.require_auth()` **antes** de qualquer lógica
- A validação de identidade é feita contra o storage — não contra parâmetros externos

### TTL / State Expiration
- Todos os escritos em `persistent()` fazem `extend_ttl` na mesma transação
- Leituras críticas verificam `has()` antes de `extend_ttl` para evitar panic

### Fail-Fast
- Validações de entrada (`amount > 0`, etc.) são feitas **antes** de qualquer escrita no storage
- `panic_with_error!` é usado em vez de `panic!` para erros estruturados e auditáveis

---

## Ferramentas de Auditoria

| Ferramenta | Comando | Propósito |
|---|---|---|
| **Scout** | `cargo scout-audit --manifest-path contracts/<x>/Cargo.toml` | Análise estática de padrões inseguros |
| **cargo test** | `cargo test --manifest-path contracts/<x>/Cargo.toml -- --nocapture` | Suíte de testes unitários |
| **Certora Sunbeam** | (planeado) | Verificação formal do WASM deployado |

---

## GitHub Actions

O pipeline CI (`.github/workflows/security.yml`) executa automaticamente:

1. **Testes** (`test` job) — em cada push/PR para `main` e `develop`
2. **Build WASM** (`build` job) — verifica que todos os contratos compilam para `wasm32-unknown-unknown`
3. **Auditoria Scout** (`scout` job) — análise estática, executa apenas após testes passarem

---

## Referência

- [Certora Soroban Audit Roadmap](https://www.certora.com/blog/roadmap-to-a-soroban-security-audit)
- [Stellar Security Guidelines](https://developers.stellar.org/docs/smart-contracts/security)
