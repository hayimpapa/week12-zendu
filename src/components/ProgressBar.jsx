export default function ProgressBar({ value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-sage-600 mb-1">
        <span>{value} of {total} complete</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full h-2 bg-warm-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-sage-500 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
