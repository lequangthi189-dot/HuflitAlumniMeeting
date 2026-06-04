# Verification

Chạy kịch bản sau **trước khi báo cáo task UI/logic xong**. Không có automated test — verify thủ công.

## Setup
```
npm install
npm run dev
```
Mở http://localhost:5173 trong trình duyệt sạch (clear LocalStorage hoặc dùng incognito).

## Smoke test (golden path)
1. **Tạo goal**: Click "+ New goal". Nhập title `Học Spanish`, startDate hôm nay, totalDuration `10`. Submit → goal hiện trong grid.
2. **Mở goal**: Click card → vào GoalDetail. Header hiển thị Start/End/Duration/Subtasks=0.
3. **Thêm 3 subtasks**: title `A` weight `20`, `B` weight `30`, `C` weight `50` → Gantt hiện 3 bar tỷ lệ 20/30/50.
4. **Kiểm tra dates**: A = 2 ngày từ start; B tiếp 3 ngày; C tiếp 5 ngày; tổng = 10 ngày. End date = start + 10.
5. **Đổi weight**: Mở rộng B, sửa weight thành `60` → Gantt + dates của B và C tự cập nhật ngay.
6. **Reorder**: Click ↓ trên A → A xuống vị trí 2, dates tính lại; click ↑ để khôi phục.
7. **Expand + đính kèm**: Click A → thêm note, thêm 2 link (1 có label, 1 chỉ url), thêm 3 checklist item, tick 2.
8. **Toggle done**: Tick checkbox A → progress bar header tăng theo % weight A; bar A trên Gantt có dấu ✓.
9. **Persist**: Reload trang (F5) → mọi dữ liệu giữ nguyên (notes, links, checklist, done, weight, order).
10. **Xóa subtask**: Xóa B → A và C reindex, Gantt + dates cập nhật.
11. **Edit goal**: Click "Edit goal" → đổi totalDuration thành `20` → mọi subtask duration nhân đôi.
12. **Xóa goal**: Click Delete (confirm) → quay về list, goal biến mất; reload vẫn không có.

## Edge cases bắt buộc kiểm tra khi đụng `timeline.js`
- Goal có 0 subtasks: Gantt hiển thị empty state, không crash.
- Tất cả weight = 0: dates không lùi, không NaN.
- Tổng weight = 50%: cảnh báo amber hiện ra trên Gantt; dates vẫn chia tỷ lệ (50% chia cho 50 = 100% effective).
- totalDuration = 0: end = start, các bar có width nhưng duration = 0d.
- 1 subtask weight = 1: chiếm full timeline.

## Build check
```
npm run build
```
Phải hoàn tất không error. JS bundle hiện ~158 KB; warn nếu tăng đột biến >50%.

## Khi sửa schema
Mở DevTools → Application → LocalStorage → `goalstack.v1`. Verify JSON shape khớp `data_model.md`. Test load từ state cũ (paste JSON cũ vào, reload).
