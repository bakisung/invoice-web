# 📋 PRD: Notion CMS 기반 개인 개발 블로그

> **프로젝트 요약**
> Notion을 CMS로 활용하여 글 작성부터 발행까지 Notion 하나로 관리하는 개인 기술 블로그.
> 관리자가 Notion에서 글을 작성하면 자동으로 블로그에 반영된다.

---

## 1. 개요 (Overview)

### 제품 비전

> **"Notion에서 글을 쓰면, 블로그가 완성된다."**

### 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 개발 블로그 |
| 목적 | Notion을 CMS로 활용한 개인 기술 블로그 운영 |
| 배포 환경 | Vercel |
| 개발 기간 | MVP 3~4주 |

### MVP 범위

| 구분 | 포함 | 제외 |
|------|------|------|
| 콘텐츠 관리 | Notion API 연동 (읽기) | 웹 에디터 직접 입력 UI |
| 글 목록 | 홈 페이지 최근 글 목록 | 페이지네이션 (무한 스크롤) |
| 글 상세 | Notion 블록 렌더링 | 댓글 기능 |
| 필터링 | 카테고리별 필터 | 복합 필터 (AND/OR) |
| 검색 | 제목 기반 검색 | 전문 검색 (Elasticsearch) |
| 디자인 | 반응형 기본 스타일 | 다크/라이트 모드 토글 |
| SEO | 메타데이터 자동 생성 | 사이트맵 자동화 |

---

## 2. 사용자 정의 (User Definition)

### 페르소나 A — 블로그 운영자 (Author)

| 항목 | 내용 |
|------|------|
| 직군 | 개인 개발자, 기술 블로거 |
| 기술 수준 | Notion 능숙 / Next.js 개발 가능 |
| 목표 | 별도 CMS 없이 Notion만으로 블로그 관리 |

**Pain Points**

1. WordPress/Tistory 같은 별도 플랫폼에서 글쓰기 환경이 불편하다.
2. 커스텀 블로그를 운영하려면 별도 DB 및 어드민 구축이 필요해 복잡하다.
3. 이미 Notion으로 메모/글을 관리하는데 이중 작업이 발생한다.

**Jobs To Be Done**

- Notion에서 글을 작성하면 별도 작업 없이 블로그에 바로 게시되길 원한다.
- 카테고리, 태그, 발행일 등을 Notion 속성으로 관리하고 싶다.

---

### 페르소나 B — 블로그 독자 (Reader)

| 항목 | 내용 |
|------|------|
| 직군 | 개발자, IT 종사자 |
| 기술 수준 | 기술 콘텐츠 소비에 익숙 |
| 목표 | 기술 글을 빠르고 편하게 읽기 |

**Pain Points**

1. 원하는 주제의 글을 찾기 어렵다.
2. 모바일에서 코드 블록이 깨지거나 읽기 불편하다.

**Jobs To Be Done**

- 카테고리/태그로 관심 있는 글을 빠르게 필터링하고 싶다.
- 어떤 기기에서도 가독성 좋게 글을 읽고 싶다.

---

## 3. 사용자 스토리 (User Stories)

### 운영자 스토리

**[AUTHOR-01] Notion에서 글 작성 및 발행**

```
As a 블로그 운영자,
I want to Notion 데이터베이스에 글을 작성하고 Status를 "발행됨"으로 변경하면,
So that 별도 배포 없이 블로그에 자동으로 글이 게시된다.

인수 조건:
- Given 운영자가 Notion DB에 제목, 본문, 카테고리, 발행일을 입력하고 Status를 "발행됨"으로 설정했을 때,
  When 블로그에서 해당 페이지를 요청하면,
  Then 60초 이내에 캐시가 갱신되어 최신 글이 표시된다.
- Given Status가 "초안"인 글은,
  When 독자가 URL로 직접 접근하면,
  Then 404 페이지가 표시된다.
```

**[AUTHOR-02] 카테고리/태그 관리**

