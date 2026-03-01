# 개인 개발 블로그 개발 로드맵

> Notion에서 글을 쓰면, 블로그가 완성된다.

## 개요

개인 개발 블로그는 **개인 개발자 및 기술 블로거**를 위한 **Notion CMS 기반 블로그 플랫폼**으로 다음 기능을 제공합니다:

- **Notion 연동 CMS**: Notion 데이터베이스에서 글 작성 → 60초 ISR 캐시 → 블로그 자동 반영
- **콘텐츠 탐색**: 카테고리 필터링 및 제목 기반 실시간 검색
- **Notion 블록 렌더링**: 텍스트, 코드 (Syntax Highlighting), 이미지, 목차 등 완전 지원
- **SEO 최적화**: Open Graph 메타태그 자동 생성 및 ISR 기반 정적 경로 생성

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**

3. **작업 구현**

   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

   - 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅ - 완료
  - See: `/tasks/001-project-setup.md`
  - ✅ Next.js 15 App Router 기반 전체 라우트 구조 생성 (`/`, `/posts/[slug]`, `/category/[category]`, `/search`)
  - ✅ 공통 레이아웃 컴포넌트 구현 (Header, Footer, Container)
  - ✅ 반응형 네비게이션 구현 (MainNav, MobileNav)
  - ✅ shadcn/ui 기반 UI 컴포넌트 설치 (Button, Badge, Card, Input 등)
  - ✅ 환경 변수 스키마 정의 (Zod 기반 `lib/env.ts`)

- **Task 002: TypeScript 타입 정의 및 인터페이스 설계** ✅ - 완료
  - See: `/tasks/002-typescript-types.md`
  - ✅ `src/types/blog.ts` 생성 — BlogPost, NotionBlock, Category 인터페이스 정의
  - ✅ `src/types/notion.ts` 생성 — Notion API 응답 타입 정의
  - ✅ BlockType 유니온 타입 정의 (paragraph, heading_1/2/3, code, image 등 12가지)
  - ✅ PostStatus 타입 정의 (`'초안' | '발행됨'`)
  - ✅ API 응답 래퍼 타입 정의 (성공/에러 응답 형식 통일, `src/types/api.ts`)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 블로그 공통 컴포넌트 라이브러리 구현** - 우선순위
  - `src/components/blog/PostCard.tsx` — 글 카드 컴포넌트 (썸네일, 제목, 카테고리 배지, 태그, 발행일, 요약)
  - `src/components/blog/CategoryBadge.tsx` — Notion 색상 기반 카테고리 배지
  - `src/components/blog/TagList.tsx` — 태그 목록 (최대 3개 표시)
  - `src/components/blog/SearchBar.tsx` — 검색창 컴포넌트 (디바운스 300ms)
  - `src/components/blog/CategoryTabs.tsx` — 카테고리 탭 필터
  - `src/lib/dummy-data.ts` — 더미 BlogPost 데이터 5~10개 생성
  - `src/lib/utils/date.ts` — 상대 시간 포맷 유틸리티 ("3일 전")

- **Task 004: 홈 페이지 UI 완성**
  - 카테고리 탭 필터 UI (전체 / React / TypeScript / DevOps)
  - 글 카드 그리드 레이아웃 (데스크탑 3열 / 태블릿 2열 / 모바일 1열)
  - 더미 데이터 기반 글 목록 렌더링
  - 빈 상태(Empty State) UI 처리
  - Skeleton 로딩 컴포넌트 구현

- **Task 005: 글 상세 페이지 UI 완성**
  - 글 메타정보 헤더 (제목, 카테고리, 태그, 발행일)
  - 본문 영역과 목차 사이드바 2단 레이아웃 (데스크탑)
  - `src/components/notion/TableOfContents.tsx` — heading 블록 기반 목차 자동 생성
  - 이전글/다음글 네비게이션
  - 모바일에서 목차 숨김 처리

- **Task 006: 검색 및 카테고리 필터 페이지 UI 완성**
  - `/search` 페이지 — 검색창 + 결과 목록 (더미 데이터 필터링)
  - `/category/[category]` 페이지 — 카테고리별 글 목록
  - 검색 결과 없음 안내 메시지 UI
  - URL 파라미터 기반 상태 동기화 (`?q=keyword`)

### Phase 3: Notion API 연동 및 핵심 기능 구현

