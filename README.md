# Portfolio — Esteban Maya

Portafolio profesional (Next.js 15 + Supabase). Epic 1: foundation listo.

## Requisitos

- Node.js 22 (`nvm use`)
- Cuenta Supabase (staging + prod)

## Setup local

```bash
cp .env.local.example .env.local
# Completar credenciales de portfolio-staging
pnpm install
pnpm run dev
```

Scripts útiles:

| Script | Descripción |
|--------|-------------|
| `pnpm run dev` | Servidor de desarrollo |
| `pnpm run lint` | ESLint |
| `pnpm run typecheck` | TypeScript strict |
| `pnpm run test` | Vitest (incluye smoke RLS con `.env.local`) |
| `pnpm run build` | Build de producción |
| `pnpm run db:types` | Regenerar `types/database.ts` (requiere `supabase link`) |
| `pnpm run db:push` | Aplicar migraciones al proyecto linked |
| `pnpm run db:seed:local` | Reset local: migraciones + seeds |
| `pnpm run db:seed:remote` | Sincronizar seeds al proyecto Supabase linked (staging) |

## Supabase

| Entorno | Proyecto | Ref |
|---------|----------|-----|
| Staging | portfolio-staging | `cvvimcxjkdbzqtncflro` |
| Prod | portfolio-prod | GitHub secret `SUPABASE_PROD_PROJECT_REF` |

Ver [`supabase/README.md`](supabase/README.md) para link del CLI.

## Documentación

- [`docs/product/PRD.md`](docs/product/PRD.md)
- [`docs/engineering/TechnicalDesign.md`](docs/engineering/TechnicalDesign.md)
- [`docs/implementation/ImplementationPlan.md`](docs/implementation/ImplementationPlan.md)
