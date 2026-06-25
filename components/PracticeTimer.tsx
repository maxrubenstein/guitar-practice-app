'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  onSessionComplete: (durationSeconds: number, bpm: number | null) => Promise<void>
  currentBpm?: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function PracticeTimer({ onSessionComplete, currentBpm }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [logBpm, setLogBpm] = useState<string>('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = useCallback(() => {
    setRunning(true)
  }, [])

  const pause = useCallback(() => {
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    setRunning(false)
    setElapsed(0)
    setShowLog(false)
    setLogBpm('')
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const handleFinish = useCallback(() => {
    pause()
    setLogBpm(currentBpm ? String(currentBpm) : '')
    setShowLog(true)
  }, [pause, currentBpm])

  const handleLog = useCallback(async () => {
    if (elapsed === 0) return
    setSaving(true)
    const bpmVal = logBpm.trim() ? parseInt(logBpm, 10) : null
    await onSessionComplete(elapsed, isNaN(bpmVal!) ? null : bpmVal)
    setSaving(false)
    reset()
  }, [elapsed, logBpm, onSessionComplete, reset])

  return (
    <div className="rounded-lg bg-gray-800 p-5 space-y-4">
      <h3 className="font-semibold text-gray-100">Practice Timer</h3>

      <div className="text-5xl font-mono font-bold text-center text-gray-100 tracking-widest py-2">
        {formatTime(elapsed)}
      </div>

      {!showLog ? (
        <div className="flex gap-2">
          {!running ? (
            <button
              onClick={start}
              className="flex-1 py-2.5 rounded-lg bg-green-700 hover:bg-green-600 text-white font-semibold text-sm"
            >
              {elapsed === 0 ? '▶ Start' : '▶ Resume'}
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex-1 py-2.5 rounded-lg bg-yellow-700 hover:bg-yellow-600 text-white font-semibold text-sm"
            >
              ⏸ Pause
            </button>
          )}
          {elapsed > 0 && (
            <>
              <button
                onClick={handleFinish}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm"
              >
                ✓ Done
              </button>
              <button
                onClick={reset}
                className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
              >
                Reset
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">Log this session? ({formatTime(elapsed)})</p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400 shrink-0">BPM practiced</label>
            <input
              type="number"
              inputMode="numeric"
              value={logBpm}
              onChange={e => setLogBpm(e.target.value)}
              placeholder="—"
              className="w-20 rounded bg-gray-700 border border-gray-600 text-gray-100 px-2 py-1.5 text-sm font-mono focus:outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLog}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm"
            >
              {saving ? 'Saving…' : '✓ Log Session'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
