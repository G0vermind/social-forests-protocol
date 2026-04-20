# Stripe Gateway — Fiat On-ramp

Integração Stripe MPP para entrada de capital fiat (BRL/USD) no protocolo.

## Responsabilidade

- Receber pagamentos corporativos via Stripe Checkout
- Verificar assinatura do webhook (`Stripe-Signature`)
- Acionar `admin_mint` no `rwa_vault` via Soroban após confirmação de pagamento

## Fluxo

```
Cliente → Stripe Checkout
          │
          │ webhook (Stripe-Signature verificada)
          ▼
    stripe_gateway (Node.js / Edge Function)
          │
          │ Soroban invocation
          ▼
    rwa_vault.admin_mint(to, amount)
```

## Stack

- Node.js + Stripe SDK
- stellar-sdk (Soroban RPC client)
- Supabase (registo de transações)

## Status

🔨 Em desenvolvimento — Fase 1 (Seed)
