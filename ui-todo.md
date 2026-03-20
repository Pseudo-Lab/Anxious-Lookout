# 초조한 전망대 — UI 개선 TODO

## 참고 사이트
- [overreacted.io](https://overreacted.io) — 텍스트 중심 미니멀 블로그 (Dan Abramov)
- [joshwcomeau.com](https://www.joshwcomeau.com) — 인터랙티브 코드, 다크모드
- [Chirpy Jekyll Theme](https://github.com/cotes2020/jekyll-theme-chirpy) — 사이드바 + 목차
- [Tailwind Next.js Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) — Next.js 블로그 템플릿

## 기능 목록

### 완료
- [x] **회원가입/로그인** — GitHub OAuth 연동, 관리자 승인 플로우 적용
- [x] **추천(좋아요) 버튼** — 글 상세에서 추천 수 표시, Supabase 저장, 로그인 시 토글 가능
- [x] **한글 폰트** — Pretendard Variable CDN 적용 (dynamic subset)
- [x] **Supabase 글 통합** — 홈페이지에서 Supabase 발행 글 표시, /view/?id= 동적 뷰어
- [x] **발행 버튼 개선** — 저장 없이 바로 발행 가능 (자동 저장 + 발행)

### 우선순위 중간
- [ ] **다크/라이트 토글** — 헤더에 토글 버튼, localStorage로 설정 유지
- [ ] **읽기 예상 시간** — 글 목록 및 상세에 "N분 읽기" 표시 (글자 수 기반 자동 계산)
- [ ] **읽기 진행 바** — 글 상세 페이지 상단에 스크롤 진행률 바
- [ ] **글 목차(TOC)** — 긴 글에서 사이드바에 h2/h3 기반 자동 목차 생성

### 우선순위 낮음
- [ ] **작성자 프로필 카드** — 멤버별 아바타, 소개, 작성 글 수 표시
- [ ] **검색 기능** — 라이브 검색으로 글 제목/내용 필터링
- [ ] **카드 hover 발광 효과** — 마우스 오버 시 은은한 glow
- [ ] **히어로 섹션 개선** — 전망대 테마에 맞는 그라데이션/파티클 효과

## 디자인 방향
- 기본 색상: 인디고 계열 accent + warm stone 배경
- "전망대" 컨셉: 관찰·기록의 느낌, 차분하면서 약간의 긴장감
- 모바일 반응형 필수
