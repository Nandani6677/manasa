const logger = require("../logger");
const { userByToken } = require("../middleware/authMiddleware");
const School = require("../models/schoolModel");

// GET fetching all users
const getAllSchool = async (req, res, next) => {
  try {
    logger.log("info", "Enter: try: userController.getUserById");
    // await userByToken(req, next); // token validation
    const school = await School.find();
    if (!school) {
      throw new Error("School not found");
    }
    logger.log("info", "Exit: try: userController.getUserById");
    res.status(res.statusCode).json({
      status: res.statusCode,
      message: "School Detail",
      data: school,
    });
  } catch (error) {
    logger.log("info", "Enter: catch: userController.getUserById");
    next(error);
  }
};

module.exports = {
  getAllSchool,
};