```
As a 블로그 운영자,
I want to Notion DB의 Category(select), Tags(multi_select) 속성으로 분류를 관리하면,
So that 블로그에서 자동으로 카테고리/태그 필터링이 동작한다.

인수 조건:
- Given 운영자가 Notion에서 새 카테고리를 추가했을 때,
  When 블로그 카테고리 페이지를 방문하면,
  Then 새 카테고리가 자동으로 표시된다.
```

---

### 독자 스토리

**[READER-01] 글 목록 조회**

```
As a 독자,
I want to 블로그 홈에서 최근 발행된 글 목록을 보고 싶다,
So that 새로운 콘텐츠를 빠르게 파악할 수 있다.

인수 조건:
- Given 독자가 홈 페이지에 접근했을 때,
  When 페이지가 로드되면,
  Then 발행일 내림차순으로 정렬된 글 목록(제목, 카테고리, 태그, 발행일, 썸네일)이 표시된다.
- Given 모바일 기기에서 접근했을 때,
  When 페이지가 렌더링되면,
  Then 가로 스크롤 없이 카드형 목록이 표시된다.
```

**[READER-02] 글 상세 조회**

```
As a 독자,
I want to 글 목록에서 제목을 클릭하면 전체 내용을 읽고 싶다,
So that Notion에서 작성된 글을 블로그에서 읽을 수 있다.

인수 조건:
- Given 독자가 글 상세 URL에 접근했을 때,
  When 페이지가 로드되면,
  Then Notion 블록(제목, 텍스트, 코드, 이미지, 리스트)이 올바르게 렌더링된다.
- Given 코드 블록이 포함된 글일 때,
  When 페이지가 렌더링되면,
  Then 언어별 문법 강조(syntax highlighting)가 적용된다.
```

**[READER-03] 카테고리 필터링**

```
As a 독자,
I want to 카테고리를 선택해 해당 주제의 글만 보고 싶다,
So that 관심 있는 분야의 글을 빠르게 찾을 수 있다.

인수 조건:
- Given 독자가 특정 카테고리를 선택했을 때,
  When 필터가 적용되면,
  Then 해당 카테고리에 속한 발행된 글만 표시된다.
```

**[READER-04] 검색**

```
As a 독자,
I want to 검색창에 키워드를 입력해 관련 글을 찾고 싶다,
So that 원하는 주제의 글을 제목 기반으로 빠르게 찾을 수 있다.

인수 조건:
- Given 독자가 검색창에 키워드를 입력했을 때,
  When 검색 결과가 표시되면,
  Then 제목에 해당 키워드가 포함된 발행된 글 목록이 표시된다.
- Given 검색 결과가 없을 때,
  When 결과 영역이 렌더링되면,
  Then "검색 결과가 없습니다" 안내 메시지가 표시된다.
```

---

## 4. 기능 요구사항 (Functional Requirements)

### [M] Notion API 연동 모듈

**Notion 데이터베이스 필드 정의**

| 필드명 | Notion 타입 | 필수 여부 | 설명 |
|--------|------------|----------|------|
| `Title` | title | ✅ | 글 제목 |
| `Category` | select | ✅ | 카테고리 (예: React, TypeScript, DevOps) |
| `Tags` | multi_select | ❌ | 태그 목록 |
| `Published` | date | ✅ | 발행일 |
| `Status` | select | ✅ | 초안 / 발행됨 |
| `Slug` | rich_text | ✅ | URL용 고유 식별자 (영문, 하이픈) |
| `Description` | rich_text | ❌ | 글 요약 (SEO용 메타 설명) |
| `Cover` | files | ❌ | 썸네일 이미지 |
| `Content` | page content | ✅ | 본문 (Notion 블록) |

**데이터 동기화 방식**: ISR (Incremental Static Regeneration)

- Next.js `revalidate` TTL: 60초
- 캐시 미스 시 Notion API 호출 → 데이터 파싱 → 렌더링

