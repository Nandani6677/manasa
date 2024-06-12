// middlewares/userValidation.js
const { body, validationResult } = require("express-validator");
const User = require("../models/userModel");

const updateValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value, { req }) => {
      // Check if email already exists in the database
      const user = await User.findOne({
        email: value,
        _id: { $nin: [req.session.user._id] },
      });
      if (user) {
        throw new Error("Email already exists");
      }
    }),
  // body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (value) => {
      // Check if email already exists in the database
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const forgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

const loginValidation = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidationRules,
  updateValidationRules,
  forgotPassword,
  loginValidation,
  validation,
};
