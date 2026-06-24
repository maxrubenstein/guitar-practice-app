/**
 * Idempotent curriculum seed — safe to re-run.
 * Run with: npx tsx supabase/seed.ts
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Tab note data ────────────────────────────────────────────────────────────

const ASCENDING = [
  { string: 'E', fret: 3, position: 0 },
  { string: 'A', fret: 0, position: 1 },
  { string: 'A', fret: 2, position: 2 },
  { string: 'A', fret: 3, position: 3 },
  { string: 'D', fret: 0, position: 4 },
  { string: 'D', fret: 2, position: 5 },
  { string: 'D', fret: 4, position: 6 },
  { string: 'G', fret: 0, position: 7 },
  { string: 'G', fret: 2, position: 8 },
  { string: 'B', fret: 0, position: 9 },
  { string: 'B', fret: 1, position: 10 },
  { string: 'B', fret: 3, position: 11 },
  { string: 'e', fret: 0, position: 12 },
  { string: 'e', fret: 2, position: 13 },
  { string: 'e', fret: 3, position: 14 },
]

const DESCENDING = [
  { string: 'e', fret: 3, position: 0 },
  { string: 'e', fret: 2, position: 1 },
  { string: 'e', fret: 0, position: 2 },
  { string: 'B', fret: 3, position: 3 },
  { string: 'B', fret: 1, position: 4 },
  { string: 'B', fret: 0, position: 5 },
  { string: 'G', fret: 2, position: 6 },
  { string: 'G', fret: 0, position: 7 },
  { string: 'D', fret: 4, position: 8 },
  { string: 'D', fret: 2, position: 9 },
  { string: 'D', fret: 0, position: 10 },
  { string: 'A', fret: 3, position: 11 },
  { string: 'A', fret: 2, position: 12 },
  { string: 'A', fret: 0, position: 13 },
  { string: 'E', fret: 3, position: 14 },
]

const THIRDS = [
  { string: 'E', fret: 3, position: 0 },
  { string: 'A', fret: 2, position: 1 },
  { string: 'A', fret: 0, position: 2 },
  { string: 'A', fret: 3, position: 3 },
  { string: 'A', fret: 2, position: 4 },
  { string: 'D', fret: 0, position: 5 },
  { string: 'A', fret: 3, position: 6 },
  { string: 'D', fret: 2, position: 7 },
  { string: 'D', fret: 0, position: 8 },
  { string: 'D', fret: 4, position: 9 },
  { string: 'D', fret: 2, position: 10 },
  { string: 'G', fret: 0, position: 11 },
  { string: 'D', fret: 4, position: 12 },
  { string: 'G', fret: 2, position: 13 },
  { string: 'G', fret: 0, position: 14 },
  { string: 'B', fret: 0, position: 15 },
  { string: 'G', fret: 2, position: 16 },
  { string: 'B', fret: 1, position: 17 },
  { string: 'B', fret: 0, position: 18 },
  { string: 'B', fret: 3, position: 19 },
  { string: 'B', fret: 1, position: 20 },
  { string: 'e', fret: 0, position: 21 },
  { string: 'B', fret: 3, position: 22 },
  { string: 'e', fret: 2, position: 23 },
  { string: 'e', fret: 0, position: 24 },
  { string: 'e', fret: 3, position: 25 },
]

// ─── Curriculum definition ────────────────────────────────────────────────────

interface TabDef {
  label: string
  notes: object[]
}

interface LessonDef {
  week: number
  day_order: number
  title: string
  focus: string
  instructions: string
  default_bpm: number
  target_bpm: number
  suggested_minutes: number
  tabs: TabDef[]
}

const CURRICULUM: LessonDef[] = [
  // ── Week 1 ──────────────────────────────────────────────────────────────────
  {
    week: 1, day_order: 1,
    title: 'G Major — Open Position, Ascending',
    focus: 'Single-direction scale run, strict alternate picking',
    instructions: `Slow metronome, strict alternate picking (down-up-down-up), play clean before increasing tempo. Let open strings ring; on the D string (frets 0-2-4) use fingers 1 and 3.`,
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Ascending scale', notes: ASCENDING }],
  },
  {
    week: 1, day_order: 2,
    title: 'G Major — Open Position, Descending',
    focus: 'Reverse direction, even picking coming down',
    instructions: `Same scale in reverse, high G down to low G. Watch that descending picking stays as even as ascending — most people get sloppy coming down.`,
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Descending scale', notes: DESCENDING }],
  },
  {
    week: 1, day_order: 3,
    title: 'G Major — 3rds Drill',
    focus: 'Breaking the straight up/down autopilot',
    instructions: `Play in 3rds — 1-3, 2-4, 3-5, 4-6... (play a note, skip the next, come back, move up). This breaks the straight up/down autopilot and is genuinely harder; keep it slow. Pairs ascend: G-B, A-C, B-D, C-E, D-F#, E-G, F#-A, G-B...`,
    default_bpm: 50, target_bpm: 80, suggested_minutes: 15,
    tabs: [{ label: '3rds drill', notes: THIRDS }],
  },
  {
    week: 1, day_order: 4,
    title: 'G Major — Fluency Check / Repeat Day',
    focus: 'Clean execution at higher tempo across all three patterns',
    instructions: `No new material. Run lessons 1.1, 1.2, and 1.3 back to back, aiming for clean execution at a higher tempo than earlier in the week. Use this day to decide if Week 1 is "mastered" before advancing.`,
    default_bpm: 80, target_bpm: 110, suggested_minutes: 20,
    tabs: [
      { label: 'Ascending scale', notes: ASCENDING },
      { label: 'Descending scale', notes: DESCENDING },
      { label: '3rds drill', notes: THIRDS },
    ],
  },

  // ── Week 2 ──────────────────────────────────────────────────────────────────
  {
    week: 2, day_order: 5,
    title: 'G Major — E Shape (CAGED)',
    focus: 'CAGED E-shape position, connecting to open position',
    instructions: `TODO: Add full instructions for E-shape G major position (starts at fret 3). Connect to the open/G-shape position from Week 1.`,
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'E-shape ascending (TODO)', notes: [] }],
  },
  {
    week: 2, day_order: 6,
    title: 'G Major — A Shape (CAGED)',
    focus: 'CAGED A-shape position',
    instructions: `TODO: Add full instructions for A-shape G major position. Connect adjacent CAGED positions across the neck.`,
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'A-shape ascending (TODO)', notes: [] }],
  },
  {
    week: 2, day_order: 7,
    title: 'G Major — Connect E & A Shapes',
    focus: 'Smooth position shifts between CAGED shapes',
    instructions: `TODO: Add position-shift exercises connecting E and A shapes. Focus on smooth transitions at the shift point.`,
    default_bpm: 55, target_bpm: 90, suggested_minutes: 20,
    tabs: [{ label: 'Position shift drill (TODO)', notes: [] }],
  },
  {
    week: 2, day_order: 8,
    title: 'Week 2 Fluency Check',
    focus: 'All three CAGED positions back to back',
    instructions: `TODO: Run open/G, E, and A shapes consecutively. Aim for a clean tempo step up from the week start.`,
    default_bpm: 75, target_bpm: 105, suggested_minutes: 20,
    tabs: [{ label: 'Three positions (TODO)', notes: [] }],
  },

  // ── Week 3 ──────────────────────────────────────────────────────────────────
  {
    week: 3, day_order: 9,
    title: 'Minor Pentatonic — Box 1 (Em)',
    focus: 'The most common pentatonic box, ascending & descending',
    instructions: `TODO: Add Em pentatonic box 1 tab data. Drill ascending and descending. This is the foundation for all rock/blues soloing.`,
    default_bpm: 60, target_bpm: 100, suggested_minutes: 15,
    tabs: [{ label: 'Box 1 (TODO)', notes: [] }],
  },
  {
    week: 3, day_order: 10,
    title: 'Minor Pentatonic — Boxes 2 & 3',
    focus: 'Expanding the pentatonic vocabulary across the neck',
    instructions: `TODO: Add Em pentatonic boxes 2 and 3 tab data. Learn each ascending/descending before combining.`,
    default_bpm: 60, target_bpm: 100, suggested_minutes: 20,
    tabs: [{ label: 'Boxes 2 & 3 (TODO)', notes: [] }],
  },
  {
    week: 3, day_order: 11,
    title: 'Minor Pentatonic — Boxes 4 & 5',
    focus: 'Completing all five pentatonic positions',
    instructions: `TODO: Add Em pentatonic boxes 4 and 5 tab data. The goal this week is to know all 5 boxes, even if slowly.`,
    default_bpm: 55, target_bpm: 90, suggested_minutes: 20,
    tabs: [{ label: 'Boxes 4 & 5 (TODO)', notes: [] }],
  },
  {
    week: 3, day_order: 12,
    title: 'All 5 Pentatonic Boxes — Fluency Check',
    focus: 'Connecting all five boxes across the neck',
    instructions: `TODO: Run all five boxes consecutively from low to high and back. Focus on smooth transitions between positions.`,
    default_bpm: 70, target_bpm: 100, suggested_minutes: 25,
    tabs: [{ label: 'All 5 boxes (TODO)', notes: [] }],
  },

  // ── Week 4 ──────────────────────────────────────────────────────────────────
  {
    week: 4, day_order: 13,
    title: 'Pentatonic + 2nd & 6th (Color Tones)',
    focus: 'Blurring major and minor pentatonic with added tones',
    instructions: `TODO: Add the 2nd and 6th into the minor pentatonic. These are the "major pentatonic" additions that let you blur between major and minor sounds.`,
    default_bpm: 55, target_bpm: 85, suggested_minutes: 20,
    tabs: [{ label: 'Color tone drill (TODO)', notes: [] }],
  },
  {
    week: 4, day_order: 14,
    title: 'Cross-Position Connection Drill',
    focus: 'Linking pentatonic boxes with color tones across the neck',
    instructions: `TODO: Connect pentatonic positions using the added 2nd and 6th as pivot tones. Target a seamless shift at every position boundary.`,
    default_bpm: 55, target_bpm: 85, suggested_minutes: 20,
    tabs: [{ label: 'Cross-position drill (TODO)', notes: [] }],
  },
  {
    week: 4, day_order: 15,
    title: 'Week 4 Fluency Check',
    focus: 'Full neck pentatonic with color tones at target tempo',
    instructions: `TODO: Run the full neck using all pentatonic boxes plus color tones. Record yourself once and listen back.`,
    default_bpm: 70, target_bpm: 100, suggested_minutes: 25,
    tabs: [{ label: 'Full neck (TODO)', notes: [] }],
  },

  // ── Week 5 ──────────────────────────────────────────────────────────────────
  {
    week: 5, day_order: 16,
    title: 'Legato Runs — Hammer-ons & Pull-offs',
    focus: 'Pick only the first note per string; slur the rest',
    instructions: `TODO: Apply legato (hammer-on/pull-off) to the G major scale runs. Pick only the first note on each string. Target even volume between picked and slurred notes.`,
    default_bpm: 50, target_bpm: 80, suggested_minutes: 20,
    tabs: [{ label: 'Legato ascending (TODO)', notes: [] }],
  },
  {
    week: 5, day_order: 17,
    title: 'Fingerstyle Week — No Pick',
    focus: 'Building touch sensitivity without a pick',
    instructions: `TODO: Play the entire G major scale week using only your fingers (no pick). Focus on even volume across all fingers (p, i, m, a). Alternating i-m on melody strings.`,
    default_bpm: 50, target_bpm: 80, suggested_minutes: 20,
    tabs: [{ label: 'Fingerstyle scale (TODO)', notes: [] }],
  },
  {
    week: 5, day_order: 18,
    title: 'Legato + Fingerstyle Fluency Check',
    focus: 'Combining both techniques cleanly',
    instructions: `TODO: Mix legato and fingerstyle in the same run. Focus on consistency of volume whether picking or slurring.`,
    default_bpm: 60, target_bpm: 90, suggested_minutes: 20,
    tabs: [{ label: 'Combined technique (TODO)', notes: [] }],
  },

  // ── Week 6 ──────────────────────────────────────────────────────────────────
  {
    week: 6, day_order: 19,
    title: 'Chordal Lead Lines — Diatonic 3-Note Shapes',
    focus: 'Moving chord fragments up and down the scale',
    instructions: `TODO: Build 3-note chord shapes from the G major scale and move them diatonically (one chord per scale degree). This is the foundation of chord-melody playing.`,
    default_bpm: 50, target_bpm: 75, suggested_minutes: 20,
    tabs: [{ label: 'Diatonic chord shapes (TODO)', notes: [] }],
  },
  {
    week: 6, day_order: 20,
    title: 'Behind-the-Beat Phrasing',
    focus: 'Deliberately lagging the click to develop feel',
    instructions: `TODO: Play scale runs and chord shapes with a deliberate slight delay behind the metronome click. This is a feel-based exercise — record yourself and listen back.`,
    default_bpm: 60, target_bpm: 80, suggested_minutes: 20,
    tabs: [{ label: 'Phrasing exercise (TODO)', notes: [] }],
  },
  {
    week: 6, day_order: 21,
    title: 'Week 6 Fluency Check',
    focus: 'Chordal lead + phrasing at target tempo',
    instructions: `TODO: Combine chordal lead lines with behind-the-beat phrasing. Target the feel as much as the tempo.`,
    default_bpm: 65, target_bpm: 90, suggested_minutes: 25,
    tabs: [{ label: 'Chordal lead fluency (TODO)', notes: [] }],
  },

  // ── Week 7 ──────────────────────────────────────────────────────────────────
  {
    week: 7, day_order: 22,
    title: 'Ear Training — Transcribe Phrase 1',
    focus: 'Figuring out a 4-bar melody by ear before looking at tabs',
    instructions: `TODO: Choose a simple 4-bar phrase (e.g. from a song you know). Try to figure it out by ear on the guitar first. No tabs until you've tried for at least 10 minutes. Then verify.`,
    default_bpm: 60, target_bpm: 90, suggested_minutes: 25,
    tabs: [{ label: 'Transcription (your choice — no tab provided)', notes: [] }],
  },
  {
    week: 7, day_order: 23,
    title: 'Ear Training — Transcribe Phrase 2',
    focus: 'Second transcription, slightly harder phrase',
    instructions: `TODO: Choose a second phrase, slightly more complex. Same approach: ear first, verify after. Try a different key or position from Week 1-6.`,
    default_bpm: 60, target_bpm: 90, suggested_minutes: 25,
    tabs: [{ label: 'Transcription (your choice — no tab provided)', notes: [] }],
  },
  {
    week: 7, day_order: 24,
    title: 'Slack Tuning Exploration',
    focus: 'Touch and feel in a lower/alternate tuning',
    instructions: `TODO: Drop to an alternate tuning (e.g. Drop D or Open G). Play the G major scale shape in the new context — notice how the feel of string tension changes. No prescribed tab; explore freely.`,
    default_bpm: 55, target_bpm: 80, suggested_minutes: 20,
    tabs: [{ label: 'Slack tuning exploration (no tab provided)', notes: [] }],
  },

  // ── Week 8 ──────────────────────────────────────────────────────────────────
  {
    week: 8, day_order: 25,
    title: 'Improv — Legato Only Over Chord Loop',
    focus: 'No straight scale runs: legato ideas only',
    instructions: `TODO: Set up a simple looped chord progression (e.g. G - C - D - Em) and improvise using ONLY legato technique. No straight alternate-picked scale runs. Focus on note choice and phrasing.`,
    default_bpm: 70, target_bpm: 95, suggested_minutes: 20,
    tabs: [{ label: 'Improv session (no fixed tab)', notes: [] }],
  },
  {
    week: 8, day_order: 26,
    title: 'Improv — Chordal Lead Only Over Chord Loop',
    focus: 'No single notes: chordal lead fragments only',
    instructions: `TODO: Same chord loop. This time improvise using ONLY chordal lead ideas (3-note shapes from Week 6). Combine with behind-the-beat phrasing. Record once and listen back.`,
    default_bpm: 70, target_bpm: 95, suggested_minutes: 20,
    tabs: [{ label: 'Chordal lead improv (no fixed tab)', notes: [] }],
  },
  {
    week: 8, day_order: 27,
    title: 'Final Review & Record',
    focus: 'Record yourself and compare to Week 1',
    instructions: `Record a free improv over the chord loop using any techniques from the past 8 weeks. Listen back critically: is your picking even? Are your legato notes clean? Are you phrasing musically? Compare to how you played in Week 1.`,
    default_bpm: 75, target_bpm: 100, suggested_minutes: 30,
    tabs: [{ label: 'Free improv (no fixed tab)', notes: [] }],
  },
]

// ─── Seed logic ───────────────────────────────────────────────────────────────

async function seed() {
  console.log('Seeding curriculum...')

  for (const lesson of CURRICULUM) {
    const { tabs, ...lessonData } = lesson

    // Upsert lesson by week + day_order (idempotent)
    const { data: existing, error: fetchErr } = await supabase
      .from('lessons')
      .select('id')
      .eq('week', lessonData.week)
      .eq('day_order', lessonData.day_order)
      .maybeSingle()

    if (fetchErr) { console.error('Fetch error:', fetchErr); continue }

    let lessonId: string

    if (existing) {
      const { error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', existing.id)
      if (error) { console.error('Update error:', error); continue }
      lessonId = existing.id
      console.log(`  Updated lesson ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
    } else {
      const { data, error } = await supabase
        .from('lessons')
        .insert(lessonData)
        .select('id')
        .single()
      if (error || !data) { console.error('Insert error:', error); continue }
      lessonId = data.id
      console.log(`  Inserted lesson ${lessonData.week}.${lessonData.day_order}: ${lessonData.title}`)
    }

    // Seed tabs: delete existing then re-insert (simpler than diffing)
    await supabase.from('lesson_tabs').delete().eq('lesson_id', lessonId)

    for (let i = 0; i < tabs.length; i++) {
      const { error } = await supabase.from('lesson_tabs').insert({
        lesson_id: lessonId,
        label: tabs[i].label,
        notes: tabs[i].notes,
        order_index: i,
      })
      if (error) console.error(`  Tab insert error (lesson ${lessonId}):`, error)
    }
  }

  console.log('Seed complete.')
}

seed().catch(console.error)
