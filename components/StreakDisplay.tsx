interface Props {
  streak: number
  totalMinutes: number
}

export default function StreakDisplay({ streak, totalMinutes }: Props) {
  return (
    <div className="flex gap-4">
      <div className="rounded-lg bg-gray-800 px-5 py-3 text-center">
        <p className="text-3xl font-bold text-indigo-400">{streak}</p>
        <p className="text-xs text-gray-400 mt-0.5">day streak</p>
      </div>
      <div className="rounded-lg bg-gray-800 px-5 py-3 text-center">
        <p className="text-3xl font-bold text-green-400">{totalMinutes}</p>
        <p className="text-xs text-gray-400 mt-0.5">total min</p>
      </div>
    </div>
  )
}
