const jwt = require("jsonwebtoken");
const logger = require("../logger");
const { JWTSECRETKEY } = require("../config/constant");

// Middleware function to authenticate the user and get the detail
const userByToken = (req, next) => {
  logger.log("info", "Enter: authMiddleware.userByToken");
  // Get the token from the request header
  const token = req.header("token");

  if (!token) {
    // If token is not present, send an error response
    throw new Error("token is not present");
  }
  try {
    // Verify and decode the token
    logger.log("info", "Enter: try authMiddleware.userByToken");
    const decoded = jwt.verify(token, JWTSECRETKEY);
    // Add the decoded user details to the request object
    logger.log("info", "Exit: try: authMiddleware.userByToken");
    return decoded.user;
  } catch (error) {
    logger.log("info", "catch:error authMiddleware.userByToken");
    // If the token is invalid or expired, send an error response
    next(error);
  }
};

// Middleware function to generate  the user token
const generateToken = (userDetails, next) => {
  try {
    logger.log("info", "Enter: authMiddleware.generateToken");
    // Create the token payload with user details
    const payload = {
      user: userDetails,
    };
    // Generate the token
    const token = jwt.sign(payload, JWTSECRETKEY, { expiresIn: "1d" });

    logger.log("info", "Exit: authMiddleware.generateToken");
    return token;
  } catch (error) {
    logger.log("info", "catch:error authMiddleware.generateToken");
    // If the token is invalid or expired, send an error response
    next(error);
  }
};

// Middleware function to authenticate user token
const authenticateUser = (req, res, next) => {
  logger.log("info", "Enter auth:Middleware.authenticateUser");
  // Get the token from the request header
  const token = req.headers.token;

  if (!token) {
    // If token is not present, send an error response
    throw new Error("Token is not present");
  }
  try {
    logger.log("info", "Enter try: authMiddleware.authenticateUser");
    // Verify and decode the token
    const decoded = jwt.verify(token, JWTSECRETKEY);

    // Add the decoded user details to the request object
    req.user = decoded;
    req.session.user = decoded.user;

    // Proceed to the next middleware or route
    next();
    logger.log("info", "exit try: authMiddleware.authenticateUser");
  } catch (error) {
    logger.log("info", "catch:error authMiddleware.authenticateUser");
    // If the token is invalid or expired, send an error response
    next(error);
  }
};

module.exports = { authenticateUser, generateToken, userByToken };
