const MS_PER_DAY = 86400000

export function parseDate(iso) {
  const d = new Date(iso)
  return isNaN(d.getTime()) ? new Date() : d
}

export function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function totalWeight(subtasks) {
  return subtasks.reduce((s, t) => s + (Number(t.weight) || 0), 0)
}

export function computeTimeline(goal) {
  const subs = [...(goal.subtasks || [])].sort((a, b) => a.order - b.order)
  const total = Number(goal.totalDurationDays) || 0
  const sumW = totalWeight(subs)
  const start = parseDate(goal.startDate)
  let cursor = start.getTime()

  const items = subs.map((s) => {
    const ratio = sumW > 0 ? (Number(s.weight) || 0) / sumW : 0
    const duration = ratio * total
    const sStart = new Date(cursor)
    const sEnd = new Date(cursor + duration * MS_PER_DAY)
    cursor = sEnd.getTime()
    return { ...s, ratio, durationDays: duration, startDate: sStart, endDate: sEnd }
  })

  const end = new Date(start.getTime() + total * MS_PER_DAY)
  return { start, end, items, sumWeight: sumW }
}

export function weightedProgress(subtasks) {
  const sumW = totalWeight(subtasks)
  if (sumW <= 0) return 0
  const doneW = subtasks.reduce((s, t) => s + (t.done ? Number(t.weight) || 0 : 0), 0)
  return Math.round((doneW / sumW) * 100)
}
