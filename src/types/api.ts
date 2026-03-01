/**
 * API 응답 래퍼 타입 정의
 * 성공/에러 응답 형식 통일 (discriminated union 패턴)
 */

import type { BlogPost, Category } from '@/types/blog'

/**
 * API 성공 응답 타입
 */
export type ApiSuccess<T> = {
  success: true
  data: T
}

/**
 * API 에러 응답 타입
 */
export type ApiError = {
  success: false
  /** 에러 메시지 */
  error: string
  /** 에러 코드 (선택적) */
  code?: string
}

/**
 * API 응답 래퍼 타입 (discriminated union)
 * success 필드로 타입 가드 사용 가능
 *
 * @example
 * const result: ApiResponse<BlogPost> = await fetchPost(slug)
 * if (result.success) {
 *   console.log(result.data) // BlogPost
 * } else {
 *   console.error(result.error) // string
 * }
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError

/**
 * 글 목록 응답 타입
 */
export type PostListResponse = ApiResponse<{
  /** 글 목록 */
  posts: BlogPost[]
  /** 전체 글 수 */
  total: number
}>

/**
 * 글 상세 응답 타입
 */
export type PostDetailResponse = ApiResponse<BlogPost>

/**
 * 카테고리 목록 응답 타입
 */
export type CategoryListResponse = ApiResponse<Category[]>
