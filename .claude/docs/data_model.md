# Data Model

## LocalStorage
- Key: `goalstack.v1`
- Value: JSON string của object root `{ goals: Goal[] }`.
- Reader: `loadState()` trong `src/lib/storage.js` (trả `{ goals: [] }` khi parse fail hoặc thiếu).
- Writer: `saveState(state)` — gọi qua `useEffect` trong `useGoals`, ghi sau mỗi state change.

## Schema

### Goal
```js
{
  id: string,               // uuid (crypto.randomUUID)
  title: string,            // required khi tạo; fallback "Untitled goal"
  description: string,      // optional, text dài
  startDate: string,        // ISO date "YYYY-MM-DD" (input type=date)
  totalDurationDays: number,// >= 0, cho phép thập phân (step 0.5 trong form)
  createdAt: string,        // ISO datetime, set khi tạo, không thay đổi
  subtasks: Subtask[]
}
```

### Subtask
```js
{
  id: string,               // uuid
  title: string,
  weight: number,           // %, integer step trong UI, không bắt buộc tổng = 100
  notes: string,            // text dài
  links: Link[],
  checklist: ChecklistItem[],
  done: boolean,            // hoàn thành toàn bộ subtask
  order: number             // 0-based, dense, là source of truth cho thứ tự
}
```

### Link
```js
{ id: string, label: string, url: string }
```
- `label` rỗng → UI hiển thị `url` thay thế.
- Không validate URL — nếu thêm validation phải hỏi.

### ChecklistItem
```js
{ id: string, text: string, done: boolean }
```
Checklist con **không** ảnh hưởng đến `subtask.done` hay progress (decoupled). Đừng tự nối logic.

## Invariants (BẮT BUỘC giữ)
- `subtasks` luôn có `order` dense `0..n-1` sau mọi mutation (xóa → reindex; move → swap + reindex).
- `id` toàn cục unique trong scope của mỗi list (goals, subtasks trong cùng goal, links trong subtask, checklist trong subtask).
- `startDate` luôn là chuỗi `YYYY-MM-DD`. Khi đọc, dùng `parseDate()` trong `timeline.js` — không tự `new Date(string)`.
- `totalDurationDays`, `weight` luôn là `number` (đã coerce qua `Number(...)` trong `useGoals`). Đừng để string lọt vào state.

## Migration
Nếu cần đổi schema, viết function migration đọc key cũ và ghi lại, **giữ nguyên key `goalstack.v1`** trừ khi đổi major version (`goalstack.v2`). Cập nhật `loadState` để detect & migrate.
