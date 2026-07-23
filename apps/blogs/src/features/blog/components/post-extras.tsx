import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { absoluteUrl } from '../config'

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  )
}

const summaryPrompt = (title: string, url: string) =>
  `Read and summarize this blog post for me, then let me ask follow-up questions.\n\nTitle: ${title}\n${url}`

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
        size="sm"
        aria-label="Share on X"
        render={
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <XIcon className="size-4" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-label="Summarize with ChatGPT"
        render={
          <a
            href={`https://chatgpt.com/?q=${encodeURIComponent(summaryPrompt(title, url))}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <img src="/brand/chatgpt.svg" alt="" className="size-4 rounded-[3px]" />
        ChatGPT
      </Button>
      <Button
        variant="outline"
        size="sm"
        aria-label="Summarize with Claude"
        render={
          <a
            href={`https://claude.ai/new?q=${encodeURIComponent(summaryPrompt(title, url))}`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <img src="/brand/claude.svg" alt="" className="size-4 rounded-[3px]" />
        Claude
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
