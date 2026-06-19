# Portfolio — Esteban Maya

Portafolio profesional (Next.js 15 + Supabase). Epic 1: foundation listo.

## Requisitos

- Node.js 22 (`nvm use`)
- Cuenta Supabase (staging + prod)

## Setup local

```bash
cp .env.local.example .env.local
# Completar credenciales de portfolio-staging
npm install
npm run dev
```

Scripts útiles:

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict |
| `npm run test` | Vitest (incluye smoke RLS con `.env.local`) |
| `npm run build` | Build de producción |
| `npm run db:types` | Regenerar `types/database.ts` (requiere `supabase link`) |
| `npm run db:push` | Aplicar migraciones al proyecto linked |
| `npm run db:seed` | Seed en entorno local/linked (no prod) |

## Supabase

| Entorno | Proyecto | Ref |
|---------|----------|-----|
| Staging | portfolio-staging | `cvvimcxjkdbzqtncflro` |
| Prod | portfolio-prod | `njslzlfijpciuwxebkkf` |

Ver [`supabase/README.md`](supabase/README.md) para link del CLI.

## Documentación

- [`docs/product/PRD.md`](docs/product/PRD.md)
- [`docs/engineering/TechnicalDesign.md`](docs/engineering/TechnicalDesign.md)
- [`docs/implementation/ImplementationPlan.md`](docs/implementation/ImplementationPlan.md)
