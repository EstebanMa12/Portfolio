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
    "photoUrl": "https://cvvimcxjkdbzqtncflro.supabase.co/storage/v1/object/public/media/HeroImage.png",
    "cvUrl": "",
    "socialLinks": {
      "github": "https://github.com/EstebanMa12",
      "linkedin": "https://www.linkedin.com/in/estebanmaya-bioengineer",
      "email": "daesmapo@gmail.com"
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
    ],
    "skills": [
      { "name": "Frontend", "level": 0.88 },
      { "name": "Backend", "level": 0.92 },
      { "name": "Bases de datos", "level": 0.78 },
      { "name": "Infra / CI", "level": 0.85 },
      { "name": "Seguridad", "level": 0.72 },
      { "name": "Arquitectura", "level": 0.8 }
    ]
  }'::jsonb
),
(
  'contact',
  '{
    "title": "¿Trabajamos juntos?",
    "description": "Abierto a oportunidades en backend, platform engineering y arquitectura de sistemas.",
    "email": "daesmapo@gmail.com",
    "linkedin": "https://www.linkedin.com/in/estebanmaya-bioengineer",
    "github": "https://github.com/EstebanMa12"
  }'::jsonb
),
(
  'achievements',
  '{
    "label": "Credenciales",
    "title": "Certificaciones y logros",
    "items": [
      {
        "title": "B.S. Bioingeniería",
        "meta": "Universidad · 2018",
        "badge": "degree"
      },
      {
        "title": "AWS Solutions Architect Associate",
        "meta": "Amazon Web Services · 2024",
        "badge": "aws"
      },
      {
        "title": "Terraform Certified Associate",
        "meta": "HashiCorp · 2024",
        "badge": "terraform"
      },
      {
        "title": "Certified Kubernetes Administrator",
        "meta": "CNCF · 2023",
        "badge": "kubernetes"
      },
      {
        "title": "Premio Mejor Tesis",
        "meta": "Bioingeniería · 2018",
        "badge": "award"
      },
      {
        "title": "Speaker · Microservicios en producción",
        "meta": "Meetup local · 2025",
        "badge": "speaker"
      },
      {
        "title": "Open Source Contributor",
        "meta": "Go · DevOps tools",
        "badge": "opensource",
        "url": "https://github.com/EstebanMa12"
      }
    ]
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

UPDATE projects SET cover_image_url = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1280&h=720&fit=crop'
WHERE id = '33333333-3333-3333-3333-333333333301';
UPDATE projects SET cover_image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop'
WHERE id = '33333333-3333-3333-3333-333333333302';
UPDATE projects SET cover_image_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop'
WHERE id = '33333333-3333-3333-3333-333333333303';

INSERT INTO project_images (project_id, image_url, alt_text, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1280&h=720&fit=crop', 'Dashboard de métricas clínicas', 0),
  ('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1280&h=720&fit=crop', 'Arquitectura de microservicios', 1),
  ('33333333-3333-3333-3333-333333333301', 'https://images.unsplash.com/photo-1511171637578-41c2ffb122fb?w=1280&h=720&fit=crop', 'Monitor de latencia API', 2),
  ('33333333-3333-3333-3333-333333333302', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop', 'Panel de observabilidad', 0),
  ('33333333-3333-3333-3333-333333333302', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop', 'Gráficos en tiempo real', 1),
  ('33333333-3333-3333-3333-333333333303', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop', 'Pipeline CI/CD', 0),
  ('33333333-3333-3333-3333-333333333303', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1280&h=720&fit=crop', 'Infraestructura como código', 1),
  ('33333333-3333-3333-3333-333333333303', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1280&h=720&fit=crop', 'Despliegue automatizado', 2);

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
