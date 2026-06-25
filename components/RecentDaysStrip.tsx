'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface SessionEntry {
  lesson_id: string
  lesson_title: string
  duration_seconds: number
  practiced_at: string
}

interface Props {
  sessions: SessionEntry[]
}

function localDateKey(isoString: string): string {
  // Group by the user's local calendar date, not UTC
  const d = new Date(isoString)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.round(seconds / 60)}m`
}

function dayLabel(dateKey: string): string {
  // dateKey is YYYY-MM-DD in local time — parse as local noon to avoid DST edge cases
  return new Date(dateKey + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function RecentDaysStrip({ sessions }: Props) {
  const [openDay, setOpenDay] = useState<string | null>(null)

  const days = useMemo(() => {
    const map = new Map<string, SessionEntry[]>()
    for (const s of sessions) {
      const key = localDateKey(s.practiced_at)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(s)
    }
    return [...map.entries()].slice(0, 7).map(([date, daySessions]) => ({ date, daySessions }))
  }, [sessions])

  if (days.length === 0) return null

  const expanded = days.find(d => d.date === openDay)

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 items-center flex-wrap">
        <span className="text-xs text-gray-500 mr-1">Recent:</span>
        {days.map(({ date }) => (
          <button
            key={date}
            onClick={() => setOpenDay(openDay === date ? null : date)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              openDay === date
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-800 text-indigo-300 hover:bg-indigo-700'
            }`}
          >
            {dayLabel(date)}
          </button>
        ))}
      </div>

      {expanded && (
        <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
            {dayLabel(expanded.date)}
          </p>
          {expanded.daySessions.map((s, i) => (
            <Link
              key={i}
              href={`/practice/${s.lesson_id}`}
              className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm text-gray-200 truncate">{s.lesson_title}</span>
              <span className="text-xs text-gray-500 shrink-0 ml-3">{formatDuration(s.duration_seconds)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
