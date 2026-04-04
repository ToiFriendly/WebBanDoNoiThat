import "./Cart.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";
import {
  API_BASE_URL,
  emitCartChanged,
  fetchJson,
  formatCurrency,
  formatDateTime,
  getDisplayImage,
  getStoredSessionUser,
  requestAuthJson,
} from "../../utils/storefront";

function buildInitialShippingForm() {
  const sessionUser = getStoredSessionUser();
  const defaultAddress =
    sessionUser?.addresses?.find((address) => address.isDefault) ||
    sessionUser?.addresses?.[0] ||
    {};

  return {
    fullName: defaultAddress.fullName || sessionUser?.fullName || "",
    phone: defaultAddress.phone || sessionUser?.phone || "",
    street: defaultAddress.street || "",
    ward: defaultAddress.ward || "",
    district: defaultAddress.district || "",
    city: defaultAddress.city || "",
    country: defaultAddress.country || "Viet Nam",
  };
}

function emptyCart() {
  return {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    updatedAt: null,
  };
}

function buildSimilarProducts(products, cartItems) {
  if (!Array.isArray(products) || !products.length) {
    return [];
  }

  const cartProductIds = new Set(
    cartItems.map((item) => item.product?._id).filter(Boolean),
  );
  const filteredProducts = products.filter(
    (product) => !cartProductIds.has(product._id),
  );

  return (filteredProducts.length ? filteredProducts : products).slice(0, 4);
}

