import { useState } from "react";

const PAGE_SIZE = 4;

function clampRating(rating) {
  return Math.max(1, Math.min(5, Number(rating) || 0));
}

function formatCount(value) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

function getInitials(name) {
  return (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getToneClass(tone) {
  switch (tone) {
    case "clay":
      return "bg-[linear-gradient(145deg,#da9b63,#f1c38d)]";
    case "stone":
      return "bg-[linear-gradient(145deg,#d8d5ce,#f5f2ed)]";
    case "olive":
      return "bg-[linear-gradient(145deg,#c7c59d,#eef0dc)]";
    case "wood":
      return "bg-[linear-gradient(145deg,#bb8458,#f0c89d)]";
    default:
      return "bg-[linear-gradient(145deg,#e9c9a6,#f7e8d6)]";
  }
}

function buildDemoReviews(product, heroImage) {
  const productName = product?.name || "sản phẩm";
  const categoryName = product?.category?.name || "không gian sống";

  return [
    {
      id: "review-thuy-linh",
      name: "Nguyễn Thùy Linh",
      rating: 5,
      verified: true,
      timeLabel: "2 ngày trước",
      likes: 12,
      comments: 2,
      accent: "from-[#f4b07e] to-[#f8dfc4]",
      content: `Bình hoa rất đẹp, gốm dày và lên màu ấm. Đặt ở kệ ${categoryName.toLowerCase()} nhìn căn phòng gọn và sáng hơn rõ.`,
      productTag: "Đã mua hàng",
      media: [
        {
          id: "media-linh-1",
          kind: heroImage ? "image" : "tone",
          src: heroImage,
          tone: "stone",
          caption: productName,
        },
      ],
      storeReply:
        "Cảm ơn bạn Linh đã tin tưởng. COZY CORNER sẽ tiếp tục bổ sung thêm nhiều mẫu decor đồng bộ cho không gian sống.",
    },
    {
      id: "review-minh-duc",
      name: "Trần Minh Đức",
      rating: 5,
      verified: true,
      timeLabel: "1 tuần trước",
      likes: 5,
      comments: 1,
      accent: "from-[#c18f6a] to-[#f3d1b1]",
      content: `Đóng gói kỹ, giao nhanh và màu sắc của ${productName.toLowerCase()} rất dễ phối. Đặt trong căn hộ studio nhìn sạch và có điểm nhấn hơn.`,
      productTag: "Đã mua hàng",
      media: [
        {
          id: "media-duc-1",
          kind: heroImage ? "image" : "tone",
          src: heroImage,
          tone: "clay",
          caption: "Không gian thực tế",
        },
      ],
    },
    {
      id: "review-pham-huong",
      name: "Phạm Hương",
      rating: 4,
      verified: false,
      timeLabel: "3 tuần trước",
      likes: 2,
      comments: 0,
      accent: "from-[#ae6d4a] to-[#f0c29c]",
      content:
        "Chất lượng ổn trong tầm giá. Mình mua làm quà tân gia và nhận được phản hồi tốt, chỉ mong shop có thêm nhiều kích thước hơn.",
      productTag: "Đánh giá nổi bật",
      media: [],
    },
    {
      id: "review-hoang-nam",
      name: "Hoàng Nam",
      rating: 5,
      verified: true,
      timeLabel: "1 tháng trước",
      likes: 24,
      comments: 4,
      accent: "from-[#84a96a] to-[#d9e8c4]",
      content: `${productName} phối rất hợp với sofa và đèn sảnh tông ấm. Mình thích nhất là nhìn tổng thể vẫn gọn, không bị rối mắt.`,
      productTag: "Đã mua hàng",
      media: [
        {
          id: "media-nam-1",
          kind: heroImage ? "image" : "tone",
          src: heroImage,
          tone: "wood",
          caption: "Góc chụp 1",
        },
        {
          id: "media-nam-2",
          kind: "tone",
          tone: "stone",
          caption: "Góc chụp 2",
        },
        {
          id: "media-nam-3",
          kind: "count",
          tone: "olive",
          label: "+2",
          caption: "Thêm ảnh",
        },
      ],
    },
    {
      id: "review-bao-an",
      name: "Bảo An",
      rating: 5,
      verified: true,
      timeLabel: "5 tuần trước",
      likes: 7,
      comments: 1,
      accent: "from-[#d4a16a] to-[#f6deba]",
      content:
        "Bề mặt hoàn thiện đẹp, lau chùi dễ và không bị xước sau vài tuần sử dụng. Đây là món decor mình thấy dễ mix nhất năm nay.",
      productTag: "Đã mua hàng",
      media: [
        {
          id: "media-an-1",
          kind: "tone",
          tone: "olive",
          caption: "Cận cảnh chất liệu",
        },
      ],
    },
    {
      id: "review-ngoc-mai",
      name: "Ngọc Mai",
      rating: 5,
      verified: true,
      timeLabel: "2 tháng trước",
      likes: 9,
      comments: 3,
      accent: "from-[#d49a7d] to-[#f6d7c6]",
      content: `Màu nhìn ngoài đời thực tế đúng như ảnh. Mình đặt ${productName.toLowerCase()} lên bàn console và nhận rất nhiều lời khen từ bạn bè đến chơi nhà.`,
      productTag: "Đã mua hàng",
      media: [],
    },
  ];
}

function createDistribution(reviews) {
  const total = reviews.length || 1;

  return [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((review) => review.rating === rating).length;

    return {
      rating,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });
}

function sortReviews(reviews, sortBy) {
  const sortedReviews = [...reviews];

  if (sortBy === "highest") {
    return sortedReviews.sort((left, right) => {
      if (right.rating !== left.rating) {
        return right.rating - left.rating;
      }

      return right.likes - left.likes;
    });
  }

  if (sortBy === "media") {
    return sortedReviews.sort((left, right) => {
      if (right.media.length !== left.media.length) {
        return right.media.length - left.media.length;
      }

      return right.likes - left.likes;
    });
  }

  return sortedReviews;
}

function StarIcon({ active, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill={active ? "currentColor" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        d="M12 3.75l2.45 4.96 5.48.8-3.97 3.87.94 5.47L12 16.27l-4.9 2.58.94-5.47-3.97-3.87 5.48-.8L12 3.75z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StarRow({ rating, size = "h-4 w-4", tone = "text-[#f3a318]" }) {
  const safeRating = clampRating(rating);

  return (
    <div className={`flex items-center gap-1 ${tone}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={`${safeRating}-${index + 1}`}
          active={index < safeRating}
          className={size}
        />
      ))}
    </div>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CameraIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4.5 8.5h3l1.4-2h6.2l1.4 2h3A1.5 1.5 0 0 1 21 10v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-8a1.5 1.5 0 0 1 1.5-1.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function ThumbIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M10 10.5V5.9c0-.8.3-1.6.9-2.2l.8-.8c.3-.3.8-.3 1.1 0l.4.4c.3.3.5.8.4 1.2l-.7 3.6h4.1c1.1 0 1.9 1 1.7 2.1l-1 6.3c-.1.8-.8 1.4-1.7 1.4H9.5A2.5 2.5 0 0 1 7 15.4v-3.1A1.8 1.8 0 0 1 8.8 10.5H10z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M4 10.5h2v7H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CommentIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M6 17.5L3.5 20v-3.6A6.9 6.9 0 0 1 2 12c0-4.1 4-7.5 9-7.5s9 3.4 9 7.5-4 7.5-9 7.5c-1.1 0-2.2-.2-3.2-.5L6 17.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function AvatarBadge({ name, accent }) {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-sm font-bold text-[#593c28] shadow-[0_10px_24px_rgba(110,67,37,0.18)]`}
    >
      {getInitials(name)}
    </div>
  );
}

function RatingBar({ rating, count, percentage }) {
  return (
    <div className="grid grid-cols-[18px_minmax(0,1fr)_40px] items-center gap-3 text-sm text-[#7a6658]">
      <span>{rating}</span>
      <div className="h-2 overflow-hidden rounded-full bg-[#e9dfd1]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#4bb464,#87ca7f)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-right text-xs text-[#8b7b6d]">
        {count > 0 ? `${percentage}%` : "0%"}
      </span>
    </div>
  );
}

function MediaTile({ item, productName }) {
  if (item.kind === "image" && item.src) {
    return (
      <div className="overflow-hidden rounded-[18px] bg-[#efe6dc] shadow-[0_16px_40px_rgba(102,69,42,0.1)]">
        <img
          className="block h-full min-h-[112px] w-full object-cover"
          src={item.src}
          alt={item.caption || productName}
        />
      </div>
    );
  }

  if (item.kind === "count") {
    return (
      <div
        className={`flex min-h-[112px] items-center justify-center rounded-[18px] ${getToneClass(item.tone)} text-2xl font-semibold text-[#5d422b] shadow-[0_16px_40px_rgba(102,69,42,0.1)]`}
      >
        {item.label}
      </div>
    );
  }

  return (
    <div
      className={`relative flex min-h-[112px] items-end rounded-[18px] ${getToneClass(item.tone)} p-4 shadow-[0_16px_40px_rgba(102,69,42,0.1)]`}
    >
      <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#5d422b]">
        {item.caption || productName}
      </div>
    </div>
  );
}

function ReviewCard({ review, productName }) {
  return (
    <article className="rounded-[28px] border border-[rgba(95,63,42,0.08)] bg-white/95 p-5 shadow-[0_16px_50px_rgba(91,60,37,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <AvatarBadge name={review.name} accent={review.accent} />
          <div>
            <div className="font-semibold text-[#3b2b21]">{review.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6f7d48]">
              {review.verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef7e9] px-2 py-1 font-semibold text-[#4f8c3a]">
                  <CheckIcon className="h-3.5 w-3.5" />
                  Đã mua hàng
                </span>
              ) : (
                <span className="rounded-full bg-[#f7efe7] px-2 py-1 text-[#8b6243]">
                  Đánh giá nổi bật
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-xs text-[#9d8b7d]">{review.timeLabel}</div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StarRow rating={review.rating} />
        <span className="rounded-full bg-[#f9efe3] px-3 py-1 text-xs font-semibold text-[#8b6243]">
          {review.productTag}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-[#5e4d43]">{review.content}</p>

      {review.media.length ? (
        <div
          className={`mt-4 grid gap-3 ${
            review.media.length > 1 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
          }`}
        >
          {review.media.map((item) => (
            <MediaTile key={item.id} item={item} productName={productName} />
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center gap-5 border-t border-[rgba(95,63,42,0.08)] pt-4 text-xs text-[#7d6a5e]">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-transparent p-0 transition hover:text-[#3b2b21]"
        >
          <ThumbIcon className="h-4 w-4" />
          Hữu ích ({review.likes})
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-transparent p-0 transition hover:text-[#3b2b21]"
        >
          <CommentIcon className="h-4 w-4" />
          Bình luận{review.comments ? ` (${review.comments})` : ""}
        </button>
      </div>

      {review.storeReply ? (
        <div className="mt-4 rounded-[22px] bg-[#f5f8f1] p-4 text-sm text-[#5f7049]">
          <div className="font-semibold text-[#4f6a35]">COZY CORNER phản hồi</div>
          <p className="mt-2 leading-6">{review.storeReply}</p>
        </div>
      ) : null}
    </article>
  );
}

function CustomerReviewsSection({ product, heroImage }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [composerHint, setComposerHint] = useState("");

  const reviews = buildDemoReviews(product, heroImage);
  const averageRating =
    product?.ratingAverage > 0
      ? product.ratingAverage
      : reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
  const distribution = createDistribution(reviews);
  const fiveStarCount = reviews.filter((review) => review.rating === 5).length;
  const mediaCount = reviews.filter((review) => review.media.length > 0).length;

  const filteredReviews = sortReviews(
    reviews.filter((review) => {
      if (activeFilter === "five-star") {
        return review.rating === 5;
      }

      if (activeFilter === "media") {
        return review.media.length > 0;
      }

      return true;
    }),
    sortBy,
  );

  const pageCount = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedReviews = filteredReviews.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <section className="relative mt-8 overflow-hidden rounded-[34px] border border-[rgba(95,63,42,0.1)] bg-[linear-gradient(145deg,rgba(249,238,221,0.96),rgba(255,247,238,0.92))] p-5 shadow-[0_22px_65px_rgba(90,59,36,0.08)] md:mt-10 md:p-8">
      <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-[rgba(248,188,119,0.16)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[rgba(244,214,177,0.22)] blur-3xl" />

      <div className="relative">
        <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <div className="text-sm text-[#c28736]">
              Trang chủ / {product?.category?.name || "Phòng khách"} / {product?.name} /
              {" "}Đánh giá sản phẩm
            </div>
            <h2 className="mt-4 max-w-[320px] text-4xl font-semibold leading-none text-[#241814] md:text-5xl">
              Đánh giá từ khách hàng
            </h2>
            <p className="mt-4 max-w-[280px] text-sm leading-7 text-[#b47828] md:text-base">
              Xem hình ảnh thực tế và cảm nhận chân thật từ cộng đồng yêu nhà đẹp.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#f0a11b] px-5 font-semibold text-white shadow-[0_14px_30px_rgba(240,161,27,0.3)] transition hover:-translate-y-0.5"
                onClick={() =>
                  setComposerHint(
                    "Giao diện form đánh giá đã sẵn sàng. Có thể nối API gửi review khi backend bổ sung endpoint.",
                  )
                }
              >
                Viết đánh giá
              </button>
              <div className="rounded-full border border-[rgba(95,63,42,0.08)] bg-white/70 px-4 py-2 text-sm text-[#7b6656]">
                Đánh giá cho {product?.name || "sản phẩm"}
              </div>
            </div>

            {composerHint ? (
              <div className="mt-4 rounded-[20px] border border-[rgba(240,161,27,0.14)] bg-white/70 px-4 py-3 text-sm leading-6 text-[#71553d]">
                {composerHint}
              </div>
            ) : null}
          </div>

          <div className="rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-white/95 p-5 shadow-[0_18px_55px_rgba(90,59,36,0.08)] md:p-7">
            <div className="grid gap-5 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
              <div className="border-b border-[rgba(95,63,42,0.08)] pb-4 text-center md:border-b-0 md:border-r md:pb-0 md:pr-5">
                <div className="text-5xl font-semibold text-[#201612]">
                  {averageRating.toFixed(1)}
                </div>
                <div className="mt-3 flex justify-center">
                  <StarRow rating={Math.round(averageRating)} size="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm text-[#d18c2d]">
                  {formatCount(reviews.length)} đánh giá
                </div>
              </div>

              <div className="grid gap-3">
                {distribution.map((item) => (
                  <RatingBar
                    key={item.rating}
                    rating={item.rating}
                    count={item.count}
                    percentage={item.percentage}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === "all"
                  ? "bg-[#f0a11b] text-white shadow-[0_10px_20px_rgba(240,161,27,0.22)]"
                  : "border border-[rgba(95,63,42,0.12)] bg-white/80 text-[#6e5849]"
              }`}
              onClick={() => {
                setActiveFilter("all");
                setPage(1);
              }}
            >
              <CheckIcon className="h-4 w-4" />
              Tất cả
            </button>

            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === "five-star"
                  ? "bg-[#f0a11b] text-white shadow-[0_10px_20px_rgba(240,161,27,0.22)]"
                  : "border border-[rgba(95,63,42,0.12)] bg-white/80 text-[#6e5849]"
              }`}
              onClick={() => {
                setActiveFilter("five-star");
                setPage(1);
              }}
            >
              <StarIcon active className="h-4 w-4" />
              5 sao ({fiveStarCount})
            </button>

            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === "media"
                  ? "bg-[#f0a11b] text-white shadow-[0_10px_20px_rgba(240,161,27,0.22)]"
                  : "border border-[rgba(95,63,42,0.12)] bg-white/80 text-[#6e5849]"
              }`}
              onClick={() => {
                setActiveFilter("media");
                setPage(1);
              }}
            >
              <CameraIcon className="h-4 w-4" />
              Có hình ảnh/video ({mediaCount})
            </button>
          </div>

          <label className="flex items-center gap-3 text-sm text-[#7c6858]">
            <span className="sr-only">Sắp xếp đánh giá</span>
            <select
              className="min-h-10 rounded-full border border-[rgba(95,63,42,0.12)] bg-white/90 px-4 pr-10 text-sm text-[#4d3b30] outline-none"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Mới nhất</option>
              <option value="highest">Đánh giá cao</option>
              <option value="media">Nhiều ảnh</option>
            </select>
          </label>
        </div>

        {pagedReviews.length ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {pagedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                productName={product?.name || "Sản phẩm"}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-[rgba(95,63,42,0.16)] bg-white/60 px-5 py-10 text-center text-[#7d6759]">
            Chưa có đánh giá phù hợp với bộ lọc này.
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(95,63,42,0.12)] bg-white/80 text-[#6d5849] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage === 1}
          >
            <ChevronIcon className="h-4 w-4 rotate-180" />
          </button>

          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={`page-${pageNumber}`}
              type="button"
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-semibold transition ${
                pageNumber === safePage
                  ? "bg-[#f0a11b] text-white shadow-[0_10px_20px_rgba(240,161,27,0.22)]"
                  : "border border-[rgba(95,63,42,0.12)] bg-white/80 text-[#6d5849]"
              }`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(95,63,42,0.12)] bg-white/80 text-[#6d5849] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={safePage === pageCount}
          >
            <ChevronIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default CustomerReviewsSection;
