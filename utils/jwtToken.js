// Create and send token and save in the cookie.
const sendToken = (user, statusCode, res) => {
  // Create Jwt token
  const token = user.getJwtToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    // -- IMPORTANT --
    // Make sure the following line is included
    // This ensures that the cookie is a http cookie
    // and cannot be accessed via JavaScript client-side
    // if this line is not included, the cookie will not
    // be a http cookie and will be accessible via JS on the frontend
    httpOnly: true,
  };

  // Turn on secure mode in production
  // A cookie with the Secure attribute is sent to the server only
  // with an encrypted request over the HTTPS protocol, never with
  // unsecured HTTP (except on localhost), and therefore can't easily
  //  be accessed by a man-in-the-middle attacker

  // if (process.env.NODE_ENV === "production") {
  //   options.secure = true;
  // }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;
