const mongoose = require("mongoose");
const Order = require("../schemas/order");
const Product = require("../schemas/product");
const Category = require("../schemas/category");
const User = require("../schemas/user");

const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "shipping",
  "completed",
  "cancelled"
];
const PAYMENT_STATUS_VALUES = ["pending", "paid", "failed", "refunded"];
const PAYMENT_METHOD_VALUES = ["cod", "bank_transfer", "momo", "vnpay"];
const USER_ROLE_VALUES = ["admin", "customer"];
const USER_STATUS_VALUES = ["active", "inactive", "blocked"];

function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
}

function sanitizeAddress(address = {}) {
  return {
    fullName: toTrimmedString(address.fullName),
    phone: toTrimmedString(address.phone),
    street: toTrimmedString(address.street),
    ward: toTrimmedString(address.ward),
    district: toTrimmedString(address.district),
    city: toTrimmedString(address.city),
    country: toTrimmedString(address.country) || "Viet Nam",
    isDefault: parseBoolean(address.isDefault)
  };
}

function sanitizeAddresses(addresses) {
  if (!Array.isArray(addresses)) {
    return [];
  }

  const normalizedAddresses = addresses
    .map(sanitizeAddress)
    .filter(
      (address) =>
        address.fullName ||
        address.phone ||
        address.street ||
        address.district ||
        address.city
    );

  if (!normalizedAddresses.length) {
    return [];
  }

  let hasDefaultAddress = false;
  const mappedAddresses = normalizedAddresses.map((address, index) => {
    const isDefault = address.isDefault && !hasDefaultAddress;

    if (isDefault) {
      hasDefaultAddress = true;
    }

    return {
      ...address,
      isDefault: isDefault || (!hasDefaultAddress && index === 0)
    };
  });

  if (!mappedAddresses.some((address) => address.isDefault)) {
    mappedAddresses[0].isDefault = true;
  }

  return mappedAddresses;
}

function sanitizeOrderItem(item) {
  return {
    _id: item._id,
    product: item.product
      ? {
          _id: item.product._id,
          name: item.product.name,
          slug: item.product.slug,
          images: item.product.images
        }
      : {
          _id: item.product,
          name: item.productName,
          slug: item.productSlug,
          images: item.productImage ? [item.productImage] : []
        },
    productName: item.productName,
    productSlug: item.productSlug,
    productImage: item.productImage,
    sku: item.sku,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
    note: item.note
  };
}

function sanitizeOrder(order) {
  const items = Array.isArray(order.items) ? order.items.map(sanitizeOrderItem) : [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    _id: order._id,
    orderCode: order.orderCode,
    user: order.user
      ? {
          _id: order.user._id,
          username: order.user.username,
          fullName: order.user.fullName,
          email: order.user.email,
          phone: order.user.phone,
          avatarUrl: order.user.avatarUrl,
          role: order.user.role,
          status: order.user.status
        }
      : null,
    items,
    itemCount,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentProvider: order.paymentProvider,
    paymentStatus: order.paymentStatus,
    paymentReference: order.paymentReference,
    paymentRedirectUrl: order.paymentRedirectUrl,
    paymentTransactionId: order.paymentTransactionId,
    paymentResponseCode: order.paymentResponseCode,
    paymentMessage: order.paymentMessage,
    orderStatus: order.orderStatus,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,
    note: order.note,
    placedAt: order.placedAt,
    paidAt: order.paidAt,
    deliveredAt: order.deliveredAt,
    cancelledAt: order.cancelledAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

function sanitizeUser(user, metrics = {}) {
  const rawUser = user.toJSON();

  return {
    ...rawUser,
    orderCount: metrics.orderCount || 0,
    totalSpent: metrics.totalSpent || 0,
    lastOrderAt: metrics.lastOrderAt || null
  };
}

async function loadAdminOrderById(orderId) {
  return Order.findById(orderId)
    .populate("user", "username fullName email phone avatarUrl role status")
    .populate({
      path: "items",
      populate: {
        path: "product",
        select: "name slug images"
      }
    });
}

async function buildUserMetricsMap(userIds) {
  const normalizedUserIds = Array.isArray(userIds)
    ? userIds.map((userId) => userId.toString())
    : [];

  if (!normalizedUserIds.length) {
    return new Map();
  }

  const metrics = await Order.aggregate([
    {
      $match: {
        user: {
          $in: normalizedUserIds.map((userId) => new mongoose.Types.ObjectId(userId))
        },
        isDeleted: false,
        orderStatus: {
          $ne: "cancelled"
        }
      }
    },
    {
      $group: {
        _id: "$user",
        orderCount: {
          $sum: 1
        },
        totalSpent: {
          $sum: "$totalAmount"
        },
        lastOrderAt: {
          $max: "$placedAt"
        }
      }
    }
  ]);

  return new Map(
    metrics.map((metric) => [
      metric._id.toString(),
      {
        orderCount: metric.orderCount,
        totalSpent: metric.totalSpent,
        lastOrderAt: metric.lastOrderAt
      }
    ])
  );
}

async function ensureCanMutateAdminAccount(targetUser, updates = {}) {
  const nextRole = USER_ROLE_VALUES.includes(updates.role)
    ? updates.role
    : targetUser.role;
  const nextStatus = USER_STATUS_VALUES.includes(updates.status)
    ? updates.status
    : targetUser.status;

  if (targetUser.role !== "admin") {
    return;
  }

  const remainsActiveAdmin = nextRole === "admin" && nextStatus === "active";

  if (remainsActiveAdmin) {
    return;
  }

  const activeAdminCount = await User.countDocuments({
    role: "admin",
    status: "active",
    isDeleted: false
  });

  if (activeAdminCount <= 1) {
    const error = new Error("Can it nhat mot admin dang hoat dong trong he thong.");
    error.statusCode = 400;
    throw error;
  }
}

async function restoreInventory(orderItems) {
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        quantityInStock: item.quantity
      }
    });
  }
}

