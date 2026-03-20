-- ============================================================
-- GitHub OAuth 대응: 프로필 자동 생성 트리거 업데이트
-- GitHub 로그인 시 username과 avatar_url을 자동으로 가져옴
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',       -- GitHub username
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      NEW.email
    ),
    'commenter',
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NULL
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
