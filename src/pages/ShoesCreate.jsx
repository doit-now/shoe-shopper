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
   */
  const handleCreate = async (formData) => {
    await shoesApi.create(formData);
    navigate("/shoes");
  };

  return (
    <div>
      <h2 className="mb-4">Add New Shoes</h2>
      <ShoesForm onSubmit={handleCreate} />
    </div>
  );
}

export default ShoesCreate;
