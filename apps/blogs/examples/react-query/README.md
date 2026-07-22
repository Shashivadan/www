---
title: Getting Started with React Query
description: Data fetching, caching, and synchronization for React apps made simple.
# cover is OPTIONAL. Point it at a local image beside this README, e.g.
#   cover: ./images/cover.png
# If omitted (or the field is deleted), the site auto-uses a deterministic
# placeholder image for this post, so every blog always has a cover.
cover: ./images/cover.png
author: Shashi
published: 2026-07-10
updated: 2026-07-18
tags: [react, tanstack, data-fetching]
category: react
draft: false
featured: true
---

React Query treats server state as a first-class concern. This intro paragraph
is used as the auto-excerpt if `description` is missing.

## Why React Query

Manual `useEffect` + `useState` fetching means writing caching, dedup, and
refetch logic by hand. React Query gives you that for free.

:::note
This whole file is a single blog post. The folder name (`react-query`) becomes
the URL slug: `/blog/react-query`.
:::

:::warning
Never call hooks conditionally. React Query hooks follow the rules of hooks.
:::

## Installation

```bash title="terminal"
pnpm add @tanstack/react-query
```

```tsx title="app.tsx" {3,7-9}
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={client}>
      <Posts />
    </QueryClientProvider>
  )
}
```

## Migrating an old fetch

```diff
- const [data, setData] = useState()
- useEffect(() => { fetch('/api').then(r => r.json()).then(setData) }, [])
+ const { data } = useQuery({ queryKey: ['posts'], queryFn: () => fetch('/api').then(r => r.json()) })
```

## Comparison

| Approach        | Caching | Refetch | Boilerplate |
| --------------- | ------- | ------- | ----------- |
| useEffect       | ❌      | manual  | high        |
| React Query     | ✅      | auto    | low         |

## Checklist

- [x] Install the package
- [x] Wrap app in provider
- [ ] Add devtools

## A diagram

![data flow diagram](./images/flow.png)

> Server state is not client state. Treat it differently. [^1]

[^1]: This is a footnote, rendered at the bottom of the post.
