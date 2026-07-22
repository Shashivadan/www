import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Heading } from '../types'

/** Top scroll-progress bar. */
export function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-primary origin-left"
      style={{ transform: `scaleX(${pct / 100})` }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-label="Reading progress"
    />
  )
}

/** Sticky table of contents with scroll-spy. */
export function TableOfContents({ headings }: { headings: Array<Heading> }) {
  const [active, setActive] = useState<string>('')
  const items = headings.filter((h) => h.depth === 2 || h.depth === 3)

  useEffect(() => {
    if (!items.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '0% 0% -80% 0%', threshold: 0 },
    )
    items.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  if (!items.length) return null
  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 font-medium">On this page</p>
      <ul className="space-y-1.5 border-l">
        {items.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.depth === 3 ? '1.5rem' : '0.75rem' }}>
            <a
              href={`#${h.id}`}
              className={cn(
                '-ml-px block border-l border-transparent text-muted-foreground transition-colors hover:text-foreground',
                active === h.id && 'border-primary font-medium text-foreground',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 rounded-full border bg-background p-3 shadow-md hover:bg-accent"
      aria-label="Back to top"
    >
      <ArrowUp className="size-4" />
    </button>
  )
}
