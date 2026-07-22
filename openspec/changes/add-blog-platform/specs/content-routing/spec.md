## ADDED Requirements

### Requirement: Homepage
The system SHALL render a landing page at `/` with a hero, featured posts, latest posts, recently updated posts, category list, popular tags, a search entry point, a newsletter placeholder, and a GitHub repository link — all derived from the manifest.

#### Scenario: Homepage lists posts
- **WHEN** the manifest contains published posts
- **THEN** `/` shows latest and featured sections populated from the manifest

#### Scenario: Featured selection
- **WHEN** posts have `featured: true`
- **THEN** they appear in the featured section

### Requirement: Blog index and post routes
The system SHALL serve a `/blog` index listing all posts and a `/blog/$` splat route resolving any post by its (possibly nested) slug.

#### Scenario: Post renders at nested slug
- **WHEN** the user visits `/blog/postgres/indexes`
- **THEN** the matching post renders with its compiled content

#### Scenario: Unknown slug 404s
- **WHEN** the user visits `/blog/does-not-exist`
- **THEN** a 404 page is shown

### Requirement: Blog post page composition
Each post page SHALL include title (single H1), author, publish date, last-updated date, reading time, category, tags, cover image, sticky table of contents, reading progress indicator, previous/next navigation, related posts, share buttons, copy-link, breadcrumbs, and back-to-top.

#### Scenario: Post metadata displayed
- **WHEN** a post with author, dates, category, and tags renders
- **THEN** all of those are displayed in the post header

#### Scenario: Prev/next navigation
- **WHEN** a post has neighbors in the manifest order
- **THEN** previous and next article links are shown

#### Scenario: Table of contents tracks headings
- **WHEN** a post has H2/H3 headings
- **THEN** a sticky TOC lists them and highlights the active section on scroll

### Requirement: Category and tag pages
The system SHALL generate `/category/$` and `/tag/$` pages listing all posts in that category/tag, derived from the manifest.

#### Scenario: Category page
- **WHEN** the user visits `/category/react`
- **THEN** all posts categorized `react` are listed

#### Scenario: Tag page
- **WHEN** the user visits `/tag/typescript`
- **THEN** all posts tagged `typescript` are listed

### Requirement: 404 page
The system SHALL render a styled 404 page for unmatched routes and unknown slugs/categories/tags.

#### Scenario: Unmatched route
- **WHEN** the user visits a path with no matching route or manifest entry
- **THEN** the 404 page renders with navigation back to the site
