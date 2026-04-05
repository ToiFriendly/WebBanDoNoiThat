import { resolveAssetUrl } from "../utils/storefront";

const THUMBNAIL_SIZE_STYLES = {
  compact: {
    frame: "h-12 w-12 rounded-[14px] p-1.5",
    surface: "rounded-[10px]",
  },
  medium: {
    frame: "h-[88px] w-[88px] rounded-[20px] p-2",
    surface: "rounded-2xl",
  },
  cart: {
    frame: "h-24 w-24 rounded-[22px] p-2 md:h-[120px] md:w-[120px]",
    surface: "rounded-[18px] md:rounded-[20px]",
  },
};

function joinClasses(...classNames) {
  return classNames.filter(Boolean).join(" ");
}

function ProductThumbnail({
  src = "",
  alt = "",
  size = "medium",
  fit = "contain",
  frameClassName = "",
  imageClassName = "",
  placeholderLabel = "",
}) {
  const sizeStyles = THUMBNAIL_SIZE_STYLES[size] || THUMBNAIL_SIZE_STYLES.medium;
  const resolvedSrc = resolveAssetUrl(src);
  const imageFitClassName =
    fit === "cover"
      ? "h-full w-full object-cover"
      : "max-h-full max-w-full object-contain";

  return (
    <div
      className={joinClasses(
        "shrink-0 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,247,236,0.96),rgba(241,226,207,0.85))]",
        sizeStyles.frame,
        frameClassName,
      )}
    >
      {resolvedSrc ? (
        <div
          className={joinClasses(
            "flex h-full w-full items-center justify-center overflow-hidden bg-white",
            sizeStyles.surface,
          )}
        >
          <img
            className={joinClasses(
              "block object-center",
              imageFitClassName,
              sizeStyles.surface,
              imageClassName,
            )}
            src={resolvedSrc}
            alt={alt}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className={joinClasses(
            "flex h-full w-full items-end bg-[linear-gradient(135deg,rgba(164,116,78,0.22),rgba(245,222,194,0.68))] p-2.5",
            sizeStyles.surface,
          )}
        >
          {placeholderLabel ? (
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold leading-4 text-[#5a4336]">
              {placeholderLabel}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ProductThumbnail;
