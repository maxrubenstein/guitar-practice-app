'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import TabRenderer from '@/components/TabRenderer'
import Metronome from '@/components/Metronome'
import PracticeTimer from '@/components/PracticeTimer'
import { getLessonById, getTabsForLesson, getProgressForLesson, upsertProgress, logPracticeSession } from '@/lib/curriculum'
import { Lesson, LessonTab, Progress } from '@/types'

export default function PracticePage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [tabs, setTabs] = useState<LessonTab[]>([])
  const [sourceLessons, setSourceLessons] = useState<{ lesson: Lesson; tabs: LessonTab[] }[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)

  const [bpm, setBpm] = useState(80)
  const [instructionsOpen, setInstructionsOpen] = useState(true)
  const [notesValue, setNotesValue] = useState('')
  const [bestBpmInput, setBestBpmInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    async function load() {
      const [l, t, p] = await Promise.all([
        getLessonById(lessonId),
        getTabsForLesson(lessonId),
        getProgressForLesson(lessonId),
      ])
      setLesson(l)
      setTabs(t)
      setProgress(p)
      setNotesValue(p?.notes ?? '')
      setBpm(l?.default_bpm ?? 80)

      // For review lessons, load each source lesson's tabs
      if (l?.lesson_type === 'review' && l.reviews_lesson_ids?.length > 0) {
        const sources = await Promise.all(
          l.reviews_lesson_ids.map(async (srcId) => {
            const [srcLesson, srcTabs] = await Promise.all([
              getLessonById(srcId),
              getTabsForLesson(srcId),
            ])
            return srcLesson ? { lesson: srcLesson, tabs: srcTabs } : null
          })
        )
        setSourceLessons(sources.filter((s): s is { lesson: Lesson; tabs: LessonTab[] } => s !== null))
      }

      setLoading(false)
    }
    load()
  }, [lessonId])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const handleSessionComplete = useCallback(async (durationSeconds: number, bpmPracticed: number | null) => {
    await logPracticeSession(lessonId, durationSeconds, bpmPracticed)
    const updated = await getProgressForLesson(lessonId)
    setProgress(updated)
    showToast('Session logged!')
  }, [lessonId])

  const handleSaveNotes = useCallback(async () => {
    setSaving(true)
    await upsertProgress(lessonId, { notes: notesValue })
    const updated = await getProgressForLesson(lessonId)
    setProgress(updated)
    setSaving(false)
    showToast('Notes saved.')
  }, [lessonId, notesValue])

  const handleLogBestBpm = useCallback(async () => {
    const val = parseInt(bestBpmInput)
    if (!val || val < 20 || val > 300) return
    await upsertProgress(lessonId, { best_bpm: val })
    const updated = await getProgressForLesson(lessonId)
    setProgress(updated)
    setBestBpmInput('')
    showToast(updated?.best_bpm === val ? `Best BPM updated to ${val}!` : `Best BPM stays at ${updated?.best_bpm} (current record).`)
  }, [lessonId, bestBpmInput])

  const handleMarkMastered = useCallback(async () => {
    await upsertProgress(lessonId, {
      status: 'mastered',
      mastered_at: new Date().toISOString(),
    })
    showToast('Marked as mastered! 🎸')
    setTimeout(() => router.push('/'), 1200)
  }, [lessonId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Lesson not found. <Link href="/" className="text-indigo-400 underline">Go home</Link></p>
      </div>
    )
  }

  const isReview = lesson.lesson_type === 'review'
  const isMastered = progress?.status === 'mastered'

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-gray-200 text-sm">← Dashboard</Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Week {lesson.week}</p>
          <h1 className="text-lg font-semibold truncate">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isReview && (
            <span className="text-xs bg-amber-900 text-amber-300 px-2 py-1 rounded font-mono">↩ Review</span>
          )}
          {isMastered && (
            <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded font-mono">✓ Mastered</span>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span>🎯 {lesson.focus}</span>
          <span>⏱ {lesson.suggested_minutes} min</span>
          <span>🥁 {lesson.default_bpm}–{lesson.target_bpm} BPM</span>
          {progress?.best_bpm && <span>🏆 Best: {progress.best_bpm} BPM</span>}
        </div>

        {/* Instructions */}
        <div className="rounded-lg bg-gray-800">
          <button
            onClick={() => setInstructionsOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-200"
          >
            <span>Instructions</span>
            <span className="text-gray-500">{instructionsOpen ? '▲' : '▼'}</span>
          </button>
          {instructionsOpen && (
            <div className="px-4 pb-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap border-t border-gray-700 pt-3">
              {lesson.instructions}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          {isReview ? (
            // Review lesson: show source lessons' tabs grouped by source
            sourceLessons.length === 0 ? (
              <div className="rounded-lg bg-gray-800 p-6 text-sm text-gray-500 italic">
                Loading source tabs…
              </div>
            ) : (
              sourceLessons.map(({ lesson: src, tabs: srcTabs }) => (
                <div key={src.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-400 font-medium uppercase tracking-wide">
                      From:
                    </span>
                    <span className="text-sm text-gray-300 font-medium">{src.title}</span>
                  </div>
                  {srcTabs.length === 0 ? (
                    <div className="rounded-lg bg-gray-800 p-4 text-sm text-gray-500 italic">
                      No tab data for this source lesson.
                    </div>
                  ) : (
                    srcTabs.map(tab => (
                      <div key={tab.id} className="rounded-lg bg-gray-800 p-5">
                        <TabRenderer notes={tab.notes} label={tab.label} />
                      </div>
                    ))
                  )}
                </div>
              ))
            )
          ) : (
            // Regular lesson: show own tabs
            tabs.length === 0 ? (
              <div className="rounded-lg bg-gray-800 p-6 text-sm text-gray-500 italic">
                No tab data for this lesson.
              </div>
            ) : (
              tabs.map(tab => (
                <div key={tab.id} className="rounded-lg bg-gray-800 p-5">
                  <TabRenderer notes={tab.notes} label={tab.label} />
                </div>
              ))
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Metronome defaultBpm={lesson.default_bpm} />
          <PracticeTimer onSessionComplete={handleSessionComplete} currentBpm={bpm} />
        </div>

        <div className="rounded-lg bg-gray-800 p-5 space-y-4">
          <h3 className="font-semibold text-gray-100">Progress</h3>

          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Log best BPM"
              value={bestBpmInput}
              onChange={e => setBestBpmInput(e.target.value)}
              className="w-36 rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
              min={20} max={300}
            />
            <button onClick={handleLogBestBpm}
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">
              Save BPM
            </button>
            {progress?.best_bpm && (
              <span className="text-sm text-gray-400">Current record: {progress.best_bpm}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Notes</label>
            <textarea
              value={notesValue}
              onChange={e => setNotesValue(e.target.value)}
              rows={3}
              placeholder="What went well? What needs work?"
              className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
            />
            <button onClick={handleSaveNotes} disabled={saving}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Notes'}
            </button>
          </div>

          {!isMastered && (
            <div className="pt-2 border-t border-gray-700">
              <button onClick={handleMarkMastered}
                className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-600 text-white font-semibold text-sm">
                ✓ Mark as Mastered — advance to next lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
