import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  AWS,
  CSS3,
  Cloudflare,
  Docker,
  EC2,
  ExpressJsDark,
  ExpressJsLight,
  Firebase,
  GitHubDark,
  GitHubLight,
  HTML5,
  JavaScript,
  MongoDB,
  NextJs,
  NodeJs,
  PostgreSQL,
  Prisma,
  React,
  Redis,
  TailwindCSS,
  TypeScript,
  ViteJS,
} from 'developer-icons'

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98] as any,
    },
  },
}

// Custom hook to handle hydration state
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}

// Helper components for theme-dependent icons with strict hydration safety
export const ExpressJsIcon = ({ size }: { size?: number }) => {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  // Always render Dark version on server and during reconciliation to prevent mismatch
  if (!mounted) {
    return <ExpressJsDark size={size} />
  }

  const Icon = resolvedTheme === 'dark' ? ExpressJsLight : ExpressJsDark
  return <Icon size={size} />
}

export const GitHubActionsIcon = ({ size }: { size?: number }) => {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <GitHubDark size={size} />
  }

  const Icon = resolvedTheme === 'dark' ? GitHubLight : GitHubDark
  return <Icon size={size} />
}

export const skillIcons: Record<string, React.FC<{ size?: number }>> = {
  JavaScript: JavaScript,
  TypeScript: TypeScript,
  'React.js': React,
  'Next.js': NextJs,
  Vite: ViteJS,
  HTML: HTML5,
  CSS: CSS3,
  'Tailwind CSS': TailwindCSS,
  'Node.js': NodeJs,
  'Express.js': ExpressJsIcon,
  'Hono.js': NodeJs,
  oRPC: TypeScript,
  MongoDB: MongoDB,
  PostgreSQL: PostgreSQL,
  Prisma: Prisma,
  Redis: Redis,
  Firebase: Firebase,
  'Firebase Firestore': Firebase,
  AWS: AWS,
  Cloudflare: Cloudflare,
  Docker: Docker,
  'GitHub Actions': GitHubActionsIcon,
  EC2: EC2,
}
