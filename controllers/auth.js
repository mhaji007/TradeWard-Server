const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErros = require("../middlewares/catchAsyncErros");

const crypto = require("crypto");

const sendToken = require("../utils/jwtToken");

// Register a user => /api/v1/register

exports.registerUser = catchAsyncErros(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "",
      url: "",
    },
  });

  // const token = user.getJwtToken();

  // res.status(201).json({
  //   success: true,
  //   token,
  // });

  // Generate a token and sent it back in cookie
  sendToken(user, 200, res);
});

// Login user => /api/v1/login
exports.loginUser = catchAsyncErros(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // Find user in database
  const user = await User.findOne({ email }).select("+password");

  //  401 -> Unauthenticated user
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // const token = user.getJwtToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  // Generate a token and sent it back in cookie
  sendToken(user, 200, res);
});


// Logout user => /api/v1/logout
exports.logout = catchAsyncErros(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
