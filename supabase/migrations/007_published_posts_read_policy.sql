-- ============================================================
-- Allow anyone to read published posts
-- ============================================================

CREATE POLICY "Anyone can read published posts"
  ON public.post_drafts FOR SELECT
  USING (status = 'published');
