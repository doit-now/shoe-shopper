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
  const { id } = useParams();
  const navigate = useNavigate();

  const [shoesData, setShoesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * useEffect: Lấy dữ liệu giày theo ID khi component mount
   */
  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await shoesApi.getById(id);
        setShoesData(response.data);
      } catch (err) {
        console.error("Error fetching shoes:", err);
        setError("Unable to load shoes data");
      } finally {
        setLoading(false);
      }
    };
    fetchShoes();
  }, [id]);

  const handleUpdate = async (formData) => {
    await shoesApi.update(id, formData);
    navigate("/shoes");
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Edit Shoes</h2>
      <ShoesForm initialData={shoesData} onSubmit={handleUpdate} isEdit />
    </div>
  );
}

export default ShoesEdit;
