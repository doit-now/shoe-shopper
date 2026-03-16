/**
 * DeleteConfirmModal.jsx - Component hộp thoại xác nhận xóa
 * 
 * Mục đích:
 * - Hiển thị hộp thoại (Modal) xác nhận trước khi xóa giày
 * - Tránh người dùng xóa nhầm do click sai
 * - Sử dụng React Bootstrap Modal component
 * 
 * Kỹ thuật:
 * - Controlled Modal: Trạng thái show/hide được điều khiển bởi component cha
 * - Callback pattern: onConfirm và onCancel được truyền từ cha
 */

import { Modal, Button } from "react-bootstrap";

/**
 * @param {Object} props
 * @param {boolean} props.show - Hiện/ẩn modal
 * @param {string} props.shoesName - Tên giày sẽ bị xóa (hiển thị trong thông báo)
 * @param {Function} props.onConfirm - Callback khi người dùng xác nhận xóa
 * @param {Function} props.onCancel - Callback khi người dùng hủy bỏ
 */
function DeleteConfirmModal({ show, shoesName, onConfirm, onCancel }) {
  return (
    // centered - Căn giữa modal trên màn hình
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa giày{" "}
        <strong>&quot;{shoesName}&quot;</strong> không?
        <br />
        <small className="text-muted">Hành động này không thể hoàn tác.</small>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;
