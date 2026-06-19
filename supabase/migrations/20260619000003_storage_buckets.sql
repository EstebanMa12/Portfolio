-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('media', 'media', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('cv', 'cv', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Public read for both buckets
CREATE POLICY storage_public_read_media ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY storage_public_read_cv ON storage.objects
  FOR SELECT USING (bucket_id = 'cv');

-- Admin write (INSERT, SELECT, UPDATE for upsert)
CREATE POLICY storage_admin_insert_media ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_select_media ON storage.objects
  FOR SELECT USING (
    bucket_id = 'media'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_update_media ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'media'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_delete_media ON storage.objects
  FOR DELETE USING (
    bucket_id = 'media'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_insert_cv ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cv'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_select_cv ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cv'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_update_cv ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cv'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );

CREATE POLICY storage_admin_delete_cv ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cv'
    AND auth.uid() IN (SELECT id FROM admin_users)
  );
