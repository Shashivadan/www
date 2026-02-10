import { motion } from 'motion/react'
import { itemVariants } from './shared'

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.li variants={itemVariants} className="flex gap-3 items-start">
      <span className="text-foreground/30 mt-1.5 text-[10px]">●</span>
      <span>{children}</span>
    </motion.li>
  )
}

export function Experience() {
  return (
    <motion.section variants={itemVariants} className="space-y-5">
      <h2 className="text-[11px] font-mono uppercase tracking-widest text-foreground/30 font-semibold">
        Work Experience
      </h2>

      <div className="relative border-l border-border/40 ml-3 space-y-12">
        {/* Algohire */}
        <div className="pl-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-foreground ring-4 ring-background"
          ></motion.div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <h3 className="text-lg font-semibold text-foreground">
                Algohire.ai
              </h3>
              <div className="font-mono text-[11px] text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded">
                Mar 2025 – Present
              </div>
            </div>
            <div className="text-sm font-medium text-foreground/70">
              Software Development Engineer{' '}
              <span className="text-foreground/30 mx-2">•</span> On-Site
            </div>
            <ul className="space-y-2 text-[13px] md:text-sm text-foreground/60 leading-relaxed">
              <ListItem>
                Led comprehensive migration of legacy JavaScript codebase to
                TypeScript, improving maintainability and type safety.
              </ListItem>
              <ListItem>
                Designed scalable centralized candidate database with bulk
                actions using Web Workers & microservices.
              </ListItem>
              <ListItem>
                Implemented RabbitMQ-based queuing for large-scale calls with
                Vapi.ai scale orchestration.
              </ListItem>
              <ListItem>
                Integrated Google OAuth 2.0 & Gmail API for secure account
                linking and automated email triggers.
              </ListItem>
              <ListItem>
                Implemented AI-driven resume parsing and semantic search using
                Elasticsearch for 1M+ resumes.
              </ListItem>
              <ListItem>
                Designed Kafka-based event-driven microservices for
                notifications and high-volume exports.
              </ListItem>
              <ListItem>
                Developed a scalable recruiter portal with advanced filters and
                high-performance search.
              </ListItem>
              <ListItem>
                Implemented AI-driven job recommendation system using skill
                embeddings and cosine similarity.
              </ListItem>
              <ListItem>
                Solely owned a production project for 6 months, ensuring
                end-to-end stability.
              </ListItem>
            </ul>
          </div>
        </div>

        {/* Wonder Creative Studio */}
        <div className="pl-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-border ring-4 ring-background"
          ></motion.div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <h3 className="text-lg font-semibold text-foreground">
                wonder creative studio
              </h3>
              <div className="font-mono text-[11px] text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded">
                Nov 2024 – Feb 2025
              </div>
            </div>
            <div className="text-sm font-medium text-foreground/70">
              React Intern <span className="text-foreground/30 mx-2">•</span>{' '}
              Remote
            </div>
            <ul className="space-y-2 text-[13px] md:text-sm text-foreground/60 leading-relaxed">
              <ListItem>
                Architected a cutting-edge, full-stack e-commerce platform using
                React and TypeScript.
              </ListItem>
              <ListItem>
                Integrated WebSocket technology for real-time user tracking and
                interactive streaming.
              </ListItem>
              <ListItem>
                Engineered pixel-perfect, responsive UIs that enhanced user
                experience and retention.
              </ListItem>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
