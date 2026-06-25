/**
 * Idempotent curriculum seed — safe to re-run.
 * Run with: npx tsx supabase/seed.ts
 *
 * Strategy:
 * - day_orders 1–7  → upserted (update if exists, preserves Week 1 + early Week 2 progress)
 * - day_orders 8+   → old stubs deleted first (no user progress there), then re-inserted
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Tab data ─────────────────────────────────────────────────────────────────

// Week 1
const W1_ASC = [
  {string:'E',fret:3,position:0},{string:'A',fret:0,position:1},
  {string:'A',fret:2,position:2},{string:'A',fret:3,position:3},
  {string:'D',fret:0,position:4},{string:'D',fret:2,position:5},
  {string:'D',fret:4,position:6},{string:'G',fret:0,position:7},
  {string:'G',fret:2,position:8},{string:'B',fret:0,position:9},
  {string:'B',fret:1,position:10},{string:'B',fret:3,position:11},
  {string:'e',fret:0,position:12},{string:'e',fret:2,position:13},
  {string:'e',fret:3,position:14},
]
const W1_DESC = [
  {string:'e',fret:3,position:0},{string:'e',fret:2,position:1},
  {string:'e',fret:0,position:2},{string:'B',fret:3,position:3},
  {string:'B',fret:1,position:4},{string:'B',fret:0,position:5},
  {string:'G',fret:2,position:6},{string:'G',fret:0,position:7},
  {string:'D',fret:4,position:8},{string:'D',fret:2,position:9},
  {string:'D',fret:0,position:10},{string:'A',fret:3,position:11},
  {string:'A',fret:2,position:12},{string:'A',fret:0,position:13},
  {string:'E',fret:3,position:14},
]
const W1_THIRDS = [
  {string:'E',fret:3,position:0},{string:'A',fret:2,position:1},
  {string:'A',fret:0,position:2},{string:'A',fret:3,position:3},
  {string:'A',fret:2,position:4},{string:'D',fret:0,position:5},
  {string:'A',fret:3,position:6},{string:'D',fret:2,position:7},
  {string:'D',fret:0,position:8},{string:'D',fret:4,position:9},
  {string:'D',fret:2,position:10},{string:'G',fret:0,position:11},
  {string:'D',fret:4,position:12},{string:'G',fret:2,position:13},
  {string:'G',fret:0,position:14},{string:'B',fret:0,position:15},
  {string:'G',fret:2,position:16},{string:'B',fret:1,position:17},
  {string:'B',fret:0,position:18},{string:'B',fret:3,position:19},
  {string:'B',fret:1,position:20},{string:'e',fret:0,position:21},
  {string:'B',fret:3,position:22},{string:'e',fret:2,position:23},
  {string:'e',fret:0,position:24},{string:'e',fret:3,position:25},
]

// Week 2 — CAGED system, G major
const W2_G_SHAPE = [
  {string:'E',fret:0,position:0},{string:'E',fret:2,position:1},{string:'E',fret:3,position:2},
  {string:'A',fret:0,position:3},{string:'A',fret:2,position:4},{string:'A',fret:3,position:5},
  {string:'D',fret:0,position:6},{string:'D',fret:2,position:7},{string:'D',fret:4,position:8},
  {string:'G',fret:0,position:9},{string:'G',fret:2,position:10},
  {string:'B',fret:0,position:11},{string:'B',fret:1,position:12},{string:'B',fret:3,position:13},
  {string:'e',fret:0,position:14},{string:'e',fret:2,position:15},{string:'e',fret:3,position:16},
]
const W2_E_SHAPE = [
  {string:'E',fret:2,position:0},{string:'E',fret:3,position:1},{string:'E',fret:5,position:2},
  {string:'A',fret:2,position:3},{string:'A',fret:3,position:4},{string:'A',fret:5,position:5},
  {string:'D',fret:2,position:6},{string:'D',fret:4,position:7},{string:'D',fret:5,position:8},
  {string:'G',fret:2,position:9},{string:'G',fret:4,position:10},{string:'G',fret:5,position:11},
  {string:'B',fret:3,position:12},{string:'B',fret:5,position:13},
  {string:'e',fret:2,position:14},{string:'e',fret:3,position:15},{string:'e',fret:5,position:16},
]
const W2_D_SHAPE = [
  {string:'E',fret:5,position:0},{string:'E',fret:7,position:1},{string:'E',fret:8,position:2},
  {string:'A',fret:5,position:3},{string:'A',fret:7,position:4},
  {string:'D',fret:4,position:5},{string:'D',fret:5,position:6},{string:'D',fret:7,position:7},
  {string:'G',fret:4,position:8},{string:'G',fret:5,position:9},{string:'G',fret:7,position:10},
  {string:'B',fret:5,position:11},{string:'B',fret:7,position:12},
  {string:'e',fret:5,position:13},{string:'e',fret:7,position:14},{string:'e',fret:8,position:15},
]
const W2_C_SHAPE = [
  {string:'E',fret:7,position:0},{string:'E',fret:8,position:1},{string:'E',fret:10,position:2},
  {string:'A',fret:7,position:3},{string:'A',fret:9,position:4},{string:'A',fret:10,position:5},
  {string:'D',fret:7,position:6},{string:'D',fret:9,position:7},{string:'D',fret:10,position:8},
  {string:'G',fret:7,position:9},{string:'G',fret:9,position:10},
  {string:'B',fret:7,position:11},{string:'B',fret:8,position:12},{string:'B',fret:10,position:13},
  {string:'e',fret:7,position:14},{string:'e',fret:8,position:15},{string:'e',fret:10,position:16},
]
const W2_A_SHAPE = [
  {string:'E',fret:10,position:0},{string:'E',fret:12,position:1},
  {string:'A',fret:9,position:2},{string:'A',fret:10,position:3},{string:'A',fret:12,position:4},
  {string:'D',fret:9,position:5},{string:'D',fret:10,position:6},{string:'D',fret:12,position:7},
  {string:'G',fret:9,position:8},{string:'G',fret:11,position:9},{string:'G',fret:12,position:10},
  {string:'B',fret:10,position:11},{string:'B',fret:12,position:12},{string:'B',fret:13,position:13},
  {string:'e',fret:10,position:14},{string:'e',fret:12,position:15},
]
const W2_G_SHAPE_12 = [
  {string:'E',fret:12,position:0},{string:'E',fret:14,position:1},{string:'E',fret:15,position:2},
  {string:'A',fret:12,position:3},{string:'A',fret:14,position:4},{string:'A',fret:15,position:5},
  {string:'D',fret:12,position:6},{string:'D',fret:14,position:7},
  {string:'G',fret:11,position:8},{string:'G',fret:12,position:9},{string:'G',fret:14,position:10},
  {string:'B',fret:12,position:11},{string:'B',fret:13,position:12},{string:'B',fret:15,position:13},
  {string:'e',fret:12,position:14},{string:'e',fret:14,position:15},{string:'e',fret:15,position:16},
]

// Week 3 — Em pentatonic
const W3_PENTA_OPEN = [
  {string:'E',fret:0,position:0},{string:'E',fret:3,position:1},
  {string:'A',fret:0,position:2},{string:'A',fret:2,position:3},
  {string:'D',fret:0,position:4},{string:'D',fret:2,position:5},
  {string:'G',fret:0,position:6},{string:'G',fret:2,position:7},
  {string:'B',fret:0,position:8},{string:'B',fret:3,position:9},
  {string:'e',fret:0,position:10},{string:'e',fret:3,position:11},
]
const W3_PENTA_12 = [
  {string:'E',fret:12,position:0},{string:'E',fret:15,position:1},
  {string:'A',fret:12,position:2},{string:'A',fret:14,position:3},
  {string:'D',fret:12,position:4},{string:'D',fret:14,position:5},
  {string:'G',fret:12,position:6},{string:'G',fret:14,position:7},
  {string:'B',fret:12,position:8},{string:'B',fret:15,position:9},
  {string:'e',fret:12,position:10},{string:'e',fret:15,position:11},
]

// Week 4 — Color tones
const W4_COLOR_ASC = [
  {string:'E',fret:0,position:0},{string:'E',fret:2,position:1},{string:'E',fret:3,position:2},
  {string:'A',fret:0,position:3},{string:'A',fret:2,position:4},{string:'A',fret:3,position:5},
  {string:'D',fret:0,position:6},{string:'D',fret:2,position:7},{string:'D',fret:4,position:8},
  {string:'G',fret:0,position:9},{string:'G',fret:2,position:10},{string:'G',fret:4,position:11},
  {string:'B',fret:0,position:12},{string:'B',fret:1,position:13},{string:'B',fret:3,position:14},
  {string:'e',fret:0,position:15},{string:'e',fret:2,position:16},{string:'e',fret:3,position:17},
]
const W4_COLOR_DESC = [...W4_COLOR_ASC]
  .sort((a, b) => b.position - a.position)
  .map((n, i) => ({ ...n, position: i }))

// Week 5 — Legato
const W5_LEGATO = [
  {string:'E',fret:3,position:0},{string:'E',fret:5,position:1},{string:'E',fret:7,position:2},
  {string:'A',fret:3,position:3},{string:'A',fret:5,position:4},{string:'A',fret:7,position:5},
  {string:'D',fret:4,position:6},{string:'D',fret:5,position:7},{string:'D',fret:7,position:8},
  {string:'G',fret:4,position:9},{string:'G',fret:5,position:10},{string:'G',fret:7,position:11},
  {string:'B',fret:5,position:12},{string:'B',fret:7,position:13},{string:'B',fret:8,position:14},
  {string:'e',fret:5,position:15},{string:'e',fret:7,position:16},{string:'e',fret:8,position:17},
]

// Week 6 — Triads
const W6_TRIADS = [
  {string:'G',fret:0,position:0},{string:'B',fret:0,position:0},{string:'e',fret:3,position:0},
  {string:'G',fret:2,position:1},{string:'B',fret:1,position:1},{string:'e',fret:0,position:1},
  {string:'G',fret:4,position:2},{string:'B',fret:3,position:2},{string:'e',fret:2,position:2},
  {string:'G',fret:5,position:3},{string:'B',fret:5,position:3},{string:'e',fret:3,position:3},
]

// ─── Curriculum ───────────────────────────────────────────────────────────────

interface TabDef { label: string; notes: object[] }
interface LessonDef {
  week: number; day_order: number; title: string; focus: string
  instructions: string; default_bpm: number; target_bpm: number
  suggested_minutes: number; tabs: TabDef[]
}

const CURRICULUM: LessonDef[] = [
  // ── Week 1 ──────────────────────────────────────────────────────────────────
  {
    week:1, day_order:1,
    title:'G Major — Open Position, Ascending',
    focus:'Single-direction scale run, strict alternate picking',
    instructions:'Slow metronome, strict alternate picking (down-up-down-up), play clean before increasing tempo. Let open strings ring; on the D string (frets 0-2-4) use fingers 1 and 3.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'Ascending scale', notes:W1_ASC}],
  },
  {
    week:1, day_order:2,
    title:'G Major — Open Position, Descending',
    focus:'Reverse direction, even picking coming down',
    instructions:'Same scale in reverse, high G down to low G. Watch that descending picking stays as even as ascending — most people get sloppy coming down.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'Descending scale', notes:W1_DESC}],
  },
  {
    week:1, day_order:3,
    title:'G Major — 3rds Drill',
    focus:'Breaking the straight up/down autopilot',
    instructions:'Play in 3rds — 1-3, 2-4, 3-5, 4-6... (play a note, skip the next, come back, move up). This breaks the straight up/down autopilot and is genuinely harder; keep it slow. Pairs ascend: G-B, A-C, B-D, C-E, D-F#, E-G, F#-A, G-B...',
    default_bpm:50, target_bpm:80, suggested_minutes:15,
    tabs:[{label:'3rds drill', notes:W1_THIRDS}],
  },
  {
    week:1, day_order:4,
    title:'G Major — Fluency Check',
    focus:'Clean execution at higher tempo across all three patterns',
    instructions:'No new material. Run 1.1, 1.2, and 1.3 back to back, aiming for clean execution at a higher tempo than earlier in the week. Use this day to decide if Week 1 is "mastered" before advancing.',
    default_bpm:80, target_bpm:110, suggested_minutes:20,
    tabs:[
      {label:'Ascending scale', notes:W1_ASC},
      {label:'Descending scale', notes:W1_DESC},
      {label:'3rds drill', notes:W1_THIRDS},
    ],
  },

  // ── Week 2 — CAGED system ───────────────────────────────────────────────────
  {
    week:2, day_order:5,
    title:'CAGED — Area 1: G Shape (frets 0–3)',
    focus:'Full G major scale in the open position, all available notes',
    instructions:'The open "G shape" — covers all G major notes in the first three frets. Start from the lowest note (open E) and work up to the highest. This is more notes than Week 1 because we\'re filling in the complete shape. Drill ascending/descending until automatic.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'G Shape (open position)', notes:W2_G_SHAPE}],
  },
  {
    week:2, day_order:6,
    title:'CAGED — Area 2: E Shape (frets 2–5)',
    focus:'Anchored on the E-barre G chord at fret 3',
    instructions:'The "E shape" — anchored on the E-barre-shape G chord at fret 3. Overlaps with the G shape by one fret. Same notes, new pattern. Drill ascending/descending.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'E Shape (frets 2–5)', notes:W2_E_SHAPE}],
  },
  {
    week:2, day_order:7,
    title:'CAGED — Area 3: D Shape (frets 4–8)',
    focus:'Mid-neck position, anchored on the D-shape G chord',
    instructions:'The "D shape" — the middle of the neck. Notice the three-notes-per-string groupings and where the whole/half steps land. Drill ascending/descending.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'D Shape (frets 4–8)', notes:W2_D_SHAPE}],
  },
  {
    week:2, day_order:8,
    title:'CAGED — Area 4: C Shape (frets 7–10)',
    focus:'Upper-mid neck, anchored on the C-shape G chord',
    instructions:'The "C shape" — anchored on the open C barre shape transposed to G. Watch the two-note group on the G string (frets 7 and 9 — no third note before crossing to B). Drill ascending/descending.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'C Shape (frets 7–10)', notes:W2_C_SHAPE}],
  },
  {
    week:2, day_order:9,
    title:'CAGED — Area 5: A Shape (frets 9–13)',
    focus:'High-neck position, anchored on the A-barre G chord at fret 10',
    instructions:'The "A shape" — anchored on the A-barre-shape G chord at fret 10. Three-notes-per-string on most strings. The highest position before looping back. Drill ascending/descending.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'A Shape (frets 9–13)', notes:W2_A_SHAPE}],
  },
  {
    week:2, day_order:10,
    title:'CAGED — Area 1a: G Shape at the 12th (frets 11–15)',
    focus:'Closing the loop — the G shape one octave higher',
    instructions:'The open G shape one octave up — closes the loop around the neck. You\'ve now covered every G major note on the guitar. Once two adjacent shapes are solid, practice shifting between them without stopping. The goal is one connected fretboard, not six islands.',
    default_bpm:60, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'G Shape at 12th fret', notes:W2_G_SHAPE_12}],
  },

  // ── Week 3 — Em pentatonic ──────────────────────────────────────────────────
  {
    week:3, day_order:11,
    title:'Em Pentatonic — Open Position (frets 0–3)',
    focus:'The pentatonic box in open position',
    instructions:'Notes E G A B D E G A B D E G. Two notes per string, completely different spacing from the major scale. Drill ascending and descending until the shape is automatic.',
    default_bpm:60, target_bpm:110, suggested_minutes:15,
    tabs:[{label:'Em pentatonic, open', notes:W3_PENTA_OPEN}],
  },
  {
    week:3, day_order:12,
    title:'Em Pentatonic — 12th-Fret Box',
    focus:'The classic "box 1" shape at the 12th fret',
    instructions:'Same shape as the open position, just 12 frets up. Notice it\'s identical — same interval layout, same two-notes-per-string pattern. Drill ascending and descending.',
    default_bpm:60, target_bpm:110, suggested_minutes:15,
    tabs:[{label:'Em pentatonic, 12th fret', notes:W3_PENTA_12}],
  },
  {
    week:3, day_order:13,
    title:'Em Pentatonic — Connect Open ↔ 12th Box',
    focus:'Same shape, two octaves apart — hearing the identity',
    instructions:'Same shape, two octaves apart — play one then the other, hearing they\'re identical. The goal is to stop thinking of them as different patterns and start hearing them as the same sound in two places.',
    default_bpm:60, target_bpm:110, suggested_minutes:15,
    tabs:[
      {label:'Open box', notes:W3_PENTA_OPEN},
      {label:'12th-fret box', notes:W3_PENTA_12},
    ],
  },

  // ── Week 4 — Color tones ────────────────────────────────────────────────────
  {
    week:4, day_order:14,
    title:'Pentatonic + Color Tones — Ascending (major/minor blur)',
    focus:'Adding the 2nd (F#) and 6th (C) to soften the pentatonic sound',
    instructions:'Notes E F# G A B C D E F# G A B C D E F# G. Adding the 2nd and 6th fills the pentatonic out toward the full natural-minor / G-major color. Listen for how it softens the "rock pentatonic" sound — this is the more ambiguous, melodic vocabulary you\'re after.',
    default_bpm:55, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'Ascending with color tones', notes:W4_COLOR_ASC}],
  },
  {
    week:4, day_order:15,
    title:'Pentatonic + Color Tones — Descending',
    focus:'Descending direction, same colors',
    instructions:'Reverse of 4.1. Listen for how the added 2nd and 6th change the descending feel. Most players find the color tones land more expressively coming down. Keep it slow enough to really hear each note.',
    default_bpm:55, target_bpm:100, suggested_minutes:15,
    tabs:[{label:'Descending with color tones', notes:W4_COLOR_DESC}],
  },

  // ── Week 5 — Legato + fingerstyle ──────────────────────────────────────────
  {
    week:5, day_order:16,
    title:'Legato — 3-Note-Per-String G Major Run',
    focus:'Pick only the first note per string; hammer-on the rest',
    instructions:'Pick ONLY the first note on each string; hammer-on the next two ascending, pull-off descending. Aim for even volume between picked and slurred notes — the slurred notes should not disappear. Notes G A B C D E F# G A B C D E F# G A B C.',
    default_bpm:50, target_bpm:90, suggested_minutes:20,
    tabs:[{label:'3-note-per-string legato run', notes:W5_LEGATO}],
  },
  {
    week:5, day_order:17,
    title:'Fingerstyle Day — No Pick',
    focus:'Same run as 5.1, thumb and index/middle alternating',
    instructions:'Drop the pick for the whole session — thumb and index/middle alternating. Notice how dynamics and string noise change. This texture (fingertip attack, no pick transient) is core to the target sound. Same run as lesson 5.1.',
    default_bpm:50, target_bpm:90, suggested_minutes:20,
    tabs:[{label:'Fingerstyle run (same as 5.1)', notes:W5_LEGATO}],
  },

  // ── Week 6 — Chordal lead + phrasing ───────────────────────────────────────
  {
    week:6, day_order:18,
    title:'Chordal Lead — Diatonic Triads on Top 3 Strings',
    focus:'Moving chord shapes up the scale diatonically',
    instructions:'Each triad (G, Am, Bm, C) shown below — three notes played together. Strum or pluck all three strings at once. Move the shape up the scale; this is the "lead lines inside chord shapes" move. Keep it slow and listen for the harmony.',
    default_bpm:50, target_bpm:85, suggested_minutes:20,
    tabs:[{label:'Diatonic triads, G–Am–Bm–C', notes:W6_TRIADS}],
  },
  {
    week:6, day_order:19,
    title:'Behind-the-Beat Phrasing',
    focus:'Deliberately dragging behind the click',
    instructions:'No new tab. Reuse the triads from 6.1 and the color-tone scale from Week 4. Set the metronome slow and deliberately play each triad/note a hair BEHIND the click — not locked to it. Record yourself and listen for the relaxed, dragging feel. That\'s the target.',
    default_bpm:50, target_bpm:85, suggested_minutes:20,
    tabs:[
      {label:'Triads (from 6.1)', notes:W6_TRIADS},
      {label:'Color-tone scale (from 4.1)', notes:W4_COLOR_ASC},
    ],
  },

  // ── Week 7 — Ear training ───────────────────────────────────────────────────
  {
    week:7, day_order:20,
    title:'Ear Training — Transcribe a 4-Bar Phrase',
    focus:'Figure it out by ear before looking anything up',
    instructions:'Pick a short phrase from a song you like — don\'t look up the tab. Spend at least 20 minutes finding it on the neck by ear. Start with the first note (hum it, find it on the low E), then work note by note. Log what you find in the notes field below.',
    default_bpm:60, target_bpm:100, suggested_minutes:25,
    tabs:[],
  },
  {
    week:7, day_order:21,
    title:'Lower-Tuning Touch',
    focus:'Slack strings change your touch and vibrato',
    instructions:'Detune to Drop D (or lower) and replay the Week 4 color-tone scale by feel. The fret patterns shift in pitch but the physical pattern stays the same. Notice how the slack strings respond differently to picking pressure and how vibrato feels looser. Reference tab below.',
    default_bpm:55, target_bpm:100, suggested_minutes:25,
    tabs:[{label:'Color-tone scale (Week 4.1, plays lower in drop tuning)', notes:W4_COLOR_ASC}],
  },

  // ── Week 8 — Improv ─────────────────────────────────────────────────────────
  {
    week:8, day_order:22,
    title:'Improv — Legato + Chordal Lead Over Em Vamp',
    focus:'No straight scale runs — only the vocabulary from Weeks 5–6',
    instructions:'Improvise over an Em–G–C–D loop using ONLY legato (Week 5) and chordal-lead (Week 6) ideas. Straight up/down scale runs are not allowed. Force the new vocabulary to surface. Reference scale below to remind yourself of the notes.',
    default_bpm:70, target_bpm:120, suggested_minutes:25,
    tabs:[{label:'Color-tone scale reference (Week 4.1)', notes:W4_COLOR_ASC}],
  },
  {
    week:8, day_order:23,
    title:'Record & Review',
    focus:'Close the loop — one thing that worked, one to fix',
    instructions:'Record one full improv pass over the Em–G–C–D vamp. Listen back. Note one thing that worked and one thing to fix in the notes field below. This closes the 8-week loop. If you want to keep going, revisit any week\'s lessons and push the target BPM.',
    default_bpm:70, target_bpm:120, suggested_minutes:25,
    tabs:[],
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function seed() {
  // Remove old stub lessons at day_order >= 8 (no user progress on these).
  // day_orders 1–7 are upserted below so Week 1 + early Week 2 progress is safe.
  console.log('Removing old stubs at day_order >= 8...')
  const { error: delErr } = await supabase.from('lessons').delete().gte('day_order', 8)
  if (delErr) { console.error('Delete failed:', delErr); process.exit(1) }

  console.log('Seeding curriculum (preserving day_orders 1–7 progress)...')

  for (const lesson of CURRICULUM) {
    const { tabs, ...lessonData } = lesson

    let lessonId: string

    if (lesson.day_order <= 7) {
      // Upsert — keep existing ID so linked progress rows survive
      const { data: existing } = await supabase
        .from('lessons')
        .select('id')
        .eq('week', lessonData.week)
        .eq('day_order', lessonData.day_order)
        .maybeSingle()

      if (existing) {
        await supabase.from('lessons').update(lessonData).eq('id', existing.id)
        lessonId = existing.id
        console.log(`  Updated  ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
      } else {
        const { data, error } = await supabase.from('lessons').insert(lessonData).select('id').single()
        if (error || !data) { console.error('Insert error:', error); continue }
        lessonId = data.id
        console.log(`  Inserted ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
      }
    } else {
      // Fresh insert (old stubs were deleted above)
      const { data, error } = await supabase.from('lessons').insert(lessonData).select('id').single()
      if (error || !data) { console.error('Insert error:', error); continue }
      lessonId = data.id
      console.log(`  Inserted ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
    }

    // Refresh tabs
    await supabase.from('lesson_tabs').delete().eq('lesson_id', lessonId)
    for (let i = 0; i < tabs.length; i++) {
      const { error } = await supabase.from('lesson_tabs').insert({
        lesson_id: lessonId, label: tabs[i].label,
        notes: tabs[i].notes, order_index: i,
      })
      if (error) console.error('  Tab error:', error)
    }
  }

  console.log(`\nDone — ${CURRICULUM.length} lessons seeded.`)
}

seed().catch(console.error)
