import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/layout/container'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params

  // TODO: Notion API로 글 데이터 조회
  // const post = await getPostBySlug(slug)
  // if (!post || post.status !== '발행됨') notFound()

  if (!slug) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container>
          <div className="py-12">
            {/* TODO: NotionBlockRenderer 컴포넌트로 교체 */}
            <p className="text-muted-foreground">
              슬러그: {slug} - Notion API 연동 후 글 내용이 표시됩니다.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
