# UI Conventions

## Tailwind theme (tailwind.config.js)
Custom colors (dark theme cố định):
- `bg` `#0b1020` — nền app
- `panel` `#141a2e` — card nền
- `panel2` `#1b2240` — input/button mặc định
- `border` `#2a3358` — viền + hover
- `muted` `#8a93b2` — text phụ
- `text` `#e6e9f5` — text chính
- `accent` `#7c9cff` — primary action
- `accent2` `#5eead4` — gradient/link

Font: `Inter` (load qua Google Fonts trong `index.html`), fallback `system-ui`.

## Component classes (src/index.css @layer components)
- `.btn` — base button (panel2 + border, hover border)
- `.btn-primary` — accent fill
- `.btn-ghost` — transparent, hover panel2
- `.btn-danger` — đỏ subtle cho destructive action
- `.input` — input/textarea/select (bg panel2, focus ring accent)
- `.card` — container chính (panel bg + border)
- `.label` — label nhỏ uppercase muted

**Dùng các class này thay vì viết utility chain dài lặp lại.** Khi cần biến thể, thêm utility bổ sung sau (vd `className="btn btn-primary text-xs"`).

## Phong cách shadcn (không cài package)
Component "ui" được mong đợi viết tay với Tailwind utilities theo phong cách shadcn (border, ring focus, transition). **KHÔNG**:
- Cài `@shadcn/ui` hoặc chạy `npx shadcn-ui init`.
- Cài Radix UI primitives trừ khi đã chốt với owner.

## Dialog/Modal
Pattern hiện tại (xem `GoalForm.jsx`): fixed overlay `bg-black/60` + card centered. Khi cần dialog mới, copy pattern này — đừng cài thư viện modal.

## Gantt palette
`GanttTimeline.jsx` có array `PALETTE` 8 màu xoay vòng theo index subtask. Khi đổi, giữ độ trong suốt `/70` để text trắng đọc được.

## Form UX
- Controlled inputs trong component cha (xem `GoalForm`, `GoalDetail` add-subtask form).
- Validate tối thiểu: `required` trên field bắt buộc, không thêm thư viện validation.
- `confirm()` browser-native cho destructive action (delete). Đủ cho v1; không thay bằng modal đẹp nếu chưa được yêu cầu.

## Responsive
Breakpoint chính: `md:` (768px). Layout grid `grid-cols-1 md:grid-cols-2` cho list. Đừng thêm `sm:`/`lg:` không cần thiết.

## Accessibility — TODO list
Hiện tại đã có: `<button>` semantic, `title` tooltip trên Gantt bars, label cho input. **Chưa có**: focus trap trong modal, ARIA cho expandable card. Nếu cần fix, làm minimal (thêm `aria-expanded`, `role="dialog"`) — không refactor lớn.
