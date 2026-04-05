import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";
import {
  API_BASE_URL,
  clearStoredSession,
  formatCurrency,
  formatDateTime,
  getStoredSession,
} from "../../utils/storefront";

const categoryInitialState = {
  id: "",
  name: "",
  slug: "",
  description: "",
  image: "",
  parentCategory: "",
  sortOrder: 0,
  isActive: true,
};

const productInitialState = {
  id: "",
  sku: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  material: "",
  style: "",
  color: "",
  length: 0,
  width: 0,
  height: 0,
  unit: "cm",
  price: 0,
  compareAtPrice: 0,
  quantityInStock: 0,
  images: "",
  tags: "",
  category: "",
  isFeatured: false,
  status: "active",
};

const orderInitialState = {
  id: "",
  orderCode: "",
  orderStatus: "pending",
  paymentStatus: "pending",
  paymentMethod: "cod",
  paymentReference: "",
  paymentMessage: "",
  note: "",
  shippingFullName: "",
  shippingPhone: "",
  shippingStreet: "",
  shippingWard: "",
  shippingDistrict: "",
  shippingCity: "",
  shippingCountry: "Viet Nam",
};

const userInitialState = {
  id: "",
  username: "",
  email: "",
  password: "",
  fullName: "",
  phone: "",
  avatarUrl: "",
  role: "customer",
  status: "active",
  addressFullName: "",
  addressPhone: "",
  addressStreet: "",
  addressWard: "",
  addressDistrict: "",
  addressCity: "",
  addressCountry: "Viet Nam",
};

const summaryInitialState = {
  categories: 0,
  products: 0,
  featuredProducts: 0,
  lowStockProducts: 0,
  orders: 0,
  pendingOrders: 0,
  shippingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  users: 0,
  customers: 0,
  admins: 0,
  blockedUsers: 0,
  grossRevenue: 0,
  paidRevenue: 0,
};

const sectionDefinitions = [
  { id: "overview", label: "Tổng quan" },
  { id: "products", label: "Sản phẩm" },
  { id: "orders", label: "Đơn hàng" },
  { id: "accounts", label: "Tài khoản" },
  { id: "categories", label: "Danh mục" },
];

const orderStatusOptions = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const paymentStatusOptions = [
  { value: "pending", label: "Chờ thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thất bại" },
  { value: "refunded", label: "Hoàn tiền" },
];

const paymentMethodOptions = [
  { value: "cod", label: "COD" },
  { value: "bank_transfer", label: "Chuyển khoản" },
  { value: "momo", label: "MoMo" },
  { value: "vnpay", label: "VNPay" },
];

const userRoleOptions = [
  { value: "customer", label: "Khách hàng" },
  { value: "admin", label: "Admin" },
];

const userStatusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Tạm ngưng" },
  { value: "blocked", label: "Đã khóa" },
];

const productStatusOptions = [
  { value: "active", label: "Đang bán" },
  { value: "draft", label: "Bản nháp" },
  { value: "out_of_stock", label: "Hết hàng" },
  { value: "archived", label: "Lưu trữ" },
];

