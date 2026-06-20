-- Seed data for dev/staging only (from docs/IDEA.html placeholders)

INSERT INTO seo_settings (id, site_name, title_template, default_description, site_url, twitter_handle)
VALUES (
  1,
  'Esteban Maya',
  '%s | Esteban Maya',
  'Software Engineer especializado en backend y sistemas distribuidos. Formación en Bioingeniería.',
  'http://localhost:3000',
  '@estebanmaya'
);

INSERT INTO page_content (id, data) VALUES
(
  'hero',
  '{
    "name": "Esteban Maya",
    "headline": "Software Engineer · Backend & Sistemas Distribuidos",
    "subheadline": "Disponible para oportunidades · Software Engineer",
    "bio": "Ingeniero con formación en Bioingeniería. Diseño y construyo sistemas escalables con enfoque en calidad, observabilidad e impacto medible.",
    "availability": { "label": "Disponible para oportunidades", "visible": true },
    "photoUrl": "https://cvvimcxjkdbzqtncflro.supabase.co/storage/v1/object/public/media/WhatsApp%20Image%202026-06-20%20at%206.22.56%20PM%20(1).jpeg",
    "cvUrl": "",
    "socialLinks": {
      "github": "https://github.com/EstebanMa12",
      "linkedin": "https://linkedin.com/in/estebanmaya",
      "email": "hello@estebanmaya.dev"
    },
    "metrics": [
      {
        "label": "Optimización de procesos",
        "value": "60% de mejora",
        "description": "Estandarización de creación de indicadores, reduciendo el tiempo de 50 min a 10–30 min por unidad.",
        "variant": "highlight"
      },
      {
        "label": "Latencia API",
        "value": "−40%",
        "description": "optimización de queries y caching con Redis",
        "variant": "default"
      },
      {
        "label": "Tiempo de deploy",
        "value": "45 → 8 min",
        "description": "pipeline IaC con Terraform y GitHub Actions",
        "variant": "default"
      }
    ]
  }'::jsonb
),
(
  'about',
  '{
    "title": "De la Bioingeniería al software de producción",
    "paragraphs": [
      "Mi carrera comenzó en Bioingeniería, donde aprendí a modelar sistemas complejos, procesar señales biológicas y aplicar rigor estadístico a problemas con datos ruidosos.",
      "La transición al software fue natural. Los mismos principios —diseño modular, validación rigurosa, pensamiento sistémico— se aplican a arquitecturas distribuidas, APIs de alta carga y pipelines de datos.",
      "Busco roles en backend, platform engineering o arquitectura de sistemas donde el impacto sea medible y la calidad técnica sea prioridad."
    ],
    "interests": ["Inteligencia Artificial", "Computación Cuántica", "Neurociencia Computacional", "Fitness"],
    "bioBridge": [
      { "from": "Procesamiento de señales", "to": "Pipelines de datos y event streams en tiempo real" },
      { "from": "Modelado de sistemas complejos", "to": "Arquitectura de microservicios y diseño modular" },
      { "from": "Validación experimental", "to": "Testing automatizado, CI/CD y entornos reproducibles" },
      { "from": "Análisis estadístico", "to": "Observabilidad, métricas y análisis de rendimiento" }
    ]
  }'::jsonb
),
(
  'contact',
  '{
    "title": "¿Trabajamos juntos?",
    "description": "Abierto a oportunidades en backend, platform engineering y arquitectura de sistemas.",
    "email": "hello@estebanmaya.dev",
    "linkedin": "https://linkedin.com/in/estebanmaya",
    "github": "https://github.com/EstebanMa12"
  }'::jsonb
);

INSERT INTO technologies (id, name, slug, category) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Go', 'go', 'language'),
  ('11111111-1111-1111-1111-111111111102', 'PostgreSQL', 'postgresql', 'database'),
  ('11111111-1111-1111-1111-111111111103', 'Redis', 'redis', 'database'),
  ('11111111-1111-1111-1111-111111111104', 'Kubernetes', 'kubernetes', 'infra'),
  ('11111111-1111-1111-1111-111111111105', 'AWS', 'aws', 'infra'),
  ('11111111-1111-1111-1111-111111111106', 'Node.js', 'nodejs', 'language'),
  ('11111111-1111-1111-1111-111111111107', 'TypeScript', 'typescript', 'language'),
  ('11111111-1111-1111-1111-111111111108', 'Kafka', 'kafka', 'infra'),
  ('11111111-1111-1111-1111-111111111109', 'Docker', 'docker', 'tool'),
  ('11111111-1111-1111-1111-111111111110', 'Terraform', 'terraform', 'tool'),
  ('11111111-1111-1111-1111-111111111111', 'Python', 'python', 'language'),
  ('11111111-1111-1111-1111-111111111112', 'Next.js', 'nextjs', 'framework');

