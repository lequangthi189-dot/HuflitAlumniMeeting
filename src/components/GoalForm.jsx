import { useEffect, useState } from 'react'

export default function GoalForm({ open, initial, onSubmit, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [duration, setDuration] = useState(7)

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '')
      setDescription(initial?.description || '')
      setStartDate(initial?.startDate || new Date().toISOString().slice(0, 10))
      setDuration(initial?.totalDurationDays ?? 7)
    }
  }, [open, initial])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      startDate,
      totalDurationDays: Number(duration) || 0
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="card w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {initial ? 'Edit goal' : 'New goal'}
        </h2>
        <div>
          <label className="label">Title</label>
          <input className="input" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Learn Spanish in 30 days" required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-[72px]" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start date</label>
            <input className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className="label">Total duration (days)</label>
            <input className="input" type="number" min="0" step="0.5" value={duration} onChange={(e) => setDuration(e.target.value)} required />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{initial ? 'Save' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}
