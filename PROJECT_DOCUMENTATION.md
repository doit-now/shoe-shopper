# 📚 Shoes Management - Tài liệu dự án

## 1. Tổng quan dự án

Ứng dụng **Shoes Management** là một ứng dụng CRUD (Create - Read - Update - Delete) quản lý giày dép, xây dựng bằng **React** kết hợp gọi API từ **Spring Boot** backend.

### Công nghệ sử dụng
| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| React | 18.x | Thư viện xây dựng giao diện |
| React Router DOM | 6.x | Điều hướng trang (routing) |
| React Bootstrap | latest | UI component library (dựa trên Bootstrap 5) |
| Axios | latest | HTTP client gọi API |
| Vite | 5.x | Build tool & dev server |
| JavaScript (ES6+) | - | Ngôn ngữ lập trình |

---

## 2. Cấu trúc dự án

```
src/
├── api/                          # Tầng API - tập trung các hàm gọi API
│   ├── axiosClient.js            # Cấu hình Axios instance dùng chung
│   ├── shoesApi.js               # API endpoints cho Shoes
│   └── categoryApi.js            # API endpoints cho Category
│
├── components/                   # Components tái sử dụng
│   ├── layout/                   # Components bố cục chung
│   │   └── NavigationBar.jsx     # Thanh điều hướng
│   └── shoes/                    # Components liên quan đến Shoes
│       ├── ShoesTable.jsx        # Bảng hiển thị danh sách giày
│       ├── ShoesForm.jsx         # Form nhập liệu (dùng chung Create/Edit)
│       ├── PaginationBar.jsx     # Thanh phân trang
│       └── DeleteConfirmModal.jsx # Modal xác nhận xóa
│
├── pages/                        # Các trang (page-level components)
│   ├── ShoesList.jsx             # Trang danh sách giày (trang chính)
│   ├── ShoesCreate.jsx           # Trang tạo mới giày
│   ├── ShoesEdit.jsx             # Trang chỉnh sửa giày
│   └── ShoesDetail.jsx           # Trang xem chi tiết giày
│
├── App.jsx                       # Component gốc, cấu hình routing
├── main.jsx                      # Entry point, render App vào DOM
└── index.css                     # CSS tùy chỉnh
```

### Giải thích cấu trúc

- **`api/`**: Tầng API tách biệt - tất cả logic gọi HTTP được gom vào đây. Khi API thay đổi, chỉ cần sửa ở một nơi.
- **`components/`**: Chứa các component tái sử dụng. Chia theo chức năng (`layout/`, `shoes/`).
- **`pages/`**: Mỗi file tương ứng một trang/route. Component trang chứa logic nghiệp vụ chính.

---

## 3. Luồng chạy ứng dụng

### 3.1. Khởi động
```
main.jsx → render App.jsx → BrowserRouter + Routes → ShoesList (trang mặc định)
```

### 3.2. Luồng hiển thị danh sách (ShoesList)
```
1. Component mount → useEffect chạy
2. Gọi shoesApi.getAll({ page, size, sortBy, sortDir })
3. Axios gửi GET request đến http://localhost:8080/api/shoes?page=0&size=5&sortBy=shoesName&sortDir=asc
4. API trả về PageResponse<ShoesResponse>
5. Cập nhật state → React re-render → Hiển thị bảng + phân trang
```

### 3.3. Luồng tạo mới (ShoesCreate)
```
1. User nhấn "Thêm mới" → navigate("/shoes/create")
2. ShoesCreate render ShoesForm (không có initialData)
3. ShoesForm gọi categoryApi.getAll() → load dropdown danh mục
4. User điền form → submit
5. Gọi shoesApi.create(formData) → POST /api/shoes
6. Thành công → navigate("/shoes") quay về danh sách
```

### 3.4. Luồng chỉnh sửa (ShoesEdit)
```
1. User nhấn "Sửa" → navigate("/shoes/edit/:id")
2. ShoesEdit dùng useParams() lấy id từ URL
3. Gọi shoesApi.getById(id) → GET /api/shoes/:id
4. Truyền dữ liệu vào ShoesForm qua prop initialData
5. ShoesForm pre-fill các input với dữ liệu có sẵn
6. User sửa → submit → shoesApi.update(id, formData) → PUT /api/shoes/:id
7. Thành công → navigate("/shoes")
```

### 3.5. Luồng xóa
```
1. User nhấn "Xóa" → mở DeleteConfirmModal
2. User xác nhận → shoesApi.delete(id) → DELETE /api/shoes/:id
3. Thành công → reload danh sách (fetchShoes)
```

---

## 4. API Endpoints

