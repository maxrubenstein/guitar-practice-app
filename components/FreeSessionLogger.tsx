'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function FreeSessionLogger() {
  const [open, setOpen] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [notes, setNotes] = useState('')
  const [bpm, setBpm] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const reset = useCallback(() => {
    setRunning(false)
    setElapsed(0)
    setShowLog(false)
    setNotes('')
    setBpm('')
    setSaved(false)
  }, [])

  const handleLog = useCallback(async () => {
    if (elapsed === 0) return
    setSaving(true)
    const bpmVal = bpm.trim() ? parseInt(bpm, 10) : null
    await supabase.from('practice_sessions').insert({
      lesson_id: null,
      duration_seconds: elapsed,
      bpm_practiced: isNaN(bpmVal!) ? null : bpmVal,
      notes: notes.trim() || null,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      reset()
      setOpen(false)
    }, 1200)
  }, [elapsed, bpm, notes, reset])

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-base">🎵</span>
          Free Practice
        </span>
        <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-700 pt-4">
          <p className="text-xs text-gray-500">
            Learning a song, jamming, or anything outside the curriculum — log it here.
          </p>

          {/* Timer */}
          <div className="text-4xl font-mono font-bold text-center text-gray-100 tracking-widest py-1">
            {formatTime(elapsed)}
          </div>

          {!showLog ? (
            <div className="flex gap-2">
              {!running ? (
                <button onClick={() => setRunning(true)}
                  className="flex-1 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 text-white font-semibold text-sm">
                  {elapsed === 0 ? '▶ Start' : '▶ Resume'}
                </button>
              ) : (
                <button onClick={() => setRunning(false)}
                  className="flex-1 py-2.5 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white font-semibold text-sm">
                  ⏸ Pause
                </button>
              )}
              {elapsed > 0 && (
                <>
                  <button onClick={() => { setRunning(false); setShowLog(true) }}
                    className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
                    ✓ Done
                  </button>
                  <button onClick={reset}
                    className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm">
                    Reset
                  </button>
                </>
              )}
            </div>
          ) : saved ? (
            <div className="text-center text-green-400 text-sm font-medium py-2">✓ Session logged!</div>
          ) : (
            <div className="space-y-3">
              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400">What did you work on?</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. learned the intro to Landslide, worked on fingerpicking..."
                  className="w-full rounded bg-gray-700 border border-gray-600 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  autoFocus
                />
              </div>

              {/* BPM */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400 shrink-0">BPM practiced</label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={bpm}
                  onChange={e => setBpm(e.target.value)}
                  placeholder="—"
                  className="w-20 rounded bg-gray-700 border border-gray-600 text-gray-100 px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={handleLog} disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm">
                  {saving ? 'Saving…' : `✓ Log ${formatTime(elapsed)}`}
                </button>
                <button onClick={reset}
                  className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm">
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
