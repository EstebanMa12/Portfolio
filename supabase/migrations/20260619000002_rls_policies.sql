-- Enable RLS on all content tables
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY public_read_technologies ON technologies
  FOR SELECT USING (true);

CREATE POLICY public_read_projects ON projects
  FOR SELECT USING (status = 'published');

CREATE POLICY public_read_project_technologies ON project_technologies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_technologies.project_id
        AND p.status = 'published'
    )
  );

CREATE POLICY public_read_articles ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY public_read_experiences ON experiences
  FOR SELECT USING (true);

CREATE POLICY public_read_experience_technologies ON experience_technologies
  FOR SELECT USING (true);

CREATE POLICY public_read_page_content ON page_content
  FOR SELECT USING (true);

CREATE POLICY public_read_seo_settings ON seo_settings
  FOR SELECT USING (true);

-- Admin policies (full access for whitelisted users)
CREATE POLICY admin_all_technologies ON technologies
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_projects ON projects
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_project_technologies ON project_technologies
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_articles ON articles
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_experiences ON experiences
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_experience_technologies ON experience_technologies
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_page_content ON page_content
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_seo_settings ON seo_settings
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

CREATE POLICY admin_all_media_assets ON media_assets
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Admin users: admins can read their own row only
CREATE POLICY admin_read_self ON admin_users
  FOR SELECT USING (auth.uid() = id);
