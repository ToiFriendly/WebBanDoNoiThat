import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  API_BASE_URL,
  getStoredSessionUser,
  getStoredToken,
} from "../utils/storefront";

function StoreHeader() {
  const location = useLocation();
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [cartCount, setCartCount] = useState(0);

  function getNavClass(pathname) {
    const isActive = location.pathname === pathname;

    return `rounded-full border px-4 py-2.5 no-underline transition ${
      isActive
        ? "border-[rgba(191,117,60,0.18)] bg-[#f6e7d8] font-semibold text-[#2f241f]"
        : "border-[rgba(95,63,42,0.1)] bg-white/75 text-[#5f4a3d]"
    } max-md:w-full`;
  }

  useEffect(() => {
    function syncHeaderState() {
      const nextUser = getStoredSessionUser();
      setSessionUser(nextUser);
    }

    syncHeaderState();

    window.addEventListener("storage", syncHeaderState);
    window.addEventListener("auth-session-changed", syncHeaderState);

    return () => {
      window.removeEventListener("storage", syncHeaderState);
      window.removeEventListener("auth-session-changed", syncHeaderState);
    };
  }, []);

  useEffect(() => {
    async function fetchCartCount() {
      const token = getStoredToken();
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/shop/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setCartCount(data?.cart?.totalQuantity || 0);
      } catch {
        setCartCount(0);
      }
    }

    fetchCartCount();

    window.addEventListener("cart-changed", fetchCartCount);
    window.addEventListener("auth-session-changed", fetchCartCount);

    return () => {
      window.removeEventListener("cart-changed", fetchCartCount);
      window.removeEventListener("auth-session-changed", fetchCartCount);
    };
  }, []);

  return (
    <header className="mb-6 flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
      <Link
        className="text-base font-extrabold tracking-[0.06em] uppercase no-underline"
        to="/"
      >
        Tiem Do Trang Tri Noi That
      </Link>

      <nav className="flex flex-wrap gap-3 max-md:w-full">
        <Link className={getNavClass("/")} to="/">
          Trang chủ
        </Link>
        <Link className={getNavClass("/san-pham")} to="/san-pham">
          Sản phẩm
        </Link>
        {sessionUser?.role === "customer" ? (
          <>
            <Link
              className={`${getNavClass("/gio-hang")} relative`}
              to="/gio-hang"
            >
              <span className="inline-flex items-center gap-1.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Giỏ hàng
                {cartCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center"
                    style={{
                      minWidth: "20px",
                      height: "20px",
                      padding: "0 5px",
                      borderRadius: "999px",
                      background: "linear-gradient(135deg, #d38a4d, #bb6d36)",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
            </Link>
            <Link className={getNavClass("/theo-doi-don")} to="/theo-doi-don">
              Theo dõi đơn
            </Link>
          </>
        ) : null}
        {sessionUser?.role === "admin" ? (
          <Link
            to="/admin"
            className={getNavClass("/admin")}
          >
            Quản trị
          </Link>
        ) : null}
        <Link
          to="/login"
          className={`rounded-full px-4 py-2.5 no-underline max-md:w-full ${
            sessionUser
              ? "bg-[#2f241f] font-bold text-[#fff8f0]"
              : "border border-[rgba(95,63,42,0.1)] bg-white/75"
          }`}
        >
          {sessionUser ? sessionUser.fullName || sessionUser.username : "Dang nhap"}
        </Link>
      </nav>
    </header>
  );
}

export default StoreHeader;
