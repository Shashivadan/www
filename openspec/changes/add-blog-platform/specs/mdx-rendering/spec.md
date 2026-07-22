## ADDED Requirements

### Requirement: Markdown compilation to HTML
The system SHALL compile each fetched `README.md`/`README.mdx` body at build time via a `unified` (remark/rehype) pipeline into an HTML string stored in the manifest. Content is plain markdown; the app renders the HTML in a Prose component. Embedded React components in posts are out of scope.

#### Scenario: Markdown compiled to HTML
- **WHEN** a README body is compiled at build time
- **THEN** the manifest entry contains a server-renderable HTML string for the post body

#### Scenario: Relative image path rewritten
- **WHEN** a README references `![demo](./images/demo.png)`
- **THEN** the compiled HTML points at the downloaded asset `/blog-assets/<slug>/demo.png`

#### Scenario: Parent-relative path rewritten
- **WHEN** a README references `![x](../assets/x.png)`
- **THEN** the path is normalized against the post folder and rewritten to the downloaded public asset

### Requirement: GitHub-Flavored Markdown features
The system SHALL support tables, footnotes, task lists, strikethrough, and autolinks via remark-gfm.

#### Scenario: Table renders
- **WHEN** a README contains a GFM pipe table
- **THEN** it renders as a styled HTML table

#### Scenario: Task list renders
- **WHEN** a README contains `- [x] done` / `- [ ] todo`
- **THEN** it renders as checkboxes

### Requirement: Admonitions via directives
The system SHALL render container directives (`:::note`, `:::tip`, `:::warning`, `:::danger`) as styled admonition components.

#### Scenario: Note admonition
- **WHEN** a README contains `:::note ... :::`
- **THEN** it renders as a styled note callout with an icon and accessible role

### Requirement: Shiki code blocks
The system SHALL highlight fenced code blocks at build time with Shiki, supporting ts, tsx, js, jsx, go, rust, sql, json, yaml, docker, bash, shell, css, html, and diff, with no runtime highlighting cost.

#### Scenario: Language highlighting
- **WHEN** a README has a ```` ```tsx ```` fenced block
- **THEN** the output is server-rendered, syntax-highlighted HTML themed for light and dark

#### Scenario: Filename and line highlight meta
- **WHEN** a fence declares `tsx title="app.tsx" {2,4-6}`
- **THEN** the block shows the filename `app.tsx` and highlights lines 2 and 4–6

#### Scenario: Diff highlighting
- **WHEN** a fence uses the `diff` language with `+`/`-` lines
- **THEN** added and removed lines render with distinct styling

### Requirement: Code block copy button
Each code block SHALL provide an accessible copy-to-clipboard button.

#### Scenario: Copy code
- **WHEN** the user activates the copy button on a code block
- **THEN** the block's source text is copied to the clipboard and success feedback is shown

### Requirement: Media and typography components
The system SHALL map MDX elements to styled components including images (lazy-loaded, with `width`/`height` to avoid layout shift, required alt text, optional caption), videos, blockquotes, and headings with anchor links.

#### Scenario: Image lazy loads with dimensions
- **WHEN** a post renders an image
- **THEN** it uses `loading="lazy"`, has `alt` text, and reserves space via width/height

#### Scenario: Heading anchor
- **WHEN** a post renders an H2/H3
- **THEN** it has a slug `id` and a clickable anchor link
