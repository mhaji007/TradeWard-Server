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
// router.get("/products", getProducts);

// Chaining is possible using the above mehtod
// router.route("/products").get(getProducts).delete(deleteProducrs);

// Alternative method of applying middlewares
// router.route("/products").get(isAuthenticatedUser, getProducts);

router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  newProduct
);
router.put(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  deleteProduct
);

module.exports = router;
