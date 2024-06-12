const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validate = require("../middleware/validationMiddleware");
const errorHandler = require("../middleware/errorMiddleware");

// validation middleware
const validation = validate.validation;
const loginValidation = validate.loginValidation;
const forgotPassword = validate.forgotPassword;

// Define your routes and attach the appropriate controller method

//POST route for login
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: User's email
 *       - in: formData
 *         name: password
 *         required: true
 *         type: string
 *         description: User's password
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json
 *       '401':
 *         description: Unauthorized. Invalid credentials.
 *       '500':
 *         description: Internal server error.
 */
router.post("/login", loginValidation, validation, authController.login);

// POST route for forgot password via email
/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     tags: [User]
 *     parameters:
 *       - in: formData
 *         name: email
 *         required: true
 *         type: string
 *         description: User's email
 *     responses:
 *       '200':
 *         description: Successful login
 *         content:
 *           application/json
 *       '401':
 *         description: Unauthorized. Invalid credentials.
 *       '500':
 *         description: Internal server error.
 */
router.post(
  "/forgot-password",
  forgotPassword,
  validation,
  authController.forgotPassword
);

router.use(errorHandler);

module.exports = router;
