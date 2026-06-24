'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  defaultBpm?: number
}

const MIN_BPM = 40
const MAX_BPM = 300
const LOOKAHEAD_MS = 100
const SCHEDULE_INTERVAL_MS = 25

// ── iOS silent-switch workaround ────────────────────────────────────────────
// iOS mutes Web Audio API when the ringer switch is off. Playing a real (even
// nearly-inaudible) audio file through HTMLAudioElement switches the iOS audio
// session to "Playback" mode, which ignores the silent switch — the same
// category used by music and podcast apps.
function buildSessionKeeperUrl(): string {
  const sr = 8000
  const n = sr // 1 second of 440 Hz sine at volume ~0.3%
  const buf = new ArrayBuffer(44 + n * 2)
  const v = new DataView(buf)
  const s = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)))
  s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE')
  s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true)
  v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true)
  v.setUint16(32, 2, true); v.setUint16(34, 16, true)
  s(36, 'data'); v.setUint32(40, n * 2, true)
  for (let i = 0; i < n; i++) {
    // 440 Hz sine wave at amplitude 100/32767 ≈ 0.3% — effectively inaudible
    v.setInt16(44 + i * 2, Math.round(Math.sin(2 * Math.PI * 440 * i / sr) * 100), true)
  }
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }))
}

// ── Click sound generation ───────────────────────────────────────────────────
function makeClickBuffer(ctx: AudioContext, freq: number, amp: number): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * 0.08)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    const t = i / ctx.sampleRate
    data[i] = amp * Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 60)
  }
  return buf
}

function playClick(ctx: AudioContext, buf: AudioBuffer, time: number) {
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.connect(ctx.destination)
  src.start(time)
}

