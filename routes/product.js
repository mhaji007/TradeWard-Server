const express = require("express")
const router = express.Router();

const {getProducts} = require("../controllers/product")


// router.route("/products").get(getProducts);
// The above is the same as below
router.get("/products", getProducts)

module.exports = router;
