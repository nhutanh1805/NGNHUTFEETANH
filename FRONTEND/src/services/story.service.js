// src/services/story.service.js
import createApiClient from "./api.service";

class StoryService {
  constructor(baseUrl = "/api/stories") {
    this.api = createApiClient(baseUrl);
  }

  /**
   * Lấy danh sách truyện (hỗ trợ phân trang, tìm kiếm, filter genre, status...)
   * @param {Object} params - Các tham số query
   * Ví dụ: { page: 1, limit: 12, search: "thần thoại", genre: "Fantasy", status: "published" }
   */
  async getAll(params = {}) {
    return (await this.api.get("/", { params })).data;
  }

  /**
   * Lấy danh sách truyện đã xuất bản (status = "published")
   * @param {Object} params - Các tham số query giống getAll
   */
  async getPublished(params = {}) {
    return (await this.api.get("/published", { params })).data;
  }

  /**
   * Lấy chi tiết một truyện theo ID
   * @param {string} id - ObjectId của truyện
   */
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  /**
   * Tạo truyện mới
   * @param {Object} data - Dữ liệu truyện (title, author, description, genres, coverImage...)
   */
  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  /**
   * Cập nhật truyện
   * @param {string} id - ID truyện
   * @param {Object} data - Dữ liệu cần cập nhật
   */
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  /**
   * Xóa một truyện (soft delete)
   * @param {string} id - ID truyện
   */
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  /**
   * Xóa tất cả truyện (soft delete all) - chỉ dùng khi test
   */
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  /**
   * Bonus: Lấy truyện nổi bật (isFeatured = true)
   * Backend chưa có filter riêng, nên dùng params của getAll
   */
  async getFeatured(params = { isFeatured: true, limit: 6 }) {
    return (await this.api.get("/", { params })).data;
  }
}

export default new StoryService();