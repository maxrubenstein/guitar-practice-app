'use client'

import { useState } from 'react'
import { TabNote } from '@/types'
import { renderTab } from '@/lib/tab'

interface Props {
  notes: TabNote[]
  label?: string
}

export default function TabRenderer({ notes, label }: Props) {
  const [showNoteNames, setShowNoteNames] = useState(false)
  const { lines, noteNames } = renderTab(notes, showNoteNames)

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-gray-400">{label}</p>}

      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showNoteNames}
            onChange={e => setShowNoteNames(e.target.checked)}
            className="accent-indigo-500"
          />
          Show note names
        </label>
      </div>

      <div className="overflow-x-auto rounded bg-gray-900 p-4">
        <pre className="font-mono text-sm leading-6 text-green-400 whitespace-pre">
          {lines.join('\n')}
          {showNoteNames && noteNames.length > 0 && (
            '\n  ' + noteNames.map(n => (n || ' ').padEnd(2)).join(' ')
          )}
        </pre>
      </div>
    </div>
  )
}
