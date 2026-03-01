import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_BLOG_NAME ?? '개발 블로그',
    template: `%s | ${process.env.NEXT_PUBLIC_BLOG_NAME ?? '개발 블로그'}`,
  },
  description: 'Notion을 CMS로 활용한 개인 기술 블로그',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BLOG_URL ?? 'http://localhost:3000'
  ),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
