## ADDED Requirements

### Requirement: Folder-based post discovery
The system SHALL treat every folder in the private content repo that contains a `README.md` or `README.mdx` as a published blog post, discovered at build time by fetching the repo's recursive Git tree via `@octokit/core`. Folders without a README, and the paths `.git`, `.github`, `dist`, `node_modules`, SHALL be ignored.

#### Scenario: New folder with README is published
- **WHEN** a folder `react-query/` containing `README.md` exists in the content repo and the daily build runs
- **THEN** a post for that folder appears in the manifest with no application code change

#### Scenario: Folder without README is ignored
- **WHEN** a folder contains only images or components but no `README.md`/`README.mdx`
- **THEN** no post is created for that folder

#### Scenario: Ignored paths are skipped
- **WHEN** the content repo contains `.git`, `.github`, `dist`, or `node_modules` directories
- **THEN** they are excluded from discovery

### Requirement: Folder path to slug mapping
The system SHALL derive a human-readable slug from the folder path, preserving nesting.

#### Scenario: Top-level folder
- **WHEN** the folder is `docker/README.md`
- **THEN** the post slug is `docker` and its URL is `/blog/docker`

#### Scenario: Nested folder
- **WHEN** the folder is `postgres/indexes/README.md`
- **THEN** the post slug is `postgres/indexes` and its URL is `/blog/postgres/indexes`

### Requirement: Frontmatter parsing and validation
The system SHALL parse YAML frontmatter (`title`, `description`, `cover`, `author`, `published`, `updated`, `tags`, `category`, `draft`, `featured`) and validate/normalize it with a Zod schema. Invalid frontmatter SHALL fail the build with a clear error naming the offending file.

#### Scenario: Valid frontmatter parsed
- **WHEN** a README declares `title`, `tags`, and `published` in frontmatter
- **THEN** those values populate the post's manifest entry

#### Scenario: Invalid frontmatter fails build
- **WHEN** a README declares `published` as a non-date value
- **THEN** the build fails and the error names the file and field

### Requirement: Metadata inference fallbacks
When a frontmatter field is absent, the system SHALL infer it: `title` from the first H1 or humanized folder name; `description`/excerpt from the first paragraph; `slug` from the folder path; `readingTime` from content length; `cover` from the first image; `category` from the top-level folder.

#### Scenario: Missing title inferred
- **WHEN** a README has no `title` in frontmatter but starts with `# Understanding Indexes`
- **THEN** the post title is `Understanding Indexes`

#### Scenario: Missing reading time inferred
- **WHEN** a README has no `readingTime` field
- **THEN** the manifest entry includes a computed reading time based on word count

### Requirement: Draft exclusion in production
The system SHALL exclude posts with `draft: true` from the production build manifest, while allowing them in development.

#### Scenario: Draft hidden in production build
- **WHEN** a post has `draft: true` and the app is built for production
- **THEN** the post is absent from the manifest, routes, search index, sitemap, and RSS

### Requirement: Image fetching and asset output
The system SHALL download images referenced by each post from the content repo at build time and write them under a public asset path scoped by slug (`public/blog-assets/<slug>/`), so no runtime token is needed to serve private-repo images.

#### Scenario: Referenced image downloaded
- **WHEN** a README references `./images/demo.png` and the build runs
- **THEN** the image is downloaded to `public/blog-assets/<slug>/demo.png` and served as a static asset

### Requirement: Posts manifest as single source of truth
The system SHALL emit a generated `Post[]` manifest (`src/generated/posts.json`) built from discovered content, consumed by all routes, the search index, sitemap, and RSS generation. The app SHALL contain no content-fetch code and read only the generated manifest.

#### Scenario: Manifest entry shape
- **WHEN** the manifest is built
- **THEN** each entry provides `slug`, `path`, `frontmatter`, `headings`, `readingTime`, `cover`, `category`, `tags`, `excerpt`, and the compiled `html` body
