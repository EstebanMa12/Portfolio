-- Project image gallery (1:N per project)
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_images_project_sort ON project_images (project_id, sort_order);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_project_images ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_images.project_id
        AND p.status = 'published'
    )
  );

CREATE POLICY admin_all_project_images ON project_images
  FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));
