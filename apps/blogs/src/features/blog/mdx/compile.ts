import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import GithubSlugger from 'github-slugger'
import {
  transformerMetaHighlight,
  transformerNotationDiff,
} from '@shikijs/transformers'
import { createHighlighter, type Highlighter } from 'shiki'
import type { Heading } from '../types'

const LANGS = [
  'ts', 'tsx', 'js', 'jsx', 'go', 'rust', 'sql', 'json', 'yaml',
  'docker', 'bash', 'shell', 'css', 'html', 'diff', 'md', 'mdx',
]

let highlighterPromise: Promise<Highlighter> | null = null
/** One highlighter reused across all posts in a build. */
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: LANGS,
    })
  }
  return highlighterPromise
}

/** :::note / :::tip / :::warning / :::danger → styled admonition markup. */
function remarkAdmonitions() {
  const KINDS = new Set(['note', 'tip', 'warning', 'danger', 'info'])
  return (tree: any) => {
    visit(tree, (node: any) => {
      if (node.type !== 'containerDirective') return
      if (!KINDS.has(node.name)) return
      const data = node.data || (node.data = {})
      data.hName = 'div'
      data.hProperties = { className: ['admonition', `admonition-${node.name}`] }
    })
  }
}

/** Rewrite relative image paths to the downloaded public asset path. */
function remarkRewriteImages(slug: string, images: Array<string>) {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      const url: string = node.url || ''
      if (/^(https?:)?\/\//.test(url) || url.startsWith('/')) return
      // normalize ./ and ../ against nothing — flatten to a basename-scoped path
      const clean = url.replace(/^(\.\/)+/, '').replace(/^(\.\.\/)+/, '')
      images.push(url)
      node.url = `/blog-assets/${slug}/${clean}`
    })
  }
}

/** Custom Shiki transformer: filename bar from ```lang title="x". */
const transformerFilename = {
  name: 'filename',
  pre(this: any, node: any) {
    const raw: string = this.options?.meta?.__raw ?? ''
    const m = raw.match(/title="([^"]+)"/)
    if (m) node.properties['data-filename'] = m[1]
  },
}

export interface CompileResult {
  html: string
  headings: Array<Heading>
  plain: string
  /** Original relative image URLs referenced (for the fetcher to download). */
  images: Array<string>
}

export async function compileMarkdown(
  body: string,
  slug: string,
): Promise<CompileResult> {
  const images: Array<string> = []
  const headings: Array<Heading> = []
  const slugger = new GithubSlugger()

  const collectHeadings = () => (tree: any) => {
    visit(tree, 'heading', (node: any) => {
      const text = toString(node)
      headings.push({ id: slugger.slug(text), text, depth: node.depth })
    })
  }

  const highlighter = await getHighlighter()

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkAdmonitions)
    .use(remarkRewriteImages, slug, images)
    .use(collectHeadings)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeShikiFromHighlighter, highlighter, {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      transformers: [
        transformerMetaHighlight(),
        transformerNotationDiff(),
        transformerFilename,
      ],
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(body)

  return { html: String(file), headings, plain: toString(unified().use(remarkParse).parse(body)), images }
}
