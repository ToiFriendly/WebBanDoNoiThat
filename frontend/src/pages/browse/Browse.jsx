import "./Browse.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";
import { API_BASE_URL, fetchJson } from "../../utils/storefront";

function CategoryCard({ category }) {
  const hasRealImage =
    category.image &&
    typeof category.image === "string" &&
    !category.image.includes("placehold.co");

  return (
    <Link className="category-card" to={`/danh-muc/${category.slug}`}>
      <div className="category-card__image-wrap">
        {hasRealImage ? (
          <img
            className="category-card__image"
            src={category.image}
            alt={category.name}
            loading="lazy"
          />
        ) : (
          <div className="category-card__placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        <span className="category-card__count-badge">
          {category.productCount} sản phẩm
        </span>
        {category.parentCategory?.name && (
          <span className="category-card__parent-badge">
            {category.parentCategory.name}
          </span>
        )}
      </div>

      <div className="category-card__body">
        <h2 className="category-card__name">{category.name}</h2>
        {category.description && (
          <p className="category-card__desc">{category.description}</p>
        )}
        <div className="category-card__footer">
          <span className="category-card__product-count">
            {category.productCount} sản phẩm
          </span>
          <span className="category-card__cta">
            Xem danh mục
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

function Browse() {
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchJson(`${API_BASE_URL}/api/home/categories`);

        if (isMounted) {
          setCategories(Array.isArray(data.categories) ? data.categories : []);
          setTotalCategories(Number(data.totalCategories) || 0);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Không thể tải danh mục.");
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearchQuery("");
  }

  const filteredCategories = searchQuery
    ? categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (cat.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : categories;

  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.productCount || 0),
    0
  );

  return (
    <main className="browse-page">
      <section className="browse-page__container">
        <StoreHeader />

        {/* Breadcrumb */}
        <nav className="browse-page__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span>Danh mục</span>
        </nav>

        {/* Hero Section */}
        <div className="browse-page__hero">
          <div className="browse-page__hero-content">
            <span className="browse-page__hero-eyebrow">
              Khám phá bộ sưu tập
            </span>
            <h1 className="browse-page__hero-title">
              Tất cả danh mục sản phẩm
            </h1>
            <p className="browse-page__hero-desc">
              Duyệt qua các danh mục để tìm nội thất phù hợp với không gian
              sống của bạn. Mỗi danh mục được chọn lọc kỹ lưỡng với đa dạng
              sản phẩm chất lượng.
            </p>

            <div className="browse-page__hero-stats">
              <div className="browse-page__hero-stat">
                <strong>{loading ? "—" : totalCategories}</strong>
                <span>danh mục</span>
              </div>
              <div className="browse-page__hero-stat">
                <strong>{loading ? "—" : totalProducts}</strong>
                <span>sản phẩm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="browse-page__search">
          <form className="browse-page__search-form" onSubmit={handleSearchSubmit}>
            <div className="browse-page__search-input-wrap">
              <svg
                className="browse-page__search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="search-categories"
                className="browse-page__search-input"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Tìm kiếm danh mục theo tên..."
              />
              {searchInput.trim() && (
                <button
                  type="button"
                  className="browse-page__search-clear"
                  onClick={handleClearSearch}
                  aria-label="Xóa tìm kiếm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className="browse-page__search-btn">
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Tìm kiếm
            </button>
          </form>

          {searchQuery && (
            <div className="browse-page__search-tag">
              <span>
                Từ khóa: <strong>{searchQuery}</strong>
              </span>
              <button
                type="button"
                className="browse-page__search-tag-btn"
                onClick={handleClearSearch}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Category Grid */}
        {loading ? (
          <div className="browse-page__loading">
            <div className="browse-page__spinner" />
            <p>Đang tải danh mục...</p>
          </div>
        ) : error ? (
          <div className="browse-page__error">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
          </div>
        ) : filteredCategories.length ? (
          <div className="browse-page__grid">
            {filteredCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="browse-page__empty">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            <p>
              Không tìm thấy danh mục phù hợp với từ khóa "
              <strong>{searchQuery}</strong>"
            </p>
            <button
              type="button"
              className="browse-page__empty-link"
              onClick={handleClearSearch}
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="browse-page__empty">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <p>Hiện chưa có danh mục nào để hiển thị.</p>
            <Link to="/" className="browse-page__empty-link">
              Về trang chủ
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

export default Browse;
