// Erro middlewares making use of errorHandler

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // 500 -> internal server error
  err.statusCode = err.statusCode || 500;

  // err.message = err.message || "Internal Server Error";

  // Separate errors for production and development
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(err);

    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    // Wrong Mongoose Object ID Error (malformed - gibberish url [e.g., /api/v1/products/sddffsasd])
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handle Mongoose Validation Error (e.g., name or description, etc. is required)
    if (err.name === "ValidationError") {
      // Loop through all the values of the err object
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handle Mongoose duplicate key errors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // Handle wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Please try again.";
      error = new ErrorHandler(message, 500);
    }

    // Handle Expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired. Please try again.";
      error = new ErrorHandler(message, 500);
    }
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
