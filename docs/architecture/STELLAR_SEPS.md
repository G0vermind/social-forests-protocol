# FLORESTAS SOCIAL: Implementação de Padrões Stellar (SEPs)

Este documento define como o protocolo Florestas Social utiliza os padrões da rede para garantir interoperabilidade e conformidade institucional.

## SEP-41: Smart Contract Tokens (Soroban)
- O token **MOGNO (RWA)** e a commodity **FOLHAS** seguem o padrão SEP-41.
- Permite que esses ativos sejam utilizados em protocolos de liquidez e AMMs no ecossistema Soroban.

## SEP-24: Hosted Deposit and Withdrawal (Fiat On-Ramp)
- O Florestas Social utiliza a integração **Stripe Managed Payments** como gateway de entrada.
- O sistema atua como uma âncora que recebe Fiat (BRL/USD) e aciona o contrato inteligente para depositar o valor correspondente em RWA diretamente na carteira do usuário.

## SEP-08: Regulated Assets (Market Compliance)
- Essencial para o mercado B2B de liquidação de Débito de Carbono (C-DEBT).
- O protocolo utiliza a lógica do SEP-08 para restringir transferências de ativos regulados apenas a carteiras verificadas (KYC institucional), prevenindo especulação indevida e garantindo integridade ESG.
