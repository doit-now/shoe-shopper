/**
 * DeleteConfirmModal.jsx - Component hộp thoại xác nhận xóa
 * 
 * Mục đích:
 * - Hiển thị hộp thoại (Modal) xác nhận trước khi xóa giày
 * - Tránh người dùng xóa nhầm do click sai
 * 
 * Kỹ thuật:
 * - Controlled Modal: Trạng thái show/hide được điều khiển bởi component cha
 * - Callback pattern: onConfirm và onCancel được truyền từ cha
 */

import { Modal, Button } from "react-bootstrap";

function DeleteConfirmModal({ show, shoesName, onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete{" "}
        <strong>&quot;{shoesName}&quot;</strong>?
        <br />
        <small className="text-muted">This action cannot be undone.</small>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;
