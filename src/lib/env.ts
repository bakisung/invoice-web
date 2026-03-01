import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // Notion API 인증 (서버 전용 - 클라이언트에 노출 금지)
  NOTION_API_KEY: z.string().optional(),
  NOTION_DATABASE_ID: z.string().optional(),
  // 블로그 메타정보 (공개)
  NEXT_PUBLIC_BLOG_NAME: z.string().default('개발 블로그'),
  NEXT_PUBLIC_BLOG_URL: z.string().default('http://localhost:3000'),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
  NEXT_PUBLIC_BLOG_NAME: process.env.NEXT_PUBLIC_BLOG_NAME,
  NEXT_PUBLIC_BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL,
})

export type Env = z.infer<typeof envSchema>
