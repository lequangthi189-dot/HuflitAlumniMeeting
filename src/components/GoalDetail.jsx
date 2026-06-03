import { useMemo, useState } from 'react'
import { computeTimeline, formatDate, weightedProgress } from '../lib/timeline.js'
import GanttTimeline from './GanttTimeline.jsx'
import SubtaskCard from './SubtaskCard.jsx'
import ProgressBar from './ProgressBar.jsx'
import GoalForm from './GoalForm.jsx'

export default function GoalDetail({ goal, store, onBack }) {
  const [activeId, setActiveId] = useState(null)
  const [editingGoal, setEditingGoal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newWeight, setNewWeight] = useState(10)

  const timeline = useMemo(() => computeTimeline(goal), [goal])
  const progress = weightedProgress(goal.subtasks)

  const addSubtask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    store.addSubtask(goal.id, { title: newTitle, weight: newWeight })
    setNewTitle(''); setNewWeight(10)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <button className="btn btn-ghost" onClick={onBack}>← All goals</button>
        <div className="flex gap-2">
          <button className="btn" onClick={() => setEditingGoal(true)}>Edit goal</button>
          <button className="btn btn-danger" onClick={() => {
            if (confirm('Delete this goal?')) { store.deleteGoal(goal.id); onBack() }
          }}>Delete</button>
        </div>
      </div>

      <div className="card p-6">
        <h1 className="text-2xl font-bold">{goal.title}</h1>
        {goal.description && <p className="text-muted mt-2 whitespace-pre-wrap">{goal.description}</p>}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Stat label="Start" value={formatDate(timeline.start)} />
          <Stat label="End" value={formatDate(timeline.end)} />
          <Stat label="Duration" value={`${goal.totalDurationDays} days`} />
          <Stat label="Subtasks" value={goal.subtasks.length} />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>Overall progress (weighted)</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </div>

      <GanttTimeline timeline={timeline} activeId={activeId} onPick={setActiveId} />

      <div className="space-y-2">
        {timeline.items.map((item, i) => (
          <SubtaskCard
            key={item.id}
            item={item}
            index={i}
            total={timeline.items.length}
            expanded={activeId === item.id}
            onToggleExpand={() => setActiveId(activeId === item.id ? null : item.id)}
            onUpdate={(patch) => store.updateSubtask(goal.id, item.id, patch)}
            onDelete={() => store.deleteSubtask(goal.id, item.id)}
            onMove={(dir) => store.moveSubtask(goal.id, item.id, dir)}
            onToggleDone={() => store.toggleDone(goal.id, item.id)}
          />
        ))}
      </div>

      <form onSubmit={addSubtask} className="card p-4 flex flex-col md:flex-row gap-2">
        <input className="input md:flex-1" placeholder="New subtask title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <input className="input md:w-32" type="number" min="0" step="1" value={newWeight} onChange={(e) => setNewWeight(Number(e.target.value) || 0)} placeholder="Weight %" />
        <button className="btn btn-primary" type="submit">+ Add subtask</button>
      </form>

      <GoalForm
        open={editingGoal}
        initial={goal}
        onClose={() => setEditingGoal(false)}
        onSubmit={(data) => { store.updateGoal(goal.id, data); setEditingGoal(false) }}
      />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
