import { useEffect, useMemo, useRef, useState } from 'react'
import MiniSearch from 'minisearch'
import type { SearchDoc } from '../types'

export interface SearchResult {
  slug: string
  title: string
  description: string
}

/** Lazy-loads the static search index and returns a query function. */
export function useSearch() {
  const engine = useRef<MiniSearch | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((docs: Array<SearchDoc>) => {
        if (cancelled) return
        const ms = new MiniSearch({
          fields: ['title', 'description', 'headings', 'content', 'tags'],
          storeFields: ['slug', 'title', 'description'],
        })
        ms.addAll(docs.map((d, id) => ({ id, ...d, tags: d.tags.join(' ') })))
        engine.current = ms
        setReady(true)
      })
      .catch(() => setReady(false))
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(
    () => ({
      ready,
      search: (q: string): Array<SearchResult> =>
        engine.current && q.trim()
          ? (engine.current.search(q, { prefix: true, fuzzy: 0.2 }) as Array<any>).slice(0, 20)
          : [],
    }),
    [ready],
  )
}
