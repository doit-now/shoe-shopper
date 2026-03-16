/**
 * shoesApi.js - Tầng API cho chức năng Shoes (Giày)
 * 
 * Mục đích:
 * - Tập trung tất cả API call liên quan đến Shoes vào một file
 * - Tách biệt logic gọi API khỏi component (Separation of Concerns)
 * - Dễ bảo trì và tái sử dụng
 * 
 * Các endpoint:
 * - GET    /shoes       : Lấy danh sách giày (có phân trang)
 * - GET    /shoes/:id   : Lấy chi tiết một đôi giày
 * - POST   /shoes       : Tạo mới giày
 * - PUT    /shoes/:id   : Cập nhật giày
 * - DELETE /shoes/:id   : Xóa giày
 */

import axiosClient from "./axiosClient";

const shoesApi = {
  /**
   * Lấy danh sách giày có phân trang
   * @param {Object} params - Tham số phân trang
   * @param {number} params.page - Số trang (bắt đầu từ 0)
   * @param {number} params.size - Số lượng bản ghi mỗi trang
   * @param {string} params.sortBy - Trường sắp xếp (mặc định: "shoesName")
   * @param {string} params.sortDir - Hướng sắp xếp ("asc" hoặc "desc")
   * @returns {Promise} - Promise chứa PageResponse<ShoesResponse>
   */
  getAll(params = {}) {
    // Thiết lập giá trị mặc định cho các tham số phân trang
    const {
      page = 0,
      size = 5,
      sortBy = "shoesName",
      sortDir = "asc",
    } = params;

    // Gửi GET request với query parameters
    return axiosClient.get("/shoes", {
      params: { page, size, sortBy, sortDir },
    });
  },

  /**
   * Lấy thông tin chi tiết một đôi giày theo ID
   * @param {number} id - ID của giày cần lấy
   * @returns {Promise} - Promise chứa ShoesResponse
   */
  getById(id) {
    return axiosClient.get(`/shoes/${id}`);
  },

  /**
   * Tạo mới một đôi giày
   * @param {Object} data - Dữ liệu giày (ShoesRequest)
   * @returns {Promise} - Promise chứa ShoesResponse đã tạo
   */
  create(data) {
    return axiosClient.post("/shoes", data);
  },

  /**
   * Cập nhật thông tin giày
   * @param {number} id - ID của giày cần cập nhật
   * @param {Object} data - Dữ liệu cập nhật (ShoesRequest)
   * @returns {Promise} - Promise chứa ShoesResponse đã cập nhật
   */
  update(id, data) {
    return axiosClient.put(`/shoes/${id}`, data);
  },

  /**
   * Xóa một đôi giày theo ID
   * @param {number} id - ID của giày cần xóa
   * @returns {Promise} - Promise xác nhận xóa thành công
   */
  delete(id) {
    return axiosClient.delete(`/shoes/${id}`);
  },
};

export default shoesApi;
