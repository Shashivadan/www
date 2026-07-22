## ADDED Requirements

### Requirement: Build-time search index
The system SHALL generate a static search index (JSON) from the manifest at build time, covering each post's title, headings, content text, tags, and description.

#### Scenario: Index generated at build
- **WHEN** the app is built
- **THEN** a static search index file is emitted containing an entry per published post

#### Scenario: Draft excluded from index
- **WHEN** a post is `draft: true` in production
- **THEN** it is absent from the search index

### Requirement: Client-side full-text search
The system SHALL load the static index in the browser and perform fast, indexed full-text search with MiniSearch, matching against title, headings, content, tags, and description.

#### Scenario: Query returns ranked results
- **WHEN** the user types a query in the search UI
- **THEN** matching posts are returned ranked by relevance with title and excerpt

#### Scenario: Prefix and fuzzy matching
- **WHEN** the user types a partial or slightly misspelled term
- **THEN** relevant posts still appear via prefix/fuzzy matching

### Requirement: Search UI and route
The system SHALL provide a `/search` page (SSR shell) and a keyboard-accessible command-palette search entry available site-wide.

#### Scenario: Search route renders without JS
- **WHEN** `/search` is fetched without JavaScript
- **THEN** a crawlable shell renders; results populate once the index loads client-side

#### Scenario: Keyboard palette
- **WHEN** the user presses the search shortcut
- **THEN** a command palette opens and is fully keyboard-navigable