export default function Metronome({ defaultBpm = 80 }: Props) {
  const [bpm, setBpm] = useState(defaultBpm)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4)
  const [accentOn, setAccentOn] = useState(true)
  const [flashBeat, setFlashBeat] = useState<number | null>(null)
  const [editingBpm, setEditingBpm] = useState(false)
  const [bpmDraft, setBpmDraft] = useState(String(defaultBpm))
  const bpmInputRef = useRef<HTMLInputElement>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const accentBufRef = useRef<AudioBuffer | null>(null)
  const beatBufRef = useRef<AudioBuffer | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const nextBeatTimeRef = useRef(0)
  const beatCountRef = useRef(0)
  const sessionAudioRef = useRef<HTMLAudioElement | null>(null)
  const sessionUrlRef = useRef<string | null>(null)

  // Always-fresh refs to avoid stale closures in setInterval
  const bpmRef = useRef(bpm)
  const beatsRef = useRef(beatsPerMeasure)
  const accentRef = useRef(accentOn)
  useEffect(() => { bpmRef.current = bpm; setBpmDraft(String(bpm)) }, [bpm])
  useEffect(() => { beatsRef.current = beatsPerMeasure }, [beatsPerMeasure])
  useEffect(() => { accentRef.current = accentOn }, [accentOn])

  const getCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      accentBufRef.current = makeClickBuffer(ctx, 1050, 0.8)
      beatBufRef.current = makeClickBuffer(ctx, 820, 0.5)
    }
    return audioCtxRef.current
  }, [])

  const scheduler = useCallback(() => {
    const ctx = audioCtxRef.current
    if (!ctx || !accentBufRef.current || !beatBufRef.current) return
    const lookahead = LOOKAHEAD_MS / 1000
    const spb = 60 / bpmRef.current
    while (nextBeatTimeRef.current < ctx.currentTime + lookahead) {
      const beat = beatCountRef.current % beatsRef.current
      const isAccent = accentRef.current && beat === 0
      playClick(ctx, isAccent ? accentBufRef.current! : beatBufRef.current!, nextBeatTimeRef.current)
      const delay = Math.max(0, (nextBeatTimeRef.current - ctx.currentTime) * 1000 - 10)
      const b = beat
      setTimeout(() => { setFlashBeat(b); setTimeout(() => setFlashBeat(null), 80) }, delay)
      nextBeatTimeRef.current += spb
      beatCountRef.current++
    }
  }, [])

  const start = useCallback(() => {
    // 1. Start the session keeper audio element — this switches iOS audio
    //    session to Playback mode, bypassing the silent/ringer switch.
    if (!sessionAudioRef.current) {
      const url = buildSessionKeeperUrl()
      sessionUrlRef.current = url
      const a = new Audio(url)
      a.loop = true
      a.volume = 0.001 // ~0.1% volume — inaudible but present
      sessionAudioRef.current = a
    }
    sessionAudioRef.current.play().catch(() => {})

    // 2. Start Web Audio
    const ctx = getCtx()
    ctx.resume().then(() => {
      beatCountRef.current = 0
      nextBeatTimeRef.current = ctx.currentTime + 0.15
      intervalRef.current = setInterval(scheduler, SCHEDULE_INTERVAL_MS)
      setIsPlaying(true)
    })
  }, [getCtx, scheduler])

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    sessionAudioRef.current?.pause()
    setIsPlaying(false)
    setFlashBeat(null)
  }, [])

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    sessionAudioRef.current?.pause()
    audioCtxRef.current?.close()
    if (sessionUrlRef.current) URL.revokeObjectURL(sessionUrlRef.current)
  }, [])

  // BPM editing
  const commitBpm = useCallback(() => {
    const val = parseInt(bpmDraft, 10)
    if (!isNaN(val)) setBpm(Math.min(MAX_BPM, Math.max(MIN_BPM, val)))
    else setBpmDraft(String(bpm))
    setEditingBpm(false)
  }, [bpmDraft, bpm])

  const openBpmEdit = useCallback(() => {
    setBpmDraft(String(bpm))
    setEditingBpm(true)
    setTimeout(() => bpmInputRef.current?.select(), 0)
  }, [bpm])

  const dots = Array.from({ length: beatsPerMeasure }, (_, i) => i)

  return (
    <div className="rounded-lg bg-gray-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-100">Metronome</h3>
        <div className="flex gap-2">
          {dots.map(i => (
            <div key={i} className={`w-3 h-3 rounded-full transition-all duration-75 ${
              flashBeat === i
                ? i === 0 ? 'bg-indigo-300 scale-150' : 'bg-green-400 scale-125'
                : 'bg-gray-600'
            }`} />
          ))}
        </div>
      </div>

      {/* BPM */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">BPM</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setBpm(b => Math.max(MIN_BPM, b - 5))}
              className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-bold">−</button>

            {editingBpm ? (
              <input ref={bpmInputRef} type="number" inputMode="numeric"
                value={bpmDraft}
                onChange={e => setBpmDraft(e.target.value)}
                onBlur={commitBpm}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitBpm()
                  if (e.key === 'Escape') { setBpmDraft(String(bpm)); setEditingBpm(false) }
                }}
                className="w-16 text-center font-mono text-lg font-bold bg-gray-700 border border-indigo-500 rounded text-gray-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            ) : (
              <button onClick={openBpmEdit} title="Tap to type BPM"
                className="w-16 text-center font-mono text-lg font-bold text-gray-100 hover:text-indigo-300 hover:bg-gray-700 rounded px-1 transition-colors">
                {bpm}
              </button>
            )}

            <button onClick={() => setBpm(b => Math.min(MAX_BPM, b + 5))}
              className="w-7 h-7 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-bold">+</button>
          </div>
        </div>
        <input type="range" min={MIN_BPM} max={MAX_BPM} value={bpm}
          onChange={e => setBpm(Number(e.target.value))}
          className="w-full accent-indigo-500" />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Beats</span>
          {[2, 3, 4].map(n => (
            <button key={n} onClick={() => setBeatsPerMeasure(n)}
              className={`w-7 h-7 rounded text-sm font-mono ${beatsPerMeasure === n ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {n}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-sm text-gray-400 cursor-pointer ml-auto">
          <input type="checkbox" checked={accentOn} onChange={e => setAccentOn(e.target.checked)} className="accent-indigo-500" />
          Accent beat 1
        </label>
      </div>

      <button onClick={isPlaying ? stop : start}
        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
          isPlaying ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
        }`}>
        {isPlaying ? '⏹ Stop' : '▶ Start'}
      </button>
    </div>
  )
}
