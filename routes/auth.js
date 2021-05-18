const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/password/forgot", forgotPassword);
router.post("/password/reset/:token", resetPassword);

module.exports = router;
