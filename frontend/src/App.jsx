import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import CategoryProducts from "./pages/category-products/CategoryProducts";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import MomoReturn from "./pages/momo-return/MomoReturn";
import OrderTracking from "./pages/order-tracking/OrderTracking";
import ProductDetail from "./pages/product-detail/ProductDetail";
import Products from "./pages/products/Products";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/gio-hang" element={<Navigate to="/theo-doi-don" replace />} />
        <Route path="/lich-su-don" element={<Navigate to="/theo-doi-don" replace />} />
        <Route path="/theo-doi-don" element={<OrderTracking />} />
        <Route path="/thanh-toan/momo" element={<MomoReturn />} />
        <Route path="/san-pham" element={<Products />} />
        <Route path="/san-pham/:slug" element={<ProductDetail />} />
        <Route path="/danh-muc/:slug" element={<CategoryProducts />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

