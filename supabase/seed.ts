/**
 * Idempotent curriculum seed — safe to re-run.
 * Run with: npx tsx supabase/seed.ts
 *
 * WARNING: this script deletes ALL lessons (and cascades to lesson_tabs,
 * progress, and practice_sessions) before re-inserting. It is designed for
 * a freshly built app where you want clean curriculum data.
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
const W1_ASCENDING = [
  {string:'E',fret:3,position:0},{string:'A',fret:0,position:1},
  {string:'A',fret:2,position:2},{string:'A',fret:3,position:3},
  {string:'D',fret:0,position:4},{string:'D',fret:2,position:5},
  {string:'D',fret:4,position:6},{string:'G',fret:0,position:7},
  {string:'G',fret:2,position:8},{string:'B',fret:0,position:9},
  {string:'B',fret:1,position:10},{string:'B',fret:3,position:11},
  {string:'e',fret:0,position:12},{string:'e',fret:2,position:13},
  {string:'e',fret:3,position:14},
]
const W1_DESCENDING = [
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

// Week 2
const W2_ESHAPE = [
  {string:'E',fret:3,position:0},{string:'E',fret:5,position:1},
  {string:'A',fret:2,position:2},{string:'A',fret:3,position:3},
  {string:'A',fret:5,position:4},{string:'D',fret:2,position:5},
  {string:'D',fret:4,position:6},{string:'D',fret:5,position:7},
  {string:'G',fret:2,position:8},{string:'G',fret:4,position:9},
  {string:'G',fret:5,position:10},{string:'B',fret:3,position:11},
  {string:'B',fret:5,position:12},{string:'e',fret:3,position:13},
  {string:'e',fret:5,position:14},
]
const W2_ASHAPE = [
  {string:'E',fret:7,position:0},{string:'E',fret:8,position:1},
  {string:'E',fret:10,position:2},{string:'A',fret:7,position:3},
  {string:'A',fret:9,position:4},{string:'A',fret:10,position:5},
  {string:'D',fret:7,position:6},{string:'D',fret:9,position:7},
  {string:'D',fret:10,position:8},{string:'G',fret:7,position:9},
  {string:'G',fret:9,position:10},{string:'B',fret:8,position:11},
  {string:'B',fret:10,position:12},{string:'e',fret:7,position:13},
  {string:'e',fret:8,position:14},{string:'e',fret:10,position:15},
]

// Week 3
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

// Week 4
const W4_COLOR_ASC = [
  {string:'E',fret:0,position:0},{string:'E',fret:2,position:1},
  {string:'E',fret:3,position:2},{string:'A',fret:0,position:3},
  {string:'A',fret:2,position:4},{string:'A',fret:3,position:5},
  {string:'D',fret:0,position:6},{string:'D',fret:2,position:7},
  {string:'D',fret:4,position:8},{string:'G',fret:0,position:9},
  {string:'G',fret:2,position:10},{string:'G',fret:4,position:11},
  {string:'B',fret:0,position:12},{string:'B',fret:1,position:13},
  {string:'B',fret:3,position:14},{string:'e',fret:0,position:15},
  {string:'e',fret:2,position:16},{string:'e',fret:3,position:17},
]
// 4.2 descending = 4.1 reversed
const W4_COLOR_DESC = [...W4_COLOR_ASC]
  .sort((a, b) => b.position - a.position)
  .map((n, i) => ({ ...n, position: i }))

// Week 5
const W5_LEGATO = [
  {string:'E',fret:3,position:0},{string:'E',fret:5,position:1},
  {string:'E',fret:7,position:2},{string:'A',fret:3,position:3},
  {string:'A',fret:5,position:4},{string:'A',fret:7,position:5},
  {string:'D',fret:4,position:6},{string:'D',fret:5,position:7},
  {string:'D',fret:7,position:8},{string:'G',fret:4,position:9},
  {string:'G',fret:5,position:10},{string:'G',fret:7,position:11},
  {string:'B',fret:5,position:12},{string:'B',fret:7,position:13},
  {string:'B',fret:8,position:14},{string:'e',fret:5,position:15},
  {string:'e',fret:7,position:16},{string:'e',fret:8,position:17},
]

// Week 6
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
    week: 1, day_order: 1,
    title: 'G Major — Open Position, Ascending',
    focus: 'Single-direction scale run, strict alternate picking',
    instructions: 'Slow metronome, strict alternate picking (down-up-down-up), play clean before increasing tempo. Let open strings ring; on the D string (frets 0-2-4) use fingers 1 and 3.',
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Ascending scale', notes: W1_ASCENDING }],
  },
  {
    week: 1, day_order: 2,
    title: 'G Major — Open Position, Descending',
    focus: 'Reverse direction, even picking coming down',
    instructions: 'Same scale in reverse, high G down to low G. Watch that descending picking stays as even as ascending — most people get sloppy coming down.',
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Descending scale', notes: W1_DESCENDING }],
  },
  {
    week: 1, day_order: 3,
    title: 'G Major — 3rds Drill',
    focus: 'Breaking the straight up/down autopilot',
    instructions: 'Play in 3rds — 1-3, 2-4, 3-5, 4-6... (play a note, skip the next, come back, move up). This breaks the straight up/down autopilot and is genuinely harder; keep it slow. Pairs ascend: G-B, A-C, B-D, C-E, D-F#, E-G, F#-A, G-B...',
    default_bpm: 50, target_bpm: 80, suggested_minutes: 15,
    tabs: [{ label: '3rds drill', notes: W1_THIRDS }],
  },
  {
    week: 1, day_order: 4,
    title: 'G Major — Fluency Check',
    focus: 'Clean execution at higher tempo across all three patterns',
    instructions: 'No new material. Run 1.1, 1.2, and 1.3 back to back, aiming for clean execution at a higher tempo than earlier in the week. Use this day to decide if Week 1 is "mastered" before advancing.',
    default_bpm: 80, target_bpm: 110, suggested_minutes: 20,
    tabs: [
      { label: 'Ascending scale', notes: W1_ASCENDING },
      { label: 'Descending scale', notes: W1_DESCENDING },
      { label: '3rds drill', notes: W1_THIRDS },
    ],
  },

  // ── Week 2 ──────────────────────────────────────────────────────────────────
  {
    week: 2, day_order: 5,
    title: 'G Major — E-Shape Position (frets 2–5)',
    focus: 'CAGED E-shape, connecting above the open position',
    instructions: 'Connects above the open shape. Notes G A B C D E F# G A B C D E G A. Use the same strict alternate picking as Week 1. Notice how the same notes fall in different fret patterns.',
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'E-shape ascending', notes: W2_ESHAPE }],
  },
  {
    week: 2, day_order: 6,
    title: 'G Major — A-Shape Position (frets 7–10)',
    focus: 'CAGED A-shape, extending up the neck',
    instructions: 'Higher up the neck — same notes, new shapes under your fingers. Three-notes-per-string on most strings. Keep the picking even.',
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'A-shape ascending', notes: W2_ASHAPE }],
  },
  {
    week: 2, day_order: 7,
    title: 'G Major — Connect E-Shape ↔ A-Shape',
    focus: 'Smooth position shifts with no gap on the click',
    instructions: 'Play 2.1 ascending, then shift up and continue into 2.2 descending without stopping. Goal is smooth position shifts, no gap in the click. Both tabs shown below for reference.',
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [
      { label: 'E-shape (ascend from here)', notes: W2_ESHAPE },
      { label: 'A-shape (descend into here)', notes: W2_ASHAPE },
    ],
  },

  // ── Week 3 ──────────────────────────────────────────────────────────────────
  {
    week: 3, day_order: 8,
    title: 'Em Pentatonic — Open Position (frets 0–3)',
    focus: 'The pentatonic box in open position',
    instructions: 'Notes E G A B D E G A B D E G. Two notes per string, completely different spacing from the major scale. Drill ascending and descending until the shape is automatic.',
    default_bpm: 60, target_bpm: 110, suggested_minutes: 15,
    tabs: [{ label: 'Em pentatonic, open', notes: W3_PENTA_OPEN }],
  },
  {
    week: 3, day_order: 9,
    title: 'Em Pentatonic — 12th-Fret Box',
    focus: 'The classic "box 1" shape at the 12th fret',
    instructions: 'Same shape as the open position, just 12 frets up. Notice it\'s identical — same interval layout, same two-notes-per-string pattern. Drill ascending and descending.',
    default_bpm: 60, target_bpm: 110, suggested_minutes: 15,
    tabs: [{ label: 'Em pentatonic, 12th fret', notes: W3_PENTA_12 }],
  },
  {
    week: 3, day_order: 10,
    title: 'Em Pentatonic — Connect Open ↔ 12th Box',
    focus: 'Same shape, two octaves apart — hearing the identity',
    instructions: 'Same shape, two octaves apart — play one then the other, hearing they\'re identical. The goal is to stop thinking of them as different patterns and start hearing them as the same sound in two places.',
    default_bpm: 60, target_bpm: 110, suggested_minutes: 15,
    tabs: [
      { label: 'Open box', notes: W3_PENTA_OPEN },
      { label: '12th-fret box', notes: W3_PENTA_12 },
    ],
  },

  // ── Week 4 ──────────────────────────────────────────────────────────────────
  {
    week: 4, day_order: 11,
    title: 'Pentatonic + Color Tones — Ascending (major/minor blur)',
    focus: 'Adding the 2nd (F#) and 6th (C) to soften the pentatonic sound',
    instructions: 'Notes E F# G A B C D E F# G A B C D E F# G. Adding the 2nd and 6th fills the pentatonic out toward the full natural-minor / G-major color. Listen for how it softens the "rock pentatonic" sound — this is the more ambiguous, melodic vocabulary you\'re after.',
    default_bpm: 55, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Ascending with color tones', notes: W4_COLOR_ASC }],
  },
  {
    week: 4, day_order: 12,
    title: 'Pentatonic + Color Tones — Descending',
    focus: 'Descending direction, same colors',
    instructions: 'Reverse of 4.1. Listen for how the added 2nd and 6th change the descending feel. Most players find the color tones land more expressively coming down. Keep it slow enough to really hear each note.',
    default_bpm: 55, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Descending with color tones', notes: W4_COLOR_DESC }],
  },

  // ── Week 5 ──────────────────────────────────────────────────────────────────
  {
    week: 5, day_order: 13,
    title: 'Legato — 3-Note-Per-String G Major Run',
    focus: 'Pick only the first note per string; hammer-on the rest',
    instructions: 'Pick ONLY the first note on each string; hammer-on the next two ascending, pull-off descending. Aim for even volume between picked and slurred notes — the slurred notes should not disappear. Notes G A B C D E F# G A B C D E F# G A B C.',
    default_bpm: 50, target_bpm: 90, suggested_minutes: 20,
    tabs: [{ label: '3-note-per-string legato run', notes: W5_LEGATO }],
  },
  {
    week: 5, day_order: 14,
    title: 'Fingerstyle Day — No Pick',
    focus: 'Same run as 5.1, thumb and index/middle alternating',
    instructions: 'Drop the pick for the whole session — thumb and index/middle alternating. Notice how dynamics and string noise change. This texture (fingertip attack, no pick transient) is core to the target sound. Same run as lesson 5.1.',
    default_bpm: 50, target_bpm: 90, suggested_minutes: 20,
    tabs: [{ label: 'Fingerstyle run (same as 5.1)', notes: W5_LEGATO }],
  },

  // ── Week 6 ──────────────────────────────────────────────────────────────────
  {
    week: 6, day_order: 15,
    title: 'Chordal Lead — Diatonic Triads on Top 3 Strings',
    focus: 'Moving chord shapes up the scale diatonically',
    instructions: 'Each triad (G, Am, Bm, C) shown below — three notes played together. Strum or pluck all three strings at once. Move the shape up the scale; this is the "lead lines inside chord shapes" move. Keep it slow and listen for the harmony.',
    default_bpm: 50, target_bpm: 85, suggested_minutes: 20,
    tabs: [{ label: 'Diatonic triads, G–Am–Bm–C', notes: W6_TRIADS }],
  },
  {
    week: 6, day_order: 16,
    title: 'Behind-the-Beat Phrasing',
    focus: 'Deliberately dragging behind the click',
    instructions: 'No new tab. Reuse the triads from 6.1 and the color-tone scale from Week 4. Set the metronome slow and deliberately play each triad/note a hair BEHIND the click — not locked to it. Record yourself and listen for the relaxed, dragging feel. That\'s the target.',
    default_bpm: 50, target_bpm: 85, suggested_minutes: 20,
    tabs: [
      { label: 'Triads (from 6.1)', notes: W6_TRIADS },
      { label: 'Color-tone scale (from 4.1)', notes: W4_COLOR_ASC },
    ],
  },

  // ── Week 7 ──────────────────────────────────────────────────────────────────
  {
    week: 7, day_order: 17,
    title: 'Ear Training — Transcribe a 4-Bar Phrase',
    focus: 'Figure it out by ear before looking anything up',
    instructions: 'Pick a short phrase from a song you like — don\'t look up the tab. Spend at least 20 minutes finding it on the neck by ear. Start with the first note (hum it, find it on the low E), then work note by note. Log what you find in the notes field below.',
    default_bpm: 60, target_bpm: 100, suggested_minutes: 25,
    tabs: [],
  },
  {
    week: 7, day_order: 18,
    title: 'Lower-Tuning Touch',
    focus: 'Slack strings change your touch and vibrato',
    instructions: 'Detune to Drop D (or lower) and replay the Week 4 color-tone scale by feel. The fret patterns shift in pitch but the physical pattern stays the same. Notice how the slack strings respond differently to picking pressure and how vibrato feels looser. Reference tab below.',
    default_bpm: 55, target_bpm: 100, suggested_minutes: 25,
    tabs: [{ label: 'Color-tone scale (Week 4.1, plays lower in drop tuning)', notes: W4_COLOR_ASC }],
  },

  // ── Week 8 ──────────────────────────────────────────────────────────────────
  {
    week: 8, day_order: 19,
    title: 'Improv — Legato + Chordal Lead Over Em Vamp',
    focus: 'No straight scale runs — only the vocabulary from Weeks 5–6',
    instructions: 'Improvise over an Em–G–C–D loop using ONLY legato (Week 5) and chordal-lead (Week 6) ideas. Straight up/down scale runs are not allowed. Force the new vocabulary to surface. Reference scale below to remind yourself of the notes.',
    default_bpm: 70, target_bpm: 120, suggested_minutes: 25,
    tabs: [{ label: 'Color-tone scale reference (Week 4.1)', notes: W4_COLOR_ASC }],
  },
  {
    week: 8, day_order: 20,
    title: 'Record & Review',
    focus: 'Close the loop — one thing that worked, one to fix',
    instructions: 'Record one full improv pass over the Em–G–C–D vamp. Listen back. Note one thing that worked and one thing to fix in the notes field below. This closes the 8-week loop. If you want to keep going, revisit any week\'s lessons and push the target BPM.',
    default_bpm: 70, target_bpm: 120, suggested_minutes: 25,
    tabs: [],
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────
// Upserts by (week, day_order) — existing lesson IDs are preserved so that
// progress rows and practice_sessions linked to them are untouched.
// Old stub lessons not in the new curriculum remain in the DB but don't appear
// as the current lesson once real lessons ahead of them exist.

async function seed() {
  console.log('Seeding curriculum (preserving existing progress)...')

  for (const lesson of CURRICULUM) {
    const { tabs, ...lessonData } = lesson

    // Find existing lesson by position key
    const { data: existing } = await supabase
      .from('lessons')
      .select('id')
      .eq('week', lessonData.week)
      .eq('day_order', lessonData.day_order)
      .maybeSingle()

    let lessonId: string

    if (existing) {
      const { error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', existing.id)
      if (error) { console.error('Update error:', error); continue }
      lessonId = existing.id
      console.log(`  Updated  ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
    } else {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select('id')
        .single()
      if (error || !data) { console.error('Insert error:', error); continue }
      lessonId = data.id
      console.log(`  Inserted ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
    }

    // Refresh tabs for this lesson (delete + re-insert)
    await supabase.from('lesson_tabs').delete().eq('lesson_id', lessonId)
    for (let i = 0; i < tabs.length; i++) {
      const { error: tabErr } = await supabase.from('lesson_tabs').insert({
        lesson_id: lessonId,
        label: tabs[i].label,
        notes: tabs[i].notes,
        order_index: i,
      })
      if (tabErr) console.error(`  Tab error:`, tabErr)
    }
  }

  console.log(`\nDone — ${CURRICULUM.length} lessons upserted. Progress preserved.`)
}

seed().catch(console.error)
