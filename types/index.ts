export type StringName = 'E' | 'A' | 'D' | 'G' | 'B' | 'e'

export interface TabNote {
  string: StringName
  fret: number
  position: number
}

export interface LessonTab {
  id: string
  lesson_id: string
  label: string
  tuning: string
  notes: TabNote[]
  order_index: number
}

export interface Lesson {
  id: string
  week: number
  day_order: number
  lesson_type: 'new' | 'review'
  title: string
  focus: string
  instructions: string
  default_bpm: number
  target_bpm: number
  suggested_minutes: number
  reviews_lesson_ids: string[]
  created_at: string
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'mastered'

export interface Progress {
  id: string
  lesson_id: string
  status: ProgressStatus
  best_bpm: number | null
  notes: string | null
  mastered_at: string | null
  updated_at: string
}

export interface PracticeSession {
  id: string
  lesson_id: string
  duration_seconds: number
  bpm_practiced: number | null
  practiced_at: string
}
