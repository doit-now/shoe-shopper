/**
 * ShoesList.jsx - Trang danh sách giày (trang chính)
 * 
 * Mục đích:
 * - Hiển thị danh sách giày với phân trang
 * - Cung cấp chức năng xóa giày (với xác nhận)
 * - Quản lý state phân trang và gọi API lấy dữ liệu
 * 
 * Kỹ thuật:
 * - useState: Quản lý nhiều state (dữ liệu, phân trang, modal xóa)
 * - useEffect: Gọi API khi state phân trang thay đổi
 * - Lifting State Up: Truyền state và callback xuống component con
 */

import { useState, useEffect } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import shoesApi from "../api/shoesApi";
import ShoesTable from "../components/shoes/ShoesTable.jsx";
import PaginationBar from "../components/shoes/PaginationBar.jsx";
import DeleteConfirmModal from "../components/shoes/DeleteConfirmModal.jsx";

function ShoesList() {
  const navigate = useNavigate();

  // --- State quản lý dữ liệu và phân trang ---
  const [shoes, setShoes] = useState([]); // Mảng giày hiển thị
  const [loading, setLoading] = useState(true); // Trạng thái đang tải
  const [error, setError] = useState(""); // Thông báo lỗi

  // State phân trang - tương ứng với các field trong PageResponse
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại (API dùng index 0)
  const [pageSize, setPageSize] = useState(5); // Số bản ghi/trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số bản ghi
  const [isFirst, setIsFirst] = useState(true); // Có phải trang đầu
  const [isLast, setIsLast] = useState(true); // Có phải trang cuối
  const [sortBy, setSortBy] = useState("shoesName"); // Trường sắp xếp
  const [sortDir, setSortDir] = useState("asc"); // Hướng sắp xếp

  // --- State quản lý modal xóa ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ id: null, name: "" });

  /**
   * useEffect: Gọi API lấy danh sách giày mỗi khi tham số phân trang thay đổi
   * Dependency array [currentPage, pageSize, sortBy, sortDir] - chạy lại khi bất kỳ giá trị nào thay đổi
   */
  useEffect(() => {
    fetchShoes();
  }, [currentPage, pageSize, sortBy, sortDir]);

  /**
   * Hàm gọi API lấy danh sách giày
   * async/await - Xử lý bất đồng bộ (asynchronous) một cách đồng bộ (synchronous-like)
   */
  const fetchShoes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await shoesApi.getAll({
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDir,
      });

      // Destructure dữ liệu từ PageResponse
      const data = response.data;
      setShoes(data.content || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
      setPageSize(data.pageSize);
      setIsFirst(data.first);
      setIsLast(data.last);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách giày:", err);
      setError("Không thể tải danh sách giày. Vui lòng kiểm tra kết nối API.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Hàm xử lý khi nhấn nút Xóa trên bảng
   * Mở modal xác nhận và lưu thông tin giày cần xóa
   */
  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
    setShowDeleteModal(true);
  };

  /**
   * Hàm xử lý xác nhận xóa
   * Gọi API xóa giày, sau đó reload danh sách
   */
  const handleDeleteConfirm = async () => {
    try {
      await shoesApi.delete(deleteTarget.id);
      setShowDeleteModal(false);
      // Reload danh sách sau khi xóa thành công
      // Nếu trang hiện tại chỉ có 1 bản ghi và không phải trang đầu -> quay về trang trước
      if (shoes.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchShoes();
      }
    } catch (err) {
      console.error("Lỗi khi xóa giày:", err);
      setError("Không thể xóa giày. Vui lòng thử lại.");
      setShowDeleteModal(false);
    }
  };

  /**
   * Hàm xử lý chuyển trang
   * @param {number} page - Số trang mới (index bắt đầu từ 0)
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**
   * Hàm xử lý thay đổi số bản ghi mỗi trang
   * Reset về trang đầu tiên khi thay đổi page size
   */
  const handleSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Quay về trang đầu khi thay đổi kích thước trang
  };

  return (
    <div>
      {/* Tiêu đề và nút Thêm mới */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Danh sách giày</h2>
        <Button variant="success" onClick={() => navigate("/shoes/create")}>
          + Thêm mới
        </Button>
      </div>

      {/* Hiển thị thông báo lỗi */}
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {/* Hiển thị loading spinner hoặc bảng dữ liệu */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Bảng danh sách giày */}
          <ShoesTable shoes={shoes} onDelete={handleDeleteClick} />

          {/* Thanh phân trang - chỉ hiển thị khi có dữ liệu */}
          {totalPages > 0 && (
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              isFirst={isFirst}
              isLast={isLast}
              onPageChange={handlePageChange}
              onSizeChange={handleSizeChange}
            />
          )}
        </>
      )}

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        show={showDeleteModal}
        shoesName={deleteTarget.name}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}

export default ShoesList;
