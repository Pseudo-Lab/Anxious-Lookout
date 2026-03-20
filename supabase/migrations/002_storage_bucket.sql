-- ============================================================
-- Storage: blog-images bucket
-- ============================================================
-- NOTE: Run this in the Supabase SQL Editor.
-- Alternatively, create the bucket via Dashboard > Storage.

INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (public bucket)
CREATE POLICY "Public read access for blog-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Editors and admins can upload
CREATE POLICY "Editors and admins can upload to blog-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.role() = 'authenticated'
    AND public.get_my_role() IN ('admin', 'editor')
  );

-- Admins can delete
CREATE POLICY "Admins can delete from blog-images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images'
    AND public.get_my_role() = 'admin'
  );
