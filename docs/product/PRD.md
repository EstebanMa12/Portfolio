# PRD — Portafolio Profesional & Marca Personal
## Esteban Maya | Software Engineer

| Campo | Valor |
|-------|-------|
| **Versión** | 1.0 |
| **Fecha** | 18 de junio de 2026 |
| **Autor** | Esteban Maya |
| **Estado** | Draft → Ready for Development |
| **Referencia de diseño** | `IDEA.html` (prototipo visual y de contenido) |

---

## Tabla de contenidos

1. [Product Vision](#1-product-vision)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Success Metrics](#6-success-metrics)
7. [MVP Definition](#7-mvp-definition)
8. [Future Roadmap](#8-future-roadmap)

---

## 1. Product Vision

### 1.1 Visión

Convertir **estebanmaya.dev** (dominio tentativo) en la fuente de verdad de la marca personal de Esteban Maya: un portafolio técnico de alto impacto que posiciona su perfil como **Software Engineer especializado en backend y sistemas distribuidos**, con un diferenciador narrativo único — la transición desde **Bioingeniería** hacia software de producción.

El producto no es solo un currículum digital: es una **plataforma de contenido + conversión laboral** con CMS propio, optimizada para descubrimiento orgánico (SEO) y compartibilidad social.

### 1.2 Problema

| Actor | Problema |
|-------|----------|
| **Esteban (owner)** | Actualizar portafolio y blog requiere tocar código; LinkedIn/GitHub no cuentan la historia completa ni el diferenciador Bio ↔ Software. |
| **Reclutadores / hiring managers** | Evalúan candidatos en < 2 min; necesitan impacto medible, stack claro y señales de seniority sin fricción. |
| **Comunidad técnica** | Busca contenido de calidad sobre arquitectura, sistemas y aprendizaje continuo; el autor necesita un canal propio indexable. |

### 1.3 Propuesta de valor

> *"Un ingeniero con rigor científico que construye sistemas backend escalables, con impacto medible y documentado."*

| Para quién | Valor |
|------------|-------|
| Reclutadores | Trayectoria, proyectos con métricas, CV descargable, contacto directo |
| Tech leads | Profundidad técnica vía blog (The Lab), proyectos con problema/solución/resultado |
| Esteban | Panel admin para publicar sin deploys de código; SEO como canal de inbound |

### 1.4 Objetivos del producto (OKRs de producto)

| Objetivo | Resultado esperado |
|----------|-------------------|
| Posicionar marca personal | Top 3 resultados de búsqueda para `"Esteban Maya Software Engineer"` en 6 meses |
| Mostrar experiencia y proyectos | 100% del contenido profesional migrado desde placeholders a datos reales |
| Publicar contenido técnico | ≥ 1 artículo/mes en The Lab (Blog) |
| Optimizar SEO | Lighthouse SEO ≥ 95; sitemap indexado en Search Console |
| Generar oportunidades laborales | ≥ 5 contactos cualificados/mes vía formulario o email |
| CMS sin código | 100% de CRUD de contenido vía admin; cero commits por actualización de texto |

### 1.5 Alcance

**In scope:** Front office (6 rutas), Back office (5 módulos), SEO técnico, autenticación admin, almacenamiento de contenido.

**Out of scope (v1):** Multi-autor, comentarios públicos, newsletter, i18n EN/ES, monetización, app móvil nativa.

### 1.6 Principios de diseño (heredados de IDEA.html)

- **Impacto medible:** métricas cuantificables en hero, experiencia y proyectos.
- **Narrativa Bio ↔ Software:** tabla de transferencia de skills como activo de marca.
- **Dark-first, accesible:** contraste WCAG AA, `prefers-reduced-motion`, navegación por teclado.
- **Performance como señal técnica:** el portafolio demuestra competencia en web performance.

---

## 2. User Personas

### Persona 1 — Laura, Tech Recruiter

| Atributo | Detalle |
|----------|---------|
| **Rol** | Senior Technical Recruiter en scale-up SaaS |
| **Edad** | 32 |
| **Objetivo** | Filtrar 50+ candidatos/semana; identificar fit backend/platform en < 90 segundos |
| **Comportamiento** | Llega desde LinkedIn; escanea hero → experiencia → proyectos; descarga CV |
| **Frustraciones** | Portafolios genéricos, sin métricas, stack oculto, sitios lentos en móvil |
| **Necesidades** | Disponibilidad visible, stack tags, timeline claro, contacto one-click |
| **Quote** | *"Si no veo impacto en números en la primera pantalla, paso al siguiente."* |

### Persona 2 — Carlos, Engineering Manager

| Atributo | Detalle |
|----------|---------|
| **Rol** | EM / Staff Engineer evaluando candidatos senior |
| **Edad** | 38 |
| **Objetivo** | Validar profundidad técnica y criterio de arquitectura |
| **Comportamiento** | Lee 1–2 artículos del blog, revisa GitHub links, evalúa calidad del storytelling en proyectos |
| **Frustraciones** | Proyectos toy sin contexto de negocio; blog abandonado |
| **Necesidades** | Casos reales (problema/solución/resultado), señales de observabilidad, CI/CD, diseño de sistemas |
| **Quote** | *"Quiero ver cómo piensa, no solo qué tecnologías lista."* |

### Persona 3 — Esteban, Owner / Admin

| Atributo | Detalle |
|----------|---------|
| **Rol** | Software Engineer + content creator de marca personal |
| **Objetivo** | Mantener portafolio actualizado y publicar notas técnicas sin fricción |
| **Comportamiento** | Edita experiencia post-entrevista; publica artículo tras resolver un problema interesante |
| **Frustraciones** | Editar HTML/MDX, redeploy por typo, SEO manual por página |
| **Necesidades** | WYSIWYG o MD editor, preview, SEO fields por entidad, draft/publish |
| **Quote** | *"Quiero escribir la nota y que el resto sea automático."* |

### Persona 4 — Ana, Developer de la comunidad

| Atributo | Detalle |
|----------|---------|
| **Rol** | Mid-level backend dev |
| **Edad** | 27 |
| **Objetivo** | Aprender de artículos técnicos; descubrir autores via Google |
| **Comportamiento** | Llega orgánicamente buscando *"hexagonal architecture health API"*; comparte en Twitter/LinkedIn |
| **Frustraciones** | Artículos sin fecha, sin TOC, mal renderizado en móvil |
| **Necesidades** | Blog legible, código con syntax highlight, OG cards atractivas al compartir |
| **Quote** | *"Si el artículo carga rápido y tiene buen snippet, lo leo y lo comparto."* |

---

## 3. User Stories

### Épica A — Front Office (sitio público)

| ID | Como… | Quiero… | Para… | Prioridad |
|----|-------|---------|-------|-----------|
| FO-01 | Visitante | Ver un hero con nombre, rol, disponibilidad y métricas de impacto | Evaluar fit en segundos | P0 |
| FO-02 | Visitante | Navegar entre Home, About, Experience, Projects, Blog y Contact | Encontrar información sin perderme | P0 |
| FO-03 | Visitante | Leer la narrativa Bioingeniería → Software | Entender el diferenciador del candidato | P0 |
| FO-04 | Reclutador | Ver timeline de experiencia con logros y tecnologías | Validar trayectoria y seniority | P0 |
| FO-05 | Hiring manager | Ver proyectos con problema, solución, stack y resultado | Evaluar impacto real | P0 |
| FO-06 | Dev comunidad | Listar y leer artículos del blog (The Lab) | Aprender y volver por más contenido | P0 |
| FO-07 | Visitante | Contactar vía email, LinkedIn o GitHub | Iniciar conversación laboral | P0 |
| FO-08 | Visitante móvil | Usar menú hamburguesa y layout responsive | Consumir contenido en cualquier dispositivo | P0 |
| FO-09 | Visitante | Descargar CV en PDF | Compartir con hiring pipeline | P1 |
| FO-10 | Visitante | Ver skills (radar o badges) y certificaciones | Entender breadth técnico | P1 |
| FO-11 | Visitante | Compartir un artículo con preview OG correcta | Difundir contenido en redes | P1 |
| FO-12 | Visitante con discapacidad | Navegar con teclado y lectores de pantalla | Acceder sin barreras | P1 |

### Épica B — Back Office (CMS / Admin)

| ID | Como… | Quiero… | Para… | Prioridad |
|----|-------|---------|-------|-----------|
| BO-01 | Admin | Autenticarme de forma segura | Proteger el panel | P0 |
| BO-02 | Admin | CRUD de proyectos (draft/publish, orden, destacados) | Actualizar portafolio sin código | P0 |
| BO-03 | Admin | CRUD de artículos con editor rich/MD, tags y slug | Publicar en The Lab | P0 |
| BO-04 | Admin | CRUD de experiencia laboral (empresa, rol, fechas, bullets, tech) | Mantener timeline actualizado | P0 |
| BO-05 | Admin | Gestionar catálogo de tecnologías (nombre, categoría, icono) | Reutilizar tags en proyectos y experiencia | P0 |
| BO-06 | Admin | Configurar SEO global y por página/entidad | Controlar indexación y snippets | P0 |
| BO-07 | Admin | Previsualizar cambios antes de publicar | Evitar errores en producción | P1 |
| BO-08 | Admin | Subir imágenes (hero, OG, proyectos) | Enriquecer contenido visual | P1 |
| BO-09 | Admin | Gestionar contenido del hero (métricas, disponibilidad, CTAs) | Actualizar home sin deploy | P1 |
| BO-10 | Admin | Ver dashboard con borradores y últimas publicaciones | Tener visión operativa | P2 |

### Épica C — SEO & Discoverability

| ID | Como… | Quiero… | Para… | Prioridad |
|----|-------|---------|-------|-----------|
| SEO-01 | Motor de búsqueda | Consumir `/sitemap.xml` dinámico | Indexar todas las URLs públicas | P0 |
| SEO-02 | Crawlers | Leer `/robots.txt` configurado | Respetar reglas de indexación | P0 |
| SEO-03 | Redes sociales | Renderizar Open Graph y Twitter Cards | Previews al compartir | P0 |
| SEO-04 | Google | Recibir JSON-LD (Person, WebSite, Article, BreadcrumbList) | Rich results | P0 |
| SEO-05 | Admin | Definir title, description, canonical, OG image por entidad | Optimizar cada página | P0 |
| SEO-06 | Blog | URLs semánticas, headings jerárquicos, internal linking | Rankear por keywords técnicas | P0 |
| SEO-07 | Visitante | Ver breadcrumbs en blog y proyectos | Orientación y SEO | P2 |

---

## 4. Functional Requirements

### 4.1 Arquitectura de información

```
/                     → Home (hero + highlights + teasers)
/about                → About (+ bio bridge + intereses)
/experience           → Experience (timeline completo)
/projects             → Projects (grid/listado)
/projects/[slug]      → Detalle de proyecto (P1)
/blog                 → Blog / The Lab (listado)
/blog/[slug]          → Artículo individual
/contact              → Contact
/admin/*              → Back office (auth required)
/sitemap.xml          → Sitemap dinámico
/robots.txt           → Robots
```

**Nota:** El prototipo `IDEA.html` usa single-page con anchors (`#hero`, `#lab`). El producto final migrará a **rutas dedicadas** para SEO y compartibilidad, manteniendo la estética y componentes del prototipo.

### 4.2 Front Office — requisitos por página

#### 4.2.1 Home (`/`)

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-H-01 | Hero configurable desde CMS | Nombre, headline, subheadline, foto, badge disponibilidad |
| FR-H-02 | Métricas de impacto (mín. 1 destacada + 2 secundarias) | Valores editables; formato numérico accesible |
| FR-H-03 | CTAs primarios | "Ver proyectos", "Descargar CV" con URLs configurables |
| FR-H-04 | Teaser de proyectos destacados | Máx. 3 proyectos con flag `featured` |
| FR-H-05 | Teaser de últimos artículos | 3 posts más recientes publicados |
| FR-H-06 | Metadata dinámica | title, description, OG desde CMS SEO global |

#### 4.2.2 About (`/about`)

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-A-01 | Biografía larga (rich text) | Mín. 3 párrafos; editable en admin |
| FR-A-02 | Tabla Bio ↔ Software | Filas configurables (origen → destino) |
| FR-A-03 | Intereses / badges | Lista editable de tags no técnicos |
| FR-A-04 | Structured Data `Person` | JSON-LD con `jobTitle`, `sameAs` (GitHub, LinkedIn) |

#### 4.2.3 Experience (`/experience`)

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-E-01 | Timeline ordenado por fecha descendente | Soporte "Presente" en fecha fin |
| FR-E-02 | Por entrada: empresa, rol, periodo, bullets, tecnologías | Mín. 1 bullet; tech vinculadas a catálogo |
| FR-E-03 | Structured Data | `Organization` + `EmployeeRole` o `WorkExperience` en JSON-LD |

#### 4.2.4 Projects (`/projects`, `/projects/[slug]`)

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-P-01 | Listado en grid responsive | Filtro por categoría/tag (P1) |
| FR-P-02 | Card con categoría, título, extracto | Campos: problema, solución, stack, resultado |
| FR-P-03 | Links externos | GitHub, demo (opcionales) |
| FR-P-04 | Página de detalle (P1) | Contenido extendido, imágenes, SEO propio |
| FR-P-05 | Flag `featured` | Controla visibilidad en Home |

#### 4.2.5 Blog / The Lab (`/blog`, `/blog/[slug]`)

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-B-01 | Listado paginado | 9 posts/página; orden por `publishedAt` desc |
| FR-B-02 | Artículo con MDX/Markdown | Syntax highlight, headings, imágenes, code blocks |
| FR-B-03 | Metadatos por post | tag, fecha, tiempo de lectura estimado |
| FR-B-04 | Estados | draft / published / scheduled (P2) |
| FR-B-05 | TOC automático (P1) | Generado desde h2/h3 |
| FR-B-06 | Structured Data `Article` | headline, author, datePublished, image |

#### 4.2.6 Contact (`/contact`)

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-C-01 | CTAs de contacto | Email mailto, LinkedIn, GitHub |
| FR-C-02 | Formulario de contacto (P1) | Nombre, email, mensaje; anti-spam (honeypot o Turnstile) |
| FR-C-03 | Notificación al admin | Email o webhook al recibir mensaje |

#### 4.2.7 Navegación global

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-N-01 | Header sticky con nav principal | 6 enlaces + CTA Contact |
| FR-N-02 | Footer con copyright y redes | Año dinámico, links sociales |
| FR-N-03 | Side dock (desktop XL) (P1) | Accesos rápidos como en prototipo |
| FR-N-04 | Skip link "Saltar al contenido" | Visible on focus |

### 4.3 Back Office — módulos

#### 4.3.1 Autenticación

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-ADM-01 | Login único (single admin) | OAuth (GitHub/Google) o email+password |
| FR-ADM-02 | Sesión segura | HTTP-only cookies; logout |
| FR-ADM-03 | Rutas `/admin` protegidas | Redirect a login si no autenticado |

#### 4.3.2 Gestión de proyectos

| Campo | Tipo | Requerido |
|-------|------|-----------|
| title | string | ✓ |
| slug | string (auto) | ✓ |
| category | string | ✓ |
| problem, solution, result | text | ✓ |
| stack | relation → Technology[] | ✓ |
| githubUrl, demoUrl | url | |
| featured | boolean | |
| status | draft/published | ✓ |
| seo | SEOFields | ✓ |
| order | number | |

#### 4.3.3 Gestión de artículos

| Campo | Tipo | Requerido |
|-------|------|-----------|
| title | string | ✓ |
| slug | string | ✓ |
| excerpt | string (160–320 chars) | ✓ |
| content | markdown/mdx | ✓ |
| tags | string[] | ✓ |
| coverImage | image | |
| publishedAt | datetime | ✓ |
| status | draft/published | ✓ |
| seo | SEOFields | ✓ |

#### 4.3.4 Gestión de experiencia laboral

| Campo | Tipo | Requerido |
|-------|------|-----------|
| company | string | ✓ |
| role | string | ✓ |
| startDate, endDate | date (end nullable = presente) | ✓ |
| bullets | string[] | ✓ |
| technologies | relation → Technology[] | ✓ |
| order | number | |

#### 4.3.5 Gestión de tecnologías

| Campo | Tipo | Requerido |
|-------|------|-----------|
| name | string | ✓ |
| slug | string | ✓ |
| category | enum: language, framework, infra, database, tool | ✓ |
| icon | string/svg url | P1 |

#### 4.3.6 Gestión de contenido SEO

| Req ID | Requisito | Criterio de aceptación |
|--------|-----------|------------------------|
| FR-SEO-ADM-01 | SEO global | siteName, defaultTitle, titleTemplate, defaultDescription, defaultOgImage, twitterHandle |
| FR-SEO-ADM-02 | SEO por entidad | Override en Project, Article, Page estática |
| FR-SEO-ADM-03 | Preview de snippet | Simulación Google + OG card en admin |
| FR-SEO-ADM-04 | Canonical URL | Auto-generada; override manual opcional |
| FR-SEO-ADM-05 | noindex flag | Por entidad para drafts o páginas internas |

### 4.4 SEO técnico — especificaciones

#### Sitemap (`/sitemap.xml`)

- Generación dinámica en build o ISR.
- Incluir: `/`, `/about`, `/experience`, `/projects`, `/blog`, cada `/projects/[slug]`, cada `/blog/[slug]`.
- Excluir: `/admin/*`, drafts.
- Campos: `loc`, `lastmod`, `changefreq`, `priority`.

#### Robots (`/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://[domain]/sitemap.xml
```

#### Open Graph (todas las páginas públicas)

| Meta | Regla |
|------|-------|
| `og:title` | SEO title o fallback |
| `og:description` | Meta description |
| `og:image` | 1200×630; entidad o default |
| `og:url` | Canonical |
| `og:type` | website / article |
| `twitter:card` | summary_large_image |

#### Structured Data (JSON-LD)

| Página | Schema |
|--------|--------|
| Global | `WebSite` + `Person` |
| Home | `Person` con `sameAs` |
| Blog post | `BlogPosting` / `Article` |
| Projects | `CreativeWork` o `SoftwareApplication` (P1) |
| Breadcrumbs | `BreadcrumbList` (P2) |

#### Blog optimizado

- URLs: `/blog/[slug-kebab-case]`
- Un solo `h1` por artículo; jerarquía h2→h3
- Internal links a proyectos relacionados
- `readingTime` calculado
- RSS feed `/blog/rss.xml` (P2)

### 4.5 Modelo de datos (entidades principales)

```
User (admin)
Project
Article
Experience
Technology
SeoSettings (global)
PageContent (hero, about, contact - singletons)
ContactMessage (P1)
MediaAsset
```

### 4.6 Stack tecnológico recomendado

| Capa | Recomendación | Justificación |
|------|---------------|---------------|
| Framework | Next.js 15+ (App Router) | SSG/ISR, metadata API, SEO nativo |
| CMS/DB | Supabase (Postgres) o Sanity/Contentlayer | CRUD admin + relaciones |
| Auth | NextAuth / Supabase Auth | Protección admin |
| Styling | Tailwind CSS | Alineado con IDEA.html |
| Hosting | Vercel | Preview deploys, edge, analytics |
| Analytics | Vercel Analytics + Plausible (P1) | Privacidad + métricas de conversión |
| Email | Resend / Formspree | Formulario contacto |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Métrica | Objetivo |
|---------|----------|
| LCP | < 2.5s (mobile) |
| INP | < 200ms |
| CLS | < 0.1 |
| Lighthouse Performance | ≥ 90 |
| TTFB | < 800ms (p95) |

Estrategias: SSG/ISR, `next/image`, font subsetting (Inter + Geist), lazy load below fold.

### 5.2 SEO & Discoverability

| Métrica | Objetivo |
|---------|----------|
| Lighthouse SEO | ≥ 95 |
| Indexación | 100% URLs públicas en Search Console ≤ 14 días post-launch |
| Core Web Vitals | "Good" en CrUX |

### 5.3 Accesibilidad

| Requisito | Estándar |
|-----------|----------|
| WCAG | 2.1 AA |
| Contraste texto | ≥ 4.5:1 (validar palette dark) |
| Navegación teclado | Todos los interactivos focusables |
| Reduced motion | Respetar `prefers-reduced-motion` |
| Semántica | Landmarks, aria-labels, alt en imágenes |

### 5.4 Seguridad

- HTTPS obligatorio
- Admin detrás de auth; rate limiting en login
- Sanitización de HTML en rich text
- CSP headers (P1)
- Secrets en env vars; nunca en repo
- Validación server-side en todos los forms

### 5.5 Disponibilidad & confiabilidad

| Métrica | Objetivo |
|---------|----------|
| Uptime | 99.9% |
| RTO | < 1h |
| Backups DB | Diarios automáticos |

### 5.6 Mantenibilidad

- TypeScript estricto
- Componentes reutilizables alineados con design tokens de IDEA.html
- Content schema versionado
- CI: lint, typecheck, build en cada PR

### 5.7 Compatibilidad

- Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- iOS Safari, Chrome Android
- Viewports: 320px – 1920px+

---

## 6. Success Metrics

### 6.1 North Star Metric

**Contactos laborales cualificados por mes** (email directo + formulario + LinkedIn clicks tracked como proxy).

### 6.2 KPIs por objetivo

| Categoría | KPI | Baseline | Target (90 días) |
|-----------|-----|----------|------------------|
| **Awareness** | Sesiones orgánicas/mes | 0 | ≥ 500 |
| **Awareness** | Impresiones Search Console | 0 | ≥ 5,000 |
| **Engagement** | Tiempo medio en /projects | — | ≥ 2 min |
| **Engagement** | Artículos leídos > 50% scroll | — | ≥ 40% |
| **Conversion** | Clicks "Contactar" / sesión | — | ≥ 3% |
| **Conversion** | Descargas CV / mes | 0 | ≥ 20 |
| **Content** | Artículos publicados | 0 | ≥ 3 |
| **Ops** | Tiempo publicar artículo (admin) | — | < 15 min |
| **Technical** | Lighthouse SEO | — | ≥ 95 |
| **Technical** | Errores 5xx | — | 0 |

### 6.3 Instrumentación

| Evento | Herramienta |
|--------|-------------|
| page_view | Analytics |
| cta_click (contact, cv, github) | Analytics custom event |
| project_card_click | Analytics |
| blog_read_depth (25/50/75/100%) | Analytics |
| contact_form_submit | Analytics + email notification |
| admin_publish | Internal log |

### 6.4 Criterios de éxito del MVP (launch)

- [ ] 6 rutas públicas live con contenido real (no placeholders)
- [ ] Admin funcional para proyectos, artículos, experiencia, tech, SEO
- [ ] Sitemap y robots validados en Search Console
- [ ] OG preview correcta en LinkedIn Debugger
- [ ] Lighthouse ≥ 90 performance, ≥ 95 SEO, ≥ 95 accessibility
- [ ] 1er artículo publicado e indexado

---

## 7. MVP Definition

### 7.1 Objetivo del MVP

Lanzar un portafolio **production-ready** que convierta visitantes en contactos laborales, con CMS mínimo viable para que Esteban actualice contenido sin tocar código.

### 7.2 In scope MVP

#### Front Office

- Home, About, Experience, Projects (listado), Blog (listado + detalle), Contact
- Navegación responsive (header + mobile menu)
- Contenido migrado desde IDEA.html (textos reales, links sociales, CV)
- Design system dark (tokens de IDEA.html)

#### Back Office

- Auth admin
- CRUD: Projects, Articles, Experience, Technologies
- SEO global + override por Project y Article
- Upload de imagen de portada para artículos

#### SEO

- sitemap.xml, robots.txt
- Metadata API (title, description, OG)
- JSON-LD: Person, WebSite, Article
- URLs semánticas

#### Infra

- Deploy Vercel + dominio custom
- Supabase/Postgres o equivalente
- Analytics básico

### 7.3 Out of scope MVP (defer to v1.1+)

- `/projects/[slug]` detalle extendido
- Formulario de contacto con backend
- Side dock desktop
- Skills radar chart interactivo
- Certificaciones carousel
- Filtros en proyectos/blog
- RSS feed
- Scheduled publishing
- i18n

### 7.4 User journey crítico MVP

```
LinkedIn perfil → Click portafolio → Home (métricas + disponibilidad)
  → Experience (validar seniority) → Projects (impacto)
  → Blog (1 artículo) → Contact (email)
```

### 7.5 Plan de entrega sugerido (8 semanas)

| Sprint | Entregable |
|--------|------------|
| S1 | Setup Next.js, design tokens, layout, routing |
| S2 | Home + About (estático → CMS) |
| S3 | Experience + Technologies + admin CRUD |
| S4 | Projects + admin CRUD |
| S5 | Blog list + detail + admin editor |
| S6 | SEO (metadata, sitemap, robots, JSON-LD) |
| S7 | Admin auth, SEO module, polish responsive/a11y |
| S8 | Contenido real, QA, Lighthouse, launch |

### 7.6 Riesgos MVP

| Riesgo | Mitigación |
|--------|------------|
| Scope creep (radar, certs, dock) | Defer explícito a v1.1 |
| Contenido placeholder en launch | Bloquear launch hasta migración de datos reales |
| SEO tardío | Implementar metadata desde S1, no al final |
| CMS over-engineered | CRUD simple; editor MD antes que WYSIWYG complejo |

---

## 8. Future Roadmap

### Phase 1 — v1.1 "Polish & Convert" (Q3 2026)

| Feature | Valor |
|---------|-------|
| Página detalle de proyecto | SEO long-tail por proyecto |
| Formulario de contacto + anti-spam | Conversión medible |
| Side dock + skills radar | Paridad con IDEA.html |
| Certificaciones / achievements | Social proof |
| TOC en artículos | UX lectura larga |
| RSS + newsletter (Buttondown/ConvertKit) | Retención audiencia |

### Phase 2 — v1.2 "Grow" (Q4 2026)

| Feature | Valor |
|---------|-------|
| Filtros y búsqueda en blog/proyectos | Descubrimiento |
| Related posts / projects | Internal linking SEO |
| OG image generator dinámico | Shareability |
| i18n EN (subpath `/en`) | Mercado internacional |
| Dashboard analytics en admin | Decisiones de contenido |
| Scheduled publishing | Cadencia de publicación |

### Phase 3 — v2.0 "Platform" (2027)

| Feature | Valor |
|---------|-------|
| Series/collections en blog | Narrativas multi-parte |
| Talks / speaking engagements | Marca thought leader |
| Open source spotlight (GitHub sync) | Señal técnica viva |
| API pública del contenido | Integraciones |
| A/B testing en hero CTAs | Optimización conversión |
| PWA + offline read | UX mobile avanzada |

### Roadmap visual

```
2026 Q2          Q3              Q4              2027
  │              │               │                │
  MVP ─────────► v1.1 ─────────► v1.2 ──────────► v2.0
  Launch         Convert         Grow             Platform
```

---

## Apéndices

### A. Mapping IDEA.html → Producto final

| Sección prototipo | Ruta producto | Notas |
|-------------------|---------------|-------|
| `#hero` | `/` | Métricas editables en CMS |
| `#about` + `#bio-bridge` | `/about` | Tabla bio-bridge como componente |
| `#experience` | `/experience` | Timeline desde DB |
| `#projects` | `/projects` | Cards con schema unificado |
| `#lab` | `/blog` | Rename a Blog en nav; brand "The Lab" como subtítulo |
| `#skills` + `#achievements` | `/about` o `/` | v1.1 |
| `#contact` | `/contact` | |

### B. Design tokens (referencia)

| Token | Valor |
|-------|-------|
| bg | `#0a0a0b` |
| surface | `#141416` |
| accent | `#c8bfff` |
| text-primary | `#fafafa` |
| Font display | Geist |
| Font body | Inter |

### C. Glosario

| Término | Definición |
|---------|------------|
| The Lab | Marca editorial del blog técnico |
| Bio-bridge | Narrativa de transferencia Bioingeniería → Software |
| Featured | Flag para destacar en Home |
| SEOFields | title, description, ogImage, canonical, noindex |

---

*Documento vivo. Próxima revisión tras validación técnica de stack y estimación de sprints.*
