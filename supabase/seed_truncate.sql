-- Clears CMS content before re-seeding (local reset runs this via db reset;
-- use with db:seed:remote on linked staging only).
-- Preserves admin_users, auth, and media_assets.

TRUNCATE TABLE
  project_technologies,
  experience_technologies,
  project_images,
  projects,
  experiences,
  articles,
  technologies,
  page_content,
  seo_settings
RESTART IDENTITY CASCADE;
