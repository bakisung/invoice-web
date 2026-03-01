# 개인 개발 블로그

Notion을 CMS로 활용한 개인 기술 블로그입니다. Notion에서 글을 작성하면 자동으로 블로그에 반영됩니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 15.5.3 (App Router + Turbopack) |
| Language | TypeScript 5 |
| CMS | Notion API (`@notionhq/client`) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |
| Deployment | Vercel |

## 주요 기능

- **Notion CMS 연동**: Notion 데이터베이스에서 블로그 글 목록 자동 동기화
- **글 상세 페이지**: Notion 블록(코드, 이미지, 리스트 등) 렌더링
- **카테고리 필터링**: 카테고리별 글 목록 필터
- **검색**: 제목 기반 글 검색
- **반응형 디자인**: 모바일/태블릿/데스크탑 완전 대응
- **SEO 최적화**: Open Graph 메타태그 자동 생성

## Notion 데이터베이스 구조

블로그 글을 관리하는 Notion 데이터베이스에 다음 속성이 필요합니다.

| 속성명 | Notion 타입 | 설명 |
|--------|------------|------|
| `Title` | title | 글 제목 |
| `Category` | select | 카테고리 |
| `Tags` | multi_select | 태그 목록 |
| `Published` | date | 발행일 |
| `Status` | select | `초안` / `발행됨` |
| `Slug` | rich_text | URL 식별자 (영문, 하이픈) |
| `Description` | rich_text | 글 요약 (SEO용) |
| `Cover` | files | 썸네일 이미지 |

## 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```bash
# Notion API 인증
NOTION_API_KEY=secret_xxxx
NOTION_DATABASE_ID=xxxx

# 블로그 메타정보
NEXT_PUBLIC_BLOG_NAME=개발 블로그
NEXT_PUBLIC_BLOG_URL=https://your-domain.vercel.app
```

**Notion API 키 발급 방법**
1. [Notion Developers](https://www.notion.so/my-integrations) 접속
2. 새 Integration 생성 → `NOTION_API_KEY` 복사
3. Notion 데이터베이스 → 우측 상단 `...` → `Connections` → 생성한 Integration 연결
4. 데이터베이스 URL에서 ID 복사 → `NOTION_DATABASE_ID`에 입력

### 2. 패키지 설치 및 개발 서버 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

## 주요 명령어

```bash
npm run dev        # 개발 서버 실행 (Turbopack)
npm run build      # 프로덕션 빌드
npm run check-all  # 전체 검사 (lint + type check)
```

## URL 구조

| URL | 설명 |
|-----|------|
| `/` | 홈 - 최근 글 목록 |
| `/posts/[slug]` | 글 상세 페이지 |
| `/category/[category]` | 카테고리별 글 목록 |
| `/search?q=[keyword]` | 검색 결과 |

## Vercel 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. GitHub 저장소를 Vercel에 연결
2. 환경 변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID` 등) 설정
3. Deploy

## 개발 문서

- [PRD (제품 요구사항)](./docs/PRD.md)
- [프로젝트 구조](./docs/guides/project-structure.md)
- [스타일링 가이드](./docs/guides/styling-guide.md)
- [컴포넌트 패턴](./docs/guides/component-patterns.md)
