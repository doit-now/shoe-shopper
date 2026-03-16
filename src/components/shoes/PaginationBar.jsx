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
 * - Nhận dữ liệu phân trang từ API response (PageResponse)
 * - Component thuần hiển thị, logic xử lý ở component cha
 */

import { Pagination, Form, Row, Col } from "react-bootstrap";

/**
 * @param {Object} props
 * @param {number} props.currentPage - Trang hiện tại (bắt đầu từ 0)
 * @param {number} props.totalPages - Tổng số trang
 * @param {number} props.totalElements - Tổng số bản ghi
 * @param {number} props.pageSize - Số bản ghi mỗi trang
 * @param {boolean} props.isFirst - Có phải trang đầu tiên không
 * @param {boolean} props.isLast - Có phải trang cuối cùng không
 * @param {Function} props.onPageChange - Callback khi chuyển trang
 * @param {Function} props.onSizeChange - Callback khi thay đổi số bản ghi/trang
 */
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
   * Hiển thị tối đa 5 nút trang xung quanh trang hiện tại
   * Kỹ thuật: Sliding window - cửa sổ trượt quanh trang hiện tại
   */
  const renderPageItems = () => {
    const items = [];
    // Tính vị trí bắt đầu và kết thúc của cửa sổ trang
    // Math.max(0, ...) đảm bảo không âm
    const startPage = Math.max(0, currentPage - 2);
    // Math.min(totalPages - 1, ...) đảm bảo không vượt quá tổng trang
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage} // Highlight trang hiện tại
          onClick={() => onPageChange(i)} // Gọi callback với số trang mới
        >
          {/* Hiển thị số trang bắt đầu từ 1 (user-friendly) */}
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
          Tổng: <strong>{totalElements}</strong> bản ghi | Trang{" "}
          <strong>{currentPage + 1}</strong> / <strong>{totalPages}</strong>
        </small>
      </Col>

      {/* Cột 2: Các nút phân trang */}
      <Col md={5} className="d-flex justify-content-center">
        <Pagination className="mb-0">
          {/* Nút về trang đầu tiên */}
          <Pagination.First
            onClick={() => onPageChange(0)}
            disabled={isFirst}
          />
          {/* Nút trang trước */}
          <Pagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirst}
          />

          {/* Dấu ... nếu có nhiều trang phía trước */}
          {currentPage > 2 && <Pagination.Ellipsis disabled />}

          {/* Các nút số trang */}
          {renderPageItems()}

          {/* Dấu ... nếu có nhiều trang phía sau */}
          {currentPage < totalPages - 3 && <Pagination.Ellipsis disabled />}

          {/* Nút trang sau */}
          <Pagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLast}
          />
          {/* Nút về trang cuối */}
          <Pagination.Last
            onClick={() => onPageChange(totalPages - 1)}
            disabled={isLast}
          />
        </Pagination>
      </Col>

      {/* Cột 3: Dropdown chọn số bản ghi mỗi trang */}
      <Col md={3} className="d-flex justify-content-end align-items-center">
        <Form.Label className="me-2 mb-0">Hiển thị:</Form.Label>
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
