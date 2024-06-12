const bcrypt = require("bcrypt");
const logger = require("../logger");
const { userByToken, generateToken } = require("../middleware/authMiddleware");
const User = require("../models/userModel");
const { CURRENTTIMEZONE } = require("../utils/common.js");

// POST creating a new user
const createUser = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.createUser");
    const {
      name,
      email,
      password,
      userRole,
      schoolId,
      studentClass,
      parentName,
      parentNumber,
      section,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt of 10 rounds
    let user = new User({
      name,
      email,
      password: hashedPassword,
      userRole,
      schoolId,
      studentClass,
      section,
      parentName,
      parentNumber,
      resetToken: undefined,
      resetTokenExpiry: undefined,
      timeZone: await CURRENTTIMEZONE(),
    });
    await user.save();

    user = user.toObject();

    const jwtToken = generateToken(user, next);
    user.jwtToken = jwtToken;

    logger.log("info", "Exit: try: userController.createUser");

    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.createUser");
    next(error);
  }
};

// GET fetching all users
const getAllUsers = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.getUserById");
    await userByToken(req, next); // token validation
    const user = await User.find().select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    logger.log("info", "Exit: try: userController.getUserById");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "User Detail",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.getUserById");
    next(error);
  }
};

// GET specific user via token
const getUserById = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.getUserById");
    const userDetail = await userByToken(req, next);

    const user = await User.findById(userDetail._id).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    logger.log("info", "Exit: try: userController.getUserById");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "User Detail",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.getUserById");
    next(error);
  }
};

// PUT updating a specific user
const updateUserById = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.getUserById");
    const userDetail = await userByToken(req, next);

    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      userDetail._id, // user id
      { name, email }, // data for updation
      { new: true } //ensures that the updated user is returned as the response
    );

    if (!user) {
      throw new Error("User not found");
    }
    logger.log("info", "Exit: try: userController.getUserById");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "User Detail",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.getUserById");
    next(error);
  }
};

// DELETE deleting a specific user
const deleteUserById = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.getUserById");
    const { userId } = req.headers.userId;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found");
    }
    logger.log("info", "Exit: try: userController.getUserById");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.getUserById");
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
