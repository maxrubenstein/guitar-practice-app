import Link from 'next/link'
import { getAllLessons, getAllProgress, computeStreak } from '@/lib/curriculum'
import { supabase } from '@/lib/supabaseClient'

export const revalidate = 0

function CalendarHeatmap({ sessions }: { sessions: { practiced_at: string; duration_seconds: number }[] }) {
  // Build last 56 days (8 weeks) of data
  const today = new Date()
  const days: { date: string; minutes: number }[] = []
  for (let i = 55; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    days.push({ date: d.toISOString().slice(0, 10), minutes: 0 })
  }
  for (const s of sessions) {
    const key = new Date(s.practiced_at).toISOString().slice(0, 10)
    const day = days.find(d => d.date === key)
    if (day) day.minutes += Math.round(s.duration_seconds / 60)
  }

  const intensity = (min: number) => {
    if (min === 0) return 'bg-gray-800'
    if (min < 10) return 'bg-indigo-900'
    if (min < 20) return 'bg-indigo-700'
    if (min < 30) return 'bg-indigo-500'
    return 'bg-indigo-300'
  }

  // Split into 8 columns (weeks) of 7 rows (days)
  const weeks: typeof days[] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map(day => (
              <div
                key={day.date}
                title={`${day.date}: ${day.minutes} min`}
                className={`w-4 h-4 rounded-sm ${intensity(day.minutes)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Less</span>
        {['bg-gray-800', 'bg-indigo-900', 'bg-indigo-700', 'bg-indigo-500', 'bg-indigo-300'].map(c => (
          <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

export default async function ProgressPage() {
  const [lessons, allProgress, streak] = await Promise.all([
    getAllLessons(),
    getAllProgress(),
    computeStreak(),
  ])

  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('duration_seconds, practiced_at')
    .order('practiced_at', { ascending: false })

  const allSessions = sessions ?? []
  const totalSeconds = allSessions.reduce((s, r) => s + r.duration_seconds, 0)
  const totalMinutes = Math.round(totalSeconds / 60)
  const masteredCount = allProgress.filter(p => p.status === 'mastered').length

  // Longest streak
  const days = new Set(allSessions.map(s => new Date(s.practiced_at).toISOString().slice(0, 10)))
  const sortedDays = [...days].sort()
  let longest = 0, current = 0
  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0) { current = 1; continue }
    const prev = new Date(sortedDays[i - 1])
    const curr = new Date(sortedDays[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    current = diff === 1 ? current + 1 : 1
    longest = Math.max(longest, current)
  }
  longest = Math.max(longest, streak)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-gray-200 text-sm">← Dashboard</Link>
        <h1 className="text-xl font-bold">Progress</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total time', value: `${totalMinutes}m` },
            { label: 'Current streak', value: `${streak}d` },
            { label: 'Longest streak', value: `${longest}d` },
            { label: 'Mastered', value: `${masteredCount}/${lessons.length}` },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg bg-gray-800 p-4 text-center">
              <p className="text-2xl font-bold text-indigo-400">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Last 8 Weeks</h2>
          <div className="rounded-lg bg-gray-800 p-4">
            <CalendarHeatmap sessions={allSessions} />
          </div>
        </section>

        {/* Per-lesson breakdown */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Lessons</h2>
          <div className="space-y-1">
            {lessons.map(lesson => {
              const p = allProgress.find(p => p.lesson_id === lesson.id)
              const status = p?.status ?? 'not_started'
              return (
                <Link
                  key={lesson.id}
                  href={`/practice/${lesson.id}`}
                  className="flex items-center justify-between rounded px-3 py-2 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-sm text-gray-300 truncate flex-1">{lesson.title}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    {p?.best_bpm && <span className="text-xs text-gray-500">🏆 {p.best_bpm}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                      status === 'mastered' ? 'bg-green-900 text-green-300' :
                      status === 'in_progress' ? 'bg-indigo-900 text-indigo-300' :
                      'bg-gray-700 text-gray-500'
                    }`}>
                      {status === 'mastered' ? '✓' : status === 'in_progress' ? '…' : '—'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
