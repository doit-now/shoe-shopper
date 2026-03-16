/**
 * App.jsx - Component gốc (root component) của ứng dụng
 * 
 * Nhiệm vụ:
 * - Cấu hình React Router cho điều hướng trang (routing)
 * - Hiển thị thanh điều hướng (Navbar) chung cho toàn bộ ứng dụng
 * - Định nghĩa các route (đường dẫn) tới từng trang
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/layout/NavigationBar.jsx";
import ShoesList from "./pages/ShoesList.jsx";
import ShoesCreate from "./pages/ShoesCreate.jsx";
import ShoesEdit from "./pages/ShoesEdit.jsx";
import ShoesDetail from "./pages/ShoesDetail.jsx";

function App() {
  return (
    // BrowserRouter bọc toàn bộ ứng dụng để kích hoạt tính năng routing
    <BrowserRouter>
      {/* NavigationBar hiển thị trên mọi trang */}
      <NavigationBar />

      {/* Container chính chứa nội dung các trang */}
      <div className="container mt-4">
        <Routes>
          {/* Route mặc định - chuyển hướng về danh sách giày */}
          <Route path="/" element={<Navigate to="/shoes" replace />} />

          {/* Route danh sách giày - trang chính */}
          <Route path="/shoes" element={<ShoesList />} />

          {/* Route tạo mới giày */}
          <Route path="/shoes/create" element={<ShoesCreate />} />

          {/* Route chỉnh sửa giày - :id là tham số động (dynamic parameter) */}
          <Route path="/shoes/edit/:id" element={<ShoesEdit />} />

          {/* Route xem chi tiết giày */}
          <Route path="/shoes/:id" element={<ShoesDetail />} />

          {/* Route fallback - trang không tìm thấy */}
          <Route path="*" element={<h2 className="text-center mt-5">404 - Trang không tồn tại</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
