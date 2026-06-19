# Technical Design — Portafolio Profesional & Marca Personal
## Esteban Maya | Software Engineer

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0 |
| **Fecha** | 18 de junio de 2026 |
| **Autor** | Lead Software Engineer |
| **Estado** | Ready for Sprint 1 |
| **Documentos relacionados** | [PRD.md](./PRD.md), [Architecture.md](./Architecture.md), [IDEA.html](./IDEA.html) |

---

## Tabla de contenidos

1. [Resumen](#1-resumen)
2. [Frontend](#2-frontend)
3. [Backend](#3-backend)
4. [Database](#4-database)
5. [CMS](#5-cms)
6. [SEO](#6-seo)
7. [Infraestructura](#7-infraestructura)
8. [Estructura del repositorio](#8-estructura-del-repositorio)
9. [ADRs — Architecture Decision Records](#9-adrs--architecture-decision-records)
10. [Apéndices](#10-apéndices)

---

## 1. Resumen

Este documento traduce [PRD.md](./PRD.md) y [Architecture.md](./Architecture.md) en **decisiones técnicas concretas** listas para implementación. Define stack, patrones, schema de base de datos, contratos de API y pipeline de despliegue.

### 1.1 Stack definitivo

| Capa | Tecnología | Versión |
|------|------------|---------|
| Runtime | Node.js | 22 LTS |
| Framework full-stack | Next.js (App Router) | 15.x |
| UI | React | 19.x |
| Lenguaje | TypeScript | 5.x (`strict: true`) |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui + componentes custom (IDEA.html) | — |
| Validación | Zod | 3.x |
| ORM / queries | Supabase JS client + SQL tipado | 2.x |
| DB | PostgreSQL (Supabase) | 15 |
| Auth | Supabase Auth | — |
| Storage | Supabase Storage | — |
| MD pipeline | react-markdown + remark/rehype + Shiki | — |
| Hosting | Vercel | — |
| CI | GitHub Actions | — |
| Observabilidad | Vercel Analytics (+ Sentry v1.1) | — |

### 1.2 Diagrama técnico

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  Public: HTML+RSC (minimal JS)  │  Admin: React Client Islands │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────────┐
│                    VERCEL (Edge + Serverless)                   │
│  middleware.ts ──► Auth guard / noindex preview / security hdrs │
│  app/(public)/*  ──► RSC + ISR (revalidate: 3600)               │
│  app/admin/*     ──► RSC layout + Client forms                  │
│  Server Actions  ──► Mutations + revalidateTag()                │
│  Route Handlers  ──► sitemap, robots, webhooks (v1.1)           │
└────────────────────────┬────────────────────────────────────────┘
                         │ TLS
┌────────────────────────▼────────────────────────────────────────┐
│                         SUPABASE                                │
│  PostgreSQL + RLS  │  Auth (OAuth)  │  Storage (media, cv)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend

### 2.1 Framework

**Decisión:** Next.js 15 con App Router y React Server Components (RSC).

| Aspecto | Especificación |
|---------|----------------|
| Bundler | Turbopack (dev); Webpack fallback si incompatibilidad |
| React | 19 — `useActionState`, `useFormStatus` para admin forms |
| TypeScript | `strict`, `noUncheckedIndexedAccess`, path aliases `@/` |
| Rendering público | SSG + ISR (`export const revalidate = 3600`) |
| Rendering admin | SSR dinámico (siempre fresh, no cacheable) |
| Client boundary | `"use client"` solo en: MobileMenu, admin forms, MD editor |

**Justificación:** Next.js es el único framework que cubre nativamente SSG/ISR, Metadata API, Server Actions y deploy en Vercel sin configuración adicional. RSC reduce el bundle JS del front office a ~15–30 KB (vs ~80+ KB con SPA), crítico para LCP y SEO.

**Alternativas descartadas:**

| Alternativa | Motivo de descarte |
|-------------|-------------------|
| Astro | Excelente para static; admin/CMS requeriría islas React o servicio separado |
| Remix | Sin ISR nativo; metadata SEO más manual |
| Vite + React SPA | CSR puro; SEO dependiente de prerender externo |

→ Ver [ADR-TD-001](#adr-td-001-nextjs-15-como-framework-full-stack)

---

### 2.2 Routing

**Decisión:** App Router con route groups y layouts anidados.

#### Mapa de rutas

| Ruta | Archivo | Rendering | Auth |
|------|---------|-----------|------|
| `/` | `app/(public)/page.tsx` | ISR 3600s | — |
| `/about` | `app/(public)/about/page.tsx` | ISR 3600s | — |
| `/experience` | `app/(public)/experience/page.tsx` | ISR 3600s | — |
| `/projects` | `app/(public)/projects/page.tsx` | ISR 3600s | — |
| `/projects/[slug]` | `app/(public)/projects/[slug]/page.tsx` | ISR 86400s | — (v1.1) |
| `/blog` | `app/(public)/blog/page.tsx` | ISR 3600s | — |
| `/blog/[slug]` | `app/(public)/blog/[slug]/page.tsx` | ISR 86400s | — |
| `/blog/page/[n]` | `app/(public)/blog/page/[n]/page.tsx` | ISR 3600s | — (si paginación) |
| `/contact` | `app/(public)/contact/page.tsx` | ISR 3600s | — |
| `/admin` | `app/admin/page.tsx` | SSR | ✓ |
| `/admin/login` | `app/admin/login/page.tsx` | SSR | — |
| `/admin/projects` | `app/admin/projects/page.tsx` | SSR | ✓ |
| `/admin/projects/[id]` | `app/admin/projects/[id]/page.tsx` | SSR | ✓ |
| `/admin/articles` | `app/admin/articles/page.tsx` | SSR | ✓ |
| `/admin/articles/[id]` | `app/admin/articles/[id]/page.tsx` | SSR | ✓ |
| `/admin/experience` | `app/admin/experience/page.tsx` | SSR | ✓ |
| `/admin/technologies` | `app/admin/technologies/page.tsx` | SSR | ✓ |
| `/admin/seo` | `app/admin/seo/page.tsx` | SSR | ✓ |
| `/admin/pages/[slug]` | `app/admin/pages/[slug]/page.tsx` | SSR | ✓ |
| `/sitemap.xml` | `app/sitemap.ts` | Dynamic | — |
| `/robots.txt` | `app/robots.ts` | Dynamic | — |
| `/api/revalidate` | `app/api/revalidate/route.ts` | Route Handler | Secret token |

#### Route groups

```
app/
├── (public)/          # Layout: Header + Footer + skip link
│   ├── layout.tsx
│   └── ...
├── admin/             # Layout: AdminShell + sidebar
│   ├── layout.tsx     # Auth check
│   └── ...
└── layout.tsx         # Root: fonts, analytics, metadata defaults
```

**Convenciones:**

- Slugs en kebab-case; generados server-side con transliteración Unicode → ASCII.
- `generateStaticParams()` para `/blog/[slug]` con top N artículos en build; resto on-demand ISR.
- `notFound()` si slug no existe o `status !== published` en rutas públicas.
- Admin usa UUID en URLs internas (`/admin/projects/[id]`), no slug (evita colisiones en drafts).

**Middleware (`middleware.ts`):**

```typescript
// Pseudocódigo — responsabilidades
1. Refrescar sesión Supabase (createServerClient + cookies)
2. /admin/* (except /admin/login) → redirect /admin/login si !session
3. /admin/login → redirect /admin si session válida + whitelisted
4. Non-production → header X-Robots-Tag: noindex, nofollow
5. Matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)']
```

→ Ver [ADR-TD-002](#adr-td-002-app-router-con-route-groups)

---

### 2.3 UI Library

**Decisión:** shadcn/ui como base del admin + componentes custom del design system público (IDEA.html).

| Ámbito | Librería | Componentes |
|--------|----------|-------------|
| **Admin** | shadcn/ui (Radix primitives) | Button, Input, Textarea, Select, Dialog, Table, Tabs, Toast, Form |
| **Public** | Custom (`components/ui/`) | Card, Badge, BtnPrimary, BtnSecondary, SectionLabel, Timeline, MetricHighlight |
| **Shared** | Lucide React | Iconografía consistente |
| **Forms admin** | react-hook-form + @hookform/resolvers/zod | Validación client + server |
| **Tables admin** | @tanstack/react-table | Listados con sort/filter |
| **MD Editor** | @uiw/react-md-editor (v1.1) | MVP: textarea + preview custom |

**Justificación shadcn/ui para admin:**

- Copy-paste, no dependency lock-in; código en el repo.
- Accesibilidad Radix (WCAG 2.1 AA) out of the box.
- Tailwind-native; theming con CSS variables alineado a tokens dark.
- Acelera 2 sprints de admin vs construir forms desde cero.

**Justificación custom para public:**

- IDEA.html ya define identidad visual única (accent `#c8bfff`, cards, metric highlights, side dock).
- shadcn default look genérico; público debe diferenciarse como marca personal.

**Componentes públicos clave (mapeo IDEA.html → React):**

| Prototipo | Componente | Server/Client |
|-----------|------------|---------------|
| `.card` | `<Card>` | Server |
| `.badge` | `<Badge>` | Server |
| `.btn-primary` | `<Button variant="primary">` | Server |
| Timeline experiencia | `<ExperienceTimeline>` | Server |
| `.lab-card` | `<ArticleCard>` | Server |
| `.bridge-table` | `<BioBridgeTable>` | Server |
| `#mobile-menu` | `<MobileNav>` | Client |
| `.side-dock` | `<SideDock>` | Client (v1.1) |

→ Ver [ADR-TD-003](#adr-td-003-shadcnui-admin--design-system-custom-público)

---

### 2.4 Styling

**Decisión:** Tailwind CSS 4 con design tokens como CSS custom properties.

#### Configuración (`app/globals.css`)

```css
@theme {
  --color-bg: #0a0a0b;
  --color-surface: #141416;
  --color-surface-raised: #1c1c1f;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-text-primary: #fafafa;
  --color-text-secondary: #a1a1aa;
  --color-text-muted: #71717a;
  --color-accent: #c8bfff;
  --color-accent-muted: rgba(200, 191, 255, 0.12);
  --color-metric-positive: #34d399;
  --color-metric-teal: #2dd4bf;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Geist", "Inter", system-ui, sans-serif;

  --spacing-gutter: 24px;
  --spacing-section-gap: 96px;
}
```

#### Fuentes (`next/font`)

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geist = localFont({ src: './fonts/GeistVF.woff2', variable: '--font-display' });
```

**Reglas de estilo:**

| Regla | Detalle |
|-------|---------|
| Dark-only MVP | Sin toggle theme; `class="dark"` en `<html>` |
| Mobile-first | Breakpoints: `sm:640`, `md:768`, `lg:1024`, `xl:1280` |
| Prose blog | `@tailwindcss/typography` plugin; clase `prose prose-invert` |
| Animations | `prefers-reduced-motion: reduce` desactiva transitions (IDEA.html) |
| Focus | `:focus-visible` outline accent 2px (accesibilidad) |
| No CSS modules | Tailwind utility-first; excepción: SVG radar chart |

→ Ver [ADR-TD-004](#adr-td-004-tailwind-css-4-con-design-tokens)

---

### 2.5 State Management

**Decisión:** Sin store global (Redux/Zustand). Estado distribuido por capa.

| Contexto | Mecanismo | Caso de uso |
|----------|-----------|-------------|
| **Datos públicos** | Server Components + fetch en server | Proyectos, artículos, experiencia |
| **Cache server** | React `cache()` + Next.js Data Cache | Dedup queries en mismo request |
| **Mutaciones admin** | Server Actions + `useActionState` | CRUD forms |
| **Form state admin** | react-hook-form (client) | Validación inline, dirty tracking |
| **UI efímera admin** | `useState` local | Dialogs, toasts, tabs |
| **URL state** | `searchParams` + `useRouter` | Paginación blog admin, filtros |
| **Sesión** | Supabase Auth cookies via middleware | Auth state; no expuesto a client |
| **Optimistic UI** | `useOptimistic` (React 19) | Reorder experience/projects (P1) |

**Justificación:** el 90% del sitio es read-only renderizado en servidor. Un global store añadiría complejidad sin beneficio. Server Actions eliminan la necesidad de sincronizar estado client-server post-mutation.

**Anti-patterns prohibidos:**

- `useEffect` para fetch de datos en public pages → usar Server Components.
- Context API para datos de servidor → prop drilling en server es gratis.
- SWR/React Query en public pages → ISR + RSC es suficiente.

→ Ver [ADR-TD-005](#adr-td-005-sin-global-state-store)

---

## 3. Backend

### 3.1 Framework

**Decisión:** Next.js Server runtime (Node.js) — mismo proceso que frontend.

| Capa backend | Implementación |
|--------------|----------------|
| Business logic | `lib/domain/*.ts` — funciones puras + servicios |
| Data access | `lib/repositories/*.ts` — Supabase queries tipadas |
| Mutations | Server Actions en `app/admin/**/actions.ts` |
| Read APIs | Server Components llaman repositories directamente |
| Webhooks/API | Route Handlers en `app/api/` |
| Validation | Zod schemas en `lib/schemas/` — shared client/server |

**Patrón de capas:**

```
Server Action / RSC
       │
       ▼
  Domain Service     ← reglas: publish, slug, seo merge, reading time
       │
       ▼
  Repository         ← SQL via Supabase client
       │
       ▼
  PostgreSQL + RLS
```

**Ejemplo Server Action:**

```typescript
// app/admin/projects/actions.ts
'use server';

export async function publishProject(id: string): Promise<ActionResult> {
  const user = await requireAdmin();           // auth guard
  const parsed = uuidSchema.safeParse(id);   // validation
  if (!parsed.success) return { error: 'Invalid ID' };

  await projectService.publish(id);            // domain
  revalidateTag('projects');
  revalidateTag('home');
  return { success: true };
}
```

→ Ver [ADR-TD-006](#adr-td-006-server-actions-como-api-primaria)

---

### 3.2 API Strategy

**Decisión:** Server Actions first; Route Handlers solo para casos excepcionales.

| Mecanismo | Cuándo usar | Ejemplos |
|-----------|-------------|----------|
| **Server Actions** | Mutaciones admin, form submits | CRUD projects, publish article, upload media |
| **Server Components (direct fetch)** | Lectura pública y admin | List projects, get article by slug |
| **Route Handlers** | Non-HTML responses, external callers | `sitemap.ts`, `robots.ts`, `/api/revalidate`, `/api/contact` (v1.1) |
| **REST API pública** | — | Out of scope MVP; v2.0 public API |

#### Contratos Server Actions

```typescript
// lib/types/actions.ts
type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

Todas las actions retornan `ActionResult` — nunca throw al client (except unexpected errors → 500 logged).

#### Route Handlers

| Endpoint | Method | Auth | Propósito |
|----------|--------|------|-----------|
| `/api/revalidate` | POST | Bearer `REVALIDATE_SECRET` | On-demand ISR (CI, external) |
| `/api/contact` | POST | Turnstile token (v1.1) | Formulario contacto → Resend |
| `/api/auth/callback` | GET | Supabase | OAuth callback (si no usa middleware-only) |

**No REST CRUD expuesto:** el admin no consume `/api/projects` — accede directo via Server Actions. Reduce surface area de ataque.

#### Cache tags (contrato)

| Tag | Invalidado cuando |
|-----|-------------------|
| `home` | Hero, featured projects, latest articles change |
| `page-content` | About, contact singleton update |
| `experience` | Experience CRUD |
| `projects` | Project CRUD |
| `project:{slug}` | Single project update |
| `articles` | Article CRUD |
| `article:{slug}` | Single article update |
| `seo` | Global SEO settings change |

→ Ver [ADR-TD-007](#adr-td-007-server-actions-first-sin-rest-crud)

---

### 3.3 Authentication

**Decisión:** Supabase Auth con GitHub OAuth + whitelist de admin.

#### Flujo

```
1. Admin → /admin/login → click "Login with GitHub"
2. supabase.auth.signInWithOAuth({ provider: 'github' })
3. GitHub OAuth → callback → Supabase sets session cookies
4. middleware.ts refreshes session on every /admin request
5. requireAdmin() checks:
   a. session exists
   b. session.user.id IN admin_users table (or env ADMIN_UUIDS)
6. If !whitelisted → signOut + redirect /admin/login?error=unauthorized
```

#### Implementación

| Componente | Ubicación | Responsabilidad |
|------------|-----------|-----------------|
| Supabase server client | `lib/supabase/server.ts` | `createServerClient` con cookies |
| Supabase browser client | `lib/supabase/client.ts` | Solo login page |
| Middleware | `middleware.ts` | Session refresh + route guard |
| Auth guard | `lib/auth/require-admin.ts` | Server-side check en actions/layouts |
| Admin whitelist | `admin_users` table | UUIDs autorizados |

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,  -- matches auth.users.id
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Seguridad:**

| Medida | Detalle |
|--------|---------|
| Cookies | HTTP-only, Secure, SameSite=Lax |
| Session refresh | Middleware en cada request admin |
| RLS | Todas las mutations requieren `auth.uid() IN (SELECT id FROM admin_users)` |
| Rate limit | Vercel WAF + Supabase Auth built-in |
| CSRF | Server Actions tienen CSRF protection nativa Next.js |
| Service role key | Solo server-side; nunca en client bundle |

→ Ver [ADR-TD-008](#adr-td-008-supabase-auth--github-oauth--whitelist)

---

## 4. Database

### 4.1 Modelo

**Decisión:** PostgreSQL relacional normalizado (3NF) con JSONB para contenido flexible.

**Principios:**

- Entidades de negocio en tablas propias con FK explícitas.
- Relaciones M:N via junction tables.
- SEO fields embebidos por entidad (no tabla separada — evita joins innecesarios).
- Singletons (`seo_settings`, `page_content`) para config global y páginas estáticas.
- Soft delete: **no** — hard delete con `ON DELETE CASCADE` (single admin, bajo riesgo).
- Timestamps: `created_at`, `updated_at` con trigger automático.

### 4.2 Diagrama ER

```
┌─────────────────┐       ┌───────────────────────┐       ┌─────────────────┐
│  seo_settings   │       │    page_content       │       │  admin_users    │
│  (singleton)    │       │  PK: id (hero,about)  │       │  PK: id (uuid)  │
└─────────────────┘       └───────────────────────┘       └─────────────────┘

┌─────────────────┐       ┌───────────────────────┐       ┌─────────────────┐
│  technologies   │◄──────│  project_technologies │──────►│    projects     │
│  PK: id         │  M:N  │  PK: (proj, tech)     │  M:N  │  PK: id         │
└────────┬────────┘       └───────────────────────┘       └─────────────────┘
         │
         │                ┌───────────────────────────┐
         └────────────────│  experience_technologies  │──────►┌─────────────────┐
                    M:N   │  PK: (exp, tech)          │  M:N  │  experiences    │
                          └───────────────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    articles     │       │ contact_messages│  (v1.1)
│  PK: id         │       │  PK: id         │
└─────────────────┘       └─────────────────┘

┌─────────────────┐
│  media_assets   │
│  PK: id         │
└─────────────────┘
```

### 4.3 Tablas

#### Enums

```sql
CREATE TYPE content_status AS ENUM ('draft', 'published');
CREATE TYPE tech_category AS ENUM ('language', 'framework', 'infra', 'database', 'tool');
```

#### `technologies`

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | |
| name | TEXT | NOT NULL | "Go", "PostgreSQL" |
| slug | TEXT | UNIQUE, NOT NULL | "go", "postgresql" |
| category | tech_category | NOT NULL | |
| icon_url | TEXT | NULL | URL icono SVG/PNG |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

#### `projects`

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | |
| title | TEXT | NOT NULL | |
| slug | TEXT | UNIQUE, NOT NULL | URL-safe |
| category | TEXT | NOT NULL | "Backend · API" |
| problem | TEXT | NOT NULL | |
| solution | TEXT | NOT NULL | |
| result | TEXT | NOT NULL | |
| content | TEXT | NULL | Markdown extendido (v1.1 detail page) |
| github_url | TEXT | NULL | |
| demo_url | TEXT | NULL | |
| cover_image_url | TEXT | NULL | |
| featured | BOOLEAN | DEFAULT false | |
| status | content_status | DEFAULT 'draft' | |
| sort_order | INT | DEFAULT 0 | |
| seo_title | TEXT | NULL | |
| seo_description | TEXT | NULL | |
| seo_og_image | TEXT | NULL | |
| seo_canonical | TEXT | NULL | |
| seo_noindex | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

**Indexes:** `(status, sort_order)`, `(slug)`, `(featured) WHERE featured = true`

#### `project_technologies`

| Columna | Tipo | Constraints |
|---------|------|-------------|
| project_id | UUID | FK → projects(id) ON DELETE CASCADE |
| technology_id | UUID | FK → technologies(id) ON DELETE CASCADE |
| | | PK (project_id, technology_id) |

#### `articles`

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | |
| title | TEXT | NOT NULL | |
| slug | TEXT | UNIQUE, NOT NULL | |
| excerpt | TEXT | NOT NULL, CHECK 160–320 chars | OG fallback |
| content | TEXT | NOT NULL | Markdown source |
| tags | TEXT[] | DEFAULT '{}' | |
| cover_image_url | TEXT | NULL | |
| status | content_status | DEFAULT 'draft' | |
| published_at | TIMESTAMPTZ | NULL | Set on first publish |
| reading_time_min | INT | NULL | Computed on save |
| seo_title | TEXT | NULL | |
| seo_description | TEXT | NULL | |
| seo_og_image | TEXT | NULL | |
| seo_canonical | TEXT | NULL | |
| seo_noindex | BOOLEAN | DEFAULT false | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

**Indexes:** `(status, published_at DESC)`, `(slug)`, GIN on `tags`

#### `experiences`

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | |
| company | TEXT | NOT NULL | |
| role | TEXT | NOT NULL | |
| start_date | DATE | NOT NULL | |
| end_date | DATE | NULL | NULL = "Presente" |
| bullets | JSONB | NOT NULL, DEFAULT '[]' | string[] |
| sort_order | INT | DEFAULT 0 | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### `experience_technologies`

| Columna | Tipo | Constraints |
|---------|------|-------------|
| experience_id | UUID | FK → experiences(id) ON DELETE CASCADE |
| technology_id | UUID | FK → technologies(id) ON DELETE CASCADE |
| | | PK (experience_id, technology_id) |

#### `page_content` (singletons)

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | TEXT | PK | 'hero', 'about', 'contact' |
| data | JSONB | NOT NULL | Schema varies by id |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

**JSONB schemas (validados con Zod en app):**

```typescript
// hero
{
  name: string;
  headline: string;
  subheadline: string;
  bio: string;
  availability: { label: string; visible: boolean };
  photoUrl: string;
  cvUrl: string;
  socialLinks: { github: string; linkedin: string; email: string };
  metrics: Array<{
    label: string;
    value: string;
    description: string;
    variant: 'highlight' | 'default';
  }>;
}

// about
{
  title: string;
  paragraphs: string[];
  interests: string[];
  bioBridge: Array<{ from: string; to: string }>;
  skills?: Array<{ name: string; level: number }>;  // v1.1 radar
}

// contact
{
  title: string;
  description: string;
  email: string;
  linkedin: string;
  github: string;
}
```

#### `seo_settings` (singleton)

| Columna | Tipo | Constraints |
|---------|------|-------------|
| id | INT | PK, CHECK (id = 1) |
| site_name | TEXT | NOT NULL |
| title_template | TEXT | DEFAULT '%s \| Esteban Maya' |
| default_description | TEXT | NOT NULL |
| default_og_image | TEXT | NULL |
| twitter_handle | TEXT | NULL |
| site_url | TEXT | NOT NULL |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

#### `admin_users`

| Columna | Tipo | Constraints |
|---------|------|-------------|
| id | UUID | PK, FK → auth.users(id) |
| email | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

#### `media_assets`

| Columna | Tipo | Constraints | Descripción |
|---------|------|-------------|-------------|
| id | UUID | PK | |
| filename | TEXT | NOT NULL | |
| storage_path | TEXT | NOT NULL | Supabase Storage path |
| mime_type | TEXT | NOT NULL | |
| size_bytes | INT | NOT NULL | |
| alt_text | TEXT | NULL | |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

#### `contact_messages` (v1.1)

| Columna | Tipo | Constraints |
|---------|------|-------------|
| id | UUID | PK |
| name | TEXT | NOT NULL |
| email | TEXT | NOT NULL |
| message | TEXT | NOT NULL |
| ip_hash | TEXT | NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |

### 4.4 Relaciones

| Relación | Tipo | On Delete | Justificación |
|----------|------|-----------|---------------|
| projects ↔ technologies | M:N | CASCADE | Reutilizar catálogo tech across entities |
| experiences ↔ technologies | M:N | CASCADE | Mismo catálogo |
| admin_users → auth.users | 1:1 | — | Whitelist post-OAuth |
| media_assets | Standalone | — | Referenciado por URL en otras entidades |

**Queries frecuentes (optimizadas):**

```sql
-- Featured projects for home
SELECT p.*, array_agg(t.name) AS tech_names
FROM projects p
LEFT JOIN project_technologies pt ON pt.project_id = p.id
LEFT JOIN technologies t ON t.id = pt.technology_id
WHERE p.status = 'published' AND p.featured = true
GROUP BY p.id
ORDER BY p.sort_order ASC
LIMIT 3;

-- Published articles paginated
SELECT id, title, slug, excerpt, tags, cover_image_url, published_at, reading_time_min
FROM articles
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 9 OFFSET $1;
```

### 4.5 Row Level Security

```sql
-- Public read: published content only
CREATE POLICY "public_read_projects" ON projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "public_read_articles" ON articles
  FOR SELECT USING (status = 'published');

-- Public read: all experiences, technologies, page_content, seo_settings
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "public_read_technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "public_read_page_content" ON page_content FOR SELECT USING (true);
CREATE POLICY "public_read_seo" ON seo_settings FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "admin_all" ON projects
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));
-- (repetir para articles, experiences, technologies, page_content, seo_settings, media_assets)
```

→ Ver [ADR-TD-009](#adr-td-009-postgresql-normalizado--jsonb-singletons)

---

## 5. CMS

### 5.1 Alternativas evaluadas

| Opción | Tipo | Costo MVP | Admin UI | Relaciones | SEO control |
|--------|------|-----------|----------|------------|-------------|
| **A. Custom (Next.js + Supabase)** ✓ | Headless custom | $0 | Construir (~2 sprints) | SQL nativo | Total |
| B. Sanity | Headless SaaS | $0–99/mo | Studio incluido | References | Bueno |
| C. Contentful | Headless SaaS | $0–300/mo | Web app | References | Bueno |
| D. Payload CMS | Self-hosted CMS | $0 + hosting | Admin incluido | SQL/NoSQL | Bueno |
| E. Keystatic | Git-based CMS | $0 | Editor en repo | Files | Limitado |
| F. TinaCMS | Git-based CMS | $0–29/mo | Visual editor | Files | Limitado |
| G. Strapi | Self-hosted CMS | $0 + hosting | Admin incluido | SQL | Medio |
| H. MDX en repo | Files in git | $0 | IDE / GitHub | Manual | Total pero requiere deploy |

### 5.2 Pros y contras detallados

#### A. Custom Next.js + Supabase (ELEGIDO)

| Pros | Contras |
|------|---------|
| Control total UX admin a medida | ~2 sprints desarrollo admin |
| $0 en tier free Supabase | Mantenimiento a cargo del owner |
| Relaciones M:N nativas SQL | Sin preview visual out-of-the-box (hay que construir) |
| Server Actions = zero API boilerplate | Sin versionado de contenido en git |
| Coherente con stack Next.js | |
| RLS como defensa en profundidad | |

#### B. Sanity

| Pros | Contras |
|------|---------|
| Studio excelente, realtime | GROQ learning curve |
| Portable Text rico | Relaciones M:N más verbosas |
| CDN incluido | Vendor lock-in |
| Preview drafts nativo | Overkill para 1 admin |
| | Costo escala con documentos |

#### C. Contentful

| Pros | Contras |
|------|---------|
| Enterprise-grade | Caro para portfolio personal |
| REST + GraphQL API | Over-engineering MVP |
| Roles granulares | 1 admin no necesita RBAC |

#### D. Payload CMS

| Pros | Contras |
|------|---------|
| Admin auto-generado desde schema | Segundo servicio o monorepo |
| TypeScript native | Hosting adicional o embedded complexity |
| Self-hosted = control | Más infra que custom puro |

#### E/F. Keystatic / TinaCMS (git-based)

| Pros | Contras |
|------|---------|
| Versionado en git | **Viola OKR "cero commits por edit"** |
| $0 | No apto para admin no-dev (irrelevante aquí) |
| Preview con branches | Deploy por cada cambio de contenido |

#### G. Strapi

| Pros | Contras |
|------|---------|
| Admin maduro | Pesado (~200MB Docker) |
| Plugin ecosystem | Node server separado |
| REST/GraphQL auto | Overkill; otro servicio que mantener |

### 5.3 Decisión CMS

**Custom admin integrado en Next.js** usando Server Actions + Supabase.

**Módulos admin MVP:**

| Módulo | Ruta | Funcionalidad |
|--------|------|---------------|
| Dashboard | `/admin` | Contadores drafts, últimas ediciones |
| Projects | `/admin/projects` | CRUD + featured toggle + reorder |
| Articles | `/admin/articles` | CRUD + MD editor + publish |
| Experience | `/admin/experience` | CRUD + reorder + tech picker |
| Technologies | `/admin/technologies` | CRUD catálogo |
| Pages | `/admin/pages/[slug]` | Edit hero, about, contact JSONB |
| SEO | `/admin/seo` | Global settings + preview snippet |
| Media | `/admin/media` (P1) | Upload manager |

→ Ver [ADR-TD-010](#adr-td-010-cms-custom-integrado)

---

## 6. SEO

### 6.1 Estrategia técnica

#### Pipeline de metadata (por request)

```
Route matched
    │
    ▼
generateMetadata({ params, searchParams })
    │
    ├── seoService.getGlobalSettings()
    ├── seoService.getEntitySeo(route, params)  [if dynamic]
    └── seoService.resolve({ global, entity, path })
            │
            ├── title:      entity.seo_title ?? template(entity.title)
            ├── description: entity.seo_description ?? excerpt ?? global.default
            ├── canonical:  entity.seo_canonical ?? `${siteUrl}${path}`
            ├── robots:     entity.seo_noindex ? 'noindex' : 'index, follow'
            ├── openGraph:  { title, description, image, url, type }
            └── twitter:    { card: 'summary_large_image', ... }
```

#### Implementación Metadata API

```typescript
// app/(public)/blog/[slug]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await articleRepo.getPublishedBySlug(params.slug);
  if (!article) return {};

  return seoService.toMetadata({
    entity: article,
    path: `/blog/${article.slug}`,
    type: 'article',
  });
}
```

#### JSON-LD (componente reutilizable)

```typescript
// components/seo/JsonLd.tsx — Server Component
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

| Ruta | Schema `@type` | Campos obligatorios |
|------|----------------|---------------------|
| `/` | `Person`, `WebSite` | name, url, sameAs, jobTitle |
| `/about` | `Person` | description, knowsAbout |
| `/experience` | `ProfilePage` | mainEntity → worksFor |
| `/blog/[slug]` | `BlogPosting` | headline, author, datePublished, image |
| `/projects/[slug]` | `SoftwareSourceCode` | name, description, codeRepository |

#### Sitemap dinámico

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const [projects, articles] = await Promise.all([
    projectRepo.getPublishedSlugs(),
    articleRepo.getPublishedSlugs(),
  ]);

  return [
    { url: base, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.8 },
    // ... static routes
    ...projects.map(p => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articles.map(a => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
```

#### Robots

```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: `${base}/sitemap.xml`,
  };
}
```

#### Blog SEO

| Táctica | Implementación |
|---------|----------------|
| URLs semánticas | Slug from title; unique constraint DB |
| Heading hierarchy | MD → HTML con rehype-slug + rehype-autolink-headings |
| Reading time | `Math.ceil(wordCount / 200)` on save |
| Internal linking | Manual en MD; v1.2: related posts component |
| OG image | `article.seo_og_image ?? cover_image ?? global default` |
| Canonical | Siempre absolute URL con `site_url` |
| Pagination | `/blog/page/2`; canonical page 1 para filters |
| RSS (v1.1) | Route Handler `/blog/rss.xml` |

#### Entornos

| Entorno | `robots` | Canonical |
|---------|----------|-----------|
| Production | index, follow | `estebanmaya.dev` |
| Preview | noindex (middleware header) | N/A |
| Local | noindex | localhost |

→ Ver [ADR-TD-011](#adr-td-011-metadata-api--json-ld-server-side)

---

## 7. Infraestructura

### 7.1 Hosting

**Decisión:** Vercel (Production + Preview environments).

| Aspecto | Configuración |
|---------|---------------|
| **Production** | Branch `main` → `estebanmaya.dev` |
| **Preview** | PR branches → `*.vercel.app` |
| **Region** | `iad1` (US East) — default; CDN global |
| **Node version** | 22.x (`.nvmrc` + `engines` in package.json) |
| **Framework preset** | Next.js (auto-detected) |
| **DNS** | A/CNAME → Vercel; SSL auto |
| **Env vars** | Vercel dashboard per environment |

**Supabase:**

| Entorno | Proyecto |
|---------|----------|
| Production | `portfolio-prod` |
| Staging/Preview | `portfolio-staging` (PR previews apuntan aquí) |
| Local | Supabase CLI local o staging |

→ Ver [ADR-TD-012](#adr-td-012-vercel--supabase-environments)

---

### 7.2 CI/CD

**Decisión:** GitHub Actions para CI; Vercel para CD.

#### Pipeline CI (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint          # eslint
      - run: npm run typecheck     # tsc --noEmit
      - run: npm run test          # vitest (unit)
      - run: npm run build         # next build

  # v1.1: lighthouse CI on preview URL
```

#### Pipeline CD

| Trigger | Acción | Destino |
|---------|--------|---------|
| PR opened/updated | Vercel Preview Deploy | `*.vercel.app` + staging Supabase |
| Merge to `main` | Vercel Production Deploy | `estebanmaya.dev` + prod Supabase |
| Manual | `vercel rollback` | Previous deployment |

#### Migraciones DB

```yaml
# .github/workflows/migrate.yml (manual trigger on release)
- supabase db push --linked  # solo prod, con approval gate
```

**Reglas:**

- Migraciones SQL en `supabase/migrations/` — versionadas en git.
- Nunca migrar prod automáticamente en PR; requiere merge a `main` + manual trigger.
- Seed data en `supabase/seed.sql` — solo dev/staging.

#### Branch strategy

```
main ─────────────► Production
  └── feat/* ─────► PR → Preview deploy
```

→ Ver [ADR-TD-013](#adr-td-013-github-actions-ci--vercel-cd)

---

### 7.3 Observabilidad

**Decisión:** Observabilidad ligera MVP; expandir en v1.1.

| Pilar | Herramienta | MVP | v1.1 |
|-------|-------------|-----|------|
| **Logs** | Vercel Runtime Logs | ✓ | + structured JSON logs |
| **Errors** | Console + Vercel dashboard | ✓ | + Sentry |
| **Metrics** | Vercel Analytics | ✓ | + custom events |
| **Web Vitals** | Vercel Speed Insights | ✓ | — |
| **Uptime** | Vercel dashboard | ✓ | + Better Stack (P2) |
| **DB monitoring** | Supabase dashboard | ✓ | + query performance |
| **Alerts** | — | — | Sentry → email/Slack |

#### Instrumentación MVP

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

#### Custom events (v1.1)

| Evento | Trigger | Propiedades |
|--------|---------|-------------|
| `cta_click` | Click Contact/CV/GitHub | `{ type, page }` |
| `project_view` | Project card click | `{ slug }` |
| `blog_read_depth` | Scroll observer | `{ slug, depth: 25/50/75/100 }` |
| `contact_submit` | Form success | `{ source }` |
| `admin_publish` | Server Action | `{ entity, id }` — server log |

#### Error handling

```typescript
// lib/errors.ts
export function logError(error: unknown, context: Record<string, unknown>) {
  console.error(JSON.stringify({
    level: 'error',
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    ...context,
  }));
  // v1.1: Sentry.captureException(error, { extra: context })
}
```

→ Ver [ADR-TD-014](#adr-td-014-observabilidad-ligera-vercel-analytics)

---

## 8. Estructura del repositorio

```
portfolio/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── migrate.yml
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── actions.ts
│   │   ├── articles/
│   │   ├── experience/
│   │   ├── technologies/
│   │   ├── pages/[slug]/
│   │   └── seo/
│   ├── api/
│   │   ├── revalidate/route.ts
│   │   └── contact/route.ts          # v1.1
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                           # Public design system
│   ├── admin/                        # Admin-specific components
│   ├── public/                       # Page sections (Hero, Timeline...)
│   └── seo/                          # JsonLd, Breadcrumbs
├── lib/
│   ├── auth/
│   │   └── require-admin.ts
│   ├── domain/
│   │   ├── content/
│   │   │   ├── project-service.ts
│   │   │   ├── article-service.ts
│   │   │   └── experience-service.ts
│   │   ├── seo/
│   │   │   └── seo-service.ts
│   │   └── media/
│   │       └── media-service.ts
│   ├── repositories/
│   │   ├── project-repo.ts
│   │   ├── article-repo.ts
│   │   ├── experience-repo.ts
│   │   ├── technology-repo.ts
│   │   ├── page-content-repo.ts
│   │   └── seo-repo.ts
│   ├── schemas/                      # Zod schemas
│   │   ├── project.ts
│   │   ├── article.ts
│   │   └── page-content.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── markdown/
│   │   └── render.ts                 # MD → HTML pipeline
│   └── utils/
│       ├── slug.ts
│       └── reading-time.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seed.sql
├── types/
│   └── database.ts                     # Generated: supabase gen types
├── public/
│   ├── fonts/
│   └── favicon.ico
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
├── PRD.md
├── Architecture.md
└── TechnicalDesign.md
```

---

## 9. ADRs — Architecture Decision Records

### ADR-TD-001: Next.js 15 como framework full-stack

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Portafolio con SEO agresivo, CMS admin, ISR, metadata dinámica. PRD exige Lighthouse ≥ 90 performance y ≥ 95 SEO. |
| **Decisión** | Next.js 15 App Router con React 19 Server Components. |
| **Alternativas** | Astro 5, Remix, SvelteKit, Vite SPA + prerender |
| **Pros** | Metadata API nativa; ISR; Server Actions; deploy Vercel zero-config; RSC minimiza JS |
| **Contras** | Curva RSC; acoplamiento moderado a Vercel para features avanzadas |
| **Consecuencias** | Todo el equipo (de 1) trabaja en un solo framework TS. |

---

### ADR-TD-002: App Router con route groups

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Front office y admin comparten root layout (fonts, analytics) pero necesitan layouts distintos (Header vs AdminShell). |
| **Decisión** | Route groups `(public)` y `admin` con layouts anidados. |
| **Alternativas** | Pages Router (legacy), monolito sin groups, apps separadas |
| **Pros** | Layouts independientes; URLs limpias sin segmento `(public)`; colocation |
| **Contras** | Confusión potencial con groups invisibles en URL |
| **Consecuencias** | Middleware matcher debe excluir assets estáticos explícitamente. |

---

### ADR-TD-003: shadcn/ui (admin) + design system custom (público)

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Admin necesita forms/tablas accesibles rápidamente. Public site tiene identidad visual única en IDEA.html. |
| **Decisión** | shadcn/ui para admin; componentes custom para front office. |
| **Alternativas** | shadcn everywhere, MUI, Chakra, 100% custom |
| **Pros** | Admin rápido + a11y Radix; public brand diferenciada; código en repo |
| **Contras** | Dos sistemas de componentes que mantener |
| **Consecuencias** | Tokens CSS compartidos en `@theme`; shadcn themed dark. |

---

### ADR-TD-004: Tailwind CSS 4 con design tokens

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | IDEA.html usa Tailwind via CDN con tokens custom. PRD exige dark-first y WCAG AA. |
| **Decisión** | Tailwind CSS 4 con `@theme` CSS variables mapeadas desde IDEA.html. |
| **Alternativas** | CSS Modules, Styled Components, Panda CSS |
| **Pros** | Continuidad prototipo; utility-first; `@tailwindcss/typography` para blog |
| **Contras** | Clases largas; requiere disciplina de diseño |
| **Consecuencias** | `@tailwindcss/typography` para prose blog; fonts via `next/font`. |

---

### ADR-TD-005: Sin global state store

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | 90% read-only server-rendered. Single admin. No real-time collaboration. |
| **Decisión** | No Redux/Zustand/Jotai. Server Components + Server Actions + local useState. |
| **Alternativas** | Zustand, TanStack Query, Jotai |
| **Pros** | Simplicidad; no sync client-server; menos bugs |
| **Contras** | Optimistic UI más manual (useOptimistic en P1) |
| **Consecuencias** | react-hook-form solo en admin client forms. |

---

### ADR-TD-006: Server Actions como API primaria

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Admin CRUD sin consumidores externos. PRD MVP no requiere API pública. |
| **Decisión** | Server Actions para todas las mutaciones admin. |
| **Alternativas** | REST API, tRPC, GraphQL |
| **Pros** | Type-safe end-to-end; no API routes boilerplate; CSRF built-in |
| **Contras** | Acoplado a Next.js; no usable por clientes externos |
| **Consecuencias** | Route Handlers solo para sitemap, robots, webhooks. |

---

### ADR-TD-007: Server Actions first, sin REST CRUD

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Minimizar attack surface. Solo 1 consumidor (admin UI). |
| **Decisión** | No exponer `/api/projects`, `/api/articles`. Lectura via Server Components directo a repo. |
| **Alternativas** | RESTful API completa, tRPC router |
| **Pros** | Menos endpoints; menos auth complexity; menos código |
| **Contras** | v2 public API requerirá refactor o Route Handlers new |
| **Consecuencias** | v2.0 API pública como capa separada si se necesita. |

---

### ADR-TD-008: Supabase Auth + GitHub OAuth + whitelist

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Single admin (Esteban). PRD: OAuth preferido. Identidad dev en GitHub. |
| **Decisión** | Supabase Auth con GitHub provider. Post-login check contra `admin_users`. |
| **Alternativas** | NextAuth, Clerk, Auth0, email/password |
| **Pros** | Integrado con Supabase RLS; sin passwords; free |
| **Contras** | Dependencia GitHub uptime; whitelist manual |
| **Consecuencias** | Google OAuth como backup provider (configurable en Supabase). |

---

### ADR-TD-009: PostgreSQL normalizado + JSONB singletons

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Entidades relacionales (Technology M:N) + páginas con estructura flexible (hero metrics). |
| **Decisión** | 3NF para entidades core; JSONB para `page_content.data`; SEO embebido por entidad. |
| **Alternativas** | Full JSONB (NoSQL), normalización total (tabla metric, tabla bio_bridge...) |
| **Pros** | Queries eficientes; flexibilidad donde importa; RLS por tabla |
| **Contras** | JSONB no validado por DB (Zod en app layer) |
| **Consecuencias** | Zod schemas obligatorios para read/write de JSONB. |

---

### ADR-TD-010: CMS custom integrado

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | OKR "cero commits por edit". Relaciones M:N. Budget $0. Single admin dev. |
| **Decisión** | Admin custom en `/admin` con Server Actions. |
| **Alternativas** | Sanity, Contentful, Payload, Strapi, Keystatic (ver sección 5) |
| **Pros** | Control total; $0; SQL nativo; UX a medida |
| **Contras** | 2 sprints dev; mantenimiento propio |
| **Consecuencias** | Sanity descartado por costo y relaciones. Keystatic descartado por violar OKR git. |

---

### ADR-TD-011: Metadata API + JSON-LD server-side

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | PRD SEO-01 a SEO-06. Lighthouse SEO ≥ 95. OG previews en LinkedIn. |
| **Decisión** | `generateMetadata()` per route + `<JsonLd>` Server Component. SeoService centralizado. |
| **Alternativas** | next-seo package, manual `<Head>`, client-side meta (react-helmet) |
| **Pros** | Nativo App Router; SSR meta; type-safe Metadata object |
| **Contras** | Duplicación si no centralizas en SeoService |
| **Consecuencias** | SeoService es shared kernel entre public routes y admin preview. |

---

### ADR-TD-012: Vercel + Supabase environments

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Deploy continuo, preview por PR, DB separada prod/staging. |
| **Decisión** | Vercel (hosting) + 2 proyectos Supabase (prod, staging). |
| **Alternativas** | Railway, Fly.io, self-hosted, Supabase branching |
| **Pros** | Preview deploys automáticos; env vars per environment; CDN global |
| **Contras** | Vendor coupling Vercel+Supabase; egress costs si escala |
| **Consecuencias** | PR previews usan staging Supabase; prod solo on merge main. |

---

### ADR-TD-013: GitHub Actions CI + Vercel CD

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | PRD exige CI: lint, typecheck, build. Quality gate antes de merge. |
| **Decisión** | GitHub Actions para CI quality gates; Vercel Git integration para CD. |
| **Alternativas** | Vercel CI only, CircleCI, full GHA deploy |
| **Pros** | CI explícito en repo; CD automático Vercel; separation of concerns |
| **Contras** | Dos sistemas (GHA + Vercel) |
| **Consecuencias** | Lighthouse CI en v1.1 como job adicional post-deploy preview. |

---

### ADR-TD-014: Observabilidad ligera (Vercel Analytics)

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Single dev; MVP traffic bajo; PRD KPIs requieren page views y vitals. |
| **Decisión** | Vercel Analytics + Speed Insights MVP. Sentry en v1.1. |
| **Alternativas** | Datadog, Grafana stack, Plausible only, full OpenTelemetry |
| **Pros** | Zero config; privacy-friendly; Web Vitals incluidos; $0 |
| **Contras** | Custom events limitados vs full analytics suite |
| **Consecuencias** | Plausible como complemento privacy-first en v1.1 si se necesitan funnels. |

---

### ADR-TD-015: Zod para validación shared client/server

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Server Actions reciben input del client; JSONB requiere validación; forms admin. |
| **Decisión** | Zod schemas en `lib/schemas/` usados en Server Actions y react-hook-form resolvers. |
| **Alternativas** | Yup, Valibot, TypeBox, manual validation |
| **Pros** | Type inference; composable; ecosystem maduro con RHF |
| **Contras** | Runtime overhead mínimo |
| **Consecuencias** | Un schema per entity; never trust client input. |

---

### ADR-TD-016: react-markdown + Shiki para blog

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Artículos en Markdown almacenados en Postgres. Syntax highlight requerido. SSR para SEO. |
| **Decisión** | `react-markdown` + `remark-gfm` + `rehype-slug` + `rehype-pretty-code` (Shiki). |
| **Alternativas** | MDX runtime, marked, custom parser, Contentlayer |
| **Pros** | Render server-side; seguro (no eval); GFM tables/strikethrough; Shiki themes |
| **Contras** | No componentes React embebidos (MDX) — acceptable MVP |
| **Consecuencias** | v2.0 MDX solo si se necesitan componentes interactivos en artículos. |

---

### ADR-TD-017: ISR 3600s + on-demand revalidation

| Campo | Valor |
|-------|-------|
| **Estado** | Aceptado |
| **Fecha** | 2026-06-18 |
| **Contexto** | Performance ≥ 90; contenido cambia 1–4 veces/semana; freshness post-publish. |
| **Decisión** | ISR default 3600s; blog posts 86400s; `revalidateTag()` on admin publish. |
| **Alternativas** | SSR every request, pure SSG + rebuild, stale-while-revalidate 0 |
| **Pros** | Edge cache 99% requests; instant refresh on publish |
| **Contras** | Tag management complexity; stale up to 1h without publish trigger |
| **Consecuencias** | Tag contract documentado en sección 3.2. |

---

## 10. Apéndices

### A. Dependencias npm (MVP)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "@supabase/ssr": "^0.5.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-pretty-code": "^0.14.0",
    "shiki": "^1.0.0",
    "lucide-react": "^0.400.0",
    "@vercel/analytics": "^1.3.0",
    "@vercel/speed-insights": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "supabase": "^1.200.0"
  }
}
```

### B. Variables de entorno

```bash
# .env.local.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # SERVER ONLY

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # prod: https://estebanmaya.dev

# Revalidation
REVALIDATE_SECRET=random-secret-min-32-chars

# v1.1
# RESEND_API_KEY=re_...
# TURNSTILE_SITE_KEY=...
# TURNSTILE_SECRET_KEY=...
# NEXT_PUBLIC_SENTRY_DSN=...
```

### C. Scripts npm

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:types": "supabase gen types typescript --linked > types/database.ts",
    "db:push": "supabase db push",
    "db:seed": "supabase db seed"
  }
}
```

### D. Checklist Sprint 1

- [ ] `npx create-next-app@latest` con TypeScript, Tailwind, App Router
- [ ] Configurar `@theme` tokens desde IDEA.html
- [ ] Setup Supabase project staging
- [ ] Ejecutar migración `001_initial_schema.sql`
- [ ] Configurar `@supabase/ssr` + middleware
- [ ] Layout public: Header + Footer
- [ ] Layout admin: shell vacío + auth redirect
- [ ] CI workflow en GitHub Actions
- [ ] Vercel project linked

### E. Referencias

- [PRD.md](./PRD.md)
- [Architecture.md](./Architecture.md)
- [IDEA.html](./IDEA.html)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [shadcn/ui](https://ui.shadcn.com/)

---

*Documento vivo. Actualizar al cerrar cada sprint o cuando un ADR cambie de estado.*
