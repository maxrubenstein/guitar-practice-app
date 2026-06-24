import Link from 'next/link'
import { getAllLessons, getAllProgress, getCurrentLesson, computeStreak } from '@/lib/curriculum'
import { supabase } from '@/lib/supabaseClient'
import LessonCard from '@/components/LessonCard'
import StreakDisplay from '@/components/StreakDisplay'

export const revalidate = 0

export default async function DashboardPage() {
  const [lessons, allProgress] = await Promise.all([getAllLessons(), getAllProgress()])
  const currentLesson = await getCurrentLesson(lessons, allProgress)
  const streak = await computeStreak()

  const { data: sessions } = await supabase
    .from('practice_sessions')
    .select('duration_seconds, practiced_at')
    .order('practiced_at', { ascending: false })
    .limit(60)

  const totalMinutes = Math.round(
    (sessions ?? []).reduce((sum, s) => sum + s.duration_seconds, 0) / 60
  )

  const progressById = Object.fromEntries(allProgress.map(p => [p.lesson_id, p]))

  // Recent history: last 7 unique days
  const recentDays = [...new Set(
    (sessions ?? []).map(s => new Date(s.practiced_at).toISOString().slice(0, 10))
  )].slice(0, 7)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🎸 Guitar Practice</h1>
        <nav className="flex gap-4 text-sm text-gray-400">
          <Link href="/curriculum" className="hover:text-gray-200">All Lessons</Link>
          <Link href="/progress" className="hover:text-gray-200">Progress</Link>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <StreakDisplay streak={streak} totalMinutes={totalMinutes} />

        {/* Recent days strip */}
        {recentDays.length > 0 && (
          <div className="flex gap-1.5 items-center">
            <span className="text-xs text-gray-500 mr-1">Recent:</span>
            {recentDays.map(day => (
              <span key={day} className="text-xs bg-indigo-800 text-indigo-300 px-2 py-0.5 rounded">
                {new Date(day + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        )}

        {/* Today's lesson */}
        {currentLesson ? (
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Today's Lesson</h2>
            <div className="rounded-xl border border-indigo-500 bg-indigo-950 p-5 space-y-3">
              <p className="text-xs text-gray-400">Week {currentLesson.week}</p>
              <h3 className="text-xl font-bold">{currentLesson.title}</h3>
              <p className="text-sm text-gray-300">{currentLesson.focus}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span>⏱ {currentLesson.suggested_minutes} min</span>
                <span>🥁 {currentLesson.default_bpm}–{currentLesson.target_bpm} BPM</span>
              </div>
              <Link
                href={`/practice/${currentLesson.id}`}
                className="mt-2 block w-full text-center py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-colors"
              >
                Start Practice →
              </Link>
            </div>
          </section>
        ) : (
          <div className="rounded-xl border border-green-600 bg-green-950 p-6 text-center">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-semibold text-green-300">All 8 weeks mastered!</p>
            <p className="text-sm text-gray-400 mt-1">You can revisit any lesson from the curriculum.</p>
          </div>
        )}

        {/* Up next (next 3 unmastered) */}
        {(() => {
          const masteredIds = new Set(allProgress.filter(p => p.status === 'mastered').map(p => p.lesson_id))
          const upcoming = lessons.filter(l => !masteredIds.has(l.id) && l.id !== currentLesson?.id).slice(0, 3)
          if (upcoming.length === 0) return null
          return (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Up Next</h2>
              <div className="space-y-2">
                {upcoming.map(l => (
                  <LessonCard key={l.id} lesson={l} progress={progressById[l.id]} />
                ))}
              </div>
            </section>
          )
        })()}
      </main>
    </div>
  )
}
