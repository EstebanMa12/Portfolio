# Supabase project refs
#
# staging: cvvimcxjkdbzqtncflro (portfolio-staging)
# prod:    portfolio-prod (ref in GitHub secret SUPABASE_PROD_PROJECT_REF)
#
# Link local CLI to staging:
#   supabase login
#   supabase link --project-ref cvvimcxjkdbzqtncflro

## GitHub OAuth (admin login)

1. **GitHub OAuth App** — [Developer Settings → OAuth Apps](https://github.com/settings/developers)
   - Homepage URL: `http://localhost:3000` (dev) / staging URL / prod URL
   - Callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`

2. **Supabase Dashboard** → Authentication → Providers → GitHub
   - Enable GitHub
   - Paste Client ID + Client Secret from GitHub

3. **Supabase Auth URL config** → Redirect URLs (allow list):
   - `http://localhost:3000/auth/callback`
   - `https://<staging-domain>/auth/callback`
   - `https://<prod-domain>/auth/callback`

4. **Whitelist admin** — after first GitHub login, insert into `admin_users`:

```sql
-- Find your user id in Authentication → Users, then:
INSERT INTO admin_users (id, email)
VALUES ('<auth-users-uuid>', 'your@email.com')
ON CONFLICT (id) DO NOTHING;
```

`admin_users.id` must match `auth.users.id` (FK).

## Seed / reset

| Comando | Qué hace |
|---------|----------|
| `pnpm db:reset` / `pnpm db:seed:local` | Resetea la **BD local** (Docker): migraciones + `seed.sql` + `seed_en.sql` |
| `pnpm db:push` | Aplica **solo migraciones** al proyecto linked (no ejecuta seeds) |
| `pnpm db:seed:remote` | Borra contenido CMS en el proyecto **linked** y vuelve a cargar los seeds |

**Importante:** `pnpm db:seed` ya no existe — antes era un alias de `db reset` y **nunca** tocaba la nube.

### Staging (recomendado para dev)

```bash
supabase link --project-ref cvvimcxjkdbzqtncflro
pnpm db:push          # asegurar migraciones al día
pnpm db:seed:remote   # sincronizar contenido con seed.sql
```

`db:seed:remote` trunca tablas de contenido (`projects`, `page_content`, etc.) pero **no** borra `admin_users`.

### Producción

- Migraciones: workflow `Migrate Production DB` (manual) o `supabase link --project-ref <prod-ref> && pnpm db:push`
- **No** ejecutar `db:seed:remote` en prod salvo reset controlado — editar filas vía SQL Editor o admin CMS.
