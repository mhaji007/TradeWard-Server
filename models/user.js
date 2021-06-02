const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxlength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    // Whenever user is selected, do not select password
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    // enum:{
    //   values:['user', 'anotheRoleButNotAdmin'],
    //   message:"Please select a role"
    // }
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // When requesting password reset,
  // we need to store reset password token
  // and password expiration sent in the email
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

// Encrypting password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT token (Stateful JWT auth method - JWT token and cookie)
userSchema.methods.getJwtToken = function () {
  // Sign with payload (what we want to store as payload for user)
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};



// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token

  // crypto.randomBytes returns a buffer that is converted to string
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // resetPasswordToken field of database now hold
  // hashed value of resetToken

  // Set token expire time
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  // resetPasswordExpire field of database now hold
  // value set above

  // Return un-hashed resetToken
  // to be used in sending email to the user
  return resetToken;
};





// ====== Second method of authentication ====== //

// Virtual fields ==> "password", used to get the plain password
// and save the hashed password. It has a middleware role
// virtual fields are additional fields for a given model.
// Their values can be set manually or automatically with defined functionality.
// Virtual properties don't get presisted in the database
// They only exist logically and are not written to document's collection

// password from client side
// is passed to virtual

// virtual field takes and return
// the plain password. The plain password
// is hashed and saved in the database in the process

// userSchema
//   .virtual("password")
//   .set(function (password) {
//     // create temp varaible called _password
//     this._password = password;

//     // generate salt (timestamp)
//     // using custom function
//     // this.salt refers to salt in schema
//     // this.salt = this.makeSalt();

//     // generate salt (timestamp)
//     // using uuid package
//     this.salt = uuidv4();
//     // encrypt password
//     // this.hashed_password is hashed-password in schema
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });



// Methods ==>
// each user schema may be assigned methods
// 1) authenticate compares and checks the incoming password
// and the hashed version
// 2) encryptPassword  which will hash the password upon
//  user registeration and subsequent login attempts
// 3) makeSalt
// export user schema

// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   encryptPassword: function (password) {
//     if (!password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },

//   // makeSalt: function () {
//   //   return Math.round(new Date().valueOf() * Math.random()) + "";
//   // },
// };

module.exports = mongoose.model("User", userSchema);
