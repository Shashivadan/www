import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Link2, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { absoluteUrl } from '../config'

export function Breadcrumbs({ crumbs }: { crumbs: Array<{ name: string; path: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-foreground">{c.name}</span>
            ) : (
              <Link to={c.path} className="hover:text-foreground">{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function ShareButtons({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const url = absoluteUrl(`/blog/${slug}`)
  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={copy} aria-label="Copy link">
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
        {copied ? 'Copied' : 'Copy link'}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Share on X"
        render={
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <Twitter className="size-4" />
      </Button>
    </div>
  )
}

export function PrevNext({
  prev,
  next,
}: {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}) {
  if (!prev && !next) return null
  return (
    <nav className="grid gap-4 sm:grid-cols-2" aria-label="Post navigation">
      {prev ? (
        <Link to="/blog/$" params={{ _splat: prev.slug }} className="rounded-lg border p-4 hover:bg-accent">
          <div className="text-xs text-muted-foreground">Previous</div>
          <div className="font-medium">{prev.title}</div>
        </Link>
      ) : <span />}
      {next && (
        <Link to="/blog/$" params={{ _splat: next.slug }} className="rounded-lg border p-4 text-right hover:bg-accent">
          <div className="text-xs text-muted-foreground">Next</div>
          <div className="font-medium">{next.title}</div>
        </Link>
      )}
    </nav>
  )
}
