## Why

The `blogs` app is a bare TanStack Start scaffold (only `/` and shadcn UI installed). We want a production-grade developer blog that renders posts from a **private GitHub markdown repository**, refreshes content on a daily schedule, publishes new posts by adding a folder (no application code change), and ships SSG pages that hit Lighthouse 100 for SEO/Accessibility/Best-Practices with excellent Core Web Vitals.

## What Changes

- Content lives in a **separate private GitHub repo** of plain markdown (+ images). A **build-time prebuild script** uses `@octokit/core` to fetch it; a **daily cron** runs the script + build + deploy. No runtime GitHub calls, no prod token.
- Any folder containing `README.md`/`README.mdx` becomes a blog; folder path becomes the URL slug. Adding a folder → next daily build publishes it — no application code change (≤24h latency).
- The prebuild script (`scripts/fetch-content.ts`): lists the repo tree in one recursive Git-tree call, fetches each README's raw content, downloads referenced images to `public/blog-assets/<slug>/`, compiles markdown, and writes a generated manifest (`src/generated/posts.json`) plus a static search index (`public/search-index.json`). The app itself contains **no content-fetch code** — it reads the generated manifest.
- Markdown compiled from string via a `unified` pipeline (remark-gfm tables/footnotes/task-lists, remark-directive admonitions, rehype-slug/autolink TOC anchors, Shiki code blocks) to an HTML string stored in the manifest. Content is plain markdown — **no embedded React components**.
- Relative image paths (`./images/x.png`) are rewritten during compile to the downloaded public asset path.
- YAML frontmatter parsed with `gray-matter` and Zod-validated, with inference fallbacks for `title`, `description`, `slug`, `readingTime`, `cover`, `category`.
- Routes: `/`, `/blog`, `/blog/$` (nested splat), `/category/$`, `/tag/$`, `/search`, 404 — all data-driven from the generated manifest.
- Rendering: post body rendered as HTML (`dangerouslySetInnerHTML` in a Prose component); a small client hydration adds code-block copy buttons; admonitions are directive-generated classed elements styled by CSS.
- SEO pipeline: per-route meta + OpenGraph + Twitter cards, JSON-LD (Article/Breadcrumb/Website/Organization), plus `sitemap.xml`, `rss.xml`, `robots.txt` server routes from the manifest.
- Client search via MiniSearch over the build-time static JSON index (title/headings/content/tags/description).
- UI shell: collapsible+searchable sidebar, sticky TOC, reading progress, prev/next, related posts, breadcrumbs, back-to-top, cards, existing dark/light theme.
- **Deferred (out of scope, documented):** auto OG-image generation, Mermaid, KaTeX, image zoom/WebP/srcset optimization, newsletter, runtime GitHub service, GitHub GraphQL, embedded React components in posts.

## Capabilities

### New Capabilities
- `content-pipeline`: `@octokit/core` build-time discovery via the recursive Git tree, folder→slug mapping, `gray-matter` frontmatter parsing (Zod), metadata inference, image download, and the generated posts manifest consumed by every page.
- `mdx-rendering`: the `unified` markdown compile chain, Shiki code blocks, directive/admonition components, image handling with path rewriting, and prose styling.
- `content-routing`: home, `/blog`, nested `/blog/$` splat, `/category/$`, `/tag/$`, `/search`, and 404 — all derived from the manifest.
- `seo`: per-route metadata, structured data (JSON-LD), and `sitemap.xml` / `rss.xml` / `robots.txt` generation.
- `search`: build-time MiniSearch index generation and the client-side search UI.
- `ui-shell`: layout, sidebar, TOC, reading progress, prev/next, related posts, breadcrumbs, back-to-top, post/listing cards, and theming.

### Modified Capabilities
<!-- None — greenfield app, no existing specs. -->

## Impact

- **App:** `apps/blogs` — new `scripts/fetch-content.ts` (octokit + unified compile), `src/generated/posts.json` (generated), `src/features/blog/*` (manifest reader, mdx render components, search, seo, types, utils), new route files, layout components. Existing `/` route replaced by homepage.
- **Repo/CI:** no submodule. CI/daily cron runs `scripts/fetch-content.ts` (with a `contents:read` token secret) before `vite build`; Nitro prerender enumerates manifest slugs. Content-repo push publishes at next daily build.
- **Dependencies (new):** `@octokit/core`, `gray-matter`, `unified`, `remark-parse`, `remark-gfm`, `remark-directive`, `remark-rehype`, `rehype-slug`, `rehype-autolink-headings`, `@shikijs/rehype` (Shiki), `rehype-stringify`, `reading-time`, `minisearch`, `zod`. Existing shadcn/ui, next-themes, cmdk, lucide, date-fns reused.
- **No runtime secrets** in the deployed app; the content read token lives only in CI.
