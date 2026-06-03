import { useState } from 'react'
import { useGoals } from './store/useGoals.js'
import GoalList from './components/GoalList.jsx'
import GoalDetail from './components/GoalDetail.jsx'

export default function App() {
  const store = useGoals()
  const [activeGoalId, setActiveGoalId] = useState(null)
  const active = store.goals.find((g) => g.id === activeGoalId)

  return active
    ? <GoalDetail goal={active} store={store} onBack={() => setActiveGoalId(null)} />
    : <GoalList store={store} onOpenGoal={setActiveGoalId} />
}
