const StoryService = require("../services/story.service"); // Giả định đã tạo story.service
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// POST /api/stories - Thêm truyện mới
exports.create = async (req, res, next) => {
    // 1. Kiểm tra dữ liệu bắt buộc
    if (!req.body?.title || !req.body?.author) {
        return next(new ApiError(400, "Tiêu đề và tác giả không được để trống"));
    }

    try {
        // 2. Khởi tạo Service và thực hiện thêm
        const storyService = new StoryService(MongoDB.client);
        const document = await storyService.create(req.body);
        return res.status(201).json({
            message: "Thêm truyện thành công",
            data: document,
        });
    } catch (error) {
        // 3. Xử lý lỗi
        console.error("Lỗi khi thêm truyện:", error);
        return next(
            new ApiError(500, error.message || "Đã xảy ra lỗi khi thêm truyện")
        );
    }
};

// GET /api/stories - Lấy danh sách truyện
exports.findAll = async (req, res, next) => {
    try {
        const storyService = new StoryService(MongoDB.client);
        // Lấy query string (ví dụ: ?title=truyen_hay) để tìm kiếm
        const result = await storyService.findAll(req.query); 
        return res.json({
            message: result.stories?.length > 0 ? "Lấy danh sách truyện thành công" : "Không tìm thấy truyện nào",
            ...result,
        });
    } catch (error) {
        console.error("Lỗi khi truy xuất danh sách truyện:", error);
        return next(new ApiError(500, "Lỗi khi truy xuất danh sách truyện"));
    }
};

// GET /api/stories/:id - Lấy chi tiết một truyện
exports.findOne = async (req, res, next) => {
    try {
        const storyService = new StoryService(MongoDB.client);
        const document = await storyService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy truyện"));
        }
        // Có thể thêm kiểm tra trạng thái isActive/isPublished nếu cần
        return res.json(document);
    } catch (error) {
        console.error("Lỗi khi truy xuất truyện:", error);
        return next(new ApiError(500, `Lỗi khi truy xuất truyện id=${req.params.id}`));
    }
};

// PUT /api/stories/:id - Cập nhật một truyện
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
    }

    try {
        const storyService = new StoryService(MongoDB.client);
        const document = await storyService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy truyện để cập nhật"));
        }
        return res.json({ message: "Cập nhật truyện thành công", data: document });
    } catch (error) {
        console.error("Lỗi khi cập nhật truyện:", error);
        return next(new ApiError(500, `Lỗi khi cập nhật truyện id=${req.params.id}`));
    }
};

// DELETE /api/stories/:id - Xóa một truyện (thường là soft delete: chuyển trạng thái)
exports.delete = async (req, res, next) => {
    try {
        const storyService = new StoryService(MongoDB.client);
        // Giả định soft delete (chuyển trạng thái isActive/isDeleted)
        const document = await storyService.delete(req.params.id); 
        if (!document) {
            return next(new ApiError(404, "Không tìm thấy truyện để xóa"));
        }
        return res.json({ message: "Xóa truyện thành công (soft delete)" });
    } catch (error) {
        console.error("Lỗi khi xóa truyện:", error);
        return next(new ApiError(500, `Không thể xóa truyện id=${req.params.id}`));
    }
};

// DELETE /api/stories/ - Xóa tất cả truyện
exports.deleteAll = async (req, res, next) => {
    try {
        const storyService = new StoryService(MongoDB.client);
        const result = await storyService.deleteAll(); // Giả định soft delete
        return res.json({
            message: `Đã xóa trạng thái ${result.deletedCount} truyện`,
        });
    } catch (error) {
        console.error("Lỗi khi xóa tất cả truyện:", error);
        return next(new ApiError(500, "Đã xảy ra lỗi khi xóa tất cả truyện"));
    }
};

// GET /api/stories/published - Lấy danh sách truyện đã xuất bản
exports.findAllPublished = async (req, res, next) => {
    try {
        const storyService = new StoryService(MongoDB.client);
        // Giả định có phương thức findPublished trong StoryService
        const result = await storyService.findPublished(req.query); 
        return res.json({
            message: "Lấy danh sách truyện đã xuất bản thành công",
            ...result,
        });
    } catch (error) {
        console.error("Lỗi khi lấy truyện đã xuất bản:", error);
        return next(new ApiError(500, "Lỗi khi lấy truyện đã xuất bản"));
    }
};