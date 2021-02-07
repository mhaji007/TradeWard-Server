const express = require("express")
const router = express.Router();

const {getProducts, newProduct, getSingleProduct} = require("../controllers/product")


// router.route("/products").get(getProducts);
// The above is the same as below
router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.post("/product/new", newProduct);


module.exports = router;
