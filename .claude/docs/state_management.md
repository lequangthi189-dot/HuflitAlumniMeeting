# State Management

Toàn bộ state ứng dụng nằm trong **một hook duy nhất**: `useGoals()` tại `src/store/useGoals.js`. Không có Context, Redux, hay Zustand.

## Khởi tạo & persist
```js
const [state, setState] = useState(() => loadState())
useEffect(() => { saveState(state) }, [state])
```
- Lazy init: đọc LocalStorage 1 lần khi mount.
- Persist sau mỗi state change (debounce không cần thiết — write nhỏ).

## API expose
| Action | Signature | Ghi chú |
|---|---|---|
| `createGoal` | `(data) => goalId` | Coerce `totalDurationDays` về `Number`; prepend vào danh sách. |
| `updateGoal` | `(id, patch)` | Shallow merge; không touch `subtasks`. |
| `deleteGoal` | `(id)` | Hard delete. |
| `addSubtask` | `(goalId, { title, weight })` | `order = subtasks.length` (append cuối). |
| `updateSubtask` | `(goalId, subId, patch)` | Shallow merge subtask. |
| `deleteSubtask` | `(goalId, subId)` | Filter + reindex `order` dense. |
| `moveSubtask` | `(goalId, subId, 'up' \| 'down')` | Swap + reindex; no-op nếu đã ở đầu/cuối. |
| `toggleDone` | `(goalId, subId)` | Toggle `done` boolean. |

## Quy ước khi mở rộng
- Mọi mutation **PHẢI** giữ immutability (spread, map, filter — không `.push`/`.splice` lên state cũ).
- Mọi mutation chạm `subtasks` phải bảo toàn invariant `order` dense (xem `data_model.md`).
- Không gọi `setState` ngoài `useGoals.js`. Component chỉ gọi action.
- Khi thêm action mới: viết wrapper qua helper `withGoal(id, fn)` đã có để tránh duplicate logic find-by-id.
- Không tách thành nhiều store. Nếu state phình to, cân nhắc `useReducer` *bên trong* `useGoals` — vẫn 1 hook expose ra ngoài.

## Side effects
- Không có async, không có network. Nếu thêm sync cloud, phải bọc trong action mới và giữ optimistic UI.
- `console.warn` chỉ dùng trong `saveState` khi quota full. Đừng spam log.
