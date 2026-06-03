import { useState } from 'react'
import GoalCard from './GoalCard.jsx'
import GoalForm from './GoalForm.jsx'

export default function GoalList({ store, onOpenGoal }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">GoalStack</h1>
          <p className="text-sm text-muted">Plan your goals, break them into timed subtasks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New goal</button>
      </div>

      {store.goals.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          <p className="text-lg mb-1">No goals yet</p>
          <p className="text-sm">Click "+ New goal" to create your first plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {store.goals.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              onOpen={() => onOpenGoal(g.id)}
              onDelete={() => { if (confirm(`Delete "${g.title}"?`)) store.deleteGoal(g.id) }}
            />
          ))}
        </div>
      )}

      <GoalForm
        open={showForm}
        initial={null}
        onClose={() => setShowForm(false)}
        onSubmit={(data) => { store.createGoal(data); setShowForm(false) }}
      />
    </div>
  )
}
