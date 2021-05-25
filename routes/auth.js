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
router.post("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset/:token", resetPassword);
router.post("/password/update", updatePassword);
router.get("/me", isAuthenticatedUser, getUserProfile);

module.exports = router;
