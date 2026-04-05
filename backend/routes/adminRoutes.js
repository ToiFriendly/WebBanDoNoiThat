const express = require("express");
const { authenticateToken, authorizeRoles } = require("../middlewares/auth");
const {
  listAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");
const {
  listAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const {
  getAdminSummary,
  listAdminOrders,
  updateAdminOrder,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} = require("../controllers/adminController");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

router.get("/summary", getAdminSummary);

router.get("/categories", listAdminCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/products", listAdminProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", listAdminOrders);
router.put("/orders/:id", updateAdminOrder);

router.get("/users", listAdminUsers);
router.post("/users", createAdminUser);
router.put("/users/:id", updateAdminUser);
router.delete("/users/:id", deleteAdminUser);

module.exports = router;
