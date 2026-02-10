import { GitHubCalendar as RawCalendar } from 'react-github-calendar'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { itemVariants, useMounted } from './shared'

export function GitHubCalendarSection() {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  const githubTheme = {
    light: ['#f0f0f0', '#c4c4c4', '#929292', '#606060', '#303030'],
    dark: ['#1a1a1a', '#333333', '#555555', '#888888', '#bbbbbb'],
  }

  // Ensure we have a valid renderable component
  // We verified it's a named export 'GitHubCalendar'
  const Calendar = RawCalendar as any

  return (
    <motion.section variants={itemVariants} className="space-y-5">
      <h2 className="text-[11px] font-mono uppercase tracking-widest text-foreground/30 font-semibold">
        GitHub Contributions
      </h2>
      <div className="p-4 rounded-xl bg-card border border-border overflow-hidden">
        <div className="flex justify-center md:justify-start overflow-x-auto pb-2 scrollbar-hide">
          {mounted && Calendar ? (
            <Calendar
              username="shashivadanx"
              blockSize={10}
              blockMargin={4}
              fontSize={12}
              theme={githubTheme}
              colorScheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
              loading={false}
            />
          ) : (
            <div className="h-[140px] w-full bg-foreground/5 rounded-lg animate-pulse" />
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-foreground/30">
          <a
            href="https://github.com/shashivadanx"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            @shashivadanx
          </a>
          <div className="flex items-center gap-1">
            <span>Less</span>
            <div className="flex gap-1">
              {(resolvedTheme === 'dark'
                ? githubTheme.dark
                : githubTheme.light
              ).map((color) => (
                <div
                  key={color}
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
