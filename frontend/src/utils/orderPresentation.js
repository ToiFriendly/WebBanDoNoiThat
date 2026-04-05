import { getFirstDisplayImage } from "./storefront";

const ORDER_STATUS_META = {
  pending: {
    label: "Chờ xác nhận",
    tone: "warm",
    rank: 1,
  },
  confirmed: {
    label: "Đã xác nhận",
    tone: "info",
    rank: 2,
  },
  shipping: {
    label: "Đang giao",
    tone: "info",
    rank: 3,
  },
  completed: {
    label: "Hoàn thành",
    tone: "success",
    rank: 4,
  },
  cancelled: {
    label: "Đã hủy",
    tone: "danger",
    rank: -1,
  },
};

const PAYMENT_STATUS_META = {
  pending: {
    label: "Chờ thanh toán",
    tone: "warm",
  },
  paid: {
    label: "Đã thanh toán",
    tone: "success",
  },
  failed: {
    label: "Thanh toán lỗi",
    tone: "danger",
  },
  refunded: {
    label: "Đã hoàn tiền",
    tone: "muted",
  },
};

const ORDER_TRACKING_STEPS = [
  {
    key: "pending",
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

export const ORDER_FILTER_TABS = [
  {
    key: "all",
    label: "Tất cả",
  },
  {
    key: "active",
    label: "Đang xử lý",
  },
  {
    key: "pending",
    label: "Chờ xác nhận",
  },
  {
    key: "confirmed",
    label: "Đã xác nhận",
  },
  {
    key: "shipping",
    label: "Đang giao",
  },
  {
    key: "completed",
    label: "Hoàn thành",
  },
  {
    key: "cancelled",
    label: "Đã hủy",
  },
];

export function getOrderStatusMeta(status) {
  return (
    ORDER_STATUS_META[status] || {
      label: status || "Không rõ",
      tone: "muted",
      rank: 0,
    }
  );
}

export function getPaymentStatusMeta(status) {
  return (
    PAYMENT_STATUS_META[status] || {
      label: status || "Không rõ",
      tone: "muted",
    }
  );
}

export function getToneClassName(tone) {
  if (tone === "success") {
    return "bg-[#edf7f0] text-[#2f6b43]";
  }

  if (tone === "danger") {
    return "bg-[#fff0eb] text-[#9b4731]";
  }

  if (tone === "info") {
    return "bg-[#eff4fb] text-[#45688b]";
  }

  if (tone === "warm") {
    return "bg-[#fbf0e3] text-[#b87c43]";
  }

  return "bg-[#f2ede7] text-[#6d5b4e]";
}

export function buildOrderTrackingSteps(orderStatus) {
  const statusMeta = getOrderStatusMeta(orderStatus);

  if (orderStatus === "cancelled") {
    return ORDER_TRACKING_STEPS.map((step) => ({
      ...step,
      state: step.key === "pending" ? "completed" : "inactive",
    }));
  }

  return ORDER_TRACKING_STEPS.map((step) => {
    const stepRank = getOrderStatusMeta(step.key).rank;

    if (statusMeta.rank >= stepRank) {
      return {
        ...step,
        state: "completed",
      };
    }

    if (statusMeta.rank === stepRank - 1) {
      return {
        ...step,
        state: "current",
      };
    }

    return {
      ...step,
      state: "inactive",
    };
  });
}

export function filterOrdersByStatus(orders = [], statusFilter = "all") {
  if (statusFilter === "all") {
    return orders;
  }

  if (statusFilter === "active") {
    return orders.filter((order) =>
      ["pending", "confirmed", "shipping"].includes(order.orderStatus),
    );
  }

  return orders.filter((order) => order.orderStatus === statusFilter);
}

export function getOrderItemImage(item) {
  return getFirstDisplayImage(item?.productImage, item?.product?.images);
}

export function sortOrdersByPlacedAtDesc(orders = []) {
  return [...orders].sort((leftOrder, rightOrder) => {
    const leftTime = new Date(leftOrder?.placedAt || 0).getTime();
    const rightTime = new Date(rightOrder?.placedAt || 0).getTime();

    return rightTime - leftTime;
  });
}
