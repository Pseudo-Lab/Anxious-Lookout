-- ============================================================
-- 글 좋아요 기능
-- ============================================================

CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_slug, user_id)
);

CREATE INDEX idx_post_likes_post_slug ON public.post_likes(post_slug);
CREATE INDEX idx_post_likes_user_id ON public.post_likes(user_id);

-- RLS
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 누구나 좋아요 수 조회 가능
CREATE POLICY "Anyone can read post likes"
  ON public.post_likes FOR SELECT
  USING (true);

-- 로그인한 사용자만 좋아요 가능
CREATE POLICY "Authenticated users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 본인 좋아요만 취소 가능
CREATE POLICY "Users can unlike own likes"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);
