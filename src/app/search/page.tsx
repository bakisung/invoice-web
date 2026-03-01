import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const keyword = q?.trim() ?? ''

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <div className="py-12">
            <h1 className="text-3xl font-bold mb-8">검색</h1>
            {keyword ? (
              <div>
                <p className="text-muted-foreground mb-6">
                  &quot;{keyword}&quot; 검색 결과
                </p>
                {/* TODO: 검색 결과 글 목록 컴포넌트로 교체 */}
                <p className="text-muted-foreground">
                  Notion API 연동 후 검색 결과가 표시됩니다.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">검색어를 입력해주세요.</p>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