**지원 Notion 블록 타입**

| 블록 타입 | 렌더링 방식 |
|-----------|-----------|
| `paragraph` | `<p>` |
| `heading_1/2/3` | `<h1>/<h2>/<h3>` |
| `bulleted_list_item` | `<ul><li>` |
| `numbered_list_item` | `<ol><li>` |
| `code` | 코드 블록 (syntax highlighting) |
| `image` | `<img>` (Next.js Image 최적화) |
| `quote` | `<blockquote>` |
| `divider` | `<hr>` |
| `callout` | 강조 박스 |
| `toggle` | 접기/펼치기 컴포넌트 |

---

### [M] 글 목록 페이지 (홈)

**URL**: `/`

**표시 정보**

- 글 제목
- 카테고리 배지
- 태그 목록 (최대 3개)
- 발행일 (상대 시간: "3일 전")
- 글 요약 (Description 필드, 없으면 본문 앞 100자)
- 썸네일 이미지 (없으면 기본 이미지)

**정렬**: 발행일 내림차순

**필터 조건**: `Status = 발행됨` AND `Published <= 오늘`

---

### [M] 글 상세 페이지

**URL**: `/posts/[slug]`

**표시 정보**

- 글 제목
- 카테고리, 태그
- 발행일
- 본문 (Notion 블록 렌더링)
- 목차 (heading 블록 기반 자동 생성)
- 이전글/다음글 네비게이션

**접근 제어**

- `Status = 발행됨`인 글만 접근 허용
- 그 외 → 404 페이지

---

### [M] 카테고리 필터링

**URL**: `/category/[category]`

**동작**

- 상단 카테고리 탭 또는 사이드바에서 선택
- 선택된 카테고리의 발행된 글 목록 표시
- 전체 카테고리 목록은 Notion DB에서 동적으로 추출

---

### [M] 검색 기능

**URL**: `/search?q=[keyword]`

**동작 방식**

- 클라이언트사이드 필터링 (Notion API의 filter 기능 활용)
- 제목(`Title`) 기준 포함 검색
- 실시간 검색 (디바운스 300ms 적용)

---

### [S] SEO 최적화

- 글 상세 페이지: `og:title`, `og:description`, `og:image` 자동 생성
- `<title>`: `[글 제목] | [블로그명]` 형식
- 발행된 글 목록 기반 정적 경로 생성 (`generateStaticParams`)

---

## 5. 기술 스택 (Tech Stack)

| 분류 | 기술 | 선택 이유 |
|------|------|---------|
| Framework | Next.js 15 (App Router) | 서버 컴포넌트로 Notion API 키 보호 + ISR 캐시 |
| Language | TypeScript | 타입 안정성 |
| CMS | Notion API (`@notionhq/client`) | 기존 Notion 워크플로우 활용 |
| Styling | Tailwind CSS | 빠른 반응형 UI 구현 |
| UI 컴포넌트 | shadcn/ui | 접근성 보장 + 커스터마이징 용이 |
| Icons | Lucide React | shadcn/ui 기본 아이콘 |
| Syntax Highlight | `highlight.js` or `shiki` | 코드 블록 문법 강조 |
| Deployment | Vercel | Next.js 최적화 배포 환경 |

---

## 6. 시스템 아키텍처

```
┌─────────────────┐    Notion API    ┌──────────────────────────┐
│   Notion DB     │ ───────────────► │   Next.js 15 Server      │
│  (글 작성/관리)  │                  │   (App Router + ISR)     │
└─────────────────┘                  └──────────┬───────────────┘
                                                │
                   ┌────────────────────────────┼────────────────────────┐
                   │                            │                        │
                   ▼                            ▼                        ▼
         ┌──────────────────┐       ┌──────────────────┐      ┌──────────────────┐
         │   / (홈)          │       │ /posts/[slug]    │      │ /category/[cat]  │
         │   글 목록          │       │   글 상세         │      │  카테고리 필터    │
         └──────────────────┘       └──────────────────┘      └──────────────────┘
                                             │
                                             ▼
                                    ┌──────────────────┐
                                    │  Notion Block    │
                                    │  Renderer        │
                                    └──────────────────┘
```

