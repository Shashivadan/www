import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { useSearch } from '@/features/blog/search/use-search'
import { buildHead } from '@/features/blog/seo/meta'

export const Route = createFileRoute('/search')({
  head: () =>
    buildHead({
      title: 'Search',
      description: 'Search all articles.',
      path: '/search',
      robots: 'noindex, follow',
    }),
  component: SearchPage,
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const { search, ready } = useSearch()
  const results = search(query)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Search</h1>
      <Input
        type="search"
        autoFocus
        placeholder={ready ? 'Search posts…' : 'Loading index…'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search posts"
      />
      <ul className="mt-6 space-y-2">
        {results.map((r) => (
          <li key={r.slug}>
            <Link
              to="/blog/$"
              params={{ _splat: r.slug }}
              className="block rounded-lg border p-4 hover:bg-accent"
            >
              <div className="font-medium">{r.title}</div>
              <div className="line-clamp-2 text-sm text-muted-foreground">{r.description}</div>
            </Link>
          </li>
        ))}
        {query && ready && !results.length && (
          <li className="text-muted-foreground">No results for “{query}”.</li>
        )}
      </ul>
    </div>
  )
}
