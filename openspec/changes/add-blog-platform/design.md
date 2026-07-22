## Context

`apps/blogs` is a fresh TanStack Start v1 app (React 19, Vite 8, Nitro, Tailwind v4) with shadcn/ui fully installed and only a `/` route. The goal is a data-driven developer blog where content lives in a **separate private GitHub markdown repo** and any folder with a `README.md`/`README.mdx` becomes a post — publishable by adding a folder (no application code change), refreshed daily.

Forks resolved during exploration:
1. **Content timing** → build-time SSG (Nitro prerender), not runtime SSR.
2. **Content nature** → plain markdown + images, no embedded React components.
3. **Content delivery** → `@octokit/core` fetch in a **build-time prebuild script**, run on a **daily cron**. Not a git submodule, not runtime API.
4. **Trust** → repo is private and owned; markdown is trusted, no sandbox.

These decisions keep all content I/O at build time: no runtime GitHub calls, no prod token, no runtime cache/ETag layer.

## Goals / Non-Goals

**Goals:**
- Zero-code publishing: add a folder with a README to the content repo; the next daily build publishes it.
- SSG/prerendered pages, crawlable without JS, Lighthouse SEO/A11y/Best-Practices 100, strong CWV.
- A single generated manifest (`src/generated/posts.json`) as the source of truth for all pages, search, sitemap, and RSS.
- Fetch + compile isolated in one prebuild script; the app contains no content-fetch code.
- Feature-first architecture under `src/features/blog/*`.

**Non-Goals:**
- Runtime GitHub fetching, caching layer, ETag, or GraphQL.
- Embedded React components in posts / MDX sandboxing (plain markdown, trusted).
- Auto OG-image generation, Mermaid, KaTeX, image zoom/WebP/srcset pipeline, working newsletter (deferred; documented as extension points).
- Authoring UI / CMS — content is edited in the content repo.
- Instant publish — daily cadence (≤24h) is the accepted latency.

## Decisions

