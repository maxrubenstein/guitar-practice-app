'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  defaultBpm?: number
}

const MIN_BPM = 40
const MAX_BPM = 200
const LOOKAHEAD_MS = 100
const SCHEDULE_INTERVAL_MS = 25

export default function Metronome({ defaultBpm = 80 }: Props) {
  const [bpm, setBpm] = useState(defaultBpm)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const [accentOn, setAccentOn] = useState(true)
  const [currentBeat, setCurrentBeat] = useState(0) // 0-indexed, for visual pulse

  const audioCtxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextBeatTimeRef = useRef(0)
  const beatCountRef = useRef(0) // tracks which beat in the measure (0-indexed)
  const scheduledBeatsRef = useRef<number[]>([]) // AudioContext times of upcoming beats

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    return audioCtxRef.current
  }, [])

  const scheduleBeat = useCallback((time: number, isAccent: boolean) => {
    const ctx = getAudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.frequency.value = isAccent ? 1000 : 800
    osc.type = 'sine'

    gain.gain.setValueAtTime(0.001, time)
    gain.gain.exponentialRampToValueAtTime(0.4, time + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)

    osc.start(time)
    osc.stop(time + 0.06)

    scheduledBeatsRef.current.push(time)
    osc.onended = () => {
      scheduledBeatsRef.current = scheduledBeatsRef.current.filter(t => t !== time)
    }
  }, [getAudioCtx])

  const scheduler = useCallback(() => {
    const ctx = getAudioCtx()
    const secondsPerBeat = 60 / bpm
    const lookahead = LOOKAHEAD_MS / 1000

    while (nextBeatTimeRef.current < ctx.currentTime + lookahead) {
      const beat = beatCountRef.current % beatsPerMeasure
      const isAccent = accentOn && beat === 0
      scheduleBeat(nextBeatTimeRef.current, isAccent)
      nextBeatTimeRef.current += secondsPerBeat
      beatCountRef.current++
    }
  }, [bpm, beatsPerMeasure, accentOn, scheduleBeat, getAudioCtx])

  // Visual pulse via rAF
  useEffect(() => {
    if (!isPlaying) return
    let rafId: number

    const tick = () => {
      const ctx = audioCtxRef.current
      if (ctx) {
        const now = ctx.currentTime
        // Find the most recently passed scheduled beat
        const past = scheduledBeatsRef.current.filter(t => t <= now + 0.01)
        if (past.length > 0) {
          const beat = beatCountRef.current % beatsPerMeasure
          setCurrentBeat(beat)
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [isPlaying, beatsPerMeasure])

  const start = useCallback(async () => {
    const ctx = getAudioCtx()
    if (ctx.state === 'suspended') await ctx.resume()
    beatCountRef.current = 0
    nextBeatTimeRef.current = ctx.currentTime + 0.05
    intervalRef.current = setInterval(scheduler, SCHEDULE_INTERVAL_MS)
    setIsPlaying(true)
  }, [getAudioCtx, scheduler])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
    setIsPlaying(false)
    setCurrentBeat(0)
    scheduledBeatsRef.current = []
  }, [])

  // Restart scheduler when bpm/beats change while playing
  useEffect(() => {
    if (!isPlaying) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(scheduler, SCHEDULE_INTERVAL_MS)
  }, [isPlaying, scheduler])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      audioCtxRef.current?.close()
    }
  }, [])

  const dots = Array.from({ length: beatsPerMeasure }, (_, i) => i)

  return (
    <div className="rounded-lg bg-gray-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-100">Metronome</h3>
        <div className="flex gap-2">
          {dots.map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-75 ${
                isPlaying && currentBeat % beatsPerMeasure === i
                  ? i === 0
                    ? 'bg-indigo-400 scale-125'
                    : 'bg-green-400 scale-110'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* BPM */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">BPM</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBpm(b => Math.max(MIN_BPM, b - 5))}
              className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-bold"
            >−</button>
            <span className="w-12 text-center font-mono text-lg font-bold text-gray-100">
              {bpm}
            </span>
            <button
              onClick={() => setBpm(b => Math.min(MAX_BPM, b + 5))}
              className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-bold"
            >+</button>
          </div>
        </div>
        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Beats</span>
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => setBeatsPerMeasure(n)}
              className={`w-7 h-7 rounded text-sm font-mono ${
                beatsPerMeasure === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={accentOn}
            onChange={e => setAccentOn(e.target.checked)}
            className="accent-indigo-500"
          />
          Accent beat 1
        </label>
      </div>

      {/* Play / Stop */}
      <button
        onClick={isPlaying ? stop : start}
        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
          isPlaying
            ? 'bg-red-700 hover:bg-red-600 text-white'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}
      >
        {isPlaying ? '⏹ Stop' : '▶ Start'}
      </button>
    </div>
  )
}
