import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { itemVariants, useMounted } from './shared'
import type { WakaTimeLanguage, WakaTimeStats } from '@/lib/wakatime'
import { getWakaTimeStats } from '@/lib/wakatime'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function WakaTimeStatsSection() {
  const mounted = useMounted()
  const { data: stats, isLoading: loading } = useQuery<WakaTimeStats | null>({
    queryKey: ['wakatime-stats'],
    queryFn: () => getWakaTimeStats(),
    refetchInterval: 1000 * 60 * 5,
  })

  // Stable date formatting that won't mismatch between server and client
  const chartData = stats?.daily_stats?.map((day) => {
    const d = new Date(day.date)
    return {
      name: DAYS[d.getUTCDay()], // Use UTC to avoid timezone mismatches
      hours: parseFloat((day.total_seconds / 3600).toFixed(1)),
    }
  })

  return (
    <motion.section variants={itemVariants} className="space-y-5">
      <h2 className="text-[11px] font-mono uppercase tracking-widest text-foreground/30 font-semibold flex items-center gap-2">
        Coding Activity
        {loading && (
          <div className="w-1 h-1 rounded-full bg-foreground/30 animate-pulse" />
        )}
      </h2>
      <div className="p-4 rounded-xl bg-card border border-border flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${stats ? 'bg-green-500 animate-pulse' : 'bg-foreground/20'}`}
            />
            <span className="text-xs font-mono text-foreground/50">
              {loading ? 'Fetching stats...' : 'Last 7 Days'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-foreground/30 italic">
            {stats ? 'Live' : loading ? 'Checking...' : 'Data unavailable'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Time',
              value: stats?.human_readable_total || '--',
            },
            {
              label: 'Daily Avg',
              value: stats?.human_readable_daily_average || '--',
            },
            {
              label: 'Top Lang',
              value: stats?.languages[0]?.name || '--',
            },
            { label: 'Best Day', value: stats?.best_day.text || '--' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-tighter">
                {stat.label}
              </div>
              <div className="text-sm font-semibold text-foreground/70">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Coding Activity Chart */}
        <div className="h-[140px] w-full mt-4 -ml-4">
          {mounted && chartData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="currentColor"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="currentColor"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Tooltip
                  cursor={{
                    stroke: 'currentColor',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                    opacity: 0.2,
                  }}
                  content={({ active, payload }) => {
                    if (active && payload.length) {
                      return (
                        <div className="rounded-xl border bg-card/80 backdrop-blur-md px-3 py-2 shadow-2xl">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                              {payload[0].payload.name}
                            </span>
                            <span className="text-sm font-bold text-foreground font-mono">
                              {payload[0].value} hrs
                            </span>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="natural"
                  dataKey="hours"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                  className="text-foreground/30"
                  animationDuration={1500}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 9,
                    fill: 'currentColor',
                    opacity: 0.4,
                    fontFamily: 'monospace',
                  }}
                  interval="preserveStartEnd"
                  dy={10}
                />
                <YAxis hide domain={[0, 'auto']} />
              </AreaChart>
            </ResponsiveContainer>
          )}
          {!mounted && (
            <div className="h-full w-full bg-foreground/5 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Language Details */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-mono text-foreground/30 mt-1">
          {stats?.languages.slice(0, 4).map((lang: WakaTimeLanguage) => (
            <div key={lang.name} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-foreground/20" />
              <span>
                {lang.name} {Math.round(lang.percent)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
