const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// router.route("/products").get(getProducts);
// The above is the same as below
router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.post(
  "/admin/product/new",
  isauthenticatedUser,
  authorizeRoles("admin"),
  newProduct
);
router.put(
  "/admin/product/:id",
  isauthenticatedUser,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isauthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;
