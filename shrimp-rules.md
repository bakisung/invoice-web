# Development Guidelines

## Project Overview

- **목적**: Notion DB에서 글 작성 → 60초 ISR 캐시 → 블로그 자동 반영
- **스택**: Next.js 15.5.3 (App Router) + React 19 + TypeScript 5 + TailwindCSS v4 + shadcn/ui
- **CMS**: `@notionhq/client` (서버 전용)
- **배포**: Vercel (ISR 지원)

---

## Directory Structure

### 현재 파일 구조

```
src/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (Geist 폰트, Toaster)
│   ├── page.tsx                      # 홈 (/) - 글 목록
│   ├── posts/[slug]/page.tsx         # 글 상세
│   ├── category/[category]/page.tsx  # 카테고리 필터
│   └── search/page.tsx               # 검색 결과
├── components/
│   ├── ui/                           # shadcn/ui (수정 금지)
│   ├── layout/                       # header.tsx, footer.tsx, container.tsx
│   └── navigation/                   # main-nav.tsx, mobile-nav.tsx
└── lib/
    ├── env.ts                        # Zod 환경변수 검증
    └── utils.ts                      # cn() 유틸리티
```

### 향후 생성할 파일 구조

```
src/
├── types/
│   ├── blog.ts         # BlogPost, Category, PostStatus, NotionBlock
│   └── notion.ts       # Notion API 응답 타입
├── components/
│   ├── blog/           # PostCard, CategoryBadge, TagList, SearchBar, CategoryTabs
│   └── notion/
│       ├── NotionBlockRenderer.tsx
│       ├── TableOfContents.tsx
│       └── blocks/     # ParagraphBlock, HeadingBlock, CodeBlock, ImageBlock, ...
└── lib/
    ├── notion/
    │   ├── client.ts   # Notion 클라이언트 초기화 (서버 전용)
    │   ├── posts.ts    # 글 목록/단건 조회 함수
    │   └── blocks.ts   # Notion 블록 파싱 유틸리티
    ├── dummy-data.ts   # Phase 2 더미 데이터 (Phase 3에서 제거)
    └── utils/
        └── date.ts     # 상대 시간 포맷 ("3일 전")
```

---

## Security Rules

### ⚠️ CRITICAL: Notion API Key 격리

- `NOTION_API_KEY`, `NOTION_DATABASE_ID`는 **서버 컴포넌트에서만** 사용
- `src/lib/notion/` 하위 모든 파일에 `'use client'` 추가 **절대 금지**
- 환경변수 접근은 반드시 `src/lib/env.ts`의 `env` 객체를 통해서만 수행
- `NEXT_PUBLIC_` 접두사 없는 변수는 클라이언트 번들에 포함 금지

```typescript
// ✅ 올바른 방법 - 서버 컴포넌트에서 env 사용
import { env } from '@/lib/env'
const client = new Client({ auth: env.NOTION_API_KEY })

// ❌ 금지 - 클라이언트에서 직접 접근
const apiKey = process.env.NOTION_API_KEY // Client Component에서 금지
```

---

## Server vs Client Component Decision

### 결정 기준

| 조건 | 컴포넌트 타입 |
|------|-------------|
| Notion API 데이터 페칭 | Server Component |
| `useState` / `useEffect` 필요 | Client Component |
| 클릭 이벤트 핸들러 필요 | Client Component |
| 검색창 입력, 디바운스 | Client Component (`'use client'`) |
| 목차 스크롤 위치 추적 | Client Component (`'use client'`) |
| 카테고리 탭 전환 (URL 기반) | Server Component (URL params로 처리) |

### 패턴: 데이터 페칭은 서버, 인터랙션은 클라이언트

```typescript
// ✅ Server Component에서 데이터 페칭 후 props 전달
export default async function PostPage({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)    // 서버에서만 실행
  return <PostContent post={post} />        // Client Component에 props 전달
}

// ❌ 금지 - Client Component에서 Notion API 직접 호출
'use client'
export function BadComponent() {
  useEffect(() => { fetch('/api/notion/...') }, []) // 이 패턴 사용 금지
}
```

---

## Notion API Integration Rules

### ISR 설정 (필수)

```typescript
// 모든 Notion 데이터를 사용하는 페이지에 반드시 추가
export const revalidate = 60  // 60초 ISR
```

### 발행 상태 필터 (항상 적용)

- Notion API 쿼리 시 `Status = '발행됨'` 필터 **항상** 포함
- `Published <= 오늘` 조건 **항상** 포함

```typescript
// ✅ 올바른 필터 적용
const posts = await notion.databases.query({
  database_id: env.NOTION_DATABASE_ID!,
  filter: {
    and: [
      { property: 'Status', select: { equals: '발행됨' } },
      { property: 'Published', date: { on_or_before: new Date().toISOString() } }
    ]
  }
})

// ❌ 금지 - 필터 없이 전체 조회
const posts = await notion.databases.query({ database_id: '...' })
```

### 접근 제어 (필수)

```typescript
// ✅ 글 상세 페이지에서 초안 접근 차단
const post = await getPostBySlug(slug)
if (!post || post.status !== '발행됨') notFound()  // 404 반환 필수
```

### generateStaticParams (발행된 글만)

```typescript
// ✅ 발행된 글만 정적 경로 생성
export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map(post => ({ slug: post.slug }))
}
```

---

## Type Definition Rules

### 타입 파일 위치

- `src/types/blog.ts` — BlogPost, Category, PostStatus, NotionBlock, BlockType
- `src/types/notion.ts` — Notion API 응답 원시 타입

### 핵심 타입 인터페이스 (PRD 기준)

