import { supabase } from './supabaseClient'
import { Lesson, LessonTab, Progress, ProgressStatus } from '@/types'

export async function getAllLessons(): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('day_order', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getTabsForLesson(lessonId: string): Promise<LessonTab[]> {
  const { data, error } = await supabase
    .from('lesson_tabs')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getAllProgress(): Promise<Progress[]> {
  const { data, error } = await supabase.from('progress').select('*')
  if (error) throw error
  return data ?? []
}

export async function getProgressForLesson(lessonId: string): Promise<Progress | null> {
  const { data } = await supabase
    .from('progress')
    .select('*')
    .eq('lesson_id', lessonId)
    .maybeSingle()
  return data ?? null
}

export async function upsertProgress(
  lessonId: string,
  patch: Partial<Omit<Progress, 'id' | 'lesson_id' | 'updated_at'>>
): Promise<void> {
  const { data: existing } = await supabase
    .from('progress')
    .select('id, best_bpm')
    .eq('lesson_id', lessonId)
    .maybeSingle()

  // Only update best_bpm if the new value is actually higher
  if (patch.best_bpm != null && existing?.best_bpm != null) {
    if (patch.best_bpm <= existing.best_bpm) {
      delete patch.best_bpm
    }
  }

  if (existing) {
    await supabase
      .from('progress')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('lesson_id', lessonId)
  } else {
    await supabase
      .from('progress')
      .insert({ lesson_id: lessonId, status: 'not_started', ...patch })
  }
}

export async function logPracticeSession(
  lessonId: string,
  durationSeconds: number,
  bpmPracticed: number | null
): Promise<void> {
  await supabase.from('practice_sessions').insert({
    lesson_id: lessonId,
    duration_seconds: durationSeconds,
    bpm_practiced: bpmPracticed,
  })
  // Mark in_progress if not already mastered
  const progress = await getProgressForLesson(lessonId)
  if (!progress || progress.status === 'not_started') {
    await upsertProgress(lessonId, { status: 'in_progress' })
  }
}

export async function getCurrentLesson(lessons: Lesson[], allProgress: Progress[]): Promise<Lesson | null> {
  const masteredIds = new Set(
    allProgress.filter(p => p.status === 'mastered').map(p => p.lesson_id)
  )
  return lessons.find(l => !masteredIds.has(l.id)) ?? lessons[0] ?? null
}

// Returns raw practiced_at timestamps so the client can compute streak
// in the correct local timezone.
export async function getPracticedAtTimestamps(): Promise<string[]> {
  const { data } = await supabase
    .from('practice_sessions')
    .select('practiced_at')
    .order('practiced_at', { ascending: false })
  return (data ?? []).map(s => s.practiced_at)
}

// Server-side streak (UTC dates only — used as a fallback).
// For accurate local-timezone streak, use the client-side helper below.
export async function computeStreak(): Promise<number> {
  const timestamps = await getPracticedAtTimestamps()
  return computeStreakFromTimestamps(timestamps)
}

// Pure function — call this client-side with the raw timestamps so
// new Date() uses the browser's local timezone.
export function computeStreakFromTimestamps(timestamps: string[]): number {
  if (timestamps.length === 0) return 0

  const days = new Set(
    timestamps.map(ts => {
      const d = new Date(ts)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
  )

  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (days.has(key)) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}
