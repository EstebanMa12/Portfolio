-- Enums
CREATE TYPE content_status AS ENUM ('draft', 'published');
CREATE TYPE tech_category AS ENUM ('language', 'framework', 'infra', 'database', 'tool');

-- Technologies
CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category tech_category NOT NULL,
  icon_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  result TEXT NOT NULL,
  content TEXT,
  github_url TEXT,
  demo_url TEXT,
  cover_image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status content_status NOT NULL DEFAULT 'draft',
  sort_order INT NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image TEXT,
  seo_canonical TEXT,
  seo_noindex BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_status_sort ON projects (status, sort_order);
CREATE INDEX idx_projects_slug ON projects (slug);
CREATE INDEX idx_projects_featured ON projects (featured) WHERE featured = true;

-- Project technologies (M:N)
CREATE TABLE project_technologies (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL CHECK (char_length(excerpt) BETWEEN 160 AND 320),
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  cover_image_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  reading_time_min INT,
  seo_title TEXT,
  seo_description TEXT,
  seo_og_image TEXT,
  seo_canonical TEXT,
  seo_noindex BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_articles_status_published ON articles (status, published_at DESC);
CREATE INDEX idx_articles_slug ON articles (slug);
CREATE INDEX idx_articles_tags ON articles USING GIN (tags);

-- Experiences
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  bullets JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_experiences_sort ON experiences (sort_order);

-- Experience technologies (M:N)
CREATE TABLE experience_technologies (
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  technology_id UUID NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (experience_id, technology_id)
);

-- Page content singletons
CREATE TABLE page_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SEO settings singleton
CREATE TABLE seo_settings (
  id INT PRIMARY KEY CHECK (id = 1),
  site_name TEXT NOT NULL,
  title_template TEXT NOT NULL DEFAULT '%s | Esteban Maya',
  default_description TEXT NOT NULL,
  default_og_image TEXT,
  twitter_handle TEXT,
  site_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin users whitelist
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media assets
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