```typescript
// src/types/blog.ts
type PostStatus = '초안' | '발행됨'

type BlockType =
  | 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3'
  | 'bulleted_list_item' | 'numbered_list_item'
  | 'code' | 'image' | 'quote' | 'divider' | 'callout' | 'toggle'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  publishedAt: string   // ISO 8601
  status: PostStatus
  cover?: string
  content: NotionBlock[]
}

interface Category {
  name: string
  count: number
  color: string
}
```

---

## Component Location Decision

### 새 컴포넌트 추가 시 위치 결정

```
shadcn/ui 범용 UI 컴포넌트?
  → npx shadcn@latest add [component] 사용
  → src/components/ui/ (자동 생성, 직접 수정 금지)

블로그 도메인 컴포넌트? (PostCard, CategoryBadge, TagList, SearchBar 등)
  → src/components/blog/

Notion 블록 렌더링 컴포넌트? (NotionBlockRenderer, 개별 블록)
  → src/components/notion/ 또는 src/components/notion/blocks/

페이지 레이아웃? (Header, Footer, Container)
  → src/components/layout/

네비게이션? (MainNav, MobileNav)
  → src/components/navigation/

특정 페이지에서만 사용하는 작은 컴포넌트?
  → 해당 src/app/[route]/ 하위에 별도 파일
```

---

## Multi-File Coordination Requirements

### 새 페이지 라우트 추가 시

반드시 동시에 수정:
1. `src/app/[route]/page.tsx` — 페이지 생성
2. `src/components/navigation/main-nav.tsx` — navItems 배열에 추가
3. `src/components/navigation/mobile-nav.tsx` — navItems 배열에 추가

### 새 Notion 블록 타입 추가 시

반드시 동시에 수정:
1. `src/types/blog.ts` — BlockType 유니온 타입에 추가
2. `src/lib/notion/blocks.ts` — Notion API → BlockType 파싱 로직 추가
3. `src/components/notion/NotionBlockRenderer.tsx` — switch/case 분기 추가
4. `src/components/notion/blocks/[BlockName]Block.tsx` — 렌더링 컴포넌트 생성

### 환경변수 추가 시

반드시 동시에 수정:
1. `src/lib/env.ts` — Zod 스키마에 추가
2. `.env.local.example` — 예시 값 추가

### 더미 데이터 → 실데이터 교체 시 (Phase 3)

반드시 동시에:
1. `src/lib/dummy-data.ts` 삭제
2. 각 페이지에서 dummy-data import를 Notion API 호출로 교체
3. `revalidate = 60` 추가

---

## Next.js 15 Specific Rules

### params / searchParams 비동기 처리 (필수)

```typescript
// ✅ Next.js 15 - params는 반드시 await
interface Props {
  params: Promise<{ slug: string }>
}
export default async function Page({ params }: Props) {
  const { slug } = await params  // await 필수
}

// ✅ searchParams도 동일
interface Props {
  searchParams: Promise<{ q?: string }>
}
export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams  // await 필수
}

// ❌ 금지 - Next.js 14 이하 방식
export default function Page({ params }) {
  const { slug } = params  // await 없이 사용 금지
}
```

### decodeURIComponent 처리

- `category` params는 반드시 `decodeURIComponent()` 처리 후 사용

```typescript
const { category } = await params
const decodedCategory = decodeURIComponent(category)  // 필수
```

---

## Styling Rules

### 색상 클래스

```typescript
// ✅ 시맨틱 색상 변수 사용
<div className="bg-background text-foreground border-border">
<p className="text-muted-foreground">

// ❌ 금지 - 하드코딩 색상
<div className="bg-white text-gray-900 border-gray-200">
```

### 클래스 조합

```typescript
// ✅ cn() 함수 사용
import { cn } from '@/lib/utils'
<div className={cn('base-class', condition && 'conditional-class', className)}>

// ❌ 금지 - 템플릿 리터럴 직접 조합
<div className={`base-class ${condition ? 'yes' : ''}`}>
```

### 반응형 (모바일 우선)

```typescript
// ✅ 모바일 우선
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ 데스크탑 우선 금지
<div className="hidden lg:block">  // 이 패턴만으로 구현 금지
```

---

## File Naming Rules

- 파일명: `kebab-case` (예: `post-card.tsx`, `category-badge.tsx`)
- 컴포넌트명: `PascalCase` (예: `PostCard`, `CategoryBadge`)
- 훅명: `camelCase` with `use` prefix (예: `useDebounce`)
- import 경로: 반드시 `@/` 별칭 사용 (상대 경로 `../` 금지)
- 파일 크기: 300줄 이하 권장, 초과 시 분할

---

## Prohibited Actions

1. **`src/lib/notion/` 파일에 `'use client'` 추가** — Notion API Key 클라이언트 노출
2. **Client Component에서 `env.NOTION_API_KEY` 접근** — 보안 위반
3. **`src/components/ui/` 파일 직접 수정** — shadcn/ui 관리 파일, `npx shadcn add` 사용
4. **`any` 타입 사용** — TypeScript 타입 안전성 위반
5. **`Status !== '발행됨'` 글 렌더링** — 초안 공개 위험
6. **revalidate 없는 Notion API 호출 페이지** — 캐시 미설정으로 성능 저하
7. **인라인 스타일 사용** — TailwindCSS 클래스로 대체
8. **하드코딩 색상 클래스** (bg-white, text-gray-900 등) — 시맨틱 변수 사용
9. **상대 경로 import** (`../../../components/...`) — `@/` 별칭 필수
10. **Client Component에서 Notion API 직접 fetch** — 서버 컴포넌트 또는 Route Handler 사용
11. **`@notionhq/client`를 클라이언트 번들에 포함** — 서버 전용 패키지
12. **더미 데이터를 Phase 3 이후에도 유지** — 실데이터로 반드시 교체
