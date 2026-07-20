import { motion } from 'motion/react'
import { Experience } from './experience'
import { GitHubCalendarSection } from './github-calendar'
import { Header } from './header'
import { containerVariants } from './shared'
import { Skills } from './skills'


export function LandingPage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen font-mono bg-background flex flex-col items-center px-4 py-16 md:py-24 text-foreground selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
    >
      {/* Main Content Container */}
      <div className="max-w-3xl w-full space-y-5">
        <Header />
        <Skills />
        <GitHubCalendarSection />
        {/* <WakaTimeStatsSection /> */}
        <Experience />
      </div>
    </motion.div>
  )
}
