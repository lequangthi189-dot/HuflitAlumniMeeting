import { useCallback, useEffect, useState } from 'react'
import { loadState, saveState } from '../lib/storage.js'
import { uid } from '../lib/id.js'

export function useGoals() {
  const [state, setState] = useState(() => loadState())

  useEffect(() => { saveState(state) }, [state])

  const update = (fn) => setState((s) => ({ ...s, goals: fn(s.goals) }))

  const createGoal = useCallback((data) => {
    const goal = {
      id: uid(),
      title: data.title?.trim() || 'Untitled goal',
      description: data.description || '',
      startDate: data.startDate || new Date().toISOString().slice(0, 10),
      totalDurationDays: Number(data.totalDurationDays) || 0,
      createdAt: new Date().toISOString(),
      subtasks: []
    }
    update((goals) => [goal, ...goals])
    return goal.id
  }, [])

  const updateGoal = useCallback((id, patch) => {
    update((goals) => goals.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }, [])

  const deleteGoal = useCallback((id) => {
    update((goals) => goals.filter((g) => g.id !== id))
  }, [])

  const withGoal = (id, fn) =>
    update((goals) => goals.map((g) => (g.id === id ? fn(g) : g)))

  const addSubtask = useCallback((goalId, data) => {
    withGoal(goalId, (g) => {
      const sub = {
        id: uid(),
        title: data.title?.trim() || 'Untitled subtask',
        weight: Number(data.weight) || 0,
        notes: '',
        links: [],
        checklist: [],
        done: false,
        order: g.subtasks.length
      }
      return { ...g, subtasks: [...g.subtasks, sub] }
    })
  }, [])

  const updateSubtask = useCallback((goalId, subId, patch) => {
    withGoal(goalId, (g) => ({
      ...g,
      subtasks: g.subtasks.map((s) => (s.id === subId ? { ...s, ...patch } : s))
    }))
  }, [])

  const deleteSubtask = useCallback((goalId, subId) => {
    withGoal(goalId, (g) => {
      const next = g.subtasks.filter((s) => s.id !== subId)
        .sort((a, b) => a.order - b.order)
        .map((s, i) => ({ ...s, order: i }))
      return { ...g, subtasks: next }
    })
  }, [])

  const moveSubtask = useCallback((goalId, subId, dir) => {
    withGoal(goalId, (g) => {
      const sorted = [...g.subtasks].sort((a, b) => a.order - b.order)
      const idx = sorted.findIndex((s) => s.id === subId)
      if (idx < 0) return g
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= sorted.length) return g
      ;[sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]]
      return { ...g, subtasks: sorted.map((s, i) => ({ ...s, order: i })) }
    })
  }, [])

  const toggleDone = useCallback((goalId, subId) => {
    withGoal(goalId, (g) => ({
      ...g,
      subtasks: g.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s))
    }))
  }, [])

  return {
    goals: state.goals,
    createGoal, updateGoal, deleteGoal,
    addSubtask, updateSubtask, deleteSubtask, moveSubtask, toggleDone
  }
}
