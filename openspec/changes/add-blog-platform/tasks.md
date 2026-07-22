## 1. Setup & dependencies

- [x] 1.1 Install deps: `@octokit/core`, `gray-matter`, `unified`, `remark-parse`, `remark-gfm`, `remark-directive`, `remark-rehype`, `rehype-slug`, `rehype-autolink-headings`, `@shikijs/rehype`, `rehype-stringify`, `reading-time`, `minisearch`, `zod`
- [x] 1.2 Add site/content config module: site origin, content repo `owner/name/branch`, GitHub repo link, default OG image, author — from env with defaults
- [x] 1.3 Add `GITHUB_TOKEN` (contents:read) handling for the prebuild script; document CI secret, keep it out of the app bundle
- [x] 1.4 Create `src/features/blog/` structure: `content/` (manifest reader), `mdx/` (render components), `search/`, `seo/`, `components/`, `hooks/`, `types/`, `utils/`; add `src/generated/` (gitignored) for `posts.json`
- [x] 1.5 Wire scripts: `fetch-content` runs `scripts/fetch-content.ts`; `build` runs `fetch-content` then `vite build`

## 2. Content pipeline (prebuild script)

- [x] 2.1 Define `types/` — `Post`, `Frontmatter`, `Heading`, and Zod frontmatter schema
- [x] 2.2 `scripts/fetch-content.ts`: `@octokit/core` fetch recursive Git tree; select folders with `README.{md,mdx}`; ignore `.git`/`.github`/`dist`/`node_modules`
- [x] 2.3 Fetch each README raw content; parse frontmatter + body with `gray-matter`
- [x] 2.4 Folder-path → slug mapping (nested preserved)
- [x] 2.5 Download referenced images to `public/blog-assets/<slug>/`; build a relative→public path map
- [x] 2.6 Metadata inference (title, description/excerpt, readingTime, cover, category) with frontmatter precedence
- [x] 2.7 Emit `src/generated/posts.json` (manifest incl. compiled html + headings); exclude `draft: true` in production; sort by published date
- [x] 2.8 Manifest reader in `features/blog/content/` + derived category/tag indexes
- [x] 2.9 Test: run script against a fixture (mocked octokit) — assert slug mapping, inference, draft exclusion, image path rewrite

## 3. Markdown rendering

- [x] 3.1 `unified` compile pipeline: remark-parse → gfm → directive → remark-rehype → rehype-slug → autolink → `@shikijs/rehype` → rehype-stringify; single reused Shiki highlighter (dual light/dark)
- [x] 3.2 Relative image path rewrite step (`./`, `../`, nested) normalized against post folder → `/blog-assets/<slug>/*`
- [x] 3.3 Code-block meta in Shiki transformer: filename (`title=`), highlighted lines (`{1,3-5}`), diff, line numbers
- [x] 3.4 remark-directive handler → admonition classed elements (`:::note/tip/warning/danger`) + CSS styling
- [x] 3.5 Collect headings during compile → manifest `headings[]` for TOC
- [x] 3.6 `Prose` component renders manifest `html`; client hydration adds accessible code-block copy buttons
- [x] 3.7 Prose/typography styling (tables, blockquotes, lists, links, lazy images with dimensions, heading anchors)
- [x] 3.8 Verify a real post renders end-to-end (code, table, admonition, image)

## 4. UI shell

- [x] 4.1 Root layout: sticky nav, theme toggle (already have next-themes), skip-to-content link, footer with GitHub link
- [x] 4.2 Collapsible + filterable sidebar from folder tree, active-route highlight (use shadcn sidebar)
- [x] 4.3 Sticky TOC with scroll-spy + reading-progress bar + back-to-top
- [x] 4.4 Post/listing card component + section components (featured, latest, recently-updated)
- [x] 4.5 Loading skeletons, empty states, error boundary wrapper
- [x] 4.6 Accessibility pass: focus states, ARIA labels, keyboard operability

## 5. Routing

- [x] 5.1 Replace `/` with homepage (hero, featured, latest, recently-updated, categories, popular tags, search entry, newsletter placeholder, GitHub link)
- [x] 5.2 `/blog` index listing all posts
- [x] 5.3 `/blog/$` splat route: manifest lookup, render post w/ full header (author, dates, reading time, category, tags, cover), breadcrumbs, prev/next, related posts, share/copy-link
- [x] 5.4 `/category/$` and `/tag/$` list pages
- [x] 5.5 404 / not-found page
- [x] 5.6 Related-posts logic (shared tags/category) + prev/next from manifest order

## 6. Search

- [x] 6.1 Prebuild script emits `public/search-index.json` (title/headings/content/tags/description) from manifest
- [x] 6.2 Client search hook: lazy-load index, query MiniSearch with prefix/fuzzy
- [x] 6.3 `/search` route (SSR shell + client results)
- [x] 6.4 Site-wide cmdk command palette with keyboard shortcut
- [ ] 6.5 Test: index contains expected fields and excludes drafts

## 7. SEO

- [x] 7.1 Metadata builder: per-route title/description/canonical/robots/keywords via `head()`
- [x] 7.2 OpenGraph + Twitter card tags (post cover or default OG image)
- [x] 7.3 JSON-LD helpers: Article, BreadcrumbList, WebSite, Organization; inject per route
- [x] 7.4 Enforce single H1 (post title) + heading hierarchy (body starts at H2)
- [x] 7.5 `sitemap.xml` server route from manifest (posts, categories, tags, lastmod)
- [x] 7.6 `rss.xml` server route (recent posts)
- [x] 7.7 `robots.txt` server route referencing sitemap

## 8. Build, prerender & daily refresh

- [x] 8.1 Configure Nitro prerender to enumerate manifest slugs + static routes
- [x] 8.2 CI: run `fetch-content` (with `GITHUB_TOKEN` secret) before `vite build`; ensure `src/generated/` + `public/blog-assets/` produced
- [x] 8.3 Daily cron (GitHub Actions schedule or host scheduler) → fetch-content → build → deploy
- [x] 8.4 Verify production build: pages render without JS, images load, sitemap/rss/robots valid, drafts excluded
- [ ] 8.5 Lighthouse check on a post page (SEO/A11y/Best-Practices 100, Performance 95+); record and fix regressions
