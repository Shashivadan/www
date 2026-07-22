/**
 * Prebuild script: fetch markdown from the content GitHub repo, download images,
 * compile to HTML, and write the generated manifest + search index.
 *
 * Runs in CI (daily cron) before `vite build`. Never runs in production.
 *   pnpm fetch-content
 */
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { dirname, join, posix } from 'node:path'
import { Octokit } from '@octokit/core'
import matter from 'gray-matter'
import { contentConfig, siteConfig, IGNORED_PATHS } from '../src/features/blog/config'
import { frontmatterSchema, type Post, type SearchDoc } from '../src/features/blog/types'
import { compileMarkdown } from '../src/features/blog/mdx/compile'
import { buildSitemap, buildRss, buildRobots } from '../src/features/blog/seo/feeds'
import {
  pathToSlug, humanize, firstHeading, firstImage, excerptOf, readingTimeOf,
} from '../src/features/blog/utils/infer'

const { owner, repo, branch, token } = contentConfig
const isProd = process.env.NODE_ENV === 'production'
const octokit = new Octokit(token ? { auth: token } : {})

const OUT_MANIFEST = 'src/generated/posts.json'
const OUT_SEARCH = 'public/search-index.json'
const ASSET_DIR = 'public/blog-assets'

const isIgnored = (path: string) =>
  path.split('/').some((seg) => (IGNORED_PATHS as readonly string[]).includes(seg))

/** http(s):// or protocol-relative // → treat as external, leave untouched. */
const isExternal = (url: string) => /^(https?:)?\/\//.test(url)

/**
 * Resolve an image reference to its final URL:
 * - external (http/protocol-relative) → unchanged
 * - root-absolute (/foo) → unchanged
 * - local relative (./x, ../x) → downloaded public asset path
 */
function resolveAsset(raw: string | null, slug: string): string | null {
  if (!raw) return null
  if (isExternal(raw) || raw.startsWith('/')) return raw
  return `/blog-assets/${slug}/${raw.replace(/^(\.\.?\/)+/, '')}`
}

async function getTree(): Promise<Array<{ path: string; type: string }>> {
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/git/trees/{ref}',
    { owner, repo, ref: branch, recursive: '1' },
  )
  if ((res.data as any).truncated) {
    console.warn('[fetch-content] tree truncated — repo too large for one call')
  }
  return (res.data as any).tree
}

async function getFile(path: string): Promise<Buffer> {
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    { owner, repo, path, ref: branch },
  )
  const data = res.data as any
  if (data.content) return Buffer.from(data.content, data.encoding || 'base64')
  // Large file: fall back to download_url.
  const r = await fetch(data.download_url, token ? { headers: { Authorization: `token ${token}` } } : {})
  return Buffer.from(await r.arrayBuffer())
}

async function downloadImages(folder: string, slug: string, urls: Array<string>) {
  for (const url of [...new Set(urls)]) {
    if (isExternal(url) || url.startsWith('/')) continue // external/absolute: not downloaded
    try {
      const repoPath = posix.normalize(posix.join(folder, url)).replace(/^\/+/, '')
      const localRel = url.replace(/^(\.\.\/)+/, '').replace(/^(\.\/)+/, '')
      const dest = join(ASSET_DIR, slug, localRel)
      await mkdir(dirname(dest), { recursive: true })
      await writeFile(dest, await getFile(repoPath))
    } catch (e) {
      console.warn(`[fetch-content] image failed: ${url} (${slug})`, (e as Error).message)
    }
  }
}

async function main() {
  console.log(`[fetch-content] ${owner}/${repo}@${branch} (prod=${isProd})`)
  await rm(ASSET_DIR, { recursive: true, force: true })

  const tree = await getTree()
  const readmes = tree.filter(
    (n) => n.type === 'blob' && /(^|\/)README\.(md|mdx)$/i.test(n.path) && !isIgnored(n.path),
  )

  const posts: Array<Post> = []
  for (const node of readmes) {
    const folder = dirname(node.path) === '.' ? '' : dirname(node.path)
    const slug = pathToSlug(node.path) || 'home'
    const raw = (await getFile(node.path)).toString('utf8')
    const { data, content } = matter(raw)
    const fm = frontmatterSchema.parse(data)

    if (fm.draft && isProd) continue

    const { html, headings, plain, images } = await compileMarkdown(content, slug)

    // Cover may be an external URL, a root-absolute path, or a local relative
    // path. Local relative covers are downloaded (even if not referenced inline).
    const coverRaw = fm.cover ?? firstImage(content) ?? null
    const coverIsLocal = !!coverRaw && !isExternal(coverRaw) && !coverRaw.startsWith('/')
    await downloadImages(folder, slug, coverIsLocal ? [...images, coverRaw] : images)
    const cover = resolveAsset(coverRaw, slug)

    posts.push({
      slug,
      path: node.path,
      title: fm.title || firstHeading(content) || humanize(slug.split('/').pop() || slug),
      description: fm.description || excerptOf(content),
      excerpt: excerptOf(content),
      cover,
      author: fm.author || siteConfig.author.name,
      category: fm.category || (slug.includes('/') ? slug.split('/')[0] : 'general'),
      tags: fm.tags,
      published: fm.published ? fm.published.toISOString() : null,
      updated: fm.updated ? fm.updated.toISOString() : null,
      readingTime: readingTimeOf(content),
      featured: fm.featured,
      headings,
      html,
      plain,
    })
  }

  posts.sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''))

  await mkdir(dirname(OUT_MANIFEST), { recursive: true })
  await writeFile(OUT_MANIFEST, JSON.stringify(posts, null, 2))

  const docs: Array<SearchDoc> = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    headings: p.headings.map((h) => h.text).join(' '),
    content: p.plain,
  }))
  await mkdir(dirname(OUT_SEARCH), { recursive: true })
  await writeFile(OUT_SEARCH, JSON.stringify(docs))

  await writeFile('public/sitemap.xml', buildSitemap(posts))
  await writeFile('public/rss.xml', buildRss(posts))
  await writeFile('public/robots.txt', buildRobots())

  console.log(`[fetch-content] wrote ${posts.length} posts → ${OUT_MANIFEST}`)
}

main().catch((e) => {
  console.error('[fetch-content] failed:', e)
  process.exit(1)
})
