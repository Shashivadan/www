import { useEffect, useRef } from 'react'

/**
 * Renders compiled post HTML. Content is trusted (owned content repo), so
 * dangerouslySetInnerHTML is safe here. A post-hydration effect injects
 * accessible copy buttons into each Shiki code block.
 */
export function Prose({ html, className = '' }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const blocks = root.querySelectorAll<HTMLPreElement>('pre.shiki')
    const cleanups: Array<() => void> = []
    blocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return
      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.type = 'button'
      btn.textContent = 'Copy'
      btn.setAttribute('aria-label', 'Copy code to clipboard')
      const onClick = async () => {
        const code = pre.querySelector('code')?.textContent ?? ''
        await navigator.clipboard.writeText(code)
        btn.textContent = 'Copied!'
        setTimeout(() => (btn.textContent = 'Copy'), 1500)
      }
      btn.addEventListener('click', onClick)
      pre.appendChild(btn)
      cleanups.push(() => btn.removeEventListener('click', onClick))
    })
    return () => cleanups.forEach((fn) => fn())
  }, [html])

  return (
    <div
      ref={ref}
      className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
