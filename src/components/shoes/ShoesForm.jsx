/**
 * ShoesForm.jsx - Component form nhập liệu cho Shoes
 * 
 * Mục đích:
 * - Form dùng chung cho cả Tạo mới và Chỉnh sửa giày
 * - Nhận dữ liệu ban đầu (initialData) từ component cha
 * - Gọi callback onSubmit khi người dùng submit form
 * - Lấy danh sách Category từ API để hiển thị dropdown
 * 
 * Kỹ thuật:
 * - Controlled Components: Mỗi input được điều khiển bởi state
 * - useEffect: Gọi API lấy categories khi component mount
 * - Reusable Form: Dùng lại cho cả Create và Edit page
 */

import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import categoryApi from "../../api/categoryApi";

/**
 * @param {Object} props
 * @param {Object} props.initialData - Dữ liệu ban đầu (rỗng khi tạo mới, có giá trị khi sửa)
 * @param {Function} props.onSubmit - Callback xử lý submit (nhận formData làm tham số)
 * @param {boolean} props.isEdit - true nếu đang ở chế độ sửa
 */
function ShoesForm({ initialData = {}, onSubmit, isEdit = false }) {
  const navigate = useNavigate();

  // State quản lý dữ liệu form
  // Mỗi field tương ứng với một field trong ShoesRequest
  const [formData, setFormData] = useState({
    shoesName: "",
    price: "",
    quantity: "",
    manufacturer: "",
    productionDate: "",
    importDate: "",
    categoryId: "",
  });

  // State lưu danh sách category lấy từ API
  const [categories, setCategories] = useState([]);

  // State quản lý trạng thái loading khi submit form
  const [loading, setLoading] = useState(false);

  // State quản lý thông báo lỗi
  const [error, setError] = useState("");

  /**
   * useEffect #1: Lấy danh sách Category khi component mount
   * Dependency array rỗng [] -> chỉ chạy 1 lần khi mount
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        // response.data chứa mảng ShoesCategoryResponse[]
        setCategories(response.data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách danh mục:", err);
        setError("Không thể tải danh sách danh mục");
      }
    };
    fetchCategories();
  }, []);

  /**
   * useEffect #2: Cập nhật form khi initialData thay đổi (chế độ Edit)
   * Khi component cha truyền dữ liệu giày từ API xuống, cập nhật vào form
   */
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        shoesName: initialData.shoesName || "",
        price: initialData.price || "",
        quantity: initialData.quantity || "",
        manufacturer: initialData.manufacturer || "",
        // Chuyển đổi ngày từ API (có thể là ISO string) sang format yyyy-MM-dd cho input type="date"
        productionDate: formatDateForInput(initialData.productionDate),
        importDate: formatDateForInput(initialData.importDate),
        categoryId: initialData.categoryId || "",
      });
    }
  }, [initialData]);

  /**
   * Hàm chuyển đổi ngày từ API sang format yyyy-MM-dd (format yêu cầu của input type="date")
   * @param {string} dateStr - Chuỗi ngày từ API
   * @returns {string} - Chuỗi ngày format yyyy-MM-dd
   */
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // toISOString() trả về "2024-01-15T00:00:00.000Z"
    // split("T")[0] lấy phần "2024-01-15"
    return date.toISOString().split("T")[0];
  };

  /**
   * Hàm xử lý thay đổi giá trị input
   * Sử dụng kỹ thuật Computed Property Names [e.target.name]
   * để cập nhật đúng field trong state dựa trên thuộc tính name của input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Spread operator (...) giữ lại các giá trị cũ, chỉ cập nhật field đang thay đổi
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Hàm xử lý submit form
   * Chuyển đổi kiểu dữ liệu trước khi gửi lên API
   */
  const handleSubmit = async (e) => {
    // Ngăn hành vi mặc định của form (reload trang)
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Chuẩn bị dữ liệu gửi lên API
      const dataToSubmit = {
        ...formData,
        // parseFloat() chuyển chuỗi "100000" thành số 100000.0
        price: parseFloat(formData.price),
        // parseInt() chuyển chuỗi "10" thành số nguyên 10
        quantity: parseInt(formData.quantity, 10),
        // parseInt() chuyển categoryId thành số nguyên
        categoryId: parseInt(formData.categoryId, 10),
      };

      // Gọi callback onSubmit được truyền từ component cha
      await onSubmit(dataToSubmit);
    } catch (err) {
      console.error("Lỗi khi lưu dữ liệu:", err);
      // Hiển thị message lỗi từ API nếu có, nếu không hiển thị message mặc định
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu"
      );
    } finally {
      // finally luôn chạy dù thành công hay lỗi -> tắt loading
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {/* Row + Col: Hệ thống grid của Bootstrap, chia form thành 2 cột */}
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Tên giày</Form.Label>
            <Form.Control
              type="text"
              name="shoesName"
              value={formData.shoesName}
              onChange={handleChange}
              placeholder="Nhập tên giày"
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Hãng sản xuất</Form.Label>
            <Form.Control
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Nhập hãng sản xuất"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Giá</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Nhập giá"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Nhập số lượng"
              min="0"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ngày sản xuất</Form.Label>
            <Form.Control
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Ngày nhập</Form.Label>
            <Form.Control
              type="date"
              name="importDate"
              value={formData.importDate}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Danh mục</Form.Label>
            {/* Form.Select - Dropdown chọn danh mục */}
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn danh mục --</option>
              {/* Map qua danh sách categories để tạo các option */}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Nhóm nút hành động */}
      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={loading}>
          {/* Hiển thị spinner khi đang loading */}
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang lưu...
            </>
          ) : isEdit ? (
            "Cập nhật"
          ) : (
            "Tạo mới"
          )}
        </Button>
        {/* Nút Hủy - quay về danh sách */}
        <Button variant="secondary" onClick={() => navigate("/shoes")}>
          Hủy
        </Button>
      </div>
    </Form>
  );
}

export default ShoesForm;
