-- English locale seed (runs after ES defaults from main seed)

INSERT INTO seo_settings (id, locale, site_name, title_template, default_description, site_url, twitter_handle)
VALUES (
  1,
  'en',
  'Esteban Maya',
  '%s | Esteban Maya',
  'Software Engineer focused on backend and distributed systems. Background in Bioengineering.',
  'http://localhost:3000',
  '@estebanmaya'
);

INSERT INTO page_content (id, locale, data) VALUES
(
  'hero',
  'en',
  '{
    "name": "Esteban Maya",
    "headline": "Software Engineer · Backend & Distributed Systems",
    "subheadline": "Open to opportunities · Software Engineer",
    "bio": "Engineer with a Bioengineering background. I design and build scalable systems with a focus on quality, observability, and measurable impact.",
    "availability": { "label": "Open to opportunities", "visible": true },
    "photoUrl": "https://cvvimcxjkdbzqtncflro.supabase.co/storage/v1/object/public/media/HeroImage.png",
    "cvUrl": "",
    "socialLinks": {
      "github": "https://github.com/EstebanMa12",
      "linkedin": "https://www.linkedin.com/in/estebanmaya-bioengineer",
      "email": "daesmapo@gmail.com"
    },
    "metrics": [
      {
        "label": "Process optimization",
        "value": "60% improvement",
        "description": "Standardized indicator creation, reducing time from 50 min to 10–30 min per unit.",
        "variant": "highlight"
      },
      {
        "label": "API latency",
        "value": "−40%",
        "description": "query optimization and Redis caching",
        "variant": "default"
      },
      {
        "label": "Deploy time",
        "value": "45 → 8 min",
        "description": "IaC pipeline with Terraform and GitHub Actions",
        "variant": "default"
      }
    ]
  }'::jsonb
),
(
  'about',
  'en',
  '{
    "title": "From Bioengineering to production software",
    "paragraphs": [
      "My career began in Bioengineering, where I learned to model complex systems, process biological signals, and apply statistical rigor to noisy data problems.",
      "The transition to software was natural. The same principles — modular design, rigorous validation, systems thinking — apply to distributed architectures, high-load APIs, and data pipelines.",
      "I seek backend, platform engineering, or systems architecture roles where impact is measurable and technical quality is a priority."
    ],
    "interests": ["Artificial Intelligence", "Quantum Computing", "Computational Neuroscience", "Fitness"],
    "bioBridge": [
      { "from": "Signal processing", "to": "Data pipelines and real-time event streams" },
      { "from": "Complex systems modeling", "to": "Microservices architecture and modular design" },
      { "from": "Experimental validation", "to": "Automated testing, CI/CD, and reproducible environments" },
      { "from": "Statistical analysis", "to": "Observability, metrics, and performance analysis" }
    ],
    "skills": [
      { "name": "Frontend", "level": 0.88 },
      { "name": "Backend", "level": 0.92 },
      { "name": "Databases", "level": 0.78 },
      { "name": "Infra / CI", "level": 0.85 },
      { "name": "Security", "level": 0.72 },
      { "name": "Architecture", "level": 0.8 }
    ]
  }'::jsonb
),
(
  'contact',
  'en',
  '{
    "title": "Let''s work together",
    "description": "Open to opportunities in backend, platform engineering, and systems architecture.",
    "email": "daesmapo@gmail.com",
    "linkedin": "https://www.linkedin.com/in/estebanmaya-bioengineer",
    "github": "https://github.com/EstebanMa12"
  }'::jsonb
),
(
  'achievements',
  'en',
  '{
    "label": "Credentials",
    "title": "Certifications and achievements",
    "items": [
      { "title": "B.S. Bioengineering", "meta": "University · 2018", "badge": "degree" },
      { "title": "AWS Solutions Architect Associate", "meta": "Amazon Web Services · 2024", "badge": "aws" },
      { "title": "Terraform Certified Associate", "meta": "HashiCorp · 2024", "badge": "terraform" },
      { "title": "Certified Kubernetes Administrator", "meta": "CNCF · 2023", "badge": "kubernetes" },
      { "title": "Best Thesis Award", "meta": "Bioengineering · 2018", "badge": "award" },
      { "title": "Speaker · Microservices in production", "meta": "Local meetup · 2025", "badge": "speaker" },
      { "title": "Open Source Contributor", "meta": "Go · DevOps tools", "badge": "opensource", "url": "https://github.com/EstebanMa12" }
    ]
  }'::jsonb
);

