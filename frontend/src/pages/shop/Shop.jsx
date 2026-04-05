import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";
import {
  API_BASE_URL,
  formatCurrency,
  getDisplayImage,
} from "../../utils/storefront";

/* ─── Product Card ─── */
function ProductCard({ product }) {
  const image = getDisplayImage(product.images);

  return (
    <Link
      className="group overflow-hidden rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 no-underline transition hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(79,52,35,0.12)]"
      to={`/san-pham/${product.slug}`}
      id={`product-${product._id}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <img
            className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-end bg-[linear-gradient(135deg,rgba(164,116,78,0.28),rgba(245,222,194,0.7))] p-5">
            <span className="rounded-full bg-white/75 px-3 py-2 text-sm font-bold">
              {product.category?.name || "San pham"}
            </span>
          </div>
        )}
        {product.isFeatured && (
          <span className="absolute top-3 right-3 rounded-full bg-[#2f241f] px-3 py-1.5 text-xs font-bold text-[#fff8f0]">
            Noi bat
          </span>
        )}
        {product.compareAtPrice > product.price && (
          <span className="absolute top-3 left-3 rounded-full bg-[#c0392b] px-3 py-1.5 text-xs font-bold text-white">
            -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[0.84rem] tracking-[0.08em] text-[#8b6243] uppercase max-sm:flex-col max-sm:items-start">
          <span>{product.category?.name || "Chua phan loai"}</span>
          <span className={product.quantityInStock > 0 ? "text-[#27ae60]" : "text-[#c0392b]"}>
            {product.quantityInStock > 0 ? "Con hang" : "Het hang"}
          </span>
        </div>
        <h3 className="text-lg leading-snug font-semibold line-clamp-2">{product.name}</h3>
        {product.shortDescription && (
          <p className="mt-2 text-sm leading-6 text-[#655247] line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
          <div className="flex items-center gap-2">
            <strong className="text-lg">{formatCurrency(product.price)}</strong>
            {product.compareAtPrice > product.price && (
              <span className="text-sm text-[#999] line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span className="font-bold text-[#8b6243] transition group-hover:translate-x-1">
            Xem chi tiet →
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Search Input with Suggestions ─── */
function SearchBar({ value, onChange, onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/browse/suggestions?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  function handleInputChange(e) {
    const val = e.target.value;
    onChange(val);
    setShowSuggestions(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      onSearch();
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex overflow-hidden rounded-2xl border border-[rgba(95,63,42,0.15)] bg-white/80 shadow-[0_2px_12px_rgba(79,52,35,0.06)] transition focus-within:border-[rgba(95,63,42,0.3)] focus-within:shadow-[0_4px_20px_rgba(79,52,35,0.1)]">
        <div className="flex items-center pl-4 text-[#8b6243]">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </div>
        <input
          type="text"
          id="search-products"
          className="w-full border-none bg-transparent px-3 py-3.5 text-base outline-none placeholder:text-[#b09e90]"
          placeholder="Tim kiem san pham, chat lieu, phong cach..."
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.trim().length >= 2 && setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent px-3 text-[#b09e90] transition hover:text-[#2f241f]"
            onClick={() => {
              onChange("");
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            aria-label="Xoa tim kiem"
          >
            ✕
          </button>
        )}
        <button
          type="button"
          id="search-submit-btn"
          className="cursor-pointer border-none bg-[#2f241f] px-5 py-3 font-bold text-[#fff8f0] transition hover:bg-[#3f2a1f]"
          onClick={() => {
            setShowSuggestions(false);
            onSearch();
          }}
        >
          Tim kiem
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[rgba(95,63,42,0.12)] bg-white shadow-[0_12px_40px_rgba(79,52,35,0.15)]">
          {loadingSuggestions ? (
            <div className="px-5 py-4 text-sm text-[#8b6243]">Dang tim kiem...</div>
          ) : (
            suggestions.map((s) => (
              <Link
                key={s._id}
                to={`/san-pham/${s.slug}`}
                className="flex items-center gap-4 border-b border-[rgba(95,63,42,0.06)] px-5 py-3 no-underline transition last:border-b-0 hover:bg-[rgba(164,116,78,0.06)]"
                onClick={() => setShowSuggestions(false)}
              >
                {s.image ? (
                  <img
                    className="h-12 w-12 rounded-xl object-cover"
                    src={s.image}
                    alt={s.name}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-[linear-gradient(135deg,rgba(164,116,78,0.28),rgba(245,222,194,0.7))]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{s.name}</div>
                  <div className="mt-0.5 text-sm text-[#8b6243]">
                    {s.categoryName ? `${s.categoryName} · ` : ""}
                    {formatCurrency(s.price)}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Category Sidebar ─── */
function CategoryList({ categories, activeSlug, onSelect }) {
  return (
    <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-5">
      <h3 className="mb-4 text-xs tracking-[0.16em] text-[#8b6243] uppercase">
        Danh muc san pham
      </h3>
      <div className="grid gap-1">
        <button
          type="button"
          id="category-all"
          className={`cursor-pointer rounded-xl border-none px-4 py-2.5 text-left text-sm font-medium transition ${
            !activeSlug
              ? "bg-[#2f241f] text-[#fff8f0]"
              : "bg-transparent text-[#2f241f] hover:bg-[rgba(164,116,78,0.08)]"
          }`}
          onClick={() => onSelect("")}
        >
          Tat ca san pham
        </button>
        {categories.map((cat) => (
          <button
            type="button"
            key={cat._id}
            id={`category-${cat.slug}`}
            className={`cursor-pointer rounded-xl border-none px-4 py-2.5 text-left text-sm transition ${
              activeSlug === cat.slug
                ? "bg-[#2f241f] font-semibold text-[#fff8f0]"
                : "bg-transparent text-[#2f241f] hover:bg-[rgba(164,116,78,0.08)]"
            }`}
            onClick={() => onSelect(cat.slug)}
          >
            <span className="flex items-center justify-between gap-2">
              <span>{cat.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                activeSlug === cat.slug
                  ? "bg-[rgba(255,255,255,0.2)] text-[#fff8f0]"
                  : "bg-[rgba(164,116,78,0.1)] text-[#8b6243]"
              }`}>
                {cat.productCount}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Filter Panel ─── */
function FilterPanel({ filterOptions, filters, onFilterChange, onReset }) {
  const { materials = [], styles = [], colors = [], priceRange = {} } = filterOptions;
  const hasActiveFilters =
    filters.minPrice || filters.maxPrice || filters.material || filters.style || filters.color || filters.inStock;

  return (
    <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs tracking-[0.16em] text-[#8b6243] uppercase">
          Bo loc
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            id="filter-reset-btn"
            className="cursor-pointer border-none bg-transparent text-xs font-semibold text-[#c0392b] transition hover:text-[#a93226]"
            onClick={onReset}
          >
            Xoa tat ca
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-[#5c4a40]">
          Khoang gia
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="filter-min-price"
            className="w-full rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[rgba(95,63,42,0.3)]"
            placeholder={priceRange.min ? formatCurrency(priceRange.min) : "Tu"}
            value={filters.minPrice || ""}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
          />
          <span className="text-[#b09e90]">—</span>
          <input
            type="number"
            id="filter-max-price"
            className="w-full rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-[rgba(95,63,42,0.3)]"
            placeholder={priceRange.max ? formatCurrency(priceRange.max) : "Den"}
            value={filters.maxPrice || ""}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </div>

      {/* Material */}
      {materials.length > 0 && (
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-[#5c4a40]">
            Chat lieu
          </label>
          <div className="flex flex-wrap gap-2">
            {materials.map((mat) => (
              <button
                type="button"
                key={mat}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ${
                  filters.material === mat
                    ? "border-[#2f241f] bg-[#2f241f] font-semibold text-[#fff8f0]"
                    : "border-[rgba(95,63,42,0.15)] bg-white/80 text-[#5c4a40] hover:border-[rgba(95,63,42,0.3)]"
                }`}
                onClick={() =>
                  onFilterChange("material", filters.material === mat ? "" : mat)
                }
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Style */}
      {styles.length > 0 && (
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-[#5c4a40]">
            Phong cach
          </label>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                type="button"
                key={s}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ${
                  filters.style === s
                    ? "border-[#2f241f] bg-[#2f241f] font-semibold text-[#fff8f0]"
                    : "border-[rgba(95,63,42,0.15)] bg-white/80 text-[#5c4a40] hover:border-[rgba(95,63,42,0.3)]"
                }`}
                onClick={() =>
                  onFilterChange("style", filters.style === s ? "" : s)
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color */}
      {colors.length > 0 && (
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-[#5c4a40]">
            Mau sac
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                type="button"
                key={c}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition ${
                  filters.color === c
                    ? "border-[#2f241f] bg-[#2f241f] font-semibold text-[#fff8f0]"
                    : "border-[rgba(95,63,42,0.15)] bg-white/80 text-[#5c4a40] hover:border-[rgba(95,63,42,0.3)]"
                }`}
                onClick={() =>
                  onFilterChange("color", filters.color === c ? "" : c)
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In Stock */}
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            id="filter-in-stock"
            className="h-4 w-4 accent-[#2f241f]"
            checked={filters.inStock === "true"}
            onChange={(e) =>
              onFilterChange("inStock", e.target.checked ? "true" : "")
            }
          />
          <span className="text-sm text-[#5c4a40]">Chi hien san pham con hang</span>
        </label>
      </div>
    </div>
  );
}

/* ─── Sort Dropdown ─── */
function SortSelect({ value, onChange }) {
  return (
    <select
      id="sort-products"
      className="cursor-pointer rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-[rgba(95,63,42,0.3)]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="newest">Moi nhat</option>
      <option value="oldest">Cu nhat</option>
      <option value="price_asc">Gia tang dan</option>
      <option value="price_desc">Gia giam dan</option>
      <option value="name_asc">Ten A → Z</option>
      <option value="name_desc">Ten Z → A</option>
      <option value="rating">Danh gia cao</option>
    </select>
  );
}

/* ─── Pagination ─── */
function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total } = pagination;
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <p className="text-sm text-[#8b6243]">
        Hien thi trang {page}/{totalPages} ({total} san pham)
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          className="cursor-pointer rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-3 py-2 text-sm transition hover:bg-[rgba(164,116,78,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPageChange(page - 1)}
        >
          ← Truoc
        </button>
        {start > 1 && (
          <>
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-3 py-2 text-sm transition hover:bg-[rgba(164,116,78,0.08)]"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {start > 2 && <span className="px-1 py-2 text-[#b09e90]">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            type="button"
            key={p}
            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
              p === page
                ? "border-[#2f241f] bg-[#2f241f] font-bold text-[#fff8f0]"
                : "border-[rgba(95,63,42,0.15)] bg-white/80 hover:bg-[rgba(164,116,78,0.08)]"
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 py-2 text-[#b09e90]">…</span>}
            <button
              type="button"
              className="cursor-pointer rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-3 py-2 text-sm transition hover:bg-[rgba(164,116,78,0.08)]"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          className="cursor-pointer rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-3 py-2 text-sm transition hover:bg-[rgba(164,116,78,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => onPageChange(page + 1)}
        >
          Sau →
        </button>
      </div>
    </div>
  );
}

/* ─── Active Filter Tags ─── */
function ActiveFilterTags({ filters, filterOptions, onFilterChange }) {
  const tags = [];

  if (filters.category && filterOptions.categories) {
    const cat = filterOptions.categories.find((c) => c.slug === filters.category);
    if (cat) tags.push({ key: "category", label: `Danh muc: ${cat.name}`, value: "" });
  }
  if (filters.minPrice) tags.push({ key: "minPrice", label: `Tu ${formatCurrency(Number(filters.minPrice))}`, value: "" });
  if (filters.maxPrice) tags.push({ key: "maxPrice", label: `Den ${formatCurrency(Number(filters.maxPrice))}`, value: "" });
  if (filters.material) tags.push({ key: "material", label: `Chat lieu: ${filters.material}`, value: "" });
  if (filters.style) tags.push({ key: "style", label: `Phong cach: ${filters.style}`, value: "" });
  if (filters.color) tags.push({ key: "color", label: `Mau: ${filters.color}`, value: "" });
  if (filters.inStock === "true") tags.push({ key: "inStock", label: "Con hang", value: "" });

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(164,116,78,0.12)] px-3 py-1.5 text-xs font-medium text-[#5c4a40]"
        >
          {tag.label}
          <button
            type="button"
            className="cursor-pointer border-none bg-transparent p-0 text-[#8b6243] transition hover:text-[#2f241f]"
            onClick={() => onFilterChange(tag.key, tag.value)}
            aria-label={`Xoa ${tag.label}`}
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75">
      <div className="aspect-[4/3] bg-[rgba(164,116,78,0.1)]" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-1/3 rounded-full bg-[rgba(164,116,78,0.1)]" />
        <div className="h-5 w-4/5 rounded-full bg-[rgba(164,116,78,0.12)]" />
        <div className="h-3 w-2/3 rounded-full bg-[rgba(164,116,78,0.08)]" />
        <div className="h-5 w-1/4 rounded-full bg-[rgba(164,116,78,0.12)]" />
      </div>
    </div>
  );
}

/* ─── Mobile Filter Toggle ─── */
function MobileFilterToggle({ open, onToggle, activeCount }) {
  return (
    <button
      type="button"
      id="mobile-filter-toggle"
      className="flex cursor-pointer items-center gap-2 rounded-xl border border-[rgba(95,63,42,0.15)] bg-white/80 px-4 py-2.5 text-sm font-medium transition hover:bg-[rgba(164,116,78,0.08)] lg:hidden"
      onClick={onToggle}
    >
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M7 12h10M9 18h6" strokeLinecap="round" />
      </svg>
      {open ? "An bo loc" : "Bo loc"}
      {activeCount > 0 && (
        <span className="rounded-full bg-[#2f241f] px-2 py-0.5 text-xs font-bold text-[#fff8f0]">
          {activeCount}
        </span>
      )}
    </button>
  );
}

/* ─── Main Shop Page ─── */
function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    materials: [],
    styles: [],
    colors: [],
    priceRange: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL params
  const searchTerm = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";
  const sortBy = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const filters = {
    category: categorySlug,
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    material: searchParams.get("material") || "",
    style: searchParams.get("style") || "",
    color: searchParams.get("color") || "",
    inStock: searchParams.get("inStock") || "",
  };

  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Count active filters
  const activeFilterCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.material,
    filters.style,
    filters.color,
    filters.inStock,
  ].filter(Boolean).length;

  // Update URL params
  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    }
    // Reset to page 1 when filters change (unless updating page itself)
    if (!("page" in updates)) {
      next.delete("page");
    }
    setSearchParams(next, { replace: true });
  }

  // Load filter options
  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/browse/filters`);
        const data = await res.json();
        setFilterOptions(data);
      } catch {
        // Silently fail, filters will just be empty
      }
    }
    loadFilters();
  }, []);

  // Load products
  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (searchTerm) params.set("search", searchTerm);
        if (categorySlug) params.set("category", categorySlug);
        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        if (filters.material) params.set("material", filters.material);
        if (filters.style) params.set("style", filters.style);
        if (filters.color) params.set("color", filters.color);
        if (filters.inStock) params.set("inStock", filters.inStock);
        params.set("sort", sortBy);
        params.set("page", String(currentPage));
        params.set("limit", "12");

        const res = await fetch(
          `${API_BASE_URL}/api/browse/products?${params.toString()}`
        );
        if (!res.ok) throw new Error("Khong the tai san pham.");
        const data = await res.json();

        if (isMounted) {
          setProducts(data.products || []);
          setPagination(data.pagination || null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Co loi xay ra.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();
    return () => { isMounted = false; };
  }, [searchTerm, categorySlug, sortBy, currentPage, filters.minPrice, filters.maxPrice, filters.material, filters.style, filters.color, filters.inStock]);

  // Sync local search with URL param
  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  function handleSearch() {
    updateParams({ search: localSearch.trim() });
  }

  function handleFilterChange(key, value) {
    if (key === "category") {
      updateParams({ category: value });
    } else {
      updateParams({ [key]: value });
    }
  }

  function handleResetFilters() {
    const next = new URLSearchParams();
    if (searchTerm) next.set("search", searchTerm);
    if (categorySlug) next.set("category", categorySlug);
    next.set("sort", sortBy);
    setSearchParams(next, { replace: true });
  }

  function handleSortChange(value) {
    updateParams({ sort: value });
  }

  function handlePageChange(page) {
    updateParams({ page: String(page) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCategorySelect(slug) {
    updateParams({ category: slug });
  }

  // Find active category name for heading
  const activeCategoryName =
    filterOptions.categories.find((c) => c.slug === categorySlug)?.name || "";

  return (
    <main className="min-h-screen px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      {/* Header Section */}
      <section className="mx-auto mb-6 w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-[rgba(95,63,42,0.12)] bg-[rgba(255,251,245,0.82)] p-5 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-6">
        <StoreHeader />

        {/* Hero area */}
        <div className="mb-6 rounded-[28px] bg-[linear-gradient(135deg,rgba(63,42,31,0.96),rgba(89,63,48,0.92))] p-6 text-[#f8efe5] md:p-8">
          <p className="mb-2 text-xs tracking-[0.16em] uppercase opacity-70">
            Cua hang
          </p>
          <h1 className="max-w-[20ch] text-3xl leading-tight font-semibold md:text-4xl">
            {activeCategoryName
              ? activeCategoryName
              : searchTerm
              ? `Ket qua tim kiem cho "${searchTerm}"`
              : "Kham pha tat ca san pham"}
          </h1>
          <p className="mt-3 max-w-[50ch] leading-7 opacity-80">
            Tim kiem, loc va sap xep de tim san pham phu hop voi khong gian cua ban.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-5">
          <SearchBar
            value={localSearch}
            onChange={setLocalSearch}
            onSearch={handleSearch}
          />
        </div>

        {/* Active filters + Sort + Mobile toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <MobileFilterToggle
              open={mobileFilterOpen}
              onToggle={() => setMobileFilterOpen((prev) => !prev)}
              activeCount={activeFilterCount}
            />
            <ActiveFilterTags
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>
          <div className="flex items-center gap-3">
            {pagination && (
              <span className="text-sm text-[#8b6243]">
                {pagination.total} san pham
              </span>
            )}
            <SortSelect value={sortBy} onChange={handleSortChange} />
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Product Grid */}
      <section className="mx-auto w-full max-w-[1180px]">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className={`grid gap-5 ${mobileFilterOpen ? "" : "max-lg:hidden"}`}>
            <CategoryList
              categories={filterOptions.categories}
              activeSlug={categorySlug}
              onSelect={handleCategorySelect}
            />
            <FilterPanel
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Products */}
          <div>
            {loading ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-8 text-center">
                <h3 className="text-lg font-semibold text-[#c0392b]">{error}</h3>
                <p className="mt-2 text-[#655247]">Vui long thu lai sau.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(164,116,78,0.1)]">
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#8b6243"
                    strokeWidth="1.5"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Khong tim thay san pham</h3>
                <p className="mt-2 text-[#655247]">
                  Thu thay doi tu khoa hoac bo loc de tim san pham phu hop.
                </p>
                <button
                  type="button"
                  className="mt-4 cursor-pointer rounded-full border-none bg-[#2f241f] px-5 py-2.5 font-bold text-[#fff8f0] transition hover:bg-[#3f2a1f]"
                  onClick={() => {
                    setLocalSearch("");
                    setSearchParams(new URLSearchParams(), { replace: true });
                  }}
                >
                  Xoa tat ca bo loc
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Shop;
