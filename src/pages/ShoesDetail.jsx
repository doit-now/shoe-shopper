/**
 * ShoesDetail.jsx - Trang xem chi tiết giày
 * 
 * Mục đích:
 * - Hiển thị toàn bộ thông tin chi tiết của một đôi giày
 * - Cung cấp nút quay lại danh sách và nút chỉnh sửa
 * 
 * Kỹ thuật:
 * - useParams: Lấy ID giày từ URL
 * - useEffect: Gọi API lấy chi tiết giày
 * - Card component: Hiển thị thông tin dạng thẻ (card layout)
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spinner, Alert, Row, Col } from "react-bootstrap";
import shoesApi from "../api/shoesApi";

function ShoesDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shoes, setShoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Lấy chi tiết giày từ API khi component mount
   */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await shoesApi.getById(id);
        setShoes(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết giày:", err);
        setError("Không thể tải thông tin giày");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  /**
   * Hàm format ngày tháng
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!shoes) {
    return <Alert variant="warning">Không tìm thấy giày</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Chi tiết giày</h2>
      <Card>
        <Card.Header as="h5">{shoes.shoesName}</Card.Header>
        <Card.Body>
          {/* Hiển thị thông tin chi tiết dạng 2 cột */}
          <Row>
            <Col md={6}>
              <p><strong>Mã giày:</strong> {shoes.shoesId}</p>
              <p><strong>Tên giày:</strong> {shoes.shoesName}</p>
              <p><strong>Giá:</strong> {shoes.price?.toLocaleString()} VNĐ</p>
              <p><strong>Số lượng:</strong> {shoes.quantity}</p>
            </Col>
            <Col md={6}>
              <p><strong>Hãng sản xuất:</strong> {shoes.manufacturer}</p>
              <p><strong>Ngày sản xuất:</strong> {formatDate(shoes.productionDate)}</p>
              <p><strong>Ngày nhập:</strong> {formatDate(shoes.importDate)}</p>
              <p><strong>Danh mục:</strong> {shoes.categoryName}</p>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex gap-2">
          <Button variant="primary" onClick={() => navigate("/shoes")}>
            ← Quay lại
          </Button>
          <Button variant="warning" onClick={() => navigate(`/shoes/edit/${shoes.shoesId}`)}>
            Sửa
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ShoesDetail;
