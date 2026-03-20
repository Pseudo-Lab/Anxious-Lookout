-- ============================================================
-- Observatory: Initial Schema
-- ============================================================

-- 1. profiles (auto-created on signup via trigger)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'commenter'
    CHECK (role IN ('admin', 'editor', 'commenter')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. post_meta (metadata for published MDX posts)
CREATE TABLE public.post_meta (
  post_slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id),
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. post_drafts (web-submitted drafts pending approval)
CREATE TABLE public.post_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL REFERENCES public.post_meta(post_slug) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'hidden', 'deleted', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. attachments (image upload tracking)
CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_comments_post_slug ON public.comments(post_slug);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_post_drafts_author_id ON public.post_drafts(author_id);
CREATE INDEX idx_post_drafts_status ON public.post_drafts(status);
CREATE INDEX idx_attachments_owner ON public.attachments(owner_user_id);

-- ============================================================
-- Trigger: auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    'commenter'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Trigger: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_post_drafts
  BEFORE UPDATE ON public.post_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Helper: get current user's role
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies: profiles
-- ============================================================

CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- RLS Policies: post_meta
-- ============================================================

CREATE POLICY "Anyone can read published post_meta"
  ON public.post_meta FOR SELECT
  USING (published_at IS NOT NULL);

CREATE POLICY "Admin can insert post_meta"
  ON public.post_meta FOR INSERT
  WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admin can update post_meta"
  ON public.post_meta FOR UPDATE
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admin can delete post_meta"
  ON public.post_meta FOR DELETE
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- RLS Policies: post_drafts
-- ============================================================

CREATE POLICY "Authors can read own drafts"
  ON public.post_drafts FOR SELECT
  USING (author_id = auth.uid());

CREATE POLICY "Admin can read all drafts"
  ON public.post_drafts FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Authenticated users can create drafts"
  ON public.post_drafts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND status = 'draft'
    AND public.get_my_role() IN ('admin', 'editor')
  );

CREATE POLICY "Authors can update own draft or rejected drafts"
  ON public.post_drafts FOR UPDATE
  USING (
    author_id = auth.uid()
    AND status IN ('draft', 'rejected')
  )
  WITH CHECK (
    author_id = auth.uid()
    AND status IN ('draft', 'pending')
  );

CREATE POLICY "Admin can update any draft"
  ON public.post_drafts FOR UPDATE
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Authors can delete own drafts"
  ON public.post_drafts FOR DELETE
  USING (
    author_id = auth.uid()
    AND status IN ('draft', 'rejected')
  );

-- ============================================================
-- RLS Policies: comments
-- ============================================================

CREATE POLICY "Anyone can read published comments"
  ON public.comments FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can read own comments"
  ON public.comments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admin can read all comments"
  ON public.comments FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'published'
  );

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can moderate comments"
  ON public.comments FOR UPDATE
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admin can delete comments"
  ON public.comments FOR DELETE
  USING (public.get_my_role() = 'admin');

-- ============================================================
-- RLS Policies: attachments
-- ============================================================

CREATE POLICY "Users can read own attachments"
  ON public.attachments FOR SELECT
  USING (owner_user_id = auth.uid());

CREATE POLICY "Admin can read all attachments"
  ON public.attachments FOR SELECT
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Editors and admins can insert attachments"
  ON public.attachments FOR INSERT
  WITH CHECK (
    auth.uid() = owner_user_id
    AND public.get_my_role() IN ('admin', 'editor')
  );

CREATE POLICY "Admin can delete attachments"
  ON public.attachments FOR DELETE
  USING (public.get_my_role() = 'admin');
