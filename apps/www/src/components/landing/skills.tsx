import { motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { itemVariants, skillIcons } from './shared'

const MotionBadge = motion.create(Badge)

const skills = [
  'JavaScript',
  'TypeScript',
  'React.js',
  'Next.js',
  'Vite',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Node.js',
  'Express.js',
  'Hono.js',
  'oRPC',
  'MongoDB',
  'PostgreSQL',
  'Prisma',
  'Redis',
  'Firebase',
  'Firebase Firestore',
  'AWS',
  'Cloudflare',
  'Docker',
  'GitHub Actions',
  'EC2',
]

export function Skills() {
  return (
    <motion.section variants={itemVariants} className="space-y-5">
      <h2 className="text-sm font-mono uppercase tracking-widest text-foreground/30 font-semibold">
        Technical Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const Icon = skillIcons[skill]
          return (
            <MotionBadge
              key={skill}
              variant="outline"
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-2 py-1 h-auto text-[11px] font-mono font-normal bg-card border-border hover:border-foreground/30 hover:shadow-sm cursor-default flex items-center gap-2"
            >
              {Icon && <Icon size={12} />}
              <span>{skill}</span>
            </MotionBadge>
          )
        })}
      </div>
    </motion.section>
  )
}
