const User = require("../models/user");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");

const sendToken = require("../utils/jwtToken");

// Register a user => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
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
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
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


// Forgot Password   =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorHandler(
        "No user associated with this email found in database",
        404
      )
    );
  }

  // Get reset token
  // user.getResetPasswordToken() returns the un-hashed reset token into resetToken varaible
  // this un-hashed token is used further down for reset url construction. At the same time
  // getResetPasswordToken hashes the reset token internally (in user model) and stores the
  // hashed in the resetPasswordToken of the database to be saved
  const resetToken = user.getResetPasswordToken();

  // Alternatively, we could generate a new token here
  // generate a token with user id and secret
  // const token = jwt.sign(
  //   { _id: user._id, iss: "NODEAPI" },
  //   process.env.JWT_SECRET
  // );

  // validateBeforeSave validates the mongoose object before persisting it to database.
  // This is a schema level check, which, if not set to false, will validate every document.
  // It includes both built-in (like a Number cannot contain string or a required field should exist etc.)
  // and custom defined validations.

  // { validateBeforeSave: false } is used because when we create a user
  // we have to provide all required fields that are specified in the model.
  // And in this case, we are only storing the password recovery token,
  // so that is why this option is used to not validate before saving the document.
  await user.save({ validateBeforeSave: false });

  // Create reset password url

  // req.protocol -> http or https
  // req.get("host") -> local host or custom host

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Please use the following link to reset your password:\n\n${resetUrl}\n\nIf you have not requested a reset, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "TradeWard Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email has been sent to ${user.email}. Follow the instructions to reset your password.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
})

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  // Retrieve token from URL and hash it
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    // Make sure the expiry date is greater than current time
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Set up new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  // Send token back again
  sendToken(user, 200, res);
});


// Get currently logged-in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  // isAuthenticatedUser implemented in middlewares/auth provides id
  // of the currently logged-in user on req.user.id
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
})




// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
