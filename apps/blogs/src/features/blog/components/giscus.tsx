import { useEffect, useRef } from 'react'

/**
 * Giscus comments (GitHub Discussions). Configure via env:
 *   VITE_GISCUS_REPO         e.g. "Shashivadan/blogs"
 *   VITE_GISCUS_REPO_ID      from giscus.app
 *   VITE_GISCUS_CATEGORY     e.g. "Announcements"
 *   VITE_GISCUS_CATEGORY_ID  from giscus.app
 * Renders nothing until the repo is set, so the site still builds without it.
 */
export function Giscus() {
  const ref = useRef<HTMLDivElement>(null)
  const env = import.meta.env
  const repo = env.VITE_GISCUS_REPO as string | undefined
  const repoId = env.VITE_GISCUS_REPO_ID as string | undefined
  const ready = Boolean(repo && repoId)

  useEffect(() => {
    const el = ref.current
    if (!el || !ready) return
    el.innerHTML = '' // reset on slug change (StrictMode / client nav)

    const s = document.createElement('script')
    s.src = 'https://giscus.app/client.js'
    s.async = true
    s.crossOrigin = 'anonymous'
    Object.assign(s.dataset, {
      repo: repo ?? '',
      repoId: repoId ?? '',
      category: env.VITE_GISCUS_CATEGORY ?? '',
      categoryId: env.VITE_GISCUS_CATEGORY_ID ?? '',
      mapping: 'pathname',
      strict: '1',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'top',
      theme: 'noborder_dark',
      lang: 'en',
      loading: 'lazy',
    })
    el.appendChild(s)
  }, [ready, repo, repoId, env])

  if (!ready) return null
  return (
    <section className="mt-16">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">Comments</h2>
      <div ref={ref} className="giscus" />
    </section>
  )
}
