const express = require("express");

// Import routes
const products = require("./routes/product")

// Initialize app
const app = express();

// Global middlewares (to be used on all routes)
app.use(express.json());

// Route middlewares
app.use("/api/v1", products)

module.exports = app
