import Link from 'next/link'
import { Lesson, Progress } from '@/types'

interface Props {
  lesson: Lesson
  progress?: Progress | null
  isCurrent?: boolean
}

const STATUS_STYLES: Record<string, string> = {
  mastered: 'bg-green-900 text-green-300',
  in_progress: 'bg-indigo-900 text-indigo-300',
  not_started: 'bg-gray-700 text-gray-400',
}

const STATUS_LABEL: Record<string, string> = {
  mastered: '✓ Mastered',
  in_progress: 'In progress',
  not_started: 'Not started',
}

export default function LessonCard({ lesson, progress, isCurrent }: Props) {
  const status = progress?.status ?? 'not_started'

  return (
    <Link
      href={`/practice/${lesson.id}`}
      className={`block rounded-lg p-4 border transition-colors ${
        isCurrent
          ? 'border-indigo-500 bg-indigo-950 hover:bg-indigo-900'
          : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 mb-0.5">Week {lesson.week}</p>
          <h3 className="font-semibold text-gray-100 truncate">{lesson.title}</h3>
          <p className="text-sm text-gray-400 mt-0.5 truncate">{lesson.focus}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded font-mono ${STATUS_STYLES[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          {progress?.best_bpm && (
            <span className="text-xs text-gray-500">🏆 {progress.best_bpm} BPM</span>
          )}
        </div>
      </div>
    </Link>
  )
}
