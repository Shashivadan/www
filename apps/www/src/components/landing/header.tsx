import { Github, Linkedin, Mail, PenTool } from 'lucide-react'
import { useTheme } from 'next-themes'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { itemVariants } from './shared'

const EMOJIS = ['🚀', '💻', '👨‍💻', '⚡', '🌐', '🛠️', '🎨', '📱']

export function Header() {
  const { theme, setTheme } = useTheme()
  const [emojiIndex, setEmojiIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setEmojiIndex((prev) => (prev + 1) % EMOJIS.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const links = [
    {
      href: 'mailto:shashivadan99@gmail.com',
      icon: Mail,
      label: 'shashivadan99@gmail.com',
      hover: { rotateX: 45, y: -2 },
      tap: { scale: 0.8, rotateX: 0 },
    },
    {
      href: 'https://linkedin.com/in/thota-shashivadan',
      icon: Linkedin,
      label: 'LinkedIn',
      external: true,
      hover: { skewX: -12, y: -3 },
      tap: { skewX: 0, scale: 0.9 },
    },
    {
      href: 'https://github.com/Shashivadan',
      icon: Github,
      label: 'Github',
      external: true,
      hover: { rotate: 180, scale: 1.1 },
      tap: { scale: 0.7, rotate: 0 },
    },
    {
      href: '#',
      icon: PenTool,
      label: 'Blog',
      external: true,
      hover: { scaleX: 1.1, x: 5 },
      tap: { scaleX: 0.9, x: 0 },
    },
  ]

  return (
    <motion.header
      variants={itemVariants}
      className="space-y-6 text-left relative"
    >
      <div className="flex justify-start">
        <motion.button
          whileHover={{ scale: 1.05, rotate: 5 }}
          whileTap={{ scale: 0.95, rotate: -5 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border shadow-sm hover:border-foreground/20 group cursor-pointer overflow-hidden"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={emojiIndex}
              initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="text-lg select-none"
            >
              {EMOJIS[emojiIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-foreground">
          Thota Shashivadan
        </h1>
        <p className="text-base font-mono text-foreground/50 font-light">
          Software Engineer
        </p>
      </div>

      <div className="flex flex-wrap justify-start gap-2 text-xs font-mono text-foreground/60">
        {links.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noreferrer' : undefined}
            whileHover={link.hover}
            whileTap={link.tap}
            className="px-2.5 py-1 rounded-full bg-card border border-border hover:border-foreground/20 hover:text-foreground flex items-center gap-2 group transition-colors duration-300"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <link.icon className="w-3 h-3 group-hover:text-foreground transition-colors" />
            </motion.div>
            <span>{link.label}</span>
          </motion.a>
        ))}
      </div>
    </motion.header>
  )
}
