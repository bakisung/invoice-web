import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

interface Props {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <div className="py-12">
            <h1 className="text-3xl font-bold mb-8">{decodedCategory}</h1>
            {/* TODO: 카테고리별 글 목록 컴포넌트로 교체 */}
            <p className="text-muted-foreground">
              Notion API 연동 후 &quot;{decodedCategory}&quot; 카테고리의 글 목록이
              표시됩니다.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
