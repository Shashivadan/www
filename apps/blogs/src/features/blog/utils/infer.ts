import readingTime from 'reading-time'

/** Turn a folder segment into a title: "react-query" → "React Query". */
export function humanize(segment: string): string {
  return segment
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Folder path → URL slug (nesting preserved, README stripped). */
export function pathToSlug(filePath: string): string {
  return filePath
    .replace(/README\.(md|mdx)$/i, '')
    .replace(/^\/+|\/+$/g, '')
}

export function firstHeading(body: string): string | null {
  const m = body.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : null
}

export function firstParagraph(body: string): string {
  const text = body
    .replace(/^---[\s\S]*?---/, '') // strip frontmatter if present
    .replace(/^#{1,6}\s+.*$/gm, '') // drop headings
    .replace(/```[\s\S]*?```/g, '') // drop code fences
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // drop images
    .trim()
  const para = text.split(/\n\s*\n/).find((p) => p.trim().length > 0) ?? ''
  return para.replace(/\s+/g, ' ').replace(/[*_`>#-]/g, '').trim()
}

export function firstImage(body: string): string | null {
  const m = body.match(/!\[[^\]]*\]\(([^)]+)\)/)
  return m ? m[1].trim() : null
}

export function excerptOf(body: string, max = 180): string {
  const p = firstParagraph(body)
  return p.length > max ? `${p.slice(0, max).trimEnd()}…` : p
}

export function readingTimeOf(body: string): string {
  return readingTime(body).text
}
