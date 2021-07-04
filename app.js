const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");

// Import routes
const products = require("./routes/product");
const auth = require("./routes/auth");

// Initialize app
const app = express();

// Global middlewares (to be used on all routes)
app.use(express.json());
app.use(cookieParser());

// Rate Limit
const limiter = rateLimit({
  // 10 minutes
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Route middlewares
app.use("/api/v1", products);
app.use("/api/v1", auth);
//  Handle unhandled routes (e.g., api/v1/prod instead of api/v1/products)
// error is passed on to the next middleware which is the Error middleware below
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;
