import { createServerFn } from '@tanstack/react-start'

export type WakaTimeLanguage = {
  name: string
  percent: number
  total_seconds: number
  digital: string
  text: string
}

export type WakaTimeDay = {
  date: string
  total_seconds: number
  hours: number
  minutes: number
}

export type WakaTimeStats = {
  total_seconds: number
  human_readable_total: string
  daily_average: number
  human_readable_daily_average: string
  languages: Array<WakaTimeLanguage>
  best_day: {
    date: string
    text: string
    total_seconds: number
  }
  daily_stats?: Array<WakaTimeDay>
}

export const getWakaTimeStats = createServerFn({ method: 'GET' }).handler(
  async () => {
    const apiKey = process.env.WAKATIME_API_KEY
    if (!apiKey) {
      console.error('WAKATIME_API_KEY is not set in environment variables')
      return null
    }

    try {
      const authHeader = `Basic ${Buffer.from(apiKey + ':').toString('base64')}`

      // Fetch stats for general info and languages
      const statsRes = await fetch(
        'https://wakatime.com/api/v1/users/current/stats/last_7_days',
        {
          headers: { Authorization: authHeader },
        },
      )

      // Fetch summaries for line chart data
      const summariesRes = await fetch(
        'https://wakatime.com/api/v1/users/current/summaries?range=last_7_days',
        {
          headers: { Authorization: authHeader },
        },
      )

      if (!statsRes.ok || !summariesRes.ok) {
        console.error('WakaTime API responded with error status')
        return null
      }

      const statsJson = await statsRes.json()
      const summariesJson = await summariesRes.json()

      const daily_stats = summariesJson.data.map((day: any) => ({
        date: day.range.date,
        total_seconds: day.grand_total.total_seconds,
        hours: day.grand_total.hours,
        minutes: day.grand_total.minutes,
      }))

      return {
        ...statsJson.data,
        daily_stats,
      } as WakaTimeStats
    } catch (error) {
      console.error('Error fetching WakaTime stats:', error)
      return null
    }
  },
)
