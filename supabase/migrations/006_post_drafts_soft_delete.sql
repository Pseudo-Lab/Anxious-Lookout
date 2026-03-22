-- ============================================================
-- Add 'deleted' status to post_drafts for soft delete
-- ============================================================

-- Drop existing CHECK constraint and recreate with 'deleted' included
ALTER TABLE public.post_drafts
  DROP CONSTRAINT IF EXISTS post_drafts_status_check;

ALTER TABLE public.post_drafts
  ADD CONSTRAINT post_drafts_status_check
  CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published', 'deleted'));

-- Update RLS: authors can soft-delete own drafts (update status to 'deleted')
-- The existing "Authors can update own draft or rejected drafts" policy
-- only allows updating drafts with status IN ('draft', 'rejected').
-- We need to also allow updating published posts to 'deleted'.
DROP POLICY IF EXISTS "Authors can update own draft or rejected drafts" ON public.post_drafts;

CREATE POLICY "Authors can update own drafts"
  ON public.post_drafts FOR UPDATE
  USING (
    author_id = auth.uid()
    AND status IN ('draft', 'rejected', 'published')
  )
  WITH CHECK (
    author_id = auth.uid()
    AND status IN ('draft', 'pending', 'deleted')
  );
