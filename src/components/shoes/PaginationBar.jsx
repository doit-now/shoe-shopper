/**
 * PaginationBar.jsx - Component phân trang (Pagination)
 * 
 * Mục đích:
 * - Hiển thị thanh phân trang dưới bảng danh sách
 * - Cho phép người dùng chuyển trang, chọn số bản ghi/trang
 * - Hiển thị thông tin: trang hiện tại, tổng số trang, tổng số bản ghi
 * 
 * Kỹ thuật:
 * - Sử dụng React Bootstrap Pagination component
 * - Sliding window: hiển thị tối đa 5 nút trang xung quanh trang hiện tại
 */

import { Pagination, Form, Row, Col } from "react-bootstrap";

function PaginationBar({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  isFirst,
  isLast,
  onPageChange,
  onSizeChange,
}) {
  /**
   * Hàm tạo danh sách các nút trang
   * Kỹ thuật Sliding window - cửa sổ trượt quanh trang hiện tại
   */
  const renderPageItems = () => {
    const items = [];
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <Row className="align-items-center mt-3">
      {/* Cột 1: Thông tin tổng số bản ghi */}
      <Col md={4}>
        <small className="text-muted">
          Total: <strong>{totalElements}</strong> records | Page{" "}
          <strong>{currentPage + 1}</strong> / <strong>{totalPages}</strong>
        </small>
      </Col>

      {/* Cột 2: Các nút phân trang */}
      <Col md={5} className="d-flex justify-content-center">
        <Pagination className="mb-0">
          <Pagination.First onClick={() => onPageChange(0)} disabled={isFirst} />
          <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={isFirst} />
          {currentPage > 2 && <Pagination.Ellipsis disabled />}
          {renderPageItems()}
          {currentPage < totalPages - 3 && <Pagination.Ellipsis disabled />}
          <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={isLast} />
          <Pagination.Last onClick={() => onPageChange(totalPages - 1)} disabled={isLast} />
        </Pagination>
      </Col>

      {/* Cột 3: Dropdown chọn số bản ghi mỗi trang */}
      <Col md={3} className="d-flex justify-content-end align-items-center">
        <Form.Label className="me-2 mb-0">Show:</Form.Label>
        <Form.Select
          size="sm"
          style={{ width: "80px" }}
          value={pageSize}
          onChange={(e) => onSizeChange(parseInt(e.target.value, 10))}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Form.Select>
      </Col>
    </Row>
  );
}

export default PaginationBar;
