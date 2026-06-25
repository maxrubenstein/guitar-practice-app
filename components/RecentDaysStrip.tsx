'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SessionEntry {
  lesson_id: string
  lesson_title: string
  duration_seconds: number
  practiced_at: string
}

interface DayGroup {
  date: string           // YYYY-MM-DD
  label: string          // "Jun 24"
  sessions: SessionEntry[]
}

interface Props {
  days: DayGroup[]
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.round(seconds / 60)}m`
}

export default function RecentDaysStrip({ days }: Props) {
  const [openDay, setOpenDay] = useState<string | null>(null)

  if (days.length === 0) return null

  const expanded = openDay ? days.find(d => d.date === openDay) : null

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 items-center flex-wrap">
        <span className="text-xs text-gray-500 mr-1">Recent:</span>
        {days.map(day => (
          <button
            key={day.date}
            onClick={() => setOpenDay(openDay === day.date ? null : day.date)}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              openDay === day.date
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-800 text-indigo-300 hover:bg-indigo-700'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {expanded && (
        <div className="rounded-lg bg-gray-800 border border-gray-700 p-3 space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{expanded.label}</p>
          {expanded.sessions.map((s, i) => (
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
