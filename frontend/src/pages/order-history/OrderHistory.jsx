import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductThumbnail from "../../components/ProductThumbnail";
import StoreHeader from "../../components/StoreHeader";
import {
  API_BASE_URL,
  formatCurrency,
  formatDateTime,
  getStoredSessionUser,
  requestAuthJson,
} from "../../utils/storefront";
import {
  ORDER_FILTER_TABS,
  filterOrdersByStatus,
  getOrderItemImage,
  getOrderStatusMeta,
  getPaymentStatusMeta,
  getToneClassName,
} from "../../utils/orderPresentation";

function formatPaymentMethod(paymentMethod) {
  if (!paymentMethod) {
    return "Chua cap nhat";
  }

  return String(paymentMethod).toUpperCase();
}

function HistoryOrderCard({ order }) {
  const orderStatusMeta = getOrderStatusMeta(order.orderStatus);
  const paymentStatusMeta = getPaymentStatusMeta(order.paymentStatus);
  const firstItem = order.items?.[0] || null;
  const previewImage = getOrderItemImage(firstItem);
  const totalItems = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const extraItemsCount = Math.max((order.items?.length || 0) - 1, 0);

  return (
    <article className="rounded-[26px] border border-[rgba(95,63,42,0.08)] bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <ProductThumbnail
            size="medium"
            src={previewImage}
            alt={firstItem?.productName || order.orderCode}
            placeholderLabel="San pham"
          />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-[#2f241f]">
                {order.orderCode}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getToneClassName(orderStatusMeta.tone)}`}
              >
                {orderStatusMeta.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-[#6a564b]">
              {formatDateTime(order.placedAt)}
            </p>

            <p className="mt-3 truncate text-sm font-medium text-[#2f241f]">
              {firstItem?.productName || "Don hang"}
            </p>
            <p className="mt-1 text-sm text-[#7d685a]">
              {firstItem ? `${firstItem.quantity} x ${formatCurrency(firstItem.unitPrice)}` : `${totalItems} san pham`}
              {extraItemsCount > 0 ? `  •  +${extraItemsCount} san pham khac` : ""}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getToneClassName(paymentStatusMeta.tone)}`}
              >
                {paymentStatusMeta.label}
              </span>
              <span className="rounded-full bg-[#f5efe6] px-2.5 py-1 text-[11px] font-semibold text-[#7b604c]">
                {formatPaymentMethod(order.paymentMethod)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 border-t border-[rgba(95,63,42,0.08)] pt-4 md:items-end md:border-t-0 md:pt-0">
          <div className="text-sm text-[#8b6243]">Tong thanh toan</div>
          <strong className="text-xl text-[#c86c2f]">
            {formatCurrency(order.totalAmount)}
          </strong>
          <div className="text-sm text-[#6a564b]">{totalItems} san pham</div>
          <Link
            to={`/theo-doi-don-hang/${order.orderCode}`}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#2f241f] px-4 text-sm font-bold text-[#fff8f0] no-underline"
          >
            Xem chi tiet
          </Link>
        </div>
      </div>
    </article>
  );
}

function OrderHistory() {
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (error) {
        setFeedback(error.message || "Khong the tai lich su don hang.");
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

  const filteredOrders = filterOrdersByStatus(orders, statusFilter);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,192,106,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(161,98,7,0.1),transparent_28%),linear-gradient(135deg,#f6efe4_0%,#efe4d3_40%,#f9f5ee_100%)] px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      <section className="mx-auto w-full max-w-[1180px] rounded-[32px] border border-[rgba(95,63,42,0.12)] bg-[rgba(255,251,245,0.82)] p-5 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-6">
        <StoreHeader />

        {!sessionUser ? (
          <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
            <h1 className="text-3xl font-semibold">Lich su don hang</h1>
            <p className="mt-4 leading-7 text-[#5c4a40]">
              Ban can dang nhap de xem lich su mua sam va tinh trang don hang.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f241f] px-5 font-bold text-[#fff8f0] no-underline"
            >
              Dang nhap ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-4xl font-semibold md:text-[2.7rem]">
                Lich su don hang
              </h1>
              <p className="mt-3 max-w-[54ch] text-[15px] leading-7 text-[#5c4a40]">
                Giao dien gon gon hon, xem nhanh don da mua va mo chi tiet khi
                can.
              </p>
            </div>

            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
              {ORDER_FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-semibold transition ${
                    statusFilter === tab.key
                      ? "bg-[#2f241f] text-[#fff8f0]"
                      : "border border-[rgba(95,63,42,0.12)] bg-white text-[#6a564b]"
                  }`}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {feedback ? (
              <div className="mb-6 rounded-2xl bg-[#f5ebde] px-4 py-3 text-[#734d36]">
                {feedback}
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
                Dang tai lich su don hang...
              </div>
            ) : filteredOrders.length ? (
              <div className="grid gap-4">
                <div className="text-sm text-[#7d685a]">
                  {filteredOrders.length} don dang hien thi
                </div>

                {filteredOrders.map((order) => (
                  <HistoryOrderCard key={order._id} order={order} />
                ))}
              </div>
            ) : orders.length ? (
              <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
                Khong co don hang nao phu hop voi bo loc hien tai.
              </div>
            ) : (
              <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
                Ban chua co don hang nao. Hay quay ve trang chu de bat dau mua sam.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default OrderHistory;
