# Timeline Logic

Nguồn chân lý: `src/lib/timeline.js`. Mọi tính toán dates/duration/progress **phải** đi qua các hàm trong file này.

## Hằng số
```js
const MS_PER_DAY = 86_400_000
```

## API

### `computeTimeline(goal) → { start, end, items, sumWeight }`
Bước:
1. Sort `goal.subtasks` theo `order` tăng dần (không mutate input).
2. `sumWeight = Σ Number(weight) || 0`.
3. `start = parseDate(goal.startDate)` (fallback `new Date()` nếu parse fail).
4. Cursor `= start.getTime()`. Với mỗi subtask:
   - `ratio = sumWeight > 0 ? weight / sumWeight : 0`
   - `durationDays = ratio × goal.totalDurationDays`
   - `startDate = new Date(cursor)`
   - `endDate = new Date(cursor + durationDays × MS_PER_DAY)`
   - `cursor = endDate.getTime()`
5. `end = start + totalDurationDays × MS_PER_DAY` (độc lập với items — luôn bằng goal end ngay cả khi không có subtasks).

Trả về items giữ nguyên field gốc + bổ sung `{ ratio, durationDays, startDate, endDate }`.

### `weightedProgress(subtasks) → 0..100`
`Σ weight(done) / Σ weight × 100`, làm tròn `Math.round`. Trả 0 nếu `sumWeight ≤ 0`.

### `formatDate(date) → string`
`toLocaleDateString` với `{ year:'numeric', month:'short', day:'2-digit' }`. Trả `'—'` nếu invalid.

### `parseDate(iso)`, `addDays(date, n)`, `totalWeight(subtasks)`
Helpers thuần — đọc source để biết chi tiết.

## Quy tắc làm tròn (UI)
- Hiển thị `durationDays.toFixed(1)` — 1 chữ số thập phân.
- Giá trị nội bộ KHÔNG làm tròn. Đừng round trong `computeTimeline`; chỉ round khi render.

## Edge cases (đã test thủ công, giữ behavior)
| Trường hợp | Kết quả mong đợi |
|---|---|
| `subtasks = []` | `items: []`, `end = start + totalDurationDays`. Gantt hiển thị empty state. |
| `sumWeight = 0` (tất cả weight = 0) | Mọi `ratio = 0`, `durationDays = 0`, các subtask đều start = end = goal.start. |
| `sumWeight ≠ 100` | Normalize theo tỷ lệ. UI cảnh báo amber trong `GanttTimeline`, **không** chặn lưu. |
| `totalDurationDays = 0` | Mọi subtask duration = 0; `end = start`. |
| `startDate` invalid | `parseDate` fallback `new Date()` (today). |
| 1 subtask duy nhất | Chiếm full timeline bất kể weight (miễn weight > 0). |

## Đừng làm
- Không tự `new Date(goal.startDate)` ở component — dùng `parseDate`.
- Không tính ngày bỏ qua weekend / holiday. Đã chốt: tất cả các ngày.
- Không cho subtasks chạy song song / overlap — luôn tuần tự.
- Không thay thứ tự sort khác `order` (vd: sort theo title) khi tính timeline.
