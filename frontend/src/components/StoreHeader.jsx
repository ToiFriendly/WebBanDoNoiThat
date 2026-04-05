import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, getStoredSessionUser, requestAuthJson } from "../utils/storefront";

function navLinkClassName(isActive) {
  return `inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-medium no-underline transition ${
    isActive
      ? "border-[#2f241f] bg-[#2f241f] text-[#fff8f0] shadow-[0_10px_22px_rgba(47,36,31,0.12)]"
      : "border-[rgba(95,63,42,0.1)] bg-white/92 text-[#6a564b] hover:border-[rgba(95,63,42,0.18)]"
  }`;
}

function StoreHeader() {
  const location = useLocation();
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function syncHeaderState() {
      const nextUser = getStoredSessionUser();
      setSessionUser(nextUser);

      if (!nextUser || nextUser.role !== "customer") {
        setCartCount(0);
        return;
      }

      try {
        const data = await requestAuthJson(`${API_BASE_URL}/api/shop/cart`);
        setCartCount(data?.cart?.totalQuantity || 0);
      } catch {
        setCartCount(0);
      }
    }

    syncHeaderState();

    window.addEventListener("storage", syncHeaderState);
    window.addEventListener("auth-session-changed", syncHeaderState);
    window.addEventListener("cart-changed", syncHeaderState);

    return () => {
      window.removeEventListener("storage", syncHeaderState);
      window.removeEventListener("auth-session-changed", syncHeaderState);
      window.removeEventListener("cart-changed", syncHeaderState);
    };
  }, []);

  const isHomeActive = location.pathname === "/";
  const isCartActive = location.pathname.startsWith("/gio-hang");
  const isTrackingActive = location.pathname.startsWith("/theo-doi-don-hang");
  const isHistoryActive = location.pathname.startsWith("/lich-su-don-hang");
  const isAdminActive = location.pathname.startsWith("/admin");

  return (
    <header className="mb-6 flex items-center justify-between gap-4 max-md:flex-col max-md:items-start">
      <Link
        className="text-sm font-extrabold tracking-[0.08em] uppercase no-underline md:text-[15px]"
        to="/"
      >
        Tiem Do Trang Tri Noi That
      </Link>

      <nav className="flex flex-wrap gap-2.5 max-md:w-full">
        <Link className={navLinkClassName(isHomeActive)} to="/">
          Trang chu
        </Link>
        {sessionUser?.role === "customer" ? (
          <Link className={navLinkClassName(isCartActive)} to="/gio-hang">
            Gio hang ({cartCount})
          </Link>
        ) : null}
        {sessionUser?.role === "customer" ? (
          <Link
            className={navLinkClassName(isTrackingActive)}
            to="/theo-doi-don-hang"
          >
            Theo doi don
          </Link>
        ) : null}
        {sessionUser?.role === "customer" ? (
          <Link className={navLinkClassName(isHistoryActive)} to="/lich-su-don-hang">
            Lich su don
          </Link>
        ) : null}
        {sessionUser?.role === "admin" ? (
          <Link
            to="/admin"
            className={navLinkClassName(isAdminActive)}
          >
            Quan tri
          </Link>
        ) : null}
        <Link
          to="/login"
          className={`inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold no-underline transition ${
            sessionUser
              ? "bg-[#2f241f] text-[#fff8f0] shadow-[0_10px_22px_rgba(47,36,31,0.12)]"
              : "border border-[rgba(95,63,42,0.1)] bg-white/92 text-[#6a564b]"
          }`}
        >
          {sessionUser ? sessionUser.fullName || sessionUser.username : "Dang nhap"}
        </Link>
      </nav>
    </header>
  );
}

export default StoreHeader;
