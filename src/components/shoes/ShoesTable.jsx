/**
 * ShoesTable.jsx - Component bảng hiển thị danh sách giày
 * 
 * Mục đích:
 * - Hiển thị danh sách giày dưới dạng bảng (Table)
 * - Mỗi dòng có các nút hành động: Xem, Sửa, Xóa
 * - Nhận dữ liệu và callback từ component cha thông qua props
 * 
 * Kỹ thuật:
 * - Component thuần hiển thị (Presentational Component)
 * - Không chứa logic xử lý dữ liệu, chỉ nhận qua props
 */

import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

/**
 * @param {Object} props
 * @param {Array} props.shoes - Mảng các đối tượng ShoesResponse
 * @param {Function} props.onDelete - Callback khi nhấn nút Xóa
 */
function ShoesTable({ shoes, onDelete }) {
  // Hook useNavigate dùng để chuyển trang bằng code (programmatic navigation)
  const navigate = useNavigate();

  /**
   * Hàm định dạng ngày tháng từ chuỗi ISO sang dd/MM/yyyy
   * @param {string} dateStr - Chuỗi ngày từ API (ISO format)
   * @returns {string} - Chuỗi ngày đã format
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    // padStart(2, "0") - Thêm số 0 phía trước nếu chỉ có 1 chữ số
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() trả về 0-11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    // striped - Tô màu xen kẽ các dòng
    // bordered - Thêm viền cho bảng
    // hover - Highlight dòng khi rê chuột
    // responsive - Tự động thêm thanh cuộn ngang trên màn hình nhỏ
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Tên giày</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Hãng sản xuất</th>
          <th>Ngày sản xuất</th>
          <th>Ngày nhập</th>
          <th>Danh mục</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {/* 
          Kiểm tra mảng shoes có dữ liệu không
          Nếu rỗng -> hiển thị thông báo
          Nếu có -> map() qua từng phần tử để render dòng
        */}
        {shoes.length === 0 ? (
          <tr>
            {/* colSpan={9} - Gộp 9 cột thành 1 để hiển thị thông báo */}
            <td colSpan={9} className="text-center">
              Không có dữ liệu
            </td>
          </tr>
        ) : (
          shoes.map((shoe, index) => (
            <tr key={shoe.shoesId}>
              {/* Số thứ tự dòng */}
              <td>{index + 1}</td>
              <td>{shoe.shoesName}</td>
              {/* toLocaleString() - Format số có dấu phẩy phân cách hàng nghìn */}
              <td>{shoe.price?.toLocaleString()}</td>
              <td>{shoe.quantity}</td>
              <td>{shoe.manufacturer}</td>
              <td>{formatDate(shoe.productionDate)}</td>
              <td>{formatDate(shoe.importDate)}</td>
              <td>{shoe.categoryName}</td>
              <td className="action-buttons">
                {/* Nút Xem chi tiết - variant="info" màu xanh dương nhạt */}
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => navigate(`/shoes/${shoe.shoesId}`)}
                >
                  Xem
                </Button>
                {/* Nút Sửa - variant="warning" màu vàng */}
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => navigate(`/shoes/edit/${shoe.shoesId}`)}
                >
                  Sửa
                </Button>
                {/* Nút Xóa - variant="danger" màu đỏ, gọi callback onDelete */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(shoe.shoesId, shoe.shoesName)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );
}

export default ShoesTable;