INSERT INTO experiences (id, company, role, start_date, end_date, bullets, sort_order) VALUES
(
  '22222222-2222-2222-2222-222222222201',
  'TechCorp SaaS',
  'Senior Software Engineer',
  '2023-01-01',
  NULL,
  '["Reducción del 40% en latencia de API mediante optimización de queries y caching estratégico con Redis.", "Lideré la migración de monolito a microservicios, reduciendo tiempo de deploy de 2h a 15min.", "Implementé observabilidad completa con reducción del 60% en MTTR."]'::jsonb,
  0
),
(
  '22222222-2222-2222-2222-222222222202',
  'DataFlow Inc',
  'Software Engineer',
  '2021-01-01',
  '2023-12-31',
  '["Diseñé pipeline de eventos procesando 2M+ registros/día con latencia p99 < 200ms.", "Implementé CI/CD completo con GitHub Actions.", "Reducción del 30% en costos de infraestructura cloud."]'::jsonb,
  1
),
(
  '22222222-2222-2222-2222-222222222203',
  'BioSystems Lab',
  'Junior Developer / Research Dev',
  '2019-01-01',
  '2021-12-31',
  '["Desarrollé herramienta de análisis de señales biométricas usada por 3 equipos de investigación.", "Automatización de pipelines de procesamiento, reduciendo tiempo de análisis de 8h a 45min.", "Transición del stack científico a aplicaciones web en producción."]'::jsonb,
  2
);

INSERT INTO experience_technologies (experience_id, technology_id) VALUES
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101'),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111102'),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111103'),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111104'),
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111105'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111106'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111107'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111108'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111102');

INSERT INTO projects (id, title, slug, category, problem, solution, result, github_url, featured, status, sort_order) VALUES
(
  '33333333-3333-3333-3333-333333333301',
  'HealthMetrics API',
  'healthmetrics-api',
  'Backend · API',
  'Los equipos clínicos necesitaban acceder a datos biométricos en tiempo real, pero el sistema legacy tenía latencias de 2s+ y sin documentación.',
  'API REST con Go, caching Redis y documentación OpenAPI. Arquitectura hexagonal con tests de integración automatizados.',
  '−35% tiempo de respuesta · 99.95% uptime en 6 meses',
  'https://github.com/EstebanMa12',
  true,
  'published',
  0
),
(
  '33333333-3333-3333-3333-333333333302',
  'Dashboard Platform',
  'dashboard-platform',
  'Frontend · Real-time',
  'Operaciones carecía de visibilidad unificada sobre métricas de servicios distribuidos, con datos dispersos en 5 herramientas distintas.',
  'Dashboard unificado con Next.js y WebSockets para actualizaciones en tiempo real. Componentes reutilizables y diseño responsive.',
  '500+ usuarios internos · reducción 50% en tiempo de diagnóstico',
  'https://github.com/EstebanMa12',
  true,
  'published',
  1
),
(
  '33333333-3333-3333-3333-333333333303',
  'Infra Pipeline',
  'infra-pipeline',
  'DevOps · Infraestructura',
  'Deploys manuales tardaban 45min, con errores frecuentes por configuración inconsistente entre entornos.',
  'Pipeline IaC con Terraform y GitHub Actions. Entornos idénticos, rollback automático y notificaciones en Slack.',
  'Deploys de 45min → 8min · zero-downtime releases',
  'https://github.com/EstebanMa12',
  true,
  'published',
  2
);

INSERT INTO project_technologies (project_id, technology_id) VALUES
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101'),
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111103'),
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111109'),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111112'),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111107'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111110'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111109'),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111105');

INSERT INTO articles (id, title, slug, excerpt, content, tags, status, published_at, reading_time_min) VALUES
(
  '44444444-4444-4444-4444-444444444401',
  'Hexagonal architecture en APIs de salud',
  'hexagonal-architecture-apis-salud',
  'Cómo separar dominio clínico de infraestructura permitió iterar reglas de negocio sin tocar la capa de persistencia — reduciendo bugs en producción un 35% y acelerando el time-to-market de nuevas features.',
  '# Hexagonal architecture en APIs de salud

Este artículo explora cómo la arquitectura hexagonal ayuda a aislar el dominio clínico de la infraestructura.

## Contexto

En sistemas de salud, las reglas de negocio cambian frecuentemente.

## Conclusión

La separación de capas reduce el acoplamiento y mejora la testabilidad.',
  ARRAY['Arquitectura', 'Backend'],
  'published',
  '2026-03-01T00:00:00Z',
  5
);
