import { Link } from '@tanstack/react-router'
import { siteConfig } from '../config'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav className="flex gap-4">
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <Link to="/search" className="hover:text-foreground">Search</Link>
          <a href={siteConfig.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a href="/rss.xml" className="hover:text-foreground">RSS</a>
        </nav>
      </div>
    </footer>
  )
}
