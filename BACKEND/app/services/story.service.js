const { ObjectId } = require("mongodb");

class StoryService {
    /**
     * @param {import("mongodb").MongoClient} client - MongoDB client instance.
     */
    constructor(client) {
        // Khai báo collection "stories"
        this.Story = client.db().collection("stories");
    }

    /**
     * Trích xuất và chuẩn hóa dữ liệu truyện từ payload.
     * @param {Object} payload - Dữ liệu đầu vào từ request body.
     * @returns {Object} Dữ liệu truyện đã được chuẩn hóa.
     */
    extractStoryData(payload) {
        const story = {
            title: payload.title,             // Tiêu đề truyện (Bắt buộc)
            author: payload.author,           // Tác giả (Bắt buộc)
            slug: payload.slug,               // Slug (URL thân thiện)
            description: payload.description, // Tóm tắt/Mô tả truyện
            content: payload.content,         // Nội dung chính (hoặc ID của chương đầu tiên)
            genres: Array.isArray(payload.genres) ? payload.genres : [], // Thể loại
            
            // ============== CÁC TRƯỜNG MEDIA ĐÃ CẬP NHẬT =============
            coverImage: payload.coverImage,   // URL ảnh bìa chính (String)
            images: Array.isArray(payload.images) ? payload.images : [], // URL các ảnh minh họa (Array of Strings)
            videos: Array.isArray(payload.videos) ? payload.videos : [], // URL các video liên quan (Array of Strings)
            // =========================================================

            rating: payload.rating ? Number(payload.rating) : undefined, // Đánh giá
            views: Number(payload.views || 0), // Số lượt xem
            chaptersCount: Number(payload.chaptersCount || 0), // Số lượng chương
            status: payload.status || "draft", // Trạng thái
            isFeatured: payload.isFeatured === true, // Truyện nổi bật
            isActive: payload.isActive !== false, // Trạng thái hoạt động
        };

        // Loại bỏ các trường có giá trị undefined
        Object.keys(story).forEach(
            (key) => story[key] === undefined && delete story[key]
        );

        return story;
    }

    /**
     * Thêm một truyện mới vào cơ sở dữ liệu.
     * @param {Object} payload - Dữ liệu truyện.
     * @returns {Object} Tài liệu truyện đã được thêm.
     */
    async create(payload) {
        const story = this.extractStoryData(payload);
        story.createdAt = new Date();
        story.updatedAt = new Date();

        // Kiểm tra trùng lặp (ví dụ: theo title và author)
        if (story.title && story.author) {
            const exist = await this.Story.findOne({ title: story.title, author: story.author });
            if (exist) throw new Error("Truyện với tiêu đề và tác giả này đã tồn tại!");
        }

        const result = await this.Story.insertOne(story);
        return { _id: result.insertedId, ...story };
    }

    /**
     * Lấy danh sách tất cả truyện dựa trên các tiêu chí tìm kiếm và phân trang.
     * @param {Object} query - Các tham số truy vấn (page, limit, search, genre...).
     * @returns {Object} Danh sách truyện kèm thông tin phân trang.
     */
    async findAll(query = {}) {
        const {
            page = 1,
            limit = 10,
            search,
            genre,
            status,
            minViews,
            sortBy = "createdAt",
            sortOrder = "desc"
        } = query;

        let filters = { isActive: true };

        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        if (genre) {
            filters.genres = genre;
        }
        
        if (status) {
            filters.status = status;
        }

        if (minViews) {
            filters.views = { $gte: Number(minViews) };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

        const [stories, total] = await Promise.all([
            this.Story.find(filters).sort(sort).skip(skip).limit(Number(limit)).toArray(),
            this.Story.countDocuments(filters)
        ]);

        return {
            stories,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    /**
     * Lấy chi tiết một truyện bằng ID.
     * @param {string} id - ID của truyện.
     * @returns {Object|null} Tài liệu truyện hoặc null nếu không tìm thấy.
     */
    async findById(id) {
        return await this.Story.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    /**
     * Lấy danh sách truyện đã xuất bản (status: 'published').
     * @param {Object} query - Các tham số truy vấn (page, limit, search...).
     * @returns {Object} Danh sách truyện đã xuất bản.
     */
    async findPublished(query = {}) {
        return await this.findAll({ ...query, status: 'published' });
    }

    /**
     * Cập nhật thông tin truyện.
     * @param {string} id - ID của truyện cần cập nhật.
     * @param {Object} payload - Dữ liệu cập nhật.
     * @returns {Object|null} Tài liệu truyện đã cập nhật hoặc null.
     */
    async update(id, payload) {
        const filter = { _id: ObjectId.isValid(id) ? new ObjectId(id) : null };
        const update = this.extractStoryData(payload);
        update.updatedAt = new Date();

        const result = await this.Story.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    /**
     * Xóa mềm (Soft Delete) một truyện (chuyển isActive về false).
     * @param {string} id - ID của truyện cần xóa.
     * @returns {Object|null} Tài liệu truyện đã được xóa mềm hoặc null.
     */
    async delete(id) {
        const result = await this.Story.findOneAndUpdate(
            { _id: ObjectId.isValid(id) ? new ObjectId(id) : null },
            { $set: { isActive: false, deletedAt: new Date() } },
            { returnDocument: "after" }
        );
        return result.value;
    }

    /**
     * Xóa mềm tất cả các truyện đang hoạt động.
     * @returns {Object} Số lượng tài liệu đã được sửa đổi.
     */
    async deleteAll() {
        const result = await this.Story.updateMany(
            { isActive: true },
            { $set: { isActive: false, deletedAt: new Date() } }
        );
        return { deletedCount: result.modifiedCount };
    }
}

module.exports = StoryService;