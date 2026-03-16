/**
 * ShoesCreate.jsx - Trang tạo mới giày
 * 
 * Mục đích:
 * - Hiển thị form tạo mới giày
 * - Gọi API tạo giày khi submit form
 * - Chuyển hướng về danh sách sau khi tạo thành công
 * 
 * Kỹ thuật:
 * - Sử dụng ShoesForm component (reusable form)
 * - useNavigate hook để chuyển trang sau khi tạo thành công
 */

import { useNavigate } from "react-router-dom";
import ShoesForm from "../components/shoes/ShoesForm.jsx";
import shoesApi from "../api/shoesApi";

function ShoesCreate() {
  const navigate = useNavigate();

  /**
   * Hàm xử lý tạo mới giày
   * Được truyền vào ShoesForm như callback onSubmit
   * @param {Object} formData - Dữ liệu form (ShoesRequest)
   */
  const handleCreate = async (formData) => {
    // Gọi API tạo mới
    await shoesApi.create(formData);
    // Chuyển về trang danh sách sau khi tạo thành công
    navigate("/shoes");
  };

  return (
    <div>
      <h2 className="mb-4">Thêm mới giày</h2>
      {/* isEdit=false (mặc định) -> hiển thị nút "Tạo mới" */}
      <ShoesForm onSubmit={handleCreate} />
    </div>
  );
}

export default ShoesCreate;
