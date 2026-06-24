import Link from 'next/link'
import { getAllLessons, getAllProgress } from '@/lib/curriculum'
import LessonCard from '@/components/LessonCard'

export const revalidate = 0

export default async function CurriculumPage() {
  const [lessons, allProgress] = await Promise.all([getAllLessons(), getAllProgress()])
  const progressById = Object.fromEntries(allProgress.map(p => [p.lesson_id, p]))

  const byWeek: Record<number, typeof lessons> = {}
  for (const l of lessons) {
    if (!byWeek[l.week]) byWeek[l.week] = []
    byWeek[l.week].push(l)
  }

  const masteredCount = allProgress.filter(p => p.status === 'mastered').length

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-200 text-sm">← Dashboard</Link>
          <h1 className="text-xl font-bold">All Lessons</h1>
        </div>
        <span className="text-sm text-gray-400">{masteredCount} / {lessons.length} mastered</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {Object.entries(byWeek).map(([week, weekLessons]) => (
          <section key={week} className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Week {week}
            </h2>
            <div className="space-y-2">
              {weekLessons.map(l => (
                <LessonCard
                  key={l.id}
                  lesson={l}
                  progress={progressById[l.id]}
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
