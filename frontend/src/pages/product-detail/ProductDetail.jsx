import "./ProductDetail.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";
import CustomerReviewsSection from "./CustomerReviewsSection";
import {
  API_BASE_URL,
  fetchJson,
  formatCurrency,
  requestAuthJson,
  emitCartChanged,
  getStoredSessionUser,
} from "../../utils/storefront";

function getValidImages(images = []) {
  return images.filter(
    (img) => img && typeof img === "string" && !img.includes("placehold.co"),
  );
}

function SpecItem({ label, value }) {
  if (!value) return null;

  return (
    <div className="pd-spec">
      <div className="pd-spec__label">{label}</div>
      <div className="pd-spec__value">{value}</div>
    </div>
  );
}

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartFeedback, setCartFeedback] = useState({ type: "", message: "" });
  const sessionUser = getStoredSessionUser();

  async function handleAddToCart() {
    if (!product || addingToCart) return;

    try {
      setAddingToCart(true);
      setCartFeedback({ type: "", message: "" });
      await requestAuthJson(`${API_BASE_URL}/api/shop/cart/items`, {
        method: "POST",
        body: { productId: product._id, quantity },
      });
      emitCartChanged();
      setCartFeedback({
        type: "success",
        message: `Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`,
      });
      setQuantity(1);
    } catch (err) {
      setCartFeedback({
        type: "error",
        message: err.message || "Không thể thêm vào giỏ hàng.",
      });
    } finally {
      setAddingToCart(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJson(`${API_BASE_URL}/api/home/products/${slug}`);

        if (isMounted) {
          setProduct(data.product || null);
          setActiveImageIndex(0);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Không thể tải chi tiết sản phẩm.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const validImages = product ? getValidImages(product.images) : [];
  const activeImage = validImages[activeImageIndex] || "";
  const dimensions = product?.dimensions || {};
  const DIMENSION_TEXT =
    dimensions.length || dimensions.width || dimensions.height
      ? `${dimensions.length || 0} × ${dimensions.width || 0} × ${dimensions.height || 0} ${dimensions.unit || "cm"}`
      : "";

  const HAS_DISCOUNT =
    product?.compareAtPrice && product.compareAtPrice > product.price;
  const DISCOUNT_PERCENT = HAS_DISCOUNT
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <main className="pd-page">
      <section className="pd-container">
        <StoreHeader />

        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#8c6a4c]">
          <Link className="no-underline transition hover:text-[#2f241f]" to="/">
            Trang chủ
          </Link>
          {product?.category?.slug ? (
            <>
              <span>/</span>
              <Link
                className="no-underline transition hover:text-[#2f241f]"
                to={`/danh-muc/${product.category.slug}`}
              >
                {product.category.name}
              </Link>
            </>
          ) : null}
          {product?.name ? <span>/</span> : null}
          {product?.name ? <span>{product.name}</span> : null}
        </div>

        {/* States */}
        {loading ? (
          <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
            Đang tải chi tiết sản phẩm...
          </div>
        ) : error ? (
          <div className="pd-error">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
            <Link
              to="/san-pham"
              style={{
                padding: "0.6rem 1.5rem",
                borderRadius: "999px",
                background: "#2f241f",
                color: "#fff8f0",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              Quay lại danh sách
            </Link>
          </div>
        ) : product ? (
          <>
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[28px] border border-[rgba(95,63,42,0.1)] bg-white/75">
                <div className="aspect-[4/3] overflow-hidden">
                  {activeImage ? (
                    <img
                      className="block h-full w-full object-cover"
                      src={activeImage}
                      alt={product.name}
                    />
                  ) : (
                    <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,rgba(164,116,78,0.28),rgba(245,222,194,0.7))] p-6">
                      <span className="rounded-full bg-white/75 px-3 py-2 text-sm font-bold">
                        {product.category?.name || "Sản phẩm"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-5">
                <div>
                  <p className="text-xs tracking-[0.16em] text-[#8b6243] uppercase">
                    Chi tiết sản phẩm
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold md:text-5xl">
                    {product.name}
                  </h1>
                  <p className="mt-4 text-lg leading-8 text-[#5c4a40]">
                    {product.shortDescription || "Sản phẩm này chưa có mô tả ngắn."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <strong className="text-3xl">{formatCurrency(product.price)}</strong>
                  {product.compareAtPrice > product.price ? (
                    <span className="text-lg text-[#8b6243] line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-[#f3e5d7] px-4 py-2 text-sm font-semibold">
                    {product.quantityInStock > 0 ? "Còn hàng" : "Tạm hết hàng"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pd-purchase">
              <div className="pd-purchase__eyebrow">Mua hàng</div>
              <div className="pd-purchase__body">
                <div>
                  <div className="pd-purchase__stock">
                    {product.quantityInStock > 0
                      ? `Còn ${product.quantityInStock} sản phẩm trong kho`
                      : "Sản phẩm hiện đang tạm hết hàng"}
                  </div>

                  {cartFeedback.message && (
                    <p
                      className="pd-purchase__feedback"
                      style={{
                        color: cartFeedback.type === "success" ? "#2f7f41" : "#91412a",
                        background: cartFeedback.type === "success"
                          ? "rgba(50, 135, 72, 0.08)"
                          : "rgba(176, 61, 40, 0.06)",
                        borderRadius: "12px",
                        padding: "0.65rem 1rem",
                        margin: "0.75rem 0 0",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                      }}
                    >
                      {cartFeedback.message}
                    </p>
                  )}
                </div>

                {sessionUser ? (
                  <div className="pd-purchase__actions">
                    {product.quantityInStock > 0 && (
                      <>
                        <div className="pd-purchase__qty">
                          <button
                            type="button"
                            className="pd-purchase__qty-btn"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={addingToCart || quantity <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            className="pd-purchase__qty-input"
                            min="1"
                            max={product.quantityInStock}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(
                                Math.max(1, Math.min(product.quantityInStock, Number(e.target.value) || 1))
                              )
                            }
                            disabled={addingToCart}
                          />
                          <button
                            type="button"
                            className="pd-purchase__qty-btn"
                            onClick={() =>
                              setQuantity((q) => Math.min(product.quantityInStock, q + 1))
                            }
                            disabled={addingToCart || quantity >= product.quantityInStock}
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          className="pd-purchase__primary"
                          onClick={handleAddToCart}
                          disabled={addingToCart}
                        >
                          {addingToCart ? (
                            <>
                              <span className="pd-purchase__spinner" />
                              Đang thêm...
                            </>
                          ) : (
                            <>
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                              </svg>
                              Thêm vào giỏ hàng
                            </>
                          )}
                        </button>
                      </>
                    )}
                    <Link className="pd-purchase__secondary" to="/gio-hang">
                      Xem giỏ hàng
                    </Link>
                  </div>
                ) : (
                  <div className="pd-purchase__actions">
                    <Link className="pd-purchase__primary" to="/login">
                      Đăng nhập để mua hàng
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <CustomerReviewsSection product={product} heroImage={activeImage} />

            <div className="mt-8 grid gap-5">
              <div className="rounded-[28px] border border-[rgba(95,63,42,0.1)] bg-white/70 p-5">
                <h2 className="text-2xl font-semibold">Mô tả chi tiết</h2>
                <p className="mt-4 leading-8 text-[#5c4a40]">
                  {product.description || "Sản phẩm này chưa có mô tả chi tiết."}
                </p>
              </div>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="pd-tags">
                  {product.tags.map((tag) => (
                    <span key={tag} className="pd-tag">
                      <svg className="pd-tag__icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default ProductDetail;
