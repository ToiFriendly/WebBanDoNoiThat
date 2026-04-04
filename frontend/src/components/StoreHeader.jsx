import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getStoredSessionUser } from "../utils/storefront";

function StoreHeader() {
  const location = useLocation();
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());

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
          <Link className={getNavClass("/theo-doi-don")} to="/theo-doi-don">
            Theo dõi đơn
          </Link>
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
