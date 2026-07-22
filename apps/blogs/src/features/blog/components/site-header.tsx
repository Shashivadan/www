import { Link } from '@tanstack/react-router'
import { Github } from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { SearchCommand } from '../search/search-command'
import { siteConfig } from '../config'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-muted-foreground sm:flex">
          <Link to="/blog" className="hover:text-foreground" activeProps={{ className: 'text-foreground' }}>
            Blog
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchCommand />
          <Button
            variant="outline"
            size="icon"
            aria-label="GitHub repository"
            render={<a href={siteConfig.repoUrl} target="_blank" rel="noopener noreferrer" />}
          >
            <Github className="size-4" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
