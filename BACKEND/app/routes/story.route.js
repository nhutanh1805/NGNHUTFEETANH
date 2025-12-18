const express = require("express");
const stories = require("../controllers/story.controller"); // Import controller Story

const router = express.Router();

// --- Tuyến đường cơ bản cho /api/stories ---
router.route("/")
    .get(stories.findAll)     // GET /api/stories -> Lấy tất cả truyện (có thể kèm tìm kiếm, phân trang)
    .post(stories.create)     // POST /api/stories -> Thêm truyện mới
    .delete(stories.deleteAll); // DELETE /api/stories -> Xóa (soft delete) tất cả truyện

// --- Tuyến đường đặc biệt cho trạng thái xuất bản ---
router.route("/published")
    .get(stories.findAllPublished); // GET /api/stories/published -> Lấy danh sách truyện đã xuất bản

// --- Tuyến đường cho ID cụ thể ---
router.route("/:id")
    .get(stories.findOne)     // GET /api/stories/:id -> Lấy chi tiết một truyện
    .put(stories.update)      // PUT /api/stories/:id -> Cập nhật một truyện
    .delete(stories.delete);  // DELETE /api/stories/:id -> Xóa (soft delete) một truyện

module.exports = router;