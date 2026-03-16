/**
 * axiosClient.js - Cấu hình Axios instance dùng chung cho toàn bộ ứng dụng
 * 
 * Mục đích:
 * - Tạo một instance Axios với cấu hình mặc định (baseURL, headers, timeout)
 * - Tất cả các API call trong ứng dụng sẽ dùng instance này
 * - Giúp dễ dàng thay đổi cấu hình chung (ví dụ: thêm token xác thực)
 * 
 * Kỹ thuật:
 * - axios.create() tạo instance riêng, không ảnh hưởng tới axios mặc định
 * - baseURL được đặt là http://localhost:8080/api theo yêu cầu đề bài
 */

import axios from "axios";

// Tạo Axios instance với cấu hình mặc định
const axiosClient = axios.create({
  // URL gốc của API Spring Boot - tất cả request sẽ bắt đầu từ đây
  baseURL: "http://localhost:8080/api",

  // Headers mặc định cho mọi request
  headers: {
    "Content-Type": "application/json",
  },

  // Thời gian chờ tối đa cho mỗi request (10 giây)
  timeout: 10000,
});

// Có thể thêm interceptor ở đây nếu cần xử lý token, refresh token, hoặc xử lý lỗi chung
// Ví dụ:
// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default axiosClient;