async function getAdminSummary(_req, res, next) {
  try {
    const [
      categoryCount,
      productCount,
      featuredProductCount,
      lowStockProductCount,
      orderCount,
      pendingOrderCount,
      shippingOrderCount,
      completedOrderCount,
      cancelledOrderCount,
      userCount,
      customerCount,
      adminCount,
      blockedUserCount,
      revenueAggregation
    ] = await Promise.all([
      Category.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false }),
      Product.countDocuments({ isDeleted: false, isFeatured: true }),
      Product.countDocuments({
        isDeleted: false,
        status: {
          $in: ["active", "out_of_stock"]
        },
        quantityInStock: {
          $lte: 5
        }
      }),
      Order.countDocuments({ isDeleted: false }),
      Order.countDocuments({ isDeleted: false, orderStatus: "pending" }),
      Order.countDocuments({ isDeleted: false, orderStatus: "shipping" }),
      Order.countDocuments({ isDeleted: false, orderStatus: "completed" }),
      Order.countDocuments({ isDeleted: false, orderStatus: "cancelled" }),
      User.countDocuments({ isDeleted: false }),
      User.countDocuments({ isDeleted: false, role: "customer" }),
      User.countDocuments({ isDeleted: false, role: "admin" }),
      User.countDocuments({ isDeleted: false, status: "blocked" }),
      Order.aggregate([
        {
          $match: {
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            grossRevenue: {
              $sum: {
                $cond: [
                  {
                    $ne: ["$orderStatus", "cancelled"]
                  },
                  "$totalAmount",
                  0
                ]
              }
            },
            paidRevenue: {
              $sum: {
                $cond: [
                  {
                    $eq: ["$paymentStatus", "paid"]
                  },
                  "$totalAmount",
                  0
                ]
              }
            }
          }
        }
      ])
    ]);

    const revenue = revenueAggregation[0] || {
      grossRevenue: 0,
      paidRevenue: 0
    };

    return res.status(200).json({
      summary: {
        categories: categoryCount,
        products: productCount,
        featuredProducts: featuredProductCount,
        lowStockProducts: lowStockProductCount,
        orders: orderCount,
        pendingOrders: pendingOrderCount,
        shippingOrders: shippingOrderCount,
        completedOrders: completedOrderCount,
        cancelledOrders: cancelledOrderCount,
        users: userCount,
        customers: customerCount,
        admins: adminCount,
        blockedUsers: blockedUserCount,
        grossRevenue: revenue.grossRevenue || 0,
        paidRevenue: revenue.paidRevenue || 0
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminOrders(req, res, next) {
  try {
    const search = toTrimmedString(req.query.search);
    const filter = {
      isDeleted: false
    };

    if (ORDER_STATUS_VALUES.includes(req.query.orderStatus)) {
      filter.orderStatus = req.query.orderStatus;
    }

    if (PAYMENT_STATUS_VALUES.includes(req.query.paymentStatus)) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    if (PAYMENT_METHOD_VALUES.includes(req.query.paymentMethod)) {
      filter.paymentMethod = req.query.paymentMethod;
    }

    if (search) {
      filter.$or = [
        {
          orderCode: {
            $regex: search,
            $options: "i"
          }
        },
        {
          "shippingAddress.fullName": {
            $regex: search,
            $options: "i"
          }
        },
        {
          "shippingAddress.phone": {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const orders = await Order.find(filter)
      .sort({ placedAt: -1, createdAt: -1 })
      .populate("user", "username fullName email phone avatarUrl role status")
      .populate({
        path: "items",
        populate: {
          path: "product",
          select: "name slug images"
        }
      });

    return res.status(200).json({
      orders: orders.map(sanitizeOrder),
      total: orders.length
    });
  } catch (error) {
    return next(error);
  }
}

async function updateAdminOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, isDeleted: false }).populate(
      "items",
      "product quantity"
    );

    if (!order) {
      return res.status(404).json({
        message: "Khong tim thay don hang."
      });
    }

    const nextOrderStatus = ORDER_STATUS_VALUES.includes(req.body.orderStatus)
      ? req.body.orderStatus
      : order.orderStatus;
    const nextPaymentStatus = PAYMENT_STATUS_VALUES.includes(req.body.paymentStatus)
      ? req.body.paymentStatus
      : order.paymentStatus;

    if (
      order.orderStatus === "cancelled" &&
      nextOrderStatus !== "cancelled"
    ) {
      return res.status(400).json({
        message: "Don hang da huy khong the kich hoat lai tu trang admin nay."
      });
    }

    if (
      order.orderStatus === "completed" &&
      nextOrderStatus !== "completed"
    ) {
      return res.status(400).json({
        message: "Don hang da hoan thanh khong the doi trang thai nguoc lai."
      });
    }

    if (
      nextOrderStatus === "cancelled" &&
      !["cancelled", "completed"].includes(order.orderStatus)
    ) {
      await restoreInventory(order.items);
      order.cancelledAt = new Date();
    }

    if (typeof req.body.note === "string") {
      order.note = req.body.note.trim();
    }

    if (typeof req.body.paymentReference === "string") {
      order.paymentReference = req.body.paymentReference.trim();
    }

    if (typeof req.body.paymentMessage === "string") {
      order.paymentMessage = req.body.paymentMessage.trim();
    }

    if (PAYMENT_METHOD_VALUES.includes(req.body.paymentMethod)) {
      order.paymentMethod = req.body.paymentMethod;
      order.paymentProvider =
        req.body.paymentMethod === "momo" ? "momo" : order.paymentProvider;
    }

    if (req.body.shippingAddress && typeof req.body.shippingAddress === "object") {
      const mergedShippingAddress = {
        ...order.shippingAddress.toObject(),
        ...sanitizeAddress({
          ...order.shippingAddress.toObject(),
          ...req.body.shippingAddress
        })
      };

      if (
        !mergedShippingAddress.fullName ||
        !mergedShippingAddress.phone ||
        !mergedShippingAddress.street ||
        !mergedShippingAddress.district ||
        !mergedShippingAddress.city
      ) {
        return res.status(400).json({
          message: "Thong tin giao hang chua day du."
        });
      }

      order.shippingAddress = mergedShippingAddress;
    }

    order.orderStatus = nextOrderStatus;
    order.paymentStatus = nextPaymentStatus;

    if (nextOrderStatus === "completed" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    if (nextPaymentStatus === "paid" && !order.paidAt) {
      order.paidAt = new Date();
    }

    if (nextPaymentStatus === "refunded" && nextOrderStatus !== "cancelled") {
      order.paymentMessage = order.paymentMessage || "Don hang da duoc hoan tien.";
    }

    await order.save();

    const populatedOrder = await loadAdminOrderById(order._id);

    return res.status(200).json({
      message: "Cap nhat don hang thanh cong.",
      order: sanitizeOrder(populatedOrder)
    });
  } catch (error) {
    return next(error);
  }
}

async function listAdminUsers(req, res, next) {
  try {
    const search = toTrimmedString(req.query.search);
    const filter = {
      isDeleted: false
    };

    if (USER_ROLE_VALUES.includes(req.query.role)) {
      filter.role = req.query.role;
    }

    if (USER_STATUS_VALUES.includes(req.query.status)) {
      filter.status = req.query.status;
    }

    if (search) {
      filter.$or = [
        {
          username: {
            $regex: search,
            $options: "i"
          }
        },
        {
          email: {
            $regex: search,
            $options: "i"
          }
        },
        {
          fullName: {
            $regex: search,
            $options: "i"
          }
        },
        {
          phone: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    const userMetricsMap = await buildUserMetricsMap(users.map((user) => user._id));

    return res.status(200).json({
      users: users.map((user) =>
        sanitizeUser(user, userMetricsMap.get(user._id.toString()))
      ),
      total: users.length
    });
  } catch (error) {
    return next(error);
  }
}

async function createAdminUser(req, res, next) {
  try {
    const username = toTrimmedString(req.body.username);
    const email = toTrimmedString(req.body.email).toLowerCase();
    const password = String(req.body.password || "");

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email va password la bat buoc."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password phai co it nhat 6 ky tu."
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email hoac username da ton tai."
      });
    }

    const user = await User.create({
      username,
      email,
      password,
      fullName: toTrimmedString(req.body.fullName),
      phone: toTrimmedString(req.body.phone),
      avatarUrl: toTrimmedString(req.body.avatarUrl) || undefined,
      role: USER_ROLE_VALUES.includes(req.body.role) ? req.body.role : "customer",
      status: USER_STATUS_VALUES.includes(req.body.status)
        ? req.body.status
        : "active",
      addresses: sanitizeAddresses(req.body.addresses)
    });

    return res.status(201).json({
      message: "Tao tai khoan thanh cong.",
      user: sanitizeUser(user, {
        orderCount: 0,
        totalSpent: 0,
        lastOrderAt: null
      })
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email hoac username da ton tai."
      });
    }

    return next(error);
  }
}

async function updateAdminUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        message: "Khong tim thay tai khoan."
      });
    }

    const nextRole = USER_ROLE_VALUES.includes(req.body.role)
      ? req.body.role
      : user.role;
    const nextStatus = USER_STATUS_VALUES.includes(req.body.status)
      ? req.body.status
      : user.status;

    if (req.user._id.toString() === user._id.toString()) {
      if (nextRole !== "admin") {
        return res.status(400).json({
          message: "Ban khong the tu ha quyen admin cua chinh minh."
        });
      }

      if (nextStatus !== "active") {
        return res.status(400).json({
          message: "Ban khong the tu khoa hoac vo hieu hoa tai khoan cua chinh minh."
        });
      }
    }

    await ensureCanMutateAdminAccount(user, {
      role: nextRole,
      status: nextStatus
    });

    const nextUsername = toTrimmedString(req.body.username) || user.username;
    const nextEmail = toTrimmedString(req.body.email).toLowerCase() || user.email;

    const duplicatedUser = await User.findOne({
      _id: {
        $ne: user._id
      },
      $or: [{ username: nextUsername }, { email: nextEmail }]
    });

    if (duplicatedUser) {
      return res.status(409).json({
        message: "Email hoac username da ton tai."
      });
    }

    const nextPassword =
      typeof req.body.password === "string" ? req.body.password : "";

    if (nextPassword && nextPassword.length < 6) {
      return res.status(400).json({
        message: "Password phai co it nhat 6 ky tu."
      });
    }

    user.username = nextUsername;
    user.email = nextEmail;
    user.fullName =
      typeof req.body.fullName === "string"
        ? req.body.fullName.trim()
        : user.fullName;
    user.phone =
      typeof req.body.phone === "string" ? req.body.phone.trim() : user.phone;

    if (typeof req.body.avatarUrl === "string") {
      user.avatarUrl = req.body.avatarUrl.trim() || user.avatarUrl;
    }

    user.role = nextRole;
    user.status = nextStatus;

    if (nextPassword) {
      user.password = nextPassword;
    }

    if (Array.isArray(req.body.addresses)) {
      user.addresses = sanitizeAddresses(req.body.addresses);
    }

    await user.save();

    const userMetricsMap = await buildUserMetricsMap([user._id]);

    return res.status(200).json({
      message: "Cap nhat tai khoan thanh cong.",
      user: sanitizeUser(user, userMetricsMap.get(user._id.toString()))
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email hoac username da ton tai."
      });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return next(error);
  }
}

async function deleteAdminUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, isDeleted: false });

    if (!user) {
      return res.status(404).json({
        message: "Khong tim thay tai khoan."
      });
    }

    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        message: "Ban khong the tu xoa tai khoan admin cua chinh minh."
      });
    }

    await ensureCanMutateAdminAccount(user, {
      role: "customer",
      status: "inactive"
    });

    user.isDeleted = true;
    user.status = "inactive";
    await user.save();

    return res.status(200).json({
      message: "Xoa tai khoan thanh cong."
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    return next(error);
  }
}

module.exports = {
  getAdminSummary,
  listAdminOrders,
  updateAdminOrder,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
};