function headers(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function fetchAdminPayload(token) {
  const config = headers(token);
  const [
    summaryResponse,
    categoryResponse,
    productResponse,
    orderResponse,
    userResponse,
  ] = await Promise.all([
    axios.get(`${API_BASE_URL}/api/admin/summary`, config),
    axios.get(`${API_BASE_URL}/api/admin/categories`, config),
    axios.get(`${API_BASE_URL}/api/admin/products`, config),
    axios.get(`${API_BASE_URL}/api/admin/orders`, config),
    axios.get(`${API_BASE_URL}/api/admin/users`, config),
  ]);

  return {
    summary: summaryResponse.data.summary || summaryInitialState,
    categories: categoryResponse.data.categories || [],
    products: productResponse.data.products || [],
    orders: orderResponse.data.orders || [],
    users: userResponse.data.users || [],
  };
}

function getAssetUrl(url = "") {
  if (!url) {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
}

function toSearchableText(values) {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function mapCategoryToForm(category) {
  return {
    id: category._id,
    name: category.name || "",
    slug: category.slug || "",
    description: category.description || "",
    image: category.image || "",
    parentCategory: category.parentCategory?._id || "",
    sortOrder: category.sortOrder || 0,
    isActive: Boolean(category.isActive),
  };
}

function mapProductToForm(product) {
  return {
    id: product._id,
    sku: product.sku || "",
    name: product.name || "",
    slug: product.slug || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    material: product.material || "",
    style: product.style || "",
    color: product.color || "",
    length: product.dimensions?.length || 0,
    width: product.dimensions?.width || 0,
    height: product.dimensions?.height || 0,
    unit: product.dimensions?.unit || "cm",
    price: product.price || 0,
    compareAtPrice: product.compareAtPrice || 0,
    quantityInStock: product.quantityInStock || 0,
    images: Array.isArray(product.images) ? product.images.join(", ") : "",
    tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
    category: product.category?._id || "",
    isFeatured: Boolean(product.isFeatured),
    status: product.status || "active",
  };
}

function mapOrderToForm(order) {
  return {
    id: order._id,
    orderCode: order.orderCode || "",
    orderStatus: order.orderStatus || "pending",
    paymentStatus: order.paymentStatus || "pending",
    paymentMethod: order.paymentMethod || "cod",
    paymentReference: order.paymentReference || "",
    paymentMessage: order.paymentMessage || "",
    note: order.note || "",
    shippingFullName: order.shippingAddress?.fullName || "",
    shippingPhone: order.shippingAddress?.phone || "",
    shippingStreet: order.shippingAddress?.street || "",
    shippingWard: order.shippingAddress?.ward || "",
    shippingDistrict: order.shippingAddress?.district || "",
    shippingCity: order.shippingAddress?.city || "",
    shippingCountry: order.shippingAddress?.country || "Viet Nam",
  };
}

function mapUserToForm(user) {
  const primaryAddress =
    user.addresses?.find((address) => address.isDefault) ||
    user.addresses?.[0] ||
    {};

  return {
    id: user._id,
    username: user.username || "",
    email: user.email || "",
    password: "",
    fullName: user.fullName || "",
    phone: user.phone || "",
    avatarUrl: user.avatarUrl || "",
    role: user.role || "customer",
    status: user.status || "active",
    addressFullName: primaryAddress.fullName || "",
    addressPhone: primaryAddress.phone || "",
    addressStreet: primaryAddress.street || "",
    addressWard: primaryAddress.ward || "",
    addressDistrict: primaryAddress.district || "",
    addressCity: primaryAddress.city || "",
    addressCountry: primaryAddress.country || "Viet Nam",
  };
}

function buildUserAddresses(form) {
  const hasAddress =
    form.addressStreet ||
    form.addressDistrict ||
    form.addressCity ||
    form.addressFullName ||
    form.addressPhone;

  if (!hasAddress) {
    return [];
  }

  return [
    {
      fullName: form.addressFullName || form.fullName,
      phone: form.addressPhone || form.phone,
      street: form.addressStreet,
      ward: form.addressWard,
      district: form.addressDistrict,
      city: form.addressCity,
      country: form.addressCountry || "Viet Nam",
      isDefault: true,
    },
  ];
}

function buildAddressText(address) {
  return [
    address?.street,
    address?.ward,
    address?.district,
    address?.city,
    address?.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function Field({ label, hint, children }) {
  return (
    <label className="admin-field">
      <span className="admin-field__label">{label}</span>
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
      {children}
    </label>
  );
}

function Panel({ className = "", children }) {
  return <section className={`admin-panel ${className}`}>{children}</section>;
}

function Badge({ tone = "neutral", children }) {
  return <span className={`admin-badge admin-badge--${tone}`}>{children}</span>;
}

function getTone(value) {
  if (value === "completed" || value === "paid" || value === "active") {
    return "success";
  }

  if (value === "shipping" || value === "confirmed" || value === "admin") {
    return "info";
  }

  if (value === "cancelled" || value === "failed" || value === "blocked") {
    return "danger";
  }

  if (value === "out_of_stock" || value === "inactive") {
    return "warning";
  }

  return "neutral";
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getStoredSession());
  const [activeSection, setActiveSection] = useState("overview");
  const [summary, setSummary] = useState(summaryInitialState);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [categoryForm, setCategoryForm] = useState(categoryInitialState);
  const [productForm, setProductForm] = useState(productInitialState);
  const [orderForm, setOrderForm] = useState(orderInitialState);
  const [userForm, setUserForm] = useState(userInitialState);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);
  const [uploadingProductImages, setUploadingProductImages] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [productSearch, setProductSearch] = useState("");
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  useEffect(() => {
    function syncSession() {
      const currentSession = getStoredSession();

      if (!currentSession?.token || currentSession?.user?.role !== "admin") {
        navigate("/login");
        return;
      }

      setSession(currentSession);
    }

    syncSession();
    window.addEventListener("auth-session-changed", syncSession);

    return () => {
      window.removeEventListener("auth-session-changed", syncSession);
    };
  }, [navigate]);

  useEffect(() => {
    if (!session?.token || session?.user?.role !== "admin") {
      return;
    }

    let isCancelled = false;

    async function syncAdminData() {
      try {
        setLoading(true);
        const payload = await fetchAdminPayload(session.token);

        if (isCancelled) {
          return;
        }

        setSummary(payload.summary);
        setCategories(payload.categories);
        setProducts(payload.products);
        setOrders(payload.orders);
        setUsers(payload.users);
      } catch (error) {
        if (!isCancelled) {
          setFeedback({
            type: "error",
            message:
              error.response?.data?.message ||
              "Không thể tải dữ liệu quản trị lúc này.",
          });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    syncAdminData();

    return () => {
      isCancelled = true;
    };
  }, [session]);

  async function reloadAdminData(showSpinner = false) {
    if (!session?.token) {
      return;
    }

    try {
      if (showSpinner) {
        setRefreshing(true);
      }

      const payload = await fetchAdminPayload(session.token);
      setSummary(payload.summary);
      setCategories(payload.categories);
      setProducts(payload.products);
      setOrders(payload.orders);
      setUsers(payload.users);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Không thể làm mới dữ liệu quản trị.",
      });
    } finally {
      setRefreshing(false);
    }
  }

  function updateCategoryForm(field, value) {
    setCategoryForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateProductForm(field, value) {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateOrderForm(field, value) {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateUserForm(field, value) {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetCategoryForm() {
    setCategoryForm(categoryInitialState);
  }

  function resetProductForm() {
    setProductForm(productInitialState);
  }

  function resetOrderForm() {
    setOrderForm(orderInitialState);
  }

  function resetUserForm() {
    setUserForm(userInitialState);
  }

  function fillCategoryForm(category) {
    setCategoryForm(mapCategoryToForm(category));
    setActiveSection("categories");
    setFeedback({
      type: "info",
      message: `Đang chỉnh sửa danh mục ${category.name}.`,
    });
  }

  function fillProductForm(product) {
    setProductForm(mapProductToForm(product));
    setActiveSection("products");
    setFeedback({
      type: "info",
      message: `Đang chỉnh sửa sản phẩm ${product.name}.`,
    });
  }

  function fillOrderForm(order) {
    setOrderForm(mapOrderToForm(order));
    setActiveSection("orders");
    setFeedback({
      type: "info",
      message: `Đang cập nhật đơn ${order.orderCode}.`,
    });
  }

  function fillUserForm(user) {
    setUserForm(mapUserToForm(user));
    setActiveSection("accounts");
    setFeedback({
      type: "info",
      message: `Đang chỉnh sửa tài khoản ${user.username}.`,
    });
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setSavingCategory(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        image: categoryForm.image,
        parentCategory: categoryForm.parentCategory,
        sortOrder: Number(categoryForm.sortOrder) || 0,
        isActive: categoryForm.isActive,
      };

      if (categoryForm.id) {
        await axios.put(
          `${API_BASE_URL}/api/admin/categories/${categoryForm.id}`,
          payload,
          headers(session.token),
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/admin/categories`,
          payload,
          headers(session.token),
        );
      }

      setFeedback({
        type: "success",
        message: categoryForm.id
          ? "Cập nhật danh mục thành công."
          : "Tạo danh mục thành công.",
      });
      resetCategoryForm();
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể lưu danh mục lúc này.",
      });
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    setSavingProduct(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        sku: productForm.sku,
        name: productForm.name,
        slug: productForm.slug,
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        material: productForm.material,
        style: productForm.style,
        color: productForm.color,
        length: Number(productForm.length) || 0,
        width: Number(productForm.width) || 0,
        height: Number(productForm.height) || 0,
        unit: productForm.unit,
        price: Number(productForm.price) || 0,
        compareAtPrice: Number(productForm.compareAtPrice) || 0,
        quantityInStock: Number(productForm.quantityInStock) || 0,
        images: productForm.images,
        tags: productForm.tags,
        category: productForm.category,
        isFeatured: productForm.isFeatured,
        status: productForm.status,
      };

      if (productForm.id) {
        await axios.put(
          `${API_BASE_URL}/api/admin/products/${productForm.id}`,
          payload,
          headers(session.token),
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/admin/products`,
          payload,
          headers(session.token),
        );
      }

      setFeedback({
        type: "success",
        message: productForm.id
          ? "Cập nhật sản phẩm thành công."
          : "Tạo sản phẩm thành công.",
      });
      resetProductForm();
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể lưu sản phẩm lúc này.",
      });
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleOrderSubmit(event) {
    event.preventDefault();
    setSavingOrder(true);
    setFeedback({ type: "", message: "" });

    try {
      await axios.put(
        `${API_BASE_URL}/api/admin/orders/${orderForm.id}`,
        {
          orderStatus: orderForm.orderStatus,
          paymentStatus: orderForm.paymentStatus,
          paymentMethod: orderForm.paymentMethod,
          paymentReference: orderForm.paymentReference,
          paymentMessage: orderForm.paymentMessage,
          note: orderForm.note,
          shippingAddress: {
            fullName: orderForm.shippingFullName,
            phone: orderForm.shippingPhone,
            street: orderForm.shippingStreet,
            ward: orderForm.shippingWard,
            district: orderForm.shippingDistrict,
            city: orderForm.shippingCity,
            country: orderForm.shippingCountry,
          },
        },
        headers(session.token),
      );

      setFeedback({
        type: "success",
        message: "Cập nhật đơn hàng thành công.",
      });
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể cập nhật đơn hàng.",
      });
    } finally {
      setSavingOrder(false);
    }
  }

  async function handleUserSubmit(event) {
    event.preventDefault();
    setSavingUser(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        fullName: userForm.fullName,
        phone: userForm.phone,
        avatarUrl: userForm.avatarUrl,
        role: userForm.role,
        status: userForm.status,
        addresses: buildUserAddresses(userForm),
      };

      if (userForm.id) {
        await axios.put(
          `${API_BASE_URL}/api/admin/users/${userForm.id}`,
          payload,
          headers(session.token),
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/admin/users`,
          payload,
          headers(session.token),
        );
      }

      setFeedback({
        type: "success",
        message: userForm.id
          ? "Cập nhật tài khoản thành công."
          : "Tạo tài khoản thành công.",
      });
      resetUserForm();
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể lưu tài khoản lúc này.",
      });
    } finally {
      setSavingUser(false);
    }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/categories/${id}`,
        headers(session.token),
      );
      if (categoryForm.id === id) {
        resetCategoryForm();
      }
      setFeedback({ type: "success", message: "Đã xóa danh mục." });
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể xóa danh mục lúc này.",
      });
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/products/${id}`,
        headers(session.token),
      );
      if (productForm.id === id) {
        resetProductForm();
      }
      setFeedback({ type: "success", message: "Đã xóa sản phẩm." });
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể xóa sản phẩm lúc này.",
      });
    }
  }

  async function handleDeleteUser(id) {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/api/admin/users/${id}`,
        headers(session.token),
      );
      if (userForm.id === id) {
        resetUserForm();
      }
      setFeedback({ type: "success", message: "Đã xóa tài khoản." });
      await reloadAdminData();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể xóa tài khoản lúc này.",
      });
    }
  }

  async function handleCategoryImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingCategoryImage(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "categories");

      const response = await axios.post(
        `${API_BASE_URL}/api/uploads/image`,
        formData,
        {
          headers: {
            ...headers(session.token).headers,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      updateCategoryForm("image", response.data.file.url);
      setFeedback({
        type: "success",
        message: "Tải ảnh danh mục thành công.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể tải ảnh danh mục.",
      });
    } finally {
      setUploadingCategoryImage(false);
      event.target.value = "";
    }
  }

  async function handleProductImagesUpload(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    try {
      setUploadingProductImages(true);
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", "products");

        const response = await axios.post(
          `${API_BASE_URL}/api/uploads/image`,
          formData,
          {
            headers: {
              ...headers(session.token).headers,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        uploadedUrls.push(response.data.file.url);
      }

      const existingImages = productForm.images
        ? productForm.images
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      updateProductForm(
        "images",
        [...existingImages, ...uploadedUrls].join(", "),
      );
      setFeedback({
        type: "success",
        message: "Tải ảnh sản phẩm thành công.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message || "Không thể tải ảnh sản phẩm.",
      });
    } finally {
      setUploadingProductImages(false);
      event.target.value = "";
    }
  }

  function handleLogout() {
    clearStoredSession();
    navigate("/login");
  }

  const visibleProducts = products.filter((product) => {
    const matchesSearch = productSearch.trim()
      ? toSearchableText([
          product.name,
          product.sku,
          product.slug,
          product.category?.name,
          product.shortDescription,
          ...(product.tags || []),
        ]).includes(productSearch.trim().toLowerCase())
      : true;
    const matchesStatus =
      productStatusFilter === "all" || product.status === productStatusFilter;
    const matchesCategory =
      productCategoryFilter === "all" ||
      product.category?._id === productCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const visibleOrders = orders.filter((order) => {
    const matchesSearch = orderSearch.trim()
      ? toSearchableText([
          order.orderCode,
          order.user?.fullName,
          order.user?.username,
          order.user?.email,
          order.shippingAddress?.fullName,
          order.shippingAddress?.phone,
        ]).includes(orderSearch.trim().toLowerCase())
      : true;
    const matchesStatus =
      orderStatusFilter === "all" || order.orderStatus === orderStatusFilter;
    const matchesPayment =
      orderPaymentFilter === "all" || order.paymentStatus === orderPaymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const visibleUsers = users.filter((user) => {
    const matchesSearch = userSearch.trim()
      ? toSearchableText([
          user.username,
          user.email,
          user.fullName,
          user.phone,
        ]).includes(userSearch.trim().toLowerCase())
      : true;
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
    const matchesStatus =
      userStatusFilter === "all" || user.status === userStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);
  const lowStockProducts = products
    .filter((product) => product.quantityInStock <= 5)
    .slice(0, 5);
  const recentOrders = orders.slice(0, 5);
  const newestUsers = users.slice(0, 5);
  const selectedOrder = orders.find((order) => order._id === orderForm.id) || null;
  const selectedUser = users.find((user) => user._id === userForm.id) || null;

  function renderOverviewSection() {
    return (
      <div className="admin-module-grid">
        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Điều hành nhanh</p>
              <h2>Nhịp vận hành của cửa hàng trong một màn hình.</h2>
              <p>
                Theo dõi doanh thu, đơn hàng mới, tồn kho thấp và các tài khoản
                cần can thiệp để xử lý ngay trong ca làm việc.
              </p>
            </div>
          </div>

          <div className="admin-spotlight-grid">
            <article className="admin-spotlight-card">
              <span className="admin-spotlight-card__label">Doanh thu đã thu</span>
              <strong>{formatCurrency(summary.paidRevenue)}</strong>
              <p>Ghi nhận từ các giao dịch đã thanh toán thành công.</p>
            </article>
            <article className="admin-spotlight-card">
              <span className="admin-spotlight-card__label">Doanh thu gộp</span>
              <strong>{formatCurrency(summary.grossRevenue)}</strong>
              <p>Tính trên toàn bộ đơn chưa hủy để xem quy mô vận hành.</p>
            </article>
            <article className="admin-spotlight-card">
              <span className="admin-spotlight-card__label">Đơn chờ xử lý</span>
              <strong>{summary.pendingOrders}</strong>
              <p>Những đơn cần xác nhận hoặc chuẩn bị giao ngay.</p>
            </article>
            <article className="admin-spotlight-card">
              <span className="admin-spotlight-card__label">Sản phẩm sắp hết</span>
              <strong>{summary.lowStockProducts}</strong>
              <p>Ưu tiên nhập lại hoặc đổi trạng thái trưng bày kịp thời.</p>
            </article>
          </div>

          <div className="admin-subgrid">
            <div className="admin-subpanel">
              <div className="admin-subpanel__head">
                <h3>Đơn hàng mới nhất</h3>
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() => setActiveSection("orders")}
                >
                  Xem đơn hàng
                </button>
              </div>
              <div className="admin-compact-list">
                {recentOrders.length ? (
                  recentOrders.map((order) => (
                    <button
                      type="button"
                      key={order._id}
                      className="admin-compact-item"
                      onClick={() => fillOrderForm(order)}
                    >
                      <div>
                        <strong>{order.orderCode}</strong>
                        <p>
                          {order.user?.fullName ||
                            order.shippingAddress?.fullName ||
                            "Khách lẻ"}
                        </p>
                      </div>
                      <div>
                        <Badge tone={getTone(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                        <div>{formatCurrency(order.totalAmount)}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="admin-empty">Chưa có đơn hàng nào.</div>
                )}
              </div>
            </div>

            <div className="admin-subpanel">
              <div className="admin-subpanel__head">
                <h3>Tài khoản mới & ưu tiên</h3>
                <button
                  type="button"
                  className="admin-inline-button"
                  onClick={() => setActiveSection("accounts")}
                >
                  Xem tài khoản
                </button>
              </div>
              <div className="admin-compact-list">
                {newestUsers.length ? (
                  newestUsers.map((user) => (
                    <button
                      type="button"
                      key={user._id}
                      className="admin-compact-item"
                      onClick={() => fillUserForm(user)}
                    >
                      <div className="admin-user-chip">
                        <div className="admin-avatar">
                          {user.avatarUrl ? (
                            <img src={getAssetUrl(user.avatarUrl)} alt={user.username} />
                          ) : (
                            <span>{(user.fullName || user.username || "U").slice(0, 1)}</span>
                          )}
                        </div>
                        <div>
                          <strong>{user.fullName || user.username}</strong>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div>
                        <Badge tone={getTone(user.status)}>{user.status}</Badge>
                        <div>{user.role}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="admin-empty">Chưa có tài khoản nào.</div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <div className="admin-side-stack">
          <Panel className="admin-content">
            <div className="admin-subpanel__head">
              <h3>Sản phẩm nổi bật</h3>
              <button
                type="button"
                className="admin-inline-button"
                onClick={() => setActiveSection("products")}
              >
                Quản lý sản phẩm
              </button>
            </div>
            <div className="admin-compact-list">
              {featuredProducts.length ? (
                featuredProducts.map((product) => (
                  <button
                    type="button"
                    key={product._id}
                    className="admin-compact-item"
                    onClick={() => fillProductForm(product)}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.category?.name || "Chưa phân loại"}</p>
                    </div>
                    <div>
                      <Badge tone={getTone(product.status)}>{product.status}</Badge>
                      <div>{formatCurrency(product.price)}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="admin-empty">Chưa có sản phẩm nổi bật.</div>
              )}
            </div>
          </Panel>

          <Panel className="admin-content">
            <div className="admin-subpanel__head">
              <h3>Cảnh báo tồn kho</h3>
              <button
                type="button"
                className="admin-inline-button"
                onClick={() => setActiveSection("products")}
              >
                Chuyển tới sản phẩm
              </button>
            </div>
            <div className="admin-compact-list">
              {lowStockProducts.length ? (
                lowStockProducts.map((product) => (
                  <button
                    type="button"
                    key={product._id}
                    className="admin-compact-item"
                    onClick={() => fillProductForm(product)}
                  >
                    <div>
                      <strong>{product.name}</strong>
                      <p>SKU: {product.sku}</p>
                    </div>
                    <div>
                      <Badge tone="warning">còn {product.quantityInStock}</Badge>
                    </div>
                  </button>
                ))
              ) : (
                <div className="admin-empty">Tồn kho đang ở mức an toàn.</div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  function renderProductSection() {
    return (
      <div className="admin-module-grid">
        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Quản lý sản phẩm</p>
              <h2>Thêm, chỉnh sửa, trưng bày và kiểm soát tồn kho.</h2>
              <p>
                Form này giữ đầy đủ SKU, slug, giá bán, media, tag, danh mục và
                trạng thái hiển thị để đội vận hành thao tác nhanh hơn.
              </p>
            </div>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={resetProductForm}
            >
              Tạo form mới
            </button>
          </div>

          <form className="admin-form" onSubmit={handleProductSubmit}>
            <div className="admin-form-grid admin-form-grid--two">
              <Field label="SKU">
                <input
                  className="admin-input"
                  value={productForm.sku}
                  onChange={(event) => updateProductForm("sku", event.target.value)}
                  required
                />
              </Field>
              <Field label="Tên sản phẩm">
                <input
                  className="admin-input"
                  value={productForm.name}
                  onChange={(event) => updateProductForm("name", event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="admin-form-grid admin-form-grid--two">
              <Field label="Slug">
                <input
                  className="admin-input"
                  value={productForm.slug}
                  onChange={(event) => updateProductForm("slug", event.target.value)}
                  placeholder="de-trong-de-tu-dong"
                />
              </Field>
              <Field label="Danh mục">
                <select
                  className="admin-input"
                  value={productForm.category}
                  onChange={(event) => updateProductForm("category", event.target.value)}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Mô tả ngắn">
              <textarea
                className="admin-input admin-input--textarea"
                value={productForm.shortDescription}
                onChange={(event) =>
                  updateProductForm("shortDescription", event.target.value)
                }
              />
            </Field>

            <Field label="Mô tả chi tiết">
              <textarea
                className="admin-input admin-input--textarea admin-input--large"
                value={productForm.description}
                onChange={(event) =>
                  updateProductForm("description", event.target.value)
                }
              />
            </Field>

            <div className="admin-form-grid admin-form-grid--three">
              <Field label="Chất liệu">
                <input
                  className="admin-input"
                  value={productForm.material}
                  onChange={(event) => updateProductForm("material", event.target.value)}
                />
              </Field>
              <Field label="Phong cách">
                <input
                  className="admin-input"
                  value={productForm.style}
                  onChange={(event) => updateProductForm("style", event.target.value)}
                />
              </Field>
              <Field label="Màu sắc">
                <input
                  className="admin-input"
                  value={productForm.color}
                  onChange={(event) => updateProductForm("color", event.target.value)}
                />
              </Field>
            </div>

            <div className="admin-form-grid admin-form-grid--four">
              <Field label="Dài">
                <input
                  className="admin-input"
                  type="number"
                  value={productForm.length}
                  onChange={(event) => updateProductForm("length", event.target.value)}
                />
              </Field>
              <Field label="Rộng">
                <input
                  className="admin-input"
                  type="number"
                  value={productForm.width}
                  onChange={(event) => updateProductForm("width", event.target.value)}
                />
              </Field>
              <Field label="Cao">
                <input
                  className="admin-input"
                  type="number"
                  value={productForm.height}
                  onChange={(event) => updateProductForm("height", event.target.value)}
                />
              </Field>
              <Field label="Đơn vị">
                <select
                  className="admin-input"
                  value={productForm.unit}
                  onChange={(event) => updateProductForm("unit", event.target.value)}
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                </select>
              </Field>
            </div>

            <div className="admin-form-grid admin-form-grid--three">
              <Field label="Giá bán">
                <input
                  className="admin-input"
                  type="number"
                  value={productForm.price}
                  onChange={(event) => updateProductForm("price", event.target.value)}
                  required
                />
              </Field>
              <Field label="Giá so sánh">
                <input
                  className="admin-input"
                  type="number"
                  value={productForm.compareAtPrice}
                  onChange={(event) =>
                    updateProductForm("compareAtPrice", event.target.value)
                  }
                />
              </Field>
              <Field label="Tồn kho">
                <input
                  className="admin-input"
                  type="number"
                  value={productForm.quantityInStock}
                  onChange={(event) =>
                    updateProductForm("quantityInStock", event.target.value)
                  }
                />
              </Field>
            </div>

            <div className="admin-form-grid admin-form-grid--two">
              <Field label="Trạng thái">
                <select
                  className="admin-input"
                  value={productForm.status}
                  onChange={(event) => updateProductForm("status", event.target.value)}
                >
                  {productStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tags" hint="Cách nhau bởi dấu phẩy">
                <input
                  className="admin-input"
                  value={productForm.tags}
                  onChange={(event) => updateProductForm("tags", event.target.value)}
                />
              </Field>
            </div>

            <Field label="Danh sách ảnh" hint="Cách nhau bởi dấu phẩy">
              <textarea
                className="admin-input admin-input--textarea"
                value={productForm.images}
                onChange={(event) => updateProductForm("images", event.target.value)}
              />
            </Field>

            <div className="admin-upload-card">
              <div>
                <strong>Upload ảnh sản phẩm</strong>
                <p>Ảnh sẽ được lưu vào Cloudinary trong thư mục `products`.</p>
              </div>
              <label className="admin-primary-button admin-primary-button--compact">
                {uploadingProductImages ? "Đang tải..." : "Chọn nhiều ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleProductImagesUpload}
                  disabled={uploadingProductImages}
                />
              </label>
            </div>

            {productForm.images ? (
              <div className="admin-image-grid">
                {productForm.images
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((imageUrl) => (
                    <img
                      key={imageUrl}
                      src={getAssetUrl(imageUrl)}
                      alt="Product preview"
                    />
                  ))}
              </div>
            ) : null}

            <label className="admin-check">
              <input
                type="checkbox"
                checked={productForm.isFeatured}
                onChange={(event) =>
                  updateProductForm("isFeatured", event.target.checked)
                }
              />
              <span>Đánh dấu là sản phẩm nổi bật</span>
            </label>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={savingProduct}
              >
                {savingProduct
                  ? "Đang lưu..."
                  : productForm.id
                    ? "Cập nhật sản phẩm"
                    : "Tạo sản phẩm"}
              </button>
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetProductForm}
              >
                Làm mới
              </button>
            </div>
          </form>
        </Panel>

        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Danh sách sản phẩm</p>
              <h2>{visibleProducts.length} sản phẩm đang hiển thị</h2>
              <p>Lọc nhanh theo từ khóa, trạng thái và danh mục.</p>
            </div>
          </div>

          <div className="admin-toolbar">
            <input
              className="admin-input"
              value={productSearch}
              onChange={(event) => setProductSearch(event.target.value)}
              placeholder="Tìm tên, SKU, tag, slug..."
            />
            <select
              className="admin-input"
              value={productStatusFilter}
              onChange={(event) => setProductStatusFilter(event.target.value)}
            >
              <option value="all">Mọi trạng thái</option>
              {productStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="admin-input"
              value={productCategoryFilter}
              onChange={(event) => setProductCategoryFilter(event.target.value)}
            >
              <option value="all">Mọi danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-list">
            {visibleProducts.length ? (
              visibleProducts.map((product) => {
                const firstImage = product.images?.[0] || "";

                return (
                  <article key={product._id} className="admin-list-card">
                    <div className="admin-list-card__media">
                      {firstImage ? (
                        <img src={getAssetUrl(firstImage)} alt={product.name} />
                      ) : (
                        <div className="admin-empty">No image</div>
                      )}
                    </div>

                    <div className="admin-list-card__content">
                      <div className="admin-list-card__top">
                        <div>
                          <div className="admin-card-kicker">
                            {product.category?.name || "Chưa phân loại"}
                          </div>
                          <h3>{product.name}</h3>
                        </div>
                        <div className="admin-badge-row">
                          <Badge tone={getTone(product.status)}>{product.status}</Badge>
                          {product.isFeatured ? (
                            <Badge tone="info">featured</Badge>
                          ) : null}
                        </div>
                      </div>

                      <p className="admin-list-card__text">
                        {product.shortDescription || "Sản phẩm chưa có mô tả ngắn."}
                      </p>

                      <div className="admin-meta-grid">
                        <span>SKU: {product.sku}</span>
                        <span>Slug: {product.slug}</span>
                        <span>Tồn kho: {product.quantityInStock}</span>
                        <span>Giá: {formatCurrency(product.price)}</span>
                      </div>

                      <div className="admin-list-card__footer">
                        <div className="admin-chip-row">
                          {(product.tags || []).slice(0, 4).map((tag) => (
                            <span key={tag} className="admin-chip">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-inline-button"
                            onClick={() => fillProductForm(product)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            type="button"
                            className="admin-inline-button admin-inline-button--danger"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="admin-empty">
                Không có sản phẩm nào khớp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  function renderOrderSection() {
    return (
      <div className="admin-module-grid">
        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Quản lý đơn hàng</p>
              <h2>
                {selectedOrder
                  ? `Chi tiết ${selectedOrder.orderCode}`
                  : "Chọn một đơn để chỉnh sửa"}
              </h2>
              <p>
                Cập nhật trạng thái xử lý, thanh toán, thông tin giao hàng và ghi
                chú vận hành trong cùng một khối kính.
              </p>
            </div>
          </div>

          {selectedOrder ? (
            <form className="admin-form" onSubmit={handleOrderSubmit}>
              <div className="admin-info-band">
                <div>
                  <span>Mã đơn</span>
                  <strong>{selectedOrder.orderCode}</strong>
                </div>
                <div>
                  <span>Khách hàng</span>
                  <strong>
                    {selectedOrder.user?.fullName ||
                      selectedOrder.shippingAddress?.fullName ||
                      "Khách lẻ"}
                  </strong>
                </div>
                <div>
                  <span>Tổng tiền</span>
                  <strong>{formatCurrency(selectedOrder.totalAmount)}</strong>
                </div>
                <div>
                  <span>Đặt lúc</span>
                  <strong>{formatDateTime(selectedOrder.placedAt)}</strong>
                </div>
              </div>

              <div className="admin-form-grid admin-form-grid--three">
                <Field label="Trạng thái đơn">
                  <select
                    className="admin-input"
                    value={orderForm.orderStatus}
                    onChange={(event) =>
                      updateOrderForm("orderStatus", event.target.value)
                    }
                  >
                    {orderStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Trạng thái thanh toán">
                  <select
                    className="admin-input"
                    value={orderForm.paymentStatus}
                    onChange={(event) =>
                      updateOrderForm("paymentStatus", event.target.value)
                    }
                  >
                    {paymentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Phương thức">
                  <select
                    className="admin-input"
                    value={orderForm.paymentMethod}
                    onChange={(event) =>
                      updateOrderForm("paymentMethod", event.target.value)
                    }
                  >
                    {paymentMethodOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="admin-form-grid admin-form-grid--two">
                <Field label="Mã tham chiếu thanh toán">
                  <input
                    className="admin-input"
                    value={orderForm.paymentReference}
                    onChange={(event) =>
                      updateOrderForm("paymentReference", event.target.value)
                    }
                  />
                </Field>
                <Field label="Thông điệp thanh toán">
                  <input
                    className="admin-input"
                    value={orderForm.paymentMessage}
                    onChange={(event) =>
                      updateOrderForm("paymentMessage", event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field label="Ghi chú đơn hàng">
                <textarea
                  className="admin-input admin-input--textarea"
                  value={orderForm.note}
                  onChange={(event) => updateOrderForm("note", event.target.value)}
                />
              </Field>

              <div className="admin-form-grid admin-form-grid--two">
                <Field label="Người nhận">
                  <input
                    className="admin-input"
                    value={orderForm.shippingFullName}
                    onChange={(event) =>
                      updateOrderForm("shippingFullName", event.target.value)
                    }
                    required
                  />
                </Field>
                <Field label="Số điện thoại">
                  <input
                    className="admin-input"
                    value={orderForm.shippingPhone}
                    onChange={(event) =>
                      updateOrderForm("shippingPhone", event.target.value)
                    }
                    required
                  />
                </Field>
              </div>

              <Field label="Địa chỉ">
                <input
                  className="admin-input"
                  value={orderForm.shippingStreet}
                  onChange={(event) =>
                    updateOrderForm("shippingStreet", event.target.value)
                  }
                  required
                />
              </Field>

              <div className="admin-form-grid admin-form-grid--four">
                <Field label="Phường/Xã">
                  <input
                    className="admin-input"
                    value={orderForm.shippingWard}
                    onChange={(event) =>
                      updateOrderForm("shippingWard", event.target.value)
                    }
                  />
                </Field>
                <Field label="Quận/Huyện">
                  <input
                    className="admin-input"
                    value={orderForm.shippingDistrict}
                    onChange={(event) =>
                      updateOrderForm("shippingDistrict", event.target.value)
                    }
                    required
                  />
                </Field>
                <Field label="Tỉnh/Thành">
                  <input
                    className="admin-input"
                    value={orderForm.shippingCity}
                    onChange={(event) =>
                      updateOrderForm("shippingCity", event.target.value)
                    }
                    required
                  />
                </Field>
                <Field label="Quốc gia">
                  <input
                    className="admin-input"
                    value={orderForm.shippingCountry}
                    onChange={(event) =>
                      updateOrderForm("shippingCountry", event.target.value)
                    }
                  />
                </Field>
              </div>

              <div className="admin-subpanel">
                <div className="admin-subpanel__head">
                  <h3>Danh sách sản phẩm trong đơn</h3>
                </div>
                <div className="admin-order-items">
                  {selectedOrder.items.map((item) => (
                    <div key={item._id} className="admin-order-item">
                      <div className="admin-order-item__thumb">
                        {item.productImage || item.product?.images?.[0] ? (
                          <img
                            src={getAssetUrl(
                              item.productImage || item.product?.images?.[0],
                            )}
                            alt={item.productName}
                          />
                        ) : (
                          <div className="admin-empty">No image</div>
                        )}
                      </div>
                      <div className="admin-order-item__meta">
                        <strong>{item.productName}</strong>
                        <p>SKU: {item.sku || "Không có"}</p>
                      </div>
                      <div className="admin-order-item__summary">
                        <span>x{item.quantity}</span>
                        <strong>{formatCurrency(item.lineTotal)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-form-actions">
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={savingOrder}
                >
                  {savingOrder ? "Đang lưu..." : "Lưu cập nhật đơn hàng"}
                </button>
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={resetOrderForm}
                >
                  Bỏ chọn đơn
                </button>
              </div>
            </form>
          ) : (
            <div className="admin-empty">
              Chọn một đơn hàng ở cột bên phải để xem chi tiết và cập nhật trạng
              thái xử lý.
            </div>
          )}
        </Panel>

        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Danh sách đơn hàng</p>
              <h2>{visibleOrders.length} đơn đang hiển thị</h2>
              <p>Lọc theo mã đơn, khách hàng, trạng thái xử lý và thanh toán.</p>
            </div>
          </div>

          <div className="admin-toolbar">
            <input
              className="admin-input"
              value={orderSearch}
              onChange={(event) => setOrderSearch(event.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, email..."
            />
            <select
              className="admin-input"
              value={orderStatusFilter}
              onChange={(event) => setOrderStatusFilter(event.target.value)}
            >
              <option value="all">Mọi trạng thái đơn</option>
              {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="admin-input"
              value={orderPaymentFilter}
              onChange={(event) => setOrderPaymentFilter(event.target.value)}
            >
              <option value="all">Mọi thanh toán</option>
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-list">
            {visibleOrders.length ? (
              visibleOrders.map((order) => (
                <button
                  type="button"
                  key={order._id}
                  className={`admin-list-card admin-list-card--selectable ${
                    orderForm.id === order._id ? "admin-list-card--active" : ""
                  }`}
                  onClick={() => fillOrderForm(order)}
                >
                  <div className="admin-list-card__content">
                    <div className="admin-list-card__top">
                      <div>
                        <div className="admin-card-kicker">{order.orderCode}</div>
                        <h3>
                          {order.user?.fullName ||
                            order.shippingAddress?.fullName ||
                            "Khách hàng"}
                        </h3>
                      </div>
                      <div className="admin-badge-row">
                        <Badge tone={getTone(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                        <Badge tone={getTone(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <p className="admin-list-card__text">
                      {buildAddressText(order.shippingAddress)}
                    </p>

                    <div className="admin-meta-grid">
                      <span>{order.itemCount} sản phẩm</span>
                      <span>
                        {paymentMethodOptions.find(
                          (item) => item.value === order.paymentMethod,
                        )?.label || order.paymentMethod}
                      </span>
                      <span>{formatDateTime(order.placedAt)}</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="admin-empty">
                Không có đơn hàng nào khớp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  function renderAccountSection() {
    return (
      <div className="admin-module-grid">
        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Quản lý tài khoản</p>
              <h2>
                {selectedUser
                  ? `Đang chỉnh sửa ${selectedUser.username}`
                  : "Tạo hoặc cập nhật tài khoản"}
              </h2>
              <p>
                Quản trị role, trạng thái hoạt động, thông tin cá nhân và địa chỉ
                mặc định ngay trên một form duy nhất.
              </p>
            </div>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={resetUserForm}
            >
              Tạo tài khoản mới
            </button>
          </div>

          <form className="admin-form" onSubmit={handleUserSubmit}>
            <div className="admin-form-grid admin-form-grid--two">
              <Field label="Username">
                <input
                  className="admin-input"
                  value={userForm.username}
                  onChange={(event) => updateUserForm("username", event.target.value)}
                  required
                />
              </Field>
              <Field label="Email">
                <input
                  className="admin-input"
                  type="email"
                  value={userForm.email}
                  onChange={(event) => updateUserForm("email", event.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="admin-form-grid admin-form-grid--three">
              <Field label="Họ và tên">
                <input
                  className="admin-input"
                  value={userForm.fullName}
                  onChange={(event) => updateUserForm("fullName", event.target.value)}
                />
              </Field>
              <Field label="Số điện thoại">
                <input
                  className="admin-input"
                  value={userForm.phone}
                  onChange={(event) => updateUserForm("phone", event.target.value)}
                />
              </Field>
              <Field
                label="Mật khẩu"
                hint={userForm.id ? "Để trống nếu giữ nguyên mật khẩu." : "Tối thiểu 6 ký tự."}
              >
                <input
                  className="admin-input"
                  type="password"
                  value={userForm.password}
                  onChange={(event) => updateUserForm("password", event.target.value)}
                  required={!userForm.id}
                />
              </Field>
            </div>

            <div className="admin-form-grid admin-form-grid--three">
              <Field label="Avatar URL">
                <input
                  className="admin-input"
                  value={userForm.avatarUrl}
                  onChange={(event) => updateUserForm("avatarUrl", event.target.value)}
                />
              </Field>
              <Field label="Vai trò">
                <select
                  className="admin-input"
                  value={userForm.role}
                  onChange={(event) => updateUserForm("role", event.target.value)}
                >
                  {userRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Trạng thái">
                <select
                  className="admin-input"
                  value={userForm.status}
                  onChange={(event) => updateUserForm("status", event.target.value)}
                >
                  {userStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="admin-address-card">
              <div className="admin-subpanel__head">
                <h3>Địa chỉ mặc định</h3>
              </div>

              <div className="admin-form-grid admin-form-grid--two">
                <Field label="Tên người nhận">
                  <input
                    className="admin-input"
                    value={userForm.addressFullName}
                    onChange={(event) =>
                      updateUserForm("addressFullName", event.target.value)
                    }
                  />
                </Field>
                <Field label="Số điện thoại">
                  <input
                    className="admin-input"
                    value={userForm.addressPhone}
                    onChange={(event) =>
                      updateUserForm("addressPhone", event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field label="Địa chỉ">
                <input
                  className="admin-input"
                  value={userForm.addressStreet}
                  onChange={(event) =>
                    updateUserForm("addressStreet", event.target.value)
                  }
                />
              </Field>

              <div className="admin-form-grid admin-form-grid--four">
                <Field label="Phường/Xã">
                  <input
                    className="admin-input"
                    value={userForm.addressWard}
                    onChange={(event) => updateUserForm("addressWard", event.target.value)}
                  />
                </Field>
                <Field label="Quận/Huyện">
                  <input
                    className="admin-input"
                    value={userForm.addressDistrict}
                    onChange={(event) =>
                      updateUserForm("addressDistrict", event.target.value)
                    }
                  />
                </Field>
                <Field label="Tỉnh/Thành">
                  <input
                    className="admin-input"
                    value={userForm.addressCity}
                    onChange={(event) => updateUserForm("addressCity", event.target.value)}
                  />
                </Field>
                <Field label="Quốc gia">
                  <input
                    className="admin-input"
                    value={userForm.addressCountry}
                    onChange={(event) =>
                      updateUserForm("addressCountry", event.target.value)
                    }
                  />
                </Field>
              </div>
            </div>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={savingUser}
              >
                {savingUser
                  ? "Đang lưu..."
                  : userForm.id
                    ? "Cập nhật tài khoản"
                    : "Tạo tài khoản"}
              </button>
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetUserForm}
              >
                Làm mới
              </button>
            </div>
          </form>
        </Panel>

        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Danh sách tài khoản</p>
              <h2>{visibleUsers.length} tài khoản đang hiển thị</h2>
              <p>
                Kiểm soát toàn bộ khách hàng và admin, bao gồm vai trò, trạng
                thái và sức mua.
              </p>
            </div>
          </div>

          <div className="admin-toolbar">
            <input
              className="admin-input"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Tìm username, email, tên, số điện thoại..."
            />
            <select
              className="admin-input"
              value={userRoleFilter}
              onChange={(event) => setUserRoleFilter(event.target.value)}
            >
              <option value="all">Mọi vai trò</option>
              {userRoleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              className="admin-input"
              value={userStatusFilter}
              onChange={(event) => setUserStatusFilter(event.target.value)}
            >
              <option value="all">Mọi trạng thái</option>
              {userStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-list">
            {visibleUsers.length ? (
              visibleUsers.map((user) => (
                <article key={user._id} className="admin-list-card">
                  <div className="admin-list-card__content">
                    <div className="admin-list-card__top">
                      <div className="admin-user-chip">
                        <div className="admin-avatar">
                          {user.avatarUrl ? (
                            <img src={getAssetUrl(user.avatarUrl)} alt={user.username} />
                          ) : (
                            <span>{(user.fullName || user.username || "U").slice(0, 1)}</span>
                          )}
                        </div>
                        <div>
                          <div className="admin-card-kicker">@{user.username}</div>
                          <h3>{user.fullName || "Chưa cập nhật tên"}</h3>
                        </div>
                      </div>
                      <div className="admin-badge-row">
                        <Badge tone={getTone(user.role)}>{user.role}</Badge>
                        <Badge tone={getTone(user.status)}>{user.status}</Badge>
                      </div>
                    </div>

                    <p className="admin-list-card__text">{user.email}</p>

                    <div className="admin-meta-grid">
                      <span>{user.phone || "Chưa có SĐT"}</span>
                      <span>{user.orderCount || 0} đơn</span>
                      <span>{formatCurrency(user.totalSpent || 0)}</span>
                      <span>{formatDateTime(user.lastLoginAt) || "Chưa đăng nhập"}</span>
                    </div>

                    <div className="admin-list-card__footer">
                      <div className="admin-chip-row">
                        <span className="admin-chip">
                          Địa chỉ: {buildAddressText(user.addresses?.[0]) || "Chưa có"}
                        </span>
                      </div>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-inline-button"
                          onClick={() => fillUserForm(user)}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          type="button"
                          className="admin-inline-button admin-inline-button--danger"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="admin-empty">
                Không có tài khoản nào khớp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  function renderCategorySection() {
    return (
      <div className="admin-module-grid">
        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Quản lý danh mục</p>
              <h2>Chuẩn hóa cây danh mục để sản phẩm gọn và dễ lọc.</h2>
              <p>
                Danh mục được giữ riêng để đội nội dung có thể tổ chức storefront
                trước khi đẩy thêm sản phẩm mới.
              </p>
            </div>
            <button
              type="button"
              className="admin-secondary-button"
              onClick={resetCategoryForm}
            >
              Tạo danh mục mới
            </button>
          </div>

          <form className="admin-form" onSubmit={handleCategorySubmit}>
            <div className="admin-form-grid admin-form-grid--two">
              <Field label="Tên danh mục">
                <input
                  className="admin-input"
                  value={categoryForm.name}
                  onChange={(event) => updateCategoryForm("name", event.target.value)}
                  required
                />
              </Field>
              <Field label="Slug">
                <input
                  className="admin-input"
                  value={categoryForm.slug}
                  onChange={(event) => updateCategoryForm("slug", event.target.value)}
                  placeholder="de-trong-de-tu-dong"
                />
              </Field>
            </div>

            <Field label="Mô tả">
              <textarea
                className="admin-input admin-input--textarea"
                value={categoryForm.description}
                onChange={(event) =>
                  updateCategoryForm("description", event.target.value)
                }
              />
            </Field>

            <Field label="Ảnh danh mục">
              <input
                className="admin-input"
                value={categoryForm.image}
                onChange={(event) => updateCategoryForm("image", event.target.value)}
              />
            </Field>

            <div className="admin-upload-card">
              <div>
                <strong>Upload ảnh danh mục</strong>
                <p>Ảnh sẽ được lưu vào Cloudinary trong thư mục `categories`.</p>
              </div>
              <label className="admin-primary-button admin-primary-button--compact">
                {uploadingCategoryImage ? "Đang tải..." : "Chọn ảnh"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCategoryImageUpload}
                  disabled={uploadingCategoryImage}
                />
              </label>
            </div>

            {categoryForm.image ? (
              <div className="admin-image-grid admin-image-grid--single">
                <img
                  src={getAssetUrl(categoryForm.image)}
                  alt="Category preview"
                />
              </div>
            ) : null}

            <div className="admin-form-grid admin-form-grid--two">
              <Field label="Danh mục cha">
                <select
                  className="admin-input"
                  value={categoryForm.parentCategory}
                  onChange={(event) =>
                    updateCategoryForm("parentCategory", event.target.value)
                  }
                >
                  <option value="">Không có</option>
                  {categories
                    .filter((category) => category._id !== categoryForm.id)
                    .map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Thứ tự hiển thị">
                <input
                  className="admin-input"
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(event) =>
                    updateCategoryForm("sortOrder", event.target.value)
                  }
                />
              </Field>
            </div>

            <label className="admin-check">
              <input
                type="checkbox"
                checked={categoryForm.isActive}
                onChange={(event) =>
                  updateCategoryForm("isActive", event.target.checked)
                }
              />
              <span>Danh mục đang hoạt động</span>
            </label>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={savingCategory}
              >
                {savingCategory
                  ? "Đang lưu..."
                  : categoryForm.id
                    ? "Cập nhật danh mục"
                    : "Tạo danh mục"}
              </button>
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetCategoryForm}
              >
                Làm mới
              </button>
            </div>
          </form>
        </Panel>

        <Panel className="admin-content">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">Danh sách danh mục</p>
              <h2>{categories.length} danh mục đang hoạt động</h2>
              <p>Tối ưu cấu trúc danh mục để storefront dễ điều hướng hơn.</p>
            </div>
          </div>

          <div className="admin-list">
            {categories.length ? (
              categories.map((category) => (
                <article key={category._id} className="admin-list-card">
                  <div className="admin-list-card__content">
                    <div className="admin-list-card__top">
                      <div>
                        <div className="admin-card-kicker">
                          {category.parentCategory?.name || "Danh mục gốc"}
                        </div>
                        <h3>{category.name}</h3>
                      </div>
                      <div className="admin-badge-row">
                        <Badge tone={category.isActive ? "success" : "warning"}>
                          {category.isActive ? "active" : "inactive"}
                        </Badge>
                      </div>
                    </div>

                    <p className="admin-list-card__text">
                      {category.description || "Chưa có mô tả."}
                    </p>

                    <div className="admin-meta-grid">
                      <span>Slug: {category.slug}</span>
                      <span>Thứ tự: {category.sortOrder}</span>
                      <span>{formatDateTime(category.updatedAt)}</span>
                    </div>

                    <div className="admin-list-card__footer">
                      <div className="admin-chip-row">
                        {category.image ? (
                          <span className="admin-chip">Có ảnh đại diện</span>
                        ) : null}
                      </div>
                      <div className="admin-row-actions">
                        <button
                          type="button"
                          className="admin-inline-button"
                          onClick={() => fillCategoryForm(category)}
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          type="button"
                          className="admin-inline-button admin-inline-button--danger"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="admin-empty">Chưa có danh mục nào.</div>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  function renderActiveSection() {
    if (activeSection === "products") {
      return renderProductSection();
    }

    if (activeSection === "orders") {
      return renderOrderSection();
    }

    if (activeSection === "accounts") {
      return renderAccountSection();
    }

    if (activeSection === "categories") {
      return renderCategorySection();
    }

    return renderOverviewSection();
  }

  if (!session?.token || session?.user?.role !== "admin") {
    return null;
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <Panel className="admin-hero">
          <div className="admin-hero__top">
            <div>
              <p className="admin-eyebrow">Admin liquid glass</p>
              <h1>Dashboard quản trị toàn diện cho sản phẩm, đơn hàng và tài khoản.</h1>
              <p className="admin-hero__description">
                Một lớp giao diện kính mờ theo hướng iOS để bạn điều hành kho,
                đơn và người dùng trong cùng một không gian trực quan.
              </p>
            </div>

            <div className="admin-hero__actions">
              <button
                type="button"
                className="admin-secondary-button"
                onClick={() => reloadAdminData(true)}
                disabled={refreshing}
              >
                {refreshing ? "Đang làm mới..." : "Làm mới dữ liệu"}
              </button>
              <Link to="/" className="admin-link-button admin-secondary-button">
                Về storefront
              </Link>
              <div className="admin-user-pill">
                {session.user.fullName || session.user.username}
              </div>
              <button
                type="button"
                className="admin-primary-button"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="admin-summary-grid">
            <article className="admin-summary-card">
              <span>Sản phẩm</span>
              <strong>{summary.products}</strong>
              <p>{summary.featuredProducts} sản phẩm nổi bật đang được ghim.</p>
            </article>
            <article className="admin-summary-card">
              <span>Đơn hàng</span>
              <strong>{summary.orders}</strong>
              <p>{summary.pendingOrders} đơn đang chờ xử lý ngay lúc này.</p>
            </article>
            <article className="admin-summary-card">
              <span>Tài khoản</span>
              <strong>{summary.users}</strong>
              <p>
                {summary.customers} khách hàng, {summary.admins} admin, {summary.blockedUsers} bị khóa.
              </p>
            </article>
            <article className="admin-summary-card">
              <span>Doanh thu</span>
              <strong>{formatCurrency(summary.grossRevenue)}</strong>
              <p>{formatCurrency(summary.paidRevenue)} đã thanh toán thành công.</p>
            </article>
          </div>

          <div className="admin-nav">
            {sectionDefinitions.map((section) => (
              <button
                type="button"
                key={section.id}
                className={`admin-nav__button ${
                  activeSection === section.id ? "admin-nav__button--active" : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span>{section.label}</span>
              </button>
            ))}
          </div>

          {feedback.message ? (
            <div className={`admin-feedback admin-feedback--${feedback.type || "info"}`}>
              {feedback.message}
            </div>
          ) : null}
        </Panel>

        {loading ? (
          <Panel className="admin-content">
            <div className="admin-loading">
              <div className="admin-loading__spinner" />
              <div>
                <h2>Đang tải trung tâm quản trị</h2>
                <p>Hệ thống đang đồng bộ danh mục, sản phẩm, đơn hàng và tài khoản.</p>
              </div>
            </div>
          </Panel>
        ) : (
          renderActiveSection()
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