function Cart() {
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [cart, setCart] = useState(emptyCart());
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingForm, setShippingForm] = useState(() => buildInitialShippingForm());
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [note, setNote] = useState("");
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    async function loadCart() {
      const nextSessionUser = getStoredSessionUser();
      setSessionUser(nextSessionUser);

      if (!nextSessionUser) {
        setCart(emptyCart());
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await requestAuthJson(`${API_BASE_URL}/api/shop/cart`);
        setCart(data?.cart || emptyCart());
      } catch (cartError) {
        setFeedback(cartError.message || "Không thể tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    }

    loadCart();

    window.addEventListener("auth-session-changed", loadCart);
    window.addEventListener("cart-changed", loadCart);

    return () => {
      window.removeEventListener("auth-session-changed", loadCart);
      window.removeEventListener("cart-changed", loadCart);
    };
  }, []);

  useEffect(() => {
    setShippingForm(buildInitialShippingForm());
  }, [sessionUser?._id]);

  useEffect(() => {
    let isMounted = true;

    async function loadCatalogProducts() {
      try {
        const data = await fetchJson(`${API_BASE_URL}/api/home/products?limit=8`);

        if (isMounted) {
          setCatalogProducts(Array.isArray(data?.products) ? data.products : []);
        }
      } catch {
        if (isMounted) {
          setCatalogProducts([]);
        }
      }
    }

    loadCatalogProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSimilarProducts(buildSimilarProducts(catalogProducts, cart.items));
  }, [catalogProducts, cart.items]);

  function updateShippingField(field, value) {
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  }

  async function updateQuantity(productId, quantity) {
    try {
      setActionLoadingKey(productId);
      setFeedback("");
      const data = await requestAuthJson(
        `${API_BASE_URL}/api/shop/cart/items/${productId}`,
        { method: "PATCH", body: { quantity } },
      );
      setCart(data?.cart || emptyCart());
      emitCartChanged();
    } catch (cartError) {
      setFeedback(cartError.message || "Không thể cập nhật giỏ hàng.");
    } finally {
      setActionLoadingKey("");
    }
  }

  async function removeItem(productId) {
    try {
      setActionLoadingKey(productId);
      setFeedback("");
      const data = await requestAuthJson(
        `${API_BASE_URL}/api/shop/cart/items/${productId}`,
        { method: "DELETE" },
      );
      setCart(data?.cart || emptyCart());
      emitCartChanged();
    } catch (cartError) {
      setFeedback(cartError.message || "Không thể xóa sản phẩm.");
    } finally {
      setActionLoadingKey("");
    }
  }

  async function clearCartItems() {
    try {
      setActionLoadingKey("clear-cart");
      setFeedback("");
      const data = await requestAuthJson(`${API_BASE_URL}/api/shop/cart`, {
        method: "DELETE",
      });
      setCart(data?.cart || emptyCart());
      emitCartChanged();
    } catch (cartError) {
      setFeedback(cartError.message || "Không thể làm trống giỏ hàng.");
    } finally {
      setActionLoadingKey("");
    }
  }

  async function handleCheckout(event) {
    event.preventDefault();

    try {
      setCheckoutLoading(true);
      setFeedback("");
      setLastOrder(null);

      const data = await requestAuthJson(`${API_BASE_URL}/api/shop/checkout`, {
        method: "POST",
        body: { shippingAddress: shippingForm, paymentMethod, note },
      });

      setLastOrder(data?.order || null);
      setCart(emptyCart());
      emitCartChanged();

      if (data?.payment?.payUrl) {
        window.location.assign(data.payment.payUrl);
        return;
      }

      setFeedback(
        data?.message ||
          `Đặt hàng thành công. Mã đơn của bạn là ${data?.order?.orderCode}.`,
      );
    } catch (checkoutError) {
      setFeedback(checkoutError.message || "Không thể đặt hàng lúc này.");

      try {
        const latestCart = await requestAuthJson(`${API_BASE_URL}/api/shop/cart`);
        setCart(latestCart?.cart || emptyCart());
        emitCartChanged();
      } catch {
        // Keep existing UI state if cart reload also fails
      }
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="cart-page">
      <section className="cart-container">
        <StoreHeader />
        {!sessionUser ? (
          <div className="cart-login-prompt">
            <div className="cart-login-prompt__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="cart-login-prompt__title">Giỏ hàng của bạn</h1>
            <p className="cart-login-prompt__desc">
              Bạn cần đăng nhập để lưu giỏ hàng và đặt hàng.
            </p>
            <Link to="/login" className="cart-login-prompt__btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <div className="cart-header__copy">
                <h1 className="cart-header__title">Giỏ hàng</h1>
                {cart.items.length > 0 ? (
                  <p className="cart-header__subtitle">
                    {cart.totalQuantity} sản phẩm đang chờ bạn xác nhận đơn hàng.
                  </p>
                ) : null}
              </div>

              {cart.items.length ? (
                <button
                  type="button"
                  className="cart-header__clear"
                  onClick={clearCartItems}
                  disabled={
                    !cart.items.length ||
                    actionLoadingKey === "clear-cart" ||
                    checkoutLoading
                  }
                >
                  {actionLoadingKey === "clear-cart" ? "Đang xóa..." : "Xóa tất cả"}
                </button>
              ) : null}
            </div>

            {feedback ? <div className="cart-feedback">{feedback}</div> : null}

            {loading ? (
              <div className="cart-loading">
                <div className="cart-loading__spinner" />
                <p>Đang tải giỏ hàng...</p>
              </div>
            ) : (
              <section className="cart-board">
                <div className="cart-layout">
                  <div className="cart-items-panel">
                    {cart.items.length ? (
                      <>
                        <div className="cart-items">
                          {cart.items.map((item) => {
                            const image = getDisplayImage(item.product?.images);
                            const isBusy =
                              actionLoadingKey === item.product._id || checkoutLoading;

                            return (
                              <article key={item.product._id} className="cart-item">
                                <Link
                                  className="cart-item__image-link"
                                  to={`/san-pham/${item.product.slug}`}
                                >
                                  <div className="cart-item__img-wrap">
                                    {image ? (
                                      <img
                                        className="cart-item__img"
                                        src={image}
                                        alt={item.product.name}
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="cart-item__img-placeholder">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                          <circle cx="8.5" cy="8.5" r="1.5" />
                                          <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                </Link>

                                <div className="cart-item__content">
                                  <div className="cart-item__top">
                                    <div className="cart-item__copy">
                                      <Link className="cart-item__name" to={`/san-pham/${item.product.slug}`}>
                                        {item.product.name}
                                      </Link>
                                      <div className="cart-item__stock">
                                        Tồn kho hiện tại: {item.product.quantityInStock}
                                      </div>
                                    </div>

                                    <div className="cart-item__price-box">
                                      <span className="cart-item__price-label">Đơn giá</span>
                                      <strong className="cart-item__price-value">
                                        {formatCurrency(item.unitPrice)}
                                      </strong>
                                    </div>
                                  </div>

                                  <div className="cart-item__bottom">
                                    <div className="cart-item__qty">
                                      <button
                                        type="button"
                                        className="cart-item__qty-btn"
                                        onClick={() =>
                                          updateQuantity(
                                            item.product._id,
                                            Math.max(1, item.quantity - 1),
                                          )
                                        }
                                        disabled={isBusy}
                                      >
                                        −
                                      </button>
                                      <input
                                        className="cart-item__qty-input"
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(event) =>
                                          updateQuantity(
                                            item.product._id,
                                            Math.max(1, Number(event.target.value) || 1),
                                          )
                                        }
                                        disabled={isBusy}
                                      />
                                      <button
                                        type="button"
                                        className="cart-item__qty-btn"
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        disabled={isBusy}
                                      >
                                        +
                                      </button>
                                    </div>

                                    <div className="cart-item__actions">
                                      <strong className="cart-item__line-total">
                                        {formatCurrency(item.lineTotal)}
                                      </strong>
                                      <button
                                        type="button"
                                        className="cart-item__remove"
                                        onClick={() => removeItem(item.product._id)}
                                        disabled={isBusy}
                                      >
                                        Xóa
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>

                        <Link to="/san-pham" className="cart-continue-link">
                          Tiếp tục mua sắm
                        </Link>
                      </>
                    ) : (
                      <div className="cart-empty">
                        <div className="cart-empty__icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        </div>
                        <p>Giỏ hàng đang trống. Hãy khám phá sản phẩm để thêm vào giỏ.</p>
                        <Link to="/san-pham" className="cart-empty__link">
                          Xem sản phẩm
                        </Link>
                      </div>
                    )}
                  </div>

                  <aside className="cart-checkout">
                    <div className="cart-checkout__eyebrow">Thanh toán</div>
                    <h2 className="cart-checkout__title">Tóm tắt đơn hàng</h2>

                    <div className="cart-summary">
                      <div className="cart-summary__row">
                        <span>Tổng số lượng</span>
                        <strong>{cart.totalQuantity}</strong>
                      </div>
                      <div className="cart-summary__row">
                        <span>Tạm tính</span>
                        <strong>{formatCurrency(cart.totalAmount)}</strong>
                      </div>
                      <div className="cart-summary__row">
                        <span>Phí vận chuyển</span>
                        <strong>{formatCurrency(0)}</strong>
                      </div>
                      <div className="cart-summary__row">
                        <span>Giảm giá</span>
                        <strong>{formatCurrency(0)}</strong>
                      </div>
                      <div className="cart-summary__divider" />
                      <div className="cart-summary__row cart-summary__total">
                        <span>Thanh toán</span>
                        <strong>{formatCurrency(cart.totalAmount)}</strong>
                      </div>
                    </div>

                  <form className="cart-form" onSubmit={handleCheckout}>
                    <div className="cart-form__group">
                      <label className="cart-form__label" htmlFor="cart-fullname">Họ và tên</label>
                      <input
                        id="cart-fullname"
                        className="cart-form__input"
                        value={shippingForm.fullName}
                        onChange={(event) => updateShippingField("fullName", event.target.value)}
                        required
                      />
                    </div>

                    <div className="cart-form__group">
                      <label className="cart-form__label" htmlFor="cart-phone">Số điện thoại</label>
                      <input
                        id="cart-phone"
                        className="cart-form__input"
                        value={shippingForm.phone}
                        onChange={(event) => updateShippingField("phone", event.target.value)}
                        required
                      />
                    </div>

                    <div className="cart-form__group">
                      <label className="cart-form__label" htmlFor="cart-street">Địa chỉ</label>
                      <input
                        id="cart-street"
                        className="cart-form__input"
                        value={shippingForm.street}
                        onChange={(event) => updateShippingField("street", event.target.value)}
                        required
                      />
                    </div>

                    <div className="cart-form__row">
                      <div className="cart-form__group">
                        <label className="cart-form__label" htmlFor="cart-ward">Phường / Xã</label>
                        <input
                          id="cart-ward"
                          className="cart-form__input"
                          value={shippingForm.ward}
                          onChange={(event) => updateShippingField("ward", event.target.value)}
                        />
                      </div>
                      <div className="cart-form__group">
                        <label className="cart-form__label" htmlFor="cart-district">Quận / Huyện</label>
                        <input
                          id="cart-district"
                          className="cart-form__input"
                          value={shippingForm.district}
                          onChange={(event) => updateShippingField("district", event.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="cart-form__row">
                      <div className="cart-form__group">
                        <label className="cart-form__label" htmlFor="cart-city">Tỉnh / Thành phố</label>
                        <input
                          id="cart-city"
                          className="cart-form__input"
                          value={shippingForm.city}
                          onChange={(event) => updateShippingField("city", event.target.value)}
                          required
                        />
                      </div>
                      <div className="cart-form__group">
                        <label className="cart-form__label" htmlFor="cart-country">Quốc gia</label>
                        <input
                          id="cart-country"
                          className="cart-form__input"
                          value={shippingForm.country}
                          onChange={(event) => updateShippingField("country", event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cart-form__group">
                      <label className="cart-form__label" htmlFor="cart-note">Ghi chú</label>
                      <textarea
                        id="cart-note"
                        className="cart-form__textarea"
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        placeholder="Ví dụ: gọi trước khi giao hàng..."
                      />
                    </div>

                    <div className="cart-payment">
                      <label
                        className={`cart-payment__option ${paymentMethod === "momo" ? "cart-payment__option--active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="momo"
                          checked={paymentMethod === "momo"}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <span className="cart-payment__option-label">
                          Thanh toán bằng MoMo
                        </span>
                      </label>
                      <label
                        className={`cart-payment__option ${paymentMethod === "cod" ? "cart-payment__option--active" : ""}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === "cod"}
                          onChange={(event) => setPaymentMethod(event.target.value)}
                        />
                        <span className="cart-payment__option-label">
                          Thanh toán khi nhận hàng
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="cart-submit"
                      disabled={checkoutLoading || !cart.items.length}
                    >
                      {checkoutLoading ? (
                        <>
                          <span className="cart-submit__spinner" />
                          Đang tạo đơn hàng...
                        </>
                      ) : paymentMethod === "momo" ? (
                        "Đặt hàng và đến MoMo"
                      ) : (
                        "Đặt hàng"
                      )}
                    </button>
                  </form>

                  <p className="cart-hint">
                    Đơn hàng sẽ được xử lý ngay sau khi bạn xác nhận.
                  </p>
                  </aside>
                </div>
              </section>
            )}

            {lastOrder && (
              <div className="cart-last-order">
                <span className="cart-last-order__badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Đặt hàng thành công
                </span>
                <div className="cart-last-order__code">{lastOrder.orderCode}</div>
                <div className="cart-last-order__date">
                  Đặt lúc {formatDateTime(lastOrder.placedAt)}
                </div>
              </div>
            )}

            <section className="cart-similar">
              <h2 className="cart-similar__title">Những sản phẩm tương tự</h2>

              {similarProducts.length ? (
                <div className="cart-similar__grid">
                  {similarProducts.map((product) => {
                    const image = getDisplayImage(product.images);

                    return (
                      <Link
                        key={product._id}
                        className="cart-similar__card"
                        to={`/san-pham/${product.slug}`}
                      >
                        <div className="cart-similar__image-wrap">
                          {image ? (
                            <img
                              className="cart-similar__image"
                              src={image}
                              alt={product.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="cart-similar__placeholder">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="cart-similar__meta">
                          {(product.category?.name || "Sản phẩm").toUpperCase()}
                        </div>
                        <h3 className="cart-similar__name">{product.name}</h3>
                        <strong className="cart-similar__price">
                          {formatCurrency(product.price)}
                        </strong>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="cart-similar__empty">
                  Chưa có gợi ý phù hợp để hiển thị.
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default Cart;
