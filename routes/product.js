const express = require("express")
const router = express.Router();

const {getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct} = require("../controllers/product")

const {isAuthenticatedUser} = require("../middlewares/auth")

// router.route("/products").get(getProducts);
// The above is the same as below
router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.post("/admin/product/new", isauthenticatedUser, newProduct);
router.put("/admin/product/:id", isauthenticatedUser, updateProduct);
router.delete("/admin/product/:id", isauthenticatedUser, deleteProduct);


module.exports = router;
