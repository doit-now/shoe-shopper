/**
 * categoryApi.js - Tầng API cho chức năng Category (Danh mục giày)
 * 
 * Mục đích:
 * - Tập trung API call liên quan đến Category
 * - Chỉ cần lấy danh sách category để hiển thị dropdown trong form Shoes
 * 
 * Endpoint:
 * - GET /categories : Lấy tất cả danh mục giày
 */

import axiosClient from "./axiosClient";

const categoryApi = {
  /**
   * Lấy tất cả danh mục giày (không phân trang)
   * @returns {Promise} - Promise chứa mảng ShoesCategoryResponse[]
   */
  getAll() {
    return axiosClient.get("/categories");
  },
};

export default categoryApi;
