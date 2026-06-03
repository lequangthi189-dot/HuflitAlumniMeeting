import { formatDate } from '../lib/timeline.js'

const PALETTE = [
  'bg-sky-500/70', 'bg-emerald-500/70', 'bg-violet-500/70',
  'bg-amber-500/70', 'bg-pink-500/70', 'bg-teal-500/70',
  'bg-indigo-500/70', 'bg-rose-500/70'
]

export default function GanttTimeline({ timeline, activeId, onPick }) {
  const { items, sumWeight, start, end } = timeline

  if (items.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-muted">
        No subtasks yet. Add one below to see the timeline.
      </div>
    )
  }

  return (
    <div className="card p-4">
      <div className="flex justify-between text-xs text-muted mb-2">
        <span>{formatDate(start)}</span>
        <span>{formatDate(end)}</span>
      </div>
      <div className="flex w-full h-12 rounded-md overflow-hidden border border-border">
        {items.map((s, i) => {
          const pct = sumWeight > 0 ? (s.weight / sumWeight) * 100 : 100 / items.length
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              onClick={() => onPick?.(s.id)}
              className={`relative h-full ${PALETTE[i % PALETTE.length]} ${isActive ? 'ring-2 ring-white/70' : ''} hover:brightness-125 transition-all flex items-center justify-center text-xs font-medium text-white/90 border-r border-black/20 last:border-r-0`}
              style={{ width: `${pct}%` }}
              title={`${s.title}\n${formatDate(s.startDate)} → ${formatDate(s.endDate)}\n${s.weight}% (${s.durationDays.toFixed(1)} days)`}
            >
              <span className="truncate px-2">{s.title}</span>
              {s.done && <span className="absolute top-1 right-1 text-[10px]">✓</span>}
            </button>
          )
        })}
      </div>
      {sumWeight !== 100 && (
        <div className="text-xs text-amber-400 mt-2">
          ⚠ Total weight is {sumWeight}% (not 100%). Timeline is normalized proportionally.
        </div>
      )}
    </div>
  )
}
