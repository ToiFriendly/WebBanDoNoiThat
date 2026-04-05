const express = require("express");
const {
  browseProducts,
  getFilterOptions,
  searchSuggestions
} = require("../controllers/browseController");

const router = express.Router();

// GET /api/browse/products — search, filter, sort, paginate products
router.get("/products", browseProducts);

// GET /api/browse/filters — get filter options (categories, materials, styles, colors, price range)
router.get("/filters", getFilterOptions);

// GET /api/browse/suggestions?q=... — search autocomplete suggestions
router.get("/suggestions", searchSuggestions);

module.exports = router;
