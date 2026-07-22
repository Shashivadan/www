## ADDED Requirements

### Requirement: Application layout and theming
The system SHALL provide a responsive, mobile-first layout with a sticky top navigation, dark/light theme toggle (persisted), and a documentation-style aesthetic using the installed shadcn/ui components and Tailwind.

#### Scenario: Theme toggle persists
- **WHEN** the user switches between light and dark mode
- **THEN** the choice is applied without flash and persists across reloads

#### Scenario: Responsive layout
- **WHEN** the site is viewed on a mobile viewport
- **THEN** navigation and content adapt to a mobile-first layout

### Requirement: Collapsible searchable sidebar
The system SHALL render a navigation sidebar generated from the content folder structure, collapsible, filterable by text, with the active route highlighted.

#### Scenario: Sidebar reflects folders
- **WHEN** the content repo has nested folders with posts
- **THEN** the sidebar shows a matching collapsible tree

#### Scenario: Active route highlighted
- **WHEN** the user is on a post page
- **THEN** that entry is highlighted in the sidebar

#### Scenario: Sidebar filter
- **WHEN** the user types in the sidebar filter
- **THEN** the tree narrows to matching entries

### Requirement: Reading aids on post pages
The system SHALL provide a sticky table of contents with scroll-spy, a top reading-progress indicator, and a back-to-top control on post pages.

#### Scenario: Reading progress
- **WHEN** the user scrolls through a post
- **THEN** the progress indicator reflects scroll position

#### Scenario: Back to top
- **WHEN** the user activates back-to-top
- **THEN** the page scrolls to the top and focus is managed accessibly

### Requirement: Post and listing cards
The system SHALL provide reusable card components for post listings (cover, title, excerpt, category, tags, reading time, date) used on the homepage, blog index, category, and tag pages.

#### Scenario: Card renders post summary
- **WHEN** a listing renders a post card
- **THEN** it shows cover, title, excerpt, and metadata linking to the post

### Requirement: Loading, empty, and error states
The system SHALL provide loading skeletons, empty states, and error boundaries around content and search regions.

#### Scenario: Empty category
- **WHEN** a category or tag page has no posts
- **THEN** an empty state is shown instead of a blank page

#### Scenario: Render error contained
- **WHEN** a component throws during render
- **THEN** an error boundary shows a fallback without crashing the whole page

### Requirement: Accessibility baseline
The system SHALL support keyboard navigation, visible focus states, ARIA labels, a skip-to-content link, and screen-reader-friendly semantics.

#### Scenario: Skip link
- **WHEN** a keyboard user tabs into the page
- **THEN** a skip-to-content link is available as the first focusable element

#### Scenario: Keyboard operable controls
- **WHEN** the user navigates interactive controls with the keyboard
- **THEN** all controls are reachable, operable, and show focus states
