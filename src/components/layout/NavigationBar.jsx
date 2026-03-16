/**
 * NavigationBar.jsx - Component thanh điều hướng (Navigation Bar)
 * 
 * Mục đích:
 * - Hiển thị thanh menu chung trên cùng của ứng dụng
 * - Chứa các liên kết điều hướng tới các trang chính
 * - Sử dụng React Bootstrap Navbar component
 */

import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function NavigationBar() {
  // useLocation() hook trả về đối tượng location hiện tại
  // Dùng để xác định trang đang active trên menu
  const location = useLocation();

  return (
    // bg="dark" variant="dark" - Thanh navbar màu tối
    // expand="lg" - Responsive: thu gọn thành hamburger menu trên màn hình nhỏ
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Brand/Logo - nhấn vào quay về trang chủ */}
        <Navbar.Brand as={Link} to="/shoes">
          Shoes Management
        </Navbar.Brand>

        {/* Nút toggle cho màn hình nhỏ (hamburger menu) */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Nội dung menu - tự thu gọn trên mobile */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {/* 
              as={Link} - Dùng React Router Link thay vì thẻ <a> 
              để tránh reload trang (Single Page Application)
            */}
            <Nav.Link
              as={Link}
              to="/shoes"
              active={location.pathname === "/shoes"}
            >
              Shoes List
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/shoes/create"
              active={location.pathname === "/shoes/create"}
            >
              Add New
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
