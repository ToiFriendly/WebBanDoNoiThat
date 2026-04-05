import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductThumbnail from "../../components/ProductThumbnail";
import StoreHeader from "../../components/StoreHeader";
import {
  API_BASE_URL,
  emitCartChanged,
  formatCurrency,
  formatDateTime,
  getDisplayImage,
  getFirstDisplayImage,
  getStoredSessionUser,
  requestAuthJson,
} from "../../utils/storefront";

function buildInitialShippingForm(user = getStoredSessionUser()) {
  const defaultAddress =
    user?.addresses?.find((address) => address.isDefault) ||
    user?.addresses?.[0] ||
    {};

  return {
    fullName: defaultAddress.fullName || user?.fullName || "",
    phone: defaultAddress.phone || user?.phone || "",
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

function inputClassName() {
  return "w-full rounded-2xl border border-[#d8c4ae] bg-white/85 px-4 py-3 text-[#2f241f] outline-none transition focus:border-[#8c5f3f] focus:shadow-[0_0_0_4px_rgba(140,95,63,0.12)]";
}

function SimilarProductCard({ product }) {
  const image = getDisplayImage(product.images);

  return (
    <Link
      className="group overflow-hidden rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 no-underline transition hover:-translate-y-1"
      to={`/san-pham/${product.slug}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,246,234,0.92),rgba(236,215,190,0.75))] p-3">
        {image ? (
          <img
            className="block h-full w-full rounded-2xl object-contain transition duration-300 group-hover:scale-[1.03]"
            src={image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-end rounded-2xl bg-[linear-gradient(135deg,rgba(164,116,78,0.28),rgba(245,222,194,0.7))] p-4">
            <span className="rounded-full bg-white/75 px-3 py-2 text-sm font-bold">
              {product.category?.name || "San pham"}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs tracking-[0.08em] text-[#8b6243] uppercase">
          {product.category?.name || "San pham"}
        </p>
        <h3 className="mt-2 text-base leading-6 font-semibold text-[#2f241f]">
          {product.name}
        </h3>
        <p className="mt-3 font-bold text-[#2f241f]">
          {formatCurrency(product.price)}
        </p>
      </div>
    </Link>
  );
}

function Cart() {
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [cart, setCart] = useState(emptyCart());
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [actionLoadingKey, setActionLoadingKey] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingForm, setShippingForm] = useState(() =>
    buildInitialShippingForm(),
  );
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [note, setNote] = useState("");
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    async function loadCart() {
      const nextSessionUser = getStoredSessionUser();
      setSessionUser(nextSessionUser);

      if (!nextSessionUser) {
        setCart(emptyCart());
        setSimilarProducts([]);
        setLoading(false);
        setSimilarLoading(false);
        return;
      }

      try {
        setLoading(true);
        setSimilarLoading(true);

        const [cartResult, recommendResult] = await Promise.allSettled([
          requestAuthJson(`${API_BASE_URL}/api/shop/cart`),
          requestAuthJson(
            `${API_BASE_URL}/api/shop/recommendations/similar?limit=8`,
          ),
        ]);

        if (cartResult.status === "fulfilled") {
          setCart(cartResult.value?.cart || emptyCart());
        } else {
          throw cartResult.reason;
        }

        if (recommendResult.status === "fulfilled") {
          setSimilarProducts(
            Array.isArray(recommendResult.value?.products)
              ? recommendResult.value.products
              : [],
          );
        } else {
          setSimilarProducts([]);
        }
      } catch (cartError) {
        setFeedback(cartError.message || "Khong the tai gio hang.");
      } finally {
        setLoading(false);
        setSimilarLoading(false);
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

  function updateShippingField(field, value) {
    setShippingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function updateQuantity(productId, quantity) {
    try {
      setActionLoadingKey(productId);
      setFeedback("");

      const data = await requestAuthJson(
        `${API_BASE_URL}/api/shop/cart/items/${productId}`,
        {
          method: "PATCH",
          body: { quantity },
        },
      );

      setCart(data?.cart || emptyCart());
      emitCartChanged();
    } catch (cartError) {
      setFeedback(cartError.message || "Khong the cap nhat gio hang.");
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
      setFeedback(cartError.message || "Khong the xoa san pham.");
    } finally {
      setActionLoadingKey("");
    }
  }

  async function handleCheckout(event) {
    event.preventDefault();

    if (!cart.items.length) {
      return;
    }

    try {
      setCheckoutLoading(true);
      setFeedback("");
      setLastOrder(null);

      const data = await requestAuthJson(`${API_BASE_URL}/api/shop/checkout`, {
        method: "POST",
        body: {
          shippingAddress: shippingForm,
          paymentMethod,
          note,
        },
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
          `Dat hang thanh cong. Ma don cua ban la ${data?.order?.orderCode}.`,
      );
    } catch (checkoutError) {
      setFeedback(checkoutError.message || "Khong the dat hang luc nay.");

      try {
        const latestCart = await requestAuthJson(`${API_BASE_URL}/api/shop/cart`);
        setCart(latestCart?.cart || emptyCart());
        emitCartChanged();
      } catch {
        // Keep the current UI state if cart reload also fails.
      }
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,192,106,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(161,98,7,0.1),transparent_28%),linear-gradient(135deg,#f6efe4_0%,#efe4d3_40%,#f9f5ee_100%)] px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      <section className="mx-auto w-full max-w-[1180px] rounded-[32px] border border-[rgba(95,63,42,0.12)] bg-[rgba(255,251,245,0.82)] p-5 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-6">
        <StoreHeader />

        {!sessionUser ? (
          <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
            <h1 className="text-3xl font-semibold">Gio hang cua ban</h1>
            <p className="mt-4 leading-7 text-[#5c4a40]">
              Ban can dang nhap de luu gio hang va dat hang.
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
              <h1 className="text-4xl font-semibold md:text-5xl">
                {"Gi\u1ecf h\u00e0ng"}
              </h1>
            </div>

            {feedback ? (
              <div className="mb-6 rounded-2xl bg-[#f5ebde] px-4 py-3 text-[#734d36]">
                {feedback}
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
                Dang tai gio hang...
              </div>
            ) : (
              <div className="rounded-[30px] border border-[rgba(95,63,42,0.1)] bg-white/55 p-4 shadow-[0_18px_40px_rgba(79,52,35,0.06)] md:p-6">
                {cart.items.length ? (
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="grid content-start gap-4">
                      {cart.items.map((item) => {
                        const image = getFirstDisplayImage(item.product?.images);
                        const isBusy =
                          actionLoadingKey === item.product._id || checkoutLoading;

                        return (
                          <article
                            key={item.product._id}
                            className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-4 rounded-[28px] border border-[rgba(95,63,42,0.1)] bg-white/78 p-4 md:grid-cols-[120px_1fr]"
                          >
                            <ProductThumbnail
                              size="cart"
                              src={image}
                              alt={item.product.name}
                              frameClassName="mx-auto md:mx-0"
                              placeholderLabel="San pham"
                            />

                            <div className="flex min-w-0 flex-col gap-4">
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                  <Link
                                    className="text-xl font-semibold text-[#2f241f] no-underline"
                                    to={`/san-pham/${item.product.slug}`}
                                  >
                                    {item.product.name}
                                  </Link>
                                  <div className="mt-2 text-sm text-[#6a564b]">
                                    Ton kho hien tai: {item.product.quantityInStock}
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-sm text-[#8b6243]">
                                    Don gia
                                  </div>
                                  <strong className="text-lg">
                                    {formatCurrency(item.unitPrice)}
                                  </strong>
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-3">
                                  <button
                                    type="button"
                                    className="rounded-full border border-[rgba(95,63,42,0.14)] bg-white/80 px-4 py-2"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product._id,
                                        Math.max(1, item.quantity - 1),
                                      )
                                    }
                                    disabled={isBusy}
                                  >
                                    -
                                  </button>
                                  <input
                                    className="w-24 rounded-full border border-[rgba(95,63,42,0.14)] bg-white/80 px-4 py-2 text-center outline-none"
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(event) =>
                                      updateQuantity(
                                        item.product._id,
                                        Math.max(
                                          1,
                                          Number(event.target.value) || 1,
                                        ),
                                      )
                                    }
                                    disabled={isBusy}
                                  />
                                  <button
                                    type="button"
                                    className="rounded-full border border-[rgba(95,63,42,0.14)] bg-white/80 px-4 py-2"
                                    onClick={() =>
                                      updateQuantity(
                                        item.product._id,
                                        item.quantity + 1,
                                      )
                                    }
                                    disabled={isBusy}
                                  >
                                    +
                                  </button>
                                </div>

                                <div className="flex items-center gap-3">
                                  <strong className="text-lg">
                                    {formatCurrency(item.lineTotal)}
                                  </strong>
                                  <button
                                    type="button"
                                    className="rounded-full bg-[#f3e5d7] px-4 py-2 font-semibold text-[#5a4336] disabled:cursor-not-allowed disabled:opacity-60"
                                    onClick={() => removeItem(item.product._id)}
                                    disabled={isBusy}
                                  >
                                    Xoa
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}

                      <Link
                        className="text-sm font-semibold text-[#8c5f3f] no-underline"
                        to="/"
                      >
                        Tiep tuc mua sam
                      </Link>
                    </div>

                    <aside className="grid content-start gap-5 lg:border-l lg:border-[rgba(95,63,42,0.1)] lg:pl-6">
                      <div>
                        <p className="text-xs tracking-[0.16em] text-[#8b6243] uppercase">
                          Thanh toan
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold">
                          Tom tat don hang
                        </h2>
                      </div>

                      <div className="rounded-[28px] bg-[#fff8f0] p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span>Tong so luong</span>
                          <strong>{cart.totalQuantity}</strong>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span>Tam tinh</span>
                          <strong>{formatCurrency(cart.totalAmount)}</strong>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span>Phi van chuyen</span>
                          <strong>{formatCurrency(0)}</strong>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span>Giam gia</span>
                          <strong>{formatCurrency(0)}</strong>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[rgba(95,63,42,0.1)] pt-4 text-lg">
                          <span>Thanh toan</span>
                          <strong className="text-[#c86c2f]">
                            {formatCurrency(cart.totalAmount)}
                          </strong>
                        </div>
                      </div>

                      <form className="grid gap-4" onSubmit={handleCheckout}>
                        <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                          Ho va ten
                          <input
                            className={inputClassName()}
                            value={shippingForm.fullName}
                            onChange={(event) =>
                              updateShippingField("fullName", event.target.value)
                            }
                            required
                          />
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                          So dien thoai
                          <input
                            className={inputClassName()}
                            value={shippingForm.phone}
                            onChange={(event) =>
                              updateShippingField("phone", event.target.value)
                            }
                            required
                          />
                        </label>

                        <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                          Dia chi
                          <input
                            className={inputClassName()}
                            value={shippingForm.street}
                            onChange={(event) =>
                              updateShippingField("street", event.target.value)
                            }
                            required
                          />
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                            Phuong / Xa
                            <input
                              className={inputClassName()}
                              value={shippingForm.ward}
                              onChange={(event) =>
                                updateShippingField("ward", event.target.value)
                              }
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                            Quan / Huyen
                            <input
                              className={inputClassName()}
                              value={shippingForm.district}
                              onChange={(event) =>
                                updateShippingField("district", event.target.value)
                              }
                              required
                            />
                          </label>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                            Tinh / Thanh pho
                            <input
                              className={inputClassName()}
                              value={shippingForm.city}
                              onChange={(event) =>
                                updateShippingField("city", event.target.value)
                              }
                              required
                            />
                          </label>
                          <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                            Quoc gia
                            <input
                              className={inputClassName()}
                              value={shippingForm.country}
                              onChange={(event) =>
                                updateShippingField("country", event.target.value)
                              }
                            />
                          </label>
                        </div>

                        <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
                          Ghi chu
                          <textarea
                            className={`${inputClassName()} min-h-24`}
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Vi du: goi truoc khi giao hang..."
                          />
                        </label>

                        <div className="grid gap-3 rounded-[28px] bg-[#fff8f0] p-4">
                          <label className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="momo"
                              checked={paymentMethod === "momo"}
                              onChange={(event) =>
                                setPaymentMethod(event.target.value)
                              }
                            />
                            <span>Thanh toan bang MoMo</span>
                          </label>
                          <label className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={paymentMethod === "cod"}
                              onChange={(event) =>
                                setPaymentMethod(event.target.value)
                              }
                            />
                            <span>Thanh toan khi nhan hang</span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8c5f3f,#d87b38)] px-5 font-bold text-[#fff8f0] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={checkoutLoading || !cart.items.length}
                        >
                          {checkoutLoading
                            ? "Dang tao don hang..."
                            : paymentMethod === "momo"
                              ? "Dat hang va den MoMo"
                              : "Dat hang"}
                        </button>
                      </form>
                    </aside>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
                    Gio hang dang trong. Hay quay lai trang san pham de them mon
                    hang.
                  </div>
                )}
              </div>
            )}

            {lastOrder ? (
              <div className="mt-6 rounded-[28px] border border-[rgba(95,63,42,0.1)] bg-white/75 p-5">
                <p className="text-xs tracking-[0.16em] text-[#8b6243] uppercase">
                  Don hang moi nhat
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {lastOrder.orderCode}
                </h2>
                <p className="mt-2 text-[#5c4a40]">
                  Dat luc {formatDateTime(lastOrder.placedAt)}.
                </p>
              </div>
            ) : null}

            <section className="mt-8 rounded-[30px] border border-[rgba(95,63,42,0.1)] bg-white/55 p-5 md:p-6">
              <h2 className="text-3xl font-semibold">Nhung san pham tuong tu</h2>

              {similarLoading ? (
                <div className="mt-4 rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-4 text-sm text-[#6a564b]">
                  Dang tai goi y san pham...
                </div>
              ) : similarProducts.length ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {similarProducts.map((product) => (
                    <SimilarProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-4 text-sm text-[#6a564b]">
                  Chua tim duoc san pham tuong tu tu du lieu hien tai.
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
