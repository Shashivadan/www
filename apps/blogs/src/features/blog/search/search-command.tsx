import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useSearch } from './use-search'

/** Site-wide Cmd/Ctrl-K search palette. */
export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { search } = useSearch()
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const results = search(query)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden rounded border bg-muted px-1.5 text-[0.7rem] sm:inline">⌘K</kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search posts">
        <Command shouldFilter={false}>
        <CommandInput placeholder="Search posts…" value={query} onValueChange={setQuery} />
        <CommandList>
          {query && !results.length && <CommandEmpty>No results found.</CommandEmpty>}
          {results.map((r) => (
            <CommandItem
              key={r.slug}
              value={r.slug}
              onSelect={() => {
                setOpen(false)
                navigate({ to: '/blog/$', params: { _splat: r.slug } })
              }}
            >
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="line-clamp-1 text-xs text-muted-foreground">{r.description}</div>
              </div>
            </CommandItem>
          ))}
        </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
