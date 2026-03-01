import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* TODO: Notion API 연동 후 글 목록 컴포넌트로 교체 */}
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">최근 글</h1>
          <p className="text-muted-foreground">
            Notion API 연동 후 글 목록이 표시됩니다.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
