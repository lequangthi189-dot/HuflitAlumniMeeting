const KEY = 'goalstack.v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { goals: [] }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.goals)) return { goals: [] }
    return parsed
  } catch {
    return { goals: [] }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('GoalStack: failed to persist', e)
  }
}
