import type { Post } from '../types'

/**
 * Cover image for a post: the authored cover if present, otherwise a
 * deterministic placeholder (stable per slug, so it never changes between builds).
 *
 * Default source is picsum.photos. To use anime art instead, swap the base for a
 * seeded endpoint, e.g. `https://picsum.photos` → your preferred provider.
 */
const PLACEHOLDER_BASE = 'https://picsum.photos/seed'

export function coverUrl(post: Pick<Post, 'slug' | 'cover'>, w = 1200, h = 675): string {
  if (post.cover) return post.cover
  return `${PLACEHOLDER_BASE}/${encodeURIComponent(post.slug)}/${w}/${h}`
}
