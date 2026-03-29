# TiemDoTrangTriNoiThat

Đồ án cuối kỳ môn học: Ngôn ngữ phát triển ứng dụng mới.
Website tiệm đồ trang trí nội thất.
========================================================================================
Công nghệ sử dụng.
FE: ReactVite.
BE: Node.js.
DB: MongoDB.
========================================================================================
Cấu trúc dự án

BACKEND:
controllers/: Chứa logic xử lý nghiệp vụ.
routes/: Định nghĩa các API Endpoints (/api/products, /api/users, ...).
schemas/: Định nghĩa Mongoose Models.
uploads/: Thư mục lưu trữ hình ảnh sản phẩm được tải lên từ phía Client.
utils/: Chứa các hàm tiện ích và Middleware (Xác thực JWT, kiểm tra quyền Admin).
app.js: File cấu hình khởi tạo Server Express.
.env: Lưu trữ biến môi trường bảo mật (MongoDB URI, JWT Secret).

FRONTEND:
Được khởi tạo bằng Vite, tổ chức theo hướng Module hóa dễ quản lý.
src/api/: Quản lý các file gọi API (Axios instance, các hàm call API).
src/components/: Các thành phần UI dùng chung (Navbar, Footer, Button, Card).
src/contexts/: Quản lý trạng thái toàn cục (Auth Context, Cart Context).
src/hooks/: Các Custom Hooks (ví dụ: useAuth, useSocket).
src/layouts/: Định nghĩa khung giao diện cho Admin và Client.
src/pages/: Chứa các trang chính của ứng dụng (Home, Login, Admin Dashboard).
src/routes/: Cấu hình các đường dẫn URL phía Client.
src/utils/: Các hàm bổ trợ phía Frontend (Format tiền tệ, Format ngày tháng).
App.jsx: Component gốc kết nối Routes và Providers.
