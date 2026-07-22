import { createFileRoute } from '@tanstack/react-router'
import { PostCard } from '@/features/blog/components/post-card'
import { BlogSidebar } from '@/features/blog/components/blog-sidebar'
import { EmptyState } from '@/features/blog/components/not-found'
import { latestPosts } from '@/features/blog/content/manifest'
import { buildHead } from '@/features/blog/seo/meta'

export const Route = createFileRoute('/blog/')({
  head: () =>
    buildHead({
      title: 'Blog',
      description: 'All articles.',
      path: '/blog',
    }),
  component: BlogIndex,
})

function BlogIndex() {
  return (
    <div className="mx-auto max-w-7xl gap-10 px-4 py-10 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <BlogSidebar />
        </div>
      </aside>
      <div>
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Blog</h1>
        {latestPosts.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {latestPosts.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        ) : (
          <EmptyState title="No posts yet" hint="Add a folder with a README to publish one." />
        )}
      </div>
    </div>
  )
}
