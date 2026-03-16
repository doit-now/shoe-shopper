/**
 * ShoesEdit.jsx - Trang chỉnh sửa giày
 * 
 * Mục đích:
 * - Lấy dữ liệu giày hiện tại từ API theo ID
 * - Hiển thị form với dữ liệu đã có (pre-filled)
 * - Gọi API cập nhật khi submit form
 * 
 * Kỹ thuật:
 * - useParams hook: Lấy tham số :id từ URL
 * - useEffect: Gọi API lấy dữ liệu giày khi component mount
 * - Truyền initialData vào ShoesForm để pre-fill form
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import ShoesForm from "../components/shoes/ShoesForm.jsx";
import shoesApi from "../api/shoesApi";

function ShoesEdit() {
  // useParams() lấy tham số động từ URL (ví dụ: /shoes/edit/5 -> id = "5")
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu dữ liệu giày lấy từ API
  const [shoesData, setShoesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * useEffect: Lấy dữ liệu giày theo ID khi component mount
   * Dependency [id] -> chạy lại nếu ID thay đổi
   */
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await shoesApi.getById(id);
        setShoesData(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin giày:", err);
        setError("Không thể tải thông tin giày");
      } finally {
        setLoading(false);
      }
    };
    fetchShoes();
  }, [id]);

  /**
   * Hàm xử lý cập nhật giày
   * @param {Object} formData - Dữ liệu form (ShoesRequest)
   */
  const handleUpdate = async (formData) => {
    await shoesApi.update(id, formData);
    navigate("/shoes");
  };

  // Hiển thị loading khi đang lấy dữ liệu
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Hiển thị lỗi nếu không lấy được dữ liệu
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Chỉnh sửa giày</h2>
      {/* isEdit=true -> hiển thị nút "Cập nhật" thay vì "Tạo mới" */}
      <ShoesForm initialData={shoesData} onSubmit={handleUpdate} isEdit />
    </div>
  );
}

export default ShoesEdit;
