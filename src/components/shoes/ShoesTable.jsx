/**
 * ShoesTable.jsx - Component bảng hiển thị danh sách giày
 * 
 * Mục đích:
 * - Hiển thị danh sách giày dưới dạng bảng (Table)
 * - Mỗi dòng có các nút hành động: View, Edit, Delete
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
 * @param {Function} props.onDelete - Callback khi nhấn nút Delete
 */
function ShoesTable({ shoes, onDelete }) {
  const navigate = useNavigate();

  /**
   * Hàm định dạng ngày tháng từ chuỗi ISO sang dd/MM/yyyy
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Shoes Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Manufacturer</th>
          <th>Production Date</th>
          <th>Import Date</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {shoes.length === 0 ? (
          <tr>
            <td colSpan={9} className="text-center">
              No data available
            </td>
          </tr>
        ) : (
          shoes.map((shoe, index) => (
            <tr key={shoe.shoesId}>
              <td>{index + 1}</td>
              <td>{shoe.shoesName}</td>
              <td>{shoe.price?.toLocaleString()}</td>
              <td>{shoe.quantity}</td>
              <td>{shoe.manufacturer}</td>
              <td>{formatDate(shoe.productionDate)}</td>
              <td>{formatDate(shoe.importDate)}</td>
              <td>{shoe.categoryName}</td>
              <td className="action-buttons">
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => navigate(`/shoes/${shoe.shoesId}`)}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => navigate(`/shoes/edit/${shoe.shoesId}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(shoe.shoesId, shoe.shoesName)}
                >
                  Delete
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