**데이터 흐름**

```
Notion에서 글 작성
      ↓
Status = "발행됨" 설정
      ↓
독자가 블로그 접근 (URL 요청)
      ↓
Next.js 서버: 캐시 HIT → 캐시된 데이터 반환
              캐시 MISS → Notion API 호출 → 파싱 → 렌더링 → 캐시 저장 (TTL: 60초)
      ↓
클라이언트에 HTML 반환
```

---

## 7. 데이터 모델 (Data Model)

### BlogPost

```typescript
interface BlogPost {
  id: string;               // Notion 페이지 ID
  slug: string;             // URL 식별자 (영문, 하이픈)
  title: string;            // 글 제목
  description: string;      // 글 요약
  category: string;         // 카테고리
  tags: string[];           // 태그 목록
  publishedAt: string;      // 발행일 (ISO 8601)
  status: PostStatus;       // 초안 | 발행됨
  cover?: string;           // 썸네일 이미지 URL
  content: NotionBlock[];   // 본문 블록
}

type PostStatus = '초안' | '발행됨';
```

### NotionBlock

```typescript
interface NotionBlock {
  id: string;
  type: BlockType;
  content: string | NotionBlock[];
  language?: string;        // code 블록용
  checked?: boolean;        // to_do 블록용
}

type BlockType =
  | 'paragraph'
  | 'heading_1' | 'heading_2' | 'heading_3'
  | 'bulleted_list_item' | 'numbered_list_item'
  | 'code' | 'image' | 'quote'
  | 'divider' | 'callout' | 'toggle';
```

### Category

```typescript
interface Category {
  name: string;             // 카테고리 이름
  count: number;            // 해당 카테고리 글 수
  color: string;            // Notion select 색상
}
```

---

## 8. URL 구조 (Routing)

| URL | 설명 |
|-----|------|
| `/` | 홈 - 최근 글 목록 |
| `/posts/[slug]` | 글 상세 페이지 |
| `/category/[category]` | 카테고리별 글 목록 |
| `/search?q=[keyword]` | 검색 결과 |

---

## 9. 화면 구성 (UI/UX)

### 홈 페이지 레이아웃 (데스크탑)

