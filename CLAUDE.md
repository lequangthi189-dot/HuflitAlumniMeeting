# GoalStack

## Project Overview

GoalStack là ứng dụng web một trang giúp người dùng tạo nhiều mục tiêu (goals), khai báo `startDate` + `totalDurationDays`, rồi chia mục tiêu thành các nhiệm vụ con (subtasks) có trọng số (%). Hệ thống phân bổ thời gian tuần tự cho từng subtask và hiển thị dòng thời gian dạng Gantt ngang. Toàn bộ dữ liệu lưu trong LocalStorage trình duyệt — không có backend.

## Tech Stack

- React 18 + Vite 5 (JavaScript, không TypeScript)
- Tailwind CSS 3 (utility-first; component shadcn-style tự viết, **không** dùng `shadcn/ui` CLI/registry)
- LocalStorage (key: `goalstack.v1`)
- Không có router, state library, hoặc test framework

## Dev Commands

Tất cả lệnh chạy tại thư mục gốc `D:\dmo\goalstack`:

- `npm install` — cài dependencies
- `npm run dev` — chạy dev server (Vite, mặc định http://localhost:5173, auto-open)
- `npm run build` — build production vào `dist/`
- `npm run preview` — preview bản build

## Core Logic Summary

Cho mỗi goal, sau khi sort subtasks theo `order`:

1. `sumWeight = Σ subtask.weight`
2. `ratio = subtask.weight / sumWeight` (nếu `sumWeight = 0` thì `ratio = 0`)
3. `durationDays = ratio × goal.totalDurationDays`
4. Subtasks tuần tự: `subtask[i].start = subtask[i-1].end`; subtask đầu tiên bắt đầu tại `goal.startDate`.
5. UI hiển thị duration làm tròn 1 chữ số thập phân (`toFixed(1)`); giá trị nội bộ giữ độ chính xác đầy đủ.
6. Tổng weight **không bắt buộc = 100**: chuẩn hóa theo tỷ lệ và cảnh báo trên UI khi `sumWeight ≠ 100`.

Hàm tham chiếu duy nhất: `computeTimeline(goal)` trong `src/lib/timeline.js`. Mọi UI **phải** đi qua hàm này, không tự tính dates.

## Key Constraints

Không được thay đổi/giả định lại nếu chưa hỏi:

- **Không thêm backend, không thêm framework state (Redux/Zustand), không thêm router.** State đi qua `useGoals` + LocalStorage.
- **Không đổi schema LocalStorage key `goalstack.v1`.** Nếu cần thay đổi cấu trúc, thêm migration thay vì bump key.
- **Không cài `shadcn/ui` package hoặc chạy CLI của nó.** Component giữ phong cách shadcn nhưng viết tay bằng Tailwind utilities trong `src/components/ui/` (nếu cần) hoặc trực tiếp trong component.
- **Không chuyển sang TypeScript.** Codebase là JavaScript thuần.
- **Không thay logic timeline** (tuần tự, theo tỷ lệ weight, mọi ngày kể cả cuối tuần) — đây là hợp đồng sản phẩm đã chốt.
- **Không tính ngày bỏ qua weekend / working-days.** Tất cả các ngày đều tính.
- **Không thêm drag-and-drop.** Reorder bằng nút ↑/↓ (đã chốt UX).
- **Không tự ý đổi đơn vị thời gian** (mặc định: days). Nếu cần hours/weeks, hỏi trước.
- **Không bypass `computeTimeline`** khi render dates hoặc tính progress.
- **Không thêm dependency** trừ khi thật cần — ưu tiên giải pháp thuần React/Tailwind.
- **Branch Management**: Trước khi thêm bất kỳ tính năng nào hoặc sửa lỗi, luôn luôn làm việc trên một nhánh (branch) git mới. Không bao giờ commit trực tiếp trên nhánh main. Các nhánh sửa lỗi phải tuân theo quy ước đặt tên bug/[des], các nhánh tính năng phải tuân theo quy ước đặt tên feature/[desc].

## Additional Documentation

Đọc tài liệu chi tiết trong `.claude/docs/` trước khi sửa các phần tương ứng:

- [`.claude/docs/architecture.md`](.claude/docs/architecture.md) — cây thư mục, luồng dữ liệu, ranh giới component.
- [`.claude/docs/data_model.md`](.claude/docs/data_model.md) — schema Goal/Subtask/Link/Checklist trong LocalStorage.
- [`.claude/docs/state_management.md`](.claude/docs/state_management.md) — hook `useGoals`, các action, persistence.
- [`.claude/docs/timeline_logic.md`](.claude/docs/timeline_logic.md) — công thức chi tiết, edge cases, normalization.
- [`.claude/docs/ui_conventions.md`](.claude/docs/ui_conventions.md) — Tailwind theme, class `btn/input/card`, palette Gantt.
- [`.claude/docs/verification.md`](.claude/docs/verification.md) — kịch bản test thủ công cần chạy trước khi báo cáo xong.
