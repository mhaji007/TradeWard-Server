const express = require("express");
const router = express.Router();


const {registerUser, loginUser, forgotPassword, logout} = require('../controllers/auth')

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logout);
router.post("/password/forgot",forgotPassword );

module.exports = router;