| Method | Endpoint | Mô tả | Request Body | Response |
|---|---|---|---|---|
| GET | `/api/shoes?page=0&size=5&sortBy=shoesName&sortDir=asc` | Danh sách giày (phân trang) | - | PageResponse<ShoesResponse> |
| GET | `/api/shoes/:id` | Chi tiết giày | - | ShoesResponse |
| POST | `/api/shoes` | Tạo mới giày | ShoesRequest | ShoesResponse |
| PUT | `/api/shoes/:id` | Cập nhật giày | ShoesRequest | ShoesResponse |
| DELETE | `/api/shoes/:id` | Xóa giày | - | - |
| GET | `/api/categories` | Danh sách danh mục | - | ShoesCategoryResponse[] |

---

## 5. Kỹ thuật chính áp dụng

### 5.1. Axios Instance (Singleton Pattern)
Tạo một instance Axios dùng chung với `baseURL`, `headers`, `timeout` mặc định. Tất cả API call đều dùng instance này → dễ bảo trì, dễ thêm interceptor (ví dụ: đính kèm token).

### 5.2. Separation of Concerns (Tách biệt trách nhiệm)
- **API Layer** (`api/`): Chỉ chứa logic HTTP
- **Components** (`components/`): Chỉ chứa logic hiển thị (Presentational)
- **Pages** (`pages/`): Chứa logic nghiệp vụ, quản lý state, kết nối API với components

### 5.3. Reusable Form Component
`ShoesForm` dùng chung cho cả Create và Edit:
- Nhận `initialData` (rỗng khi tạo mới, có dữ liệu khi sửa)
- Nhận `isEdit` flag để thay đổi text nút submit
- Nhận `onSubmit` callback → component cha quyết định gọi API nào

### 5.4. Controlled Components
Mỗi input được quản lý bằng state React (`value` + `onChange`). Đảm bảo dữ liệu luôn đồng bộ giữa UI và state.

### 5.5. Pagination (Phân trang)
- API trả về `PageResponse` với metadata phân trang
- Client gửi `page`, `size`, `sortBy`, `sortDir` qua query parameters
- `useEffect` watch các tham số phân trang → tự động gọi API khi thay đổi

### 5.6. React Router DOM
- `BrowserRouter`: Bật chế độ routing dạng URL path
- `Routes` + `Route`: Khai báo ánh xạ URL → Component
- `useNavigate()`: Chuyển trang bằng code
- `useParams()`: Lấy tham số từ URL (ví dụ: `:id`)
- `useLocation()`: Lấy thông tin URL hiện tại

---

## 6. Cách tự tái tạo dự án từ đầu

### Bước 1: Tạo project
```bash
npm create vite@latest shoes-management -- --template react
cd shoes-management
```

### Bước 2: Cài đặt dependencies
```bash
npm install react-bootstrap bootstrap axios react-router-dom
```

### Bước 3: Cấu trúc thư mục
Tạo các thư mục: `src/api/`, `src/components/layout/`, `src/components/shoes/`, `src/pages/`

### Bước 4: Tạo file theo thứ tự
1. `src/api/axiosClient.js` - Cấu hình Axios
2. `src/api/shoesApi.js` - API cho Shoes
3. `src/api/categoryApi.js` - API cho Category
4. `src/components/layout/NavigationBar.jsx` - Thanh menu
5. `src/components/shoes/ShoesTable.jsx` - Bảng danh sách
6. `src/components/shoes/ShoesForm.jsx` - Form nhập liệu
7. `src/components/shoes/PaginationBar.jsx` - Phân trang
8. `src/components/shoes/DeleteConfirmModal.jsx` - Modal xóa
9. `src/pages/ShoesList.jsx` - Trang danh sách
10. `src/pages/ShoesCreate.jsx` - Trang tạo mới
11. `src/pages/ShoesEdit.jsx` - Trang chỉnh sửa
12. `src/pages/ShoesDetail.jsx` - Trang chi tiết
13. `src/App.jsx` - Cấu hình routing
14. `src/main.jsx` - Entry point

### Bước 5: Import Bootstrap CSS
Trong `main.jsx`, thêm: `import "bootstrap/dist/css/bootstrap.min.css";`

### Bước 6: Chạy ứng dụng
```bash
npm run dev
# Mở http://localhost:5173
# Đảm bảo API Spring Boot đang chạy trên http://localhost:8080
```

---

## 7. Ghi chú quan trọng

### Về CORS
API Spring Boot cần cấu hình **CORS** cho phép React app (port 5173) gọi API:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Về format ngày tháng
- Input `type="date"` yêu cầu format `yyyy-MM-dd`
- API có thể trả về ISO string hoặc timestamp
- Cần hàm chuyển đổi giữa 2 format

### Về phân trang
- API dùng page index bắt đầu từ **0** (Spring Data convention)
- UI hiển thị số trang bắt đầu từ **1** (user-friendly)
- Cần +1/-1 khi chuyển đổi giữa API và UI

### Về error handling
- Mọi API call đều bọc trong try/catch
- Hiển thị thông báo lỗi thân thiện cho người dùng
- Log chi tiết lỗi ra console để debug