- **Task 007: Notion API 연동 모듈 개발** - 우선순위
  - `@notionhq/client` 패키지 설치
  - `src/lib/notion/client.ts` — Notion 클라이언트 초기화 (서버 전용)
  - `src/lib/notion/posts.ts` — 글 목록 조회, 단일 글 조회, 카테고리 목록 추출 함수
  - `src/lib/notion/blocks.ts` — Notion 블록 API 응답 파싱 유틸리티
  - ISR `revalidate: 60` 설정
  - `Status = '발행됨'` AND `Published <= 오늘` 필터 적용
  - Playwright MCP로 Notion API 응답 형식 검증 테스트

- **Task 008: Notion 블록 렌더러 구현**
  - `src/components/notion/NotionBlockRenderer.tsx` — 블록 타입별 분기 렌더링
  - `src/components/notion/blocks/` — 블록별 컴포넌트 분리
    - `ParagraphBlock.tsx`, `HeadingBlock.tsx`, `CodeBlock.tsx`
    - `ImageBlock.tsx` (Next.js Image 최적화), `QuoteBlock.tsx`
    - `CalloutBlock.tsx`, `ToggleBlock.tsx`, `DividerBlock.tsx`
    - `BulletedListBlock.tsx`, `NumberedListBlock.tsx`
  - `shiki` 또는 `highlight.js` 기반 Syntax Highlighting 적용
  - Playwright MCP로 각 블록 타입 렌더링 검증 테스트

- **Task 009: 글 목록 및 카테고리 필터링 실제 연동**
  - 홈 페이지 더미 데이터 → Notion API 실제 데이터로 교체
  - 카테고리 탭 — Notion DB 카테고리 동적 추출 연동
  - `/category/[category]` 페이지 — 실제 카테고리 필터링 연동
  - Playwright MCP로 글 목록 정렬(발행일 내림차순) 검증 테스트

- **Task 010: 검색 기능 및 접근 제어 구현**
  - `/search` 페이지 — 클라이언트사이드 제목 기반 검색 구현
  - 디바운스 300ms 적용 (usehooks-ts `useDebounce`)
  - `Status = '초안'` 글 → 404 리다이렉트 처리 (`notFound()`)
  - `generateStaticParams` 기반 발행된 글 정적 경로 생성
  - Playwright MCP로 검색 결과 필터링 및 404 접근 제어 E2E 테스트

- **Task 011: 핵심 기능 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 플로우 E2E 테스트
    - 홈 → 카테고리 필터링 → 글 카드 클릭 → 글 상세 페이지 접근
    - 검색창 입력 → 검색 결과 표시 → 결과 없음 처리
    - 초안 글 URL 직접 접근 → 404 페이지 표시 확인
  - 모바일(375px) 반응형 렌더링 검증
  - API 호출 에러 핸들링 및 엣지 케이스 테스트

### Phase 4: SEO 최적화 및 배포

- **Task 012: SEO 최적화**
  - 글 상세 페이지 `generateMetadata` — `og:title`, `og:description`, `og:image` 자동 생성
  - `<title>` 형식: `[글 제목] | [블로그명]`
  - 홈/카테고리 페이지 기본 메타데이터 설정
  - `robots.txt` 및 `sitemap.xml` 기본 설정

- **Task 013: 성능 최적화 및 Vercel 배포**
  - Lighthouse Performance 점수 80+ 달성 확인
  - Next.js Image 컴포넌트 최적화 검토
  - Vercel 환경 변수 설정 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)
  - Vercel 배포 및 공개 URL 접근 확인
  - TypeScript 컴파일 오류 0건 확인 (`npm run check-all`)
  - Notion API 키 클라이언트 번들 노출 여부 확인

---

## 성공 지표

### 기능적 완료 기준

- [ ] Notion DB에 글을 작성하고 Status를 "발행됨"으로 변경하면 블로그에 60초 이내 반영된다.
- [ ] 글 목록 페이지에서 카테고리 필터가 정상 동작한다.
- [ ] 글 상세 페이지에서 코드 블록 Syntax Highlighting이 적용된다.
- [ ] 검색창에서 키워드 입력 시 제목 기반 필터 결과가 표시된다.
- [ ] 모바일(375px)에서 가로 스크롤 없이 모든 페이지가 정상 표시된다.
- [ ] `Status = 초안` 글에 직접 URL 접근 시 404 페이지가 표시된다.

### 기술적 완료 기준

- [ ] Lighthouse Performance 점수 80 이상
- [ ] TypeScript 컴파일 오류 0건
- [ ] ESLint 오류 0건
- [ ] Vercel 배포 성공 및 공개 URL 접근 가능
- [ ] Notion API 키가 클라이언트 번들에 노출되지 않음
