const express = require("express")
const router = express.Router();

const {getProducts, newProduct} = require("../controllers/product")


// router.route("/products").get(getProducts);
// The above is the same as below
router.get("/products", getProducts);
router.post("/product/new", newProduct);


module.exports = router;
