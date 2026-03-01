/**
 * 블로그 도메인 핵심 타입 정의
 * PRD 섹션 7 데이터 모델 기반
 */

/** 글 발행 상태 */
export type PostStatus = '초안' | '발행됨'

/**
 * Notion 블록 타입 유니온
 * 지원하는 10가지 블록 타입
 */
export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'code'
  | 'image'
  | 'quote'
  | 'divider'
  | 'callout'
  | 'toggle'

/**
 * Notion 블록 인터페이스
 * content가 string이면 텍스트 블록, NotionBlock[]이면 중첩 블록(toggle 등)
 */
export interface NotionBlock {
  /** Notion 블록 고유 ID */
  id: string
  /** 블록 타입 */
  type: BlockType
  /** 블록 내용 — 텍스트 또는 중첩 블록 배열 */
  content: string | NotionBlock[]
  /** 코드 블록 언어 (type이 'code'일 때 사용) */
  language?: string
  /** 체크박스 완료 여부 (type이 'to_do'일 때 사용) */
  checked?: boolean
}

/**
 * 블로그 게시물 인터페이스
 * Notion 데이터베이스 페이지와 1:1 대응
 */
export interface BlogPost {
  /** Notion 페이지 ID */
  id: string
  /** URL용 고유 식별자 (영문, 하이픈) */
  slug: string
  /** 글 제목 */
  title: string
  /** 글 요약 (SEO 메타 설명용) */
  description: string
  /** 카테고리 이름 */
  category: string
  /** 태그 목록 */
  tags: string[]
  /** 발행일 (ISO 8601 형식) */
  publishedAt: string
  /** 발행 상태 */
  status: PostStatus
  /** 썸네일 이미지 URL (없으면 기본 이미지 사용) */
  cover?: string
  /** 본문 블록 목록 */
  content: NotionBlock[]
}

/**
 * 카테고리 인터페이스
 * Notion DB에서 동적으로 추출
 */
export interface Category {
  /** 카테고리 이름 */
  name: string
  /** 해당 카테고리 글 수 */
  count: number
  /** Notion select 색상 */
  color: string
}
