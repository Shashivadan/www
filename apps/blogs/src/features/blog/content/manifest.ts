import raw from '@/generated/posts.json'
import type { Post } from '../types'

export const posts = raw as Array<Post>

export const bySlug = new Map(posts.map((p) => [p.slug, p]))
export const getPost = (slug: string) => bySlug.get(slug)

export const featuredPosts = posts.filter((p) => p.featured)
export const latestPosts = posts // already sorted by published desc

export const recentlyUpdated = [...posts]
  .filter((p) => p.updated)
  .sort((a, b) => (b.updated ?? '').localeCompare(a.updated ?? ''))

function groupCount(pick: (p: Post) => Array<string>) {
  const map = new Map<string, number>()
  for (const p of posts) for (const key of pick(p)) map.set(key, (map.get(key) ?? 0) + 1)
  return [...map.entries()].map(([name, count]) => ({ name, count }))
}

export const categories = groupCount((p) => [p.category]).sort((a, b) => b.count - a.count)
export const tags = groupCount((p) => p.tags).sort((a, b) => b.count - a.count)

export const postsByCategory = (category: string) =>
  posts.filter((p) => p.category.toLowerCase() === category.toLowerCase())

export const postsByTag = (tag: string) =>
  posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))

/** Prev/next in published order. */
export function neighbors(slug: string) {
  const i = posts.findIndex((p) => p.slug === slug)
  return {
    prev: i > 0 ? posts[i - 1] : null,
    next: i >= 0 && i < posts.length - 1 ? posts[i + 1] : null,
  }
}

/** Related by shared tags, then category. */
export function relatedPosts(post: Post, limit = 3): Array<Post> {
  return posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({
      p,
      score:
        p.tags.filter((t) => post.tags.includes(t)).length * 2 +
        (p.category === post.category ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p)
}

/** Nested tree for the sidebar, grouped by category. */
export function sidebarTree() {
  return categories.map((c) => ({
    category: c.name,
    items: postsByCategory(c.name).map((p) => ({ slug: p.slug, title: p.title })),
  }))
}
