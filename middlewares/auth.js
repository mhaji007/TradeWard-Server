// Protect routes from unauthenticated users

// Authentication is accomplished through Stateful JWT

// - Only user ref (Mongoose ._id) embedded in token
// - Token is signed and base64url encoded ( in user model)
//   - Sent as HTTP-only cookie (set-Cookie header - in utils/jwtToken)
//   - Might be sent along with non-HTTP x-CSRF-TOKEN cookie (not implemented here)
// - Server uses ref. (._id) in the token to retrieve user from DB
// - No user sessions stored on the sever
// - Revoked tokens still have to be persisted

const User = require("../models/user");

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErros = require("./catchAsyncErrors");

// Check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErros(async (req, res, next) => {
  // Cookies are sent with each request (req.cookies).
  // We can authenticate users on the backend via cookies.
  // Access token from req.cookies.

    const { token } = req.cookies;

    // Check whether the cookie exists
    if (!token) {
      return next(
        new ErrorHandler("Login first to access this resource.", 401)
      );
    }
    // If token exists verify the user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Look for user in database and make the logged-in available on req.user
    req.user = await User.findById(decoded.id);

    next();

  // Another way would be to move the token to the frontend
  // and afterwards pass the token again to the backend,
  // providing the authorization in the headers
  // to verify it

  //  let token;

  //  if (
  //    req.headers.authorization &&
  //    req.headers.authorization.startsWith("Bearer")
  //  ) {
  //    token = req.headers.authorization.split(" ")[1];
  //  }

  //  if (!token) {
  //    return next(new ErrorHandler("Login first to access this resource.", 401));
  //  }

  //  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //  req.user = await User.findById(decoded.id);

  //  next();


});

// Handle users roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to acccess this resource`,
          403
        )
      );
    }
    next();
  };
};
