/**
 * ShoesForm.jsx - Component form nhập liệu cho Shoes
 * 
 * Mục đích:
 * - Form dùng chung cho cả Create và Edit giày
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

function ShoesForm({ initialData = {}, onSubmit, isEdit = false }) {
  const navigate = useNavigate();

  // State quản lý dữ liệu form - mỗi field tương ứng với ShoesRequest
  const [formData, setFormData] = useState({
    shoesName: "",
    price: "",
    quantity: "",
    manufacturer: "",
    productionDate: "",
    importDate: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * useEffect #1: Lấy danh sách Category khi component mount
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAll();
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Unable to load categories");
      }
    };
    fetchCategories();
  }, []);

  /**
   * useEffect #2: Cập nhật form khi initialData thay đổi (chế độ Edit)
   */
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        shoesName: initialData.shoesName || "",
        price: initialData.price || "",
        quantity: initialData.quantity || "",
        manufacturer: initialData.manufacturer || "",
        productionDate: formatDateForInput(initialData.productionDate),
        importDate: formatDateForInput(initialData.importDate),
        categoryId: initialData.categoryId || "",
      });
    }
  }, [initialData]);

  /**
   * Hàm chuyển đổi ngày từ API sang format yyyy-MM-dd cho input type="date"
   */
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  /**
   * Hàm xử lý thay đổi giá trị input
   * Kỹ thuật Computed Property Names [e.target.name]
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Hàm xử lý submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSubmit = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      console.error("Error saving data:", err);
      setError(err.response?.data?.message || "An error occurred while saving data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Shoes Name</Form.Label>
            <Form.Control
              type="text"
              name="shoesName"
              value={formData.shoesName}
              onChange={handleChange}
              placeholder="Enter shoes name"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Manufacturer</Form.Label>
            <Form.Control
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Enter manufacturer"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="0"
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Production Date</Form.Label>
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
            <Form.Label>Import Date</Form.Label>
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
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex gap-2">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
        <Button variant="secondary" onClick={() => navigate("/shoes")}>
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default ShoesForm;
