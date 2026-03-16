/**
 * main.jsx - Điểm khởi đầu (entry point) của ứng dụng React
 * 
 * File này có nhiệm vụ:
 * - Import Bootstrap CSS cho toàn bộ ứng dụng
 * - Render component App vào DOM element có id="root"
 * - Sử dụng createRoot API của React 18+ (concurrent mode)
 */

import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Import Bootstrap CSS - cần import trước để các component React Bootstrap hoạt động đúng
import "bootstrap/dist/css/bootstrap.min.css";

// Import CSS tùy chỉnh của ứng dụng (ghi đè sau Bootstrap)
import "./index.css";

// createRoot là API mới của React 18+, thay thế ReactDOM.render()
// Cho phép sử dụng concurrent features của React
createRoot(document.getElementById("root")).render(<App />);
