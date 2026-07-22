import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PostCard } from '@/features/blog/components/post-card'
import {
  categories,
  featuredPosts,
  latestPosts,
  tags,
} from '@/features/blog/content/manifest'
import { buildHead, organizationJsonLd, websiteJsonLd } from '@/features/blog/seo/meta'
import { siteConfig } from '@/features/blog/config'

export const Route = createFileRoute('/')({
  head: () =>
    buildHead({
      title: siteConfig.name,
      description: siteConfig.description,
      path: '/',
      jsonLd: [websiteJsonLd(), organizationJsonLd()],
    }),
  component: Home,
})

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {href && (
          <Link to={href} className="text-sm text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <section className="border-b py-14 sm:py-20">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
        <div className="mt-8 flex gap-3">
          <Button render={<Link to="/blog" />}>
            Read the blog <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" render={<Link to="/search" />}>Search</Button>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <Section title="Featured">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </Section>
      )}

      <Section title="Latest" href="/blog">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.slice(0, 6).map((p) => <PostCard key={p.slug} post={p} />)}
        </div>
      </Section>



      <div className="mt-14 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link key={c.name} to="/category/$category" params={{ category: c.name }}>
                <Badge variant="outline" className="capitalize">{c.name} ({c.count})</Badge>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Popular tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 12).map((t) => (
              <Link key={t.name} to="/tag/$tag" params={{ tag: t.name }}>
                <Badge variant="secondary">{t.name}</Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>


    </div>
  )
}
