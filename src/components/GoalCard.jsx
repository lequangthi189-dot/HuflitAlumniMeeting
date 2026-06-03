import { computeTimeline, formatDate, weightedProgress } from '../lib/timeline.js'
import ProgressBar from './ProgressBar.jsx'

export default function GoalCard({ goal, onOpen, onDelete }) {
  const tl = computeTimeline(goal)
  const progress = weightedProgress(goal.subtasks)
  return (
    <div className="card p-5 hover:border-accent/60 transition-colors cursor-pointer" onClick={onOpen}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-muted mt-1 line-clamp-2">{goal.description}</p>
          )}
        </div>
        <button
          className="btn btn-danger text-xs"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          title="Delete goal"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <span>{formatDate(tl.start)} → {formatDate(tl.end)}</span>
        <span>•</span>
        <span>{goal.subtasks.length} subtasks</span>
        <span>•</span>
        <span>{goal.totalDurationDays} days</span>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </div>
  )
}