INSERT INTO experiences (id, locale, company, role, start_date, end_date, bullets, sort_order) VALUES
(
  '22222222-2222-2222-2222-222222222211',
  'en',
  'TechCorp SaaS',
  'Senior Software Engineer',
  '2023-01-01',
  NULL,
  '["40% API latency reduction through query optimization and strategic Redis caching.", "Led monolith-to-microservices migration, reducing deploy time from 2h to 15min.", "Implemented full observability with 60% MTTR reduction."]'::jsonb,
  0
),
(
  '22222222-2222-2222-2222-222222222212',
  'en',
  'DataFlow Inc',
  'Software Engineer',
  '2021-01-01',
  '2023-12-31',
  '["Designed event pipeline processing 2M+ records/day with p99 latency < 200ms.", "Implemented full CI/CD with GitHub Actions.", "30% reduction in cloud infrastructure costs."]'::jsonb,
  1
),
(
  '22222222-2222-2222-2222-222222222213',
  'en',
  'BioSystems Lab',
  'Junior Developer / Research Dev',
  '2019-01-01',
  '2021-12-31',
  '["Built biometric signal analysis tool used by 3 research teams.", "Automated processing pipelines, reducing analysis time from 8h to 45min.", "Transition from scientific stack to production web applications."]'::jsonb,
  2
);

INSERT INTO experience_technologies (experience_id, technology_id) VALUES
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111101'),
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111102'),
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111103'),
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111104'),
  ('22222222-2222-2222-2222-222222222211', '11111111-1111-1111-1111-111111111105'),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111106'),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111107'),
  ('22222222-2222-2222-2222-222222222212', '11111111-1111-1111-1111-111111111108'),
  ('22222222-2222-2222-2222-222222222213', '11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222213', '11111111-1111-1111-1111-111111111102');

INSERT INTO projects (id, locale, title, slug, category, problem, solution, result, github_url, featured, status, sort_order) VALUES
(
  '33333333-3333-3333-3333-333333333311',
  'en',
  'HealthMetrics API',
  'healthmetrics-api',
  'Backend · API',
  'Clinical teams needed real-time biometric data access, but the legacy system had 2s+ latency and no documentation.',
  'REST API with Go, Redis caching, and OpenAPI documentation. Hexagonal architecture with automated integration tests.',
  '−35% response time · 99.95% uptime over 6 months',
  'https://github.com/EstebanMa12',
  true,
  'published',
  1
),
(
  '33333333-3333-3333-3333-333333333312',
  'en',
  'Dashboard Platform',
  'dashboard-platform',
  'Frontend · Real-time',
  'Operations lacked unified visibility into distributed service metrics, with data scattered across 5 different tools.',
  'Unified dashboard with Next.js and WebSockets for real-time updates. Reusable components and responsive design.',
  '500+ internal users · 50% reduction in diagnosis time',
  'https://github.com/EstebanMa12',
  true,
  'published',
  2
),
(
  '33333333-3333-3333-3333-333333333313',
  'en',
  'Infra Pipeline',
  'infra-pipeline',
  'DevOps · Infrastructure',
  'Manual deploys took 45min, with frequent errors from inconsistent configuration across environments.',
  'IaC pipeline with Terraform and GitHub Actions. Identical environments, automatic rollback, and Slack notifications.',
  'Deploys from 45min → 8min · zero-downtime releases',
  'https://github.com/EstebanMa12',
  false,
  'published',
  5
),
(
  '33333333-3333-3333-3333-333333333314',
  'en',
  'Clinical Migration CLI',
  'clinical-migration-cli',
  'Backend · CLI',
  'Migrating historical records between clinical systems required fragile ad hoc scripts with no error traceability.',
  'Go CLI with schema validation, idempotent retries, and CSV reports for rejected rows.',
  '12M records migrated · 0 audited data loss',
  'https://github.com/EstebanMa12',
  false,
  'published',
  3
),
(
  '33333333-3333-3333-3333-333333333315',
  'en',
  'Signal Parsing Library',
  'signal-parsing-library',
  'Open Source · Library',
  'Each team reimplemented physiological signal filters and normalization with inconsistent results.',
  'Python package with configurable pipelines, golden-file tests, and stable API documentation.',
  'Adopted by 3 teams · −60% preprocessing time',
  'https://github.com/EstebanMa12',
  false,
  'published',
  4
),
(
  '33333333-3333-3333-3333-333333333316',
  'en',
  'Batch ETL Pipeline',
  'batch-etl-pipeline',
  'Data · Pipeline',
  'Nightly clinical exports mixed PII with analytics data, blocking internal studies.',
  'Batch pipeline with deterministic anonymization, date partitioning, and quality metrics at each stage.',
  '100% auditable jobs · GDPR-compliant exports',
  'https://github.com/EstebanMa12',
  true,
  'published',
  0
);

