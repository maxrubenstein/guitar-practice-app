'use client'

import { useMemo } from 'react'
import { computeStreakFromTimestamps } from '@/lib/curriculum'

interface Props {
  practicedAtTimestamps: string[]
  totalMinutes: number
}

export default function StreakDisplay({ practicedAtTimestamps, totalMinutes }: Props) {
  // Computed in the browser so local timezone is used for day boundaries
  const streak = useMemo(
    () => computeStreakFromTimestamps(practicedAtTimestamps),
    [practicedAtTimestamps]
  )

  return (
    <div className="flex gap-4">
      <div className="rounded-lg bg-gray-800 px-5 py-3 text-center">
        <p className="text-3xl font-bold text-indigo-400">{streak}</p>
        <p className="text-xs text-gray-400 mt-0.5">day streak</p>
      </div>
      <div className="rounded-lg bg-gray-800 px-5 py-3 text-center">
        <p className="text-3xl font-bold text-green-400">{totalMinutes}</p>
        <p className="text-xs text-gray-400 mt-0.5">total min</p>
      </div>
    </div>
  )
}
