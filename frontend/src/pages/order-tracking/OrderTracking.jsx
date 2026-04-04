import "./OrderTracking.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
  bank_transfer: "Chuyển khoản",
  vnpay: "VNPay",
};

const TRACKING_STEPS = [
  {
    key: "placed",
    title: "Đặt hàng",
    description: "Hệ thống đã ghi nhận đơn hàng của bạn.",
  },
  {
    key: "confirmed",
    title: "Xác nhận",
    description: "Đơn hàng đang được cửa hàng xác nhận.",
  },
  {
    key: "shipping",
    title: "Vận chuyển",
    description: "Đơn hàng đang trên đường giao tới bạn.",
  },
  {
    key: "completed",
    title: "Hoàn thành",
    description: "Đơn hàng đã giao thành công.",
  },
];

function formatTrackingDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getTotalQuantity(items = []) {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function buildAddressText(address) {
  if (!address) {
    return "Chưa có địa chỉ giao hàng.";
  }

  return [address.street, address.ward, address.district, address.city, address.country]
    .filter(Boolean)
    .join(", ");
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

function getTimelineState(orderStatus, stepKey) {
  if (orderStatus === "cancelled") {
    if (stepKey === "placed") {
      return "done";
    }

    if (stepKey === "confirmed") {
      return "active";
    }

    return "upcoming";
  }

  if (stepKey === "placed") {
    return "done";
  }

  if (orderStatus === "pending") {
    return stepKey === "confirmed" ? "active" : "upcoming";
  }

  if (orderStatus === "confirmed") {
    if (stepKey === "confirmed") {
      return "done";
    }

    return stepKey === "shipping" ? "active" : "upcoming";
  }

  if (orderStatus === "shipping") {
    if (stepKey === "confirmed") {
      return "done";
    }

    return stepKey === "shipping" ? "active" : "upcoming";
  }

  if (orderStatus === "completed") {
    return "done";
  }

  return "upcoming";
}

function getTimelineStateLabel(state) {
  if (state === "done") {
    return "Đã xong";
  }

  if (state === "active") {
    return "Đang xử lý";
  }

  return "Chờ tiếp theo";
}

function OrderTracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryOrderCode = searchParams.get("orderCode")?.trim() || "";

  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("processing");
  const [selectedOrderCode, setSelectedOrderCode] = useState(queryOrderCode);

  useEffect(() => {
    if (!queryOrderCode) {
      return;
    }

    setSelectedFilter("all");
    setSelectedOrderCode(queryOrderCode);
  }, [queryOrderCode]);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      const nextSessionUser = getStoredSessionUser();

      if (!isMounted) {
        return;
      }

      setSessionUser(nextSessionUser);

      if (!nextSessionUser || nextSessionUser.role !== "customer") {
        setOrders([]);
        setFeedback("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFeedback("");

        const result = await requestAuthJson(`${API_BASE_URL}/api/shop/orders`);

        if (!isMounted) {
          return;
        }

        setOrders(Array.isArray(result?.orders) ? result.orders : []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setOrders([]);
        setFeedback(error.message || "Không thể tải dữ liệu đơn hàng.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    window.addEventListener("storage", loadOrders);
    window.addEventListener("auth-session-changed", loadOrders);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadOrders);
      window.removeEventListener("auth-session-changed", loadOrders);
    };
  }, []);

  const visibleOrders = useMemo(
    () => orders.filter((order) => matchesFilter(order, selectedFilter)),
    [orders, selectedFilter],
  );

  useEffect(() => {
    if (!visibleOrders.length) {
      if (selectedOrderCode) {
        setSelectedOrderCode("");
      }

      return;
    }

    const hasSelected = visibleOrders.some(
      (order) => order.orderCode === selectedOrderCode,
    );

    if (hasSelected) {
      return;
    }

    const fallbackOrderCode = visibleOrders[0].orderCode;
    setSelectedOrderCode(fallbackOrderCode);
    setSearchParams({ orderCode: fallbackOrderCode }, { replace: true });
  }, [selectedOrderCode, setSearchParams, visibleOrders]);

  const selectedOrder =
    visibleOrders.find((order) => order.orderCode === selectedOrderCode) ||
    visibleOrders[0] ||
    null;

  function handleSelectOrder(orderCode) {
    setSelectedOrderCode(orderCode);
    setSearchParams({ orderCode }, { replace: true });
  }

  return (
    <main className="tracking-page">
      <section className="tracking-shell">
        <header className="tracking-topbar">
          <Link className="tracking-brand" to="/">
            TIEM DO TRANG TRI NOI THAT
          </Link>

          <nav className="tracking-nav">
            <Link className="tracking-nav__item" to="/">
              Trang chủ
            </Link>
            <Link className="tracking-nav__item" to="/theo-doi-don">
              Giỏ hàng ({selectedOrder ? getTotalQuantity(selectedOrder.items) : 0})
            </Link>
            <Link className="tracking-nav__item tracking-nav__item--active" to="/theo-doi-don">
              Theo dõi đơn
            </Link>
            <Link className="tracking-nav__item" to="/theo-doi-don">
              Lịch sử đơn
            </Link>
            {sessionUser ? (
              <span className="tracking-user">
                {sessionUser.fullName || sessionUser.username}
              </span>
            ) : (
              <Link className="tracking-user" to="/login">
                Đăng nhập
              </Link>
            )}
          </nav>
        </header>

        {!sessionUser ? (
          <section className="tracking-empty-panel">
            <h1 className="tracking-title">Theo dõi đơn hàng</h1>
            <p className="tracking-copy">
              Đăng nhập để xem đơn hàng, trạng thái xử lý và thông tin giao hàng
              ngay trên cùng một màn hình.
            </p>
            <Link className="tracking-login" to="/login">
              Đăng nhập để theo dõi đơn
            </Link>
          </section>
        ) : (
          <>
            <section className="tracking-hero">
              <h1 className="tracking-title">Theo dõi đơn hàng</h1>
              <p className="tracking-copy">
                Xem nhanh các đơn của bạn, lọc theo trạng thái và mở chi tiết ngay
                trên cùng một màn hình.
              </p>

              <div className="tracking-filters">
                {FILTER_OPTIONS.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    className={`tracking-filter ${
                      selectedFilter === filter.key ? "tracking-filter--active" : ""
                    }`}
                    onClick={() => setSelectedFilter(filter.key)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </section>

            {feedback ? <div className="tracking-feedback">{feedback}</div> : null}

            {loading ? (
              <section className="tracking-loading-panel">
                <div className="tracking-spinner" />
                <p>Đang tải dữ liệu đơn hàng...</p>
              </section>
            ) : visibleOrders.length && selectedOrder ? (
              <section className="tracking-layout">
                <aside className="tracking-orders" id="tracking-order-list">
                  <div className="tracking-orders__header">
                    <div>
                      <h2>Đơn của bạn</h2>
                      <p>{visibleOrders.length} đơn đang hiển thị</p>
                    </div>
                  </div>

                  <div className="tracking-orders__list">
                    {visibleOrders.map((order) => {
                      const isActive = selectedOrder.orderCode === order.orderCode;
                      const itemCount = getTotalQuantity(order.items);

                      return (
                        <button
                          key={order._id}
                          type="button"
                          className={`tracking-order-card ${
                            isActive ? "tracking-order-card--active" : ""
                          }`}
                          onClick={() => handleSelectOrder(order.orderCode)}
                        >
                          <div className="tracking-order-card__head">
                            <span className="tracking-order-card__code">
                              {order.orderCode}
                            </span>
                            <span className="tracking-order-card__status">
                              {ORDER_STATUS_LABELS[order.orderStatus] || "Đang xử lý"}
                            </span>
                          </div>

                          <div className="tracking-order-card__time">
                            {formatTrackingDate(order.placedAt)}
                          </div>

                          <div className="tracking-order-card__items">
                            {order.items.slice(0, 4).map((item) => {
                              const image =
                                getDisplayImage(item.product?.images) || item.productImage || "";

                              return (
                                <div key={item._id} className="tracking-order-item">
                                  <div className="tracking-order-item__thumb">
                                    {image ? (
                                      <img
                                        src={image}
                                        alt={item.productName}
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="tracking-order-item__placeholder" />
                                    )}
                                  </div>
                                  <div className="tracking-order-item__meta">
                                    <div className="tracking-order-item__name">
                                      {item.productName}
                                    </div>
                                    <div className="tracking-order-item__price">
                                      {formatCurrency(item.unitPrice)}
                                    </div>
                                  </div>
                                  <div className="tracking-order-item__qty">
                                    x{item.quantity}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="tracking-order-card__footer">
                            <span>{itemCount} sản phẩm</span>
                            <strong>{formatCurrency(order.totalAmount)}</strong>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </aside>

                <div className="tracking-detail-stack">
                  <article className="tracking-detail-panel">
                    <div className="tracking-detail__top">
                      <div>
                        <p className="tracking-detail__label">Mã đơn hàng</p>
                        <h2 className="tracking-detail__code">{selectedOrder.orderCode}</h2>
                        <p className="tracking-detail__time">
                          Đặt lúc {formatTrackingDate(selectedOrder.placedAt)}
                        </p>
                      </div>

                      <div className="tracking-detail__badges">
                        <span className="tracking-detail__badge">
                          {ORDER_STATUS_LABELS[selectedOrder.orderStatus] || "Đang xử lý"}
                        </span>
                        <span className="tracking-detail__badge">
                          {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus] ||
                            "Đang cập nhật"}
                        </span>
                      </div>
                    </div>

                    <div className="tracking-summary-grid">
                      <div className="tracking-summary-card">
                        <div className="tracking-summary-card__label">Tổng tiền</div>
                        <div className="tracking-summary-card__value">
                          {formatCurrency(selectedOrder.totalAmount)}
                        </div>
                      </div>
                      <div className="tracking-summary-card">
                        <div className="tracking-summary-card__label">Thanh toán</div>
                        <div className="tracking-summary-card__value">
                          {PAYMENT_METHOD_LABELS[selectedOrder.paymentMethod] || "Khác"}
                        </div>
                      </div>
                      <div className="tracking-summary-card">
                        <div className="tracking-summary-card__label">Số lượng</div>
                        <div className="tracking-summary-card__value">
                          {getTotalQuantity(selectedOrder.items)} sản phẩm
                        </div>
                      </div>
                    </div>

                    <div className="tracking-timeline">
                      <h3>Tiến trình đơn hàng</h3>

                      <div className="tracking-timeline__list">
                        {TRACKING_STEPS.map((step) => {
                          const state = getTimelineState(selectedOrder.orderStatus, step.key);

                          return (
                            <div
                              key={step.key}
                              className={`tracking-step tracking-step--${state}`}
                            >
                              <div className="tracking-step__dot" />
                              <div className="tracking-step__content">
                                <div className="tracking-step__head">
                                  <strong>{step.title}</strong>
                                  <span>{getTimelineStateLabel(state)}</span>
                                </div>
                                <p>{step.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </article>

                  <article className="tracking-shipping-panel">
                    <div className="tracking-shipping__header">
                      <h3>Thông tin giao hàng</h3>
                      <a className="tracking-shipping__link" href="#tracking-order-list">
                        Lịch sử đơn hàng
                      </a>
                    </div>

                    <div className="tracking-shipping__body">
                      <div className="tracking-shipping__name">
                        {selectedOrder.shippingAddress?.fullName || "Khách hàng"}
                      </div>
                      <div className="tracking-shipping__phone">
                        {selectedOrder.shippingAddress?.phone || "Chưa có số điện thoại"}
                      </div>
                      <div className="tracking-shipping__address">
                        {buildAddressText(selectedOrder.shippingAddress)}
                      </div>
                    </div>

                    <div className="tracking-shipping__meta">
                      <div>
                        <span>Trạng thái</span>
                        <strong>
                          {ORDER_STATUS_LABELS[selectedOrder.orderStatus] || "Đang xử lý"}
                        </strong>
                      </div>
                      <div>
                        <span>Thanh toán</span>
                        <strong>
                          {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus] ||
                            "Đang cập nhật"}
                        </strong>
                      </div>
                      <div>
                        <span>Ghi chú</span>
                        <strong>{selectedOrder.note || "Không có"}</strong>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            ) : (
              <section className="tracking-empty-panel">
                <h2>Tài khoản này chưa có đơn hàng</h2>
                <p>
                  {sessionUser.username || "Tài khoản hiện tại"} chưa có đơn nào trong
                  cơ sở dữ liệu, nên trang theo dõi chưa có chi tiết để hiển thị.
                </p>
                <Link className="tracking-login" to="/san-pham">
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

export default OrderTracking;
