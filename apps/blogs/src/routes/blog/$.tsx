import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { Prose } from '@/features/blog/components/prose'
import { ReadingProgress, BackToTop } from '@/features/blog/components/reading-aids'
import { PrevNext, ShareButtons } from '@/features/blog/components/post-extras'
import { PostCard } from '@/features/blog/components/post-card'
import { getPost, neighbors, relatedPosts } from '@/features/blog/content/manifest'
import { coverUrl } from '@/features/blog/utils/cover'
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildHead,
} from '@/features/blog/seo/meta'

export const Route = createFileRoute('/blog/$')({
  loader: ({ params }) => {
    const post = getPost(params._splat ?? '')
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData: post }) => {
    if (!post) return {}
    const crumbs = [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: post.title, path: `/blog/${post.slug}` },
    ]
    return buildHead({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
      image: coverUrl(post),
      type: 'article',
      keywords: post.tags,
      jsonLd: [articleJsonLd(post), breadcrumbJsonLd(crumbs)],
    })
  },
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData()
  const { prev, next } = neighbors(post.slug)
  const related = relatedPosts(post)

  const dateLabel = post.published ? format(new Date(post.published), 'MMMM d, yyyy') : null

  return (
    <>
      <ReadingProgress />

      <article className="px-4 pb-24 pt-10">
        {/* Back link, subtle, top-left of the reading column */}
        <div className="mx-auto max-w-[680px]">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Blog
          </Link>
        </div>

        {/* Editorial header — centered */}
        <header className="mx-auto mt-10 max-w-[680px] text-center">
          <Link
            to="/category/$category"
            params={{ category: post.category }}
            className="text-sm font-medium capitalize text-muted-foreground hover:text-foreground"
          >
            {post.category}
          </Link>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-[2.5rem] sm:leading-[1.1]">
            {post.title}
          </h1>
        </header>

        {/* Wide cover, breaks out beyond the text column */}
        <div className="mx-auto mt-10 max-w-3xl">
          <img
            src={coverUrl(post)}
            alt={post.title}
            className="aspect-[16/9] w-full rounded-2xl border object-cover"
          />
        </div>

        {/* Author + date, below the cover (Linear-style) */}
        <div className="mx-auto mt-8 flex max-w-[680px] items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="text-foreground">{post.author}</span>
          {dateLabel && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.published ?? undefined}>{dateLabel}</time>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>

        {/* Body — narrow reading column */}
        <div className="mx-auto mt-12 max-w-[680px]">
          <Prose
            html={post.html}
            className="prose-lg prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-muted-foreground prose-li:text-muted-foreground"
          />

          {/* Minimal footer: author/date + copy link */}
          <div className="mt-14 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="text-foreground">{post.author}</span>
              {dateLabel && <> · {dateLabel}</>}
            </div>
            <ShareButtons slug={post.slug} title={post.title} />
          </div>

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  to="/tag/$tag"
                  params={{ tag: t }}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10">
            <PrevNext prev={prev} next={next} />
          </div>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight">Keep reading</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>
        )}
      </article>

      <BackToTop />
    </>
  )
}
