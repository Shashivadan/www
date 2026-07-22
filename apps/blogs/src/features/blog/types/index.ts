import { z } from 'zod'

/** Raw YAML frontmatter as authored — every field optional; inference fills gaps. */
export const frontmatterSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  cover: z.string().optional(),
  author: z.string().optional(),
  published: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
})

export type Frontmatter = z.infer<typeof frontmatterSchema>

export interface Heading {
  id: string
  text: string
  depth: number
}

/** A fully resolved post as stored in the generated manifest. */
export interface Post {
  /** URL slug derived from folder path, e.g. "postgres/indexes". */
  slug: string
  /** Original repo folder path. */
  path: string
  title: string
  description: string
  excerpt: string
  cover: string | null
  author: string
  category: string
  tags: Array<string>
  /** ISO strings (JSON-serializable). */
  published: string | null
  updated: string | null
  readingTime: string
  featured: boolean
  headings: Array<Heading>
  /** Compiled, syntax-highlighted HTML body. */
  html: string
  /** Plain-text body used for search indexing. */
  plain: string
}

/** Lightweight entry for the client search index. */
export interface SearchDoc {
  slug: string
  title: string
  description: string
  tags: Array<string>
  headings: string
  content: string
}
