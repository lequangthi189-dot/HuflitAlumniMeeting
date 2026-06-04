# Architecture

## Cây thư mục
```
goalstack/
├── index.html              # Entry HTML, load Inter font
├── vite.config.js          # Vite + @vitejs/plugin-react, port 5173
├── tailwind.config.js      # Theme tùy chỉnh (bg/panel/border/accent...)
├── postcss.config.js       # tailwindcss + autoprefixer
├── package.json            # scripts: dev/build/preview
└── src/
    ├── main.jsx            # ReactDOM root, import index.css
    ├── App.jsx             # Router thủ công bằng useState(activeGoalId)
    ├── index.css           # @tailwind base/components/utilities + .btn/.input/.card
    ├── lib/
    │   ├── id.js           # uid() — crypto.randomUUID với fallback
    │   ├── storage.js      # loadState/saveState (key: goalstack.v1)
    │   └── timeline.js     # computeTimeline, formatDate, weightedProgress, parseDate, addDays
    ├── store/
    │   └── useGoals.js     # Hook duy nhất quản lý state + persist
    └── components/
        ├── GoalList.jsx    # Trang danh sách goals + dialog tạo mới
        ├── GoalCard.jsx    # Card 1 goal trong list (hiển thị progress)
        ├── GoalForm.jsx    # Dialog tạo/sửa goal (modal overlay tự viết)
        ├── GoalDetail.jsx  # Trang chi tiết: header + Gantt + subtasks + add form
        ├── GanttTimeline.jsx  # Thanh ngang Gantt, 8 màu xoay vòng
        ├── SubtaskCard.jsx    # Card expandable: notes/links/checklist/done
        └── ProgressBar.jsx    # Thanh progress đơn giản
```

## Luồng dữ liệu
1. `App` gọi `useGoals()` → trả về `{ goals, createGoal, updateGoal, deleteGoal, addSubtask, updateSubtask, deleteSubtask, moveSubtask, toggleDone }`.
2. `App` chọn render `GoalList` (khi `activeGoalId = null`) hoặc `GoalDetail`.
3. Cả hai trang nhận `store` (toàn bộ object trả về của hook) làm prop và gọi action trực tiếp.
4. `GoalDetail` gọi `computeTimeline(goal)` (memoized bằng `useMemo`) để derive `{ start, end, items, sumWeight }` cho Gantt + SubtaskCards.
5. Mọi mutation → `useGoals` cập nhật state → `useEffect` persist `goalstack.v1` → React re-render → `computeTimeline` chạy lại.

## Ranh giới component (quy ước)
- **Container** (`GoalList`, `GoalDetail`): biết về `store`, không tự tính dates.
- **Presentational** (`GoalCard`, `GanttTimeline`, `SubtaskCard`, `ProgressBar`): nhận props đã tính sẵn, không truy cập storage.
- **Form** (`GoalForm`): controlled state cục bộ, emit qua `onSubmit(data)`.

## Routing
Không dùng react-router. `App.jsx` dùng `useState` cho `activeGoalId`. Khi cần thêm trang, mở rộng bằng một state union (`view: 'list' | 'detail' | ...`) — **không cài router**.

## Build
Vite bundle tất cả vào `dist/` với 1 file JS + 1 file CSS. Build hiện tại: ~158 KB JS (gzip ~50 KB), ~13.5 KB CSS.
