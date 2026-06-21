# Supabase project refs
#
# staging: cvvimcxjkdbzqtncflro (portfolio-staging)
# prod:    njslzlfijpciuwxebkkf (portfolio-prod)
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

## Seed / reset (local only)

```bash
pnpm db:reset   # migrations + seed.sql
```

Remote DB: update rows via SQL Editor; do not run full seed on staging/prod if data exists.