### D1 — `@octokit/core` build-time prebuild script → generated manifest
`scripts/fetch-content.ts` runs before `vite build`. It fetches the whole repo tree in one recursive Git-tree call (`GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`), identifies folders containing `README.md`/`README.mdx` (ignoring `.git`, `.github`, `dist`, `node_modules`), fetches each README's raw content, downloads referenced images, compiles markdown, and writes `src/generated/posts.json` + `public/search-index.json`. The app imports the generated JSON.
- **Why:** All network I/O happens once at build with a CI-only token — no prod secret, no rate-limit or latency risk at request time (one authenticated build ≪ 5000 req/hr). A prebuild script → generated JSON is simpler and more deterministic than a Vite plugin doing async fetches. `@octokit/core` is the official, typed, maintained client (chosen over `octonode`).
- **Alternatives:** git submodule/clone (no octokit, but user chose the API client); runtime octokit + 24h cache (needs prod token + a token'd image-proxy route for private-repo images); `import.meta.glob` (requires local files — incompatible with API fetch).

### D2 — Generated posts manifest as single source of truth
`src/generated/posts.json` holds `Post[]`: `{ slug, path, frontmatter, headings[], html, readingTime, cover, category, tags, excerpt, published, updated }`. Every route, the search index, sitemap, and RSS read from it.
- **Why:** One source of truth; pages are pure functions of the manifest; testable without network.

### D3 — Folder path → slug; nested via single splat route
`react-query/README.md` → `/blog/react-query`; `postgres/indexes/README.md` → `/blog/postgres/indexes`. A single `/blog/$` splat route resolves any depth by manifest lookup.
- **Why:** Fully data-driven; no generated per-post route files; nested categories fall out naturally.

### D4 — Frontmatter via gray-matter + Zod + inference
The script parses frontmatter from the raw README string with `gray-matter`, validates/normalizes via a Zod schema. Missing fields inferred: `title` (first H1 or humanized folder name), `description`/`excerpt` (first paragraph), `slug` (folder path), `readingTime` (`reading-time` lib), `cover` (first image), `category` (top-level folder). `draft: true` excluded from the manifest in production.
- **Why:** `gray-matter` parses frontmatter from a plain string (the API returns strings, not files); robust to sparse authoring.

### D5 — Markdown compiled from string via `unified` → HTML
The script compiles each README body with `unified`: `remark-parse` → `remark-gfm` (tables/footnotes/task-lists) → `remark-directive` (+ handler → admonition classed elements `:::note/tip/warning/danger`) → `remark-rehype` → `rehype-slug` → `rehype-autolink-headings` → `@shikijs/rehype` (Shiki, dual light/dark themes) → `rehype-stringify`. Result is an HTML string stored in the manifest. During compile, relative image paths (`./images/x.png`, `../assets/x.png`) are rewritten to the downloaded public path `/blog-assets/<slug>/x.png`. Code-block meta (`title=`, `{1,3-5}`, `diff`) handled in the Shiki transformer.
- **Why:** Content is plain markdown, so no MDX bundler/JSX resolution is needed. A compiled HTML string is the leanest, most SEO-friendly output (server-rendered, near-zero runtime JS). The app renders it via a Prose component (`dangerouslySetInnerHTML`); a small client hydration adds code-block copy buttons; admonitions are styled by CSS classes. Headings are collected during compile for the TOC.
- **Alternative:** compile to React (mdx-bundler / rehype-react) — needed only for interactive embedded components, which are out of scope.

### D6 — SEO as route `head()` + Nitro server routes
Per-route `head()` builds title/description/canonical/OG/Twitter and injects JSON-LD (`Article`, `BreadcrumbList`, `WebSite`, `Organization`). `sitemap.xml`, `rss.xml`, `robots.txt` are Nitro server routes iterating the manifest (absolute URLs from a configured site origin). One H1 per page: the post title is the only H1; body headings start at H2.
- **Why:** SSG/prerender makes everything crawlable; structured data drives rich results.

### D7 — Search: build-time MiniSearch index → static JSON
The prebuild script emits `public/search-index.json` from the manifest (title, headings, content text, tags, description). Client (`/search`, cmdk palette) lazy-loads it and queries MiniSearch in-browser.
- **Why:** No search backend; static, cacheable index; SSR shell keeps `/search` crawlable. MiniSearch chosen over FlexSearch for a smaller API and good fuzzy/prefix defaults.

### D8 — SSG via Nitro prerender, refreshed by daily cron
Prerender config enumerates manifest slugs + static routes → static HTML. Publishing pipeline: **daily cron** → run `scripts/fetch-content.ts` (with `contents:read` token secret) → `vite build` → deploy. New content goes live at the next daily build.
- **Why:** Best Lighthouse/CWV; no runtime content dependency; no prod secrets; daily cadence matches the requirement.

## Risks / Trade-offs

- **≤24h publish latency** (push not live until next daily build) → accepted per the daily requirement. Mitigation/upgrade: add a content-repo push webhook that also triggers the build if faster publishing is later wanted.
- **Private-repo images can't be hot-linked** (raw URLs need a token) → images are downloaded at build to `public/blog-assets/<slug>/` and paths rewritten; no prod token, no image proxy needed.
- **Relative-path rewriting correctness** (`./`, `../`, subfolders) → normalize against the post folder during compile; unit-test the rewrite with `./`, `../assets`, and nested cases.
- **GitHub API rate/limits at build** → one authenticated build uses a recursive tree call + N raw/blob fetches, well under 5000/hr; paginate/backoff if a repo ever exceeds the tree API's entry cap (~100k). `ponytail:` known ceiling, revisit at scale.
- **`dangerouslySetInnerHTML`** → safe here because content is trusted/owned; do not point the pipeline at an untrusted repo without sanitization (`rehype-sanitize`).
- **Shiki build cost** → highlight at build only; reuse a single highlighter instance across posts.
- **JSON-LD correctness** → validate via Google Rich Results test before launch.

## Migration Plan

1. Add dependencies (proposal D-list); add `scripts/fetch-content.ts`; add `contents:read` token as a CI secret + env for site origin, repo owner/name/branch.
2. Land `content-pipeline` (octokit tree → gray-matter → unified compile → `posts.json` + image download) against the real content repo (seed with one post).
3. Build `mdx-rendering` (Prose/CodeBlock/Admonition components + copy hydration) and `ui-shell`, then `content-routing`, then `seo` and `search`.
4. Configure Nitro prerender + a daily cron that runs the script then builds + deploys.
5. Rollback: feature is additive to a scaffold; revert the branch. No data migration.

## Open Questions

- Content repo `owner/name` and default branch.
- Token: fine-grained PAT with `contents:read` (or GitHub App) scoped to the content repo.
- Site origin/base URL for canonical + sitemap + RSS absolute links (env var).
- Default OG image asset until auto-generation is added.
- Author identity source (frontmatter `author` vs a single site-wide author config).
- Where the daily cron lives (GitHub Actions schedule vs host scheduler).
