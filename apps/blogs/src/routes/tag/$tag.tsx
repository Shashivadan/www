import { createFileRoute, notFound } from '@tanstack/react-router'
import { PostCard } from '@/features/blog/components/post-card'
import { postsByTag } from '@/features/blog/content/manifest'
import { buildHead, breadcrumbJsonLd } from '@/features/blog/seo/meta'

export const Route = createFileRoute('/tag/$tag')({
  loader: ({ params }) => {
    const posts = postsByTag(params.tag)
    if (!posts.length) throw notFound()
    return { tag: params.tag, posts }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildHead({
          title: `#${loaderData.tag}`,
          description: `Posts tagged ${loaderData.tag}.`,
          path: `/tag/${loaderData.tag}`,
          jsonLd: [
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: `#${loaderData.tag}`, path: `/tag/${loaderData.tag}` },
            ]),
          ],
        })
      : {},
  component: TagPage,
})

function TagPage() {
  const { tag, posts } = Route.useLoaderData()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">#{tag}</h1>
      <p className="mb-6 text-muted-foreground">{posts.length} post{posts.length === 1 ? '' : 's'}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