INSERT INTO project_technologies (project_id, technology_id) VALUES
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111101'),
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111103'),
  ('33333333-3333-3333-3333-333333333311', '11111111-1111-1111-1111-111111111109'),
  ('33333333-3333-3333-3333-333333333312', '11111111-1111-1111-1111-111111111112'),
  ('33333333-3333-3333-3333-333333333312', '11111111-1111-1111-1111-111111111107'),
  ('33333333-3333-3333-3333-333333333313', '11111111-1111-1111-1111-111111111110'),
  ('33333333-3333-3333-3333-333333333313', '11111111-1111-1111-1111-111111111109'),
  ('33333333-3333-3333-3333-333333333313', '11111111-1111-1111-1111-111111111105'),
  ('33333333-3333-3333-3333-333333333314', '11111111-1111-1111-1111-111111111101'),
  ('33333333-3333-3333-3333-333333333314', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333315', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333315', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333316', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333316', '11111111-1111-1111-1111-111111111102'),
  ('33333333-3333-3333-3333-333333333316', '11111111-1111-1111-1111-111111111108');

UPDATE projects SET cover_image_url = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1280&h=720&fit=crop'
WHERE id = '33333333-3333-3333-3333-333333333311';
UPDATE projects SET cover_image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop'
WHERE id = '33333333-3333-3333-3333-333333333312';
UPDATE projects SET cover_image_url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop'
WHERE id = '33333333-3333-3333-3333-333333333313';

INSERT INTO project_images (project_id, image_url, alt_text, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333311', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1280&h=720&fit=crop', 'Clinical metrics dashboard', 0),
  ('33333333-3333-3333-3333-333333333311', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1280&h=720&fit=crop', 'Microservices architecture', 1),
  ('33333333-3333-3333-3333-333333333311', 'https://images.unsplash.com/photo-1511171637578-41c2ffb122fb?w=1280&h=720&fit=crop', 'API latency monitor', 2),
  ('33333333-3333-3333-3333-333333333312', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop', 'Observability panel', 0),
  ('33333333-3333-3333-3333-333333333312', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop', 'Real-time charts', 1),
  ('33333333-3333-3333-3333-333333333313', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&h=720&fit=crop', 'CI/CD pipeline', 0),
  ('33333333-3333-3333-3333-333333333313', 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1280&h=720&fit=crop', 'Infrastructure as code', 1),
  ('33333333-3333-3333-3333-333333333313', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1280&h=720&fit=crop', 'Automated deployment', 2);

INSERT INTO articles (id, locale, title, slug, excerpt, content, tags, status, published_at, reading_time_min) VALUES
(
  '44444444-4444-4444-4444-444444444411',
  'en',
  'Hexagonal architecture in health APIs',
  'hexagonal-architecture-apis-salud',
  'How separating clinical domain from infrastructure allowed iterating business rules without touching the persistence layer — reducing production bugs by 35% and accelerating time-to-market for new features.',
  '# Hexagonal architecture in health APIs

This article explores how hexagonal architecture helps isolate clinical domain from infrastructure.

## Context

In healthcare systems, business rules change frequently.

## Conclusion

Layer separation reduces coupling and improves testability.',
  ARRAY['Architecture', 'Backend'],
  'published',
  '2026-03-01T00:00:00Z',
  5
);
