import { TabNote, StringName } from '@/types'

// String ordering: index 0 = high e (top line), index 5 = low E (bottom line)
const STRING_ORDER: StringName[] = ['e', 'B', 'G', 'D', 'A', 'E']

// Open string chromatic indices (C=0)
const OPEN_INDEX: Record<StringName, number> = {
  e: 4,
  B: 11,
  G: 7,
  D: 2,
  A: 9,
  E: 4,
}

const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function noteName(string: StringName, fret: number): string {
  return CHROMATIC[(OPEN_INDEX[string] + fret) % 12]
}

export interface RenderedTab {
  lines: string[]        // 6 lines, index 0 = high e
  noteNames: string[]    // one entry per position column
}

export function renderTab(notes: TabNote[], showNoteNames = false): RenderedTab {
  if (notes.length === 0) {
    return { lines: STRING_ORDER.map(s => `${s}|`), noteNames: [] }
  }

  const maxPos = Math.max(...notes.map(n => n.position))

  // Build a map: position → string → fret
  const grid: Map<number, Map<StringName, number>> = new Map()
  for (const note of notes) {
    if (!grid.has(note.position)) grid.set(note.position, new Map())
    grid.get(note.position)!.set(note.string, note.fret)
  }

  // Determine column width: wide enough for any fret number at each position
  const colWidths: number[] = []
  for (let pos = 0; pos <= maxPos; pos++) {
    const col = grid.get(pos)
    let w = 1
    if (col) {
      for (const fret of col.values()) {
        w = Math.max(w, String(fret).length)
      }
    }
    colWidths.push(w)
  }

  // Build each string's line
  const lineBuffers: string[] = STRING_ORDER.map(s => `${s}|`)

  for (let pos = 0; pos <= maxPos; pos++) {
    const col = grid.get(pos)
    const w = colWidths[pos]

    for (let si = 0; si < STRING_ORDER.length; si++) {
      const s = STRING_ORDER[si]
      if (col && col.has(s)) {
        lineBuffers[si] += String(col.get(s)!).padEnd(w, '-')
      } else {
        lineBuffers[si] += '-'.repeat(w)
      }
      // column separator (dash)
      lineBuffers[si] += '-'
    }
  }

  // Compute note names per position (lowest-pitched note in that column wins)
  const noteNames: string[] = []
  if (showNoteNames) {
    for (let pos = 0; pos <= maxPos; pos++) {
      const col = grid.get(pos)
      if (col) {
        // Pick the lowest-pitched string present (last in STRING_ORDER = lowest)
        let name = ''
        for (let si = STRING_ORDER.length - 1; si >= 0; si--) {
          const s = STRING_ORDER[si]
          if (col.has(s)) {
            name = noteName(s, col.get(s)!)
            break
          }
        }
        noteNames.push(name)
      } else {
        noteNames.push('')
      }
    }
  }

  return { lines: lineBuffers, noteNames }
}

export function renderTabText(notes: TabNote[], showNoteNames = false): string {
  const { lines, noteNames } = renderTab(notes, showNoteNames)
  const out = lines.join('\n')
  if (showNoteNames && noteNames.length > 0) {
    // Align note names under the tab using fixed spacing
    const nameRow = '  ' + noteNames.map(n => (n || ' ').padEnd(2)).join(' ')
    return out + '\n' + nameRow
  }
  return out
}

// ─── Verified G major scale (ascending) used as a sanity-check in tests ─────
export const G_MAJOR_ASCENDING: TabNote[] = [
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

export function verifyGMajor(): boolean {
  const expected = ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G']
  const actual = G_MAJOR_ASCENDING.map(n => noteName(n.string, n.fret))
  return expected.every((name, i) => name === actual[i])
}
