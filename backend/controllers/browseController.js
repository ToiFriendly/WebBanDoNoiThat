const Category = require("../schemas/category");
const Product = require("../schemas/product");

function mapCategory(category) {
  return {
    _id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parentCategory: category.parentCategory
      ? {
          _id: category.parentCategory._id,
          name: category.parentCategory.name,
          slug: category.parentCategory.slug
        }
      : null,
    productCount: category.productCount || 0
  };
}

function mapProduct(product) {
  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    material: product.material,
    style: product.style,
    color: product.color,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    quantityInStock: product.quantityInStock,
    images: product.images,
    tags: product.tags,
    ratingAverage: product.ratingAverage,
    reviewCount: product.reviewCount,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt,
    category: product.category
      ? {
          _id: product.category._id,
          name: product.category.name,
          slug: product.category.slug
        }
      : null
  };
}

async function browseProducts(req, res, next) {
  try {
    const {
      search,
      category: categorySlug,
      minPrice,
      maxPrice,
      material,
      style,
      color,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(48, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (parsedPage - 1) * parsedLimit;

    // Build product filter
    const filter = {
      status: "active",
      isDeleted: false
    };

    // Search by name or shortDescription
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { shortDescription: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Filter by category slug
    if (categorySlug && categorySlug.trim()) {
      const cat = await Category.findOne({
        slug: categorySlug.trim(),
        isActive: true,
        isDeleted: false
      });

      if (cat) {
        filter.category = cat._id;
      } else {
        // No matching category, return empty
        return res.status(200).json({
          products: [],
          pagination: {
            page: parsedPage,
            limit: parsedLimit,
            total: 0,
            totalPages: 0
          },
          filters: {}
        });
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    // Material filter
    if (material && material.trim()) {
      filter.material = new RegExp(material.trim(), "i");
    }

    // Style filter
    if (style && style.trim()) {
      filter.style = new RegExp(style.trim(), "i");
    }

    // Color filter
    if (color && color.trim()) {
      filter.color = new RegExp(color.trim(), "i");
    }

    // In stock filter
    if (inStock === "true") {
      filter.quantityInStock = { $gt: 0 };
    }

    // Sort options
    let sortCriteria = { createdAt: -1 };
    switch (sort) {
      case "price_asc":
        sortCriteria = { price: 1 };
        break;
      case "price_desc":
        sortCriteria = { price: -1 };
        break;
      case "name_asc":
        sortCriteria = { name: 1 };
        break;
      case "name_desc":
        sortCriteria = { name: -1 };
        break;
      case "rating":
        sortCriteria = { ratingAverage: -1 };
        break;
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortCriteria)
        .skip(skip)
        .limit(parsedLimit),
      Product.countDocuments(filter)
    ]);

    return res.status(200).json({
      products: products.map(mapProduct),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit)
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function getFilterOptions(req, res, next) {
  try {
    const baseFilter = {
      status: "active",
      isDeleted: false
    };

    const [categories, materialsAgg, stylesAgg, colorsAgg, priceAgg] =
      await Promise.all([
        // Get all active categories with product count
        Category.aggregate([
          { $match: { isActive: true, isDeleted: false } },
          {
            $lookup: {
              from: "products",
              let: { categoryId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$category", "$$categoryId"] },
                    status: "active",
                    isDeleted: false
                  }
                },
                { $count: "count" }
              ],
              as: "productCount"
            }
          },
          {
            $addFields: {
              productCount: {
                $ifNull: [{ $arrayElemAt: ["$productCount.count", 0] }, 0]
              }
            }
          },
          { $sort: { sortOrder: 1, name: 1 } }
        ]),
        // Get distinct materials
        Product.distinct("material", {
          ...baseFilter,
          material: { $ne: "" }
        }),
        // Get distinct styles
        Product.distinct("style", {
          ...baseFilter,
          style: { $ne: "" }
        }),
        // Get distinct colors
        Product.distinct("color", {
          ...baseFilter,
          color: { $ne: "" }
        }),
        // Get price range
        Product.aggregate([
          { $match: baseFilter },
          {
            $group: {
              _id: null,
              minPrice: { $min: "$price" },
              maxPrice: { $max: "$price" }
            }
          }
        ])
      ]);

    const priceRange = priceAgg[0] || { minPrice: 0, maxPrice: 0 };

    return res.status(200).json({
      categories: categories.map(mapCategory),
      materials: materialsAgg.filter(Boolean).sort(),
      styles: stylesAgg.filter(Boolean).sort(),
      colors: colorsAgg.filter(Boolean).sort(),
      priceRange: {
        min: priceRange.minPrice || 0,
        max: priceRange.maxPrice || 0
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function searchSuggestions(req, res, next) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({ suggestions: [] });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const products = await Product.find({
      status: "active",
      isDeleted: false,
      $or: [{ name: searchRegex }, { tags: searchRegex }]
    })
      .select("name slug images price category")
      .populate("category", "name slug")
      .sort({ isFeatured: -1, ratingAverage: -1 })
      .limit(6);

    const suggestions = products.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: Array.isArray(p.images) ? p.images[0] || "" : "",
      categoryName: p.category?.name || ""
    }));

    return res.status(200).json({ suggestions });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  browseProducts,
  getFilterOptions,
  searchSuggestions
};
