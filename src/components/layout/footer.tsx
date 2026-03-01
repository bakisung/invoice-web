import { Container } from './container'

const BLOG_NAME = process.env.NEXT_PUBLIC_BLOG_NAME ?? '개발 블로그'

export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {BLOG_NAME}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
