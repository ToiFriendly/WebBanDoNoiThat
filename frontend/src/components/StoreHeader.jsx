import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL, getStoredSessionUser, requestAuthJson } from "../utils/storefront";

const navigationItems = [
  {
    label: "Trang chủ",
    to: "/",
    isActive: (location) => location.pathname === "/" && !location.hash,
  },
  {
    label: "Sản phẩm",
    to: "/#noi-bat",
    isActive: (location) => location.pathname === "/" && location.hash === "#noi-bat",
  },
  {
    label: "Bộ sưu tập",
    to: "/#moi-nhat",
    isActive: (location) => location.pathname === "/" && location.hash === "#moi-nhat",
  },
  {
    label: "Liên hệ",
    to: "/lien-he",
    isActive: (location) =>
      location.pathname === "/lien-he" || location.pathname === "/ho-tro",
  },
];

function HomeBadgeIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4.5 10.5 12 4l7.5 6.5v8a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1v-8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
      <path
        d="M9.5 19.5v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m16 16 3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CartIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M3.5 5h2.2l1.6 8.2a1.5 1.5 0 0 0 1.5 1.2h7.4a1.5 1.5 0 0 0 1.5-1.2l1.1-5.7H7.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="10" cy="18.4" r="1.1" fill="currentColor" />
      <circle cx="17" cy="18.4" r="1.1" fill="currentColor" />
    </svg>
  );
}

function UserIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getAccountLabel(sessionUser) {
  if (!sessionUser) {
    return "Đăng nhập";
  }

  const displayName = sessionUser.fullName || sessionUser.username || "Tài khoản";
  return displayName.split(" ").filter(Boolean).slice(-1)[0] || "Tài khoản";
}

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
    <header className="mb-6 rounded-[28px] border border-[rgba(95,63,42,0.08)] bg-[linear-gradient(180deg,rgba(254,247,238,0.92),rgba(255,252,246,0.86))] p-4 shadow-[0_18px_45px_rgba(88,60,38,0.08)] md:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3 no-underline" to="/">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f241f] text-[#fff6ea] shadow-[0_12px_28px_rgba(66,44,31,0.24)]">
              <HomeBadgeIcon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[0.7rem] font-bold tracking-[0.26em] text-[#b5782c] uppercase">
                COZY CORNER
              </div>
              <div className="text-sm font-semibold text-[#3c2a1f]">
                Nội thất & decor
              </div>
            </div>
          </Link>

          {sessionUser?.role === "admin" ? (
            <Link
              to="/admin"
              className="inline-flex rounded-full border border-[rgba(95,63,42,0.12)] bg-[#f3e5d7] px-4 py-2 text-sm font-semibold no-underline xl:hidden"
            >
              Quản trị
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-end xl:gap-5">
          <nav className="flex flex-wrap items-center gap-2">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                className={`rounded-full px-4 py-2.5 text-sm font-medium no-underline transition ${
                  item.isActive(location)
                    ? "bg-[#2f241f] text-[#fff8f0] shadow-[0_12px_24px_rgba(66,44,31,0.16)]"
                    : "border border-[rgba(95,63,42,0.08)] bg-white/78 text-[#5f4738] hover:border-[rgba(181,120,44,0.2)] hover:text-[#2f241f]"
                }`}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex min-w-[220px] items-center gap-2 rounded-full border border-[rgba(95,63,42,0.08)] bg-[#f4dec2] px-4 py-2.5 text-[#8f643d] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              <SearchIcon className="h-4 w-4" />
              <input
                aria-label="Tìm kiếm sản phẩm"
                className="w-full border-none bg-transparent text-sm outline-none placeholder:text-[#aa7c53]"
                placeholder="Tìm kiếm sản phẩm"
                type="search"
              />
            </label>

            <div className="flex items-center gap-2">
              <Link
                aria-label="Giỏ hàng"
                className="relative inline-flex h-11 min-w-11 items-center justify-center rounded-2xl border border-[rgba(95,63,42,0.08)] bg-[#efac34] px-3 text-[#2f241f] no-underline shadow-[0_12px_24px_rgba(239,172,52,0.24)] transition hover:-translate-y-0.5"
                to={sessionUser?.role === "customer" ? "/gio-hang" : "/login"}
              >
                <CartIcon className="h-5 w-5" />
                {sessionUser?.role === "customer" && cartCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2f241f] px-1 text-[0.65rem] font-bold text-[#fff8f0]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              {sessionUser?.role === "admin" ? (
                <Link
                  to="/admin"
                  className="hidden rounded-full border border-[rgba(95,63,42,0.08)] bg-[#f3e5d7] px-4 py-2.5 text-sm font-semibold no-underline xl:inline-flex"
                >
                  Quản trị
                </Link>
              ) : null}

              <Link
                to="/login"
                className={`inline-flex min-h-11 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold no-underline transition ${
                  sessionUser
                    ? "bg-[#2f241f] text-[#fff8f0] shadow-[0_12px_24px_rgba(66,44,31,0.16)]"
                    : "border border-[rgba(95,63,42,0.08)] bg-white/80 text-[#5b4334]"
                }`}
              >
                <UserIcon className="h-5 w-5" />
                <span className="hidden sm:inline">{getAccountLabel(sessionUser)}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StoreHeader;
