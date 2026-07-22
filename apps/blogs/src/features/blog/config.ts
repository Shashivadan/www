/**
 * Site + content configuration. All values come from env with sane defaults so
 * the app builds without secrets; real values are supplied at build time.
 *
 * Content-repo values are only read by the prebuild script (scripts/fetch-content.ts),
 * never shipped to the client. Site values are safe to expose.
 */

// Read from Vite's statically-replaced import.meta.env (client + SSR bundles)
// first, then process.env (the Node prebuild script, where import.meta.env is absent).
const env = (key: string, fallback = '') => {
  const viteEnv = (import.meta as any).env?.[key]
  if (viteEnv !== undefined && viteEnv !== '') return viteEnv as string
  const nodeEnv = typeof process !== 'undefined' ? process.env[key] : undefined
  return nodeEnv ?? fallback
}

export const siteConfig = {
  name: env('VITE_SITE_NAME', 'Dev Blog'),
  description: env(
    'VITE_SITE_DESCRIPTION',
    'A developer blog rendered from markdown.',
  ),
  /** Absolute origin, no trailing slash. Used for canonical URLs, sitemap, RSS, OG. */
  origin: env('VITE_SITE_ORIGIN', 'http://localhost:3001').replace(/\/$/, ''),
  /** Public link to the content/source repo shown in the UI. */
  repoUrl: env('VITE_REPO_URL', 'https://github.com/owner/repo'),
  /** Default OG/social image path, served from /public. */
  defaultOgImage: env('VITE_DEFAULT_OG_IMAGE', '/og-default.png'),
  author: {
    name: env('VITE_AUTHOR_NAME', 'Anonymous'),
    url: env('VITE_AUTHOR_URL', ''),
  },
} as const

/** Content-repo settings — build-time only (prebuild script). */
export const contentConfig = {
  owner: env('CONTENT_REPO_OWNER', 'owner'),
  repo: env('CONTENT_REPO_NAME', 'repo'),
  branch: env('CONTENT_REPO_BRANCH', 'main'),
  /** Optional; required for private repos, recommended for public (rate limit). */
  token: env('GITHUB_TOKEN', ''),
} as const

/** Folder/paths never treated as blog content. */
export const IGNORED_PATHS = ['.git', '.github', 'dist', 'node_modules'] as const

export const absoluteUrl = (path: string) =>
  /^https?:\/\//.test(path)
    ? path
    : `${siteConfig.origin}${path.startsWith('/') ? '' : '/'}${path}`
