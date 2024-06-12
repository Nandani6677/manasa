const bcrypt = require("bcrypt");
const logger = require("../logger");
const { generateToken } = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const crypto = require("crypto");
const { forgotPasswordMail } = require("../utils/sendMail");

// POST login specific user
const login = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.login");
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      logger.log("info", "Exit: try: userController.login email");
      throw new Error("Invalid Email");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.log("info", "Exit: try: userController.login pasword");
      throw new Error("Invalid Password");
    }

    user = user.toObject();
    // Generate JWT token and assign it to the user object
    const jwtToken = generateToken(user, next);
    user.jwtToken = jwtToken;

    console.log("user", user);
    logger.log("info", "Exit: try: userController.login");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "Login Successfully",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.login");
    next(error);
  }
};

// POST forgot password
const forgotPassword = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.forgotPassword");
    const { email } = req.body;

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      logger.log("info", "Enter: catch: userController.forgotPassword");
      throw new Error("User not found");
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Save reset token and expiry in the user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    user.save();

    // Send password reset instructions to the user (via email)
    const mail = await forgotPasswordMail(req, user, next);
    if (!mail) {
      logger.log("info", "Exit: try: userController.forgotPassword");
      throw new Error(mail);
    }
    logger.log("info", "Exit: try: userController.forgotPassword");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "Password reset instructions sent",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.forgotPassword");
    next(error);
  }
};

// POST reset password
const resetPassword = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.resetPassword");
    const { resetToken, newPassword } = req.body;
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      logger.log("info", "Enter: catch: userController.resetPassword");
      throw new Error("Invalid or expired reset token");
    }

    // Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    user.save();
    logger.log("info", "Exit: try: userController.resetPassword");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "Password reset successfully",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.resetPassword");
    next(error);
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};
