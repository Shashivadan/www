import { siteConfig, absoluteUrl } from '../config'
import { coverUrl } from '../utils/cover'
import type { Post } from '../types'

type MetaTag = Record<string, string>
interface HeadResult {
  meta: Array<MetaTag>
  links: Array<Record<string, string>>
  scripts?: Array<{ type: string; children: string }>
}

interface PageMeta {
  title: string
  description?: string
  path: string
  image?: string | null
  type?: 'website' | 'article'
  robots?: string
  keywords?: Array<string>
  jsonLd?: Array<Record<string, unknown>>
}

/** Build TanStack Router `head()` meta/links/scripts for any page. */
export function buildHead(page: PageMeta): HeadResult {
  const title = page.path === '/' ? page.title : `${page.title} · ${siteConfig.name}`
  const description = page.description ?? siteConfig.description
  const url = absoluteUrl(page.path)
  const image = absoluteUrl(page.image || siteConfig.defaultOgImage)

  const meta: Array<MetaTag> = [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: page.robots ?? 'index, follow' },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: page.type ?? 'website' },
    { property: 'og:image', content: image },
    { property: 'og:site_name', content: siteConfig.name },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
  if (page.keywords?.length) meta.push({ name: 'keywords', content: page.keywords.join(', ') })

  return {
    meta,
    links: [{ rel: 'canonical', href: url }],
    scripts: (page.jsonLd ?? []).map((data) => ({
      type: 'application/ld+json',
      children: JSON.stringify(data),
    })),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.origin,
    description: siteConfig.description,
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.origin,
    logo: absoluteUrl(siteConfig.defaultOgImage),
  }
}

export function articleJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: absoluteUrl(coverUrl(post)),
    datePublished: post.published ?? undefined,
    dateModified: post.updated ?? post.published ?? undefined,
    author: { '@type': 'Person', name: post.author },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    keywords: post.tags.join(', '),
  }
}

export function breadcrumbJsonLd(crumbs: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}
