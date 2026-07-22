import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  MinimalCard,
  MinimalCardImage,
} from '@/components/ui/minimal-card'
import { coverUrl } from '../utils/cover'
import type { Post } from '../types'

export function PostCard({ post }: { post: Post }) {
  return (
    <MinimalCard className="group flex h-full flex-col transition-transform duration-200 hover:-translate-y-1">
      <Link to="/blog/$" params={{ _splat: post.slug }} aria-label={post.title}>
        <MinimalCardImage src={coverUrl(post, 800, 450)} alt={post.title} className="mb-3 h-40" />
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Link
            to="/category/$category"
            params={{ category: post.category }}
            className="font-medium uppercase tracking-wide text-foreground/70 hover:text-foreground"
          >
            {post.category}
          </Link>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
          {post.published && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.published}>{format(new Date(post.published), 'MMM d, yyyy')}</time>
            </>
          )}
        </div>

        <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight">
          <Link
            to="/blog/$"
            params={{ _splat: post.slug }}
            className="decoration-2 underline-offset-4 group-hover:underline"
          >
            {post.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Link key={tag} to="/tag/$tag" params={{ tag }}>
              <Badge variant="secondary" className="rounded-full text-xs font-normal">{tag}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </MinimalCard>
  )
}
