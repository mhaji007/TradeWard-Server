const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
  getUserProfile
} = require("../controllers/auth");

const { isAuthenticatedUser } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", isAuthenticatedUser, logout);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", updatePassword);

module.exports = router;
