# PoF Oracle — Proof of Flourishing Engine

Motor de validação de florescimento ecológico via IA Vision + x402 + MPP.

## Responsabilidade

- Coletar dados físicos (DAP/Altura) via IoT/WhatsApp/IA
- Processar imagens multiespectrais (satélite + drone)
- Acionar `admin_mint` quando limiares PoF são atingidos
- Acionar `distribute_green_cashback` em eventos de venda B2B

## Fluxo

```
IoT / WhatsApp / IA Vision
          │
          │ dados físicos + imagens
          ▼
    pof_oracle (n8n + Python)
          │
          ├─── x402 micropagamento de validação
          │
          ├─── rwa_vault.admin_mint()     ← lote atinge CicloCompensado
          │
          └─── sbt_reputation.distribute_green_cashback()  ← evento de venda B2B
```

## Stack

- n8n (orquestração de workflows)
- x402 Protocol (Coinbase) para micropagamentos de validação
- MPP (Stripe) para fluxos institucionais
- Python / OpenCV para processamento de imagens

## Status

🔨 Em desenvolvimento — Fase 1 (Seed)
