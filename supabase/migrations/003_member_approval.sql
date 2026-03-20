-- ============================================================
-- 회원 승인 제도: is_approved 추가, 글 승인 워크플로 제거
-- ============================================================

-- 1. profiles에 is_approved 컬럼 추가 (기본: false)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;

-- 2. post_drafts status 제약 변경 (pending/approved/rejected 제거)
ALTER TABLE public.post_drafts
  DROP CONSTRAINT IF EXISTS post_drafts_status_check;

ALTER TABLE public.post_drafts
  ADD CONSTRAINT post_drafts_status_check
  CHECK (status IN ('draft', 'published'));

-- 3. reviewer 관련 컬럼 제거 (더 이상 글 리뷰 없음)
ALTER TABLE public.post_drafts
  DROP COLUMN IF EXISTS reviewer_notes,
  DROP COLUMN IF EXISTS reviewed_by;

-- ============================================================
-- RLS 정책 업데이트: is_approved 기반
-- ============================================================

-- post_drafts: 기존 정책 제거 후 재생성
DROP POLICY IF EXISTS "Authors can read own drafts" ON public.post_drafts;
DROP POLICY IF EXISTS "Admin can read all drafts" ON public.post_drafts;
DROP POLICY IF EXISTS "Authenticated users can create drafts" ON public.post_drafts;
DROP POLICY IF EXISTS "Authors can update own draft or rejected drafts" ON public.post_drafts;
DROP POLICY IF EXISTS "Admin can update any draft" ON public.post_drafts;
DROP POLICY IF EXISTS "Authors can delete own drafts" ON public.post_drafts;

-- 승인된 회원은 자기 초안 읽기 가능
CREATE POLICY "Approved users can read own drafts"
  ON public.post_drafts FOR SELECT
  USING (author_id = auth.uid());

-- 관리자는 모든 초안 읽기 가능
CREATE POLICY "Admin can read all drafts"
  ON public.post_drafts FOR SELECT
  USING (public.get_my_role() = 'admin');

-- 승인된 회원만 초안 생성 가능
CREATE POLICY "Approved users can create drafts"
  ON public.post_drafts FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 자기 초안만 수정 가능
CREATE POLICY "Authors can update own drafts"
  ON public.post_drafts FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- 자기 초안만 삭제 가능 (draft 상태만)
CREATE POLICY "Authors can delete own drafts"
  ON public.post_drafts FOR DELETE
  USING (author_id = auth.uid() AND status = 'draft');

-- comments: 기존 INSERT 정책 업데이트
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;

CREATE POLICY "Approved users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'published'
    AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = true
  );

-- attachments: 기존 INSERT 정책 업데이트
DROP POLICY IF EXISTS "Editors and admins can insert attachments" ON public.attachments;

CREATE POLICY "Approved users can insert attachments"
  ON public.attachments FOR INSERT
  WITH CHECK (
    auth.uid() = owner_user_id
    AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = true
  );

-- storage: 업로드 정책 업데이트
DROP POLICY IF EXISTS "Editors and admins can upload to blog-images" ON storage.objects;

CREATE POLICY "Approved users can upload to blog-images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.role() = 'authenticated'
    AND (SELECT is_approved FROM public.profiles WHERE id = auth.uid()) = true
  );