```
┌─────────────────────────────────────────────────────┐
│  [블로그명]                     [검색] [카테고리 ▼]  │  ← 헤더/네비
├─────────────────────────────────────────────────────┤
│                                                     │
│  카테고리: [전체] [React] [TypeScript] [DevOps]      │  ← 카테고리 탭
│                                                     │
│  ┌───────────────────┐  ┌───────────────────┐       │
│  │  [썸네일]          │  │  [썸네일]          │       │
│  │  React 카테고리    │  │  TypeScript       │       │
│  │  제목: Next.js 15  │  │  제목: 타입 유틸리티│      │
│  │  3일 전 · #태그    │  │  1주 전 · #태그   │       │  ← 글 카드 그리드
│  └───────────────────┘  └───────────────────┘       │
│                                                     │
│  ┌───────────────────┐  ┌───────────────────┐       │
│  │  ...              │  │  ...              │       │
│  └───────────────────┘  └───────────────────┘       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 글 상세 페이지 레이아웃 (데스크탑)

```
┌─────────────────────────────────────────────────────┐
│  [블로그명]                     [검색] [카테고리 ▼]  │  ← 헤더
├──────────────────────────────────┬──────────────────┤
│                                  │                  │
│  # 글 제목                        │  ## 목차          │
│  React | 2026-01-15 | #태그      │  - 섹션 1         │  ← 본문 + 목차
│  ─────────────────────────────   │  - 섹션 2         │
│  본문 내용...                     │  - 섹션 3         │
│                                  │                  │
│  ```javascript                   │                  │
│  // 코드 블록                    │                  │
│  ```                             │                  │
│                                  │                  │
│  [← 이전글]              [다음글→] │                  │
└──────────────────────────────────┴──────────────────┘
```

### 반응형 브레이크포인트

| 구간 | 레이아웃 |
|------|---------|
| 모바일 (< 768px) | 단일 컬럼, 카드형 목록, 목차 숨김 |
| 태블릿 (768px~) | 2열 카드 그리드, 목차 숨김 |
| 데스크탑 (1024px~) | 3열 카드 그리드, 글 상세에 목차 사이드바 |

---

## 10. 비기능 요구사항 (Non-Functional Requirements)

| 항목 | 요구사항 |
|------|---------|
| 성능 | LCP(Largest Contentful Paint) 2.5초 이내 |
| 성능 | ISR TTL 60초 - Notion API 호출 최소화 |
| 보안 | Notion API 키는 서버 환경변수에서만 사용 (클라이언트 노출 금지) |
| 보안 | `Status = 초안` 글은 직접 URL 접근 시 404 반환 |
| SEO | 글 상세 페이지 Open Graph 메타태그 자동 생성 |
| 가용성 | Vercel 무료 플랜 기준 99% uptime |
| 접근성 | WCAG 2.1 AA 수준 (alt 텍스트, 키보드 네비게이션) |

---

## 11. 환경 변수 (Environment Variables)

```bash
# Notion API 인증
NOTION_API_KEY=secret_xxxx       # Notion Integration 시크릿 키
NOTION_DATABASE_ID=xxxx          # 블로그 게시물 데이터베이스 ID

# 블로그 메타정보
NEXT_PUBLIC_BLOG_NAME=개발 블로그
NEXT_PUBLIC_BLOG_URL=https://example.vercel.app
```

---

## 12. 구현 단계 (Implementation Milestones)

| 단계 | 작업 | 산출물 |
|------|------|-------|
| **1단계** | 환경 설정 | - `@notionhq/client` 설치<br>- 환경 변수 설정<br>- Notion DB 생성 및 API 키 발급 |
| **2단계** | Notion API 연동 | - `lib/notion.ts` 데이터 페칭 함수<br>- Notion 블록 파싱 유틸리티<br>- TypeScript 타입 정의 |
| **3단계** | 글 목록 페이지 | - 홈 페이지(`/`) 구현<br>- 글 카드 컴포넌트<br>- 카테고리 탭 필터 |
| **4단계** | 글 상세 페이지 | - `/posts/[slug]` 구현<br>- Notion 블록 렌더러<br>- 코드 블록 Syntax Highlighting<br>- 목차 자동 생성 |
| **5단계** | 검색 및 최적화 | - 검색 기능<br>- SEO 메타태그<br>- ISR 설정<br>- 반응형 최종 점검 |

---

## 13. 성공 지표 (Success Metrics)

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

---

## 14. 제외 범위 (Out of Scope for MVP)

| 기능 | 제외 이유 | 향후 계획 |
|------|---------|---------|
| 댓글 기능 | 외부 서비스(Giscus, Disqus) 연동 필요 | Phase 2 |
| 다크/라이트 모드 토글 | 기본 스타일링 먼저 완성 | Phase 2 |
| RSS 피드 | MVP 핵심 기능 아님 | Phase 2 |
| 사이트맵 자동화 | 수동 배포로 충분 | Phase 2 |
| 태그 페이지 | 카테고리로 충분 | Phase 2 |
| 글 조회수 카운팅 | 별도 DB 필요 | Phase 3 |
| 뉴스레터 구독 | 외부 서비스 연동 필요 | Phase 3 |
| 다국어 지원 | 초기 타겟은 한국어 | Phase 3 |
| 전문 검색 (Elasticsearch) | Notion API 필터로 충분 | Phase 3 |
