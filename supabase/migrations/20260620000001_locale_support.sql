-- Locale support for bilingual CMS (ES/EN)

-- page_content: composite PK (id, locale)
ALTER TABLE page_content ADD COLUMN locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE page_content DROP CONSTRAINT page_content_pkey;
ALTER TABLE page_content ADD PRIMARY KEY (id, locale);

-- articles: locale + unique (slug, locale)
ALTER TABLE articles ADD COLUMN locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_slug_key;
CREATE UNIQUE INDEX articles_slug_locale_unique ON articles (slug, locale);
CREATE INDEX idx_articles_locale_status ON articles (locale, status, published_at DESC);

-- projects: locale + unique (slug, locale)
ALTER TABLE projects ADD COLUMN locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_slug_key;
CREATE UNIQUE INDEX projects_slug_locale_unique ON projects (slug, locale);
CREATE INDEX idx_projects_locale_status ON projects (locale, status, sort_order);

-- experiences: locale per row
ALTER TABLE experiences ADD COLUMN locale TEXT NOT NULL DEFAULT 'es';
CREATE INDEX idx_experiences_locale_sort ON experiences (locale, sort_order);

-- seo_settings: composite PK (id, locale)
ALTER TABLE seo_settings DROP CONSTRAINT IF EXISTS seo_settings_id_check;
ALTER TABLE seo_settings ADD COLUMN locale TEXT NOT NULL DEFAULT 'es';
ALTER TABLE seo_settings DROP CONSTRAINT seo_settings_pkey;
ALTER TABLE seo_settings ADD PRIMARY KEY (id, locale);
