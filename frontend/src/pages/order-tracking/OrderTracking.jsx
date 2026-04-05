import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductThumbnail from "../../components/ProductThumbnail";
import StoreHeader from "../../components/StoreHeader";
import {
  API_BASE_URL,
  formatCurrency,
  getStoredSessionUser,
  requestAuthJson,
} from "../../utils/storefront";
import {
  ORDER_FILTER_TABS,
  buildOrderTrackingSteps,
  filterOrdersByStatus,
  getOrderItemImage,
  getOrderStatusMeta,
  getPaymentStatusMeta,
  getToneClassName,
  sortOrdersByPlacedAtDesc,
} from "../../utils/orderPresentation";

function stepCardClassName(state) {
  if (state === "completed") {
    return "border-[#ece0d4] bg-white";
  }

  if (state === "current") {
    return "border-[#e6a16d] bg-[#fff9f3] shadow-[0_8px_18px_rgba(216,123,56,0.08)]";
  }

  return "border-[#efe5dc] bg-white";
}

function stepDotClassName(state) {
  if (state === "completed") {
    return "bg-[#cf8b48]";
  }

  if (state === "current") {
    return "bg-[#d87b38]";
  }

  return "bg-[#e4d8cc]";
}

function stepLineClassName(state) {
  if (state === "completed") {
    return "bg-[#ead7c3]";
  }

  if (state === "current") {
    return "bg-[#f1dcc7]";
  }

  return "bg-[#eee4db]";
}

function getStepStateLabel(state) {
  if (state === "completed") {
    return "Đã xong";
  }

  if (state === "current") {
    return "Đang xử lý";
  }

  return "Chờ tiếp theo";
}

function formatPaymentMethod(paymentMethod) {
  if (!paymentMethod) {
    return "Chưa cập nhật";
  }

  return String(paymentMethod).toUpperCase();
}

