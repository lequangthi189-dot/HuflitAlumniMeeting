import { useState } from 'react'
import { formatDate } from '../lib/timeline.js'
import { uid } from '../lib/id.js'

export default function SubtaskCard({
  item, index, total, expanded, onToggleExpand, maxWeight = 100,
  onUpdate, onDelete, onMove, onToggleDone
}) {
  const [linkLabel, setLinkLabel] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [checkText, setCheckText] = useState('')

  const patch = (p) => onUpdate(p)

  const addLink = () => {
    if (!linkUrl.trim()) return
    patch({ links: [...item.links, { id: uid(), label: linkLabel.trim() || linkUrl, url: linkUrl.trim() }] })
    setLinkLabel(''); setLinkUrl('')
  }
  const removeLink = (id) => patch({ links: item.links.filter((l) => l.id !== id) })

  const addCheck = () => {
    if (!checkText.trim()) return
    patch({ checklist: [...item.checklist, { id: uid(), text: checkText.trim(), done: false }] })
    setCheckText('')
  }
  const toggleCheck = (id) =>
    patch({ checklist: item.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)) })
  const removeCheck = (id) => patch({ checklist: item.checklist.filter((c) => c.id !== id) })

  return (
    <div className={`card ${expanded ? 'border-accent/60' : ''}`}>
      <div className="flex items-center gap-3 p-3">
        <input
          type="checkbox"
          checked={item.done}
          onChange={onToggleDone}
          className="w-4 h-4 accent-emerald-500"
          onClick={(e) => e.stopPropagation()}
        />
        <button className="flex-1 text-left" onClick={onToggleExpand}>
          <div className="flex items-center gap-2">
            <span className={`font-medium ${item.done ? 'line-through text-muted' : ''}`}>
              {item.title || 'Untitled'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
              {item.weight}%
            </span>
          </div>
          <div className="text-xs text-muted mt-0.5">
            {formatDate(item.startDate)} → {formatDate(item.endDate)} ({item.durationDays.toFixed(1)}d)
          </div>
        </button>
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost px-2 py-1" disabled={index === 0} onClick={() => onMove('up')} title="Move up">↑</button>
          <button className="btn btn-ghost px-2 py-1" disabled={index === total - 1} onClick={() => onMove('down')} title="Move down">↓</button>
          <button className="btn btn-ghost px-2 py-1" onClick={onToggleExpand}>{expanded ? '−' : '+'}</button>
          <button className="btn btn-danger px-2 py-1" onClick={onDelete} title="Delete">✕</button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label">Title</label>
              <input className="input" value={item.title} onChange={(e) => patch({ title: e.target.value })} />
            </div>
            <div>
              <label className="label">Weight (%) — tối đa {maxWeight}</label>
              <input className="input" type="number" min="0" max={maxWeight} step="1" value={item.weight}
                     onChange={(e) => {
                       const v = Math.min(maxWeight, Math.max(0, Number(e.target.value) || 0))
                       patch({ weight: v })
                     }} />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea className="input min-h-[80px]" value={item.notes}
                      onChange={(e) => patch({ notes: e.target.value })}
                      placeholder="Add details, references, or context..." />
          </div>

          <div>
            <label className="label">Links</label>
            <div className="space-y-1 mb-2">
              {item.links.map((l) => (
                <div key={l.id} className="flex items-center gap-2 text-sm">
                  <a href={l.url} target="_blank" rel="noreferrer" className="text-accent2 hover:underline truncate flex-1">
                    {l.label}
                  </a>
                  <button className="btn btn-danger px-2 py-0.5 text-xs" onClick={() => removeLink(l.id)}>✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Label (optional)" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} />
              <input className="input flex-[2]" placeholder="https://..." value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
              <button className="btn" onClick={addLink}>Add</button>
            </div>
          </div>

          <div>
            <label className="label">Checklist</label>
            <div className="space-y-1 mb-2">
              {item.checklist.map((c) => (
                <div key={c.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={c.done} onChange={() => toggleCheck(c.id)} className="accent-emerald-500" />
                  <span className={`flex-1 ${c.done ? 'line-through text-muted' : ''}`}>{c.text}</span>
                  <button className="btn btn-danger px-2 py-0.5 text-xs" onClick={() => removeCheck(c.id)}>✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Add a checklist item..." value={checkText}
                     onChange={(e) => setCheckText(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCheck())} />
              <button className="btn" onClick={addCheck}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
