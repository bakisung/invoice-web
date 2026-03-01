/**
 * Notion API 원본 응답 타입 정의
 * @notionhq/client 패키지 설치 전 자체 타입으로 정의
 * Task 007(Notion API 연동) 시 실제 응답 구조와 대조하여 파싱에 활용
 */

/**
 * Notion select/multi_select 색상 리터럴 타입
 */
export type NotionColor =
  | 'default'
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'green_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background'

/**
 * Notion 텍스트 서식(annotations) 인터페이스
 */
export interface NotionAnnotations {
  /** 굵게 */
  bold: boolean
  /** 기울임 */
  italic: boolean
  /** 취소선 */
  strikethrough: boolean
  /** 밑줄 */
  underline: boolean
  /** 인라인 코드 */
  code: boolean
  /** 텍스트 색상 */
  color: NotionColor
}

/**
 * Notion 리치 텍스트 인터페이스
 * 텍스트 블록의 실제 내용 단위
 */
export interface NotionRichText {
  /** 순수 텍스트 (서식 제거) */
  plain_text: string
  /** 링크 URL (없으면 null) */
  href: string | null
  /** 텍스트 서식 */
  annotations: NotionAnnotations
  /** 리치 텍스트 타입 ('text' | 'mention' | 'equation') */
  type: string
}

/**
 * Notion select/multi_select 옵션 인터페이스
 */
export interface NotionSelectOption {
  /** 옵션 ID */
  id: string
  /** 옵션 이름 */
  name: string
  /** 옵션 색상 */
  color: NotionColor
}

/**
 * Notion 날짜 속성 인터페이스
 */
export interface NotionDateProperty {
  /** 시작일 (ISO 8601) */
  start: string
  /** 종료일 (ISO 8601, 없으면 null) */
  end: string | null
}

/**
 * Notion 파일/이미지 객체 인터페이스
 * 외부 URL 또는 Notion 내부 파일 구분
 */
export interface NotionFileObject {
  /** 파일 타입 */
  type: 'external' | 'file'
  /** 외부 URL 파일 */
  external?: {
    url: string
  }
  /** Notion 내부 파일 (만료 시간 포함) */
  file?: {
    url: string
    expiry_time: string
  }
}

/**
 * Notion 데이터베이스 페이지 속성 인터페이스
 * PRD의 Notion DB 필드 정의와 1:1 대응
 */
export interface NotionPageProperties {
  /** 글 제목 (title 타입) */
  Title: {
    title: NotionRichText[]
  }
  /** 카테고리 (select 타입) */
  Category: {
    select: NotionSelectOption | null
  }
  /** 태그 목록 (multi_select 타입) */
  Tags: {
    multi_select: NotionSelectOption[]
  }
  /** 발행일 (date 타입) */
  Published: {
    date: NotionDateProperty | null
  }
  /** 발행 상태 (select 타입: '초안' | '발행됨') */
  Status: {
    select: NotionSelectOption | null
  }
  /** URL 슬러그 (rich_text 타입) */
  Slug: {
    rich_text: NotionRichText[]
  }
  /** 글 요약 (rich_text 타입) */
  Description: {
    rich_text: NotionRichText[]
  }
  /** 썸네일 이미지 (files 타입) */
  Cover: {
    files: NotionFileObject[]
  }
}

/**
 * Notion 페이지 객체 인터페이스
 * Notion API의 pages.retrieve / databases.query 응답 형식
 */
export interface NotionPageObject {
  /** 페이지 ID */
  id: string
  /** 생성 시각 (ISO 8601) */
  created_time: string
  /** 마지막 수정 시각 (ISO 8601) */
  last_edited_time: string
  /** 페이지 속성 */
  properties: NotionPageProperties
  /** 페이지 커버 이미지 */
  cover: NotionFileObject | null
}

/**
 * Notion 단락(paragraph) 블록 내용
 */
export interface NotionParagraphBlock {
  rich_text: NotionRichText[]
  color: NotionColor
}

/**
 * Notion 제목(heading) 블록 내용
 */
export interface NotionHeadingBlock {
  rich_text: NotionRichText[]
  color: NotionColor
  is_toggleable: boolean
}

/**
 * Notion 코드(code) 블록 내용
 */
export interface NotionCodeBlock {
  rich_text: NotionRichText[]
  language: string
  caption: NotionRichText[]
}

/**
 * Notion 이미지(image) 블록 내용
 */
export interface NotionImageBlock {
  type: 'external' | 'file'
  external?: { url: string }
  file?: { url: string; expiry_time: string }
  caption: NotionRichText[]
}

/**
 * Notion 인용(quote) 블록 내용
 */
export interface NotionQuoteBlock {
  rich_text: NotionRichText[]
  color: NotionColor
}

/**
 * Notion 콜아웃(callout) 블록 내용
 */
export interface NotionCalloutBlock {
  rich_text: NotionRichText[]
  icon: { type: 'emoji'; emoji: string } | { type: 'external'; external: { url: string } }
  color: NotionColor
}

/**
 * Notion 토글(toggle) 블록 내용
 */
export interface NotionToggleBlock {
  rich_text: NotionRichText[]
  color: NotionColor
}

/**
 * Notion 목록 아이템(bulleted/numbered list item) 블록 내용
 */
export interface NotionListItemBlock {
  rich_text: NotionRichText[]
  color: NotionColor
}

/**
 * Notion 블록 객체 인터페이스
 * Notion API의 blocks.retrieve / blocks.children.list 응답 형식
 */
export interface NotionBlockObject {
  /** 블록 ID */
  id: string
  /** 블록 타입 */
  type: string
  /** 자식 블록 포함 여부 */
  has_children: boolean
  /** 단락 블록 데이터 */
  paragraph?: NotionParagraphBlock
  /** heading_1 블록 데이터 */
  heading_1?: NotionHeadingBlock
  /** heading_2 블록 데이터 */
  heading_2?: NotionHeadingBlock
  /** heading_3 블록 데이터 */
  heading_3?: NotionHeadingBlock
  /** 코드 블록 데이터 */
  code?: NotionCodeBlock
  /** 이미지 블록 데이터 */
  image?: NotionImageBlock
  /** 인용 블록 데이터 */
  quote?: NotionQuoteBlock
  /** 콜아웃 블록 데이터 */
  callout?: NotionCalloutBlock
  /** 토글 블록 데이터 */
  toggle?: NotionToggleBlock
  /** 순서 없는 목록 아이템 데이터 */
  bulleted_list_item?: NotionListItemBlock
  /** 순서 있는 목록 아이템 데이터 */
  numbered_list_item?: NotionListItemBlock
}

/**
 * Notion databases.query API 응답 인터페이스
 */
export interface NotionDatabaseQueryResponse {
  /** 결과 페이지 목록 */
  results: NotionPageObject[]
  /** 다음 페이지 커서 (없으면 null) */
  next_cursor: string | null
  /** 다음 페이지 존재 여부 */
  has_more: boolean
}

/**
 * Notion blocks.children.list API 응답 인터페이스
 */
export interface NotionBlockListResponse {
  /** 결과 블록 목록 */
  results: NotionBlockObject[]
  /** 다음 페이지 커서 (없으면 null) */
  next_cursor: string | null
  /** 다음 페이지 존재 여부 */
  has_more: boolean
}
