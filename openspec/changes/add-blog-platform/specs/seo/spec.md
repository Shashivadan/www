## ADDED Requirements

### Requirement: Server-rendered crawlable pages
Every page SHALL be server-rendered/prerendered so its full content and metadata are present in the initial HTML without client JavaScript.

#### Scenario: Content present without JS
- **WHEN** a blog post URL is fetched with JavaScript disabled
- **THEN** the article text, title, and metadata are present in the HTML response

### Requirement: Per-page metadata
Each route SHALL emit a unique `title`, `description`, canonical URL, `robots` directives, and keywords via the route `head()`.

#### Scenario: Post metadata generated
- **WHEN** a blog post renders
- **THEN** its `<title>`, meta description, and canonical URL reflect that post's frontmatter/inference

#### Scenario: Draft/utility pages noindex
- **WHEN** a non-content or search results page renders
- **THEN** appropriate `robots` directives are set

### Requirement: OpenGraph and Twitter cards
Each page SHALL emit OpenGraph and Twitter Card meta tags including title, description, URL, type, and image (post cover or default OG image).

#### Scenario: Post social preview
- **WHEN** a post is shared to a platform reading OG tags
- **THEN** the preview shows the post title, description, and cover image

### Requirement: Structured data (JSON-LD)
The system SHALL inject JSON-LD structured data: `Article` on posts, `BreadcrumbList` on nested pages, and `WebSite` + `Organization` site-wide.

#### Scenario: Article schema on post
- **WHEN** a blog post renders
- **THEN** valid `Article` JSON-LD with headline, dates, author, and image is present

#### Scenario: Breadcrumb schema
- **WHEN** a nested post like `/blog/postgres/indexes` renders
- **THEN** `BreadcrumbList` JSON-LD reflects the path hierarchy

### Requirement: Semantic HTML and heading hierarchy
Each page SHALL use semantic landmarks and contain exactly one H1, with correctly ordered subsequent headings.

#### Scenario: Single H1
- **WHEN** any page renders
- **THEN** it contains exactly one `<h1>` and no heading level is skipped

### Requirement: Sitemap, robots, and RSS
The system SHALL serve `sitemap.xml`, `robots.txt`, and `rss.xml` generated from the manifest with absolute URLs based on the configured site origin.

#### Scenario: Sitemap lists posts
- **WHEN** `sitemap.xml` is requested
- **THEN** it lists every published post, category, and tag URL with last-modified dates

#### Scenario: RSS feed
- **WHEN** `rss.xml` is requested
- **THEN** it returns a valid feed of recent posts with titles, links, and summaries

#### Scenario: robots references sitemap
- **WHEN** `robots.txt` is requested
- **THEN** it allows crawling and references the sitemap URL
