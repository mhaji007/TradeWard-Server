const express = require("express");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/errors");


// Import routes
const products = require("./routes/product")
const auth = require("./routes/auth")

// Initialize app
const app = express();

// Global middlewares (to be used on all routes)
app.use(express.json());
app.use(cookieParser())

// Route middlewares
app.use("/api/v1", products)
app.use("/api/v1", auth)

// Error middleware
app.use(errorMiddleware);

module.exports = app
