import { createFileRoute, notFound } from '@tanstack/react-router'
import { PostCard } from '@/features/blog/components/post-card'
import { postsByCategory } from '@/features/blog/content/manifest'
import { buildHead, breadcrumbJsonLd } from '@/features/blog/seo/meta'

export const Route = createFileRoute('/category/$category')({
  loader: ({ params }) => {
    const posts = postsByCategory(params.category)
    if (!posts.length) throw notFound()
    return { category: params.category, posts }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildHead({
          title: `${loaderData.category} articles`,
          description: `Posts in the ${loaderData.category} category.`,
          path: `/category/${loaderData.category}`,
          jsonLd: [
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: loaderData.category, path: `/category/${loaderData.category}` },
            ]),
          ],
        })
      : {},
  component: CategoryPage,
})

function CategoryPage() {
  const { category, posts } = Route.useLoaderData()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold capitalize tracking-tight">{category}</h1>
      <p className="mb-6 text-muted-foreground">{posts.length} post{posts.length === 1 ? '' : 's'}</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
    </div>
  )
}
