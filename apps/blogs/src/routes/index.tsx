import { createFileRoute } from '@tanstack/react-router'
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <ModeToggle />
    </div>
  )
}
