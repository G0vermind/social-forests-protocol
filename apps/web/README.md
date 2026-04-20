# Florestas.Social — Next.js Frontend

Dashboard B2B2C do protocolo Social Forest.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Supabase** (auth + database)
- **Tailwind CSS**

## Setup

```bash
cd apps/web
npm install
npm run dev  # → http://localhost:3000
```

## Estrutura

```
apps/web/
├── src/
│   ├── app/           # Rotas (App Router)
│   │   ├── ativos/    # Painel de ativos RWA
│   │   └── dao/       # Governança DAO
│   ├── components/    # Componentes reutilizáveis
│   └── lib/           # Clientes Supabase, SDK Stellar
├── public/            # Assets estáticos
└── next.config.ts
```

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
