import "./OrderHistory.css";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  API_BASE_URL,
  formatCurrency,
  getDisplayImage,
  getStoredSessionUser,
  requestAuthJson,
} from "../../utils/storefront";

const FILTER_OPTIONS = [
  { key: "all", label: "Tất cả" },
  { key: "processing", label: "Đang xử lý" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

const ORDER_STATUS_LABELS = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const PAYMENT_STATUS_LABELS = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán lỗi",
  refunded: "Đã hoàn tiền",
};

const PAYMENT_METHOD_LABELS = {
  cod: "COD",
  momo: "MoMo",
};

function formatOrderDateTime(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getTotalItemCount(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function matchesFilter(order, filterKey) {
  if (filterKey === "all") {
    return true;
  }

  if (filterKey === "processing") {
    return ["pending", "confirmed", "shipping"].includes(order.orderStatus);
  }

  return order.orderStatus === filterKey;
}

function getPreviewImage(order) {
  const firstItem = order.items?.[0];

  if (!firstItem) {
    return "";
  }

  return (
    getDisplayImage(firstItem.product?.images) ||
    firstItem.productImage ||
    ""
  );
}

function getPageCopy(isTrackingView, trackedOrderCode) {
  if (isTrackingView && trackedOrderCode) {
    return {
      title: `Theo dõi đơn ${trackedOrderCode}`,
      description:
        "Xem nhanh trạng thái hiện tại, tổng tiền và các sản phẩm trong đơn đã chọn.",
    };
  }

  if (isTrackingView) {
    return {
      title: "Theo dõi đơn hàng",
      description:
        "Theo dõi tiến trình xử lý, giao hàng và thanh toán của các đơn đang hoạt động.",
    };
  }

  return {
    title: "Lịch sử đơn hàng",
    description:
      "Giao diện gọn gọn hơn, xem nhanh đơn đã mua và mở chi tiết khi cần.",
  };
}

function OrderHistory() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isTrackingView = location.pathname === "/theo-doi-don";
  const trackedOrderCode = searchParams.get("orderCode")?.trim() || "";
  const pageCopy = getPageCopy(isTrackingView, trackedOrderCode);

  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(() =>
    isTrackingView ? "processing" : "all",
  );

  useEffect(() => {
    if (trackedOrderCode) {
      setSelectedFilter("all");
      return;
    }

    setSelectedFilter(isTrackingView ? "processing" : "all");
  }, [isTrackingView, trackedOrderCode]);

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      const nextSessionUser = getStoredSessionUser();

      if (!isMounted) {
        return;
      }

      setSessionUser(nextSessionUser);

      if (!nextSessionUser || nextSessionUser.role !== "customer") {
        setOrders([]);
        setCartCount(0);
        setFeedback("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFeedback("");

        const [ordersResult, cartResult] = await Promise.all([
          requestAuthJson(`${API_BASE_URL}/api/shop/orders`),
          requestAuthJson(`${API_BASE_URL}/api/shop/cart`),
        ]);

        if (!isMounted) {
          return;
        }

        setOrders(Array.isArray(ordersResult?.orders) ? ordersResult.orders : []);
        setCartCount(cartResult?.cart?.totalQuantity || 0);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setOrders([]);
        setCartCount(0);
        setFeedback(error.message || "Không thể tải dữ liệu đơn hàng.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    window.addEventListener("storage", loadPageData);
    window.addEventListener("auth-session-changed", loadPageData);
    window.addEventListener("cart-changed", loadPageData);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadPageData);
      window.removeEventListener("auth-session-changed", loadPageData);
      window.removeEventListener("cart-changed", loadPageData);
    };
  }, []);

  let visibleOrders = orders.filter((order) => matchesFilter(order, selectedFilter));

  if (trackedOrderCode) {
    const normalizedOrderCode = trackedOrderCode.toLowerCase();
    visibleOrders = visibleOrders.filter((order) =>
      String(order.orderCode || "").toLowerCase().includes(normalizedOrderCode),
    );
  }

  return (
    <main className="order-history-page">
      <section className="order-history-shell">
        <header className="order-history-topbar">
          <Link className="order-history-brand" to="/">
            TIEM DO TRANG TRI NOI THAT
          </Link>

          <nav className="order-history-nav">
            <Link
              className={`order-history-nav__item ${
                location.pathname === "/" ? "order-history-nav__item--active" : ""
              }`}
              to="/"
            >
              Trang chủ
            </Link>
            <Link className="order-history-nav__item" to="/gio-hang">
              Giỏ hàng ({cartCount})
            </Link>
            <Link
              className={`order-history-nav__item ${
                isTrackingView ? "order-history-nav__item--active" : ""
              }`}
              to="/theo-doi-don"
            >
              Theo dõi đơn
            </Link>
            <Link
              className={`order-history-nav__item ${
                !isTrackingView ? "order-history-nav__item--active" : ""
              }`}
              to="/lich-su-don"
            >
              Lịch sử đơn
            </Link>
            {sessionUser ? (
              <span className="order-history-user">
                {sessionUser.fullName || sessionUser.username}
              </span>
            ) : (
              <Link className="order-history-user" to="/login">
                Đăng nhập
              </Link>
            )}
          </nav>
        </header>

        {!sessionUser ? (
          <section className="order-history-panel order-history-panel--empty">
            <h1 className="order-history-title">{pageCopy.title}</h1>
            <p className="order-history-copy">
              Bạn cần đăng nhập để xem lịch sử đơn hàng và trạng thái xử lý mới nhất.
            </p>
            <Link className="order-history-login" to="/login">
              Đăng nhập để xem đơn hàng
            </Link>
          </section>
        ) : (
          <>
            <section className="order-history-hero">
              <h1 className="order-history-title">{pageCopy.title}</h1>
              <p className="order-history-copy">{pageCopy.description}</p>

              <div className="order-history-filters">
                {FILTER_OPTIONS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`order-history-filter ${
                      selectedFilter === filter.key
                        ? "order-history-filter--active"
                        : ""
                    }`}
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="order-history-count">
                {visibleOrders.length} đơn đang hiển thị
              </div>
            </section>

            {feedback ? <div className="order-history-feedback">{feedback}</div> : null}

            {loading ? (
              <section className="order-history-panel order-history-panel--loading">
                <div className="order-history-spinner" />
                <p>Đang tải danh sách đơn hàng...</p>
              </section>
            ) : visibleOrders.length ? (
              <section className="order-history-list">
                {visibleOrders.map((order) => {
                  const firstItem = order.items?.[0];
                  const previewImage = getPreviewImage(order);
                  const extraItemCount = Math.max(0, (order.items?.length || 0) - 1);
                  const itemCount = getTotalItemCount(order.items);
                  const paymentStatusLabel =
                    PAYMENT_STATUS_LABELS[order.paymentStatus] || "Đang cập nhật";
                  const paymentMethodLabel =
                    PAYMENT_METHOD_LABELS[order.paymentMethod] || "Khác";
                  const orderStatusLabel =
                    ORDER_STATUS_LABELS[order.orderStatus] || "Đang xử lý";

                  return (
                    <article
                      key={order._id}
                      className={`order-card ${
                        trackedOrderCode === order.orderCode ? "order-card--focus" : ""
                      }`}
                    >
                      <div className="order-card__left">
                        <div className="order-card__thumb">
                          {previewImage ? (
                            <img
                              className="order-card__thumb-image"
                              src={previewImage}
                              alt={firstItem?.productName || "San pham"}
                              loading="lazy"
                            />
                          ) : (
                            <div className="order-card__thumb-placeholder" />
                          )}
                        </div>

                        <div className="order-card__body">
                          <div className="order-card__head">
                            <div className="order-card__code">{order.orderCode}</div>
                            <span className="order-card__badge">{orderStatusLabel}</span>
                          </div>

                          <div className="order-card__time">
                            {formatOrderDateTime(order.placedAt)}
                          </div>

                          <div className="order-card__product">
                            {firstItem?.productName || "Đơn hàng nội thất"}
                          </div>

                          <div className="order-card__summary">
                            {firstItem
                              ? `${firstItem.quantity} x ${formatCurrency(firstItem.unitPrice)}`
                              : "Chưa có sản phẩm"}
                            {extraItemCount > 0 ? ` • +${extraItemCount} sản phẩm khác` : ""}
                          </div>

                          <div className="order-card__meta">
                            <span className="order-card__chip">{paymentStatusLabel}</span>
                            <span className="order-card__chip">{paymentMethodLabel}</span>
                          </div>
                        </div>
                      </div>

                      <div className="order-card__right">
                        <div className="order-card__label">Tổng thanh toán</div>
                        <div className="order-card__total">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="order-card__count">{itemCount} sản phẩm</div>
                        <Link
                          className="order-card__action"
                          to={`/theo-doi-don?orderCode=${encodeURIComponent(order.orderCode)}`}
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <section className="order-history-panel order-history-panel--empty">
                <h2>Chưa có đơn phù hợp</h2>
                <p>
                  Hãy thử đổi bộ lọc hoặc đặt một đơn mới để lịch sử mua hàng hiện ra ở
                  đây.
                </p>
                <Link className="order-history-login" to="/san-pham">
                  Xem sản phẩm
                </Link>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default OrderHistory;
