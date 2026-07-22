import { siteConfig, absoluteUrl } from '../config'
import type { Post } from '../types'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function buildSitemap(posts: Array<Post>): string {
  const urls = [
    { loc: '/', lastmod: undefined as string | undefined },
    { loc: '/blog', lastmod: undefined },
    ...posts.map((p) => ({
      loc: `/blog/${p.slug}`,
      lastmod: (p.updated ?? p.published) ?? undefined,
    })),
    ...[...new Set(posts.map((p) => p.category))].map((c) => ({ loc: `/category/${c}`, lastmod: undefined })),
    ...[...new Set(posts.flatMap((p) => p.tags))].map((t) => ({ loc: `/tag/${t}`, lastmod: undefined })),
  ]
  const body = urls
    .map(
      (u) =>
        `  <url><loc>${esc(absoluteUrl(u.loc))}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export function buildRss(posts: Array<Post>): string {
  const items = posts
    .slice(0, 50)
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(absoluteUrl(`/blog/${p.slug}`))}</link>
      <guid>${esc(absoluteUrl(`/blog/${p.slug}`))}</guid>
      <description>${esc(p.description)}</description>
      ${p.published ? `<pubDate>${new Date(p.published).toUTCString()}</pubDate>` : ''}
    </item>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>${esc(siteConfig.name)}</title>
    <link>${esc(siteConfig.origin)}</link>
    <description>${esc(siteConfig.description)}</description>
${items}
</channel></rss>
`
}

export function buildRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`
}