function formatTrackingDateTime(value) {
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

function formatPlacedAtLabel(value) {
  const formattedValue = formatTrackingDateTime(value);

  return formattedValue ? `Đặt lúc ${formattedValue}` : "Đặt lúc chưa cập nhật";
}

function OrderPreviewCard({ order, isActive, onSelect }) {
  const orderStatusMeta = getOrderStatusMeta(order.orderStatus);
  const totalItems = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const orderItems = Array.isArray(order.items) ? order.items.slice(0, 4) : [];

  return (
    <button
      type="button"
      className={`rounded-[24px] border p-3.5 text-left transition ${
        isActive
          ? "border-[#efb37e] bg-[#fffaf4]"
          : "border-[rgba(95,63,42,0.1)] bg-white hover:border-[rgba(95,63,42,0.18)]"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold tracking-[-0.02em] text-[#3c3029]">
            {order.orderCode}
          </p>
          <p className="mt-2 text-[11px] font-medium text-[#8b7667]">
            {formatTrackingDateTime(order.placedAt)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${getToneClassName(orderStatusMeta.tone)}`}
        >
          {orderStatusMeta.label}
        </span>
      </div>

      <div className="mt-3.5 grid gap-2.5">
        {orderItems.length ? (
          orderItems.map((item, index) => (
            <div
              key={item._id || `${order.orderCode}-${item.productName}-${index}`}
              className="grid grid-cols-[38px_minmax(0,1fr)_auto] items-center gap-2.5"
            >
              <ProductThumbnail
                size="compact"
                src={getOrderItemImage(item)}
                alt={item.productName}
                frameClassName="h-[38px] w-[38px] rounded-[12px] p-1"
                placeholderLabel="SP"
              />

              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#4a3b31]">
                  {item.productName}
                </p>
                <p className="mt-0.5 text-[12px] text-[#8b6d59]">
                  {formatCurrency(item.unitPrice)}
                </p>
              </div>

              <span className="text-[12px] font-medium text-[#8a7466]">
                x{item.quantity}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#6c584c]">Đơn hàng chưa có sản phẩm.</p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#f0e6dd] pt-3">
        <span className="text-[13px] font-medium text-[#8b7667]">
          {totalItems} sản phẩm
        </span>
        <strong className="text-[15px] font-semibold text-[#3b2e28]">
          {formatCurrency(order.totalAmount)}
        </strong>
      </div>
    </button>
  );
}

function SummaryMetricCard({ label, value }) {
  return (
    <div className="rounded-[20px] bg-[#fbf1e5] px-4 py-3.5">
      <div className="text-[12px] font-medium text-[#b08968]">{label}</div>
      <div className="mt-1.5 text-[15px] font-semibold text-[#2f241f] md:text-[1.5rem] md:leading-none">
        {value}
      </div>
    </div>
  );
}

function OrderTracking() {
  const { orderCode: orderCodeParam = "" } = useParams();
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderCode, setSelectedOrderCode] = useState(orderCodeParam);

  useEffect(() => {
    async function loadOrders() {
      const nextSessionUser = getStoredSessionUser();
      setSessionUser(nextSessionUser);

      if (!nextSessionUser) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setFeedback("");

        const data = await requestAuthJson(`${API_BASE_URL}/api/shop/orders`);
        setOrders(
          sortOrdersByPlacedAtDesc(
            Array.isArray(data?.orders) ? data.orders : [],
          ),
        );
      } catch (error) {
        setFeedback(error.message || "Không thể tải danh sách đơn hàng.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();

    window.addEventListener("auth-session-changed", loadOrders);

    return () => {
      window.removeEventListener("auth-session-changed", loadOrders);
    };
  }, []);

  useEffect(() => {
    if (!orders.length) {
      setSelectedOrderCode("");
      return;
    }

    const nextFilteredOrders = filterOrdersByStatus(orders, statusFilter);

    if (orderCodeParam) {
      const matchedOrder = orders.find(
        (order) => order.orderCode === orderCodeParam,
      );

      if (matchedOrder) {
        setSelectedOrderCode(matchedOrder.orderCode);
        return;
      }
    }

    if (
      selectedOrderCode &&
      nextFilteredOrders.some((order) => order.orderCode === selectedOrderCode)
    ) {
      return;
    }

    setSelectedOrderCode(nextFilteredOrders[0]?.orderCode || "");
  }, [orderCodeParam, orders, selectedOrderCode, statusFilter]);

  const filteredOrders = filterOrdersByStatus(orders, statusFilter);
  const selectedOrder =
    filteredOrders.find((order) => order.orderCode === selectedOrderCode) || null;
  const orderStatusMeta = getOrderStatusMeta(selectedOrder?.orderStatus);
  const paymentStatusMeta = getPaymentStatusMeta(selectedOrder?.paymentStatus);
  const trackingSteps = buildOrderTrackingSteps(selectedOrder?.orderStatus);
  const selectedTotalItems = Array.isArray(selectedOrder?.items)
    ? selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const shippingAddress = selectedOrder?.shippingAddress || {};
  const fullAddress = [
    shippingAddress.street,
    shippingAddress.ward,
    shippingAddress.district,
    shippingAddress.city,
    shippingAddress.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,192,106,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(161,98,7,0.08),transparent_24%),linear-gradient(135deg,#f7efe4_0%,#f2e8d9_42%,#f8f3eb_100%)] px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      <section className="mx-auto w-full max-w-[1180px] rounded-[34px] border border-[rgba(95,63,42,0.12)] bg-[rgba(255,251,245,0.84)] p-4 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-5">
        <StoreHeader />

        {!sessionUser ? (
          <div className="rounded-[30px] border border-[rgba(95,63,42,0.1)] bg-white/80 p-6">
            <h1 className="text-3xl font-semibold tracking-[-0.03em]">
              Theo dõi đơn hàng
            </h1>
            <p className="mt-4 max-w-[56ch] leading-7 text-[#5c4a40]">
              Bạn cần đăng nhập để xem trạng thái đơn hàng và tiến trình giao
              nhận mới nhất.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#2f241f] px-5 font-bold text-[#fff8f0] no-underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h1 className="text-[2.7rem] font-semibold tracking-[-0.05em] md:text-[3.75rem] md:leading-none">
                Theo dõi đơn hàng
              </h1>
              <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-[#6a564b]">
                Xem nhanh các đơn của bạn, lọc theo trạng thái và mở chi tiết
                ngay trong cùng một màn hình.
              </p>
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
              {ORDER_FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-3.5 text-[13px] font-semibold transition ${
                    statusFilter === tab.key
                      ? "border-[#2f241f] bg-[#2f241f] text-[#fff8f0]"
                      : "border-[rgba(95,63,42,0.12)] bg-white text-[#7b675b]"
                  }`}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {feedback ? (
              <div className="mb-5 rounded-[22px] bg-[#f8ecdf] px-4 py-3 text-[#7b553b]">
                {feedback}
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-[30px] border border-[rgba(95,63,42,0.1)] bg-white/80 p-6">
                Đang tải danh sách đơn hàng...
              </div>
            ) : filteredOrders.length && selectedOrder ? (
              <div className="grid gap-4 lg:grid-cols-[285px_minmax(0,1fr)]">
                <aside className="rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-[rgba(255,255,255,0.76)] p-4">
                  <div className="mb-4">
                    <h2 className="text-[1.75rem] font-semibold tracking-[-0.04em]">
                      Đơn của bạn
                    </h2>
                    <p className="mt-1 text-sm text-[#8b7667]">
                      {filteredOrders.length} đơn đang hiển thị
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {filteredOrders.map((order) => (
                      <OrderPreviewCard
                        key={order._id}
                        order={order}
                        isActive={order.orderCode === selectedOrder.orderCode}
                        onSelect={() => setSelectedOrderCode(order.orderCode)}
                      />
                    ))}
                  </div>
                </aside>

                <div className="grid gap-4">
                  <section className="rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-[rgba(255,255,255,0.84)] p-4 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-[12px] font-medium text-[#b08968]">
                          Mã đơn hàng
                        </p>
                        <h2 className="mt-1 text-[2rem] font-medium tracking-[-0.04em] text-[#344760] md:text-[2.7rem]">
                          {selectedOrder.orderCode}
                        </h2>
                        <p className="mt-2 text-sm text-[#8a7365]">
                          {formatPlacedAtLabel(selectedOrder.placedAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${getToneClassName(orderStatusMeta.tone)}`}
                        >
                          {orderStatusMeta.label}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${getToneClassName(paymentStatusMeta.tone)}`}
                        >
                          {paymentStatusMeta.label}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <SummaryMetricCard
                        label="Tổng tiền"
                        value={formatCurrency(selectedOrder.totalAmount)}
                      />
                      <SummaryMetricCard
                        label="Thanh toán"
                        value={formatPaymentMethod(selectedOrder.paymentMethod)}
                      />
                      <SummaryMetricCard
                        label="Số lượng"
                        value={`${selectedTotalItems} sản phẩm`}
                      />
                    </div>

                    <div className="mt-5">
                      <h3 className="text-[1.9rem] font-semibold tracking-[-0.04em]">
                        Tiến trình đơn hàng
                      </h3>

                      <div className="mt-4 grid gap-3">
                        {trackingSteps.map((step, index) => (
                          <div
                            key={step.key}
                            className="grid grid-cols-[16px_minmax(0,1fr)] gap-3"
                          >
                            <div className="flex flex-col items-center">
                              <span
                                className={`mt-2 h-2.5 w-2.5 rounded-full ${stepDotClassName(step.state)}`}
                              />
                              {index < trackingSteps.length - 1 ? (
                                <span
                                  className={`mt-2 block w-px flex-1 ${stepLineClassName(step.state)}`}
                                />
                              ) : null}
                            </div>

                            <div
                              className={`rounded-[20px] border px-4 py-3 ${stepCardClassName(step.state)}`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-[15px] font-semibold text-[#2f241f]">
                                  {step.title}
                                </h4>
                                <span className="text-[12px] font-semibold text-[#a46f41]">
                                  {getStepStateLabel(step.state)}
                                </span>
                              </div>
                              <p className="mt-1.5 text-sm leading-6 text-[#6a564b]">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-[rgba(255,255,255,0.84)] p-4 md:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-[1.9rem] font-semibold tracking-[-0.04em]">
                          Thông tin giao hàng
                        </h2>
                        <p className="mt-3 text-[1.1rem] font-semibold">
                          {shippingAddress.fullName || "Khách hàng"}
                        </p>
                        <p className="mt-1 text-sm text-[#6a564b]">
                          {shippingAddress.phone || "Chưa có số điện thoại"}
                        </p>
                        <p className="mt-3 max-w-[56ch] text-sm leading-6 text-[#6a564b]">
                          {fullAddress || "Chưa có địa chỉ giao hàng"}
                        </p>
                      </div>

                      <Link
                        to="/lich-su-don-hang"
                        className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-[#2f241f] px-4 text-sm font-bold text-[#fff8f0] no-underline"
                      >
                        Lịch sử đơn hàng
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-4 border-t border-[#f0e6dd] pt-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <div className="text-[11px] font-medium tracking-[0.12em] text-[#b08968] uppercase">
                          Trạng thái
                        </div>
                        <div className="mt-1.5 text-sm font-semibold text-[#2f241f]">
                          {orderStatusMeta.label}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium tracking-[0.12em] text-[#b08968] uppercase">
                          Thanh toán
                        </div>
                        <div className="mt-1.5 text-sm font-semibold text-[#2f241f]">
                          {paymentStatusMeta.label}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-medium tracking-[0.12em] text-[#b08968] uppercase">
                          Ghi chú
                        </div>
                        <div className="mt-1.5 text-sm leading-6 text-[#2f241f]">
                          {selectedOrder.note || "Không có"}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            ) : orders.length ? (
              <div className="rounded-[30px] border border-[rgba(95,63,42,0.1)] bg-white/80 p-6">
                Không có đơn hàng nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="rounded-[30px] border border-[rgba(95,63,42,0.1)] bg-white/80 p-6">
                Bạn chưa có đơn hàng nào để theo dõi lúc này.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default OrderTracking;
