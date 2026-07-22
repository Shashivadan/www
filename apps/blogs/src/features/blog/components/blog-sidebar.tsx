import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { sidebarTree } from '../content/manifest'

/** Collapsible, filterable navigation generated from the content folder tree. */
export function BlogSidebar() {
  const tree = useMemo(() => sidebarTree(), [])
  const [filter, setFilter] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const q = filter.trim().toLowerCase()
  const filtered = tree
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (i) => !q || i.title.toLowerCase().includes(q) || i.slug.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.items.length)

  return (
    <nav aria-label="Blog navigation" className="text-sm">
      <Input
        type="search"
        placeholder="Filter posts…"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 h-8"
        aria-label="Filter posts"
      />
      <ul className="space-y-4">
        {filtered.map((group) => {
          const isCollapsed = collapsed[group.category] && !q
          return (
            <li key={group.category}>
              <button
                type="button"
                onClick={() => setCollapsed((c) => ({ ...c, [group.category]: !c[group.category] }))}
                className="flex w-full items-center gap-1 font-medium capitalize"
                aria-expanded={!isCollapsed}
              >
                <ChevronRight className={cn('size-3.5 transition-transform', !isCollapsed && 'rotate-90')} />
                {group.category}
              </button>
              {!isCollapsed && (
                <ul className="mt-1.5 space-y-1 border-l pl-3">
                  {group.items.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to="/blog/$"
                        params={{ _splat: item.slug }}
                        className="block text-muted-foreground hover:text-foreground"
                        activeProps={{ className: 'font-medium text-foreground' }}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
        {!filtered.length && <li className="text-muted-foreground">No matches.</li>}
      </ul>
    </nav>
  )
}
